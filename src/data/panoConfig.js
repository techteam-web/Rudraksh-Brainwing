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
 *
 * radarNorthOffset (degrees):
 *   Calibrates the minimap radar cone direction per scene.
 *   "When Marzipano yaw = 0 for this scene, what direction should the
 *    cone point on the minimap?"
 *     0°   = up on minimap
 *     90°  = right
 *     180° = down
 *     270° = left
 *   Accepts any float (e.g. 137.5, -22.3). The live yaw is added on top.
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
            radarNorthOffset: 150,
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
            radarNorthOffset: 170,
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
            radarNorthOffset: 165,
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
            initialView: { yaw: -3.99544217263409, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 56.5, y: 45 },
            radarNorthOffset: 150,
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
            radarNorthOffset: 150,
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
            radarNorthOffset: 255,
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
            radarNorthOffset: 180,
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
            radarNorthOffset: 0,
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
                radarNorthOffset: 240,
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
                radarNorthOffset: -60,
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
                radarNorthOffset: 0,
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
                radarNorthOffset: 50,
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
                radarNorthOffset: 235,
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
                radarNorthOffset: -25,
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
                radarNorthOffset: 0,
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
                radarNorthOffset: -110,
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
                radarNorthOffset: 0,
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
                radarNorthOffset: 40,
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
                initialView: { yaw: -0.7, pitch: 0, fov: DEFAULT_FOV },
                minimapPos: { x: 20, y: 35.5 },
                radarNorthOffset: 80,
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
                radarNorthOffset: 0,
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
                radarNorthOffset: 0,
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
                radarNorthOffset: 175,
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
                radarNorthOffset: 200,
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
                radarNorthOffset: 90,
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
                radarNorthOffset: 180,
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
  //  3 BHK
  // ──────────────────────────────────────
  "3bhk": {
    categories: [
      // ──── DINING & LIVING (4 scenes) ────
      {
        id: "dining-living",
        label: "Dining & Living",
        type: "single",
        defaultSceneId: "18-living-area",
        scenes: [
          {
            id: "18-living-area",
            label: "Living Area",
            tilesPath: "/assets/3bhk/pano/dining/18-living-area",
            preview: "/assets/3bhk/pano/dining/18-living-area/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: -0.111047393127091, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 50, y: 40 },    // ← placeholder
            radarNorthOffset: 80,              // ← placeholder
            linkHotspots: [
              { yaw: 0.4119139172888566, pitch: 0.3185024321680636, rotation: 0, target: "1-dining1-view-1" },
              { yaw: 0.4168782957550956, pitch: 0.13946940975941402, rotation: 0, target: "0-dining1-view-2" },
              { yaw: 3.079898437626058, pitch: 0.22164366330124352, rotation: 0, target: "6-masterbedroom-view-1" },
              { yaw: 3.028417144874317, pitch: 0.5715517487518618, rotation: 0, target: "3-foyar-2" },
              { yaw: -1.86697295989911, pitch: 0.489313365066149, rotation: 0, target: "2-foyar-1" },
            ],
          },
          {
            id: "1-dining1-view-1",
            label: "Dining — View 1",
            tilesPath: "/assets/3bhk/pano/dining/1-dining1-view-1",
            preview: "/assets/3bhk/pano/dining/1-dining1-view-1/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: 0.5505199837306556, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 62, y: 45 },    // ← placeholder
            radarNorthOffset: 50,              // ← placeholder
            linkHotspots: [
              { yaw: 0.4695702211581434, pitch: 0.24422086268667442, rotation: 0, target: "0-dining1-view-2" },
              { yaw: -2.670889042665852, pitch: 0.32789482159739336, rotation: 0, target: "18-living-area" },
              { yaw: 0.8889811057107, pitch: 0.47451477457848945, rotation: 0, target: "19-kitchen-view-1" },
            ],
          },
          {
            id: "0-dining1-view-2",
            label: "Dining — View 2",
            tilesPath: "/assets/3bhk/pano/dining/0-dining1-view-2",
            preview: "/assets/3bhk/pano/dining/0-dining1-view-2/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
            minimapPos: { x: 80, y: 45 },    // ← placeholder
            radarNorthOffset: 0,              // ← placeholder
            linkHotspots: [
              { yaw: -1.225144201902289, pitch: 0.23139323026546776, rotation: 0, target: "1-dining1-view-1" },
              { yaw: 2.602818286348282, pitch: 0.5088014602639195, rotation: 0, target: "13-bedroom2-view-1" },
              { yaw: 1.4474204637901469, pitch: 0.31672065951714856, rotation: 0, target: "16-balcony" },
              { yaw: -1.5522622545402616, pitch: 0.3357872411076066, rotation: 0, target: "19-kitchen-view-1" },
              { yaw: -1.2249171971323012, pitch: 0.13335850653027137, rotation: 0, target: "18-living-area" },
              { yaw: -2.349755353598175, pitch: 0.15134043384801288, rotation: 0, target: "12-bathroom-patch" },
            ],
          },
          {
            id: "12-bathroom-patch",
            label: "Guest Bathroom",
            tilesPath: "/assets/3bhk/pano/dining/12-bathroom-patch",
            preview: "/assets/3bhk/pano/dining/12-bathroom-patch/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
            minimapPos: { x: 75, y: 53 },    // ← placeholder
            radarNorthOffset: 180,              // ← placeholder
            linkHotspots: [
              { yaw: 3.133477682015032, pitch: 0.44259350505205397, rotation: 0, target: "0-dining1-view-2" },
            ],
          },
        ],
      },

      // ──── FOYER (2 scenes) ────
      {
        id: "foyar",
        label: "Foyer",
        type: "single",
        defaultSceneId: "3-foyar-2",
        scenes: [
          {
            id: "3-foyar-2",
            label: "Foyer 2",
            tilesPath: "/assets/3bhk/pano/foyar/3-foyar-2",
            preview: "/assets/3bhk/pano/foyar/3-foyar-2/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: 0.24059763762167208, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 40, y: 54 },    // ← placeholder
            radarNorthOffset: 0,              // ← placeholder
            linkHotspots: [
              { yaw: 0.11337366082148392, pitch: 0.25995920240625736, rotation: 0, target: "2-foyar-1" },
              { yaw: 0.7054938492662792, pitch: 0.4561802186137829, rotation: 0, target: "18-living-area" },
              { yaw: 1.994800682468009, pitch: 0.6656270125600283, rotation: 0, target: "15-bedroom1-view-1" },
              { yaw: -1.6901149474397101, pitch: 0.37609609776915676, rotation: 0, target: "6-masterbedroom-view-1" },
              { yaw: -1.6555550581644027, pitch: 0.17075373726056142, rotation: 0, target: "7-masterbedroom-view-2" },
            ],
          },
          {
            id: "2-foyar-1",
            label: "Foyer 1",
            tilesPath: "/assets/3bhk/pano/foyar/2-foyar-1",
            preview: "/assets/3bhk/pano/foyar/2-foyar-1/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: 0.08422998029514517, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 43.5, y: 35 },    // ← placeholder
            radarNorthOffset: 180,              // ← placeholder
            linkHotspots: [
              { yaw: 0.03462732983163974, pitch: 0.3430914596646204, rotation: 0, target: "3-foyar-2" },
              { yaw: -0.5444170668404844, pitch: 0.42266447556048803, rotation: 0, target: "18-living-area" },
            ],
          },
        ],
      },

      // ──── KITCHEN (2 scenes) ────
      {
        id: "kitchen",
        label: "Kitchen",
        type: "single",
        defaultSceneId: "19-kitchen-view-1",
        scenes: [
          {
            id: "19-kitchen-view-1",
            label: "Kitchen — View 1",
            tilesPath: "/assets/3bhk/pano/kitchen/19-kitchen-view-1",
            preview: "/assets/3bhk/pano/kitchen/19-kitchen-view-1/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: -0.09955853926658875, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 68, y: 54 },    // ← placeholder
            radarNorthOffset: 180,              // ← placeholder
            linkHotspots: [
              { yaw: 0.5120716678897406, pitch: 0.9717842250223683, rotation: 0, target: "17-kitchen-view-2" },
              { yaw: 2.724749239015847, pitch: 0.4850006299037144, rotation: 0, target: "1-dining1-view-1" },
              { yaw: -2.638022483631236, pitch: 0.41145203901698046, rotation: 0, target: "0-dining1-view-2" },
            ],
          },
          {
            id: "17-kitchen-view-2",
            label: "Kitchen — View 2",
            tilesPath: "/assets/3bhk/pano/kitchen/17-kitchen-view-2",
            preview: "/assets/3bhk/pano/kitchen/17-kitchen-view-2/preview.jpg",
            levels: LEVELS_2K,
            faceSize: DEFAULT_FACE_SIZE,
            initialView: { yaw: 1.4714220184660318, pitch: 0, fov: 1.4479588735060953 },
            minimapPos: { x: 65, y: 59 },    // ← placeholder
            radarNorthOffset: 180,              // ← placeholder
            linkHotspots: [
              { yaw: -2.4896900834773383, pitch: 0.6556360111251589, rotation: 0, target: "19-kitchen-view-1" },
              { yaw: -2.4678547037887846, pitch: 0.29984691084336035, rotation: 0, target: "0-dining1-view-2" },
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
          // ── Master Bedroom (5 scenes) ──
          {
            id: "master-bedroom",
            label: "Master Bedroom",
            defaultSceneId: "6-masterbedroom-view-1",
            scenes: [
              {
                id: "6-masterbedroom-view-1",
                label: "Master Bedroom — View 1",
                tilesPath: "/assets/3bhk/pano/bedrooms/master-bedroom/6-masterbedroom-view-1",
                preview: "/assets/3bhk/pano/bedrooms/master-bedroom/6-masterbedroom-view-1/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0.5435149050693884, pitch: 0, fov: 1.4479588735060953 },
                minimapPos: { x: 28, y: 54 },    // ← placeholder
                radarNorthOffset: 180,              // ← placeholder
                linkHotspots: [
                  { yaw: -1.6554231963193793, pitch: 0.27705790038240075, rotation: 0, target: "3-foyar-2" },
                  { yaw: -1.6159673816517444, pitch: 0.06400098760198603, rotation: 0, target: "15-bedroom1-view-1" },
                  { yaw: 1.6691094636109574, pitch: 0.4262022987346956, rotation: 0, target: "7-masterbedroom-view-2" },
                  { yaw: 1.0643977647035552, pitch: 0.10418979738156864, rotation: 0, target: "10-masterbedroom-dresser" },
                  { yaw: 0.8479509716646714, pitch: 0.16907281825142206, rotation: 0, target: "8-masterbedroom-view-3" },
                ],
              },
              {
                id: "7-masterbedroom-view-2",
                label: "Master Bedroom — View 2",
                tilesPath: "/assets/3bhk/pano/bedrooms/master-bedroom/7-masterbedroom-view-2",
                preview: "/assets/3bhk/pano/bedrooms/master-bedroom/7-masterbedroom-view-2/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: -0.6094160591964997, pitch: 0, fov: 1.4479588735060953 },
                minimapPos: { x: 18, y: 54 },    // ← placeholder
                radarNorthOffset: 180,              // ← placeholder
                linkHotspots: [
                  { yaw: -1.656347771514918, pitch: 0.33616861231796946, rotation: 0, target: "6-masterbedroom-view-1" },
                  { yaw: -1.6164310194867593, pitch: 0.17004671113914327, rotation: 0, target: "3-foyar-2" },
                  { yaw: -1.5974194258584014, pitch: 0.04892701970219093, rotation: 0, target: "15-bedroom1-view-1" },
                  { yaw: 0.07080805029544734, pitch: 0.42496414571161445, rotation: 0, target: "8-masterbedroom-view-3" },
                  { yaw: 0.4060321412408072, pitch: 0.16876848423767754, rotation: 0, target: "10-masterbedroom-dresser" },
                  { yaw: 2.887538125228545, pitch: 0.4925473991590614, rotation: 0, target: "9-masterbedroom-bathroom" },
                ],
              },
              {
                id: "8-masterbedroom-view-3",
                label: "Master Bedroom — View 3",
                tilesPath: "/assets/3bhk/pano/bedrooms/master-bedroom/8-masterbedroom-view-3",
                preview: "/assets/3bhk/pano/bedrooms/master-bedroom/8-masterbedroom-view-3/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: -2.011766947703725, pitch: 0, fov: 1.4479588735060953 },
                minimapPos: { x: 18, y: 67 },    // ← placeholder
                radarNorthOffset: 180,              // ← placeholder
                linkHotspots: [
                  { yaw: 3.1296456673405393, pitch: 0.46790602219549626, rotation: 0, target: "7-masterbedroom-view-2" },
                  { yaw: -2.195287391214361, pitch: 0.25366785574212614, rotation: 0, target: "6-masterbedroom-view-1" },
                  { yaw: 1.5129997813780562, pitch: 0.07202285470657444, rotation: 0, target: "10-masterbedroom-dresser" },
                  { yaw: 3.0333680916399075, pitch: 0.2696759168953289, rotation: 0, target: "9-masterbedroom-bathroom" },
                ],
              },
              {
                id: "10-masterbedroom-dresser",
                label: "Master Dresser",
                tilesPath: "/assets/3bhk/pano/bedrooms/master-bedroom/10-masterbedroom-dresser",
                preview: "/assets/3bhk/pano/bedrooms/master-bedroom/10-masterbedroom-dresser/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0.4134226779000052, pitch: 0, fov: 1.4479588735060953 },
                minimapPos: { x: 15, y: 67 },    // ← placeholder
                radarNorthOffset: 200,              // ← placeholder
                linkHotspots: [
                  { yaw: -1.4736692065766075, pitch: 0.6429571862970551, rotation: 0, target: "8-masterbedroom-view-3" },
                ],
              },
              {
                id: "9-masterbedroom-bathroom",
                label: "Master Bathroom",
                tilesPath: "/assets/3bhk/pano/bedrooms/master-bedroom/9-masterbedroom-bathroom",
                preview: "/assets/3bhk/pano/bedrooms/master-bedroom/9-masterbedroom-bathroom/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 2.4273255912479463, pitch: 0, fov: 1.4479588735060953 },
                minimapPos: { x: 18, y: 45 },    // ← placeholder
                radarNorthOffset: 170,              // ← placeholder
                linkHotspots: [
                  { yaw: -0.11622016899342036, pitch: 0.2565341788701865, rotation: 0, target: "8-masterbedroom-view-3" },
                  { yaw: -0.14743408070377484, pitch: 0.4464411119960374, rotation: 0, target: "7-masterbedroom-view-2" },
                ],
              },
            ],
          },

          // ── Bedroom 1 (4 scenes) ──
          {
            id: "bedroom-1",
            label: "Bedroom 1",
            defaultSceneId: "15-bedroom1-view-1",
            scenes: [
              {
                id: "15-bedroom1-view-1",
                label: "Bedroom 1 — View 1",
                tilesPath: "/assets/3bhk/pano/bedrooms/bedroom-1/15-bedroom1-view-1",
                preview: "/assets/3bhk/pano/bedrooms/bedroom-1/15-bedroom1-view-1/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: -0.8668533163616132, pitch: 0, fov: 1.4479588735060953 },
                minimapPos: { x: 48, y: 54 },    // ← placeholder
                radarNorthOffset: 180,              // ← placeholder
                linkHotspots: [
                  { yaw: 1.719216920819374, pitch: 0.5758301729191473, rotation: 0, target: "3-foyar-2" },
                  { yaw: 0.08314813406256505, pitch: 0.4179781056016161, rotation: 0, target: "4-bedroom1-view-2" },
                  { yaw: 1.640201801161206, pitch: 0.24011745800679485, rotation: 0, target: "6-masterbedroom-view-1" },
                  { yaw: 1.6344406503412188, pitch: 0.12514230227649037, rotation: 0, target: "7-masterbedroom-view-2" },
                ],
              },
              {
                id: "4-bedroom1-view-2",
                label: "Bedroom 1 — View 2",
                tilesPath: "/assets/3bhk/pano/bedrooms/bedroom-1/4-bedroom1-view-2",
                preview: "/assets/3bhk/pano/bedrooms/bedroom-1/4-bedroom1-view-2/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: -2.3522681159795162, pitch: 0, fov: 1.4479588735060953 },
                minimapPos: { x: 48, y: 70 },    // ← placeholder
                radarNorthOffset: 180,              // ← placeholder
                linkHotspots: [
                  { yaw: 3.0453804547072245, pitch: 0.3257244559571735, rotation: 0, target: "15-bedroom1-view-1" },
                  { yaw: 1.5202644451686247, pitch: 0.5830169692882272, rotation: 0, target: "11-bedroom1-dresser-1" },
                  { yaw: 1.5225400140191727, pitch: 0.3082407377367957, rotation: 0, target: "14-bedroom1-bath-1" },
                ],
              },
              {
                id: "11-bedroom1-dresser-1",
                label: "Bedroom 1 — Dresser",
                tilesPath: "/assets/3bhk/pano/bedrooms/bedroom-1/11-bedroom1-dresser-1",
                preview: "/assets/3bhk/pano/bedrooms/bedroom-1/11-bedroom1-dresser-1/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0.34519114741907764, pitch: 0, fov: 1.4479588735060953 },
                minimapPos: { x: 43, y: 70 },    // ← placeholder
                radarNorthOffset: -20,              // ← placeholder
                linkHotspots: [
                  { yaw: 1.9187073124227174, pitch: 0.5701225209650502, rotation: 0, target: "4-bedroom1-view-2" },
                  { yaw: -1.3224378779700494, pitch: 0.5392654348998249, rotation: 0, target: "14-bedroom1-bath-1" },
                ],
              },
              {
                id: "14-bedroom1-bath-1",
                label: "Bedroom 1 — Bathroom",
                tilesPath: "/assets/3bhk/pano/bedrooms/bedroom-1/14-bedroom1-bath-1",
                preview: "/assets/3bhk/pano/bedrooms/bedroom-1/14-bedroom1-bath-1/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 2.1322399522364517, pitch: 0, fov: 1.4479588735060953 },
                minimapPos: { x: 36, y: 70 },    // ← placeholder
                radarNorthOffset: 200,              // ← placeholder
                linkHotspots: [
                  { yaw: -1.5717938108835892, pitch: 0.33860990427156423, rotation: 0, target: "4-bedroom1-view-2" },
                  { yaw: -1.5475509694880039, pitch: 0.6585184027775774, rotation: 0, target: "11-bedroom1-dresser-1" },
                ],
              },
            ],
          },

          // ── Bedroom 2 (3 scenes — includes balcony) ──
          {
            id: "bedroom-2",
            label: "Bedroom 2",
            defaultSceneId: "13-bedroom2-view-1",
            scenes: [
              {
                id: "13-bedroom2-view-1",
                label: "Bedroom 2 — View 1",
                tilesPath: "/assets/3bhk/pano/bedrooms/bedroom-2/13-bedroom2-view-1",
                preview: "/assets/3bhk/pano/bedrooms/bedroom-2/13-bedroom2-view-1/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: -0.6820768888947093, pitch: 0, fov: 1.4479588735060953 },
                minimapPos: { x: 82, y: 54 },    // ← placeholder
                radarNorthOffset: 180,              // ← placeholder
                linkHotspots: [
                  { yaw: 2.702999621963875, pitch: 0.5643102997671008, rotation: 0, target: "0-dining1-view-2" },
                  { yaw: 0.04594621585667369, pitch: 0.37004677036154376, rotation: 0, target: "5-bedroom2-view-2" },
                  { yaw: -2.8543604490553136, pitch: 0.18910352501185557, rotation: 0, target: "16-balcony" },
                ],
              },
              {
                id: "5-bedroom2-view-2",
                label: "Bedroom 2 — View 2",
                tilesPath: "/assets/3bhk/pano/bedrooms/bedroom-2/5-bedroom2-view-2",
                preview: "/assets/3bhk/pano/bedrooms/bedroom-2/5-bedroom2-view-2/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0, pitch: 0, fov: DEFAULT_FOV },
                minimapPos: { x: 82, y: 68 },    // ← placeholder
                radarNorthOffset: 45,              // ← placeholder
                linkHotspots: [
                  { yaw: -1.0306539752732622, pitch: 0.3392354636228774, rotation: 0, target: "13-bedroom2-view-1" },
                  { yaw: -1.0371417009902721, pitch: 0.1911170358186034, rotation: 0, target: "0-dining1-view-2" },
                ],
              },
              {
                id: "16-balcony",
                label: "Bedroom 2 — Balcony",
                tilesPath: "/assets/3bhk/pano/bedrooms/bedroom-2/16-balcony",
                preview: "/assets/3bhk/pano/bedrooms/bedroom-2/16-balcony/preview.jpg",
                levels: LEVELS_2K,
                faceSize: DEFAULT_FACE_SIZE,
                initialView: { yaw: 0.6098026383251387, pitch: 0, fov: 1.4479588735060953 },
                minimapPos: { x: 88, y: 35 },    // ← placeholder
                radarNorthOffset: 140,              // ← placeholder
                linkHotspots: [
                  { yaw: 1.4127934254226489, pitch: 0.3252868513934075, rotation: 0, target: "0-dining1-view-2" },
                ],
              },
            ],
          },
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
    const sub = subcategoryId
      ? category.subcategories?.find((s) => s.id === subcategoryId)
      : category.subcategories?.[0];

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