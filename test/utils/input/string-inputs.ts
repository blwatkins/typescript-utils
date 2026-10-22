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

const textWhitespaceCharacters: string[] = [' ', '\t', '\n', '\r\n'];

const emojiInputs: string[] = [
    '\u{1F3A8}', // 🎨 - Palette
    '\u{1F44D}\u{1F3FD}', // 👍🏽 - Thumbs up with skin tone
    '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}', // 👨‍👩‍👧 - Family
    '\u{1F1FA}\u{1F1F8}', // 🇺🇸 - US flag
    '\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}', // Scottish flag
    '1\uFE0F\u20E3', // One
    '\u00A9\uFE0F', // ©️ - Copyright
    '\u2122\uFE0F' // ™️ - Trademark
];

const rejectedLatin1Characters: string[] = [
    '\u00A6',
    '\u00A8',
    '\u00AA',
    '\u00AC',
    '\u00AD',
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

export const definedNonStringInputs: unknown[] = nonStringInputs.filter((input: unknown): boolean => {
    return input !== undefined;
});

function charactersFromCodePointRange(start: number, end: number): string[] {
    return Array.from({ length: end - start + 1 }, (_value: unknown, index: number): string => {
        return String.fromCodePoint(start + index);
    });
}

const asciiSymbols: string = charactersFromCodePointRange(0x0021, 0x007E).filter((character: string): boolean => {
    return !/[A-Za-z]/.test(character);
}).join('');

const acceptedLatin1Characters: string[] = charactersFromCodePointRange(0x00A1, 0x00FF).filter((character: string): boolean => {
    return !rejectedLatin1Characters.includes(character);
});

const acceptedLatin1Symbols: string = acceptedLatin1Characters.filter((character: string): boolean => {
    return !/\p{L}/u.test(character);
}).join('');

const acceptedLatin1LowercaseLetters: string = acceptedLatin1Characters.filter((character: string): boolean => {
    return /\p{Ll}/u.test(character);
}).join('');

const acceptedLatin1UppercaseLetters: string = acceptedLatin1Characters.filter((character: string): boolean => {
    return /\p{Lu}/u.test(character);
}).join('');

const caselessWords: string[] = ['1234567890', asciiSymbols, acceptedLatin1Symbols, '\u2022', ...emojiInputs];

const mixedCaseWords: string[] = ['Example', 'wOrD', 'CaF\u00E9', `${acceptedLatin1UppercaseLetters}${acceptedLatin1LowercaseLetters}`];

const lowercaseWords: string[] = ['example', 'word', 'caf\u00E9', acceptedLatin1LowercaseLetters];

const uppercaseWords: string[] = ['EXAMPLE', 'WORD', 'CAF\u00C9', acceptedLatin1UppercaseLetters];

const allWhitespaceCharacters: string[] = charactersFromCodePointRange(0x0000, 0xFFFF).filter((character: string): boolean => {
    return /^\s$/.test(character);
});

const nonTextCharacters: string[] = [
    '\r',
    ...charactersFromCodePointRange(0x0000, 0x009F).filter((character: string): boolean => {
        return /\p{Cc}/u.test(character) && !['\t', '\n', '\r'].includes(character);
    }),
    ...charactersFromCodePointRange(0x0000, 0xFFFF).filter((character: string): boolean => {
        return /\p{Cf}/u.test(character) && !/\s/.test(character);
    }),
    ...allWhitespaceCharacters.filter((character: string): boolean => {
        return ![' ', '\t', '\n', '\r'].includes(character);
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

function unique(inputs: string[]): string[] {
    return [...new Set(inputs)];
}

function pairStrings(inputsA: string[], inputsB: string[]): string[] {
    return unique(inputsA.flatMap((inputA: string): string[] => {
        return inputsB.flatMap((inputB: string): string[] => {
            return [`${inputA}${inputB}`, `${inputB}${inputA}`];
        });
    }));
}

const consecutiveTextWhitespace: string[] = pairStrings(textWhitespaceCharacters, textWhitespaceCharacters);

function mixStrings(inputsA: string[], inputsB: string[]): string[] {
    return unique(inputsA.flatMap((inputA: string): string[] => {
        return inputsB.flatMap((inputB: string): string[] => {
            return [`${inputA}${inputB}`, `${inputB}${inputA}`, `${inputA}${inputB}${inputA}`, `${inputB}${inputA}${inputB}`];
        });
    }));
}

function buildSingleLineFailureInputs(tokens: string[]): string[] {
    return [
        ...mixStrings(
            tokens,
            textWhitespaceCharacters.filter((character: string): boolean => {
                return character !== ' ';
            })
        ),
        ...mixStrings(tokens, consecutiveTextWhitespace),
        ...pairStrings(tokens, [' '])
    ];
}

function buildSingleLineInputs(tokens: string[]): string[] {
    return [
        ...tokens,
        tokens.join(' ')
    ];
}

export const emptyStringInputs: string[] = unique([
    '',
    ...allWhitespaceCharacters,
    ...textWhitespaceCharacters,
    ...consecutiveTextWhitespace,
    ...mixStrings(allWhitespaceCharacters, textWhitespaceCharacters)
]);

export const singleLineCaselessInputs: string[] = buildSingleLineInputs(caselessWords);

export const singleLineMixedCaseInputs: string[] = buildSingleLineInputs(mixedCaseWords);

export const singleLineLowercaseInputs: string[] = buildSingleLineInputs(lowercaseWords);

export const singleLineUppercaseInputs: string[] = buildSingleLineInputs(uppercaseWords);

export const singleLineFailureCaselessInputs: string[] = buildSingleLineFailureInputs([caselessWords.join(' ')]);

export const singleLineFailureMixedCaseInputs: string[] = buildSingleLineFailureInputs([mixedCaseWords.join(' ')]);

export const singleLineFailureLowercaseInputs: string[] = buildSingleLineFailureInputs([lowercaseWords.join(' ')]);

export const singleLineFailureUppercaseInputs: string[] = buildSingleLineFailureInputs([uppercaseWords.join(' ')]);

export const singleLineInputs: string[] = [
    ...singleLineCaselessInputs,
    ...singleLineMixedCaseInputs,
    ...singleLineLowercaseInputs,
    ...singleLineUppercaseInputs
];

export const singleLineFailureTextInputs: string[] = [
    ...singleLineFailureCaselessInputs,
    ...singleLineFailureMixedCaseInputs,
    ...singleLineFailureLowercaseInputs,
    ...singleLineFailureUppercaseInputs
];

export const textInputs: string[] = [
    ...singleLineInputs,
    ...singleLineFailureTextInputs
];

export const nonTextStringInputs: string[] = unique([
    ...nonTextCharacters,
    ...mixStrings(nonTextCharacters, ['text'])
]).filter((input: string): boolean => {
    return input.trim().length > 0;
});

export const singleLineFailureStringInputs: string[] = unique([
    ...emptyStringInputs,
    ...nonTextStringInputs,
    ...singleLineFailureTextInputs
]);

export const nonEmptyStringInputs: string[] = unique([
    ...nonTextStringInputs,
    ...textInputs
]);

export const stringInputs: string[] = unique([
    ...emptyStringInputs,
    ...nonTextStringInputs,
    ...textInputs
]);
