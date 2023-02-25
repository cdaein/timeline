import { describe, test, expect } from "vitest";
import Timeline, { Frame, Interpolator } from "./index";
import { mix } from "@daeinc/math";

const prop1 = { name: "position", keyframes: [] };
const prop2 = {
  name: "position",
  keyframes: [{ time: 0, value: 10 }],
};
const prop3 = {
  name: "position",
  keyframes: [
    { time: 0, value: 10 },
    { time: 1, value: 20 },
  ],
};
const prop4 = {
  name: "color",
  keyframes: [
    { time: 0, value: [0, 0, 0] },
    { time: 1, value: [0, 0, 1] },
  ],
};

const name = "rect-1";

// with no properties
const tl1 = new Timeline(name);
const tl2 = new Timeline(name, []);

// single property object
const tl3 = new Timeline(name, prop1);
const tl4 = new Timeline(name, prop3);

// with properties array + keyframes
const tl5 = new Timeline(name, [prop1]);
const tl6 = new Timeline(name, [prop2]);
const tl7 = new Timeline(name, [prop3]);
const tl8 = new Timeline(name, [prop3, prop4]);

const linear: Interpolator = (a, b, t) => mix(a.value, b.value, t);

describe("Timeline constructor()", () => {
  test("creates a new Timeline object", () => {
    expect(typeof tl1).toEqual("object");
    expect(typeof tl2.value).toEqual("function");
    expect(typeof tl6.value).toEqual("function");
    expect(Array.isArray(tl1.properties)).toEqual(true);
    expect(Array.isArray(tl2.properties)).toEqual(true);
    expect(Array.isArray(tl3.properties)).toEqual(true);
    expect(Array.isArray(tl5.properties)).toEqual(true);
  });
  test("can access properties array", () => {
    expect(tl3.properties.length).toEqual(1);
    expect(tl8.properties.length).toEqual(2);
    expect(typeof tl3.properties[0]).toEqual("object");
    expect(tl3.properties[0].name).toEqual("position");
  });
  test("creates a new object without argument", () => {
    expect(tl1 instanceof Timeline).toEqual(true);
    expect(tl2 instanceof Timeline).toEqual(true);
  });
});

describe("propExists()", () => {
  test("returns false if property does not exist", () => {
    expect(tl1.propExists("position")).toEqual(false);
  });
  test("returns true if property exists", () => {
    expect(tl3.propExists("position")).toEqual(true);
    expect(tl8.propExists("color")).toEqual(true);
  });
});

describe("addKeyframe()", () => {
  test("adds a new keyframe and a new property", () => {
    tl1.addKeyframe("opacity", { time: 0, value: 0.5 });
    tl2.addKeyframe("opacity", { time: 0, value: 0.5 });
    expect(tl1.propExists("opacity")).toEqual(true);
    expect(tl1.properties.length).toEqual(1);
    expect(tl1.properties[0].name).toEqual("opacity");
    expect(tl1.properties[0].keyframes.frames[0].value).toEqual(0.5);
    expect(tl2.propExists("opacity")).toEqual(true);
    expect(tl2.properties.length).toEqual(1);
    expect(tl2.properties[0].name).toEqual("opacity");
    expect(tl2.properties[0].keyframes.frames[0].value).toEqual(0.5);
  });
  test("adds a new keyframe to an existing property", () => {
    const tl = new Timeline(name, {
      name: "position",
      keyframes: [{ time: 1, value: 5 }],
    });
    tl.addKeyframe("position", { time: 2, value: 10 });
    expect(tl.properties[0].name).toBe("position");
    expect(tl.properties[0].keyframes.frames[1].time).toBe(2);
    expect(tl.properties[0].keyframes.frames[1].value).toBe(10);
  });
  test("replaces a keyframe if timeStamp is the same", () => {
    const tl = new Timeline(name, {
      name: "position",
      keyframes: [{ time: 1, value: 5 }],
    });
    tl.addKeyframe("position", { time: 1, value: 10 });
    expect(tl.properties[0].name).toBe("position");
    expect(tl.properties[0].keyframes.frames.length).toBe(1);
    expect(tl.properties[0].keyframes.frames[0].value).toBe(10);
  });
  test("handles an optional filed (ease) in a keyframe", () => {
    const tl = new Timeline(name, {
      name: "position",
      keyframes: [{ time: 1, value: 5 }],
    });
    tl.addKeyframe("position", { time: 2, value: 10, ease: "sineIn" });
    expect(tl.properties[0].keyframes.frames[1].value).toBe(10);
    expect(tl.properties[0].keyframes.frames[1].ease).toBe("sineIn");
  });
});

