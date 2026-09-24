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

function unique(inputs: string[]): string[] {
    return [...new Set(inputs)];
}

function mixStrings(inputsA: string[], inputsB: string[]): string[] {
    return unique(inputsA.flatMap((inputA: string): string[] => {
        return inputsB.flatMap((inputB: string): string[] => {
            return [`${inputA}${inputB}`, `${inputB}${inputA}`, `${inputA}${inputB}${inputA}`, `${inputB}${inputA}${inputB}`];
        });
    }));
}

function codePointRange(start: number, end: number): string[] {
    return Array.from({ length: end - start + 1 }, (_value: unknown, index: number): string => {
        return String.fromCodePoint(start + index);
    });
}

function buildSingleLineInputs(words: string[]): string[] {
    return unique([
        ...words,
        ...words.map((word: string, index: number): string => {
            return `${word} ${words[(index + 1) % words.length]}`;
        }),
        words.join(' ')
    ]);
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

const textWhitespace: string[] = [' ', '\t', '\n', '\r\n'];

const textWhitespaceRuns: string[] = unique([
    ...textWhitespace,
    ...textWhitespace.flatMap((first: string): string[] => {
        return textWhitespace.map((second: string): string => {
            return `${first}${second}`;
        });
    })
]);

const whitespaceCharacters: string[] = codePointRange(0x0000, 0xFFFF).filter((character: string): boolean => {
    return /^\s$/.test(character);
});

export const emptyStringInputs: string[] = unique([
    '',
    ...whitespaceCharacters,
    ...textWhitespaceRuns,
    ...whitespaceCharacters.map((character: string): string => {
        return ` ${character} `;
    })
]);

const rejectedLatin1Characters: string[] = [
    '\u00A6',
    '\u00A8',
    '\u00AA',
    '\u00AC',
    '\u00AD',
    '\u00AE',
    '\u00AF',
    '\u00B2',
    '\u00B3',
    '\u00B4',
    '\u00B5',
    '\u00B6',
    '\u00B7',
    '\u00B8',
    '\u00B9',
    '\u00BA',
    '\u00BC',
    '\u00BD',
    '\u00BE',
    '\u00C6',
    '\u00D0',
    '\u00D7',
    '\u00D8',
    '\u00DE',
    '\u00DF',
    '\u00E6',
    '\u00F0',
    '\u00F8',
    '\u00FE'
];

const acceptedLatin1Characters: string[] = codePointRange(0x00A1, 0x00FF).filter((character: string): boolean => {
    return !rejectedLatin1Characters.includes(character);
});

const acceptedLatin1Symbols: string[] = acceptedLatin1Characters.filter((character: string): boolean => {
    return !/\p{L}/u.test(character);
});

const acceptedLowercaseLetters: string = acceptedLatin1Characters.filter((character: string): boolean => {
    return /\p{Ll}/u.test(character);
}).join('');

const acceptedUppercaseLetters: string = acceptedLatin1Characters.filter((character: string): boolean => {
    return /\p{Lu}/u.test(character);
}).join('');

const asciiSymbols: string = codePointRange(0x0021, 0x007E).filter((character: string): boolean => {
    return !/[A-Za-z]/.test(character);
}).join('');

const emojiInputs: string[] = [
    '\u{1F3A8}',
    '\u{1F44D}\u{1F3FD}',
    '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}',
    '\u{1F1FA}\u{1F1F8}',
    '\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}',
    '1\uFE0F\u20E3',
    '\u00A9\uFE0F',
    '\u2122\uFE0F'
];

const lowercaseWords: string[] = ['example', 'caf\u00E9', acceptedLowercaseLetters];

const uppercaseWords: string[] = ['EXAMPLE', 'CAF\u00C9', acceptedUppercaseLetters];

const mixedCaseWords: string[] = ['Example', 'wOrD', `${acceptedUppercaseLetters}${acceptedLowercaseLetters}`];

const caselessWords: string[] = ['12345', asciiSymbols, acceptedLatin1Symbols.join(''), '\u2022', ...emojiInputs];

function buildSingleLineFailureInputs(words: string[]): string[] {
    const [firstWord, secondWord] = words;

    return unique([
        ...textWhitespaceRuns.filter((run: string): boolean => {
            return run !== ' ';
        }).map((run: string): string => {
            return `${firstWord}${run}${secondWord}`;
        }),
        ...textWhitespaceRuns.flatMap((run: string): string[] => {
            return [`${run}${firstWord}`, `${firstWord}${run}`, `${run}${firstWord}${run}`];
        })
    ]);
}

export const singleLineInputsNumsAndSymbols: string[] = buildSingleLineInputs(caselessWords);

export const singleLineInputsMixedCase: string[] = buildSingleLineInputs(mixedCaseWords);

export const singleLineInputsLowercase: string[] = buildSingleLineInputs(lowercaseWords);

export const singleLineInputsUppercase: string[] = buildSingleLineInputs(uppercaseWords);

export const singleLineFailureInputsLowercase: string[] = buildSingleLineFailureInputs(lowercaseWords);

export const singleLineFailureInputsUppercase: string[] = buildSingleLineFailureInputs(uppercaseWords);

export const singleLineFailureInputsMixedCase: string[] = buildSingleLineFailureInputs(mixedCaseWords);

export const singleLineFailureInputsNumsAndSymbols: string[] = buildSingleLineFailureInputs(caselessWords);

export const singleLineInputs: string[] = [
    ...singleLineInputsLowercase,
    ...singleLineInputsUppercase,
    ...singleLineInputsMixedCase,
    ...singleLineInputsNumsAndSymbols
];

export const singleLineFailureInputs: string[] = [
    ...singleLineFailureInputsLowercase,
    ...singleLineFailureInputsUppercase,
    ...singleLineFailureInputsMixedCase,
    ...singleLineFailureInputsNumsAndSymbols
];

export const textInputs: string[] = [
    ...singleLineInputs,
    ...singleLineFailureInputs
];

const nonTextCharacters: string[] = [
    '\r',
    ...codePointRange(0x0000, 0x009F).filter((character: string): boolean => {
        return /\p{Cc}/u.test(character) && !['\t', '\n', '\r'].includes(character);
    }),
    ...whitespaceCharacters.filter((character: string): boolean => {
        return ![' ', '\t', '\n', '\r'].includes(character);
    }),
    ...codePointRange(0x0000, 0xFFFF).filter((character: string): boolean => {
        return /\p{Cf}/u.test(character) && !/\s/.test(character);
    }),
    ...rejectedLatin1Characters,
    '\u{E0001}',
    '\u{E0067}',
    '\u{E007F}',
    '\u034F',
    '\u115F',
    '\u3164',
    '\uFFA0',
    '\u2800',
    '\uFE0E',
    '\uFE0F',
    '\u0301',
    '\u20E3',
    '\u00AE\uFE0F',
    '\u0430',
    '\u03B1',
    '\u4E2D',
    '\u0628',
    '\u05D0',
    '\u0142',
    '\u0159',
    '\u1EC5',
    '\u017F',
    '\u0131',
    '\uFF21',
    '\u{1D400}',
    '\u2122',
    '\u2019',
    '\u02BB',
    '\uFFFC',
    '\uFFFD',
    '\uE000',
    '\u0378',
    '\uD800',
    '\uDC00'
];

export const nonTextCharacterInputs: string[] = unique(nonTextCharacters.flatMap((character: string): string[] => {
    return [character, ...mixStrings([character], ['text'])];
})).filter((input: string): boolean => {
    return input.trim().length > 0;
});

export const nonTextStringInputs: string[] = [
    ...emptyStringInputs,
    ...nonTextCharacterInputs
];

export const nonSingleLineStringInputs: string[] = [
    ...nonTextStringInputs,
    ...singleLineFailureInputs
];

export const nonEmptyStringInputs: string[] = [
    ...textInputs,
    ...nonTextCharacterInputs
];
