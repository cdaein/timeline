import Timeline from "../index";
import { mix } from "@daeinc/math";
import type { Keyframe } from "../index";

// with no properties
const tl1 = new Timeline();

// with empty properties array
const tl2 = new Timeline([]);

// with single property + empty keyframesObj
const tl3 = new Timeline([{ name: "position", keyframes: [] }]);
// console.log(tl3.properties.length);

// with single property + single keyframe
const tl4 = new Timeline([
  { name: "position", keyframes: [{ time: 0, value: 0 }] },
]);

// with single property + multiple keyframes
const tl5 = new Timeline([
  {
    name: "position",
    keyframes: [
      { time: 0, value: 5 },
      { time: 1, value: 10 },
    ],
  },
]);

const linear = (a: Keyframe, b: Keyframe, t: number) =>
  mix(a.value, b.value, t);

console.log(tl5.value("position", 0, linear));
