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

import { describe, test, expect, expectTypeOf } from 'vitest';

import {WeightedElement, weightedElementSchema, WeightedElementUtility, WeightedList} from '../../../src';

import { nonFiniteNumberInputs, nonNumberInputs } from '../../utils/input/number-inputs';
import { nonObjectInputs } from '../../utils/input/object-inputs';
import { Scenario, TestCase, buildTestCases } from '../../utils/test-case/test-case';
import { nonArrayInputs } from '../../utils/input/array-inputs';
import {Static, Type} from "typebox";

describe('WeightedElementUtility', (): void => {
    describe('new WeightedElementUtility()', (): void => {
        describe('Runtime behavior guards', (): void => {
            test('Constructor should throw an error when instantiated at runtime', (): void => {
                const RuntimeConstructor = WeightedElementUtility as unknown as new () => WeightedElementUtility;
                expect((): WeightedElementUtility => new RuntimeConstructor()).toThrow(Error);
            });
        });
    });

    describe('buildWeightedElement', (): void => {
        test('buildWeightedElement() should return a typed weighed element', (): void => {
            const element: WeightedElement<string> = WeightedElementUtility.buildWeightedElement({ value: 'test value', weight: 0.5 });

            expect(WeightedElementUtility.isWeightedElement(element, (input: unknown): input is string => typeof input === 'string')).toBe(true);
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
                )('Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
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
            )('Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                expect((): void => {
                    WeightedElementUtility.buildWeightedList(testInput as { value: unknown; weight: number; }[]);
                }).toThrow(testExpected);
            });
        });
    });

    describe('isGenericWeightedElement()', (): void => {
        describe('weightedElementSchema and WeightedElement interface should be equivalent', (): void => {
            test('String type', (): void => {
                const stringSchema = Type.Call(weightedElementSchema, [Type.String()]);
                type StringStatic = Static<typeof stringSchema>;
                expectTypeOf<StringStatic>().toExtend<WeightedElement<string>>();
                expectTypeOf<WeightedElement<string>>().toExtend<StringStatic>();
            });

            test('Number type', (): void => {
                const numberSchema = Type.Call(weightedElementSchema, [Type.Number()]);
                type NumberStatic = Static<typeof numberSchema>;
                expectTypeOf<NumberStatic>().toExtend<WeightedElement<number>>();
                expectTypeOf<WeightedElement<number>>().toExtend<NumberStatic>();
            });
        });

        describe('Input validation', (): void => {
            test.todo('isGenericWeightedElement input validation');
        });
    });

    test.todo('isWeightedElement');

    test.todo('isGenericWeightedList');

    test.todo('isWeightedList');
});
