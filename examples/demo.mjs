import { assessRecall } from "../src/index.mjs";
const product = { sku:"CAF-250", name:"Café moulu Arabica 250 g", brand:"Maison Exemple", gtin:"3760000000012" };
const recall = { id:"RC-2026-001", title:"Café moulu Arabica 250 g", brand:"Maison Exemple", gtin:"3760000000012", publishedAt:"2026-09-25", sourceUrl:"https://rappel.conso.gouv.fr/", risk:"Synthetic fixture" };
console.log(JSON.stringify(await assessRecall(product, recall), null, 2));
