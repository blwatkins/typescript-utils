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
import {hexColorFailureInputs, hexColorInputs, hexColorMixedCaseInputs} from "./color-string-inputs";

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
    { key: {} }
];

export const emptyStringInputs: string[] = [
    '',
    ' ',
    '  ',
    '   ',
    '\n',
    '\t',
    '\n\t',
    '\n \t',
    '\n  \t',
    '\n   \t',
    ' \n\t '
];

export const singleLineTrimmedInputsNumsAndSymbols: string[] = [
    '\u{1F3A8}',
    '\u{1F3A8} \u{1F3A8}',
    '🎨',
    '🎨 🎨',
    '12345',
    '12345 67890',
    '!@#$%^&*()-_+=~`"\'/\\|,.<>?;:'
];

export const singleLineTrimmedInputsMixedCase: string[] = [
    'Example',
    'ëË',
    'ë Ë',
    'Other Example',
    'three WORD example',
    'this IS an Example sEnTeNcE!'
];

export const singleLineTrimmedInputsLowercase: string[] = [
    'example',
    'ë',
    'ë ë',
    'other example',
    'three word example',
    'this is an example sentence!'
];

export const singleLineTrimmedInputsUppercase: string[] = [
    'EXAMPLE',
    'Ë',
    'Ë Ë',
    'OTHER EXAMPLE',
    'THREE WORD EXAMPLE',
    'THIS IS AN EXAMPLE SENTENCE!'
];

export const singleLineTrimmedFailureInputsLowercase: string[] = [
    ' example ',
    '\nexample\n',
    '\texample\t',
    ' \n\texample\t\n ',
    ' leading whitespace example',
    '\nleading whitespace example',
    '\tleading whitespace example',
    ' \n\tleading whitespace example',
    'trailing whitespace example ',
    'trailing whitespace example\n',
    'trailing whitespace example\t',
    'trailing whitespace example\t\n ',
    'internal\nspaces\nexample',
    'internal\tspaces\texample',
    'internal\n\nspaces\n\nexample',
    'internal\t\tspaces\t\texample',
    'internal\n spaces\n example',
    'internal\t spaces\t example',
    'internal  spaces  example',
    'internal   spaces   example'
];

export const singleLineTrimmedFailureInputsUppercase: string[] = [
    ' EXAMPLE ',
    '\nEXAMPLE\n',
    '\tEXAMPLE\t',
    ' \n\tEXAMPLE\t\n ',
    ' LEADING WHITESPACE EXAMPLE',
    '\nLEADING WHITESPACE EXAMPLE',
    '\tLEADING WHITESPACE EXAMPLE',
    ' \n\tLEADING WHITESPACE EXAMPLE',
    'TRAILING WHITESPACE EXAMPLE ',
    'TRAILING WHITESPACE EXAMPLE\n',
    'TRAILING WHITESPACE EXAMPLE\t',
    'TRAILING WHITESPACE EXAMPLE\t\n ',
    'INTERNAL\nSPACES\nEXAMPLE',
    'INTERNAL\tSPACES\tEXAMPLE',
    'INTERNAL\n\nSPACES\n\nEXAMPLE',
    'INTERNAL\t\tSPACES\t\tEXAMPLE',
    'INTERNAL\n SPACES\n EXAMPLE',
    'INTERNAL\t SPACES\t EXAMPLE',
    'INTERNAL  SPACES  EXAMPLE',
    'INTERNAL   SPACES   EXAMPLE'
];

export const singleLineTrimmedFailureInputsMixedCase: string[] = [
    ' Example ',
    '\nExample\n',
    '\tExample\t',
    ' \n\tExample\t\n ',
    ' Leading Whitespace Example',
    '\nLeading Whitespace Example',
    '\tLeading Whitespace Example',
    ' \n\tLeading Whitespace Example',
    'Trailing Whitespace Example ',
    'Trailing Whitespace Example\n',
    'Trailing Whitespace Example\t',
    'Trailing Whitespace Example\t\n ',
    'Internal\nSpaces\nExample',
    'Internal\tSpaces\tExample',
    'Internal\n\nSpaces\n\nExample',
    'Internal\t\tSpaces\t\tExample',
    'Internal\n Spaces\n Example',
    'Internal\t Spaces\t Example',
    'Internal  Spaces  Example',
    'Internal   Spaces   Example'
];

export const singleLineTrimmedInputs: string[] = [
    ...singleLineTrimmedInputsLowercase,
    ...singleLineTrimmedInputsUppercase,
    ...singleLineTrimmedInputsMixedCase,
    ...singleLineTrimmedInputsNumsAndSymbols
];

export const singleLineTrimmedFailureInputs: string[] = [
    ...singleLineTrimmedFailureInputsLowercase,
    ...singleLineTrimmedFailureInputsUppercase,
    ...singleLineTrimmedFailureInputsMixedCase
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
    ...singleLineTrimmedFailureInputs,
    ...singleLineTrimmedInputs,
    ...hexColorInputs,
    ...hexColorMixedCaseInputs,
    ...hexColorFailureInputs
];
