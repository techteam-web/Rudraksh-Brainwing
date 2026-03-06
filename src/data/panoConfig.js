/**
 * panoConfig.js — Single source of truth for all panorama data.
 *
 * ADDING A NEW SCENE:
 *   1. Drop tiles + preview.jpg into the correct folder under public/assets/<bhk>/pano/
 *   2. Add a scene object below with the matching tilesPath.
 *   3. Done — the UI picks it up automatically.
 *
 * ADDING A NEW BHK TYPE:
 *   1. Create folder structure under public/assets/<newBhk>/pano/
 *   2. Add a new key to `panoConfig` below.
 *   3. Done — the nav and carousel adjust dynamically.
 */

// ---------- shared level presets ----------
// These match the Marzipano tool's data.js output exactly.
// The 256 fallbackOnly level uses preview.jpg; z=1+ map to folders 1/, 2/, etc.

const LEVELS_8K = [
  { tileSize: 256, size: 256, fallbackOnly: true },
  { tileSize: 512, size: 512 },
  { tileSize: 512, size: 1024 },
  { tileSize: 512, size: 2048 },
  { tileSize: 512, size: 4096 },
  { tileSize: 512, size: 8192 },
];

const LEVELS_4K = [
  { tileSize: 256, size: 256, fallbackOnly: true },
  { tileSize: 512, size: 512 },
  { tileSize: 512, size: 1024 },
  { tileSize: 512, size: 2048 },
  { tileSize: 512, size: 4096 },
];

const LEVELS_2K = [
  { tileSize: 256, size: 256, fallbackOnly: true },
  { tileSize: 512, size: 512 },
  { tileSize: 512, size: 1024 },
  { tileSize: 512, size: 2048 },
];

// ---------- default values ----------
const DEFAULT_FACE_SIZE = 2000;
const DEFAULT_FOV = 1.5707963267948966;

// ==========================================================
//  PANORAMA CONFIG
// ==========================================================