describe("addKeyframes()", () => {
  test("adds multiple new keyframes in one call", () => {
    const tl = new Timeline(name);
    tl.addKeyframes("position", { time: 0, value: 1 }, { time: 1, value: 10 });
    expect(tl.properties[0].name).toEqual("position");
    expect(tl.properties[0].keyframes.frames.length).toEqual(2);
    expect(tl.properties[0].keyframes.frames[1].value).toEqual(10);
  });
});

describe("getKeyframe()", () => {
  const tl = new Timeline(name, {
    name: "position",
    keyframes: [
      { time: 1, value: 5 },
      { time: 2, value: 10 },
    ],
  });
  test("throws error if a prop does not exist", () => {
    expect(() => tl.getFrame("color", 1)).toThrow("cannot find prop");
  });
  test("throws error if a key does not exist", () => {
    expect(() => tl.getFrame("position", 0.8)).toThrow("key does not exist");
  });
  test("returns a keyframe object", () => {
    const key = tl.getFrame("position", 1);
    expect(key).toEqual({ time: 1, value: 5 });
  });
});

describe("getKeyframes()", () => {
  test("returns keyframes object", () => {
    const tl = new Timeline(name, {
      name: "position",
      keyframes: [],
    });
    const tl2 = new Timeline(name, {
      name: "position",
      keyframes: [
        { time: 1, value: 5 },
        { time: 2, value: 10 },
      ],
    });
    expect(tl.getFrames("position")).toEqual([]);
    expect(tl2.getFrames("position")).toEqual([
      { time: 1, value: 5 },
      { time: 2, value: 10 },
    ]);
  });
});

describe("getName()", () => {
  test("returns name of timeline", () => {
    expect(tl1.getName()).toEqual("rect-1");
  });
});

describe("getPropertyNames()", () => {
  test("returns name of all properties", () => {
    expect(tl8.getPropertyNames()).toEqual(["position", "color"]);
  });
});

describe("value()", () => {
  const tl = new Timeline(name, {
    name: "position",
    keyframes: [
      { time: 0, value: 5 },
      { time: 1, value: 10 },
    ],
  });
  test("returns correct value", () => {
    expect(tl.value("position", 0)).toEqual(5);
    expect(tl.value("position", 0.5)).toEqual(7.5);
    expect(tl.value("position", 1)).toEqual(10);
  });
  test("returns correct value with interpolator", () => {
    expect(tl.value("position", 0, linear)).toEqual(5);
    expect(tl.value("position", 0.5, linear)).toEqual(7.5);
  });
  test("returns clamped value if outside timeStamp range", () => {
    expect(tl.value("position", 2, linear)).toEqual(10);
  });
  test("interpolates array value", () => {
    // TODO
  });
});

describe("addProperty()", () => {
  const tl = new Timeline(name, {
    name: "position",
    keyframes: [
      { time: 0, value: 5 },
      { time: 1, value: 10 },
    ],
  });
  test("adds a new property without keyframe", () => {
    tl.addProperty("rotation");
    expect(tl.properties[1].name).toEqual("rotation");
    // expect(tl.properties[1].keyframes.frames).toEqual([]);
  });
  test("adds a new property with keyframes", () => {
    tl.addProperty("alpha", { time: 1, value: 0.5 });
    tl.addProperty(
      "color",
      { time: 0, value: 0 },
      { time: 1, value: 1 },
      { time: 2, value: 2 }
    );
    expect(tl.properties[2].name).toEqual("alpha");
    expect(tl.properties[2].keyframes.frames.length).toEqual(1);
    expect(tl.properties[3].name).toEqual("color");
    expect(tl.properties[3].keyframes.frames.length).toEqual(3);
    expect(tl.properties[3].keyframes.frames[2]).toEqual({ time: 2, value: 2 });
  });
  test("handles when property already exists", () => {
    expect(() => tl.addProperty("position")).toThrow("already exists");
    expect(() => tl.addProperty("position", { time: 2, value: 15 })).toThrow(
      "already exists"
    );
  });
});

