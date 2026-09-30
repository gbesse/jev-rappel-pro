// Cas limite : deux identifiants produits différents bloquent le rapprochement sémantique.
import assert from "node:assert/strict";
import { assessRecall } from "../src/index.mjs";
import { createFakeProvider } from "../src/jev.mjs";

const jev = createFakeProvider(() => {
  throw new Error("Jev ne doit pas être appelé");
});
const resultat = await assessRecall(
  { sku: "CAF-250", name: "Café moulu 250 g", gtin: "12345670" },
  {
    id: "RC-2",
    title: "Café moulu 250 g",
    gtin: "87654325",
    publishedAt: "2026-09-25",
    sourceUrl: "https://rappel.conso.gouv.fr/",
  },
  jev,
);
assert.equal(resultat.relation, "different_gtin");
assert.equal(jev.calls, 0);
console.log(JSON.stringify(resultat, null, 2));
