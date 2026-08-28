/**
 * Natural-Language Shopping Query Parser for /api/ai-search.
 */

const CATEGORY_SYNONYMS = {
  Electronics: [
    'laptop', 'notebook', 'macbook', 'pc', 'computer', 'electronics', 'gadget', 'device',
    'phone', 'smartphone', 'mobile', 'tv', 'television', 'camera', 'dslr',
    'speaker', 'audio', 'earbuds', 'headphone', 'headphones', 'router', 'mouse',
    'keyboard', 'tablet', 'ipad', 'projector', 'ssd', 'watch', 'smartwatch'
  ],
  Fashion: [
    'fashion', 'clothing', 'wear', 'shoes', 'sneakers', 'jacket', 'dress',
    'wallet', 'hoodie', 'chinos', 'tote', 'backpack', 'sunglasses', 'shorts', 'watch'
  ],
  Home: [
    'home', 'kitchen', 'furniture', 'chair', 'purifier', 'fan', 'lamp', 'pillow',
    'skillet', 'cookware', 'diffuser', 'frother', 'scale', 'knife', 'towels', 'bottle'
  ]
};

const SUBCATEGORIES = [
  'laptop', 'phone', 'smartphone', 'headphones', 'earbuds', 'watch', 'smartwatch',
  'camera', 'tv', 'speaker', 'router', 'keyboard', 'mouse', 'tablet', 'ssd',
  'jacket', 'shoes', 'sneakers', 'wallet', 'backpack', 'hoodie', 'chinos', 'shorts',
  'chair', 'purifier', 'cookware', 'coffee maker', 'pillow', 'lamp', 'fan', 'bottle',
  'diffuser', 'frother', 'scale', 'knife', 'towels'
];

const INTENT_PATTERNS = {
  CHEAPEST: /(cheapest|lowest price|budget friendly|most affordable|economical)/i,
  BEST: /(best|top rated|highest rated|premium|popular|greatest|top)/i,
  BATTERY: /(battery|backup|mah|long lasting|all day battery)/i,
  CAMERA: /(camera|photo|photography|lens|mp|megapixel)/i,
  PERFORMANCE: /(performance|fast|speed|programming|gaming|multitasking|ram|ssd|i5|i7|processor)/i,
  LIGHTWEIGHT: /(lightweight|light weight|portable|compact|slim|easy to carry)/i
};

function extractPriceCeiling(text) {
  // Requires price context keywords OR currency indicators
  const match = text.match(/(?:under|below|less than|within|upto|up to|budget of|<=?)\s*(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d+)?)\s*(k|thousand|lakh|lac)?\b/i) ||
                text.match(/(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d+)?)\s*(k|thousand|lakh|lac)?\b/i);

  if (!match) return null;

  let val = parseFloat(match[1].replace(/,/g, ''));
  const unit = (match[2] || '').toLowerCase();

  if (unit === 'k' || unit === 'thousand') {
    val *= 1000;
  } else if (unit === 'lakh' || unit === 'lac') {
    val *= 100000;
  }

  return val > 100 ? Math.round(val) : null;
}

function extractPriceFloor(text) {
  const match = text.match(/(?:above|over|more than|starting from|>=?)\s*(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d+)?)\s*(k|thousand|lakh|lac)?\b/i);

  if (!match) return null;

  let val = parseFloat(match[1].replace(/,/g, ''));
  const unit = (match[2] || '').toLowerCase();

  if (unit === 'k' || unit === 'thousand') val *= 1000;
  else if (unit === 'lakh' || unit === 'lac') val *= 100000;

  return val > 100 ? Math.round(val) : null;
}

function extractCategory(text) {
  for (const [category, keywords] of Object.entries(CATEGORY_SYNONYMS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      return category;
    }
  }
  return null;
}

function extractSubcategory(text) {
  return SUBCATEGORIES.find((sc) => text.includes(sc)) || null;
}

function extractFeatureKeywords(text) {
  const features = [];
  if (INTENT_PATTERNS.BATTERY.test(text)) features.push('battery');
  if (INTENT_PATTERNS.CAMERA.test(text)) features.push('camera');
  if (INTENT_PATTERNS.PERFORMANCE.test(text)) features.push('performance');
  if (INTENT_PATTERNS.LIGHTWEIGHT.test(text)) features.push('lightweight');
  return features;
}

