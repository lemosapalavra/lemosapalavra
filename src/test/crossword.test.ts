import { describe, expect, it } from "vitest";
import { __crosswordPuzzles, crosswordKeywordFromGrid } from "@/pages/Atividades";

describe("cruzadinha bíblica", () => {
  it("a coluna destacada forma exatamente a palavra-chave de cada cruzadinha", () => {
    for (const p of __crosswordPuzzles) {
      expect(crosswordKeywordFromGrid(p)).toBe(p.keyword);
    }
  });

  it("toda palavra cruza a coluna destacada", () => {
    for (const p of __crosswordPuzzles) {
      for (const w of p.words) {
        const i = p.keyCol - w.col;
        expect(i, `${p.keyword}/${w.answer}`).toBeGreaterThanOrEqual(0);
        expect(i, `${p.keyword}/${w.answer}`).toBeLessThan(w.answer.length);
      }
    }
  });
});
