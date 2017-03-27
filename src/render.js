// @flow

import len from 'string-length'; // ignores ansi escape sequences

import type { Option } from './build';

type OptData = {
    opt: Option,
    data: {
        ctCharBar: number,
        ctBlockPerNum: number,
        ctPipPerNum: number,
    },
};

const replace = (tpl, map) => tpl.replace(/\|(bar|cur|max|pct)\|/g, (match, word) => map[word]);

const ctCharLabelMax = opt => len(replace(opt.tpl, {
    cur: opt.max,
    max: opt.max,
    pct: 99.9, // more chars than 100
    bar: '',
}));

const ctCharBarDerive = (width, opt) => {
    switch (width.mode) {
        // simplest case: the size of the bar is exactly as configured
        case 'bar': {
            return width.ctChar;
        }

        // user configures the total size of bar + label.
        // derive the bar size by subtracting the maximum label size.
        case 'template': {
            return width.ctChar - ctCharLabelMax(opt);
        }

        // user wants to fill the available width, minus the configured number of characters.
        case 'fill': {
            // $FlowFixMe flow moans at process.stdout.columns, no idea how to fix
            const ctCharFull = width.ctCharFull || process.stdout.columns;

            return ctCharFull - width.ctCharMinus - ctCharLabelMax(opt);
        }

        default: {
            return 0;
        }
    }
};

const addData = (opt: Option): OptData => {
    const ctCharBar = ctCharBarDerive(opt.width, opt);

    return {
        opt,
        data: {
            ctCharBar,
            ctBlockPerNum: ctCharBar / opt.max,
            ctPipPerNum: (ctCharBar * (opt.symbol.fractions.length + 1)) / opt.max,
        },
    };
};

const bar = ({ opt, data }) => {
    const ctBlock = opt.cur * data.ctBlockPerNum;
    const sBlocks = opt.symbol.full.repeat(ctBlock);
    const sEmpties = opt.symbol.empty.repeat((opt.max - opt.cur) * data.ctBlockPerNum);

    if (ctBlock === Math.floor(ctBlock)) {
        return sBlocks + sEmpties;
    }

    const arsPart = [opt.symbol.empty].concat(opt.symbol.fractions || []);
    const sPart = arsPart[Math.floor(opt.cur * data.ctPipPerNum) % arsPart.length];

    return sBlocks + sPart + sEmpties;
};

const renderOptData = (od) => {
    if (od.data.ctCharBar < 0) {
        return ''; // no room: return empty string rather than junk
    }

    const map = {
        // right-align cur and pct within their space to avoid overall length changes
        cur: od.opt.cur.toString().padStart(od.opt.max.toString().length),
        max: od.opt.max,
        pct: (Math.round((1000 * od.opt.cur) / od.opt.max) / 10).toString().padStart(4),
        bar: bar(od),
    };

    return replace(od.opt.tpl, map);
};

export default (opt: Option): string => renderOptData(addData(opt));
