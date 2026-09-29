import test from "node:test"; import assert from "node:assert/strict";
import { normalizeGtin, assessRecall } from "../src/index.mjs"; import { createFakeProvider } from "../src/jev.mjs";
const recall = { id:"r1", title:"Toy blue", sourceUrl:"https://rappel.conso.gouv.fr", publishedAt:"2026-01-01", gtin:"12345670" };
test("normalizes valid GTIN forms", () => assert.equal(normalizeGtin("1234 5670"), "00000012345670"));
test("rejects invalid GTIN length", () => assert.throws(() => normalizeGtin("123"), /GTIN/));
test("rejects invalid check digits before exact matching", async () => {
  const provider = createFakeProvider(() => { throw Error("must not run"); });
  await assert.rejects(assessRecall({sku:"s",name:"Toy",gtin:"12345678"},recall,provider), /check digit/);
  assert.equal(provider.calls, 0);
});
test("rejects letters instead of silently stripping them", () => assert.throws(() => normalizeGtin("x12345670"), /GTIN/));
test("accepts absent GTINs for semantic review", () => assert.equal(normalizeGtin(null), null));
test("exact GTIN bypasses Jev", async () => { const p=createFakeProvider(()=>{throw Error("must not run")});
  const result=await assessRecall({sku:"s",name:"Toy",gtin:"12345670"},recall,p);
  assert.equal(result.relation,"exact_gtin"); assert.equal(p.calls,0); });
test("different GTIN bypasses Jev", async () => { const result=await assessRecall({sku:"s",name:"Toy",gtin:"87654325"},recall);
  assert.equal(result.relation,"different_gtin"); });
test("missing identifier uses bounded semantic review", async () => { const p=createFakeProvider(()=>({model:"jev-1.13.0",answers:{relation:{type:"choice",choice:"possible_match",probabilities:{likely_same_product:.1,possible_match:.8,unrelated:.1},confidence:.8}},usage:{input_tokens:20,output_tokens:0}}));
  const result=await assessRecall({sku:"s",name:"Toy blue"},{...recall,gtin:null},p); assert.equal(result.review,true); assert.equal(p.calls,1); });
