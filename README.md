# Jev Rappel Pro

**Compare des catalogues produits aux rappels RappelConso avec GTIN exact et repli sémantique contrôlé.**

[![Tests](https://github.com/gbesse/jev-rappel-pro/actions/workflows/test.yml/badge.svg)](https://github.com/gbesse/jev-rappel-pro/actions/workflows/test.yml) [MIT](LICENSE) · Node.js 22+ · v0.1.3 · Documentation française

Le moteur repère immédiatement les correspondances ou incompatibilités de GTIN. Lorsque l’un des identifiants manque, Jev compare le nom, la marque et la variante afin de produire un cas de revue.

## Démarrage rapide

```sh
git clone https://github.com/gbesse/jev-rappel-pro.git
cd jev-rappel-pro
npm install
npm run demo
```

La démonstration utilise uniquement des données et probabilités synthétiques. Elle n’effectue aucun appel réseau et ne constitue pas une mesure de qualité de Jev.

## Exemple exécutable

Cet exemple détecte un rappel produit par correspondance exacte du GTIN. Il utilise un fournisseur Jev simulé : aucune clé API ni connexion réseau n’est nécessaire. L’assertion intégrée fait échouer la commande si le comportement attendu change.

Le code complet de [`examples/demo.mjs`](examples/demo.mjs) est directement copiable :

```js
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
```

Lancez-le avec :

```sh
npm run demo:principal
```

Résultat à repérer : `relation: exact_gtin`.

### Cas limite à tester

Deux GTIN valides et différents excluent immédiatement la correspondance. Le code se trouve dans [`examples/cas-limite.mjs`](examples/cas-limite.mjs).

```sh
npm run demo:limite
```

Résultat à repérer : `relation: different_gtin · appels Jev: 0`. La commande `npm run demo` exécute les deux exemples.

## Utilisation de la bibliothèque

Importez les fonctions métier depuis `@gbesse/jev-rappel-pro`. Fournissez soit `createJevClient()` depuis l’export `./jev`, soit `createFakeProvider()` pour les tests hors ligne.

Les noms de l’API JavaScript restent stables pour préserver la compatibilité avec les versions précédentes. La documentation, les exemples et les explications destinées aux utilisateurs sont en français.

## Frontière de décision

L’égalité et l’inégalité des GTIN sont résolues dans le code. Jev n’est appelé que lorsqu’au moins un GTIN manque. Toute correspondance sémantique positive reste à vérifier.

La question exacte envoyée à Jev est versionnée dans [`src/index.mjs`](src/index.mjs). Les identifiants, dates, calculs, filtres, seuils et transitions d’état restent gérés par du code ordinaire.

## Sources

- [https://www.data.gouv.fr/datasets/rappelconso-v2-produits-tries-par-gtin](https://www.data.gouv.fr/datasets/rappelconso-v2-produits-tries-par-gtin)

Conservez l’attribution amont, les identifiants d’origine, les URL de source et les dates de récupération avec chaque enregistrement dérivé.

## Appels Jev réels

Les appels réels sont facultatifs et payants. Le client fixe le modèle `jev-1.13.0`, valide l’identité du modèle et toutes les probabilités, refuse les redirections, ne retente que les erreurs réseau et les réponses HTTP 429/529, puis bloque les requêtes dépassant une estimation prudente de 24 000 jetons.

```sh
TYPESAFE_API_KEY=... node scripts/live-smoke.mjs
```

N’envoyez jamais de secret, de donnée personnelle ni de dossier sensible non expurgé. Évaluez le comportement sur un jeu représentatif de cas français avant tout usage opérationnel.

## Validation

```sh
npm run check
npm run typecheck
npm test
npm run demo
```

La CI exécute ces vérifications sous Node.js 22 et 24.

Projet indépendant, sans affiliation avec TypeSafe AI ni avec l’administration française. Consultez la [documentation de l’API Jev](https://docs.typesafe.ai/api) et les [limites du modèle](https://docs.typesafe.ai/model-jaggedness/jev-1.13).
