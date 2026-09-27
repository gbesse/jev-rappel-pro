import type { JevProvider } from "./jev.mjs";
export type Product = { sku:string; name:string; brand:string; category:string; gtin:string|null };
export type Recall = { id:string; title:string; brand:string; category:string; gtin:string|null; sourceUrl:string; publishedAt:string; risk:string };
export const FALLBACK_RELATIONS: readonly string[];
export function normalizeGtin(value: unknown): string|null;
export function catalogProduct(input:any): Product;
export function recallRecord(input:any): Recall;
export function assessRecall(product:any, recall:any, provider:JevProvider): Promise<any>;
export function screenCatalog(products:any[], recalls:any[], provider:JevProvider): Promise<any[]>;
