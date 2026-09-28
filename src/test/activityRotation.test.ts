import { describe, expect, it } from "vitest";
import { dailyActivities } from "@/lib/activityRotation";

const activities = [
  "quiz", "memory", "coloring", "jigsaw", "wordsearch", "edu:circles",
  "edu:connect", "maze", "crossword", "wordbuilder", "connectdots", "assemble",
].map((id) => ({ id }));

describe("rotação diária de atividades", () => {
  it("mostra cinco atividades e mantém o Construtor todos os dias do ano", () => {
    for (let day = 1; day <= 366; day += 1) {
      const shown = dailyActivities(activities, day);
      expect(shown).toHaveLength(5);
      expect(shown.some(({ id }) => id === "wordbuilder"), `dia ${day}`).toBe(true);
      expect(new Set(shown.map(({ id }) => id)).size, `dia ${day}`).toBe(5);
    }
  });

  it("alterna todas as atividades ao percorrer vários dias", () => {
    const seen = new Set<string>();
    for (let day = 1; day <= 31; day += 1) {
      dailyActivities(activities, day).forEach(({ id }) => seen.add(id));
    }
    expect([...seen].sort()).toEqual(activities.map(({ id }) => id).sort());
  });
});
