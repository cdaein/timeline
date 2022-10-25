# @daeinc/timeline

A Timeline object can hold multiple properties with keyframes. ex. position, rotation, color, etc., and makes it easy to group things.

It builds on top of [`keyframes`](https://github.com/mattdesl/keyframes), but does not expose Keyframes library to user - user only needs to provide a minimum amount of necessary data. ex. `{ time, value, ... }`

In development, and may not work properly.

## To Dos

- add a separate `.d.ts` for `keyframes` JS package, or, create a TS version of the keyframes package as a `class`.
- throw errors or return null or guard against?
- implement the rest of the methods from `keyframes` package

## License

MIT
