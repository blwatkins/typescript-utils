/*
 * Copyright (c) 2026 Brittni Watkins.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
 * AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

// noinspection JSPrimitiveTypeWrapperUsage
export const nonNumberInputs: unknown[] = [
    null,
    undefined,
    '',
    'string',
    '\n\t',
    '     ',
    {},
    { key: 'value' },
    (): number => 10,
    Math.random,
    true,
    false,
    '5',
    '5.5',
    '-5',
    '0',
    new Number(10),
    Object(10),
    10n,
    [],
    ['value']
];

export const nonFiniteNumberInputs: number[] = [
    NaN,
    Infinity,
    -Infinity
];

export const positiveFloatInputs: number[] = [
    Number.MIN_VALUE,
    Number.EPSILON,
    10.01,
    0.01,
    (1.0 / 3)
];

export const positiveNumberInputs: number[] = [
    ...positiveFloatInputs,
    10,
    Number.MAX_VALUE,
    Number.MAX_SAFE_INTEGER,
];

export const negativeNumberInputs: number[] = [
    -10,
    -10.01,
    -Number.MIN_VALUE,
    -Number.MAX_VALUE,
    -Number.MAX_SAFE_INTEGER,
    -Number.EPSILON,
    Number.MIN_SAFE_INTEGER
];

export const zeroInputs: number[] = [0, -0];
