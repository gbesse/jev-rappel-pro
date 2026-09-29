# Comment la décision est prise

L’égalité et l’inégalité des GTIN sont résolues dans le code. Jev n’est appelé que lorsqu’au moins un GTIN manque. Toute correspondance sémantique positive reste à vérifier.

La question et les critères exacts sont versionnés dans [`src/index.mjs`](../src/index.mjs). Les probabilités de la démonstration sont synthétiques. Calibrez les seuils de revue sur des cas français annotés et représentatifs avant tout usage opérationnel.
