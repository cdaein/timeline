"use strict";
/**
 * TODO:
 * - use unwrapArrayOfObject() in a method??
 * - Type names are still confusing..
 *   - Keyframe => TimeValue (more direct)
 *
 * /// <reference path="keyframes.d.ts"/>
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Keyframes = require("keyframes");
class Timeline {
    /**
     * @param propOrProps a single or multiple properties. ex. { name: 'circle', keyframes: {time, value} }
     * @returns Timeline object
     */
    constructor(propOrProps) {
        if (propOrProps !== undefined) {
            if (Array.isArray(propOrProps)) {
                // InputProp[]
                this.properties = propOrProps.map((prop) => {
                    const name = prop.name;
                    const keyframes = this._convertToKeyframesFull(prop.keyframes);
                    return { name, keyframes };
                });
            }
            else {
                // InputProp
                const name = propOrProps.name;
                const keyframes = this._convertToKeyframesFull(propOrProps.keyframes);
                this.properties = [{ name, keyframes }];
            }
        }
        else {
            // propOrProps undefined
            this.properties = [];
        }
    }
    _convertToKeyframesFull(arr) {
        return Keyframes(arr);
    }
    /**
     * REVIEW:
     * - I don't want to expose KeyframesFull object
     * - If I do, then transform KeyframesFull to Keyframe[] first, and return whole property
     * returns { name, keyframes }
     * @param propName
     * @returns property object
     */
    _getProperty(propName) {
        return this.properties.find((prop) => prop.name === propName);
    }
    /**
     * check whether given property already exists.
     * @param propName
     * @returns true if exists
     */
    propExists(propName) {
        return this._getProperty(propName) !== undefined;
    }
    /**
     * if key already exists at time, replace it. otherwise, add a new key.
     * @param propName name of property ie. "position", "size"
     * @param newKey { time, value, ease, ... }
     */
    addKeyframe(propName, newKey) {
        if (this.propExists(propName)) {
            // keys.add() simply pushes and doesn't check for timeStamp duplicates.
            const keys = this.getKeyframesFull(propName);
            const existingIndex = keys.getIndex(newKey.time);
            if (existingIndex === -1) {
                keys.add(newKey);
            }
            else {
                keys.frames[existingIndex] = newKey;
            }
        }
        else {
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
    addKeyframes(propName, ...newKeys) {
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
    getKeyframe(propName, timeStamp) {
        const prop = this._getProperty(propName);
        if (prop !== undefined) {
            const key = prop.keyframes.get(timeStamp);
            if (key !== null) {
                return key;
            }
            else {
                throw new Error(`Timeline.getKeyframe(): key does not exist at timeStamp: ${timeStamp}`);
            }
        }
        throw new Error(`Timeline.getKeyframe(): cannot find prop: ${propName}`);
    }
    /**
     * get all keyframes
     * @param propName
     * @returns keyframes array [{time, value}, {time, value}, ...]
     */
    getKeyframes(propName) {
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
    getKeyframesFull(propName) {
        const prop = this._getProperty(propName);
        if (prop !== undefined) {
            return prop.keyframes;
        }
        throw new Error(`Timeline.getKeyframes(): cannot find prop: ${propName}`);
    }
    /**
     * calculate value at timestamp with optional easing.
     * @param propName
     * @param timeStamp
     * @param interpolator fn(a, b, t, out?)
     * @returns
     */
    value(propName, timeStamp, interpolator) {
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
    addProperty(propName, ...newKeys) {
        if (!this.propExists(propName)) {
            this.properties.push({
                name: propName,
                keyframes: Keyframes(newKeys ? [newKeys[0]] : []),
            });
            for (let i = 2; i < arguments.length; i++) {
                this.addKeyframe(propName, arguments[i]);
            }
        }
        else {
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
    removeKeyframes(propName, index, howmany) {
        const keys = this.getKeyframesFull(propName);
        keys.splice(index, howmany);
    }
    // TODO
    // removeProperty(propName: string) {
    //   //
    // }
    nearest(propName, timeStamp, radius) {
        return this.getKeyframesFull(propName).nearest(timeStamp, radius);
    }
    nearestIndex(propName, timeStamp, radius) {
        return this.getKeyframesFull(propName).nearestIndex(timeStamp, radius);
    }
    /**
     * clamps if beyond last keyframe
     * @param propName
     * @param timeStamp
     * @returns keyframe object { time, value, .. }
     */
    next(propName, timeStamp) {
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
    previous(propName, timeStamp) {
        const prev = this.getKeyframesFull(propName).previous(timeStamp);
        if (prev === null) {
            return this.nearest(propName, timeStamp);
        }
        return prev;
    }
}
exports.default = Timeline;
//# sourceMappingURL=index.js.map