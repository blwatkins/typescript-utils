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
export const nonStringInputs: unknown[] = [
    null,
    undefined,
    0,
    1,
    -1,
    Number.NaN,
    Infinity,
    true,
    false,
    {},
    { key: 'value' },
    [],
    ['value'],
    (): string => 'value',
    Math.random,
    new String('value'),
    Object('value'),
    10n
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

export const numberAndSymbolTrimmedInputs: string[] = [
    '\u{1F3A8}',
    '\u{1F3A8} \u{1F3A8}',
    '🎨',
    '🎨 🎨',
    '12345',
    '12345 67890',
    '!@#$%^&*()-_+=~`"\'/\\|,.<>?;:'
];

export const singleLineMixedCaseTrimmedInputs: string[] = [
    'Example',
    'ëË',
    'ë Ë',
    'Other Example',
    'three WORD example',
    'this IS an Example sEnTeNcE!'
];

export const singleLineLowercaseTrimmedInputs: string[] = [
    'example',
    'ë',
    'ë ë',
    'other example',
    'three word example',
    'this is an example sentence!'
];

export const singleLineUppercaseTrimmedInputs: string[] = [
    'EXAMPLE',
    'Ë',
    'Ë Ë',
    'OTHER EXAMPLE',
    'THREE WORD EXAMPLE',
    'THIS IS AN EXAMPLE SENTENCE!'
];

export const singleLineLowercaseTrimmedFailureInputs: string[] = [
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
    ...singleLineLowercaseTrimmedFailureInputs,
    ...singleLineLowercaseTrimmedInputs,
    ...singleLineUppercaseTrimmedInputs,
    ...singleLineMixedCaseTrimmedInputs
];
