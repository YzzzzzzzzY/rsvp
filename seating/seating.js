const TABLES = [
  { number: 1, seats: [1, 2, 3, 4, 5, 6, 7, 8], kind: "rectangular", lengthFeet: 8, x: 1250, y: 150, width: 110, height: 150 },
  { number: 2, seats: [9, 10, 11, 12, 13, 14], kind: "rectangular", lengthFeet: 6, x: 1250, y: 318.75, width: 110, height: 112.5 },
  { number: 3, seats: [15, 16, 17, 18, 19, 20, 21, 22], kind: "rectangular", lengthFeet: 8, x: 1250, y: 450, width: 110, height: 150 },
  { number: 4, seats: [23, 24, 25, 26, 27], kind: "large", x: 814, y: 114, width: 112, height: 112 },
  { number: null, seats: [28, 29, 30], kind: "small", x: 914, y: 179, width: 72, height: 72 },
  { number: 5, seats: [31, 32, 33, 34, 35], kind: "large", x: 944, y: 236, width: 112, height: 112 },
  { number: null, seats: [36, 37, 38], kind: "small", x: 984, y: 346, width: 72, height: 72 },
  { number: 6, seats: [39, 40, 41, 42, 43], kind: "large", x: 944, y: 416, width: 112, height: 112 },
  { number: null, seats: [44, 45, 46], kind: "small", x: 914, y: 513, width: 72, height: 72 },
  { number: 7, seats: [47, 48, 49, 50, 51], kind: "large", x: 814, y: 538, width: 112, height: 112 },
  { number: 8, seats: [52, 53, 54, 55, 56], kind: "large", x: 474, y: 114, width: 112, height: 112 },
  { number: null, seats: [57, 58, 59], kind: "small", x: 414, y: 179, width: 72, height: 72 },
  { number: 9, seats: [60, 61, 62, 63, 64], kind: "large", x: 344, y: 236, width: 112, height: 112 },
  { number: null, seats: [65, 66, 67], kind: "small", x: 344, y: 346, width: 72, height: 72 },
  { number: 10, seats: [68, 69, 70, 71, 72], kind: "large", x: 344, y: 416, width: 112, height: 112 },
  { number: null, seats: [73, 74, 75], kind: "small", x: 414, y: 513, width: 72, height: 72 },
  { number: 11, seats: [76, 77, 78, 79, 80], kind: "large", x: 474, y: 538, width: 112, height: 112 },
];

const SOURCE_SEAT_POSITIONS = {
  1:[477.72,89.5], 2:[533.95,82.74], 3:[578.5,117.72], 4:[585.26,173.95],
  5:[550.28,218.5], 6:[382.89,181.58], 7:[419.86,146.88], 8:[470.95,238.38],
  9:[313.32,297.93], 10:[315.76,247.37], 11:[350.13,210.2], 12:[457.74,282.14],
  13:[440.05,324.32], 14:[316.32,391.35], 15:[316.32,340.65], 16:[418,366],
  17:[350.13,521.8], 18:[315.76,484.63], 19:[313.32,434.07], 20:[440.05,407.68],
  21:[457.74,449.86], 22:[419.86,585.12], 23:[382.89,550.42], 24:[470.95,493.62],
  25:[550.28,513.5], 26:[585.26,558.05], 27:[578.5,614.28], 28:[533.95,649.26],
  29:[477.72,642.5], 30:[817.72,218.5], 31:[782.74,173.95], 32:[789.5,117.72],
  33:[834.05,82.74], 34:[890.28,89.5], 35:[948.14,146.88], 36:[985.11,181.58],
  37:[897.05,238.38], 38:[1017.87,210.2], 39:[1052.24,247.37],
  40:[1054.68,297.93], 41:[927.95,324.32], 42:[910.26,282.14],
  43:[1051.68,340.65], 44:[1051.68,391.35], 45:[950,366], 46:[1054.68,434.07],
  47:[1052.24,484.63], 48:[1017.87,521.8], 49:[910.26,449.86],
  50:[927.95,407.68], 51:[985.11,550.42], 52:[948.14,585.12],
  53:[897.05,493.62], 54:[890.28,642.5], 55:[834.05,649.26],
  56:[789.5,614.28], 57:[782.74,558.05], 58:[817.72,513.5], 59:[1214,158],
  60:[1214,192], 61:[1214,226], 62:[1214,260], 63:[1364,158], 64:[1364,192],
  65:[1364,226], 66:[1364,260], 67:[1214,308], 68:[1214,342], 69:[1214,376],
  70:[1214,410], 71:[1364,308], 72:[1364,342], 73:[1364,376], 74:[1364,410],
  75:[1214,458], 76:[1214,492], 77:[1214,526], 78:[1214,560], 79:[1364,458],
  80:[1364,492], 81:[1364,526], 82:[1364,560],
};
const SEAT_NUMBER_ORDER = [
  63, 64, 65, 66, 62, 61, 60, 59,
  71, 72, 73, 69, 68, 67,
  79, 80, 81, 82, 78, 77, 76, 75,
  ...Array.from({ length: 29 }, (_, index) => index + 30),
  ...Array.from({ length: 29 }, (_, index) => index + 1),
];
const SEAT_POSITIONS = Object.fromEntries(
  SEAT_NUMBER_ORDER.map((sourceSeat, index) => [index + 1, SOURCE_SEAT_POSITIONS[sourceSeat]]),
);

const SCALE = 1.18;
const SOURCE_ORIGIN = { x: 280, y: 55 };
const PLAN_OFFSET = { x: 40, y: 45 };
const ROUND_TABLE_PIXELS_PER_INCH = 1.7;
const ROUND_TABLE_DIAMETERS = { large: 60, small: 48 };

function planX(sourceX) {
  return (sourceX - SOURCE_ORIGIN.x) * SCALE + PLAN_OFFSET.x;
}

function planY(sourceY) {
  return (sourceY - SOURCE_ORIGIN.y) * SCALE + PLAN_OFFSET.y;
}

function renderTable(table) {
  const surface = document.createElement("div");
  surface.className = `floor-table ${table.kind}`;
  const diameterInches = ROUND_TABLE_DIAMETERS[table.kind];
  const sourceWidth = diameterInches
    ? diameterInches * ROUND_TABLE_PIXELS_PER_INCH
    : table.width;
  const sourceHeight = diameterInches
    ? diameterInches * ROUND_TABLE_PIXELS_PER_INCH
    : table.height;
  const sourceX = table.x + (table.width - sourceWidth) / 2;
  const sourceY = table.y + (table.height - sourceHeight) / 2;
  surface.style.left = `${planX(sourceX)}px`;
  surface.style.top = `${planY(sourceY)}px`;
  surface.style.width = `${sourceWidth * SCALE}px`;
  surface.style.height = `${sourceHeight * SCALE}px`;
  surface.innerHTML =
    table.kind === "small"
      ? ""
      : diameterInches
        ? `T${table.number}`
        : `${table.lengthFeet} ft<br>T${table.number}`;
  return surface;
}

function renderSeat(seat) {
  const [sourceX, sourceY] = SEAT_POSITIONS[seat];
  const element = document.createElement("div");
  element.className = "seat";
  element.style.left = `${planX(sourceX)}px`;
  element.style.top = `${planY(sourceY)}px`;
  element.textContent = String(seat);
  element.setAttribute("aria-label", `Empty seat ${seat}`);
  return element;
}

const floorPlan = document.querySelector("#floor-plan");
for (const table of TABLES) {
  floorPlan.append(renderTable(table));
  for (const seat of table.seats) floorPlan.append(renderSeat(seat));
}
