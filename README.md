# @daeinc/timeline

A Timeline object can hold multiple properties with keyframes. ex. position, rotation, color, etc., and makes it easy to group things together. In my own projects, I create multiple Timeline objects, one for each graphical object.

It builds on top of [`keyframes`](https://github.com/mattdesl/keyframes), but does not expose Keyframes library to user - user only needs to provide a minimum amount of necessary data. ex. `{ time, value, ... }`

In development, and may not work properly.

## Installation

```
npm i @daeinc/timeline
```

```js
import Timeline from "@daeinc/timeline";
```

## Examples

```js
const tl = new Timeline([
  {
    name: "position",
    keyframes: [
      { time: 0, value: 5 },
      { time: 1, value: 10 },
    ],
  },
]);

const v1 = tl.value("position", 0.5); // returns 7.5
```

Pass a custom interpolator function.

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

## To Dos

- add a separate `.d.ts` for `keyframes` JS package, or, create a TS version of the keyframes package as a `class`.
- throw errors or return null or guard against?
- implement the rest of the methods from `keyframes` package

## License

MIT
