# bardot

Yet another progress bar for console apps. This one has the following features:

- Chainable syntax to easily derive bars from others and pass them around
- Customisable appearance: a template defines whether/where to show the bar, current value, max value, percentage complete, and any extra text you want
- Customisable bar symbols, including fractions
- Support for colour in templates (using [`chalk`](https://www.npmjs.com/package/chalk), for example)
- Set the bar length you want, or the total length of the template (bar + labels), or make the template fill the line (leaving room if you want)
- Flowtype support

It's bardot as in Brigitte: _bar-doe_. But it's a bar, and there are dots, and the name's available.


## Installation

```bash
$ yarn add bardot  # or npm add bardot
```

## Usage

```js
import { bardot, template, symbol } from 'bardot';

// The default templates and bar symbols show the bar in green dots.

// Configure a bar that's 25% complete. Nothing's rendered yet.
const bar = bardot.current(25).maximum(100);

// Set the length of the bar in the final string to 10 chars,
// showing current and max (the default template),
// and output the formatted string.
console.log(bar.widthBar(10).toString());
// ⣿⣿⡇         25/100

// Set the length of the final string as 20 chars,
// from the first block of the bar to the %.
// The bar fills the space left after rendering the label.
// Uses a template that just renders the bar and the percentage complete.
console.log(bar.widthTemplate(20).template(template.barPct).toString())
// ⣿⣿⣿⡇             25%

// Set the length of the final string as console width (eg 80 chars)
// minus 10 chars. As above, the bar is sized to fit after rendering the label.
// Uses a template that renders everything.
console.log(bar.widthFill(10).template(template.barCurMaxPct).toString())
// ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿                                            25/100   25%

// As in the first example, but using different symbols for rendering.
// (Some symbol sets support fractional parts, some don't: this one doesn't)
console.log(bar.widthBar(10).symbols(symbol.blockdot).toString())
// ██⠿⠿⠿⠿⠿⠿⠿⠿  25/100

```

## Concepts and terminology

- **bar**: The part of the rendered output representing the fraction `current / maximum`, rendered as in a bar chart.
- **label**: The parts of the rendered output that aren't the bar. May include fixed text and variable components (such as the maximum value in numeric form).
- **template**: A string with special sequences of characters that are replaced during rendering. Templates define which parts go where in the final string.
- **symbols**: An object defining which set of characters to use for the graphical representation of the bar.

## API

The `bardot` module exports:

- `bardot`: an object on which you can call various methods to configure and render a bar and label.
- `template`: an object with predefined templates you can use with the `bardot.template()` method.
- `symbol`: an object with predefined symbols you can use with the `bardot.symbols()` method.


### `bardot`

The `bardot` export is an object with several methods, most of them chainable. Each chainable method returns a new object with the same configuration as the old, plus whichever configuration change the method made.

At any point you can call `toString()` on a bardot object to return a formatted string.


#### `bardot.current(cur: number)`

Return a new `bardot` object setting the current value of the bar: the extent of the filled-in section of the bar. This is always clamped so that `0 <= current <= maximum`, and rounded to the nearest integer.

#### `bardot.maximum(max: number)`

Return a new `bardot` object setting the maximum value of the bar: the value corresponding to a fully filled-in bar. This is always clamped so that `0 <= maximum`, rounded to the nearest integer, and current is changed if necessary to keep it no greater than the maximum.

(Which means: it's safest to use the sequence `random_bardot_object.maximum(v1).current(v2)`, as calling `current(v2)` first might clamp it to the old maximum.)

#### `bardot.widthBar(ctChar: number)`

Return a new `bardot` object configured to render a bar `ctChar` characters in length. The final rendered string might use more characters than this: it depends on the configured template.

#### `bardot.widthTemplate(ctChar: number)`

Return a new `bardot` object configured to render output `ctChar` characters in length, including both bar and label. The bar takes up the space left after rendering the label.

#### `bardot.widthFill(ctCharMinus?: number, ctCharFull?: number)`

Return a new `bardot` object configured to render output `ctCharFull - ctCharMinus` characters in length, where `ctCharFull` defaults to the current number of columns in the console and `ctCharMinus` defaults to zero.

This is a convenience method to help you fill up lines. Set `ctCharMinus` if you need to save a few characters of the line for, say, a constant prefix or suffix in your output. You probably won't want to explicitly set `ctCharFull` (it's there for testing purposes) but you can if you want.

#### `bardot.template(tpl: string)`

Return a new `bardot` object configured with a specific template. The `template` import defines some presets, but you can use your own. See below for details.

#### `bardot.symbols({ full: string, empty: string, fractions: string[] })`

Return a new `bardot` object configured to render bars using a specific set of symbols. The `symbol` import defines some presets, but you can use your own. See below for details.

#### `bardot.toString()`

Return the formatted bar and label as a string. You might not need to use this, as in many contexts it's called implicitly. Flow complains if you don't, though.

The `bardot` object's current template defines where the various components are rendered in the string.

`bardot` objects differing only in their current value always render strings the same length. This stops parts of the string shuffling about as the current value changes.


### `template`

The `template` import is an object mapping preset names to template strings. Here are the current template preset names and their output, for an object `bardot.current(100).maximum(100).widthTemplate(30).symbols(symbol.blockspace)`. Actual rendering includes colour (green bars).

```
bar           ██████████████████████████████
barCur        ██████████████████████████ 100
barCurMax     ██████████████████████ 100/100
barPct        ████████████████████████  100%
barCurMaxPct  ████████████████ 100/100  100%
```

### `symbol`

The `symbol` export is an object mapping preset names to symbol objects. Here are the current symbol preset names and their output, for an object `bardot.current(35).maximum(100).widthTemplate(30).template(template.bar)`.

```
dot8        ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
dot6        ⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠇
rod5        𝍤𝍤𝍤𝍤𝍤𝍤𝍤𝍤𝍤𝍤𝍡
pip         ●●●●●●●●●●○○○○○○○○○○○○○○○○○○○○
blockspace  ██████████
blockdot    ██████████⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿⠿
tick        ✓✓✓✓✓✓✓✓✓✓
starspace   **********
hashdash    ##########+-------------------
```

These bars may render in your browser as different lengths. In the console, they should be the same length: it depends on the font in use.


## Defining your own template

A template is a string containing special character sequences that bardot replaces on render. These sequences are:

- `|bar|`: replaced with the rendered bar
- `|cur|`: replaced with the current value
- `|max|`: replaced with the maximum value
- `|pct|`: replaced with `100 * current / maximum` to one decimal place.

Everything else in the template is rendered as-is. For example, a simple template showing all elements might be:

`TOTAL |cur|/|max| |bar| |pct|%`

Here it is in action:

```js
const bar = bardot
    .maximum(100)
    .widthTemplate(30)
    .template('TOTAL |cur|/|max| |bar| |pct|%');

console.log(bar.current(35).toString());
// TOTAL  35/100 ⣿⣿⣿⡇         35%

console.log(bar.current(79).toString());
// TOTAL  79/100 ⣿⣿⣿⣿⣿⣿⣿⣷     79%

console.log(bar.current(100).toString());
// TOTAL 100/100 ⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿  100%
```

You can include ANSI sequences in the template to add colour. [`chalk`](https://www.npmjs.com/package/chalk) is great for this. For example:

```js
const tpl = `${chalk.green('|bar|')} |cur|${chalk.dim('/')}|max|`;
```

## Defining your own symbol set

A symbol set is an object that defines:

- One character that's rendered for a fully filled segment of the bar
- One character that's rendered for a fully empty segment of the bar
- An array of characters, one of which is rendered for the fractional segment of the bar, if needed.

The fractional segment helps to improve accuracy, especially of short bars, and it helps to convince users something's happening when animating slow-changing bars. However, there aren't many usable characters for partially complete bar segments, and you might not need to use them.

To show how it works, here's the default symbol set, `symbol.dot8`:

```js
{
    full: '⣿',
    empty: ' ',
    fractions: ['⡀', '⡄', '⡆', '⡇', '⣇', '⣧', '⣷'],
}
```

And here's an example rendering:

```js
const bar = bardot
    .current(6).maximum(9)
    .widthBar(4)
    .template('>|bar|<')
    .symbols(symbol.dot8);

console.log(bar.toString());
// >⣿⣿⣇ <
```

As the `fractions` array contains 7 characters, each character corresponds to 1/(7+1) = 1/8 of a full segment. The value 6/9 corresponds to two segments plus 2/3 of a segment, and 2/3 is between 5/8 and 6/8, so the fifth string in the `fractions` array is used.

In other words: put as many strings in the `fractions` array as you want fractional segments in the bar. Use an empty array for no fractional segments.

### Multi-character symbols

You can, technically, define a symbol set that uses multiple characters for each bar segment. For example:

```js
{
    full: '<>',
    empty: '  ',
    fractions: ['< ', '> ',],
}
```

If you do this it'll just about work, but you'll have fun with character counts in the `widthTemplate` and `widthFill` cases as they assume each bar segment is one character wide. I might fix this at some point.

