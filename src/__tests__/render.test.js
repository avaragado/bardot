// @flow

import chalk from 'chalk';

import type { Option } from '../build';
import { width, symbol } from '../build';
import render from '../render';

const arOpt: Option[] = [
    {
        cur: 32,
        max: 32,
        width: width.bar(4),
        symbol: symbol.dot8,
        tpl: '|bar| |cur|/|max|',
    },
    {
        cur: 32,
        max: 32,
        width: width.bar(8),
        symbol: symbol.dot8,
        tpl: '|bar| |cur|/|max|',
    },
    {
        cur: 18,
        max: 32,
        width: width.bar(4),
        symbol: symbol.dot8,
        tpl: '|bar| |cur|/|max|',
    },
    {
        cur: 16,
        max: 32,
        width: width.bar(4),
        symbol: symbol.dot8,
        tpl: '|bar| |cur|/|max|',
    },
    {
        cur: 8,
        max: 32,
        width: width.bar(4),
        symbol: symbol.dot8,
        tpl: '|bar| |cur|/|max|',
    },
    {
        cur: 0,
        max: 32,
        width: width.bar(4),
        symbol: symbol.dot8,
        tpl: '|bar| |cur|/|max|',
    },
    {
        cur: 32,
        max: 32,
        width: width.bar(4),
        symbol: symbol.dot8,
        tpl: '|bar| |cur|/|max| |pct|%',
    },
    {
        cur: 18,
        max: 32,
        width: width.bar(4),
        symbol: symbol.dot8,
        tpl: '|bar| |cur|/|max| |pct|%',
    },
    {
        cur: 18,
        max: 32,
        width: width.bar(4),
        symbol: symbol.dot8,
        tpl: '|bar| |cur|/|max| |pct|% //// |bar| |cur|/|max| |pct|%',
    },
    {
        cur: 18,
        max: 32,
        width: width.bar(4),
        symbol: symbol.dot8,
        tpl: 'look |pct|% at |cur|/|max| this |bar|!',
    },
    {
        cur: 18,
        max: 32,
        width: width.template(10),
        symbol: symbol.dot8,
        tpl: '|bar| |cur|/|max|',
    },
    {
        cur: 18,
        max: 32,
        width: width.template(16),
        symbol: symbol.dot8,
        tpl: '|bar| |cur|/|max| |pct|%',
    },
    {
        cur: 18,
        max: 32,
        width: width.template(20),
        symbol: symbol.dot8,
        tpl: '|bar| |cur|/|max| |pct|%',
    },
    {
        cur: 18,
        max: 32,
        width: width.fill(10, 30),
        symbol: symbol.dot8,
        tpl: '|bar| |cur|/|max| |pct|%',
    },
    {
        cur: 10,
        max: 100,
        width: width.fill(0, 30),
        symbol: symbol.dot8,
        tpl: '%bar',
    },
    {
        cur: 10,
        max: 100,
        width: width.fill(0, 30),
        symbol: symbol.dot8,
        tpl: '|bar| |cur|/|max|',
    },
    {
        cur: 100,
        max: 100,
        width: width.fill(0),
        symbol: symbol.dot8,
        tpl: `${chalk.green('|bar|')} |cur|/|max|`,
    },
    {
        cur: 18,
        max: 32,
        width: width.bar(4),
        symbol: symbol.dot8,
        tpl: [
            chalk.white.bgMagenta('|bar|'),
            ' ',
            chalk.bold('|cur|'),
            chalk.dim('/'),
            chalk.bold('|max|'),
            ' ',
            chalk.green('|pct|%'),
        ].join(''),
    },
    {
        cur: 18,
        max: 32,
        width: width.template(5), // not long enough
        symbol: symbol.dot8,
        tpl: '|bar| |cur|/|max|',
    },
    {
        cur: 18,
        max: 32,
        width: width.fill(0, 5), // not long enough
        symbol: symbol.dot8,
        tpl: '|bar| |cur|/|max|',
    },
    {
        cur: 18,
        max: 32,
        width: width.bar(4),
        symbol: {
            full: '*',
            empty: '-',
            fractions: [],
        },
        tpl: '|bar| |cur|/|max|',
    },
    {
        cur: 20,
        max: 32,
        width: width.bar(4),
        symbol: {
            full: '#',
            empty: ' ',
            fractions: ['+'],
        },
        tpl: '|bar| |cur|/|max|',
    },
    {
        cur: 20,
        max: 32,
        width: width.bar(4),
        symbol: {
            full: '[]',
            empty: '  ',
            fractions: ['..', '.+', '+.'],
        },
        tpl: '|bar| |cur|/|max|',
    },
    {
        cur: 19,
        max: 32,
        width: width.bar(4),
        symbol: {
            full: 'x',
            empty: ' ',
            fractions: [],
        },
        tpl: '|bar| |cur|/|max|',
    },
    {
        cur: 19,
        max: 32,
        width: width.bar(4),
        symbol: {
            full: 'x',
            empty: ' ',
            fractions: ['o'],
        },
        tpl: '|bar| |cur|/|max|',
    },

].map(opt => ({ ...opt, renderer: () => '' })); // renderer ignored here

describe('render', () => {
    let col;
    const name = opt => `${opt.cur}/${opt.max} ${JSON.stringify(opt.width)} ${JSON.stringify(opt.symbol)} "${opt.tpl}"`;

    beforeEach(() => {
        // $FlowFixMe flow moans at process.stdout.columns, no idea how to fix
        col = process.stdout.columns;
        // $FlowFixMe flow moans at process.stdout.columns, no idea how to fix
        process.stdout.columns = 100;
    });

    afterEach(() => {
        // $FlowFixMe flow moans at process.stdout.columns, no idea how to fix
        process.stdout.columns = col;
    });

    arOpt.forEach((opt) => {
        it(name(opt), () => {
            const received = render(opt);
            // console.log(`<${received.replace(/ /g, '□')}> ${name(opt)}`);
            expect(received).toMatchSnapshot();
        });
    });
});
