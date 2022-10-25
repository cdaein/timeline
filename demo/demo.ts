import Timeline from "../index";
import { lerp } from "@daeinc/math";
import type { Keyframe } from "../index";

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
