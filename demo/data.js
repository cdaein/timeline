/**
 * NOTES:
 * - naming conventions:
 *   - entry name: object-numbering. ex. "circle-1", "rect-3" (may be parsed later.)
 *   - property name:; follow Canvas API as much as possible.
 *   - ease: can have "hold" value -> this needs to be handled when *applying* easing in the main code.
 *
 * Data structure:
 * timeline (array)
 *   [entry] (object)
 *     name (string)
 *     properties (array)
 *       [property] (object)
 *         name (string)
 *         keyframes (array => later, converted to Keyframes in Timeline object)
 *
 */

const data = [
  {
    name: "circle-1",
    properties: [
      {
        name: "position",
        keyframes: [
          { time: 0, value: [500, 100], ease: "hold" },
          { time: 1, value: [300, 300], ease: "expoIn" },
          { time: 2, value: [300, 500], ease: "quadInOut" },
        ],
      },
      {
        name: "lineWidth",
        keyframes: [
          { time: 0, value: 1 },
          { time: 2, value: 20 },
          { time: 3, value: 4 },
        ],
      },
      {
        name: "strokeColor",
        keyframes: [
          { time: 0, value: [0.7, 1, 1] },
          { time: 1, value: [0, 1, 1], ease: "expoIn" },
          { time: 2, value: [0.2, 1, 1], ease: "expoIn" },
        ],
      },
    ],
  },
  {
    name: "rect-1",
    properties: [
      {
        name: "position",
        keyframes: [
          { time: 0, value: [100, 300] },
          { time: 1.5, value: [400, 400], ease: "expoIn" },
          { time: 3, value: [100, 300], ease: "expoOut" },
        ],
      },
    ],
  },
  {
    name: "shape-1",
    properties: [
      {
        name: "path",
        keyframes: [
          {
            time: 0,
            value: [
              [50, 50],
              [520, 50],
              [400, 400],
            ],
          },
          {
            time: 1.5,
            value: [
              [80, 150],
              [520, 180],
              [290, 540],
            ],
            ease: "expoInOut",
          },
          {
            time: 3,
            value: [
              [50, 50],
              [520, 50],
              [400, 400],
            ],
            ease: "expoInOut",
          },
        ],
      },
      {
        name: "lineWidth",
        keyframes: [
          { time: 0, value: 8 },
          { time: 1, value: 40 },
          { time: 2, value: 8 },
        ],
      },
      {
        name: "strokeColor",
        keyframes: [
          { time: 0, value: [0, 0, 1] },
          { time: 1.5, value: [0.4, 1, 1], ease: "expoInOut" },
          { time: 3, value: [0, 0, 1], ease: "expoInOut" },
        ],
      },
    ],
  },
];

export default data;
