// Objectif : implémenter la frontière de décision métier propre au dépôt.
export const FALLBACK_RELATIONS = ["likely_same_product", "possible_match", "unrelated"];
export function normalizeGtin(value) {
  if (value == null || value === "") return null;
  const raw = String(value).trim();
  if (!raw) return null;
  if (!/^[0-9 -]+$/.test(raw)) throw new TypeError("GTIN may contain only digits, spaces and hyphens");
  const digits = raw.replace(/[ -]/g, "");
  if (![8, 12, 13, 14].includes(digits.length)) throw new TypeError("GTIN must contain 8, 12, 13 or 14 digits");
  let sum = 0;
  for (let index = digits.length - 2, weight = 3; index >= 0; index -= 1, weight = weight === 3 ? 1 : 3)
    sum += Number(digits[index]) * weight;
  if ((10 - sum % 10) % 10 !== Number(digits.at(-1)))
    throw new TypeError("GTIN has an invalid check digit");
  return digits.padStart(14, "0");
}
export function catalogProduct(input) {
  if (!input?.sku || !input?.name) throw new TypeError("A product needs sku and name");
  return { sku: String(input.sku), name: String(input.name).trim(), brand: String(input.brand || ""),
    category: String(input.category || ""), gtin: normalizeGtin(input.gtin) };
}
export function recallRecord(input) {
  if (!input?.id || !input?.title || !input?.sourceUrl || !input?.publishedAt)
    throw new TypeError("A recall needs id, title, sourceUrl and publishedAt");
  const date = new Date(input.publishedAt);
  if (Number.isNaN(date.valueOf())) throw new TypeError("publishedAt must be an ISO date");
  return { id: String(input.id), title: String(input.title).trim(), brand: String(input.brand || ""),
    category: String(input.category || ""), gtin: normalizeGtin(input.gtin), sourceUrl: String(input.sourceUrl),
    publishedAt: date.toISOString(), risk: String(input.risk || "") };
}
export async function assessRecall(productInput, recallInput, provider) {
  const product = catalogProduct(productInput); const recall = recallRecord(recallInput);
  if (product.gtin && recall.gtin)
    return product.gtin === recall.gtin
      ? { relation: "exact_gtin", probability: 1, review: false, deterministic: true, product, recall }
      : { relation: "different_gtin", probability: 1, review: false, deterministic: true, product, recall };
  const response = await provider.decide({ state: { product, recall }, questions: { relation: {
    type: "choice",
    instructions: "Compare only product identity. likely_same_product requires strongly aligned name, brand and variant; uncertainty is possible_match. Never infer product safety.",
    criteria: { likely_same_product: "Same recalled product despite a missing GTIN", possible_match: "Some identity evidence but manual verification is required", unrelated: "Clearly a different product" },
  } } });
  const answer = response.answers.relation;
  return { relation: answer.choice, probability: answer.probabilities[answer.choice], confidence: answer.confidence,
    review: answer.choice !== "unrelated" || answer.confidence < .9, deterministic: false, product, recall, usage: response.usage };
}
export async function screenCatalog(products, recalls, provider) {
  const results = [];
  for (const product of products) for (const recall of recalls) {
    const result = await assessRecall(product, recall, provider);
    if (!['different_gtin'].includes(result.relation)) results.push(result);
  }
  return results;
}
