export const LIVE_REFRESH_MS = 8_000;

/**
 * Database-backed polling remains reliable when local development or deployed
 * instances scale independently; it avoids coupling updates to server memory.
 */
export const liveQueryOptions = {
  refetchInterval: LIVE_REFRESH_MS,
  refetchIntervalInBackground: true,
  refetchOnWindowFocus: true,
  staleTime: 0,
} as const;

export const postMutationRefreshTargets = ["community.list", "community.mine", "matching.rankForPost", "matching.forPost"] as const;

export type PostCreationRefreshActions = {
  refreshBoard: () => Promise<unknown>;
  refreshProfile: () => Promise<unknown>;
  refreshDetail: (postId: number) => Promise<unknown>;
  refreshCandidates: () => Promise<unknown>;
  refreshMatches: () => Promise<unknown>;
};

export async function refreshAfterPostCreation(actions: PostCreationRefreshActions, postId: number) {
  await Promise.all([
    actions.refreshBoard(),
    actions.refreshProfile(),
    actions.refreshDetail(postId),
    actions.refreshCandidates(),
    actions.refreshMatches(),
  ]);
}

export type MatchStatusRefreshActions = {
  refreshMatches: (postId: number) => Promise<unknown>;
  refreshCandidates: (postId: number) => Promise<unknown>;
  refreshDetail: (postId: number) => Promise<unknown>;
};

export async function refreshAfterMatchStatusChange(actions: MatchStatusRefreshActions, postId: number) {
  await Promise.all([actions.refreshMatches(postId), actions.refreshCandidates(postId), actions.refreshDetail(postId)]);
}
