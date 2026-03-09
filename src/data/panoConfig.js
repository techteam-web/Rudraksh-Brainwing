/**
 * panoConfig.js — Single source of truth for all panorama data.
 *
 * SCENE IDs match the original Marzipano tool output (data.js) so that
 * hotspot `target` references resolve without any remapping.
 *
 * FOLDER NAMES are kept as-is from the Marzipano tool export.
 * They live under  public/assets/<bhk>/pano/<category>/[<subcategory>/]<folder>/
 *
 * ADDING A NEW SCENE:
 *   1. Drop tiles + preview.jpg into the correct folder under public/assets/<bhk>/pano/
 *   2. Add a scene object below with the matching tilesPath.
 *   3. Done — the UI picks it up automatically.
 *
 * ADDING A NEW BHK TYPE:
 *   1. Create folder structure under public/assets/<newBhk>/pano/
 *   2. Add a new key to `panoConfig` below.
 *   3. Done — the nav and viewer adjust dynamically.
 */

// ---------- shared level presets ----------
const LEVELS_2K = [
  { tileSize: 256, size: 256, fallbackOnly: true },
  { tileSize: 512, size: 512 },
  { tileSize: 512, size: 1024 },
  { tileSize: 512, size: 2048 },
];

const LEVELS_4K = [
  { tileSize: 256, size: 256, fallbackOnly: true },
  { tileSize: 512, size: 512 },
  { tileSize: 512, size: 1024 },
  { tileSize: 512, size: 2048 },
  { tileSize: 512, size: 4096 },
];

