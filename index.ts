/**
 * TODO:
 * - use unwrapArrayOfObject() in a method??
 * - Type names are still confusing..
 *   - Keyframe => TimeValue (more direct)
 *
 * /// <reference path="keyframes.d.ts"/>
 */

const Keyframes = require("keyframes");

// Keyframes object is what all methods are called upon
// it is *NOT* an array of Keyframe type
// REVIEW: consider creating a separate d.ts declaration file for the library.
interface KeyframesFull {
  nearest(timeStamp: number, radius?: number): Keyframe;
  nearestIndex(timeStamp: number, radius?: number): number;
  get(timeStamp: number): Keyframe;
  getIndex(timeStamp: number): number;
  value(timeStamp: number, interpolator?: Interpolator, out?: any): any;
  next(timeStamp: number): Keyframe;
  previous(timeStamp: number): Keyframe;
  add(frame: Keyframe): any;
  splice(index: number, howmany: number, ...itemN: Keyframe[]): void;
  sort(): void;
  clear(): void;
  frames: Keyframe[];
  count: number;
  interpolation(
    time: number
  ): [
    startFrameIndex: number,
    endFrameIndex: number,
    interpolationFactor: number
  ];
}

// Keyframe simple object { time, value, ease, ... }
export interface Keyframe {
  time: number;
  value: any | any[]; // usually number or number[] but could be {x, y}, etc.
  [name: string]: any;
}

// base Prop
interface Prop {
  name: string;
}
// provided by user. simple Keyframe type
interface InputProp extends Prop {
  keyframes: Keyframe[];
}
// InputProp must be converted to InternalProp be internally used as it uses Keyframes library object
interface InternalProp extends Prop {
  keyframes: KeyframesFull;
}

// not sure how I feel about 'any' here...
export type Interpolator = (
  a: Keyframe,
  b: Keyframe,
  t: number,
  out?: any[]
) => any;

export default class Timeline {
  name: string;
  properties: InternalProp[];

  /**
   * @param propOrProps a single or multiple properties. ex. { name: 'circle', keyframes: {time, value} }
   * @returns Timeline object
   */
  constructor(name: string, propOrProps?: InputProp | InputProp[]) {
    this.name = name; // name of this timeline

    if (propOrProps !== undefined) {
      if (Array.isArray(propOrProps)) {
        // InputProp[]
        this.properties = propOrProps.map((prop) => {
          const name = prop.name;
          const keyframes = this._convertToKeyframesFull(prop.keyframes);
          return { name, keyframes };
        });
      } else {
        // InputProp
        const name = propOrProps.name;
        const keyframes = this._convertToKeyframesFull(propOrProps.keyframes);
        this.properties = [{ name, keyframes }];
      }
    } else {
      // propOrProps undefined
      this.properties = [];
    }
  }

  _convertToKeyframesFull(arr: Keyframe[]): KeyframesFull {
    return Keyframes(arr);
  }

  _convertToKeyframesInput(arr: KeyframesFull[]): Keyframe[] {
    return [];
  }

  /**
   * REVIEW:
   * - I don't want to expose KeyframesFull object
   * - If I do, then transform KeyframesFull to Keyframe[] first, and return whole property
   * returns { name, keyframes }
   * @param propName
   * @returns property object
   */
  _getProperty(propName: string) {
    return this.properties.find((prop) => prop.name === propName);
  }

  /**
   * check whether given property already exists.
   * @param propName
   * @returns true if exists
   */
  propExists(propName: string) {
    return this._getProperty(propName) !== undefined;
  }

  /**
   * if key already exists at time, replace it. otherwise, add a new key.
   * @param propName name of property ie. "position", "size"
   * @param newKey { time, value, ease, ... }
   */
  addKeyframe(propName: string, newKey: Keyframe) {
    if (this.propExists(propName)) {
      // keys.add() simply pushes and doesn't check for timeStamp duplicates.
      const keys = this.getKeyframesFull(propName);
      const existingIndex = keys.getIndex(newKey.time);
      if (existingIndex === -1) {
        keys.add(newKey);
      } else {
        keys.frames[existingIndex] = newKey;
      }
    } else {
      this.properties.push({
        name: propName,
        keyframes: Keyframes(newKey ? [newKey] : []),
      });
    }
  }

  /**
   * adds multiple new keyframes by adding onto arguments
   * @param propName
   * @param ...newKeys
   */
  addKeyframes(propName: string, ...newKeys: Keyframe[]) {
    for (let i = 1; i < arguments.length; i++) {
      this.addKeyframe(propName, arguments[i]);
    }
  }

  /**
   * get a keyframe
   * @param propName
   * @param timeStamp
   * @returns Keyframe { time, value }
   */
  getKeyframe(propName: string, timeStamp: number): Keyframe {
    const prop = this._getProperty(propName);
    if (prop !== undefined) {
      const key = prop.keyframes.get(timeStamp);
      if (key !== null) {
        return key;
      } else {
        throw new Error(
          `Timeline.getKeyframe(): key does not exist at timeStamp: ${timeStamp}`
        );
      }
    }
    throw new Error(`Timeline.getKeyframe(): cannot find prop: ${propName}`);
  }