function parseQuery(rawQuery = '', context = {}) {
  const text = rawQuery.toLowerCase().trim();

  return {
    raw: rawQuery,
    category: extractCategory(text) || context.lastCategory || null,
    subcategory: extractSubcategory(text) || context.lastSubcategory || null,
    maxPrice: extractPriceCeiling(text) || context.lastMaxPrice || null,
    minPrice: extractPriceFloor(text) || null,
    featureKeywords: extractFeatureKeywords(text),
    wantsBest: INTENT_PATTERNS.BEST.test(text),
    wantsCheapest: INTENT_PATTERNS.CHEAPEST.test(text),
    freeText: text
  };
}

function applyFilters(products, parsed) {
  let results = [...products];
  let anyFilterApplied = false;

  // 1. Category Filter
  if (parsed.category) {
    results = results.filter((p) => p.category?.toLowerCase() === parsed.category.toLowerCase());
    anyFilterApplied = true;
  }

  // 2. Subcategory Match
  if (parsed.subcategory) {
    const subFiltered = results.filter((p) =>
      p.name?.toLowerCase().includes(parsed.subcategory) ||
      p.description?.toLowerCase().includes(parsed.subcategory) ||
      p.specs?.toLowerCase().includes(parsed.subcategory)
    );
    if (subFiltered.length > 0) {
      results = subFiltered;
      anyFilterApplied = true;
    }
  }

  // 3. Price Range
  if (parsed.maxPrice != null) {
    results = results.filter((p) => Number(p.price) <= parsed.maxPrice);
    anyFilterApplied = true;
  }

  if (parsed.minPrice != null) {
    results = results.filter((p) => Number(p.price) >= parsed.minPrice);
    anyFilterApplied = true;
  }

  // 4. Feature Keyword Matches
  if (parsed.featureKeywords.includes('battery')) {
    const batteryMatches = results.filter((p) =>
      p.battery === 'Excellent' ||
      p.battery === 'Great' ||
      (p.specs || '').toLowerCase().includes('mah') ||
      (p.specs || '').toLowerCase().includes('battery') ||
      (p.description || '').toLowerCase().includes('battery')
    );
    if (batteryMatches.length > 0) results = batteryMatches;
    anyFilterApplied = true;
  }

  if (parsed.featureKeywords.includes('camera')) {
    const cameraMatches = results.filter((p) =>
      (p.features || []).includes('camera') ||
      (p.specs || '').toLowerCase().includes('mp') ||
      (p.name || '').toLowerCase().includes('camera') ||
      (p.name || '').toLowerCase().includes('webcam')
    );
    if (cameraMatches.length > 0) results = cameraMatches;
    anyFilterApplied = true;
  }

  if (parsed.featureKeywords.includes('lightweight')) {
    const lightweightMatches = results.filter((p) =>
      (p.features || []).includes('lightweight') ||
      (p.specs || '').toLowerCase().includes('lightweight') ||
      (p.specs || '').toLowerCase().includes('slim')
    );
    if (lightweightMatches.length > 0) results = lightweightMatches;
    anyFilterApplied = true;
  }

  // 5. Fallback Search
  if (!anyFilterApplied) {
    const term = parsed.freeText;
    results = results.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.specs?.toLowerCase().includes(term)
    );
  }

  // 6. Scoring & Ranking
  results = results.map((product) => {
    let score = (product.rating || 4.0) * 10;

    if (product.isPopular) score += 15;

    parsed.featureKeywords.forEach((f) => {
      if ((product.features || []).includes(f)) score += 20;
    });

    if (parsed.wantsCheapest && parsed.maxPrice) {
      score += ((parsed.maxPrice - product.price) / parsed.maxPrice) * 30;
    }

    return { ...product, matchScore: score };
  });

  results.sort((a, b) => {
    if (parsed.wantsCheapest) return a.price - b.price;
    return b.matchScore - a.matchScore;
  });

  return results;
}

module.exports = { parseQuery, applyFilters };