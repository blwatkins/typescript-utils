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

    describe('String', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            }
        ];

        const successScenarios: Scenario[] = [
            {
                label: 'String inputs',
                inputs: [
                    ...emptyStringInputs,
                    ...nonEmptyStringInputs
                ],
                expected: undefined
            }
        ];

        describe('assertString', (): void => {
            testAssertMethod(
                StringUtility.assertString.bind(StringUtility),
                successScenarios,
                failureScenarios,
                'Expected a string.'
            );
        });

        describe('isString', (): void => {
            testIsMethod(StringUtility.isString.bind(StringUtility), successScenarios, failureScenarios);
        });
    });

    describe('Empty', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Non-empty string inputs',
                inputs: nonEmptyStringInputs,
                expected: PrimitiveTypeError
            }
        ];

        const successScenarios: Scenario[] = [
            {
                label: 'Empty string inputs',
                inputs: emptyStringInputs,
                expected: undefined
            }
        ];

        describe('assertEmpty', (): void => {
            testAssertMethod(
                StringUtility.assertEmpty.bind(StringUtility),
                successScenarios,
                failureScenarios,
                'Expected an empty string.'
            );
        });

        describe('isEmpty', (): void => {
            testIsMethod(StringUtility.isEmpty.bind(StringUtility), successScenarios, failureScenarios);
        });
    });

    describe('NonEmpty', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Empty string inputs',
                inputs: emptyStringInputs,
                expected: PrimitiveTypeError
            }
        ];

        const successScenarios: Scenario[] = [
            {
                label: 'Non-empty string inputs',
                inputs: nonEmptyStringInputs,
                expected: undefined
            }
        ];

        describe('assertNonEmpty', (): void => {
            testAssertMethod(
                StringUtility.assertNonEmpty.bind(StringUtility),
                successScenarios,
                failureScenarios,
                'Expected a non-empty string.'
            );
        });

        describe('isNonEmpty', (): void => {
            testIsMethod(StringUtility.isNonEmpty.bind(StringUtility), successScenarios, failureScenarios);
        });
    });

    describe('SingleLine', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Empty string inputs',
                inputs: emptyStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Single-line trimmed failure inputs',
                inputs: singleLineTrimmedFailureInputs,
                expected: PrimitiveTypeError
            }
        ];

        const successScenarios: Scenario[] = [
            {
                label: 'Single-line trimmed inputs',
                inputs: singleLineTrimmedInputs,
                expected: undefined
            }
        ];

        describe('assertSingleLine', (): void => {
            testAssertMethod(
                StringUtility.assertSingleLine.bind(StringUtility),
                successScenarios,
                failureScenarios,
                'Expected a single-line string.'
            );
        });

        describe('isSingleLine', (): void => {
            testIsMethod(StringUtility.isSingleLine.bind(StringUtility), successScenarios, failureScenarios);
        });

        describe('singleLine', (): void => {
            const stringFailureScenarios: Scenario[] = failureScenarios.filter(({ inputs: scenarioInputs }: Scenario): boolean => {
                return scenarioInputs !== nonStringInputs;
            });

            function matchesSingleLine(input: unknown): boolean {
                return StringUtility.singleLine.test(input as string);
            }

            testIsMethod(matchesSingleLine, successScenarios, stringFailureScenarios);
        });
    });

    describe('SingleLineLowercase', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Empty string inputs',
                inputs: emptyStringInputs,
                expected: PrimitiveTypeError
            },
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

        const successScenarios: Scenario[] = [
            {
                label: 'Single-line lowercase trimmed inputs',
                inputs: singleLineTrimmedInputsLowercase,
                expected: undefined
            },
            {
                label: 'Number and symbol trimmed inputs',
                inputs: singleLineTrimmedInputsNumsAndSymbols,
                expected: undefined
            }
        ];

        describe('assertSingleLineLowercase', (): void => {
            testAssertMethod(
                StringUtility.assertSingleLineLowercase.bind(StringUtility),
                successScenarios,
                failureScenarios,
                'Expected a single-line lowercase string.'
            );
        });

        describe('isSingleLineLowercase', (): void => {
            testIsMethod(StringUtility.isSingleLineLowercase.bind(StringUtility), successScenarios, failureScenarios);
        });

        describe('singleLineLowercase', (): void => {
            const stringFailureScenarios: Scenario[] = failureScenarios.filter(({ inputs: scenarioInputs }: Scenario): boolean => {
                return scenarioInputs !== nonStringInputs;
            });

            function matchesSingleLineLowercase(input: unknown): boolean {
                return StringUtility.singleLineLowercase.test(input as string);
            }

            testIsMethod(matchesSingleLineLowercase, successScenarios, stringFailureScenarios);
        });
    });

    describe('SingleLineUppercase', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Empty string inputs',
                inputs: emptyStringInputs,
                expected: PrimitiveTypeError
            },
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

        const successScenarios: Scenario[] = [
            {
                label: 'Single-line uppercase trimmed inputs',
                inputs: singleLineTrimmedInputsUppercase,
                expected: undefined
            },
            {
                label: 'Number and symbol trimmed inputs',
                inputs: singleLineTrimmedInputsNumsAndSymbols,
                expected: undefined
            }
        ];

        describe('assertSingleLineUppercase', (): void => {
            testAssertMethod(
                StringUtility.assertSingleLineUppercase.bind(StringUtility),
                successScenarios,
                failureScenarios,
                'Expected a single-line uppercase string.'
            );
        });

        describe('isSingleLineUppercase', (): void => {
            testIsMethod(StringUtility.isSingleLineUppercase.bind(StringUtility), successScenarios, failureScenarios);
        });

        describe('singleLineUppercase', (): void => {
            const stringFailureScenarios: Scenario[] = failureScenarios.filter(({ inputs: scenarioInputs }: Scenario): boolean => {
                return scenarioInputs !== nonStringInputs;
            });

            function matchesSingleLineUppercase(input: unknown): boolean {
                return StringUtility.singleLineUppercase.test(input as string);
            }

            testIsMethod(matchesSingleLineUppercase, successScenarios, stringFailureScenarios);
        });
    });

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
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            }
        ];

        const successScenarios: Scenario[] = [
            {
                label: 'String inputs',
                inputs: [
                    ...emptyStringInputs,
                    ...nonEmptyStringInputs
                ],
                expected: undefined
            }
        ];

        testAssertMethod(
            StringUtility.assertStringType.bind(StringUtility),
            successScenarios,
            failureScenarios,
            'Expected a string.'
        );
    });

    describe('[DEPRECATED] assertSingleLineTrimmedString', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Empty string inputs',
                inputs: emptyStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Single-line trimmed failure inputs',
                inputs: singleLineTrimmedFailureInputs,
                expected: PrimitiveTypeError
            }
        ];

        const successScenarios: Scenario[] = [
            {
                label: 'Single-line trimmed inputs',
                inputs: singleLineTrimmedInputs,
                expected: undefined
            }
        ];

        testAssertMethod(
            StringUtility.assertSingleLineTrimmedString.bind(StringUtility),
            successScenarios,
            failureScenarios,
            'Expected a single-line string.'
        );
    });

    describe('[DEPRECATED] isNonEmptyString', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Empty string inputs',
                inputs: emptyStringInputs,
                expected: PrimitiveTypeError
            }
        ];

        const successScenarios: Scenario[] = [
            {
                label: 'Non-empty string inputs',
                inputs: nonEmptyStringInputs,
                expected: undefined
            }
        ];

        testIsMethod(StringUtility.isNonEmptyString.bind(StringUtility), successScenarios, failureScenarios);
    });

    describe('[DEPRECATED] isSingleLineTrimmedString', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Empty string inputs',
                inputs: emptyStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Single-line trimmed failure inputs',
                inputs: singleLineTrimmedFailureInputs,
                expected: PrimitiveTypeError
            }
        ];

        const successScenarios: Scenario[] = [
            {
                label: 'Single-line trimmed inputs',
                inputs: singleLineTrimmedInputs,
                expected: undefined
            }
        ];

        testIsMethod(StringUtility.isSingleLineTrimmedString.bind(StringUtility), successScenarios, failureScenarios);
    });

    describe('[DEPRECATED] isSingleLineLowercaseTrimmedString', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Empty string inputs',
                inputs: emptyStringInputs,
                expected: PrimitiveTypeError
            },
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

        const successScenarios: Scenario[] = [
            {
                label: 'Single-line lowercase trimmed inputs',
                inputs: singleLineTrimmedInputsLowercase,
                expected: undefined
            },
            {
                label: 'Number and symbol trimmed inputs',
                inputs: singleLineTrimmedInputsNumsAndSymbols,
                expected: undefined
            }
        ];

        testIsMethod(StringUtility.isSingleLineLowercaseTrimmedString.bind(StringUtility), successScenarios, failureScenarios);
    });

    describe('[DEPRECATED] isSingleLineUppercaseTrimmedString', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Empty string inputs',
                inputs: emptyStringInputs,
                expected: PrimitiveTypeError
            },
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

        const successScenarios: Scenario[] = [
            {
                label: 'Single-line uppercase trimmed inputs',
                inputs: singleLineTrimmedInputsUppercase,
                expected: undefined
            },
            {
                label: 'Number and symbol trimmed inputs',
                inputs: singleLineTrimmedInputsNumsAndSymbols,
                expected: undefined
            }
        ];

        testIsMethod(StringUtility.isSingleLineUppercaseTrimmedString.bind(StringUtility), successScenarios, failureScenarios);
    });
});
