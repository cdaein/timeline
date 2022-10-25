# @daeinc/timeline

A Timeline object can hold multiple properties with keyframes. ex. position, rotation, color, etc., and makes it easy to group things together. In my own projects, I create multiple Timeline objects, one for each graphical object.

It builds on top of [`keyframes`](https://github.com/mattdesl/keyframes), but does not expose Keyframes library to user - user only needs to provide a minimum amount of necessary data. ex. `{ time, value, ... }`

In development, and breaking changes are expected in the future.

## Installation

```
npm i @daeinc/timeline
```

Then,

```js
import Timeline from "@daeinc/timeline";
```

## Examples

Pass a timeline name and a single property object (`{name, keyframes}`) or an array of property objects (`[{name, keyframes}, {name, keyframes}]`):

```js
const tl = new Timeline("my-timeline", {
  name: "position",
  keyframes: [
    { time: 0, value: 5 },
    { time: 1, value: 10 },
  ],
});

const v1 = tl.value("position", 0.5); // returns 7.5
```

Pass a custom interpolator function:

JS:

```js
const easeInQuad = (a, b, t) => {
  return lerp(a.value, b.value, t * t);
};

const v2 = tl.value("position", 0.5, easeInQuad);
console.log(v2); // 6.25
```

TS:

```ts
import type { Keyframe } from "@daeinc/timeline";

const easeInQuad = (a: Keyframe, b: Keyframe, t: number) => {
  return lerp(a.value, b.value, t * t);
};

const v2 = tl.value("position", 0.5, easeInQuad);
console.log(v2); // 6.25
```

## Methods

```ts
constructor(propOrProps?: InputProp | InputProp[]);

propExists(propName: string): boolean;

addKeyframe(propName: string, newKey: Keyframe): void;

addKeyframes(propName: string, ...newKeys: Keyframe[]): void;

getKeyframe(propName: string, timeStamp: number): Keyframe;

getKeyframes(propName: string): Keyframe[];

getName(): string;

getPropertyNames(): string[];

value(propName: string, timeStamp: number, interpolator?: Interpolator): any;

addProperty(propName: string, ...newKeys: Keyframe[]): void;

removeKeyframes(propName: string, index: number, howmany: number): void;

nearest(propName: string, timeStamp: number, radius?: number): Keyframe;

nearestIndex(propName: string, timeStamp: number, radius?: number): number;

next(propName: string, timeStamp: number): Keyframe;

previous(propName: string, timeStamp: number): Keyframe;

static fromJSON(file: string): Promise<void | Timeline>;

static from(data: {
  name: string;
  properties: InputProp[];
}): Timeline;

toJSON(): string;
```

## To Dos

- add more examples
  - how to add keyframes
  - how to import and export
- implement the rest of the methods from `keyframes` package
- add a separate `.d.ts` for `keyframes` JS package, or, create a TS version of the keyframes package as a `class`.
- throw errors or return null or guard against them?

## License

MIT
