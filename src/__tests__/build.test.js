// @flow

import build, { optDefault, width } from '../build';

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

    it('has a "current" method', () => {
        const cur = 12;
        const b1 = build();
        const b2 = b1.current(cur);

        expect(b2).not.toBe(b1);
        expect(b2.opt()).toEqual({ ...optDefault, cur });
    });

    it('has a "maximum" method', () => {
        const max = 123;
        const b1 = build();
        const b2 = b1.maximum(max);

        expect(b2).not.toBe(b1);
        expect(b2.opt()).toEqual({ ...optDefault, max });
    });

    it('sets cur to max if setting cur above max', () => {
        const max = 100;
        const b1 = build().maximum(max);
        const b2 = b1.current(max + 1);

        expect(b2.opt()).toEqual({ ...optDefault, cur: max, max });
    });

    it('sets cur to 0 if setting cur below zero', () => {
        const b1 = build().current(-1);

        expect(b1.opt()).toEqual({ ...optDefault, cur: 0 });
    });

    it('sets cur to max if setting max below cur', () => {
        const max = 40;
        const b1 = build().maximum(100).current(50);
        const b2 = b1.maximum(40);

        expect(b2.opt()).toEqual({ ...optDefault, cur: max, max });
    });

    it('sets max and cur to 0 if setting max below zero', () => {
        const b1 = build().maximum(-1);

        expect(b1.opt()).toEqual({ ...optDefault, cur: 0, max: 0 });
    });

    it('rounds floats to ints for current', () => {
        const b = build().current(11.3);

        expect(b.opt()).toEqual({ ...optDefault, cur: 11 });
    });

    it('rounds floats to ints for maximum', () => {
        const b = build().maximum(111.7);

        expect(b.opt()).toEqual({ ...optDefault, max: 112 });
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

    it('has a "widthTemplate" method', () => {
        const ctChar = 12;
        const b1 = build();
        const b2 = b1.widthTemplate(ctChar);
        const b3 = b1.widthTemplate();

        expect(b2).not.toBe(b1);
        expect(b3).not.toBe(b2);
        expect(b2.opt()).toEqual({ ...optDefault, width: width.template(ctChar) });
        expect(b3.opt()).toEqual({ ...optDefault, width: width.template() });
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
