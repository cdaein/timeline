/**
 * TODO:
 * - use unwrapArrayOfObject() in a method??
 * - Type names are still confusing..
 *   - Keyframe => TimeValue (more direct)
 *
 * /// <reference path="keyframes.d.ts"/>
 */
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
    interpolation(time: number): [
        startFrameIndex: number,
        endFrameIndex: number,
        interpolationFactor: number
    ];
}
export interface Keyframe {
    time: number;
    value: any | any[];
    [name: string]: any;
}
interface Prop {
    name: string;
}
interface InputProp extends Prop {
    keyframes: Keyframe[];
}
interface InternalProp extends Prop {
    keyframes: KeyframesFull;
}
export declare type Interpolator = (a: Keyframe, b: Keyframe, t: number, out?: any[]) => any;
export default class Timeline {
    name: string;
    properties: InternalProp[];
    /**
     * @param propOrProps a single or multiple properties. ex. { name: 'circle', keyframes: {time, value} }
     * @returns Timeline object
     */
    constructor(name: string, propOrProps?: InputProp | InputProp[]);
    _convertToKeyframesFull(arr: Keyframe[]): KeyframesFull;
    /**
     * REVIEW:
     * - I don't want to expose KeyframesFull object
     * - If I do, then transform KeyframesFull to Keyframe[] first, and return whole property
     * returns { name, keyframes }
     * @param propName
     * @returns property object
     */
    _getProperty(propName: string): InternalProp | undefined;
    /**
     * check whether given property already exists.
     * @param propName
     * @returns true if exists
     */
    propExists(propName: string): boolean;
    /**
     * if key already exists at time, replace it. otherwise, add a new key.
     * @param propName name of property ie. "position", "size"
     * @param newKey { time, value, ease, ... }
     */
    addKeyframe(propName: string, newKey: Keyframe): void;
    /**
     * adds multiple new keyframes by adding onto arguments
     * @param propName
     * @param ...newKeys
     */
    addKeyframes(propName: string, ...newKeys: Keyframe[]): void;
    /**
     * get a keyframe
     * @param propName
     * @param timeStamp
     * @returns Keyframe { time, value }
     */
    getKeyframe(propName: string, timeStamp: number): Keyframe;
    /**
     * get all keyframes
     * @param propName
     * @returns keyframes array [{time, value}, {time, value}, ...]
     */
    getKeyframes(propName: string): Keyframe[];
    /**
     * returns full Keyframes object (inc. methods, ..)
     * @param propName
     * @returns keyframes object
     */
    getKeyframesFull(propName: string): KeyframesFull;
    /**
     * return the name of this timeline
     * @returns name of this timeline
     */
    getName(): string;
    /**
     * returns all property names
     * @returns array of property names
     */
    getPropertyNames(): string[];
    /**
     * calculate value at timestamp with optional easing.
     * @param propName
     * @param timeStamp
     * @param interpolator fn(a, b, t, out?)
     * @returns
     */
    value(propName: string, timeStamp: number, interpolator?: Interpolator): any;
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
    /**
     * add a new property with or without keyframe
     * @param propName name of property. ex. "position"
     * @param newKeys can take optional keyframe(s)
     */
    addProperty(propName: string, ...newKeys: Keyframe[]): void;
    /**
     * clear all keyframes and replace with new keys.
     *
     * TODO:
     * - review keys.splice() for replacement
     * @param propName
     * @param newKeys
     */
    /**
     * remove keyframe(s) in place.
     *
     * TODO:
     * - not fully implemented (optional parameter to replace)
     * @param propName property name. ie. "position"
     * @param index from which one to remove
     * @param howmany how many to remove
     */
    removeKeyframes(propName: string, index: number, howmany: number): void;
    nearest(propName: string, timeStamp: number, radius?: number): Keyframe;
    nearestIndex(propName: string, timeStamp: number, radius?: number): number;
    /**
     * clamps if beyond last keyframe
     * @param propName
     * @param timeStamp
     * @returns keyframe object { time, value, .. }
     */
    next(propName: string, timeStamp: number): Keyframe;
    /**
     * clamps if less than first keyframe
     * @param propName
     * @param timeStamp
     * @returns keyframe object { time, value, .. }
     */
    previous(propName: string, timeStamp: number): Keyframe;
}
export {};
//# sourceMappingURL=index.d.ts.map