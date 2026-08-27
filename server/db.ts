import { desc, eq, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { helpMatches, helpPosts, InsertHelpPost, InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import { isValidMatchPair, MatchProfile, postStatusForMatch, scoreCompatibility } from "../shared/matching";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listHelpPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(helpPosts).orderBy(desc(helpPosts.createdAt));
}

export async function listHelpPostsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(helpPosts).where(eq(helpPosts.userId, userId)).orderBy(desc(helpPosts.createdAt));
}

export async function getHelpPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(helpPosts).where(eq(helpPosts.id, id)).limit(1);
  return result[0];
}

export async function createHelpPost(post: Omit<InsertHelpPost, "id" | "createdAt" | "updatedAt">) {
  const db = await getDb();
  if (!db) throw new Error("The community board is temporarily unavailable.");
  const result = await db.insert(helpPosts).values(post);
  return getHelpPostById(Number(result[0].insertId));
}

export async function getMatchesForPost(postId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(helpMatches).where(or(eq(helpMatches.requestId, postId), eq(helpMatches.offerId, postId)));
}

export async function getMatchSummariesForPost(postId: number) {
  const matches = await getMatchesForPost(postId);
  return Promise.all(matches.map(async match => {
    const counterpartId = match.requestId === postId ? match.offerId : match.requestId;
    return { ...match, counterpart: await getHelpPostById(counterpartId) };
  }));
}

export async function getHelpMatchById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(helpMatches).where(eq(helpMatches.id, id)).limit(1);
  return rows[0];
}

function toMatchProfile(post: Awaited<ReturnType<typeof getHelpPostById>>): MatchProfile {
  if (!post) throw new Error("The selected community post no longer exists.");
  let skills: string[] = [];
  try {
    const parsed = JSON.parse(post.skills);
    skills = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    skills = [];
  }
  return { category: post.category, skills, availability: post.availability, approximateArea: post.approximateArea, urgency: post.urgency, accessibilityNotes: post.accessibilityNotes };
}

export async function rankCandidatesForPost(postId: number) {
  const current = await getHelpPostById(postId);
  if (!current) throw new Error("The selected community post no longer exists.");
  const candidates = await listHelpPosts();
  return candidates
    .filter(candidate => candidate.id !== current.id && candidate.status === "open" && isValidMatchPair(current.kind === "request" ? current.kind : candidate.kind, current.kind === "request" ? candidate.kind : current.kind))
    .map(candidate => {
      const request = current.kind === "request" ? current : candidate;
      const offer = current.kind === "offer" ? current : candidate;
      return { candidate, ...scoreCompatibility(toMatchProfile(request), toMatchProfile(offer)) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export async function createHelpMatch(requestId: number, offerId: number, aiExplanation?: string | null) {
  const db = await getDb();
  if (!db) throw new Error("Matching is temporarily unavailable.");
  const [request, offer] = await Promise.all([getHelpPostById(requestId), getHelpPostById(offerId)]);
  if (!request || !offer) throw new Error("Both sides of a match must still be available.");
  if (!isValidMatchPair(request.kind, offer.kind)) throw new Error("A match must pair one help request with one volunteer offer.");
  const compatibility = scoreCompatibility(toMatchProfile(request), toMatchProfile(offer));
  const result = await db.insert(helpMatches).values({ requestId, offerId, compatibilityScore: compatibility.score, reasons: JSON.stringify(compatibility.reasons), aiExplanation: aiExplanation || null, status: "proposed" });
  const rows = await db.select().from(helpMatches).where(eq(helpMatches.id, Number(result[0].insertId))).limit(1);
  return rows[0];
}

export async function updateHelpMatchStatus(id: number, status: "proposed" | "matched" | "completed" | "declined") {
  const db = await getDb();
  if (!db) throw new Error("Match updates are temporarily unavailable.");
  const match = await getHelpMatchById(id);
  if (!match) throw new Error("This match is no longer available.");
  await db.transaction(async tx => {
    await tx.update(helpMatches).set({ status }).where(eq(helpMatches.id, id));
    const postStatus = postStatusForMatch(status);
    if (postStatus) {
      await tx.update(helpPosts).set({ status: postStatus }).where(or(eq(helpPosts.id, match.requestId), eq(helpPosts.id, match.offerId)));
    }
  });
  return getHelpMatchById(id);
}
