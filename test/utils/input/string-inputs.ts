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

const whitespaceCharacters: string[] = codePointRange(0x0000, 0xFFFF).filter((character: string): boolean => {
    return /^\s$/.test(character);
});

const nonTextWhitespaceCharacters: string[] = whitespaceCharacters.filter((character: string): boolean => {
    return !textWhitespace.includes(character);
});

const textWhitespaceRuns: string[] = unique([
    ...textWhitespace,
    ...mixStrings(textWhitespace, textWhitespace)
]);

const interiorSingleLineFailureRuns: string[] = textWhitespaceRuns.filter((run: string): boolean => {
    return run !== ' ';
});

export const emptyStringInputs: string[] = unique([
    '',
    ...whitespaceCharacters,
    ...mixStrings(textWhitespace, whitespaceCharacters)
]);

const asciiLetters: string[] = [
    ...codePointRange(0x0041, 0x005A),
    ...codePointRange(0x0061, 0x007A)
];

const accentedLetters: string[] = unique(asciiLetters.flatMap((letter: string): string[] => {
    return codePointRange(0x0300, 0x036F).map((mark: string): string => {
        return `${letter}${mark}`.normalize('NFC');
    });
})).filter((character: string): boolean => {
    return /^.$/su.test(character)
        && character === character.normalize('NFKC')
        && /^[A-Za-z]\p{M}$/u.test(character.normalize('NFD'));
});

const accentedLowercaseLetters: string[] = accentedLetters.filter((character: string): boolean => {
    return /\p{Ll}/u.test(character);
});

const accentedUppercaseLetters: string[] = accentedLetters.filter((character: string): boolean => {
    return /\p{Lu}/u.test(character);
});

const twoAccentLetters: string[] = unique(accentedLetters.flatMap((letter: string): string[] => {
    return codePointRange(0x0300, 0x036F).map((mark: string): string => {
        return `${letter}${mark}`.normalize('NFC');
    });
})).filter((character: string): boolean => {
    return /^.$/su.test(character) && character === character.normalize('NFKC');
});

const asciiSymbols: string[] = codePointRange(0x0021, 0x007E).filter((character: string): boolean => {
    return !/[A-Za-z]/.test(character);
});

export const specialCharacterInputs: string[] = ['©', '°', '±', '÷', '•'];

const emojiInputs: string[] = [
    '\u{1F3A8}',
    '⭐',
    '❤️',
    '\u{1F44D}\u{1F3FD}',
    '\u{1F468}‍\u{1F469}‍\u{1F467}',
    '\u{1F3F3}️‍\u{1F308}',
    '\u{1F1FA}\u{1F1F8}',
    '\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}',
    '1️⃣',
    '©️'
];

const lowercaseWords: string[] = ['example', 'word', accentedLowercaseLetters.join('')];

const uppercaseWords: string[] = ['EXAMPLE', 'WORD', accentedUppercaseLetters.join('')];

const mixedCaseWords: string[] = ['Example', 'wOrD', `${accentedUppercaseLetters.join('')}${accentedLowercaseLetters.join('')}`];

const caselessWords: string[] = [
    '12345',
    asciiSymbols.join(''),
    ...asciiSymbols,
    ...emojiInputs,
    ...specialCharacterInputs
];

function buildSingleLineFailureInputs(words: string[]): string[] {
    const [firstWord, secondWord] = words;

    return unique([
        ...interiorSingleLineFailureRuns.map((run: string): string => {
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

const nonNormalizedEmoji: string[] = [
    ...codePointRange(0x2000, 0x33FF),
    ...codePointRange(0x1F000, 0x1FFFF)
].flatMap((character: string): string[] => {
    return [character, `${character}\uFE0F`];
}).filter((emoji: string): boolean => {
    return /^\p{RGI_Emoji}$/v.test(emoji) && emoji !== emoji.normalize('NFKC');
});

const nonTextCharacters: string[] = [
    ...nonNormalizedEmoji,
    ...nonTextWhitespaceCharacters,
    ...codePointRange(0x0000, 0x009F).filter((character: string): boolean => {
        return /\p{Cc}/u.test(character) && !/\s/.test(character);
    }),
    ...codePointRange(0x0000, 0xFFFF).filter((character: string): boolean => {
        return /\p{Cf}/u.test(character) && !/\s/.test(character);
    }),
    '\u{E0001}',
    '\u{E0067}',
    '\u{E007F}',
    '͏',
    '︎',
    '️',
    '́',
    '⃣',
    'а',
    'α',
    '中',
    'ب',
    'א',
    '⠀',
    '،',
    '、',
    'Ａ',
    '\u{1D400}',
    'ⓐ',
    'Ⅰ',
    'ﬁ',
    'ſ',
    'ª',
    'µ',
    'ǅ',
    ';',
    'K',
    '™',
    '…',
    '½',
    '²',
    '´',
    '‘',
    '’',
    '“',
    '”',
    'ʻ',
    'ʼ',
    '×',
    'ß',
    'æ',
    'ø',
    'ł',
    'ı',
    'ɑ',
    '￼',
    '�',
    '',
    '͸',
    '\uD800',
    '\uDC00'
];

export const nonTextCharacterInputs: string[] = unique([
    ...nonTextCharacters.flatMap((character: string): string[] => {
        return [character, ...mixStrings([character], ['text'])];
    }),
    ...twoAccentLetters,
    accentedLowercaseLetters.join('').normalize('NFD'),
    accentedUppercaseLetters.join('').normalize('NFD')
]).filter((input: string): boolean => {
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
