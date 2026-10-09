import { describe, expect, it } from "vitest";
import { getListenEntries } from "@/data/listenCatalog";
import type { LemosPlayConfig } from "@/data/lemosPlayConfig";

const config: LemosPlayConfig = {
  filmes: [],
  series: [],
  musicas: [
    { id: "music-on", title: "Música ativa", src: "/ativa.mp4" },
    { id: "music-off", title: "Música desativada", src: "/desativada.mp4", enabled: false },
  ],
  louvores: [
    { id: "praise-on", title: "Louvor ativo", src: "/louvor.mp4", enabled: true },
    { id: "praise-off", title: "Louvor desativado", src: "/oculto.mp4", enabled: false },
  ],
};

describe("catálogo da página Ouça", () => {
  it("mostra somente as músicas habilitadas nas Configurações", () => {
    expect(getListenEntries(config, "musicas").map((item) => item.id)).toEqual(["music-on"]);
  });

  it("mostra somente os louvores habilitados nas Configurações", () => {
    expect(getListenEntries(config, "louvores").map((item) => item.id)).toEqual(["praise-on"]);
  });
});
