/**
 * LICENSE
 * - equations: https://github.com/ai/easings.net/blob/master/LICENSE
 *
 * TOFIX:
 * - switch/case and return func() seems a bit strange...
 * @param {number} x 0..1
 * @param {string} type type of easing
 * @returns eased number
 */
function ease(x, type) {
  switch (type) {
    case "sineInOut":
      return sineInOut(x);
    case "quadIn":
      return quadIn(x);
    case "quadOut":
      return quadOut(x);
    case "quadInOut":
      return quadInOut(x);
    // case "easeOutInQuad":
    //   return x < 0.5
    //     ? 0.5 - Math.pow(1 - 2 * x, 2) * 0.5
    //     : Math.pow(x - 0.5, 2) * 2 + 0.5;
    case "cubicIn":
      return cubicIn(x);
    case "cubicOut":
      return cubicOut(x);
    case "cubicInOut":
      return cubicInOut(x);
    case "quartIn":
      return quartIn(x);
    case "quartOut":
      return quartOut(x);
    case "quartInOut":
      return quartInOut(x);
    case "quintIn":
      return quintIn(x);
    case "quintOut":
      return quintOut(x);
    case "quintInOut":
      return quintInOut(x);
    case "expoIn":
      return expoIn(x);
    case "expoOut":
      return expoOut(x);
    case "expoInOut":
      return expoInOut(x);
    case "backIn":
      return backIn(x);
    case "backOut":
      return backOut(x);
    case "backInOut":
      return backInOut(x);
    case "bounceIn":
      return bounceIn(x);
    case "bounceOut":
      return bounceOut(x);
    case "bounceInOut":
      return bounceInOut(x);
    case "linear":
    default:
      return x;
  }
}

// TODO: rest of sine and others
function sineInOut(x) {
  return -(Math.cos(Math.PI * x) - 1) / 2;
}

function quadIn(x) {
  return x * x;
}
function quadOut(x) {
  return 1 - (1 - x) * (1 - x);
}
function quadInOut(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}
function cubicIn(x) {
  return x * x * x;
}
function cubicOut(x) {
  return 1 - Math.pow(1 - x, 3);
}
function cubicInOut(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function quartIn(x) {
  return Math.pow(x, 4);
}
function quartOut(x) {
  return 1 - Math.pow(1 - x, 4);
}
function quartInOut(x) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}
function quintIn(x) {
  return Math.pow(x, 5);
}
function quintOut(x) {
  return 1 - Math.pow(1 - x, 5);
}
function quintInOut(x) {
  return x < 0.5 ? 16 * Math.pow(x, 5) : 1 - Math.pow(-2 * x + 2, 5) / 2;
}
function expoIn(x) {
  return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}
function expoOut(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}
function expoInOut(x) {
  return x === 0
    ? 0
    : x === 1
    ? 1
    : x < 0.5
    ? Math.pow(2, 20 * x - 10) / 2
    : (2 - Math.pow(2, -20 * x + 10)) / 2;
}
function backIn(x) {
  const eibc1 = 1.70158;
  const eibc3 = eibc1 + 1;
  return eibc3 * x * x * x - eibc1 * x * x;
}
function backOut(x) {
  const eobc1 = 1.70158;
  const eobc3 = eobc1 + 1;
  return 1 + eobc3 * Math.pow(x - 1, 3) + eobc1 * Math.pow(x - 1, 2);
}
function backInOut(x) {
  const eiobc1 = 1.70158;
  const eiobc2 = eiobc1 * 1.525;
  return x < 0.5
    ? (Math.pow(2 * x, 2) * ((eiobc2 + 1) * 2 * x - eiobc2)) / 2
    : (Math.pow(2 * x - 2, 2) * ((eiobc2 + 1) * (x * 2 - 2) + eiobc2) + 2) / 2;
}
function bounceIn(x) {
  return 1 - bounceOut(1 - x);
}
function bounceOut(x) {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}
function bounceInOut(x) {
  return x < 0.5
    ? (1 - bounceOut(1 - 2 * x)) / 2
    : (1 + bounceOut(2 * x - 1)) / 2;
}

module.exports = {
  default: ease,
  ease,
  // TODO: sineIn, sineOut, and the rest...
  sineInOut,
  quadIn,
  quadOut,
  quadInOut,
  cubicIn,
  cubicOut,
  cubicInOut,
  quartIn,
  quartOut,
  quartInOut,
  quintIn,
  quintOut,
  quintInOut,
  expoIn,
  expoOut,
  expoInOut,
  backIn,
  backOut,
  backInOut,
  bounceIn,
  bounceOut,
  bounceInOut,
};
