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
import { nonFiniteNumberInputs, nonNumberInputs, unsafeNumberInputs } from '../utils/input/number-inputs';
import { testStaticClassConstructor } from '../utils/static/static-class-tests';
import {
    invalidRangeSchemaScenarios,
    invalidRangeScenarios,
    optionalPropertyRangeScenarios,
    validRangeScenarios
} from '../utils/test-case/scenarios/range-scenarios';

import { Scenario, TestCase, buildTestCases } from '../utils/test-case/test-case';

describe('RangeUtility', (): void => {
    testStaticClassConstructor('RangeUtility', RangeUtility as unknown as new () => unknown, StaticInstanceError);

    const rangeFailureScenarios: Scenario[] = [
        ...invalidRangeSchemaScenarios,
        ...invalidRangeScenarios
    ];

    const rangeSuccessScenarios: Scenario[] = [
        ...validRangeScenarios,
        ...optionalPropertyRangeScenarios
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
                        ...nonFiniteNumberInputs,
                        ...unsafeNumberInputs
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
    describe('constrain', (): void => {
        describe('constrain should return the proper value for a range', (): void => {
            test.each([
                { value: 5, range: { min: 0, max: 10 }, expected: 5 },
                { value: 0, range: { min: 0, max: 10 }, expected: 0 },
                { value: 10, range: { min: 0, max: 10 }, expected: 10 },
                { value: 100, range: { min: 0, max: 10 }, expected: 10 },
                { value: -100, range: { min: 0, max: 10 }, expected: 0 },
                { value: 0, range: { min: -5, max: 5 }, expected: 0 },
                { value: -2, range: { min: -3, max: -1 }, expected: -2 },
                { value: -400, range: { min: -300, max: -200 }, expected: -300 },
                { value: -100, range: { min: -300, max: -200 }, expected: -200 },
                { value: 5.5, range: { min: 0.5, max: 10.5 }, expected: 5.5 },
                { value: 0.25, range: { min: 0.5, max: 10.5 }, expected: 0.5 },
                { value: 10.75, range: { min: 0.5, max: 10.5 }, expected: 10.5 },
                { value: 5, range: { min: 1, max: 1 }, expected: 1 },
                { value: 0, range: { min: 1, max: 1 }, expected: 1 },
                { value: Number.MAX_SAFE_INTEGER, range: { min: 5, max: 500 }, expected: 500 },
                { value: Number.MIN_SAFE_INTEGER, range: { min: 5, max: 500 }, expected: 5 },
                { value: 5, range: { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER }, expected: 5 },
                { value: 1.12345678912343, range: { min: 1.12345678912344, max: 2.12345678912345 }, expected: 1.12345678912344 },
                { value: 2.12345678912346, range: { min: 1.12345678912344, max: 2.12345678912345 }, expected: 2.12345678912345 }
            ])('%# - constrain($value, $range) should return $expected', ({ value, range, expected }: { value: number; range: Range; expected: number; }): void => {
                expect(RangeUtility.constrain(value, range)).toBe(expected);
            });
        });

        describe('constrain should ignore the inclusivity flags of the range', (): void => {
            // Both bounds are treated as inclusive, so an excluded bound is still returned rather
            // than the nearest representable value inside it.
            test.each([
                { value: 100, range: { min: 0, max: 10, isMaxInclusive: false }, expected: 10 },
                { value: -100, range: { min: 0, max: 10, isMinInclusive: false }, expected: 0 },
                { value: 100, range: { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: false }, expected: 10 },
                { value: -100, range: { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: false }, expected: 0 },
                { value: 100, range: { min: 0.5, max: 10.5, isMaxInclusive: false }, expected: 10.5 },
                { value: -100, range: { min: 0.5, max: 10.5, isMinInclusive: false }, expected: 0.5 }
            ])('%# - constrain($value, $range) should return $expected', ({ value, range, expected }: { value: number; range: Range; expected: number; }): void => {
                expect(RangeUtility.constrain(value, range)).toBe(expected);
            });

            test.each([
                { value: 100, range: { min: 0, max: 10, isMaxInclusive: false } },
                { value: -100, range: { min: 0, max: 10, isMinInclusive: false } }
            ])('%# - constrain($value, $range) should return a value that isIn rejects', ({ value, range }: { value: number; range: Range; }): void => {
                expect(RangeUtility.isIn(RangeUtility.constrain(value, range), range)).toBe(false);
            });
        });

        describe('constrain should return a value within the range when both bounds are inclusive', (): void => {
            test.each([
                { value: 100, range: { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: true } },
                { value: -100, range: { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: true } },
                { value: 5, range: { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: true } },
                { value: 0.25, range: { min: 0.5, max: 10.5 } },
                { value: Number.MAX_SAFE_INTEGER, range: { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER } }
            ])('%# - constrain($value, $range) should satisfy isIn', ({ value, range }: { value: number; range: Range; }): void => {
                expect(RangeUtility.isIn(RangeUtility.constrain(value, range), range)).toBe(true);
            });
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
                        ...nonFiniteNumberInputs,
                        ...unsafeNumberInputs
                    ].map((input: unknown): { value: unknown; range: Range; } => {
                        return {
                            value: input,
                            range: { min: 0, max: 10 }
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

                test.each(
                    testCases
                )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    const args: { value: unknown; range: unknown; } = testInput as { value: unknown; range: unknown; };

                    expect((): void => {
                        RangeUtility.constrain(args.value as number, args.range as Range);
                    }).toThrow(testExpected);
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

            describe('a Range bound past MAX_SAFE_INTEGER is rejected', (): void => {
                // Random validates a bare pair of bounds, so an unsafe bound is a type error there.
                // A Range carries its bounds in the schema, so the same value fails the Range
                // contract before either generator runs.
                test('Number.MAX_SAFE_INTEGER + 1 is rejected by Random and by RangeUtility', (): void => {
                    expect((): void => {
                        Random.randomFloat(0, Number.MAX_SAFE_INTEGER + 1);
                    }).toThrow(PrimitiveTypeError);

                    expect((): void => {
                        Random.randomInt(0, Number.MAX_SAFE_INTEGER + 1);
                    }).toThrow(PrimitiveTypeError);

                    expect((): void => {
                        RangeUtility.randomFloat({ min: 0, max: Number.MAX_SAFE_INTEGER + 1 });
                    }).toThrow(SchemaTypeError);

                    expect((): void => {
                        RangeUtility.randomInt({ min: 0, max: Number.MAX_SAFE_INTEGER + 1 });
                    }).toThrow(SchemaTypeError);
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

            describe('the safe integer restriction applies to the whole Range contract', (): void => {
                // A bound outside the safe integer range makes the object an invalid Range, so it is
                // rejected by every method that takes one, not only by the generators.
                test.each([
                    { min: -1e300, max: 1e300 },
                    { min: 0, max: Number.MAX_VALUE }
                ])('%# - the range $min to $max should be rejected by every Range method', (range: Range): void => {
                    expect(RangeUtility.isRange(range)).toBe(false);

                    expect((): void => {
                        RangeUtility.isIn(0, range);
                    }).toThrow(SchemaTypeError);

                    expect((): void => {
                        RangeUtility.assertIn(0, range);
                    }).toThrow(SchemaTypeError);

                    expect((): void => {
                        RangeUtility.constrain(0, range);
                    }).toThrow(SchemaTypeError);

                    expect((): void => {
                        RangeUtility.randomFloat(range);
                    }).toThrow(SchemaTypeError);

                    expect((): void => {
                        RangeUtility.randomInt(range);
                    }).toThrow(SchemaTypeError);
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

            describe('randomFloat should reject a range with no representable value before drawing', (): void => {
                // The bounds of each range below are adjacent representable numbers with both bounds
                // excluded, so no representable value satisfies the range. Such an object is not a
                // valid Range, so assertRange rejects it rather than the draw loop failing.
                test.each([
                    { min: 1, max: 1 + Number.EPSILON, isMinInclusive: false, isMaxInclusive: false },
                    { min: 0, max: Number.MIN_VALUE, isMinInclusive: false, isMaxInclusive: false },
                    { min: -1 - Number.EPSILON, max: -1, isMinInclusive: false, isMaxInclusive: false }
                ])('%# - randomFloat($min, $max) should throw SchemaTypeError', (range: Range): void => {
                    Random.randomNumberGenerator = (): number => 0;

                    expect((): void => {
                        RangeUtility.randomFloat(range);
                    }).toThrow(SchemaTypeError);
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

        describe('randomInt', (): void => {
            describe('randomInt should only return integers that are within the range', (): void => {
                test.each([
                    { range: { min: 0, max: 5 }, lowest: 0, highest: 5 },
                    { range: { min: 0, max: 5, isMaxInclusive: false }, lowest: 0, highest: 4 },
                    { range: { min: 0, max: 5, isMinInclusive: false }, lowest: 1, highest: 5 },
                    { range: { min: 0, max: 5, isMinInclusive: false, isMaxInclusive: false }, lowest: 1, highest: 4 },
                    { range: { min: 2.3, max: 5.7 }, lowest: 3, highest: 5 },
                    { range: { min: 2.3, max: 5.7, isMinInclusive: false, isMaxInclusive: false }, lowest: 3, highest: 5 },
                    { range: { min: -3.75, max: -0.5 }, lowest: -3, highest: -1 },
                    { range: { min: -10, max: 10 }, lowest: -10, highest: 10 }
                ])('%# - randomInt($range) should return an integer in [$lowest, $highest]', ({ range, lowest, highest }: { range: Range; lowest: number; highest: number; }): void => {
                    const values: number[] = [];

                    for (let i: number = 0; i < testRepeatTotal; i++) {
                        for (const value of [RangeUtility.randomInt(range)]) {
                            expect(Number.isInteger(value)).toBe(true);
                            expect(value).toBeGreaterThanOrEqual(lowest);
                            expect(value).toBeLessThanOrEqual(highest);
                            expect(RangeUtility.isIn(value, range)).toBe(true);
                            values.push(value);
                        }
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

            describe('randomInt should return min when min and max are equal integers', (): void => {
                test.each([
                    { min: 0, max: 0 },
                    { min: 5, max: 5 },
                    { min: -10, max: -10, isMinInclusive: true, isMaxInclusive: true }
                ])('%# - randomInt($min, $max) should return $min', (range: Range): void => {
                    for (let i: number = 0; i < testRepeatTotal; i++) {
                        for (const value of [RangeUtility.randomInt(range)]) {
                            expect(value).toBe(range.min);
                            expect(RangeUtility.isIn(value, range)).toBe(true);
                        }
                    }
                });
            });

            describe('randomInt should throw when the range contains no integer values', (): void => {
                const noIntegerValueScenarios: Scenario[] = [
                    {
                        label: 'Ranges between two consecutive integers',
                        inputs: [
                            { min: 1.5, max: 1.89 },
                            { min: 0.5, max: 0.75 },
                            { min: 10.01, max: 10.99 },
                            { min: -10.4, max: -10.25 }
                        ],
                        expected: ValueRangeError
                    },
                    {
                        label: 'Ranges holding a single non-integer value',
                        inputs: [
                            { min: 1.8, max: 1.8 },
                            { min: -0.5, max: -0.5 }
                        ],
                        expected: ValueRangeError
                    },
                    {
                        label: 'Ranges whose only integers sit on an excluded bound',
                        inputs: [
                            { min: 5, max: 6, isMinInclusive: false, isMaxInclusive: false },
                            { min: -0.5, max: 0, isMaxInclusive: false }
                        ],
                        expected: ValueRangeError
                    }
                ];

                describe.each(
                    noIntegerValueScenarios
                )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                    const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                    test.each(
                        testCases
                    )('%# - randomInt($input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                        expect((): void => {
                            RangeUtility.randomInt(testInput as Range);
                        }).toThrow(testExpected);
                    });
                });
            });

            describe('randomInt should reject an unsafe bound before drawing from it', (): void => {
                test.each([
                    { min: 0, max: 1e20 },
                    { min: -Number.MAX_VALUE, max: 0, isMinInclusive: false },
                    { min: 1e20, max: 1e20 + 16384 }
                ])('%# - randomInt($min, $max) should throw SchemaTypeError', (range: Range): void => {
                    Random.randomNumberGenerator = (): number => 0;

                    expect((): void => {
                        RangeUtility.randomInt(range);
                    }).toThrow(SchemaTypeError);
                });
            });

            describe('randomInt should match Random.randomInt for an explicitly half open range', (): void => {
                const drawFractions: number[] = [0, 0.25, 0.5, 0.75, nearOne];

                test.each([
                    { min: 0, max: 10 },
                    { min: -5, max: 5 },
                    { min: 2.3, max: 5.7 },
                    { min: -3.75, max: -0.5 }
                ])('%# - randomInt($min, $max) with an exclusive max should match Random.randomInt($min, $max)', ({ min, max }: { min: number; max: number; }): void => {
                    const range: Range = { min: min, max: max, isMaxInclusive: false };

                    for (const fraction of drawFractions) {
                        Random.randomNumberGenerator = (): number => fraction;
                        const rangeValue: number = RangeUtility.randomInt(range);

                        Random.randomNumberGenerator = (): number => fraction;
                        const randomValue: number = Random.randomInt(min, max);

                        expect(rangeValue).toBe(randomValue);
                    }
                });
            });

            describe('randomInt should include max by default where Random.randomInt excludes it', (): void => {
                test('randomInt({ min: 0, max: 1 }) should be able to return 1', (): void => {
                    Random.randomNumberGenerator = (): number => 0.99;
                    expect(RangeUtility.randomInt({ min: 0, max: 1 })).toBe(1);
                    expect(Random.randomInt(0, 1)).toBe(0);
                });
            });
        });

        describe('Argument errors', (): void => {
            const invalidRangeInputs: unknown[] = rangeFailureScenarios.flatMap((scenario: Scenario): unknown[] => {
                return scenario.inputs;
            });

            const testCases: TestCase[] = buildTestCases(invalidRangeInputs, SchemaTypeError);

            describe('Argument errors - constrain', (): void => {
                test.each(
                    testCases
                )('%# - constrain(5, $input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect((): void => {
                        RangeUtility.constrain(5, testInput as Range);
                    }).toThrow(testExpected);
                });
            });

            describe('Argument errors - randomFloat', (): void => {
                test.each(
                    testCases
                )('%# - randomFloat($input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect((): void => {
                        RangeUtility.randomFloat(testInput as Range);
                    }).toThrow(testExpected);
                });
            });

            describe('Argument errors - randomInt', (): void => {
                test.each(
                    testCases
                )('%# - randomInt($input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect((): void => {
                        RangeUtility.randomInt(testInput as Range);
                    }).toThrow(testExpected);
                });
            });
        });
    });
});
