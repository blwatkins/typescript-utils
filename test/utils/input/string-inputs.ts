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

function mixStrings(inputsA: string[], inputsB: string[]): string[] {
    return inputsA.flatMap((inputA: string): string[] => {
        return inputsB.flatMap((inputB: string): string[] => {
            return [`${inputA}${inputB}`, `${inputB}${inputA}`, `${inputA}${inputB}${inputA}`, `${inputB}${inputA}${inputB}`];
        });
    });
}

// noinspection JSPrimitiveTypeWrapperUsage
export const nonStringInputs: unknown[] = [
    null,
    undefined,
    0,
    1,
    -1,
    10n,
    -10n,
    1.5,
    -1.5,
    Number.MAX_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
    Number.MAX_VALUE,
    Number.MIN_VALUE,
    Number.EPSILON,
    Number.NaN,
    Infinity,
    -Infinity,
    true,
    false,
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

export const definedNonStringInputs: unknown[] = nonStringInputs.filter((input: unknown): boolean => {
    return input !== undefined;
});

const baseEmptyStringInputs: string[] = [
    '',
    ' ',
    '\n',
    '\t',
    '\r',
    '\v',
    '\f',
    '\u00A0',
    '\uFEFF',
    '\u2000',
    '\u3000',
    '\u2028',
    '\u2029'
];

export const emptyStringInputs: string[] = [
    ...baseEmptyStringInputs,
    ...mixStrings(baseEmptyStringInputs, baseEmptyStringInputs)
];

function buildWhitespaceFailureStrings(tokens: string[]): string[] {
    return [...baseEmptyStringInputs, '  ', '   '].flatMap((empty: string): string[] => {
        return mixStrings([empty], [tokens.join(empty)]);
    });
}

export const singleLineInputsNumsAndSymbols: string[] = [
    '\u{1F3A8}',
    '\u{1F3A8} \u{1F3A8}',
    '🎨',
    '🎨 🎨',
    '12345',
    '12345 67890',
    '!@#$%^&*()-_+=~`"\'/\\|,.<>?;:'
];

export const singleLineInputsMixedCase: string[] = [
    'Example',
    'ëË',
    'ë Ë',
    'Other Example',
    'three WORD example',
    'this IS an Example sEnTeNcE!'
];

export const singleLineInputsLowercase: string[] = [
    'example',
    'ë',
    'ë ë',
    'other example',
    'three word example',
    'this is an example sentence!'
];

export const singleLineInputsUppercase: string[] = [
    'EXAMPLE',
    'Ë',
    'Ë Ë',
    'OTHER EXAMPLE',
    'THREE WORD EXAMPLE',
    'THIS IS AN EXAMPLE SENTENCE!'
];

export const singleLineFailureInputsLowercase: string[] = [
    ...buildWhitespaceFailureStrings(['e', 'e']),
    ...buildWhitespaceFailureStrings(['ë', 'ë'])
];

export const singleLineFailureInputsUppercase: string[] = [
    ...buildWhitespaceFailureStrings(['E', 'E']),
    ...buildWhitespaceFailureStrings(['Ë', 'Ë'])
];

export const singleLineFailureInputsMixedCase: string[] = [
    ...buildWhitespaceFailureStrings(['E', 'e']),
    ...buildWhitespaceFailureStrings(['e', 'E']),
    ...buildWhitespaceFailureStrings(['Ë', 'ë']),
    ...buildWhitespaceFailureStrings(['ë', 'Ë'])
];

export const singleLineInputs: string[] = [
    ...singleLineInputsLowercase,
    ...singleLineInputsUppercase,
    ...singleLineInputsMixedCase,
    ...singleLineInputsNumsAndSymbols
];

export const singleLineFailureInputs: string[] = [
    ...singleLineFailureInputsLowercase,
    ...singleLineFailureInputsUppercase,
    ...singleLineFailureInputsMixedCase
];

const baseNullCharacterInputs: string[] = [
    '\x00',
    'null\x00character',
    'null character\x00',
    '\x00null character'
];

export const nullCharacterInputs: string[] = [
    ...baseNullCharacterInputs,
    ...mixStrings(baseEmptyStringInputs, baseNullCharacterInputs)
];

export const nonEmptyStringInputs: string[] = [
    'Hello, World!',
    'string',
    'value',
    'a',
    '0',
    ' false ',
    '\u{1F3A8}',
    '🎨',
    'ë',
    ...singleLineFailureInputs,
    ...singleLineInputs,
    ...nullCharacterInputs
];
