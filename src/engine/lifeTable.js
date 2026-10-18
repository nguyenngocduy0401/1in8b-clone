// Mathematical Demographic Engine reverse-engineered from 1in8b.life
// Implements exact UN Life Tables with binary search Gompertz-Makeham calibration
// and World Bank log-normal income distribution models.

// Inverse Standard Normal Cumulative Distribution Function (Acklam's algorithm)
export function invNorm(p) {
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.07784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];

  const q = p - 0.5;
  if (Math.abs(q) <= 0.425) {
    const r = 0.180625 - q * q;
    return q * (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  const r = q < 0 ? p : 1 - p;
  const s = Math.sqrt(-Math.log(r));
  const x = (((((c[0] * s + c[1]) * s + c[2]) * s + c[3]) * s + c[4]) * s + c[5]) /
    ((((d[0] * s + d[1]) * s + d[2]) * s + d[3]) * s + 1);
  return q < 0 ? -x : x;
}

// Standard Normal Cumulative Distribution Function (Abramowitz and Stegun)
export function normCdf(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}

const OLDEST = (x, sex) => Math.min(0.7, (sex === 'F' ? 0.39 : 0.5) * Math.exp(0.15 * (x - 100)));

const LT_CACHE = new Map();

/**
 * Build authentic UN Life Table cohort survival l(x) and mortality q(x)
 * @param {object} country Country demographic object with le, im, u5, gap
 * @param {string} sex 'M' | 'F'
 */
export function lifeTable(country, sex = 'M') {
  const key = `${country.id}_${sex}_${country.yr || ''}`;
  if (LT_CACHE.has(key)) return LT_CACHE.get(key);

  const gap = country.gap || 4.5;
  const e0 = sex === 'F' ? country.le + gap * 0.49 : country.le - gap * 0.51;
  const k = sex === 'F' ? 0.92 : 1.08;
  const q0 = Math.min(0.25, (country.im || 15) / 1000 * k);
  const u5 = Math.min(0.35, Math.max(q0 + 0.0005, (country.u5 || 25) / 1000 * k));
  const H = -Math.log((1 - u5) / (1 - q0));
  const qc = [0.4, 0.27, 0.19, 0.14].map((w) => 1 - Math.exp(-H * w));
  const A = 0.00025 + 0.000028 * (country.u5 || 25);
  const g = Math.min(Math.max(0.112 - 0.00016 * (country.u5 || 25), 0.085), 0.112);
  const q514 = 1 - Math.pow(1 - Math.min(0.2, 0.2 * (country.u5 || 25) / 1000 * k), 0.1);

  const build = (B) => {
    const q = new Float64Array(111);
    q[0] = q0;
    for (let i = 1; i <= 4; i++) q[i] = qc[i - 1];
    for (let x = 5; x <= 110; x++) {
      q[x] = x === 110 ? 1 : x < 15 ? q514 : Math.min(1, 1 - Math.exp(-Math.max(A + B * Math.exp(g * (x + 0.5)), OLDEST(x, sex))));
    }
    let l = 1, e = 0;
    for (let x = 0; x <= 110; x++) {
      const d = l * q[x];
      e += x === 0 ? l - 0.85 * d : l - 0.5 * d;
      l -= d;
    }
    return { q, e };
  };

  let lo = Math.log(1e-8), hi = Math.log(5e-2), r;
  for (let i = 0; i < 50; i++) {
    const m = (lo + hi) / 2;
    r = build(Math.exp(m));
    if (r.e > e0) lo = m; else hi = m;
  }
  const l = new Float64Array(112);
  l[0] = 1;
  for (let x = 0; x <= 110; x++) l[x + 1] = l[x] * (1 - r.q[x]);

  const result = { q: r.q, l, e0 };
  LT_CACHE.set(key, result);
  return result;
}

/**
 * Returns exact probability of surviving to age x (0.0 to 1.0)
 */
export function getSurvivalAtAge(country, sex, age) {
  const lt = lifeTable(country, sex);
  const clampedAge = Math.min(Math.max(Math.round(age), 0), 110);
  return lt.l[clampedAge];
}

/**
 * Calculate World Bank log-normal income sigma from country Gini
 */
export function sigmaOf(country) {
  let g = country.gi || 35;
  if (g > 1) g /= 100; // normalize percentage if needed
  if (['ssa', 'sa', 'mena'].includes(country.p) || (country.p === 'eap' && country.id !== 'CHN')) g += 0.07;
  g = Math.min(Math.max(g, 0.22), 0.68);
  return Math.SQRT2 * invNorm((g + 1) / 2);
}

/**
 * Calculate annual income (USD PPP) for an exact percentile pct (0.001 - 0.999)
 */
export function incomeAt(country, pct) {
  const s = sigmaOf(country);
  const ppp = country.ppp || 15000;
  const clampedPct = Math.min(Math.max(pct, 0.003), 0.997);
  return Math.round(ppp * 0.9 * Math.exp(s * invNorm(clampedPct) - (s * s) / 2));
}

/**
 * Calculate what percentile in the nation an income corresponds to (0.0 to 1.0)
 */
export function pctOfIncome(country, income) {
  const s = sigmaOf(country);
  const ppp = country.ppp || 15000;
  const mu = Math.log(ppp * 0.9) - (s * s) / 2;
  return normCdf((Math.log(Math.max(1, income)) - mu) / s);
}
