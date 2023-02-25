import Timeline from "../index";
import { lerp } from "@daeinc/math";
// import { interpolateArray } from "@daeinc/array";
import type { Frame } from "../index";
import { single, multiple } from "./data";

const tl = new Timeline("my-timeline", {
  name: "position",
  keyframes: [
    { time: 0, value: 5 },
    { time: 1, value: 10 },
  ],
});

// without interpolator
const v1 = tl.value("position", 0.5);
console.assert(v1 === 7.5); // 7.5

const easeInQuad = (a: Frame, b: Frame, t: number) => {
  return lerp(a.value as number, b.value as number, t * t);
};

// with interpolator
const v2 = tl.value("position", 0.5, easeInQuad);
console.assert(v2 === 6.25); // 6.25

const main = async () => {
  const tl2 = (await Timeline.fromJSON("./single.json")) as Timeline;
  const val = tl2.value("position", 0.5);
  console.log("JSON to Timeline", val); // [400, 200]

  const backToJson = tl2.toJSON();
  console.log(backToJson);
  const tl3 = Timeline.from(JSON.parse(backToJson));
  const v3 = tl3.value("position", 0.5);
  console.log("JSON to Timeline to JSON to Timeline", v3);
};
main();

const tl4 = Timeline.from(single);
const v4 = tl4.value("position", 0.5);
console.log("Timeline.from().value()", v4);

// TODO: handle importing JSON with multiple timelines
