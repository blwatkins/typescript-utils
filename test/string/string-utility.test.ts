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

import { describe, test, expect } from 'vitest';

import { PrimitiveTypeError, StaticInstanceError, StringUtility } from '../../src';

import { testAssertMethod, testIsMethod } from '../utils/assert/assert-tests';

import {
    emptyStringInputs,
    nonEmptyStringInputs,
    nonStringInputs,
    singleLineTrimmedInputsNumsAndSymbols,
    singleLineTrimmedFailureInputsLowercase,
    singleLineTrimmedInputsLowercase,
    singleLineTrimmedInputsMixedCase,
    singleLineTrimmedInputsUppercase,
    singleLineTrimmedFailureInputsUppercase,
    singleLineTrimmedFailureInputsMixedCase,
    singleLineTrimmedFailureInputs,
    singleLineTrimmedInputs
} from '../utils/input/string-inputs';

import { testStaticClassConstructor } from '../utils/static/static-class-tests';
import { Scenario } from '../utils/test-case/test-case';

describe('StringUtility', (): void => {
    testStaticClassConstructor('StringUtility', StringUtility as unknown as new () => unknown, StaticInstanceError);

    const nonStringFailureScenario: Scenario = {
        label: 'Non-string inputs',
        inputs: nonStringInputs,
        expected: PrimitiveTypeError
    };

    const emptyStringFailureScenario: Scenario = {
        label: 'Empty string inputs',
        inputs: emptyStringInputs,
        expected: PrimitiveTypeError
    };

    const numsAndSymbolsSuccessScenario: Scenario = {
        label: 'Number and symbol trimmed inputs',
        inputs: singleLineTrimmedInputsNumsAndSymbols,
        expected: undefined
    };

    const stringFailureScenarios: Scenario[] = [nonStringFailureScenario];

    const stringSuccessScenarios: Scenario[] = [
        {
            label: 'String inputs',
            inputs: [
                ...emptyStringInputs,
                ...nonEmptyStringInputs
            ],
            expected: undefined
        }
    ];

    const emptyFailureScenarios: Scenario[] = [
        nonStringFailureScenario,
        {
            label: 'Non-empty string inputs',
            inputs: nonEmptyStringInputs,
            expected: PrimitiveTypeError
        }
    ];

    const emptySuccessScenarios: Scenario[] = [
        {
            label: 'Empty string inputs',
            inputs: emptyStringInputs,
            expected: undefined
        }
    ];

    const nonEmptyFailureScenarios: Scenario[] = [
        nonStringFailureScenario,
        emptyStringFailureScenario
    ];

    const nonEmptySuccessScenarios: Scenario[] = [
        {
            label: 'Non-empty string inputs',
            inputs: nonEmptyStringInputs,
            expected: undefined
        }
    ];

    const singleLineFailureScenarios: Scenario[] = [
        nonStringFailureScenario,
        emptyStringFailureScenario,
        {
            label: 'Single-line trimmed failure inputs',
            inputs: singleLineTrimmedFailureInputs,
            expected: PrimitiveTypeError
        }
    ];

    const singleLineSuccessScenarios: Scenario[] = [
        {
            label: 'Single-line trimmed inputs',
            inputs: singleLineTrimmedInputs,
            expected: undefined
        }
    ];

    const singleLineLowercaseFailureScenarios: Scenario[] = [
        nonStringFailureScenario,
        emptyStringFailureScenario,
        {
            label: 'Incorrect case inputs',
            inputs: [
                ...singleLineTrimmedInputsUppercase,
                ...singleLineTrimmedInputsMixedCase,
                ...singleLineTrimmedFailureInputsUppercase,
                ...singleLineTrimmedFailureInputsMixedCase
            ],
            expected: PrimitiveTypeError
        },
        {
            label: 'Single-line lowercase trimmed failure inputs',
            inputs: singleLineTrimmedFailureInputsLowercase,
            expected: PrimitiveTypeError
        }
    ];

    const singleLineLowercaseSuccessScenarios: Scenario[] = [
        {
            label: 'Single-line lowercase trimmed inputs',
            inputs: singleLineTrimmedInputsLowercase,
            expected: undefined
        },
        numsAndSymbolsSuccessScenario
    ];

    const singleLineUppercaseFailureScenarios: Scenario[] = [
        nonStringFailureScenario,
        emptyStringFailureScenario,
        {
            label: 'Incorrect case inputs',
            inputs: [
                ...singleLineTrimmedInputsLowercase,
                ...singleLineTrimmedInputsMixedCase,
                ...singleLineTrimmedFailureInputsLowercase,
                ...singleLineTrimmedFailureInputsMixedCase
            ],
            expected: PrimitiveTypeError
        },
        {
            label: 'Single-line uppercase trimmed failure inputs',
            inputs: singleLineTrimmedFailureInputsUppercase,
            expected: PrimitiveTypeError
        }
    ];

    const singleLineUppercaseSuccessScenarios: Scenario[] = [
        {
            label: 'Single-line uppercase trimmed inputs',
            inputs: singleLineTrimmedInputsUppercase,
            expected: undefined
        },
        numsAndSymbolsSuccessScenario
    ];

    function withoutNonStringInputs(scenarios: Scenario[]): Scenario[] {
        return scenarios.filter((scenario: Scenario): boolean => {
            return scenario !== nonStringFailureScenario;
        });
    }

    describe('String', (): void => {
        describe('assertString', (): void => {
            testAssertMethod(
                StringUtility.assertString.bind(StringUtility),
                stringSuccessScenarios,
                stringFailureScenarios,
                'Expected a string.'
            );
        });

        describe('isString', (): void => {
            testIsMethod(StringUtility.isString.bind(StringUtility), stringSuccessScenarios, stringFailureScenarios);
        });
    });

    describe('Empty', (): void => {
        describe('assertEmpty', (): void => {
            testAssertMethod(
                StringUtility.assertEmpty.bind(StringUtility),
                emptySuccessScenarios,
                emptyFailureScenarios,
                'Expected an empty string.'
            );
        });

        describe('isEmpty', (): void => {
            testIsMethod(StringUtility.isEmpty.bind(StringUtility), emptySuccessScenarios, emptyFailureScenarios);
        });
    });

    describe('NonEmpty', (): void => {
        describe('assertNonEmpty', (): void => {
            testAssertMethod(
                StringUtility.assertNonEmpty.bind(StringUtility),
                nonEmptySuccessScenarios,
                nonEmptyFailureScenarios,
                'Expected a non-empty string.'
            );
        });

        describe('isNonEmpty', (): void => {
            testIsMethod(StringUtility.isNonEmpty.bind(StringUtility), nonEmptySuccessScenarios, nonEmptyFailureScenarios);
        });
    });

    describe('SingleLine', (): void => {
        describe('assertSingleLine', (): void => {
            testAssertMethod(
                StringUtility.assertSingleLine.bind(StringUtility),
                singleLineSuccessScenarios,
                singleLineFailureScenarios,
                'Expected a single-line string.'
            );
        });

        describe('isSingleLine', (): void => {
            testIsMethod(StringUtility.isSingleLine.bind(StringUtility), singleLineSuccessScenarios, singleLineFailureScenarios);
        });

        describe('singleLine', (): void => {
            function matchesSingleLine(input: unknown): boolean {
                return StringUtility.singleLine.test(input as string);
            }

            testIsMethod(matchesSingleLine, singleLineSuccessScenarios, withoutNonStringInputs(singleLineFailureScenarios));
        });
    });

    describe('SingleLineLowercase', (): void => {
        describe('assertSingleLineLowercase', (): void => {
            testAssertMethod(
                StringUtility.assertSingleLineLowercase.bind(StringUtility),
                singleLineLowercaseSuccessScenarios,
                singleLineLowercaseFailureScenarios,
                'Expected a single-line lowercase string.'
            );
        });

        describe('isSingleLineLowercase', (): void => {
            testIsMethod(StringUtility.isSingleLineLowercase.bind(StringUtility), singleLineLowercaseSuccessScenarios, singleLineLowercaseFailureScenarios);
        });

        describe('singleLineLowercase', (): void => {
            function matchesSingleLineLowercase(input: unknown): boolean {
                return StringUtility.singleLineLowercase.test(input as string);
            }

            testIsMethod(matchesSingleLineLowercase, singleLineLowercaseSuccessScenarios, withoutNonStringInputs(singleLineLowercaseFailureScenarios));
        });
    });

    describe('SingleLineUppercase', (): void => {
        describe('assertSingleLineUppercase', (): void => {
            testAssertMethod(
                StringUtility.assertSingleLineUppercase.bind(StringUtility),
                singleLineUppercaseSuccessScenarios,
                singleLineUppercaseFailureScenarios,
                'Expected a single-line uppercase string.'
            );
        });

        describe('isSingleLineUppercase', (): void => {
            testIsMethod(StringUtility.isSingleLineUppercase.bind(StringUtility), singleLineUppercaseSuccessScenarios, singleLineUppercaseFailureScenarios);
        });

        describe('singleLineUppercase', (): void => {
            function matchesSingleLineUppercase(input: unknown): boolean {
                return StringUtility.singleLineUppercase.test(input as string);
            }

            testIsMethod(matchesSingleLineUppercase, singleLineUppercaseSuccessScenarios, withoutNonStringInputs(singleLineUppercaseFailureScenarios));
        });
    });

    /* ******************* TODO: DEPRECATED ******************* */

    describe('[DEPRECATED] singleLineLowercaseTrimmedPattern', (): void => {
        test('should return the same regular expression as singleLineLowercase', (): void => {
            expect(StringUtility.singleLineLowercaseTrimmedPattern).toBe(StringUtility.singleLineLowercase);
        });
    });

    describe('[DEPRECATED] singleLineUppercaseTrimmedPattern', (): void => {
        test('should return the same regular expression as singleLineUppercase', (): void => {
            expect(StringUtility.singleLineUppercaseTrimmedPattern).toBe(StringUtility.singleLineUppercase);
        });
    });

    describe('[DEPRECATED] singleLineTrimmedPattern', (): void => {
        test('should return the same regular expression as singleLine', (): void => {
            expect(StringUtility.singleLineTrimmedPattern).toBe(StringUtility.singleLine);
        });
    });

    describe('[DEPRECATED] assertStringType', (): void => {
        testAssertMethod(
            StringUtility.assertStringType.bind(StringUtility),
            stringSuccessScenarios,
            stringFailureScenarios,
            'Expected a string.'
        );
    });

    describe('[DEPRECATED] assertSingleLineTrimmedString', (): void => {
        testAssertMethod(
            StringUtility.assertSingleLineTrimmedString.bind(StringUtility),
            singleLineSuccessScenarios,
            singleLineFailureScenarios,
            'Expected a single-line string.'
        );
    });

    describe('[DEPRECATED] isNonEmptyString', (): void => {
        testIsMethod(StringUtility.isNonEmptyString.bind(StringUtility), nonEmptySuccessScenarios, nonEmptyFailureScenarios);
    });

    describe('[DEPRECATED] isSingleLineTrimmedString', (): void => {
        testIsMethod(StringUtility.isSingleLineTrimmedString.bind(StringUtility), singleLineSuccessScenarios, singleLineFailureScenarios);
    });

    describe('[DEPRECATED] isSingleLineLowercaseTrimmedString', (): void => {
        testIsMethod(StringUtility.isSingleLineLowercaseTrimmedString.bind(StringUtility), singleLineLowercaseSuccessScenarios, singleLineLowercaseFailureScenarios);
    });

    describe('[DEPRECATED] isSingleLineUppercaseTrimmedString', (): void => {
        testIsMethod(StringUtility.isSingleLineUppercaseTrimmedString.bind(StringUtility), singleLineUppercaseSuccessScenarios, singleLineUppercaseFailureScenarios);
    });
});
