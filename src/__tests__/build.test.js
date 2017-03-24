// @flow

import build, { optDefault, width, template } from '../build';

describe('build', () => {
    it('returns default options', () => {
        expect(build().opt()).toEqual(optDefault);
    });

    it('accepts a renderer config', () => {
        const renderer = jest.fn().mockReturnValue('x');

        expect(build({ renderer }).toString()).toEqual('x');
        expect(renderer.mock.calls[0]).toEqual([{ ...optDefault, renderer }]);
        expect(renderer.mock.calls.length).toEqual(1);
    });

    it('returns different instances', () => {
        const b1 = build();
        const b2 = build();
        const b3 = build();

        expect(b2).not.toBe(b1);
        expect(b3).not.toBe(b2);
    });

    it('has an "at" method', () => {
        const cur = 12;
        const b1 = build();
        const b2 = b1.at(cur);

        expect(b2).not.toBe(b1);
        expect(b2.opt()).toEqual({ ...optDefault, cur });
    });

    it('has an "of" method', () => {
        const max = 123;
        const b1 = build();
        const b2 = b1.of(max);

        expect(b2).not.toBe(b1);
        expect(b2.opt()).toEqual({ ...optDefault, max });
    });

    it('has a "widthFill" method', () => {
        const ctCharMinus = 12;
        const ctCharFull = 100;
        const b1 = build();
        const b2 = b1.widthFill(ctCharMinus);
        const b3 = b1.widthFill();
        const b4 = b1.widthFill(ctCharMinus, ctCharFull);

        expect(b2).not.toBe(b1);
        expect(b3).not.toBe(b2);
        expect(b4).not.toBe(b3);
        expect(b2.opt()).toEqual({ ...optDefault, width: width.fill(ctCharMinus) });
        expect(b3.opt()).toEqual({ ...optDefault, width: width.fill() });
        expect(b4.opt()).toEqual({ ...optDefault, width: width.fill(ctCharMinus, ctCharFull) });
    });

    it('has a "widthBar" method', () => {
        const ctChar = 12;
        const b1 = build();
        const b2 = b1.widthBar(ctChar);
        const b3 = b1.widthBar();

        expect(b2).not.toBe(b1);
        expect(b3).not.toBe(b2);
        expect(b2.opt()).toEqual({ ...optDefault, width: width.bar(ctChar) });
        expect(b3.opt()).toEqual({ ...optDefault, width: width.bar() });
    });

    it('has a "widthBarLabel" method', () => {
        const ctChar = 12;
        const b1 = build();
        const b2 = b1.widthBarLabel(ctChar);
        const b3 = b1.widthBarLabel();

        expect(b2).not.toBe(b1);
        expect(b3).not.toBe(b2);
        expect(b2.opt()).toEqual({ ...optDefault, width: width.barLabel(ctChar) });
        expect(b3.opt()).toEqual({ ...optDefault, width: width.barLabel() });
    });

    it('has a "showBarCur" method', () => {
        const b1 = build();
        const b2 = b1.showBarCur();

        expect(b2).not.toBe(b1);
        expect(b2.opt()).toEqual({ ...optDefault, tpl: template.barCur });
    });

    it('has a "showBarCurMax" method', () => {
        const b1 = build();
        const b2 = b1.showBarCurMax();

        expect(b2).not.toBe(b1);
        expect(b2.opt()).toEqual({ ...optDefault, tpl: template.barCurMax });
    });

    it('has a "showBarCurMaxPct" method', () => {
        const b1 = build();
        const b2 = b1.showBarCurMaxPct();

        expect(b2).not.toBe(b1);
        expect(b2.opt()).toEqual({ ...optDefault, tpl: template.barCurMaxPct });
    });

    it('has a "showBarPct" method', () => {
        const b1 = build();
        const b2 = b1.showBarPct();

        expect(b2).not.toBe(b1);
        expect(b2.opt()).toEqual({ ...optDefault, tpl: template.barPct });
    });

    it('has a "showBar" method', () => {
        const b1 = build();
        const b2 = b1.showBar();

        expect(b2).not.toBe(b1);
        expect(b2.opt()).toEqual({ ...optDefault, tpl: template.bar });
    });

    it('has a "template" method', () => {
        const b1 = build();
        const b2 = b1.template('abc');

        expect(b2).not.toBe(b1);
        expect(b2.opt()).toEqual({ ...optDefault, tpl: 'abc' });
    });

    it('has a "symbols" method', () => {
        const symbol = { full: '*', empty: '-', fractions: [] };
        const b1 = build();
        const b2 = b1.symbols(symbol);

        expect(b2).not.toBe(b1);
        expect(b2.opt()).toEqual({ ...optDefault, symbol });
    });
});
