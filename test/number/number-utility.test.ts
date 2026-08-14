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

import { describe, test, expect } from 'vitest';

import { NumberUtility, PrimitiveTypeError, StaticInstanceError } from '../../src';

import { testAssertMethod } from '../utils/assert/assert-tests';

import {
    floatInputs,
    integerInputs,
    negativeIntegerInputs,
    negativeNumberInputs,
    nonFiniteNumberInputs,
    nonNumberInputs,
    positiveIntegerInputs,
    positiveNumberInputs,
    zeroInputs
} from '../utils/input/number-inputs';

import { testStaticClassConstructor } from '../utils/static/static-class-tests';
import { Scenario, TestCase, buildTestCases } from '../utils/test-case/test-case';

describe('NumberUtility', (): void => {
    testStaticClassConstructor('NumberUtility', NumberUtility as unknown as new () => unknown, StaticInstanceError);

    describe('assertFiniteNumber', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-number inputs',
                inputs: nonNumberInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Non-finite number inputs',
                inputs: nonFiniteNumberInputs,
                expected: PrimitiveTypeError
            }
        ];

        const successScenarios: Scenario[] = [
            {
                label: 'Number inputs',
                inputs: [
                    ...positiveNumberInputs,
                    ...negativeNumberInputs,
                    ...zeroInputs
                ],
                expected: undefined
            }
        ];

        testAssertMethod(
            NumberUtility.assertFiniteNumber.bind(NumberUtility),
            successScenarios,
            failureScenarios,
            (input: unknown): string => {
                return `Expected a finite number, but received: ${typeof input}.`;
            }
        );
    });

    describe('assertInteger', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-number inputs',
                inputs: nonNumberInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Non-finite number inputs',
                inputs: nonFiniteNumberInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Float inputs',
                inputs: floatInputs,
                expected: PrimitiveTypeError
            }
        ];

        const successScenarios: Scenario[] = [
            {
                label: 'Zero inputs',
                inputs: zeroInputs,
                expected: undefined
            },
            {
                label: 'Integer inputs',
                inputs: integerInputs,
                expected: undefined
            }
        ];

        testAssertMethod(
            NumberUtility.assertInteger.bind(NumberUtility),
            successScenarios,
            failureScenarios,
            (input: unknown): string => {
                return `Expected an integer, but received: ${typeof input}.`;
            }
        );
    });

    describe('assertPositiveInteger', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-number inputs',
                inputs: nonNumberInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Non-finite number inputs',
                inputs: nonFiniteNumberInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Float inputs',
                inputs: floatInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Negative integer inputs',
                inputs: negativeIntegerInputs,
                expected: PrimitiveTypeError
            }
        ];

        const successScenarios: Scenario[] = [
            {
                label: 'Positive integer inputs',
                inputs: positiveIntegerInputs,
                expected: undefined
            }
        ];

        function assertPositiveIntegerWithZeroInclusive(input: unknown, message?: string): void {
            NumberUtility.assertPositiveInteger(input, true, message);
        }

        function assertPositiveInteger(input: unknown, message?: string): void {
            NumberUtility.assertPositiveInteger(input, false, message);
        }

        testAssertMethod(
            assertPositiveIntegerWithZeroInclusive,
            [
                ...successScenarios,
                {
                    label: 'Zero inputs',
                    inputs: zeroInputs,
                    expected: undefined
                }
            ],
            failureScenarios,
            (input: unknown): string => {
                return `Expected a positive integer (zeroInclusive=true), but received: ${typeof input}.`;
            }
        );

        testAssertMethod(
            assertPositiveInteger,
            successScenarios,
            [
                ...failureScenarios,
                {
                    label: 'Zero inputs',
                    inputs: zeroInputs,
                    expected: PrimitiveTypeError
                }
            ],
            (input: unknown): string => {
                return `Expected a positive integer (zeroInclusive=false), but received: ${typeof input}.`;
            }
        );
    });

    describe('isFiniteNumber', (): void => {
        const scenarios: Scenario[] = [
            {
                label: 'Non-number inputs',
                inputs: [...nonNumberInputs],
                expected: false
            },
            {
                label: 'Non-finite number inputs',
                inputs: [...nonFiniteNumberInputs],
                expected: false
            },
            {
                label: 'Number inputs',
                inputs: [
                    ...positiveNumberInputs,
                    ...negativeNumberInputs,
                    ...zeroInputs
                ],
                expected: true
            }
        ];

        describe.each(
            scenarios
        )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
            const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

            test.each(
                testCases
            )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                expect(NumberUtility.isFiniteNumber(testInput)).toBe(testExpected);
            });
        });
    });

    describe('isInteger', (): void => {
        const scenarios: Scenario[] = [
            {
                label: 'Non-number inputs',
                inputs: [...nonNumberInputs],
                expected: false
            },
            {
                label: 'Non-finite number inputs',
                inputs: [...nonFiniteNumberInputs],
                expected: false
            },
            {
                label: 'Float inputs',
                inputs: [
                    ...floatInputs
                ],
                expected: false
            },
            {
                label: 'Zero inputs',
                inputs: [
                    ...zeroInputs
                ],
                expected: true
            },
            {
                label: 'Integer inputs',
                inputs: [
                    ...integerInputs
                ],
                expected: true
            }
        ];

        describe.each(
            scenarios
        )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
            const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

            test.each(
                testCases
            )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                expect(NumberUtility.isInteger(testInput)).toBe(testExpected);
            });
        });
    });

    describe('isPositiveInteger', (): void => {
        describe('isPositiveInteger should return the same expected value for non-zero inputs', (): void => {
            const scenarios: Scenario[] = [
                {
                    label: 'Non-number inputs',
                    inputs: [...nonNumberInputs],
                    expected: false
                },
                {
                    label: 'Non-finite number inputs',
                    inputs: [...nonFiniteNumberInputs],
                    expected: false
                },
                {
                    label: 'Float inputs',
                    inputs: [
                        ...floatInputs
                    ],
                    expected: false
                },
                {
                    label: 'Negative integer inputs',
                    inputs: [
                        ...negativeIntegerInputs
                    ],
                    expected: false
                },
                {
                    label: 'Positive integer inputs',
                    inputs: [
                        ...positiveIntegerInputs
                    ],
                    expected: true
                }
            ];

            describe.each(
                scenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(NumberUtility.isPositiveInteger(testInput)).toBe(testExpected);
                    expect(NumberUtility.isPositiveInteger(testInput, false)).toBe(testExpected);
                    expect(NumberUtility.isPositiveInteger(testInput, true)).toBe(testExpected);
                });
            });
        });

        test('isPositiveInteger should return the proper value for zero input', (): void => {
            expect(NumberUtility.isPositiveInteger(0)).toBe(false);
            expect(NumberUtility.isPositiveInteger(0, false)).toBe(false);
            expect(NumberUtility.isPositiveInteger(0, true)).toBe(true);
        });
    });
});
