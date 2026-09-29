// Objectif : démontrer la frontière de décision sans appel réseau.
import assert from "node:assert/strict";
import { assessRecall } from "../src/index.mjs";
const product = {
  sku: "CAF-250",
  name: "Café moulu Arabica 250 g",
  brand: "Maison Exemple",
  gtin: "3760000000017",
};
const recall = {
  id: "RC-2026-001",
  title: "Café moulu Arabica 250 g",
  brand: "Maison Exemple",
  gtin: "3760000000017",
  publishedAt: "2026-09-25",
  sourceUrl: "https://rappel.conso.gouv.fr/",
  risk: "Exemple synthétique",
};
const resultat = await assessRecall(product, recall);
assert.equal(resultat.relation, "exact_gtin");
console.log(JSON.stringify(resultat, null, 2));