const panoConfig = {
  // ──────────────────────────────────────
  //  4 BHK
  // ──────────────────────────────────────
  "4bhk": {
    categories: [
      // ──── LIVING ROOM (6 scenes) ────
      {
        id: "living",
        label: "Living Room",
        type: "single",
        scenes: [
          {
            id: "living-01",
            label: "Living Room 1",
            tilesPath: "/assets/4bhk/pano/living/living-01",
            preview: "/assets/4bhk/pano/living/living-01/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: 2.5158581295163707, pitch: 0, fov: 1.4479588735060953 },
            linkHotspots: [],
          },
          {
            id: "living-02",
            label: "Living Room 2",
            tilesPath: "/assets/4bhk/pano/living/living-02",
            preview: "/assets/4bhk/pano/living/living-02/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
            linkHotspots: [],
          },
          {
            id: "living-03",
            label: "Living Room 3",
            tilesPath: "/assets/4bhk/pano/living/living-03",
            preview: "/assets/4bhk/pano/living/living-03/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
            linkHotspots: [],
          },
          {
            id: "foyer-01",
            label: "Foyer 1",
            tilesPath: "/assets/4bhk/pano/living/foyer-01",
            preview: "/assets/4bhk/pano/living/foyer-01/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: -2.596598240932778, pitch: 0, fov: 1.4479588735060953 },
            linkHotspots: [],
          },
          {
            id: "foyer-02",
            label: "Foyer 2",
            tilesPath: "/assets/4bhk/pano/living/foyer-02",
            preview: "/assets/4bhk/pano/living/foyer-02/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: 0.6319272119180948, pitch: 0, fov: 1.4479588735060953 },
            linkHotspots: [],
          },
          {
            id: "pdr",
            label: "PDR",
            tilesPath: "/assets/4bhk/pano/living/pdr",
            preview: "/assets/4bhk/pano/living/pdr/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: 0.1498380970730473, pitch: 0.01287898985726521, fov: 1.4479588735060953 },
            linkHotspots: [],
          },
        ],
      },

      // ──── KITCHEN (2 scenes) ────
      {
        id: "kitchen",
        label: "Kitchen",
        type: "single",
        scenes: [
          {
            id: "kitchen-01",
            label: "Kitchen 1",
            tilesPath: "/assets/4bhk/pano/kitchen/kitchen-01",
            preview: "/assets/4bhk/pano/kitchen/kitchen-01/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
            linkHotspots: [],
          },
          {
            id: "kitchen-02",
            label: "Kitchen 2",
            tilesPath: "/assets/4bhk/pano/kitchen/kitchen-02",
            preview: "/assets/4bhk/pano/kitchen/kitchen-02/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
            linkHotspots: [],
          },
        ],
      },

      // ──── BEDROOMS (dropdown) ────
      {
        id: "bedrooms",
        label: "Bedrooms",
        type: "dropdown",
        subcategories: [
          // ── Master Bedroom (4 scenes) ──
          {
            id: "master-bedroom",
            label: "Master Bedroom",
            scenes: [
              {
                id: "master-bed-01",
                label: "Master Bedroom 1",
                tilesPath: "/assets/4bhk/pano/bedrooms/master-bedroom/master-bed-01",
                preview: "/assets/4bhk/pano/bedrooms/master-bedroom/master-bed-01/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
                linkHotspots: [],
              },
              {
                id: "master-bed-02",
                label: "Master Bedroom 2",
                tilesPath: "/assets/4bhk/pano/bedrooms/master-bedroom/master-bed-02",
                preview: "/assets/4bhk/pano/bedrooms/master-bedroom/master-bed-02/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
                linkHotspots: [],
              },
              {
                id: "master-dresser",
                label: "Master Dresser",
                tilesPath: "/assets/4bhk/pano/bedrooms/master-bedroom/master-dresser",
                preview: "/assets/4bhk/pano/bedrooms/master-bedroom/master-dresser/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
                linkHotspots: [],
              },
              {
                id: "master-bathroom",
                label: "Master Bathroom",
                tilesPath: "/assets/4bhk/pano/bedrooms/master-bedroom/master-bathroom",
                preview: "/assets/4bhk/pano/bedrooms/master-bedroom/master-bathroom/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
                linkHotspots: [],
              },
            ],
          },

          // ── Bedroom 1 (4 scenes) ──
          {
            id: "bedroom-1",
            label: "Bedroom 1",
            scenes: [
              {
                id: "bed1-01",
                label: "Bedroom 1 — View 1",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-1/bed1-01",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-1/bed1-01/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
                linkHotspots: [],
              },
              {
                id: "bed1-02",
                label: "Bedroom 1 — View 2",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-1/bed1-02",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-1/bed1-02/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
                linkHotspots: [],
              },
              {
                id: "bed1-dresser",
                label: "Bedroom 1 — Dresser",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-1/bed1-dresser",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-1/bed1-dresser/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 1.1150596221498361, pitch: 0, fov: 1.4479588735060953 },
                linkHotspots: [],
              },
              {
                id: "bed1-bathroom",
                label: "Bedroom 1 — Bathroom",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-1/bed1-bathroom",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-1/bed1-bathroom/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
                linkHotspots: [],
              },
            ],
          },

          // ── Bedroom 2 (5 scenes — includes balcony) ──
          {
            id: "bedroom-2",
            label: "Bedroom 2",
            scenes: [
              {
                id: "bed2-01",
                label: "Bedroom 2 — View 1",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-2/bed2-01",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-2/bed2-01/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
                linkHotspots: [],
              },
              {
                id: "bed2-02",
                label: "Bedroom 2 — View 2",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-2/bed2-02",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-2/bed2-02/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
                linkHotspots: [],
              },
              {
                id: "bed2-dresser",
                label: "Bedroom 2 — Dresser",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-2/bed2-dresser",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-2/bed2-dresser/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: -1.5794492878055237, pitch: 0, fov: 1.4479588735060953 },
                linkHotspots: [],
              },
              {
                id: "bed2-bathroom",
                label: "Bedroom 2 — Bathroom",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-2/bed2-bathroom",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-2/bed2-bathroom/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0.9943369358117291, pitch: 0, fov: 1.4479588735060953 },
                linkHotspots: [],
              },
              {
                id: "bed2-balcony",
                label: "Bedroom 2 — Balcony",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-2/bed2-balcony",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-2/bed2-balcony/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: -0.6248207545233218, pitch: 0, fov: 1.4479588735060953 },
                linkHotspots: [],
              },
            ],
          },

          // ── Bedroom 3 (4 scenes) ──
          {
            id: "bedroom-3",
            label: "Bedroom 3",
            scenes: [
              {
                id: "bed3-01",
                label: "Bedroom 3 — View 1",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-3/bed3-01",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-3/bed3-01/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: -1.5859340223263665, pitch: 0, fov: 1.4479588735060953 },
                linkHotspots: [],
              },
              {
                id: "bed3-02",
                label: "Bedroom 3 — View 2",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-3/bed3-02",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-3/bed3-02/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: -0.9612845491227979, pitch: 0, fov: 1.4479588735060953 },
                linkHotspots: [],
              },
              {
                id: "bed3-dresser",
                label: "Bedroom 3 — Dresser",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-3/bed3-dresser",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-3/bed3-dresser/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: -1.954556640376392, pitch: 0, fov: 1.4479588735060953 },
                linkHotspots: [],
              },
              {
                id: "bed3-bathroom",
                label: "Bedroom 3 — Bathroom",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-3/bed3-bathroom",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-3/bed3-bathroom/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: -0.47459035438914476, pitch: 0, fov: 1.4479588735060953 },
                linkHotspots: [],
              },
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────
  //  3 BHK (placeholder — add scenes when tiles are ready)
  // ──────────────────────────────────────
  "3bhk": {
    categories: [
      {
        id: "living",
        label: "Living Room",
        type: "single",
        scenes: [],
      },
      {
        id: "kitchen",
        label: "Kitchen",
        type: "single",
        scenes: [],
      },
      {
        id: "bedrooms",
        label: "Bedrooms",
        type: "dropdown",
        subcategories: [
          { id: "bedroom-1", label: "Bedroom 1", scenes: [] },
          { id: "bedroom-2", label: "Bedroom 2", scenes: [] },
        ],
      },
    ],
  },
};

export default panoConfig;

// ──────────────────────────────────────
//  HELPER UTILITIES
// ──────────────────────────────────────

export function getBhkConfig(bhkType) {
  return panoConfig[bhkType] || null;
}

export function getCategories(bhkType) {
  return panoConfig[bhkType]?.categories || [];
}

export function getScenes(bhkType, categoryId, subcategoryId = null) {
  const category = getCategories(bhkType).find((c) => c.id === categoryId);
  if (!category) return [];

  if (category.type === "single") {
    return category.scenes || [];
  }

  if (category.type === "dropdown" && subcategoryId) {
    const sub = category.subcategories?.find((s) => s.id === subcategoryId);
    return sub?.scenes || [];
  }

  if (category.type === "dropdown" && category.subcategories?.length > 0) {
    return category.subcategories[0].scenes || [];
  }

  return [];
}

export function findSceneById(bhkType, sceneId) {
  const categories = getCategories(bhkType);

  for (const cat of categories) {
    if (cat.type === "single") {
      const found = cat.scenes?.find((s) => s.id === sceneId);
      if (found) return { scene: found, categoryId: cat.id, subcategoryId: null };
    }

    if (cat.type === "dropdown") {
      for (const sub of cat.subcategories || []) {
        const found = sub.scenes?.find((s) => s.id === sceneId);
        if (found) return { scene: found, categoryId: cat.id, subcategoryId: sub.id };
      }
    }
  }

  return null;
}

export function getDefaultScene(bhkType) {
  const categories = getCategories(bhkType);

  for (const cat of categories) {
    if (cat.type === "single" && cat.scenes?.length > 0) {
      return { scene: cat.scenes[0], categoryId: cat.id, subcategoryId: null };
    }
    if (cat.type === "dropdown") {
      for (const sub of cat.subcategories || []) {
        if (sub.scenes?.length > 0) {
          return { scene: sub.scenes[0], categoryId: cat.id, subcategoryId: sub.id };
        }
      }
    }
  }

  return null;
}

export function getPreviewUrls(bhkType, categoryId, subcategoryId = null) {
  return getScenes(bhkType, categoryId, subcategoryId).map((s) => s.preview);
}

export function preloadImages(urls) {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = url;
        })
    )
  );
}