const LEVELS_8K = [
  { tileSize: 256, size: 256, fallbackOnly: true },
  { tileSize: 512, size: 512 },
  { tileSize: 512, size: 1024 },
  { tileSize: 512, size: 2048 },
  { tileSize: 512, size: 4096 },
  { tileSize: 512, size: 8192 },
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
        defaultSceneId: "5-foyar-2",
        scenes: [
          {
            id: "9-living-camera-1",
            label: "Living Camera 1",
            tilesPath: "/assets/4bhk/pano/living/9-living-camera-1",
            preview: "/assets/4bhk/pano/living/9-living-camera-1/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: 2.8377337884437885, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 50, y: 45 },
            linkHotspots: [
              { yaw: 2.196204212031982, pitch: 0.28689489587124584, rotation: 0, target: "8-living-camera-2" },
              { yaw: 2.833011672811134, pitch: 0.1821835698062877, rotation: 0, target: "7-living-camera-3" },
              { yaw: 1.9816401408463875, pitch: 0.17304811104954965, rotation: 0, target: "6-4bhk-pdr" },
              { yaw: 2.332858355227679, pitch: 0.1713898813599748, rotation: 0, target: "0-bedroom3-1" },
              { yaw: -0.9850748139989456, pitch: 0.491715462802512, rotation: 0, target: "4-foyar-1" },
              { yaw: -1.0512880951224304, pitch: 0.1419634072268643, rotation: 0, target: "17-master-bedroom-1" },
              { yaw: -0.9049863012485382, pitch: 0.20436437470637614, rotation: 0, target: "21-bedroom1-1" },
            ],
          },
          {
            id: "8-living-camera-2",
            label: "Living Camera 2",
            tilesPath: "/assets/4bhk/pano/living/8-living-camera-2",
            preview: "/assets/4bhk/pano/living/8-living-camera-2/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: -2.214048618140458, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 37, y: 45 },
            linkHotspots: [
              { yaw: -1.0408554318441503, pitch: 0.34294671528529364, rotation: 0, target: "9-living-camera-1" },
              { yaw: -2.760543135671579, pitch: 0.3023445786116987, rotation: 0, target: "7-living-camera-3" },
              { yaw: 1.8576474061510257, pitch: 0.4481153147864205, rotation: 0, target: "6-4bhk-pdr" },
              { yaw: 2.7378347225700956, pitch: 0.3576049224284965, rotation: 0, target: "0-bedroom3-1" },
              { yaw: -0.3520360964308793, pitch: 0.22524714490550224, rotation: 0, target: "11-kitchen-1" },
              { yaw: 0.9806613996136839, pitch: 0.26757076161146287, rotation: 0, target: "13-bedroom2-1" },
              { yaw: -1.1167528707454828, pitch: 0.1970259327731796, rotation: 0, target: "4-foyar-1" },
              { yaw: -1.0554816778241936, pitch: 0.06782088670354369, rotation: 0, target: "17-master-bedroom-1" },
            ],
          },
          {
            id: "7-living-camera-3",
            label: "Living Camera 3",
            tilesPath: "/assets/4bhk/pano/living/7-living-camera-3",
            preview: "/assets/4bhk/pano/living/7-living-camera-3/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: -0.388338079119869, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 37, y: 30 },
            linkHotspots: [
              { yaw: 0.4908657123915088, pitch: 0.47797858557975026, rotation: 0, target: "8-living-camera-2" },
              { yaw: -0.3253901885269954, pitch: 0.12371290458823836, rotation: 0, target: "9-living-camera-1" },
              { yaw: 1.1452764827318305, pitch: 0.4586650465528095, rotation: 0, target: "0-bedroom3-1" },
              { yaw: 0.05721048617287394, pitch: 0.14839444281219905, rotation: 0, target: "11-kitchen-1" },
              { yaw: 0.8182821354493033, pitch: 0.35275876821500596, rotation: 0, target: "6-4bhk-pdr" },
            ],
          },
          {
            id: "4-foyar-1",
            label: "Foyer 1",
            tilesPath: "/assets/4bhk/pano/living/4-foyar-1",
            preview: "/assets/4bhk/pano/living/4-foyar-1/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: -2.52544217263409, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 56.5, y: 45 },
            linkHotspots: [
              { yaw: 2.0450442588504183, pitch: 0.5022796117971833, rotation: 0, target: "9-living-camera-1" },
              { yaw: 2.024309881184023, pitch: 0.10535853838907627, rotation: 0, target: "6-4bhk-pdr" },
              { yaw: -2.6445273113212124, pitch: 0.25904740381480273, rotation: 0, target: "5-foyar-2" },
              { yaw: 2.277031920586773, pitch: 0.013909768096556974, rotation: 0, target: "0-bedroom3-1" },
              { yaw: -1.0590848490796851, pitch: 0.21433711120654486, rotation: 0, target: "17-master-bedroom-1" },
              { yaw: -0.8179863012485382, pitch: 0.30436437470637614, rotation: 0, target: "21-bedroom1-1" }
            ],
          },
          {
            id: "5-foyar-2",
            label: "Foyer 2",
            tilesPath: "/assets/4bhk/pano/living/5-foyar-2",
            preview: "/assets/4bhk/pano/living/5-foyar-2/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: 0.5616852959570409, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 56.5, y: 25 },
            linkHotspots: [
              { yaw: 0.5223432841043625, pitch: 0.2962538490480142, rotation: 0, target: "4-foyar-1" },
            ],
          },
          {
            id: "6-4bhk-pdr",
            label: "PDR",
            tilesPath: "/assets/4bhk/pano/living/6-4bhk-pdr",
            preview: "/assets/4bhk/pano/living/6-4bhk-pdr/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: 0.3325769221995518, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 31, y: 45 },
            linkHotspots: [
              { yaw: -2.9700932070303736, pitch: 0.21538916898961347, rotation: 0, target: "9-living-camera-1" },
              { yaw: 2.803885251790822, pitch: 0.5103802219398172, rotation: 0, target: "8-living-camera-2" },
              { yaw: -2.5521322539787477, pitch: 0.014174525867609589, rotation: 0, target: "11-kitchen-1" },
            ],
          },
        ],
      },

      // ──── KITCHEN (2 scenes) ────
      {
        id: "kitchen",
        label: "Kitchen",
        type: "single",
        defaultSceneId: "11-kitchen-1",
        scenes: [
          {
            id: "11-kitchen-1",
            label: "Kitchen 1",
            tilesPath: "/assets/4bhk/pano/kitchen/11-kitchen-1",
            preview: "/assets/4bhk/pano/kitchen/11-kitchen-1/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
            minimapPos: { x: 51, y: 59 },
            linkHotspots: [
              { yaw: -0.029903115475022446, pitch: 0.3694352250887931, rotation: 0, target: "10-kitchen-2" },
              { yaw: 1.9588217554552063, pitch: -0.015806839274475237, rotation: 0, target: "6-4bhk-pdr" },
              { yaw: 1.4769701094828207, pitch: -0.020503989072619078, rotation: 0, target: "13-bedroom2-1" },
              { yaw: 1.9774261920859875, pitch: 0.44404724516092564, rotation: 0, target: "9-living-camera-1" },
            ],
          },
          {
            id: "10-kitchen-2",
            label: "Kitchen 2",
            tilesPath: "/assets/4bhk/pano/kitchen/10-kitchen-2",
            preview: "/assets/4bhk/pano/kitchen/10-kitchen-2/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
            minimapPos: { x: 51, y: 72 },
            linkHotspots: [
              { yaw: 0.015744929059888335, pitch: 0.3992753627925296, rotation: 0, target: "11-kitchen-1" },
            ],
          },
        ],
      },

      // ──── BEDROOMS (dropdown) ────
      {
        id: "bedrooms",
        label: "Bedrooms",
        type: "dropdown",
        subcategories: [
          // ── Bedroom 1 (4 scenes) — DEFAULT for bedrooms ──
          {
            id: "bedroom-1",
            label: "Bedroom 1",
            defaultSceneId: "21-bedroom1-1",
            scenes: [
              {
                id: "21-bedroom1-1",
                label: "Bedroom 1 — View 1",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-1/21-bedroom1-1",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-1/21-bedroom1-1/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
            minimapPos: { x: 67, y: 58 },
                linkHotspots: [
                  { yaw: -2.909947569930777, pitch: 0.4777396217048846, rotation: 0, target: "17-master-bedroom-1" },
                  { yaw: 2.584723531690461, pitch: 0.5154503864049538, rotation: 0, target: "4-foyar-1" },
                  { yaw: -0.08326051562793602, pitch: 0.25187459643371746, rotation: 0, target: "24-bedroom1-2" },
                ],
              },
              {
                id: "24-bedroom1-2",
                label: "Bedroom 1 — View 2",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-1/24-bedroom1-2",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-1/24-bedroom1-2/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
            minimapPos: { x: 67, y: 76 },
                linkHotspots: [
                  { yaw: 2.504583592441171, pitch: 0.5504036618167127, rotation: 0, target: "22-4bhk-dresser-1" },
                  { yaw: 2.509203688285764, pitch: 0.249838030872219, rotation: 0, target: "23-4bhk-bedroom1-bathroom" },
                  { yaw: 0.8842581282381481, pitch: 0.265374559658099, rotation: 0, target: "21-bedroom1-1" },
                ],
              },
              {
                id: "22-4bhk-dresser-1",
                label: "Bedroom 1 — Dresser",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-1/22-4bhk-dresser-1",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-1/22-4bhk-dresser-1/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0.41917914079945895, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 74, y: 76 },
                linkHotspots: [
                  { yaw: -1.3496118784404647, pitch: 0.7609481835037624, rotation: 0, target: "24-bedroom1-2" },
                  { yaw: 1.5996738590451134, pitch: 0.20784374172956177, rotation: 0, target: "23-4bhk-bedroom1-bathroom" },
                ],
              },
              {
                id: "23-4bhk-bedroom1-bathroom",
                label: "Bedroom 1 — Bathroom",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-1/23-4bhk-bedroom1-bathroom",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-1/23-4bhk-bedroom1-bathroom/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
            minimapPos: { x: 83, y: 76 },
                linkHotspots: [
                  { yaw: -2.990419318396958, pitch: 0.4394396207571596, rotation: 0, target: "22-4bhk-dresser-1" },
                  { yaw: -3.071980540604528, pitch: 0.2597725596929674, rotation: 0, target: "24-bedroom1-2" },
                ],
              },
            ],
          },

          // ── Bedroom 2 (5 scenes — includes balcony) ──
          {
            id: "bedroom-2",
            label: "Bedroom 2",
            defaultSceneId: "13-bedroom2-1",
            scenes: [
              {
                id: "13-bedroom2-1",
                label: "Bedroom 2 — View 1",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-2/13-bedroom2-1",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-2/13-bedroom2-1/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
            minimapPos: { x: 27, y: 65 },
                linkHotspots: [
                  { yaw: -0.629576565468966, pitch: 0.3550611678647577, rotation: 0, target: "12-bedroom2-2" },
                  { yaw: 2.004726348611486, pitch: 0.6693495944749657, rotation: 0, target: "14-4bhk-dresser-2" },
                  { yaw: 0.4070229909353884, pitch: 0.05269702808863208, rotation: 0, target: "16-4bhk-balcony1" },
                  { yaw: -2.541183058910521, pitch: 0.0024965779776895403, rotation: 0, target: "11-kitchen-1" },
                  { yaw: -2.4905682566083147, pitch: 0.6041732407497751, rotation: 0, target: "8-living-camera-2" },
                ],
              },
              {
                id: "12-bedroom2-2",
                label: "Bedroom 2 — View 2",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-2/12-bedroom2-2",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-2/12-bedroom2-2/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: -0.5, pitch: 0, fov: DEFAULT_FOV },
            minimapPos: { x: 27, y: 75 },
                linkHotspots: [
                  { yaw: 0.26875617807956864, pitch: 0.2788507938387301, rotation: 0, target: "14-4bhk-dresser-2" },
                  { yaw: 0.3409096981108348, pitch: 0.40256535283503325, rotation: 0, target: "13-bedroom2-1" },
                  { yaw: -1.0242540423663034, pitch: 0.13977339913948583, rotation: 0, target: "16-4bhk-balcony1" },
                ],
              },
              {
                id: "14-4bhk-dresser-2",
                label: "Bedroom 2 — Dresser",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-2/14-4bhk-dresser-2",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-2/14-4bhk-dresser-2/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: -0.7256270801820079, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 27, y: 55 },
                linkHotspots: [
                  { yaw: -2.046145300779827, pitch: 0.3416640253332375, rotation: 0, target: "15-4bhk-bedroom2-bathroom" },
                  { yaw: 2.639090311476558, pitch: 0.26244651817933473, rotation: 0, target: "12-bedroom2-2" },
                  { yaw: 2.5319708009063806, pitch: 0.8883686223784828, rotation: 0, target: "13-bedroom2-1" },
                ],
              },
              {
                id: "15-4bhk-bedroom2-bathroom",
                label: "Bedroom 2 — Bathroom",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-2/15-4bhk-bedroom2-bathroom",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-2/15-4bhk-bedroom2-bathroom/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0.9295394140013133, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 16, y: 55 },
                linkHotspots: [
                  { yaw: -2.96249836328494, pitch: 0.4483918039559587, rotation: 0, target: "14-4bhk-dresser-2" },
                ],
              },
              {
                id: "16-4bhk-balcony1",
                label: "Bedroom 2 — Balcony",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-2/16-4bhk-balcony1",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-2/16-4bhk-balcony1/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: -0.6198258261734004, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 12, y: 69 },
                linkHotspots: [
                  { yaw: 1.3481330638501383, pitch: 0.4513600682775216, rotation: 0, target: "13-bedroom2-1" },
                ],
              },
            ],
          },

          // ── Bedroom 3 (4 scenes) ──
          {
            id: "bedroom-3",
            label: "Bedroom 3",
            defaultSceneId: "0-bedroom3-1",
            scenes: [
              {
                id: "0-bedroom3-1",
                label: "Bedroom 3 — View 1",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-3/0-bedroom3-1",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-3/0-bedroom3-1/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: -1.8123981611952864, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 30, y: 35.5 },
                linkHotspots: [
                  { yaw: -2.2036691563542146, pitch: 0.2779138320552512, rotation: 0, target: "3-bedroom3-2" },
                  { yaw: 1.0671015897093117, pitch: 0.5418821059341052, rotation: 0, target: "8-living-camera-2" },
                  { yaw: 1.1167193593005997, pitch: 0.15002395953605152, rotation: 0, target: "9-living-camera-1" },
                ],
              },
              {
                id: "3-bedroom3-2",
                label: "Bedroom 3 — View 2",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-3/3-bedroom3-2",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-3/3-bedroom3-2/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
            minimapPos: { x: 20, y: 35.5 },
                linkHotspots: [
                  { yaw: -0.05034435136866833, pitch: 0.34705809553624434, rotation: 0, target: "0-bedroom3-1" },
                  { yaw: 0.9550803972543545, pitch: 0.473747661701859, rotation: 0, target: "1-4bhk-dresser-3" },
                ],
              },
              {
                id: "1-4bhk-dresser-3",
                label: "Bedroom 3 — Dresser",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-3/1-4bhk-dresser-3",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-3/1-4bhk-dresser-3/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: -2.2144134561084563, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 23, y: 45 },
                linkHotspots: [
                  { yaw: -0.6284954699376488, pitch: 0.7959267145079636, rotation: 0, target: "2-4bhk-bedroom3-bathroom" },
                  { yaw: 1.2490831120653052, pitch: 0.5241884818067408, rotation: 0, target: "3-bedroom3-2" },
                ],
              },
              {
                id: "2-4bhk-bedroom3-bathroom",
                label: "Bedroom 3 — Bathroom",
                tilesPath: "/assets/4bhk/pano/bedrooms/bedroom-3/2-4bhk-bedroom3-bathroom",
                preview: "/assets/4bhk/pano/bedrooms/bedroom-3/2-4bhk-bedroom3-bathroom/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
            minimapPos: { x: 17, y: 45 },
                linkHotspots: [
                  { yaw: 1.7560754918133767, pitch: 0.8959686356301031, rotation: 0, target: "1-4bhk-dresser-3" },
                ],
              },
            ],
          },

          // ── Master Bedroom (4 scenes) ──
          {
            id: "master-bedroom",
            label: "Master Bedroom",
            defaultSceneId: "17-master-bedroom-1",
            scenes: [
              {
                id: "17-master-bedroom-1",
                label: "Master Bedroom 1",
                tilesPath: "/assets/4bhk/pano/bedrooms/master-bedroom/17-master-bedroom-1",
                preview: "/assets/4bhk/pano/bedrooms/master-bedroom/17-master-bedroom-1/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
            minimapPos: { x: 74, y: 46 },
                linkHotspots: [
                  { yaw: -1.6346278490059518, pitch: 0.4741057408776026, rotation: 0, target: "20-master-bedroom-2" },
                  { yaw: 1.6310510161740517, pitch: 0.2233028208916643, rotation: 0, target: "4-foyar-1" },
                  { yaw: 1.53448506025099, pitch: 0.15008212516216446, rotation: 0, target: "9-living-camera-1" },
                ],
              },
              {
                id: "20-master-bedroom-2",
                label: "Master Bedroom 2",
                tilesPath: "/assets/4bhk/pano/bedrooms/master-bedroom/20-master-bedroom-2",
                preview: "/assets/4bhk/pano/bedrooms/master-bedroom/20-master-bedroom-2/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
            minimapPos: { x: 81, y: 46 },
                linkHotspots: [
                  { yaw: 0.7460744654867355, pitch: 0.41103224853968, rotation: 0, target: "17-master-bedroom-1" },
                  { yaw: 0.6696205617492232, pitch: 0.16030096333479626, rotation: 0, target: "4-foyar-1" },
                  { yaw: 2.2289401251100207, pitch: 0.589568819647889, rotation: 0, target: "19-4bhk-master-dresser3" },
                ],
              },
              {
                id: "19-4bhk-master-dresser3",
                label: "Master Dresser",
                tilesPath: "/assets/4bhk/pano/bedrooms/master-bedroom/19-4bhk-master-dresser3",
                preview: "/assets/4bhk/pano/bedrooms/master-bedroom/19-4bhk-master-dresser3/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
            minimapPos: { x: 82.5, y: 38 },
                linkHotspots: [
                  { yaw: 0.18382966776930765, pitch: 0.5756774349750238, rotation: 0, target: "18-4bhk-masterbedroom-bathroom" },
                  { yaw: 1.8586383231702719, pitch: 0.9137131301938552, rotation: 0, target: "20-master-bedroom-2" },
                ],
              },
              {
                id: "18-4bhk-masterbedroom-bathroom",
                label: "Master Bathroom",
                tilesPath: "/assets/4bhk/pano/bedrooms/master-bedroom/18-4bhk-masterbedroom-bathroom",
                preview: "/assets/4bhk/pano/bedrooms/master-bedroom/18-4bhk-masterbedroom-bathroom/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
            minimapPos: { x: 87, y: 46 },
                linkHotspots: [
                  { yaw: 1.8118814010240296, pitch: 0.6520623223430491, rotation: 0, target: "19-4bhk-master-dresser3" },
                ],
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
        defaultSceneId: null,
        scenes: [],
      },
      {
        id: "kitchen",
        label: "Kitchen",
        type: "single",
        defaultSceneId: null,
        scenes: [],
      },
      {
        id: "bedrooms",
        label: "Bedrooms",
        type: "dropdown",
        subcategories: [
          { id: "bedroom-1", label: "Bedroom 1", defaultSceneId: null, scenes: [] },
          { id: "bedroom-2", label: "Bedroom 2", defaultSceneId: null, scenes: [] },
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

  // If dropdown but no subcategoryId, return first subcategory's scenes
  if (category.type === "dropdown" && category.subcategories?.length > 0) {
    return category.subcategories[0].scenes || [];
  }

  return [];
}

/**
 * Find any scene by its id across all categories/subcategories.
 * Returns { scene, categoryId, subcategoryId } or null.
 */
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

/**
 * Get the default scene for a given category (or subcategory).
 * Uses the `defaultSceneId` field if set, otherwise first scene.
 */
export function getCategoryDefaultScene(bhkType, categoryId, subcategoryId = null) {
  const categories = getCategories(bhkType);
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return null;

  if (category.type === "single") {
    const defaultId = category.defaultSceneId;
    const scene = defaultId
      ? category.scenes?.find((s) => s.id === defaultId)
      : category.scenes?.[0];
    return scene ? { scene, categoryId: category.id, subcategoryId: null } : null;
  }

  if (category.type === "dropdown") {
    // If subcategoryId given, use that subcategory
    const sub = subcategoryId
      ? category.subcategories?.find((s) => s.id === subcategoryId)
      : category.subcategories?.[0]; // default to first subcategory

    if (!sub || !sub.scenes?.length) return null;

    const defaultId = sub.defaultSceneId;
    const scene = defaultId
      ? sub.scenes.find((s) => s.id === defaultId)
      : sub.scenes[0];

    return scene ? { scene, categoryId: category.id, subcategoryId: sub.id } : null;
  }

  return null;
}

/**
 * Get the overall default scene for page load.
 */
export function getDefaultScene(bhkType) {
  const categories = getCategories(bhkType);

  for (const cat of categories) {
    if (cat.type === "single" && cat.scenes?.length > 0) {
      const defaultId = cat.defaultSceneId;
      const scene = defaultId
        ? cat.scenes.find((s) => s.id === defaultId) || cat.scenes[0]
        : cat.scenes[0];
      return { scene, categoryId: cat.id, subcategoryId: null };
    }
    if (cat.type === "dropdown") {
      for (const sub of cat.subcategories || []) {
        if (sub.scenes?.length > 0) {
          const defaultId = sub.defaultSceneId;
          const scene = defaultId
            ? sub.scenes.find((s) => s.id === defaultId) || sub.scenes[0]
            : sub.scenes[0];
          return { scene, categoryId: cat.id, subcategoryId: sub.id };
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