  /**
   * get all keyframes
   * @param propName
   * @returns keyframes array [{time, value}, {time, value}, ...]
   */
  getKeyframes(propName: string): Keyframe[] {
    const prop = this._getProperty(propName);
    if (prop !== undefined) {
      return prop.keyframes.frames;
    }
    throw new Error(`Timeline.getKeyframes(): cannot find prop: ${propName}`);
  }

  /**
   * returns full Keyframes object (inc. methods, ..)
   * @param propName
   * @returns keyframes object
   */
  getKeyframesFull(propName: string): KeyframesFull {
    const prop = this._getProperty(propName);
    if (prop !== undefined) {
      return prop.keyframes;
    }
    throw new Error(`Timeline.getKeyframes(): cannot find prop: ${propName}`);
  }

  /**
   * return the name of this timeline
   * @returns name of this timeline
   */
  getName(): string {
    return this.name;
  }

  /**
   * returns all property names
   * @returns array of property names
   */
  getPropertyNames(): string[] {
    return this.properties.map((prop) => prop.name);
  }

  /**
   * calculate value at timestamp with optional easing.
   * @param propName
   * @param timeStamp
   * @param interpolator fn(a, b, t, out?)
   * @returns
   */
  value(propName: string, timeStamp: number, interpolator?: Interpolator): any {
    // check interpolator type - number, array, 2d array
    return this.getKeyframesFull(propName).value(timeStamp, interpolator);
  }

  /**
   * returns all property values at given timestamp
   *
   * TODO:
   * - implement
   * - confusing that value() returns value, but values() will return entire object
   * @param timeStamp
   * @param interpolator fn(a,b,t)
   * @returns array of numbers
   */
  // values(timeStamp: number, interpolator: Interpolator): InternalProp[] {
  //   return[];
  // }

  /**
   * add a new property with or without keyframe
   * @param propName name of property. ex. "position"
   * @param newKeys can take optional keyframe(s)
   */
  addProperty(propName: string, ...newKeys: Keyframe[]) {
    if (!this.propExists(propName)) {
      this.properties.push({
        name: propName,
        keyframes: Keyframes(newKeys ? [newKeys[0]] : []),
      });
      for (let i = 2; i < arguments.length; i++) {
        this.addKeyframe(propName, arguments[i]);
      }
    } else {
      throw new Error(`addProperty(): property: ${propName} already exists`);
    }
  }

  /**
   * clear all keyframes and replace with new keys.
   *
   * TODO:
   * - review keys.splice() for replacement
   * @param propName
   * @param newKeys
   */
  // replaceKeyframes(propName: string, newKeys: object) {
  //   //
  // }

  /**
   * remove keyframe(s) in place.
   *
   * TODO:
   * - not fully implemented (optional parameter to replace)
   * @param propName property name. ie. "position"
   * @param index from which one to remove
   * @param howmany how many to remove
   */
  removeKeyframes(propName: string, index: number, howmany: number) {
    const keys = this.getKeyframesFull(propName);
    keys.splice(index, howmany);
  }

  // TODO
  // removeProperty(propName: string) {
  //   //
  // }

  nearest(propName: string, timeStamp: number, radius?: number) {
    return this.getKeyframesFull(propName).nearest(timeStamp, radius);
  }
  nearestIndex(propName: string, timeStamp: number, radius?: number) {
    return this.getKeyframesFull(propName).nearestIndex(timeStamp, radius);
  }

  /**
   * clamps if beyond last keyframe
   * @param propName
   * @param timeStamp
   * @returns keyframe object { time, value, .. }
   */
  next(propName: string, timeStamp: number) {
    const next = this.getKeyframesFull(propName).next(timeStamp);
    if (next === null) {
      return this.nearest(propName, timeStamp);
    }
    return next;
  }

  /**
   * clamps if less than first keyframe
   * @param propName
   * @param timeStamp
   * @returns keyframe object { time, value, .. }
   */
  previous(propName: string, timeStamp: number) {
    const prev = this.getKeyframesFull(propName).previous(timeStamp);
    if (prev === null) {
      return this.nearest(propName, timeStamp);
    }
    return prev;
  }

  // get(propName: string, timeStamp: number) {
  //   return this.nearest(propName, timeStamp, 0);
  // }

  // getIndex(propName: string, timeStamp: number) {
  //   return this.nearestIndex(propName, timeStamp, 0);
  // }

  /**
   * uses fetch API to load JSON file and convert to new Timeline object
   * @param file file path
   * @returns new Timeline object
   */
  static fromJSON(file: string) {
    return fetch(file)
      .then((res) => res.json())
      .then((data) => {
        // 2. set timeline name
        const name = data.name;
        // 3. set properties
        const properties: InputProp[] = [];
        for (let i = 0; i < data.properties.length; i++) {
          const prop: InputProp = data.properties[i];
          properties.push(prop);
        }
        return new Timeline(name, properties);
      })
      .catch((e) => {
        console.error(`Could not load JSON file: ${e.message}`);
      });
  }

  /**
   * creates a new Timeline object from data object
   * @param data object { name, properties[] }
   * @returns new Timeline object
   */
  static from(data: { name: string; properties: InputProp[] }) {
    const name: string = data.name;
    const properties: InputProp[] = data.properties;
    return new Timeline(name, properties);
  }

  // TODO: implement
  toJSON() {
    const inputKeyframes = this._convertToKeyframesInput([]);

    // get Timeline name
    // for each property
    //   get propName
    //   get keyframes => convert back to regular array
    // convert to object format
    // return as string
    return "";
  }
}
