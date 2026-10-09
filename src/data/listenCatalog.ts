import type { LemosPlayConfig, PlayEntry } from "@/data/lemosPlayConfig";

export type ListenCategory = "musicas" | "louvores";

/** Ouça shares the media catalog configured for Veja, while respecting each item's switch. */
export function getListenEntries(config: LemosPlayConfig, category: ListenCategory): PlayEntry[] {
  return config[category].filter((entry) => entry.enabled !== false);
}
