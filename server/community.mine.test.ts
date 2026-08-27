import { describe, expect, it, vi } from "vitest";

vi.mock("./db", async () => {
  const actual = await vi.importActual<typeof import("./db")>("./db");
  return { ...actual, listHelpPostsForUser: vi.fn() };
});

import { listHelpPostsForUser } from "./db";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const mockListHelpPostsForUser = vi.mocked(listHelpPostsForUser);

function createContext(userId: number): TrpcContext {
  return {
    user: {
      id: userId,
      openId: "profile-user",
      name: "Profile User",
      email: "profile@example.com",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("community.mine", () => {
  it("uses the signed-in user ID when retrieving private activity", async () => {
    mockListHelpPostsForUser.mockResolvedValue([]);
    const caller = appRouter.createCaller(createContext(42));

    await caller.community.mine();

    expect(mockListHelpPostsForUser).toHaveBeenCalledWith(42);
  });

  it("returns the signed-in user’s requests, offers, and completed post data intact", async () => {
    mockListHelpPostsForUser.mockResolvedValue([
      { id: 1, userId: 42, kind: "request", title: "Grocery help", description: "A complete request description", displayName: "Profile User", category: "groceries", urgency: "today", approximateArea: "Eastwood", skills: "[\"shopping\"]", availability: "Today", accessibilityNotes: null, status: "completed", createdAt: new Date("2026-08-20"), updatedAt: new Date("2026-08-20") },
      { id: 2, userId: 42, kind: "offer", title: "I can tutor algebra", description: "A complete volunteer offer description", displayName: "Profile User", category: "tutoring", urgency: "this_week", approximateArea: "Riverside", skills: "[\"algebra\"]", availability: "Wednesday", accessibilityNotes: null, status: "open", createdAt: new Date("2026-08-21"), updatedAt: new Date("2026-08-21") },
    ]);
    const caller = appRouter.createCaller(createContext(42));

    const activity = await caller.community.mine();

    expect(activity).toHaveLength(2);
    expect(activity.map(post => [post.kind, post.status])).toEqual([["request", "completed"], ["offer", "open"]]);
    expect(activity.every(post => post.userId === 42)).toBe(true);
  });
});
