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

import {
    PrimitiveTypeError,
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

    const failureScenarios: Scenario[] = [
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
        }
    ];

    const successScenarios: Scenario[] = [
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
                { min: -5, max: -5, isMaxInclusive: false }
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
                successScenarios,
                failureScenarios,
                'Input does not match schema requirements for Range.'
            );
        });

        describe('isRange', (): void => {
            testIsMethod(RangeUtility.isRange.bind(RangeUtility), successScenarios, failureScenarios);
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
                    { value: 10, range: { min: -10, max: 10, isMaxInclusive: false } },
                    { value: 0.5, range: { min: -0.5, max: 0.5, isMinInclusive: true, isMaxInclusive: false } }
                ],
                expected: ValueRangeError
            },
            {
                label: 'Values equal to the min bound of a range with an undefined min inclusivity',
                inputs: [
                    { value: 0, range: { min: 0, max: 10 } },
                    { value: 0, range: { min: 0, max: 10, isMaxInclusive: true } },
                    { value: 0, range: { min: 0, max: 10, isMinInclusive: undefined } },
                    { value: 0, range: { min: 0, max: 10, isMinInclusive: undefined, isMaxInclusive: true } },
                    { value: -10, range: { min: -10, max: 10 } }
                ],
                expected: ValueRangeError
            },
            {
                label: 'Values equal to the max bound of a range with an undefined max inclusivity',
                inputs: [
                    { value: 10, range: { min: 0, max: 10 } },
                    { value: 10, range: { min: 0, max: 10, isMinInclusive: true } },
                    { value: 10, range: { min: 0, max: 10, isMaxInclusive: undefined } },
                    { value: 10, range: { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: undefined } },
                    { value: 10, range: { min: -10, max: 10 } }
                ],
                expected: ValueRangeError
            },
            {
                label: 'Values equal to the bounds of a single value range without two inclusive bounds',
                inputs: [
                    { value: 0, range: { min: 0, max: 0 } },
                    { value: 5, range: { min: 5, max: 5, isMinInclusive: true } },
                    { value: 5, range: { min: 5, max: 5, isMaxInclusive: true } },
                    { value: -5.5, range: { min: -5.5, max: -5.5, isMinInclusive: false, isMaxInclusive: false } }
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
                label: 'Values equal to the bounds of a single value range with two inclusive bounds',
                inputs: [
                    { value: 0, range: { min: 0, max: 0, isMinInclusive: true, isMaxInclusive: true } },
                    { value: 5, range: { min: 5, max: 5, isMinInclusive: true, isMaxInclusive: true } },
                    { value: -5.5, range: { min: -5.5, max: -5.5, isMinInclusive: true, isMaxInclusive: true } }
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
                'Input is not within range.'
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
            const invalidRangeInputs: unknown[] = failureScenarios.flatMap((scenario: Scenario): unknown[] => {
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
});
