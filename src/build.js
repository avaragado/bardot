// @flow

import chalk from 'chalk';

type WidthFill = {| mode: 'fill', ctCharMinus: number, ctCharFull: ?number |};
type WidthBar = {| mode: 'bar', ctChar: number |};
type WidthBarLabel = {| mode: 'bar-label', ctChar: number |};

type Template = string;

type Width = WidthFill | WidthBar | WidthBarLabel;

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
    at: (cur: number) => Chainable,
    of: (max: number) => Chainable,
    widthFill: (ctCharMinus?: number, ctCharFull?: ?number) => Chainable,
    widthBar: (ctChar?: number) => Chainable,
    widthBarLabel: (ctChar?: number) => Chainable,
    showBarCur: () => Chainable,
    showBarCurMax: () => Chainable,
    showBarCurMaxPct: () => Chainable,
    showBarPct: () => Chainable,
    showBar: () => Chainable,
    template: (tpl: Template) => Chainable,
    symbols: (symbol: BarSymbol) => Chainable,
    toString: () => string,
    opt: () => Option,
};

export const width: { [key: string]: (ct?: number) => Width } = {
    fill: (ctCharMinus = 0, ctCharFull = null) => ({ mode: 'fill', ctCharMinus, ctCharFull }),
    bar: (ctChar = 50) => ({ mode: 'bar', ctChar }),
    barLabel: (ctChar = 50) => ({ mode: 'bar-label', ctChar }),
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
        empty: ' ',
        fractions: ['-', '+', '⧺'],
    },
};

export const optDefault: Option = {
    cur: 0,
    max: 100,
    width: width.fill(0),
    tpl: template.barCurMax,
    symbol: symbol.dot8,
    renderer: () => '',
};

const build = (optIn?: OptionSparse): Chainable => {
    const opt = { ...optDefault, ...optIn };
    const extend = (optPlus: OptionSparse) => build({ ...opt, ...optPlus });

    return {
        at: cur => extend({ cur }),
        of: max => extend({ max }),
        widthFill: (ctCharMinus, ctCharFull) =>
            extend({ width: width.fill(ctCharMinus, ctCharFull) }),
        widthBar: ctChar => extend({ width: width.bar(ctChar) }),
        widthBarLabel: ctChar => extend({ width: width.barLabel(ctChar) }),
        showBarCur: () => extend({ tpl: template.barCur }),
        showBarCurMax: () => extend({ tpl: template.barCurMax }),
        showBarCurMaxPct: () => extend({ tpl: template.barCurMaxPct }),
        showBarPct: () => extend({ tpl: template.barPct }),
        showBar: () => extend({ tpl: template.bar }),
        template: tpl => extend({ tpl }),
        symbols: symbolIn => extend({ symbol: symbolIn }),
        toString: () => opt.renderer(opt),
        opt: () => opt,
    };
};

export default build;
