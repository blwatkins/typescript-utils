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
 *
 * SPDX-License-Identifier: MIT
 */

// noinspection JSPrimitiveTypeWrapperUsage
export const nonNumberInputs: unknown[] = [
    null,
    undefined,
    10n,
    -10n,
    true,
    false,
    '',
    'string',
    '\n\t',
    '     ',
    '5',
    '5.5',
    '-5',
    '0',
    [],
    ['value'],
    [1, 2, 3],
    (): string => 'value',
    (): number => 10,
    (): unknown[] => [],
    (): object => {
        return {};
    },
    Math.random,
    new Number(10),
    new String('value'),
    new Object(10),
    new Object('value'),
    {},
    { key: 'value' },
    { key: 10 },
    { key: [] },
    { key: {} },
    Symbol('test')
];

export const nonFiniteNumberInputs: number[] = [
    NaN,
    Infinity,
    -Infinity
];

export const zeroInputs: number[] = [0, -0];

export const negativeUnsafeNumberInputs: number[] = [
    -Number.MAX_VALUE,
    Number.MIN_SAFE_INTEGER - 1,
    Number.MIN_SAFE_INTEGER - 1.5
];

export const positiveUnsafeNumberInputs: number[] = [
    Number.MAX_VALUE,
    Number.MAX_SAFE_INTEGER + 1,
    Number.MAX_SAFE_INTEGER + 1.5
];

export const unsafeNumberInputs: number[] = [
    ...negativeUnsafeNumberInputs,
    ...positiveUnsafeNumberInputs
];

/**
 * Every input rejected by a parameter that requires a finite number within the safe integer range.
 *
 * @remarks This is the argument-validation fixture for any method whose numeric parameters are guarded by `NumberUtility.assertSafe`.
 */
export const invalidSafeNumberInputs: unknown[] = [
    ...nonNumberInputs,
    ...nonFiniteNumberInputs,
    ...unsafeNumberInputs
];

export const negativeSafeFloatInputs: number[] = [
    -Number.MIN_VALUE,
    -Number.EPSILON,
    -10.01,
    -0.01,
    -(1.0 / 3)
];

export const positiveSafeFloatInputs: number[] = [
    Number.MIN_VALUE,
    Number.EPSILON,
    10.01,
    0.01,
    (1.0 / 3)
];

export const safeFloatInputs: number[] = [
    ...negativeSafeFloatInputs,
    ...positiveSafeFloatInputs
];

export const negativeSafeIntegerInputs: number[] = [
    Number.MIN_SAFE_INTEGER,
    -1,
    -10,
    -100,
    -1000,
    -1000.0
];

export const positiveSafeIntegerInputs: number[] = [
    Number.MAX_SAFE_INTEGER,
    1,
    10,
    100,
    1000,
    1000.0
];

export const safeIntegerInputs: number[] = [
    ...negativeSafeIntegerInputs,
    ...positiveSafeIntegerInputs
];

export const positiveSafeNumberInputs: number[] = [
    ...positiveSafeFloatInputs,
    ...positiveSafeIntegerInputs
];

export const negativeSafeNumberInputs: number[] = [
    ...negativeSafeFloatInputs,
    ...negativeSafeIntegerInputs
];

export const safeNumberInputs: number[] = [
    ...positiveSafeNumberInputs,
    ...negativeSafeNumberInputs
];
