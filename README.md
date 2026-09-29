# Jev Rappel Pro

**Screen product catalogs against French RappelConso recalls with exact GTIN matching and reviewable semantic fallbacks.**

[![Tests](https://github.com/gbesse/jev-rappel-pro/actions/workflows/test.yml/badge.svg)](https://github.com/gbesse/jev-rappel-pro/actions/workflows/test.yml) [MIT](LICENSE) · Node.js 22+ · Public alpha

## Try it

```sh
git clone https://github.com/gbesse/jev-rappel-pro.git
cd jev-rappel-pro
npm install
npm run demo
```

The demo uses synthetic records and fixture probabilities. It makes no network call and makes no claim about measured Jev quality.

## Use the library

Import the domain functions from `@gbesse/jev-rappel-pro` and provide either `createJevClient()` from the `./jev` export or the offline `createFakeProvider()` test double. The complete runnable path is in `examples/demo.mjs`.

## Decision boundary

GTIN-8/12/13/14 values must pass the GS1 check-digit test before exact equality or inequality is resolved in code. Spaces and hyphens are accepted as display separators; malformed identifiers are rejected instead of being treated as exact matches. Jev is called only when at least one GTIN is absent, and every non-unrelated fallback remains a review item. Check-digit validation detects some transcription errors; it does not verify that a GTIN was issued or that two records describe the same physical item.

## Data provenance

The official RappelConso V2 export is ordered by GTIN but explicitly omits products without a GTIN. Its schema and exports remain upstream inputs; this package does not mirror the dataset.

Official references:

- [https://www.data.gouv.fr/datasets/rappelconso-v2-produits-tries-par-gtin](https://www.data.gouv.fr/datasets/rappelconso-v2-produits-tries-par-gtin)

Keep upstream attribution, source URLs, retrieval dates and original identifiers with every derived record.

## Real Jev requests

Real requests are opt-in, paid, and sent to `https://api.typesafe.ai/v1/systemone`. The client pins `jev-1.13.0`, validates the returned model and all probabilities, rejects redirects, retries only network failures plus HTTP 429/529, and refuses state above a conservative 24,000-token estimate.

```sh
TYPESAFE_API_KEY=... node scripts/live-smoke.mjs
```

Never send personal data, secrets, or full unredacted case files. Evaluate representative French labels before operational use.

## Validation

`npm run validate` runs syntax checks, strict public-type checks, tests, and the offline demo on Node.js 22 and 24 in CI.

Independent project; not affiliated with TypeSafe AI or the French administration. See the [Jev API documentation](https://docs.typesafe.ai/api) and [model limitations](https://docs.typesafe.ai/model-jaggedness/jev-1.13).
