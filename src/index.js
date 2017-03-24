// @flow

import build, { width, template, symbol } from './build';
import renderer from './render';

const bardot = build({ renderer });

export {
    width,
    template,
    symbol,
    bardot,
};
