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

import { PrimitiveTypeError, Range, RangeBuilder, RangeUtility, SchemaTypeError } from '../../src';

import { nonBooleanInputs } from '../utils/input/boolean-inputs';

import {
    negativeSafeNumberInputs,
    nonFiniteNumberInputs,
    nonNumberInputs,
    positiveSafeNumberInputs,
    zeroInputs
} from '../utils/input/number-inputs';

import { Scenario, TestCase, buildTestCases } from '../utils/test-case/test-case';

describe('RangeBuilder', (): void => {
    const finiteNumberScenarios: Scenario[] = [
        {
            label: 'Zero inputs',
            inputs: zeroInputs,
            expected: undefined
        },
        {
            label: 'Finite number inputs',
            inputs: [
                ...positiveSafeNumberInputs.filter(input => input !== Number.MAX_VALUE),
                ...negativeSafeNumberInputs.filter(input => input !== -Number.MAX_VALUE)
            ],
            expected: undefined
        }
    ];

    const nonFiniteNumberScenarios: Scenario[] = [
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

    const nonBooleanScenarios: Scenario[] = [
        {
            label: 'Non-boolean inputs',
            inputs: nonBooleanInputs.filter(input => input !== undefined),
            expected: PrimitiveTypeError
        }
    ];

    const booleanScenarios: Scenario[] = [
        {
            label: 'Boolean inputs',
            inputs: [true, false],
            expected: undefined
        },
        {
            label: 'Undefined input',
            inputs: [undefined],
            expected: undefined
        }
    ];

    const validRangeScenarios: Scenario[] = [
        {
            label: 'Minimum less than maximum',
            inputs: [
                {
                    min: 5,
                    max: 10,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: 5.5,
                    max: 10,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: 5,
                    max: 10.5,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: -5,
                    max: 10,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: -5.5,
                    max: 10,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: -5,
                    max: 10.5,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: -5.5,
                    max: 10.5,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: -10,
                    max: -5,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: -10.5,
                    max: -5,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: -10,
                    max: -5.5,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: 10.12345678912344,
                    max: 10.12345678912345,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: -10.12345678912345,
                    max: -10.12345678912344,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                }
            ],
            expected: undefined
        },
        {
            label: 'Minimum equal to maximum',
            inputs: [
                {
                    min: 10,
                    max: 10,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: -10,
                    max: -10,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: 10.12345678912345,
                    max: 10.12345678912345,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: -10.12345678912345,
                    max: -10.12345678912345,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: 0,
                    max: 0,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: -0,
                    max: -0,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: -0,
                    max: 0,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: 0,
                    max: -0,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                }
            ],
            expected: undefined
        },
        {
            label: 'Defined inclusive values',
            inputs: [
                {
                    min: 5,
                    max: 10,
                    isMinInclusive: true,
                    isMaxInclusive: undefined
                },
                {
                    min: 5,
                    max: 10,
                    isMinInclusive: false,
                    isMaxInclusive: undefined
                },
                {
                    min: 5,
                    max: 10,
                    isMinInclusive: undefined,
                    isMaxInclusive: true
                },
                {
                    min: 5,
                    max: 10,
                    isMinInclusive: undefined,
                    isMaxInclusive: false
                },
                {
                    min: 5,
                    max: 10,
                    isMinInclusive: false,
                    isMaxInclusive: false
                },
                {
                    min: 5,
                    max: 10,
                    isMinInclusive: false,
                    isMaxInclusive: true
                },
                {
                    min: 5,
                    max: 10,
                    isMinInclusive: true,
                    isMaxInclusive: false
                },
                {
                    min: 5,
                    max: 10,
                    isMinInclusive: true,
                    isMaxInclusive: true
                }
            ],
            expected: undefined
        }
    ];

    const invalidRangeScenarios: Scenario[] = [
        {
            label: 'Minimum greater than maximum',
            inputs: [
                {
                    min: 0,
                    max: -5,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: 0,
                    max: -5.5,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: 5,
                    max: 0,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: 5.5,
                    max: 0,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: 10,
                    max: 5,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: 10,
                    max: 5.5,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: 10.5,
                    max: 5,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: 10.5,
                    max: 5.5,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: 10,
                    max: -5,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: 10,
                    max: -5.5,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: 10.5,
                    max: -5,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: 10.5,
                    max: -5.5,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: -5,
                    max: -10,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: -5.5,
                    max: -10,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: -5,
                    max: -10.5,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: -5.5,
                    max: -10.5,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: 10.12345678912345,
                    max: 10.12345678912344,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                },
                {
                    min: -10.12345678912344,
                    max: -10.12345678912345,
                    isMinInclusive: undefined,
                    isMaxInclusive: undefined
                }
            ],
            expected: SchemaTypeError
        }
    ];

    describe('buildFrom', (): void => {
        describe('Valid arguments should build a Range object', (): void => {
            describe.each(
                validRangeScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('Input $input should build a valid Range object', ({ input: testInput }: TestCase): void => {
                    const args: { min: unknown; max: unknown; isMinInclusive: unknown; isMaxInclusive: unknown; } = testInput as { min: unknown; max: unknown; isMinInclusive: unknown; isMaxInclusive: unknown; };

                    const range: Range = RangeBuilder.buildFrom(args.min as number, args.max as number, args.isMinInclusive as boolean, args.isMaxInclusive as boolean);
                    expect(range).toBeDefined();
                    expect(range.min).toBe(args.min);
                    expect(range.max).toBe(args.max);
                    expect(range.isMinInclusive).toBe(args.isMinInclusive);
                    expect(range.isMaxInclusive).toBe(args.isMaxInclusive);
                });
            });
        });

        describe('Invalid range should throw an error', (): void => {
            describe.each(
                invalidRangeScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    const args: { min: unknown; max: unknown; isMinInclusive: unknown; isMaxInclusive: unknown; } = testInput as { min: unknown; max: unknown; isMinInclusive: unknown; isMaxInclusive: unknown; };

                    expect((): void => {
                        RangeBuilder.buildFrom(args.min as number, args.max as number, args.isMinInclusive as boolean, args.isMaxInclusive as boolean);
                    }).toThrow(testExpected);
                });
            });
        });

        describe('Argument errors', (): void => {
            const argumentFailureScenarios: Scenario[] = [
                {
                    label: 'Invalid min argument',
                    inputs: [
                        ...nonNumberInputs,
                        ...nonFiniteNumberInputs
                    ].map((input: unknown): { min: unknown; max: number; isMinInclusive: undefined; isMaxInclusive: undefined; } => {
                        return {
                            min: input,
                            max: Number.MAX_SAFE_INTEGER,
                            isMinInclusive: undefined,
                            isMaxInclusive: undefined
                        };
                    }),
                    expected: PrimitiveTypeError
                },
                {
                    label: 'Invalid max argument',
                    inputs: [
                        ...nonNumberInputs,
                        ...nonFiniteNumberInputs
                    ].map((input: unknown): { min: number; max: unknown; isMinInclusive: undefined; isMaxInclusive: undefined; } => {
                        return {
                            min: Number.MIN_SAFE_INTEGER,
                            max: input,
                            isMinInclusive: undefined,
                            isMaxInclusive: undefined
                        };
                    }),
                    expected: PrimitiveTypeError
                },
                {
                    label: 'Invalid isMinInclusive argument',
                    inputs: nonBooleanInputs.filter(input => input !== undefined)
                        .map((input: unknown): { min: number; max: number; isMinInclusive: unknown; isMaxInclusive: undefined; } => {
                            return {
                                min: Number.MIN_SAFE_INTEGER,
                                max: Number.MAX_SAFE_INTEGER,
                                isMinInclusive: input,
                                isMaxInclusive: undefined
                            };
                        }),
                    expected: PrimitiveTypeError
                },
                {
                    label: 'Invalid isMaxInclusive argument',
                    inputs: nonBooleanInputs.filter(input => input !== undefined)
                        .map((input: unknown): { min: number; max: number; isMinInclusive: undefined; isMaxInclusive: unknown; } => {
                            return {
                                min: Number.MIN_SAFE_INTEGER,
                                max: Number.MAX_SAFE_INTEGER,
                                isMinInclusive: undefined,
                                isMaxInclusive: input
                            };
                        }),
                    expected: PrimitiveTypeError
                }
            ];

            describe.each(
                argumentFailureScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    const args: { min: unknown; max: unknown; isMinInclusive: unknown; isMaxInclusive: unknown; } = testInput as { min: unknown; max: unknown; isMinInclusive: unknown; isMaxInclusive: unknown; };

                    expect((): void => {
                        RangeBuilder.buildFrom(args.min as number, args.max as number, args.isMinInclusive as boolean, args.isMaxInclusive as boolean);
                    }).toThrow(testExpected);
                });
            });
        });
    });

    describe('setMin', (): void => {
        describe('setMin should set the minimum value of the range', (): void => {
            describe.each(
                finiteNumberScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should build a valid Range', ({ input: testInput }: TestCase): void => {
                    const builder: RangeBuilder = new RangeBuilder();
                    expect(builder.setMin(testInput as number)).toBe(builder);
                    const range: Range = builder.build();
                    expect(range.min).toBe(testInput);
                });
            });
        });

        describe('Argument errors', (): void => {
            describe.each(
                nonFiniteNumberScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    const builder: RangeBuilder = new RangeBuilder();
                    expect((): void => {
                        builder.setMin(testInput as number);
                    }).toThrow(testExpected);
                });
            });
        });
    });

    describe('setMax', (): void => {
        describe('setMax should set the maximum value of the range', (): void => {
            describe.each(
                finiteNumberScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should build a valid Range', ({ input: testInput }: TestCase): void => {
                    const builder: RangeBuilder = new RangeBuilder();
                    expect(builder.setMax(testInput as number)).toBe(builder);
                    const range: Range = builder.build();
                    expect(range.max).toBe(testInput);
                });
            });
        });

        describe('Argument errors', (): void => {
            describe.each(
                nonFiniteNumberScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    const builder: RangeBuilder = new RangeBuilder();
                    expect((): void => {
                        builder.setMax(testInput as number);
                    }).toThrow(testExpected);
                });
            });
        });
    });

    describe('setMinInclusive', (): void => {
        describe('setMinInclusive should set the isMinInclusive value of the range', (): void => {
            describe.each(
                booleanScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should build a valid Range', ({ input: testInput }: TestCase): void => {
                    const builder: RangeBuilder = new RangeBuilder();
                    expect(builder.setMinInclusive(testInput as boolean)).toBe(builder);
                    const range: Range = builder.build();
                    expect(range.isMinInclusive).toBe(testInput);
                });
            });
        });

        describe('Argument errors', (): void => {
            describe.each(
                nonBooleanScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    const builder: RangeBuilder = new RangeBuilder();
                    expect((): void => {
                        builder.setMinInclusive(testInput as boolean);
                    }).toThrow(testExpected);
                });
            });
        });
    });

    describe('setMaxInclusive', (): void => {
        describe('setMaxInclusive should set the isMaxInclusive value of the range', (): void => {
            describe.each(
                booleanScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should build a valid Range', ({ input: testInput }: TestCase): void => {
                    const builder: RangeBuilder = new RangeBuilder();
                    expect(builder.setMaxInclusive(testInput as boolean)).toBe(builder);
                    const range: Range = builder.build();
                    expect(range.isMaxInclusive).toBe(testInput);
                });
            });
        });

        describe('Argument errors', (): void => {
            describe.each(
                nonBooleanScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    const builder: RangeBuilder = new RangeBuilder();
                    expect((): void => {
                        builder.setMaxInclusive(testInput as boolean);
                    }).toThrow(testExpected);
                });
            });
        });
    });

    describe('build', (): void => {
        test('Default build should build a Range object', (): void => {
            const builder: RangeBuilder = new RangeBuilder();
            const range: Range = builder.build();
            expect(RangeUtility.isRange(range)).toBeTruthy();

            expect((): void => {
                RangeUtility.assertRange(range);
            }).not.toThrow();
        });

        describe('Valid arguments should build a Range object', (): void => {
            describe.each(
                validRangeScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('Input $input should build a valid Range object', ({ input: testInput }: TestCase): void => {
                    const args: { min: unknown; max: unknown; isMinInclusive: unknown; isMaxInclusive: unknown; } = testInput as { min: unknown; max: unknown; isMinInclusive: unknown; isMaxInclusive: unknown; };

                    const builder: RangeBuilder = new RangeBuilder();
                    builder.setMin(args.min as number)
                        .setMax(args.max as number)
                        .setMinInclusive(args.isMinInclusive as boolean)
                        .setMaxInclusive(args.isMaxInclusive as boolean);

                    const range: Range = builder.build();
                    expect(range).toBeDefined();
                    expect(range.min).toBe(args.min);
                    expect(range.max).toBe(args.max);
                    expect(range.isMinInclusive).toBe(args.isMinInclusive);
                    expect(range.isMaxInclusive).toBe(args.isMaxInclusive);
                });
            });
        });

        describe('Invalid range should throw an error', (): void => {
            describe.each(
                invalidRangeScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    const args: { min: unknown; max: unknown; isMinInclusive: unknown; isMaxInclusive: unknown; } = testInput as { min: unknown; max: unknown; isMinInclusive: unknown; isMaxInclusive: unknown; };

                    const builder: RangeBuilder = new RangeBuilder();
                    builder.setMin(args.min as number)
                        .setMax(args.max as number)
                        .setMinInclusive(args.isMinInclusive as boolean)
                        .setMaxInclusive(args.isMaxInclusive as boolean);

                    expect((): void => {
                        builder.build();
                    }).toThrow(testExpected);
                });
            });
        });
    });
    describe('Single value ranges', (): void => {
        describe('build and buildFrom should reject a single value range with an excluded bound', (): void => {
            test.each([
                { min: 5, max: 5, isMinInclusive: false, isMaxInclusive: true },
                { min: 5, max: 5, isMinInclusive: true, isMaxInclusive: false },
                { min: 5, max: 5, isMinInclusive: false, isMaxInclusive: false },
                { min: 0, max: 0, isMinInclusive: false, isMaxInclusive: undefined },
                { min: -5.5, max: -5.5, isMinInclusive: undefined, isMaxInclusive: false }
            ])('%# - buildFrom($min, $max, $isMinInclusive, $isMaxInclusive) should throw SchemaTypeError', ({ min, max, isMinInclusive, isMaxInclusive }: { min: number; max: number; isMinInclusive: boolean | undefined; isMaxInclusive: boolean | undefined; }): void => {
                expect((): Range => {
                    return RangeBuilder.buildFrom(min, max, isMinInclusive, isMaxInclusive);
                }).toThrow(SchemaTypeError);

                expect((): Range => {
                    return new RangeBuilder()
                        .setMin(min)
                        .setMax(max)
                        .setMinInclusive(isMinInclusive)
                        .setMaxInclusive(isMaxInclusive)
                        .build();
                }).toThrow(SchemaTypeError);
            });
        });

        describe('build and buildFrom should accept a single value range without an excluded bound', (): void => {
            test.each([
                { min: 5, max: 5, isMinInclusive: undefined, isMaxInclusive: undefined },
                { min: 5, max: 5, isMinInclusive: true, isMaxInclusive: true },
                { min: 0, max: 0, isMinInclusive: true, isMaxInclusive: undefined },
                { min: -5.5, max: -5.5, isMinInclusive: undefined, isMaxInclusive: true }
            ])('%# - buildFrom($min, $max, $isMinInclusive, $isMaxInclusive) should return a valid Range', ({ min, max, isMinInclusive, isMaxInclusive }: { min: number; max: number; isMinInclusive: boolean | undefined; isMaxInclusive: boolean | undefined; }): void => {
                const range: Range = RangeBuilder.buildFrom(min, max, isMinInclusive, isMaxInclusive);
                expect(RangeUtility.isRange(range)).toBe(true);
                expect(range.min).toBe(min);
                expect(range.max).toBe(max);
            });
        });
    });
});
