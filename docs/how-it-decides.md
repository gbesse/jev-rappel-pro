# How it decides

Exact GTIN equality and inequality are resolved in code. Jev is called only when at least one GTIN is absent, and every non-unrelated fallback remains a review item.

The exact questions and criteria are versioned beside the call in [src/index.mjs](../src/index.mjs). Synthetic demo probabilities are illustrative. Calibrate thresholds on representative human labels before operational use.