describe("removeKeyframes()", () => {
  test("removes single keyframe", () => {
    const tl = new Timeline(name, {
      name: "position",
      keyframes: [
        { time: 0, value: 5 },
        { time: 1, value: 10 },
        { time: 2, value: 15 },
      ],
    });
    tl.removeKeyframes("position", 1, 1);
    expect(tl.properties[0].name).toEqual("position");
    expect(tl.properties[0].keyframes.frames.length).toEqual(2);
    expect(tl.properties[0].keyframes.frames[1]).toEqual({
      time: 2,
      value: 15,
    });
  });
  test("removes multiple keyframes", () => {
    const tl = new Timeline(name, {
      name: "position",
      keyframes: [
        { time: 0, value: 5 },
        { time: 1, value: 10 },
        { time: 2, value: 15 },
      ],
    });
    tl.removeKeyframes("position", 0, 2);
    expect(tl.properties[0].name).toEqual("position");
    expect(tl.properties[0].keyframes.frames.length).toEqual(1);
    expect(tl.properties[0].keyframes.frames[0]).toEqual({
      time: 2,
      value: 15,
    });
  });
  test("returns empty [] when keyframes are empty", () => {
    const tl = new Timeline(name, {
      name: "position",
      keyframes: [{ time: 0, value: 5 }],
    });
    tl.removeKeyframes("position", 0, 2);
    expect(tl.properties[0].name).toEqual("position");
    expect(tl.properties[0].keyframes.frames).toEqual([]);
  });
});

describe("nearest()", () => {
  const tl = new Timeline(name, {
    name: "position",
    keyframes: [
      { time: 0, value: 5 },
      { time: 1, value: 10 },
      { time: 2, value: 15 },
    ],
  });
  test("returns nearest keyframe object", () => {
    expect(tl.nearest("position", 0.2, 0.5)).toEqual({ time: 0, value: 5 });
  });
  test("clamps to either end of keyframe object", () => {
    expect(tl.nearest("position", -0.5, 0.5)).toEqual({ time: 0, value: 5 });
    expect(tl.nearest("position", 2.5, 0.5)).toEqual({ time: 2, value: 15 });
  });
});

describe("nearestIndex()", () => {
  const tl = new Timeline(name, {
    name: "position",
    keyframes: [
      { time: 0, value: 5 },
      { time: 1, value: 10 },
      { time: 2, value: 15 },
    ],
  });
  test("returns nearest index", () => {
    expect(tl.nearestIndex("position", 0.4, 0.5)).toEqual(0);
  });
  test("clamps to either end of nearest index", () => {
    expect(tl.nearestIndex("position", -0.5)).toEqual(0);
    expect(tl.nearestIndex("position", 2.5, 0.5)).toEqual(2);
  });
});
describe("next()", () => {
  const tl = new Timeline(name, {
    name: "position",
    keyframes: [
      { time: 0, value: 5 },
      { time: 1, value: 10 },
      { time: 2, value: 15 },
    ],
  });
  test("returns next keyframe object", () => {
    expect(tl.next("position", 0.1)).toEqual({ time: 1, value: 10 });
    expect(tl.next("position", 1.4)).toEqual({ time: 2, value: 15 });
  });
  test("clamps to previous keyframe object", () => {
    expect(tl.next("position", 12.5)).toEqual({ time: 2, value: 15 });
  });
});
describe("previous()", () => {
  const tl = new Timeline(name, {
    name: "position",
    keyframes: [
      { time: 0, value: 5 },
      { time: 1, value: 10 },
      { time: 2, value: 15 },
    ],
  });
  test("returns previous keyframe object", () => {
    expect(tl.previous("position", 0.1)).toEqual({ time: 0, value: 5 });
    expect(tl.previous("position", 1.4)).toEqual({ time: 1, value: 10 });
  });
  test("clamps to next keyframe object", () => {
    expect(tl.previous("position", -1.5)).toEqual({ time: 0, value: 5 });
  });
});

// describe("get()", () => {
//   const tl = new Timeline(name, {
//     name: "position",
//     keyframes: [
//       { time: 0, value: 5 },
//       { time: 1, value: 10 },
//     ],
//   });
//   test("returns keyframe object", () => {
//     expect(tl.get("position", 0)).toEqual({ time: 0, value: 5 });
//   });
//   test("returns closest keyframe object", () => {
//     expect(tl.get("position", 0.4)).toEqual({ time: 0, value: 5 });
//   });
// });
// describe("getIndex()", () => {
//   test("", () => {
//     // expect().toEqual()
//   });
// });

describe("fromJSON()", () => {
  test("creates a new Timeline object from JSON file", () => {
    // TODO
    // expect().toEqual()
  });
});

describe("toJSON()", () => {
  test("convert data to JSON format", () => {
    // TODO
    // expect().toEqual()
  });
});

describe("from()", () => {
  test("create a new Timeline object from JS data object", () => {
    // TODO
    // expect().toEqual()
  });
});
