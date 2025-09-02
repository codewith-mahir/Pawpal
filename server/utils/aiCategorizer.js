// AI categorization with optional Azure Vision image analysis + text fallback.
// Configure via env:
//  AZURE_VISION_ENDPOINT=https://<your-resource>.cognitiveservices.azure.com
//  AZURE_VISION_KEY=<key>
//  (optional) AZURE_VISION_API_VERSION=2023-10-01
const fs = require('fs');
const path = require('path');

const TEXT_CATS = [
  { label: 'Dog', keys: ['dog', 'puppy', 'canine'] },
  { label: 'Cat', keys: ['cat', 'kitten', 'feline'] },
  { label: 'Bird', keys: ['bird', 'parrot', 'avian'] },
  { label: 'Rabbit', keys: ['rabbit', 'bunny'] },
  { label: 'Fish', keys: ['fish', 'goldfish', 'betta'] },
  { label: 'Reptile', keys: ['snake', 'lizard', 'turtle', 'reptile'] },
];

function categorizeText({ name = '', description = '' }) {
  const text = `${name} ${description}`.toLowerCase();
  for (const c of TEXT_CATS) {
    if (c.keys.some((k) => text.includes(k))) return { category: c.label };
  }
  return { category: 'Other' };
}

function detectBreedText({ name = '', description = '' }) {
  const text = `${name} ${description}`.toLowerCase();
  const breeds = [
    'labrador', 'golden retriever', 'german shepherd', 'poodle', 'bulldog',
    'siamese', 'persian', 'maine coon', 'ragdoll', 'bengal',
  ];
  for (const b of breeds) {
    if (text.includes(b)) return { breed: b };
  }
  return { breed: undefined };
}

async function analyzeAzureVision(imageAbsPath) {
  const endpoint = process.env.AZURE_VISION_ENDPOINT;
  const key = process.env.AZURE_VISION_KEY;
  if (!endpoint || !key) return null;
  try {
    // Prefer Image Analysis 4.0 endpoint if available
    const base = String(endpoint).replace(/\/$/, '');
    const apiVersion = process.env.AZURE_VISION_API_VERSION || '2023-10-01';
    // Fallback to Computer Vision v3.2 analyze if 4.0 path fails; we try 4.0 first
    const tryEndpoints = [
      `${base}/computervision/imageanalysis:analyze?api-version=${apiVersion}&features=tags,objects&model-version=latest&language=en`,
      `${base}/vision/v3.2/analyze?visualFeatures=Tags,Objects&language=en`,
    ];

    // Lazy fetch load: use global fetch if present, else try node-fetch if installed
    let fetchFn = global.fetch;
    if (!fetchFn) {
      try { fetchFn = (await import('node-fetch')).default; } catch (_) { fetchFn = null; }
    }
    if (!fetchFn) return null;

    const data = await fs.promises.readFile(imageAbsPath);
    let lastErr;
    for (const ep of tryEndpoints) {
      try {
        const resp = await fetchFn(ep, {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': key,
            'Content-Type': 'application/octet-stream',
          },
          body: data,
        });
        if (!resp.ok) { lastErr = new Error(`Azure Vision HTTP ${resp.status}`); continue; }
        const json = await resp.json();
        // Normalize outputs
        const tags = [];
        // Legacy (CV v3.x)
        if (Array.isArray(json.tags)) {
          for (const t of json.tags) if (t && t.name) tags.push(t.name.toLowerCase());
        }
        if (Array.isArray(json.objects)) {
          for (const o of json.objects) if (o && o.object) tags.push(String(o.object).toLowerCase());
        }
        // Image Analysis 4.0 (Vision v4.x)
        const v4Tags = json?.tagsResult?.values || json?.result?.tagsResult?.values;
        if (Array.isArray(v4Tags)) {
          for (const t of v4Tags) if (t && t.name) tags.push(String(t.name).toLowerCase());
        }
        const v4Objs = json?.objectsResult?.values || json?.result?.objectsResult?.values;
        if (Array.isArray(v4Objs)) {
          for (const o of v4Objs) {
            if (o?.tags && Array.isArray(o.tags)) {
              for (const tt of o.tags) tags.push(String(tt).toLowerCase());
            } else if (o?.name) {
              tags.push(String(o.name).toLowerCase());
            }
          }
        }
        return { tags: Array.from(new Set(tags)) };
      } catch (e) {
        lastErr = e;
      }
    }
    // Failed both endpoints
    return null;
  } catch (_) {
    return null;
  }
}

function decideCategoryFromTags(tags = []) {
  const set = new Set(tags.map((x) => x.toLowerCase()))
  for (const c of TEXT_CATS) {
    if (c.keys.some((k) => set.has(k))) return c.label;
  }
  return undefined;
}

module.exports = {
  // Main entry: returns { category, breed, tags? }
  async categorize({ name = '', description = '', imagePath } = {}) {
    const textCat = categorizeText({ name, description }).category;
    const { breed } = detectBreedText({ name, description });
    let imgTags;
    if (imagePath) {
      const abs = path.isAbsolute(imagePath) ? imagePath : path.resolve(process.cwd(), imagePath);
      const azure = await analyzeAzureVision(abs);
      imgTags = azure?.tags;
    }
    const imageCat = imgTags ? decideCategoryFromTags(imgTags) : undefined;
    const category = imageCat || textCat || 'Other';
    return { category, breed, tags: imgTags };
  }
};
