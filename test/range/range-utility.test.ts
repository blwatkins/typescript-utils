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

import { describe, test, afterEach, expect } from 'vitest';

import {
    PrimitiveTypeError,
    Random,
    Range,
    RangeUtility,
    SchemaTypeError,
    StaticInstanceError,
    ValueRangeError
} from '../../src';

import { testAssertMethod, testIsMethod } from '../utils/assert/assert-tests';
import { nonBooleanInputs } from '../utils/input/boolean-inputs';
import { nonFiniteNumberInputs, nonNumberInputs } from '../utils/input/number-inputs';
import { nonObjectInputs } from '../utils/input/object-inputs';
import { testStaticClassConstructor } from '../utils/static/static-class-tests';
import { Scenario, TestCase, buildTestCases } from '../utils/test-case/test-case';

describe('RangeUtility', (): void => {
    testStaticClassConstructor('RangeUtility', RangeUtility as unknown as new () => unknown, StaticInstanceError);

    const definedNonBooleanInputs: unknown[] = nonBooleanInputs.filter((input: unknown): boolean => {
        return input !== undefined;
    });

    const rangeFailureScenarios: Scenario[] = [
        {
            label: 'Non-object type inputs',
            inputs: nonObjectInputs,
            expected: SchemaTypeError
        },
        {
            label: 'Array type inputs',
            inputs: [
                [],
                [0, 10],
                [1, 2, 3],
                ['a', 'b', 'c']
            ],
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs missing min property',
            inputs: [
                { max: 10 },
                { max: 0, isMinInclusive: true },
                { max: -5, isMinInclusive: false, isMaxInclusive: false }
            ],
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs missing max property',
            inputs: [
                { min: 0 },
                { min: -5, isMaxInclusive: false },
                { min: 10, isMinInclusive: true, isMaxInclusive: true }
            ],
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs missing min and max properties',
            inputs: [
                {},
                { isMinInclusive: true },
                { isMaxInclusive: false },
                { isMinInclusive: true, isMaxInclusive: true }
            ],
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with non-numeric min property',
            inputs: nonNumberInputs.map((input: unknown): { min: unknown; max: number; } => {
                return { min: input, max: 10 };
            }),
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with non-numeric max property',
            inputs: nonNumberInputs.map((input: unknown): { min: number; max: unknown; } => {
                return { min: 0, max: input };
            }),
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with non-finite min property',
            inputs: nonFiniteNumberInputs.map((input: number): { min: number; max: number; } => {
                return { min: input, max: 10 };
            }),
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with non-finite max property',
            inputs: nonFiniteNumberInputs.map((input: number): { min: number; max: number; } => {
                return { min: 0, max: input };
            }),
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with non-finite min and max properties',
            inputs: [
                { min: NaN, max: NaN },
                { min: -Infinity, max: Infinity },
                { min: Infinity, max: Infinity },
                { min: -Infinity, max: -Infinity },
                { min: NaN, max: Infinity },
                { min: -Infinity, max: NaN }
            ],
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with non-boolean isMinInclusive property',
            inputs: definedNonBooleanInputs.map((input: unknown): { min: number; max: number; isMinInclusive: unknown; } => {
                return { min: 0, max: 10, isMinInclusive: input };
            }),
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with non-boolean isMaxInclusive property',
            inputs: definedNonBooleanInputs.map((input: unknown): { min: number; max: number; isMaxInclusive: unknown; } => {
                return { min: 0, max: 10, isMaxInclusive: input };
            }),
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with additional properties',
            inputs: [
                { min: 0, max: 10, name: 'bob' },
                { min: 0, max: 10, step: 2 },
                { min: 0, max: 10, isMinInclusive: true, age: 42 },
                { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: true, day: 7 }
            ],
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs where min is greater than max',
            inputs: [
                { min: 10, max: 0 },
                { min: 1, max: -1 },
                { min: 0.5, max: 0.25 },
                { min: Number.EPSILON, max: 0 },
                { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER },
                { min: 10, max: 0, isMinInclusive: true, isMaxInclusive: true }
            ],
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs where min is equal to max and a bound is excluded',
            inputs: [
                { min: 0, max: 0, isMinInclusive: false },
                { min: 0, max: 0, isMaxInclusive: false },
                { min: -0, max: 0, isMaxInclusive: false },
                { min: 5, max: 5, isMinInclusive: false, isMaxInclusive: false },
                { min: -5, max: -5, isMaxInclusive: false },
                { min: -5.5, max: -5.5, isMinInclusive: true, isMaxInclusive: false },
                { min: -5.5, max: -5.5, isMinInclusive: false, isMaxInclusive: true },
                { min: Number.MAX_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER, isMinInclusive: false }
            ],
            expected: SchemaTypeError
        }
    ];

    const rangeSuccessScenarios: Scenario[] = [
        {
            label: 'Range objects where min is less than max',
            inputs: [
                { min: 0, max: 10 },
                { min: -10, max: 10 },
                { min: -10, max: -1 },
                { min: -1.5, max: 1.5 },
                { min: -Number.MIN_VALUE, max: 0 },
                { min: Number.MIN_VALUE, max: Number.MAX_VALUE },
                { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER }
            ],
            expected: undefined
        },
        {
            label: 'Range objects where min is equal to max',
            inputs: [
                { min: 0, max: 0 },
                { min: -0, max: 0 },
                { min: 0, max: -0 },
                { min: 5, max: 5 },
                { min: -5.5, max: -5.5 },
                { min: Number.MAX_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER },
                { min: Number.MIN_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER }
            ],
            expected: undefined
        },
        {
            label: 'Range objects with isMinInclusive property',
            inputs: [
                { min: 0, max: 10, isMinInclusive: true },
                { min: 0, max: 10, isMinInclusive: false },
                { min: -5, max: -5, isMinInclusive: true }
            ],
            expected: undefined
        },
        {
            label: 'Range objects with isMaxInclusive property',
            inputs: [
                { min: 0, max: 10, isMaxInclusive: true },
                { min: 0, max: 10, isMaxInclusive: false },
                { min: -5, max: -5, isMaxInclusive: true }
            ],
            expected: undefined
        },
        {
            label: 'Range objects with isMinInclusive and isMaxInclusive properties',
            inputs: [
                { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: true },
                { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: false },
                { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: true },
                { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: false }
            ],
            expected: undefined
        },
        {
            label: 'Range objects with explicitly undefined isMinInclusive and isMaxInclusive properties',
            inputs: [
                { min: 0, max: 10, isMinInclusive: undefined },
                { min: 0, max: 10, isMaxInclusive: undefined },
                { min: 0, max: 10, isMinInclusive: undefined, isMaxInclusive: undefined },
                { min: 0, max: 10, isMinInclusive: undefined, isMaxInclusive: false },
                { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: undefined }
            ],
            expected: undefined
        }
    ];

    describe('Range', (): void => {
        describe('assertRange', (): void => {
            testAssertMethod(
                RangeUtility.assertRange.bind(RangeUtility),
                rangeSuccessScenarios,
                rangeFailureScenarios,
                'Input does not match schema requirements for Range.'
            );
        });

        describe('isRange', (): void => {
            testIsMethod(RangeUtility.isRange.bind(RangeUtility), rangeSuccessScenarios, rangeFailureScenarios);
        });
    });

    describe('In', (): void => {
        const inFailureScenarios: Scenario[] = [
            {
                label: 'Values less than the min bound',
                inputs: [
                    { value: -1, range: { min: 0, max: 10 } },
                    { value: -11, range: { min: -10, max: 10, isMinInclusive: true, isMaxInclusive: true } },
                    { value: -Number.EPSILON, range: { min: 0, max: 1, isMinInclusive: true } },
                    { value: Number.MIN_SAFE_INTEGER, range: { min: 0, max: 10 } },
                    { value: -5.5, range: { min: -5, max: 5, isMinInclusive: false, isMaxInclusive: false } }
                ],
                expected: ValueRangeError
            },
            {
                label: 'Values greater than the max bound',
                inputs: [
                    { value: 11, range: { min: 0, max: 10 } },
                    { value: 11, range: { min: -10, max: 10, isMinInclusive: true, isMaxInclusive: true } },
                    { value: 1 + Number.EPSILON, range: { min: 0, max: 1, isMaxInclusive: true } },
                    { value: Number.MAX_SAFE_INTEGER, range: { min: 0, max: 10 } },
                    { value: 5.5, range: { min: -5, max: 5, isMinInclusive: false, isMaxInclusive: false } }
                ],
                expected: ValueRangeError
            },
            {
                label: 'Values equal to the min bound of a range with an exclusive min bound',
                inputs: [
                    { value: 0, range: { min: 0, max: 10, isMinInclusive: false } },
                    { value: 0, range: { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: true } },
                    { value: 0, range: { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: false } },
                    { value: 0, range: { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: undefined } },
                    { value: -10, range: { min: -10, max: 10, isMinInclusive: false } },
                    { value: -0.5, range: { min: -0.5, max: 0.5, isMinInclusive: false, isMaxInclusive: true } }
                ],
                expected: ValueRangeError
            },
            {
                label: 'Values equal to the max bound of a range with an exclusive max bound',
                inputs: [
                    { value: 10, range: { min: 0, max: 10, isMaxInclusive: false } },
                    { value: 10, range: { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: false } },
                    { value: 10, range: { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: false } },
                    { value: 10, range: { min: 0, max: 10, isMinInclusive: undefined, isMaxInclusive: false } },
                    { value: 10, range: { min: -10, max: 10, isMaxInclusive: false } },
                    { value: 0.5, range: { min: -0.5, max: 0.5, isMinInclusive: true, isMaxInclusive: false } }
                ],
                expected: ValueRangeError
            }
        ];

        const inSuccessScenarios: Scenario[] = [
            {
                label: 'Values between the min and max bounds',
                inputs: [
                    { value: 5, range: { min: 0, max: 10 } },
                    { value: 5, range: { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: true } },
                    { value: 5, range: { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: false } },
                    { value: 5, range: { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: true } },
                    { value: 5, range: { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: false } },
                    { value: 0, range: { min: -10, max: 10 } },
                    { value: -5, range: { min: -10, max: 0 } },
                    { value: 0.5, range: { min: 0, max: 1 } },
                    { value: -0.5, range: { min: -1, max: 0 } },
                    { value: 0, range: { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER } }
                ],
                expected: undefined
            },
            {
                label: 'Values equal to the min bound of a range with an inclusive min bound',
                inputs: [
                    { value: 0, range: { min: 0, max: 10, isMinInclusive: true } },
                    { value: 0, range: { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: true } },
                    { value: 0, range: { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: false } },
                    { value: 0, range: { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: undefined } },
                    { value: -10, range: { min: -10, max: 10, isMinInclusive: true } },
                    { value: -0.5, range: { min: -0.5, max: 0.5, isMinInclusive: true } }
                ],
                expected: undefined
            },
            {
                label: 'Values equal to the min bound of a range with an undefined min inclusivity',
                inputs: [
                    { value: 0, range: { min: 0, max: 10 } },
                    { value: 0, range: { min: 0, max: 10, isMaxInclusive: true } },
                    { value: 0, range: { min: 0, max: 10, isMaxInclusive: false } },
                    { value: 0, range: { min: 0, max: 10, isMinInclusive: undefined } },
                    { value: 0, range: { min: 0, max: 10, isMinInclusive: undefined, isMaxInclusive: undefined } },
                    { value: -10, range: { min: -10, max: 10 } },
                    { value: -0.5, range: { min: -0.5, max: 0.5 } }
                ],
                expected: undefined
            },
            {
                label: 'Values equal to the max bound of a range with an inclusive max bound',
                inputs: [
                    { value: 10, range: { min: 0, max: 10, isMaxInclusive: true } },
                    { value: 10, range: { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: true } },
                    { value: 10, range: { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: true } },
                    { value: 10, range: { min: 0, max: 10, isMinInclusive: undefined, isMaxInclusive: true } },
                    { value: 10, range: { min: -10, max: 10, isMaxInclusive: true } },
                    { value: 0.5, range: { min: -0.5, max: 0.5, isMaxInclusive: true } }
                ],
                expected: undefined
            },
            {
                label: 'Values equal to the max bound of a range with an undefined max inclusivity',
                inputs: [
                    { value: 10, range: { min: 0, max: 10 } },
                    { value: 10, range: { min: 0, max: 10, isMinInclusive: true } },
                    { value: 10, range: { min: 0, max: 10, isMinInclusive: false } },
                    { value: 10, range: { min: 0, max: 10, isMaxInclusive: undefined } },
                    { value: 10, range: { min: 0, max: 10, isMinInclusive: undefined, isMaxInclusive: undefined } },
                    { value: 10, range: { min: -10, max: 10 } },
                    { value: 0.5, range: { min: -0.5, max: 0.5 } }
                ],
                expected: undefined
            },
            {
                label: 'Values equal to the bounds of a single value range without an exclusive bound',
                inputs: [
                    { value: 0, range: { min: 0, max: 0 } },
                    { value: 0, range: { min: 0, max: 0, isMinInclusive: true, isMaxInclusive: true } },
                    { value: 5, range: { min: 5, max: 5, isMinInclusive: true } },
                    { value: 5, range: { min: 5, max: 5, isMaxInclusive: true } },
                    { value: 5, range: { min: 5, max: 5, isMinInclusive: undefined, isMaxInclusive: undefined } },
                    { value: -5.5, range: { min: -5.5, max: -5.5 } }
                ],
                expected: undefined
            }
        ];

        describe('assertIn', (): void => {
            function assertIn(input: unknown, message?: string): void {
                const args = input as { value: number; range: Range; };
                RangeUtility.assertIn(args.value, args.range, message);
            }

            testAssertMethod(
                assertIn,
                inSuccessScenarios,
                inFailureScenarios,
                'value must be within range.'
            );
        });

        describe('isIn', (): void => {
            function isIn(input: unknown): boolean {
                const args = input as { value: number; range: Range; };
                return RangeUtility.isIn(args.value, args.range);
            }

            testIsMethod(isIn, inSuccessScenarios, inFailureScenarios);
        });

        describe('Argument errors', (): void => {
            const invalidRangeInputs: unknown[] = rangeFailureScenarios.flatMap((scenario: Scenario): unknown[] => {
                return scenario.inputs;
            });

            const argumentFailureScenarios: Scenario[] = [
                {
                    label: 'Invalid value argument',
                    inputs: [
                        ...nonNumberInputs,
                        ...nonFiniteNumberInputs
                    ].map((input: unknown): { value: unknown; range: Range; } => {
                        return {
                            value: input,
                            range: { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: true }
                        };
                    }),
                    expected: PrimitiveTypeError
                },
                {
                    label: 'Invalid range argument',
                    inputs: invalidRangeInputs.map((input: unknown): { value: number; range: unknown; } => {
                        return {
                            value: 5,
                            range: input
                        };
                    }),
                    expected: SchemaTypeError
                }
            ];

            describe.each(
                argumentFailureScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                describe('Argument errors - assertIn', (): void => {
                    test.each(
                        testCases
                    )('Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                        const args: { value: unknown; range: unknown; } = testInput as { value: unknown; range: unknown; };

                        expect((): void => {
                            RangeUtility.assertIn(args.value as number, args.range as Range);
                        }).toThrow(testExpected);
                    });
                });

                describe('Argument errors - isIn', (): void => {
                    test.each(
                        testCases
                    )('Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                        const args: { value: unknown; range: unknown; } = testInput as { value: unknown; range: unknown; };

                        expect((): void => {
                            RangeUtility.isIn(args.value as number, args.range as Range);
                        }).toThrow(testExpected);
                    });
                });
            });
        });
    });
    describe('Random', (): void => {
        const testRepeatTotal: number = 50;

        // The largest value that Math.random may return, used to pin the bound opposite the anchor.
        const nearOne: number = 1 - (Number.EPSILON / 2);

        afterEach((): void => {
            Random.randomNumberGenerator = Math.random;
        });

        describe('randomFloat', (): void => {
            describe('randomFloat should only return values that are within the range', (): void => {
                test.each([
                    { min: 0, max: 10 },
                    { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: true },
                    { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: false },
                    { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: true },
                    { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: false },
                    { min: -10, max: -1 },
                    { min: -0.5, max: 0.5, isMinInclusive: false },
                    { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER }
                ])('%# - randomFloat($min, $max) should return values within the range', (range: Range): void => {
                    for (let i: number = 0; i < testRepeatTotal; i++) {
                        const value: number = RangeUtility.randomFloat(range);
                        expect(Number.isNaN(value)).toBe(false);
                        expect(RangeUtility.isIn(value, range)).toBe(true);
                    }
                });
            });

            describe('randomFloat should never return an excluded bound', (): void => {
                // A generator pinned to 0 always draws min. Where min is included that is the
                // answer; where it is excluded every draw is rejected and the midpoint is returned.
                const boundScenarios: { range: Range; rng: () => number; expected: number; }[] = [
                    { range: { min: 0, max: 10 }, rng: (): number => 0, expected: 0 },
                    { range: { min: 0, max: 10, isMinInclusive: true }, rng: (): number => 0, expected: 0 },
                    { range: { min: 0, max: 10, isMinInclusive: false }, rng: (): number => 0, expected: 5 },
                    {
                        range: { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: true },
                        rng: (): number => 0,
                        expected: 5
                    },
                    {
                        range: { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: false },
                        rng: (): number => 0,
                        expected: 5
                    },
                    { range: { min: 0, max: 10 }, rng: (): number => 0.25, expected: 2.5 },
                    { range: { min: 0, max: 10, isMinInclusive: false }, rng: (): number => 0.25, expected: 2.5 }
                ];

                test.each(
                    boundScenarios
                )('%# - randomFloat($range) should return $expected', ({ range, rng, expected }: { range: Range; rng: () => number; expected: number; }): void => {
                    Random.randomNumberGenerator = rng;
                    expect(RangeUtility.randomFloat(range)).toBe(expected);
                });
            });

            describe('randomFloat should respect the opposite bound when the generator returns a value near one', (): void => {
                test.each([
                    { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: false },
                    { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: true },
                    { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: false }
                ])('%# - randomFloat($min, $max) should stay within the range', (range: Range): void => {
                    Random.randomNumberGenerator = (): number => nearOne;
                    const value: number = RangeUtility.randomFloat(range);
                    expect(RangeUtility.isIn(value, range)).toBe(true);
                });
            });

            describe('a Range may not use the exclusive max allowance that Random accepts', (): void => {
                // Random's max is exclusive, so it may be one past MAX_SAFE_INTEGER. A Range bound may
                // be inclusive, so the same value is out of range here.
                test('Number.MAX_SAFE_INTEGER + 1 is accepted by Random and rejected by RangeUtility', (): void => {
                    expect(Number.isSafeInteger(Random.randomInt(0, Number.MAX_SAFE_INTEGER + 1))).toBe(true);
                    expect(Number.isFinite(Random.randomFloat(0, Number.MAX_SAFE_INTEGER + 1))).toBe(true);

                    expect((): void => {
                        RangeUtility.randomFloat({ min: 0, max: Number.MAX_SAFE_INTEGER + 1 });
                    }).toThrow(ValueRangeError);

                    expect((): void => {
                        RangeUtility.randomInteger({ min: 0, max: Number.MAX_SAFE_INTEGER + 1 });
                    }).toThrow(ValueRangeError);
                });
            });

            describe('randomFloat and randomInteger should throw for bounds outside the safe integer range', (): void => {
                test.each([
                    { min: 0, max: 1e16 },
                    { min: 0, max: 1e100 },
                    { min: -1e300, max: 1e300 },
                    { min: -Number.MAX_VALUE, max: Number.MAX_VALUE },
                    // A Range bound may be inclusive, so 2 ** 53 is itself out of range here even
                    // though it is a legal exclusive max for Random.randomInt.
                    { min: 0, max: Math.pow(2, 53) },
                    { min: -Number.MAX_VALUE, max: 0 }
                ])('%# - randomFloat($min, $max) and randomInteger($min, $max) should throw ValueRangeError', (range: Range): void => {
                    Random.randomNumberGenerator = (): number => 0;

                    expect((): void => {
                        RangeUtility.randomFloat(range);
                    }).toThrow(ValueRangeError);

                    expect((): void => {
                        RangeUtility.randomInteger(range);
                    }).toThrow(ValueRangeError);
                });
            });

            describe('randomFloat should return safely truncatable values at the safe integer limits', (): void => {
                test.each([
                    { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER },
                    { min: 0, max: Number.MAX_SAFE_INTEGER },
                    { min: Number.MIN_SAFE_INTEGER, max: 0 }
                ])('%# - randomFloat($min, $max) should return a safely truncatable value', (range: Range): void => {
                    for (let i: number = 0; i < testRepeatTotal; i++) {
                        const value: number = RangeUtility.randomFloat(range);

                        expect(Number.isFinite(value)).toBe(true);
                        expect(Number.isSafeInteger(Math.floor(value))).toBe(true);
                        expect(RangeUtility.isIn(value, range)).toBe(true);
                    }
                });
            });

            describe('the safe integer restriction applies to the generators only', (): void => {
                // isIn and assertIn only compare values, so a Range with large bounds is still a
                // valid Range that simply cannot be drawn from.
                test.each([
                    { min: -1e300, max: 1e300 },
                    { min: 0, max: Number.MAX_VALUE }
                ])('%# - isIn and assertIn should accept the range $min to $max', (range: Range): void => {
                    expect(RangeUtility.isRange(range)).toBe(true);
                    expect(RangeUtility.isIn(0, range)).toBe(true);

                    expect((): void => {
                        RangeUtility.assertIn(0, range);
                    }).not.toThrow();

                    expect((): void => {
                        RangeUtility.randomFloat(range);
                    }).toThrow(ValueRangeError);
                });
            });

            describe('randomFloat should discard a draw that lands past a bound, not only on it', (): void => {
                // A generator returning a value at or above 1 is outside its documented [0, 1)
                // contract, but it drives the affine draw strictly past max, which a check for
                // equality with an excluded bound cannot see. The same technique is used in the
                // weighted element suite.
                test.each([
                    { range: { min: 0, max: 10 }, draw: 1.5 },
                    { range: { min: 0, max: 10 }, draw: 2 },
                    { range: { min: 0, max: 10, isMaxInclusive: false }, draw: 1.5 },
                    { range: { min: -5, max: 5, isMinInclusive: false, isMaxInclusive: false }, draw: 3 }
                ])('%# - randomFloat($range) with a draw of $draw should stay within the range', ({ range, draw }: { range: Range; draw: number; }): void => {
                    Random.randomNumberGenerator = (): number => draw;
                    const rawDraw: number = range.min + (draw * (range.max - range.min));
                    const value: number = RangeUtility.randomFloat(range);

                    expect(rawDraw).toBeGreaterThan(range.max);
                    expect(value).not.toBe(rawDraw);
                    expect(RangeUtility.isIn(value, range)).toBe(true);
                });
            });

            describe('randomFloat should stay within the range for bounds with a coarse gap between representable numbers', (): void => {
                // Regression guard rather than a reproduction: no known in-contract draw rounds past a
                // bound, but the draw is checked against the full range condition rather than for
                // equality with an excluded bound, and this pins that.
                const coarseMin: number = 0.75;
                const coarseMax: number = Math.pow(2, 51) + 0.5;

                test.each([
                    { min: coarseMin, max: coarseMax },
                    { min: coarseMin, max: coarseMax, isMaxInclusive: false },
                    { min: coarseMin, max: coarseMax, isMinInclusive: false },
                    { min: coarseMin, max: coarseMax, isMinInclusive: false, isMaxInclusive: false }
                ])('%# - randomFloat($min, $max) should return a value within the range', (range: Range): void => {
                    for (const draw of [1 - (Number.EPSILON / 2), 0.9999999999999999, 0.5, 0]) {
                        Random.randomNumberGenerator = (): number => draw;
                        const value: number = RangeUtility.randomFloat(range);

                        expect(Number.isFinite(value)).toBe(true);
                        expect(RangeUtility.isIn(value, range)).toBe(true);
                    }
                });
            });

            describe('randomFloat should throw when the range contains no representable values', (): void => {
                // The bounds of each range below are adjacent representable numbers with both bounds
                // excluded, so no representable value satisfies the range.
                test.each([
                    { min: 1, max: 1 + Number.EPSILON, isMinInclusive: false, isMaxInclusive: false },
                    { min: 0, max: Number.MIN_VALUE, isMinInclusive: false, isMaxInclusive: false },
                    { min: -1 - Number.EPSILON, max: -1, isMinInclusive: false, isMaxInclusive: false }
                ])('%# - randomFloat($min, $max) should throw ValueRangeError', (range: Range): void => {
                    Random.randomNumberGenerator = (): number => 0;

                    expect((): void => {
                        RangeUtility.randomFloat(range);
                    }).toThrow(ValueRangeError);
                });
            });

            describe('randomFloat should return the single representable value of an adjacent bound range', (): void => {
                test.each([
                    {
                        range: { min: 1, max: 1 + Number.EPSILON, isMinInclusive: false, isMaxInclusive: true },
                        expected: 1 + Number.EPSILON
                    },
                    {
                        range: { min: 1, max: 1 + Number.EPSILON, isMinInclusive: true, isMaxInclusive: false },
                        expected: 1
                    },
                    {
                        // The midpoint of these adjacent bounds rounds up to the excluded max,
                        // so the included min is the only value the range can yield.
                        range: {
                            min: 1 + Number.EPSILON,
                            max: 1 + (2 * Number.EPSILON),
                            isMinInclusive: true,
                            isMaxInclusive: false
                        },
                        expected: 1 + Number.EPSILON
                    }
                ])('%# - randomFloat($range) should return $expected', ({ range, expected }: { range: Range; expected: number; }): void => {
                    for (const draw of [0, 0.5, 1 - (Number.EPSILON / 2)]) {
                        Random.randomNumberGenerator = (): number => draw;
                        const value: number = RangeUtility.randomFloat(range);
                        expect(value).toBe(expected);
                        expect(RangeUtility.isIn(value, range)).toBe(true);
                    }
                });
            });

            describe('randomFloat should return min when min and max are equal', (): void => {
                test.each([
                    { min: 0, max: 0 },
                    { min: 5, max: 5 },
                    { min: 1.8, max: 1.8 },
                    { min: -5.5, max: -5.5, isMinInclusive: true, isMaxInclusive: true }
                ])('%# - randomFloat($min, $max) should return $min', (range: Range): void => {
                    for (let i: number = 0; i < testRepeatTotal; i++) {
                        const value: number = RangeUtility.randomFloat(range);
                        expect(value).toBe(range.min);
                        expect(RangeUtility.isIn(value, range)).toBe(true);
                    }
                });
            });

            describe('randomFloat should differ from Random.randomFloat for a single value range', (): void => {
                // A Range defaults to closed, so [n, n] holds one value. Random is half open, so the
                // same pair of numbers describes the empty range [n, n) and throws. Each class obeys
                // its own documented interval; they are deliberately not interchangeable here.
                test.each([
                    { min: 5, max: 5 },
                    { min: 1.8, max: 1.8 },
                    { min: 0, max: 0 }
                ])('%# - randomFloat($min, $max) should return $min where Random.randomFloat throws', (range: Range): void => {
                    expect(RangeUtility.randomFloat(range)).toBe(range.min);

                    expect((): void => {
                        Random.randomFloat(range.min, range.max);
                    }).toThrow(ValueRangeError);
                });
            });
        });

        describe('randomInteger', (): void => {
            describe('randomInteger should only return integers that are within the range', (): void => {
                test.each([
                    { range: { min: 0, max: 5 }, lowest: 0, highest: 5 },
                    { range: { min: 0, max: 5, isMaxInclusive: false }, lowest: 0, highest: 4 },
                    { range: { min: 0, max: 5, isMinInclusive: false }, lowest: 1, highest: 5 },
                    { range: { min: 0, max: 5, isMinInclusive: false, isMaxInclusive: false }, lowest: 1, highest: 4 },
                    { range: { min: 2.3, max: 5.7 }, lowest: 3, highest: 5 },
                    { range: { min: 2.3, max: 5.7, isMinInclusive: false, isMaxInclusive: false }, lowest: 3, highest: 5 },
                    { range: { min: -3.75, max: -0.5 }, lowest: -3, highest: -1 },
                    { range: { min: -10, max: 10 }, lowest: -10, highest: 10 }
                ])('%# - randomInteger($range) should return an integer in [$lowest, $highest]', ({ range, lowest, highest }: { range: Range; lowest: number; highest: number; }): void => {
                    const values: number[] = [];

                    for (let i: number = 0; i < testRepeatTotal; i++) {
                        const value: number = RangeUtility.randomInteger(range);
                        expect(Number.isInteger(value)).toBe(true);
                        expect(value).toBeGreaterThanOrEqual(lowest);
                        expect(value).toBeLessThanOrEqual(highest);
                        expect(RangeUtility.isIn(value, range)).toBe(true);
                        values.push(value);
                    }

                    const valuesSet: Set<number> = new Set<number>(values);

                    if (highest > lowest) {
                        expect(valuesSet.size).toBeGreaterThan(1);
                        expect(valuesSet.size).toBeLessThanOrEqual((highest - lowest) + 1);
                    } else {
                        expect(valuesSet.size).toBe(1);
                    }
                });
            });

            describe('randomInteger should return min when min and max are equal integers', (): void => {
                test.each([
                    { min: 0, max: 0 },
                    { min: 5, max: 5 },
                    { min: -10, max: -10, isMinInclusive: true, isMaxInclusive: true }
                ])('%# - randomInteger($min, $max) should return $min', (range: Range): void => {
                    for (let i: number = 0; i < testRepeatTotal; i++) {
                        const value: number = RangeUtility.randomInteger(range);
                        expect(value).toBe(range.min);
                        expect(RangeUtility.isIn(value, range)).toBe(true);
                    }
                });
            });

            describe('randomInteger should throw when the range contains no integer values', (): void => {
                test.each([
                    { min: 1.8, max: 1.8 },
                    { min: -0.5, max: -0.5 },
                    { min: 1.5, max: 1.89 },
                    { min: 0.5, max: 0.75 },
                    { min: 5, max: 6, isMinInclusive: false, isMaxInclusive: false },
                    { min: -0.5, max: 0, isMaxInclusive: false }
                ])('%# - randomInteger($min, $max) should throw ValueRangeError', (range: Range): void => {
                    expect((): void => {
                        RangeUtility.randomInteger(range);
                    }).toThrow(ValueRangeError);
                });
            });

            describe('randomInteger should throw when the range contains unsafe integers', (): void => {
                test.each([
                    { min: 0, max: 1e20 },
                    { min: -Number.MAX_VALUE, max: 0, isMinInclusive: false },
                    { min: -Number.MAX_VALUE, max: Number.MAX_VALUE },
                    { min: 1e20, max: 1e20 + 16384 }
                ])('%# - randomInteger($min, $max) should throw ValueRangeError', (range: Range): void => {
                    Random.randomNumberGenerator = (): number => 0;

                    expect((): void => {
                        RangeUtility.randomInteger(range);
                    }).toThrow(ValueRangeError);
                });
            });

            describe('randomInteger should match Random.randomInt for an explicitly half open range', (): void => {
                const drawFractions: number[] = [0, 0.25, 0.5, 0.75, nearOne];

                test.each([
                    { min: 0, max: 10 },
                    { min: -5, max: 5 },
                    { min: 2.3, max: 5.7 },
                    { min: -3.75, max: -0.5 }
                ])('%# - randomInteger($min, $max) with an exclusive max should match Random.randomInt($min, $max)', ({ min, max }: { min: number; max: number; }): void => {
                    const range: Range = { min: min, max: max, isMaxInclusive: false };

                    for (const fraction of drawFractions) {
                        Random.randomNumberGenerator = (): number => fraction;
                        const rangeValue: number = RangeUtility.randomInteger(range);

                        Random.randomNumberGenerator = (): number => fraction;
                        const randomValue: number = Random.randomInt(min, max);

                        expect(rangeValue).toBe(randomValue);
                    }
                });
            });

            describe('randomInteger should include max by default where Random.randomInt excludes it', (): void => {
                test('randomInteger({ min: 0, max: 1 }) should be able to return 1', (): void => {
                    Random.randomNumberGenerator = (): number => 0.99;
                    expect(RangeUtility.randomInteger({ min: 0, max: 1 })).toBe(1);
                    expect(Random.randomInt(0, 1)).toBe(0);
                });
            });
        });

        describe('Argument errors', (): void => {
            const invalidRangeInputs: unknown[] = rangeFailureScenarios.flatMap((scenario: Scenario): unknown[] => {
                return scenario.inputs;
            });

            const testCases: TestCase[] = buildTestCases(invalidRangeInputs, SchemaTypeError);

            describe('Argument errors - randomFloat', (): void => {
                test.each(
                    testCases
                )('%# - randomFloat($input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect((): void => {
                        RangeUtility.randomFloat(testInput as Range);
                    }).toThrow(testExpected);
                });
            });

            describe('Argument errors - randomInteger', (): void => {
                test.each(
                    testCases
                )('%# - randomInteger($input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect((): void => {
                        RangeUtility.randomInteger(testInput as Range);
                    }).toThrow(testExpected);
                });
            });
        });
    });
});
