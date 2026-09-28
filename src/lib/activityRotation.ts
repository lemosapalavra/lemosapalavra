export type RotatingActivity = { id: string };

/** Keeps the word builder available daily and rotates the remaining slots one step per day. */
export function dailyActivities<T extends RotatingActivity>(pool: T[], day: number, limit = 5): T[] {
  if (pool.length <= limit) return pool;
  const pinned = pool.filter((activity) => activity.id === "wordbuilder");
  const rotatingPool = pool.filter((activity) => activity.id !== "wordbuilder");
  if (!rotatingPool.length) return pinned.slice(0, limit);
  const slots = Math.max(0, Math.min(limit - pinned.length, rotatingPool.length));
  const offset = ((day % rotatingPool.length) + rotatingPool.length) % rotatingPool.length;
  const rotating = Array.from({ length: slots }, (_, index) => rotatingPool[(offset + index) % rotatingPool.length]);
  return [...pinned, ...rotating].slice(0, limit);
}
