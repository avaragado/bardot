// @flow

import chalk from 'chalk';

type WidthFill = {| mode: 'fill', ctCharMinus: number, ctCharFull: ?number |};
type WidthBar = {| mode: 'bar', ctChar: number |};
type WidthTemplate = {| mode: 'template', ctChar: number |};

type Template = string;

type Width = WidthFill | WidthBar | WidthTemplate;

type BarSymbol = {|
    full: string,
    empty: string,
    fractions: string[],
|};

export type Option = {
    cur: number,
    max: number,
    width: Width,
    tpl: Template,
    symbol: BarSymbol,
    renderer: (opt: Option) => string,
};

type OptionSparse = {
    cur?: number,
    max?: number,
    width?: Width,
    tpl?: Template,
    symbol?: BarSymbol,
    renderer?: (opt: Option) => string,
};

type Chainable = {
    current: (cur: number) => Chainable,
    maximum: (max: number) => Chainable,
    widthFill: (ctCharMinus?: number, ctCharFull?: ?number) => Chainable,
    widthBar: (ctChar?: number) => Chainable,
    widthTemplate: (ctChar?: number) => Chainable,
    template: (tpl: Template) => Chainable,
    symbols: (symbol: BarSymbol) => Chainable,
    toString: () => string,
    opt: () => Option,
};

export const width = {
    fill: (ctCharMinus: number = 0, ctCharFull: ?number = null) => ({ mode: 'fill', ctCharMinus, ctCharFull }),
    bar: (ctChar: number = 50) => ({ mode: 'bar', ctChar }),
    template: (ctChar: number = 50) => ({ mode: 'template', ctChar }),
};

const greenbar = chalk.green('|bar|');
const dimslash = chalk.dim('/');

export const template: { [key: string]: Template } = {
    bar: `${greenbar}`,
    barCur: `${greenbar} |cur|`,
    barCurMax: `${greenbar} |cur|${dimslash}|max|`,
    barPct: `${greenbar} |pct|%`,
    barCurMaxPct: `${greenbar} |cur|${dimslash}|max| |pct|%`,
};

export const symbol: { [key: string]: BarSymbol } = {
    dot8: {
        full: '⣿',
        empty: ' ',
        fractions: ['⡀', '⡄', '⡆', '⡇', '⣇', '⣧', '⣷'],
    },
    dot6: {
        full: '⠿',
        empty: ' ',
        fractions: ['⠄', '⠆', '⠇', '⠧', '⠷'],
    },
    rod5: {
        full: '𝍤',
        empty: ' ',
        fractions: ['𝍠', '𝍡', '𝍢', '𝍣'],
    },
    pip: {
        full: '●',
        empty: '○',
        fractions: [],
    },
    blockspace: {
        full: '█',
        empty: ' ',
        fractions: [],
    },
    blockdot: {
        full: '█',
        empty: '⠿',
        fractions: [],
    },
    tick: {
        full: '✓',
        empty: ' ',
        fractions: [],
    },
    starspace: {
        full: '*',
        empty: ' ',
        fractions: [],
    },
    hashdash: {
        full: '#',
        empty: '-',
        fractions: ['+', '⧺'],
    },
};

export const optDefault: Option = {
    cur: 0,
    max: 100000,
    width: width.fill(0),
    tpl: template.barCurMax,
    symbol: symbol.dot8,
    renderer: () => '',
};

const build = (optIn?: OptionSparse): Chainable => {
    const opt = { ...optDefault, ...optIn };
    const extend = (optPlus: OptionSparse) => build({ ...opt, ...optPlus });
    const roundPos = val => Math.max(0, Math.round(val));

    return {
        current: cur => extend({ cur: Math.min(opt.max, roundPos(cur)) }),
        maximum: max => extend({ max: roundPos(max), cur: Math.min(roundPos(max), opt.cur) }),
        widthFill: (ctCharMinus, ctCharFull) =>
            extend({ width: width.fill(ctCharMinus, ctCharFull) }),
        widthBar: ctChar => extend({ width: width.bar(ctChar) }),
        widthTemplate: ctChar => extend({ width: width.template(ctChar) }),
        template: tpl => extend({ tpl }),
        symbols: symbolIn => extend({ symbol: symbolIn }),
        toString: () => opt.renderer(opt),
        opt: () => opt,
    };
};

export default build;
