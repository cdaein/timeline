import Timeline from "../index";
import { lerp } from "@daeinc/math";
import { interpolateArray } from "@daeinc/array";
import type { Keyframe } from "../index";
import { single, multiple } from "./data";

const tl = new Timeline("my-timeline", {
  name: "position",
  keyframes: [
    { time: 0, value: 5 },
    { time: 1, value: 10 },
  ],
});

const v1 = tl.value("position", 0.5);
console.log(v1); // 7.5

const easeInQuad = (a: Keyframe, b: Keyframe, t: number) => {
  return lerp(a.value, b.value, t * t);
};

const v2 = tl.value("position", 0.5, easeInQuad);
console.log(v2); // 6.25

// this is a workaround due to top-level await error.
const main = async () => {
  const tl2 = (await Timeline.fromJSON("./single.json")) as Timeline;
  const val = tl2.value("position", 0.5);
  console.log("Timeline.fromJSON().value()", val);
};

main();

const tl3 = Timeline.from(single);
const v3 = tl3.value("position", 0.5);
console.log("Timeline.from().value()", v3);

// TODO: handle importing JSON with multiple timelines
