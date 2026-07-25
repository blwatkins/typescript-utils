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

import { Static, Type } from 'typebox';
import { describe, expect, expectTypeOf, test } from 'vitest';

import {
    Discriminators,
    WeightedElement,
    weightedElementSchema,
    WeightedElementUtility,
    WeightedList
} from '../../../src';

import { nonArrayInputs } from '../../utils/input/array-inputs';
import { nonFunctionInputs } from '../../utils/input/function-inputs';
import { nonFiniteNumberInputs, nonNumberInputs } from '../../utils/input/number-inputs';
import { nonObjectInputs } from '../../utils/input/object-inputs';
import { testStaticClassConstructor } from '../../utils/static/static-class-tests';
import { buildTestCases, Scenario, TestCase } from '../../utils/test-case/test-case';

describe('WeightedElementUtility', (): void => {
    testStaticClassConstructor('WeightedElementUtility', WeightedElementUtility as unknown as new () => unknown, Error);

    describe('buildWeightedElement', (): void => {
        test('buildWeightedElement() should return a typed weighed element', (): void => {
            const element: WeightedElement<string> = WeightedElementUtility.buildWeightedElement({ value: 'test value', weight: 0.5 });

            expect(WeightedElementUtility.isWeightedElement(element, (input: unknown): input is string => typeof input === 'string')).toBe(true);
            expect(WeightedElementUtility.isWeightedElement(element, (input: unknown): input is number => typeof input === 'number')).toBe(false);
        });

        describe('Input validation', (): void => {
            const scenarios: Scenario[] = [
                {
                    label: 'Non-object type inputs',
                    inputs: [
                        ...nonObjectInputs
                    ],
                    expected: TypeError
                },
                {
                    label: 'Array type inputs',
                    inputs: [
                        [],
                        [1, 2, 3],
                        ['a', 'b', 'c']
                    ],
                    expected: TypeError
                },
                {
                    label: 'Object inputs missing value property',
                    inputs: [
                        { weight: 0 },
                        { weight: 0.5 },
                        { weight: 1 }
                    ],
                    expected: TypeError
                },
                {
                    label: 'Object inputs missing weight property',
                    inputs: [
                        { value: 10 },
                        { value: 'hello' },
                        {
                            value: (): number => {
                                return 100;
                            }
                        }
                    ],
                    expected: TypeError
                },
                {
                    label: 'Object inputs with non-numeric weight property',
                    inputs: [
                        ...nonNumberInputs.map((input) => {
                            return { value: 'test', weight: input };
                        })
                    ],
                    expected: TypeError
                },
                {
                    label: 'Object inputs with non-finite weight property',
                    inputs: [
                        ...nonFiniteNumberInputs.map((input) => {
                            return { value: 'test', weight: input };
                        })
                    ],
                    expected: TypeError
                },
                {
                    label: 'Object inputs with out of range weight property',
                    inputs: [
                        { value: 10, weight: -5 },
                        { value: 10, weight: -1 },
                        { value: 10, weight: -0.1 },
                        { value: 10, weight: -Number.EPSILON },
                        { value: 10, weight: 1 + Number.EPSILON },
                        { value: 10, weight: 1.1 },
                        { value: 10, weight: 5 }
                    ],
                    expected: TypeError
                },
                {
                    label: 'Object inputs with additional properties',
                    inputs: [
                        { value: 'hello', weight: 0, name: 'bob' },
                        { value: 'hello', weight: 0.5, age: 42 },
                        { value: 'hello', weight: 1, day: 7 }
                    ],
                    expected: TypeError
                }
            ];

            describe.each(
                scenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect((): void => {
                        WeightedElementUtility.buildWeightedElement(testInput as { value: unknown; weight: number; });
                    }).toThrow(testExpected);
                });
            });
        });
    });

    describe('buildWeightedList', (): void => {
        test('buildWeightedList() should return a typed weighted list', (): void => {
            const list: WeightedList<string> = WeightedElementUtility.buildWeightedList([
                { value: 'test value 1', weight: 0.5 },
                { value: 'test value 2', weight: 0.5 }
            ]);

            expect(WeightedElementUtility.isWeightedList(list, (input: unknown): input is string => typeof input === 'string')).toBe(true);
            expect(WeightedElementUtility.isWeightedList(list, (input: unknown): input is number => typeof input === 'number')).toBe(false);
        });

        const scenarios: Scenario[] = [
            {
                label: 'Non-array type inputs',
                inputs: [
                    ...nonArrayInputs
                ],
                expected: TypeError
            },
            {
                label: 'Empty array input',
                inputs: [
                    []
                ],
                expected: TypeError
            },
            {
                label: 'Incorrect type array input',
                inputs: [
                    [1, 2, 3],
                    ['a', 'b', 'c'],
                    [
                        { weight: 1 }
                    ],
                    [
                        { value: 'hello' }
                    ],
                    [
                        { value: 'hello', weight: 'three' }
                    ],
                    [
                        { value: 'hello', weight: NaN }
                    ],
                    [
                        { value: 'hello', weight: Infinity }
                    ],
                    [
                        { value: 10, weight: -0.1 }
                    ],
                    [
                        { value: 'hello', weight: 1, name: 'bob' }
                    ]
                ],
                expected: TypeError
            },
            {
                label: 'Weight sum is not equal to one',
                inputs: [
                    [
                        { value: 'test 1', weight: 0.5 },
                        { value: 'test 2', weight: 0.5 },
                        { value: 'test 3', weight: 0.0001 }
                    ],
                    [
                        { value: 'test 1', weight: 0.5 },
                        { value: 'test 2', weight: 0.5 - 0.0001 }
                    ],
                    [
                        { value: 'test 1', weight: 0.5 },
                        { value: 'test 2', weight: 0.5 + 0.0001 }
                    ],
                    [
                        { value: 'test 1', weight: 0 }
                    ],
                    [
                        { value: 'test 1', weight: 1 - 0.0001 }
                    ],
                    [
                        { value: 'test 1', weight: 1 },
                        { value: 'test 2', weight: 1 }
                    ],
                    [
                        [
                            { value: 'test 1', weight: 1 },
                            { value: 'test 2', weight: 0.0001 }
                        ]
                    ]
                ],
                expected: TypeError
            }
        ];

        describe.each(
            scenarios
        )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
            const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

            test.each(
                testCases
            )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                expect((): void => {
                    WeightedElementUtility.buildWeightedList(testInput as { value: unknown; weight: number; }[]);
                }).toThrow(testExpected);
            });
        });
    });

    describe('isGenericWeightedElement()', (): void => {
        describe('weightedElementSchema and WeightedElement interface should be equivalent', (): void => {
            const numberSchema = Type.Call(weightedElementSchema, [Type.Number()]);
            type NumberStatic = Static<typeof numberSchema>;
            const stringSchema = Type.Call(weightedElementSchema, [Type.String()]);
            type StringStatic = Static<typeof stringSchema>;

            test('String type', (): void => {
                expect(stringSchema).toBeDefined();

                expectTypeOf<StringStatic>().toExtend<WeightedElement<string>>();
                expectTypeOf<WeightedElement<string>>().toExtend<StringStatic>();

                expectTypeOf<NumberStatic>().not.toExtend<WeightedElement<string>>();
                expectTypeOf<WeightedElement<string>>().not.toExtend<NumberStatic>();
            });

            test('Number type', (): void => {
                expect(numberSchema).toBeDefined();

                expectTypeOf<NumberStatic>().toExtend<WeightedElement<number>>();
                expectTypeOf<WeightedElement<number>>().toExtend<NumberStatic>();

                expectTypeOf<StringStatic>().not.toExtend<WeightedElement<number>>();
                expectTypeOf<WeightedElement<number>>().not.toExtend<StringStatic>();
            });
        });

        describe('Input validation', (): void => {
            const scenarios: Scenario[] = [
                {
                    label: 'Non-object type inputs',
                    inputs: [
                        ...nonObjectInputs
                    ],
                    expected: false
                },
                {
                    label: 'Array type inputs',
                    inputs: [
                        [],
                        [1, 2, 3],
                        ['a', 'b', 'c']
                    ],
                    expected: false
                },
                {
                    label: 'Object inputs missing value property',
                    inputs: [
                        { weight: 0, discriminator: Discriminators.WeightedElement },
                        { weight: 0.5, discriminator: Discriminators.WeightedElement },
                        { weight: 1, discriminator: Discriminators.WeightedElement }
                    ],
                    expected: false
                },
                {
                    label: 'Object inputs missing weight property',
                    inputs: [
                        { value: 10, discriminator: Discriminators.WeightedElement },
                        { value: 'hello', discriminator: Discriminators.WeightedElement },
                        {
                            value: (): number => {
                                return 100;
                            },
                            discriminator: Discriminators.WeightedElement
                        }
                    ],
                    expected: false
                },
                {
                    label: 'Object inputs missing discriminator property',
                    inputs: [
                        { value: 'hi', weight: 0 },
                        { value: 'hello', weight: 0.5 },
                        { value: 'test', weight: 1 }
                    ],
                    expected: false
                },
                {
                    label: 'Object inputs with non-numeric weight property',
                    inputs: [
                        ...nonNumberInputs.map((input) => {
                            return { value: 'test', weight: input, discriminator: Discriminators.WeightedElement };
                        })
                    ],
                    expected: false
                },
                {
                    label: 'Object inputs with non-finite weight property',
                    inputs: [
                        ...nonFiniteNumberInputs.map((input) => {
                            return { value: 'test', weight: input, discriminator: Discriminators.WeightedElement };
                        })
                    ],
                    expected: false
                },
                {
                    label: 'Object inputs with out of range weight property',
                    inputs: [
                        { value: 10, weight: -5, discriminator: Discriminators.WeightedElement },
                        { value: 10, weight: -1, discriminator: Discriminators.WeightedElement },
                        { value: 10, weight: -0.1, discriminator: Discriminators.WeightedElement },
                        { value: 10, weight: -Number.EPSILON, discriminator: Discriminators.WeightedElement },
                        { value: 10, weight: 1 + Number.EPSILON, discriminator: Discriminators.WeightedElement },
                        { value: 10, weight: 1.1, discriminator: Discriminators.WeightedElement },
                        { value: 10, weight: 5, discriminator: Discriminators.WeightedElement }
                    ],
                    expected: false
                },
                {
                    label: 'Object inputs with additional properties',
                    inputs: [
                        { value: 'hello', weight: 0, name: 'bob', discriminator: Discriminators.WeightedElement },
                        { value: 'hello', weight: 0.5, age: 42, discriminator: Discriminators.WeightedElement },
                        { value: 'hello', weight: 1, day: 7, discriminator: Discriminators.WeightedElement }
                    ],
                    expected: false
                },
                {
                    label: 'Object inputs with incorrect discriminator',
                    inputs: [
                        { value: 'hello', weight: 0, discriminator: 'invalid' },
                        { value: 'hello', weight: 0.5, discriminator: '' },
                        { value: 'hello', weight: 1, discriminator: 'other discriminator' }
                    ],
                    expected: false
                },
                {
                    label: 'Valid weighted element object',
                    inputs: [
                        { value: 'hello', weight: 0, discriminator: Discriminators.WeightedElement },
                        { value: 'hi', weight: 0.5, discriminator: Discriminators.WeightedElement },
                        { value: 'hey', weight: 1, discriminator: Discriminators.WeightedElement }
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
                    expect(WeightedElementUtility.isGenericWeightedElement(testInput)).toBe(testExpected);
                });
            });
        });
    });

    describe('isWeightedElement', (): void => {
        describe('Input validation', (): void => {
            const scenarios: Scenario[] = [
                {
                    label: 'Non-function type inputs',
                    inputs: [
                        ...nonFunctionInputs
                    ],
                    expected: TypeError
                }
            ];

            describe.each(
                scenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect((): void => {
                        WeightedElementUtility.isWeightedElement({}, testInput as ((value: unknown) => value is unknown));
                    }).toThrow(testExpected);
                });
            });
        });
    });

    describe('isGenericWeightedList', (): void => {
        describe('Input validation', (): void => {
            const scenarios: Scenario[] = [
                {
                    label: 'Non-array type inputs',
                    inputs: [
                        ...nonArrayInputs
                    ],
                    expected: false
                },
                {
                    label: 'Empty array inputs',
                    inputs: [
                        []
                    ],
                    expected: false
                },
                {
                    label: 'Array inputs do not contain weighted elements',
                    inputs: [
                        [1, 2, 3],
                        ['a', 'b', 'c']
                    ],
                    expected: false
                },
                {
                    label: 'Array inputs contain weighted elements and other type',
                    inputs: [
                        [
                            { value: 'hello', weight: 0, discriminator: Discriminators.WeightedElement },
                            { value: 'hi', weight: 0.5, discriminator: Discriminators.WeightedElement },
                            500
                        ],
                        [
                            { value: 'hello', weight: 0, discriminator: Discriminators.WeightedElement },
                            { value: 'hi', weight: 0.5, discriminator: Discriminators.WeightedElement },
                            'string value'
                        ],
                        [
                            { value: 'hello', weight: 0, discriminator: Discriminators.WeightedElement },
                            { value: 'hi', weight: 0.5, discriminator: Discriminators.WeightedElement },
                            { key: 'value' }
                        ],
                        [
                            { value: 'hello', weight: 0, discriminator: Discriminators.WeightedElement },
                            { value: 'hi', weight: 0.5, discriminator: Discriminators.WeightedElement },
                            { key: 'value', discriminator: Discriminators.WeightedElement }
                        ]
                    ],
                    expected: false
                },
                {
                    label: 'Weighted elements weight sum is not equal to 1',
                    inputs: [
                        [
                            { value: 'hello', weight: 0, discriminator: Discriminators.WeightedElement },
                            { value: 'hi', weight: 0, discriminator: Discriminators.WeightedElement }
                        ],
                        [
                            { value: 'hello', weight: 0, discriminator: Discriminators.WeightedElement },
                            { value: 'hi', weight: 0.5, discriminator: Discriminators.WeightedElement }
                        ],
                        [
                            { value: 'hello', weight: 0.5, discriminator: Discriminators.WeightedElement },
                            { value: 'hi', weight: 0.5, discriminator: Discriminators.WeightedElement },
                            { value: 'howdy', weight: 0.0001, discriminator: Discriminators.WeightedElement }
                        ]
                    ],
                    expected: false
                }
            ];

            describe.each(
                scenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(WeightedElementUtility.isGenericWeightedList(testInput)).toBe(testExpected);
                });
            });
        });
    });

    describe('isWeightedList', (): void => {
        describe('Input validation', (): void => {
            describe('Value type guard function', (): void => {
                const scenarios: Scenario[] = [
                    {
                        label: 'Non-function type inputs',
                        inputs: [
                            ...nonFunctionInputs
                        ],
                        expected: TypeError
                    }
                ];

                describe.each(
                    scenarios
                )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                    const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                    test.each(
                        testCases
                    )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                        expect((): void => {
                            WeightedElementUtility.isWeightedList([{ value: 'test', weight: 1, discriminator: Discriminators.WeightedElement }], testInput as ((value: unknown) => value is unknown));
                        }).toThrow(testExpected);
                    });
                });
            });

            describe('Invalid generic weighted list', (): void => {
                test('Invalid generic weighted list should return false', (): void => {
                    expect(WeightedElementUtility.isWeightedList([], (input: unknown): input is WeightedElement<unknown> => input === undefined)).toBe(false);
                });
            });
        });
    });
});
