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

import {NumberUtility, PrimitiveTypeError, StaticInstanceError, ValueRangeError} from '../../src';

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

        describe('assertPositiveInteger with zero inclusive', () => {
            function assertPositiveIntegerWithZeroInclusive(input: unknown, message?: string): void {
                NumberUtility.assertPositiveInteger(input, true, message);
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
        });

        describe('assertPositiveInteger', (): void => {
            function assertPositiveInteger(input: unknown, message?: string): void {
                NumberUtility.assertPositiveInteger(input, false, message);
            }

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
    });

    describe('assertInRange', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Unequal min and max',
                inputs: [
                    { value: Number.MIN_SAFE_INTEGER - 1, min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER },
                    { value: Number.MAX_SAFE_INTEGER + 1, min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER },
                    { value: -100, min: -10, max: 10 },
                    { value: 100, min: -10, max: 10 },
                    { value: -10 - 1, min: -10, max: 10 },
                    { value: 10 + 1, min: -10, max: 10 },
                    { value: -10 - 1, min: -10, max: -1 },
                    { value: -1 + 1, min: -10, max: -1 },
                    { value: 0, min: 10, max: 100 },
                    { value: 200, min: 10, max: 100 },
                    { value: 10 - 1, min: 10, max: 100 },
                    { value: 100 + 1, min: 10, max: 100 },
                    { value: -11.123, min: -10.123, max: 10.123 },
                    { value: 11.123, min: -10.123, max: 10.123 },
                    { value: -10.123 - 0.5, min: -10.123, max: 10.123 },
                    { value: 10.123 + 0.5, min: -10.123, max: 10.123 },
                    { value: -11.123, min: -10.123, max: -1.123 },
                    { value: 11.123, min: -10.123, max: -1.123 },
                    { value: -10.123 - 0.5, min: -10.123, max: -1.123 },
                    { value: -1.132 + 0.5, min: -10.123, max: -1.123 },
                    { value: 5, min: 10.123, max: 100.123 },
                    { value: 500, min: 10.123, max: 100.123 },
                    { value: 10.123 - 0.5, min: 10.123, max: 100.123 },
                    { value: 100.123 + 0.5, min: 10.123, max: 100.123 },
                    { value: 9.5, min: 10, max: 100 },
                    { value: 50, min: 10.5, max: 25 },
                    { value: 0, min: 10, max: 100.5 }
                ],
                expected: ValueRangeError
            },
            {
                label: 'Equal min and max',
                inputs: [
                    { value: 1, min: 0, max: 0 },
                    { value: -1, min: 0, max: 0 },
                    { value: 0.0001, min: 0, max: 0 },
                    { value: -0.0001, min: 0, max: 0 },
                    { value: 250, min: 100, max: 100 },
                    { value: 10, min: 100, max: 100 },
                    { value: -101, min: -100, max: -100 },
                    { value: -99, min: -100, max: -100 },
                    { value: 0, min: -100, max: -100 },
                    { value: 100, min: -100, max: -100 },
                    { value: 100.123001, min: 100.123, max: 100.123 },
                    { value: -100.123001, min: -100.123, max: -100.123 },
                    { value: Number.MIN_SAFE_INTEGER + 1, min: Number.MIN_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER },
                    { value: Number.MAX_SAFE_INTEGER + 1, min: Number.MAX_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER },
                    { value: Number.MIN_VALUE + Number.EPSILON, min: Number.MIN_VALUE, max: Number.MIN_VALUE },
                    { value: Number.EPSILON + Number.EPSILON, min: Number.EPSILON, max: Number.EPSILON }
                ],
                expected: ValueRangeError
            }
        ]

        const successScenarios: Scenario[] = [
            {
                label: 'Unequal min and max',
                inputs: [
                    { value: 0, min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER },
                    { value: Number.MIN_SAFE_INTEGER, min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER },
                    { value: Number.MAX_SAFE_INTEGER, min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER },
                    { value: 0, min: -10, max: 10 },
                    { value: -10, min: -10, max: 10 },
                    { value: 10, min: -10, max: 10 },
                    { value: -5, min: -10, max: -1 },
                    { value: -10, min: -10, max: -1 },
                    { value: -1, min: -10, max: -1 },
                    { value: 50, min: 10, max: 100 },
                    { value: 10, min: 10, max: 100 },
                    { value: 100, min: 10, max: 100 },
                    { value: 0, min: -10.123, max: 10.123 },
                    { value: -10.123, min: -10.123, max: 10.123 },
                    { value: 10.123, min: -10.123, max: 10.123 },
                    { value: -5, min: -10.123, max: -1.123 },
                    { value: -10.123, min: -10.123, max: -1.123 },
                    { value: -1.132, min: -10.123, max: -1.123 },
                    { value: 50, min: 10.123, max: 100.123 },
                    { value: 10.123, min: 10.123, max: 100.123 },
                    { value: 100.123, min: 10.123, max: 100.123 },
                    { value: 50.5, min: 10, max: 100 },
                    { value: 50, min: 10.5, max: 100 },
                    { value: 50, min: 10, max: 100.5 }
                ],
                expected: undefined
            },
            {
                label: 'Equal min and max',
                inputs: [
                    { value: 0, min: 0, max: 0 },
                    { value: 100, min: 100, max: 100 },
                    { value: -100, min: -100, max: -100 },
                    { value: 100.123, min: 100.123, max: 100.123 },
                    { value: -100.123, min: -100.123, max: -100.123 },
                    { value: Number.MIN_SAFE_INTEGER, min: Number.MIN_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER },
                    { value: Number.MAX_SAFE_INTEGER, min: Number.MAX_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER },
                    { value: Number.MAX_VALUE, min: Number.MAX_VALUE, max: Number.MAX_VALUE },
                    { value: Number.MIN_VALUE, min: Number.MIN_VALUE, max: Number.MIN_VALUE },
                    { value: Number.EPSILON, min: Number.EPSILON, max: Number.EPSILON }
                ],
                expected: undefined
            }
        ];

        function assertInRange(input: unknown, message?: string): void {
            const inputObject = input as { value: number; min: number; max: number; };
            NumberUtility.assertInRange(inputObject.value, inputObject.min, inputObject.max, message);
        }

        testAssertMethod(
            assertInRange,
            successScenarios,
            failureScenarios,
            (input: unknown): string => {
                const inputObject = input as { value: number; min: number; max: number; };
                return `Value ${inputObject.value} must be in the range [${inputObject.min}, ${inputObject.max}].`;
            }
        );

        test('Should throw the correct error when min and max are not a valid range', (): void => {
            expect((): void => {
                NumberUtility.assertInRange(0, 10, -10)
            }).toThrow(ValueRangeError);
        });

        describe('Should throw the correct error when arguments are not finite numbers', (): void => {
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

            describe.each(
                failureScenarios
            )('%# - $label', ({inputs: scenarioInputs, expected: scenarioExpected}: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                describe('Value argument', (): void => {
                    test.each(
                        testCases
                    )('assertInRange($input, min, max) should throw $expected', ({input: testInput, expected: testExpected}: TestCase): void => {
                        expect((): void => {
                            NumberUtility.assertInRange(testInput as number, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
                        }).toThrow(testExpected);
                    });
                });

                describe('Min argument', (): void => {
                    test.each(
                        testCases
                    )('assertInRange(value, $input, max) should throw $expected', ({input: testInput, expected: testExpected}: TestCase): void => {
                        expect((): void => {
                            NumberUtility.assertInRange(0, testInput as number, Number.MAX_SAFE_INTEGER)
                        }).toThrow(testExpected);
                    });
                });

                describe('Max argument', (): void => {
                    test.each(
                        testCases
                    )('assertInRange(value, min, $input) should throw $expected', ({input: testInput, expected: testExpected}: TestCase): void => {
                        expect((): void => {
                            NumberUtility.assertInRange(0, Number.MIN_SAFE_INTEGER, testInput as number)
                        }).toThrow(testExpected);
                    });
                });
            });
        });
    });

    describe('assertValidRange', (): void => {
        const successScenarios: Scenario[] = [
            {
                label: 'Unequal min and max',
                inputs: [
                    { min: 0, max: 10 },
                    { min: Number.MIN_SAFE_INTEGER, max: 0 },
                    { min: 0, max: Number.MAX_SAFE_INTEGER },
                    { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER },
                    { min: -Number.MAX_VALUE, max: Number.MAX_VALUE },
                    { min: -500, max: -100 },
                    { min: -5.123, max: -3.123 },
                    { min: 10, max: 100 },
                    { min: 10.123, max: 100.123 }
                ],
                expected: undefined
            },
            {
                label: 'Equal min and max',
                inputs: [
                    { min: 0, max: 0 },
                    { min: Number.MIN_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER },
                    { min: Number.MAX_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER },
                    { min: Number.MAX_VALUE, max: Number.MAX_VALUE },
                    { min: 5, max: 5 },
                    { min: 5.123, max: 5.123 },
                    { min: -5, max: -5 },
                    { min: -5.123, max: -5.123 }
                ],
                expected: undefined
            }
        ];

        const failureScenarios: Scenario[] = [
            {
                label: 'Min greater than max',
                inputs: [
                    { max: 0, min: 10 },
                    { max: Number.MIN_SAFE_INTEGER, min: 0 },
                    { max: 0, min: Number.MAX_SAFE_INTEGER },
                    { max: Number.MIN_SAFE_INTEGER, min: Number.MAX_SAFE_INTEGER },
                    { max: -Number.MAX_VALUE, min: Number.MAX_VALUE },
                    { max: -500, min: -100 },
                    { max: -5.123, min: -3.123 },
                    { max: 10, min: 100 },
                    { max: 10.123, min: 100.123 }
                ],
                expected: ValueRangeError
            }
        ]

        function assertValidRange(input: unknown, message?: string): void {
            const inputObject = input as { min: number; max: number; };
            NumberUtility.assertValidRange(inputObject.min, inputObject.max, message);
        }

        testAssertMethod(
            assertValidRange,
            successScenarios,
            failureScenarios,
            (input: unknown): string => {
                const inputObject = input as { min: number; max: number; };
                return `Min (${inputObject.min}) must be less than or equal to max (${inputObject.max}).`;
            }
        );

        describe('Should throw the correct error when arguments are not finite numbers', (): void => {
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

            describe.each(
                failureScenarios
            )('%# - $label', ({inputs: scenarioInputs, expected: scenarioExpected}: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                describe('Min argument', (): void => {
                    test.each(
                        testCases
                    )('assertValidRange($input, max) should throw $expected', ({input: testInput, expected: testExpected}: TestCase): void => {
                        expect((): void => {
                            NumberUtility.assertValidRange(testInput as number, Number.MAX_SAFE_INTEGER)
                        }).toThrow(testExpected);
                    });
                });

                describe('Max argument', (): void => {
                    test.each(
                        testCases
                    )('assertValidRange(min, $input) should throw $expected', ({input: testInput, expected: testExpected}: TestCase): void => {
                        expect((): void => {
                            NumberUtility.assertValidRange(Number.MIN_SAFE_INTEGER, testInput as number)
                        }).toThrow(testExpected);
                    });
                });
            });
        });
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
