import { describe, expect, it } from "vitest";
import { describe, expect, it, vi } from "vitest";
import { LIVE_REFRESH_MS, liveQueryOptions, postMutationRefreshTargets, refreshAfterMatchStatusChange, refreshAfterPostCreation } from "../client/src/lib/liveData";

describe("live data configuration", () => {
  it("keeps active users on a short database-backed refresh interval", () => {
    expect(LIVE_REFRESH_MS).toBe(8_000);
    expect(liveQueryOptions.refetchInterval).toBe(LIVE_REFRESH_MS);
    expect(liveQueryOptions.refetchIntervalInBackground).toBe(true);
    expect(liveQueryOptions.refetchOnWindowFocus).toBe(true);
  });

  it("defines the query groups that must refresh after a community-post mutation", () => {
    expect(postMutationRefreshTargets).toEqual(["community.list", "community.mine", "matching.rankForPost", "matching.forPost"]);
  });

  it("invalidates every affected query after creating a post", async () => {
    const refreshBoard = vi.fn().mockResolvedValue(undefined);
    const refreshProfile = vi.fn().mockResolvedValue(undefined);
    const refreshDetail = vi.fn().mockResolvedValue(undefined);
    const refreshCandidates = vi.fn().mockResolvedValue(undefined);
    const refreshMatches = vi.fn().mockResolvedValue(undefined);

    await refreshAfterPostCreation({ refreshBoard, refreshProfile, refreshDetail, refreshCandidates, refreshMatches }, 17);

    expect(refreshBoard).toHaveBeenCalledOnce();
    expect(refreshProfile).toHaveBeenCalledOnce();
    expect(refreshDetail).toHaveBeenCalledWith(17);
    expect(refreshCandidates).toHaveBeenCalledOnce();
    expect(refreshMatches).toHaveBeenCalledOnce();
  });

  it("refreshes the match workspace after a status change", async () => {
    const refreshMatches = vi.fn().mockResolvedValue(undefined);
    const refreshCandidates = vi.fn().mockResolvedValue(undefined);
    const refreshDetail = vi.fn().mockResolvedValue(undefined);

    await refreshAfterMatchStatusChange({ refreshMatches, refreshCandidates, refreshDetail }, 29);

    expect(refreshMatches).toHaveBeenCalledWith(29);
    expect(refreshCandidates).toHaveBeenCalledWith(29);
    expect(refreshDetail).toHaveBeenCalledWith(29);
  });
});
