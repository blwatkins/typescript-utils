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

import { fail } from 'node:assert';
import { describe, expect, expectTypeOf, test } from 'vitest';

import {
    PrimitiveTypeError,
    StringUtility,
    WeightedElement,
    WeightedList,
    WeightedElementUtility, SchemaTypeError
} from '../../../src';

import { nonArrayInputs } from '../../utils/input/array-inputs';
import { nonFunctionInputs } from '../../utils/input/function-inputs';
import { nonFiniteNumberInputs, nonNumberInputs } from '../../utils/input/number-inputs';
import { nonObjectInputs } from '../../utils/input/object-inputs';
import { testStaticClassConstructor } from '../../utils/static/static-class-tests';
import { buildTestCases, Scenario, TestCase } from '../../utils/test-case/test-case';

describe('WeightedElementUtility', (): void => {
    testStaticClassConstructor('WeightedElementUtility', WeightedElementUtility as unknown as new () => unknown, Error);

    const weightedElementInputScenarios: Scenario[] = [
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
                { weight: 0 },
                { weight: 0.5 },
                { weight: 1 }
            ],
            expected: false
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
            expected: false
        },
        {
            label: 'Object inputs with non-numeric weight property',
            inputs: [
                ...nonNumberInputs.map((input: unknown): { value: string; weight: unknown; } => {
                    return { value: 'test', weight: input };
                })
            ],
            expected: false
        },
        {
            label: 'Object inputs with non-finite weight property',
            inputs: [
                ...nonFiniteNumberInputs.map((input: number): { value: string; weight: number; } => {
                    return { value: 'test', weight: input };
                })
            ],
            expected: false
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
            expected: false
        },
        {
            label: 'Object inputs with additional properties',
            inputs: [
                { value: 'hello', weight: 0, name: 'bob' },
                { value: 'hello', weight: 0.5, age: 42 },
                { value: 'hello', weight: 1, day: 7 }
            ],
            expected: false
        },
        {
            label: 'Valid weighted element objects',
            inputs: [
                { value: 'hello', weight: 0 },
                { value: 'hi', weight: 0.5 },
                { value: 'hey', weight: 1 }
            ],
            expected: true
        }
    ];

    describe('assertGenericWeightedElement', (): void => {
        describe('Should correctly identify generic WeightedElement objects', (): void => {
            describe.each(
                weightedElementInputScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should throw a SchemaTypeError if it is not a valid weighted element', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    if (testExpected) {
                        expect((): void => {
                            WeightedElementUtility.assertGenericWeightedElement(testInput);
                        }).not.toThrow();
                    } else {
                        expect((): void => {
                            WeightedElementUtility.assertGenericWeightedElement(testInput);
                        }).toThrow(SchemaTypeError);
                    }
                });
            });
        });
    });

    describe('assertWeightedElement', (): void => {
        const typeGuard: (input: unknown) => input is string = (input: unknown): input is string => {
            return StringUtility.isSingleLineTrimmedString(input);
        };

        test('Should assert based on the given type guard and element value', (): void => {
            const element1: WeightedElement<unknown> = { value: 'single line', weight: 1 };
            const element2: WeightedElement<unknown> = { value: 'multi\nline', weight: 1 };
            const element3: WeightedElement<unknown> = { value: 100, weight: 1 };

            expect((): void => {
                WeightedElementUtility.assertWeightedElement<string>(element1, typeGuard)
            }).not.toThrow();
            expect((): void => {
                WeightedElementUtility.assertWeightedElement<string>(element2, typeGuard)
            }).toThrow(SchemaTypeError);
            expect((): void => {
                WeightedElementUtility.assertWeightedElement<string>(element3, typeGuard)
            }).toThrow(SchemaTypeError);

        });

        describe('Should throw for any invalid weighted element', (): void => {
            describe.each(
                weightedElementInputScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should throw a SchemaTypeError if it is not a valid weighted element', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    if (!testExpected) {
                        expect((): void => {
                            WeightedElementUtility.assertWeightedElement(testInput, typeGuard);
                        }).toThrow(SchemaTypeError);
                    }
                });
            });
        });

        describe('Input validation', (): void => {
            const scenarios: Scenario[] = [
                {
                    label: 'Non-function type inputs',
                    inputs: [
                        ...nonFunctionInputs
                    ],
                    expected: PrimitiveTypeError
                }
            ];

            describe.each(
                scenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Type guard input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect((): void => {
                        WeightedElementUtility.assertWeightedElement({}, testInput as ((value: unknown) => value is unknown));
                    }).toThrow(testExpected);
                });
            });
        });
    });

    describe('isGenericWeightedElement', (): void => {
        describe('Should correctly identify WeightedElement objects', (): void => {
            describe.each(
                weightedElementInputScenarios
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
        const typeGuard: (input: unknown) => input is string = (input: unknown): input is string => {
            return StringUtility.isSingleLineTrimmedString(input);
        };

        test('Should test the value property based on the given type guard', (): void => {
            const element1: WeightedElement<unknown> = { value: 'single line', weight: 1 };
            const element2: WeightedElement<unknown> = { value: 'multi\nline', weight: 1 };
            const element3: WeightedElement<unknown> = { value: 100, weight: 1 };

            expect(WeightedElementUtility.isWeightedElement<string>(element1, typeGuard)).toBeTruthy();
            expect(WeightedElementUtility.isWeightedElement<string>(element2, typeGuard)).toBeFalsy();
            expect(WeightedElementUtility.isWeightedElement<string>(element3, typeGuard)).toBeFalsy();
        });

        test('Should successfully narrow value property based on the given type guard', (): void => {
            const element1: unknown = { value: 'single line', weight: 1 };

            if (WeightedElementUtility.isWeightedElement<string>(element1, typeGuard)) {
                expect(element1.value).toBeTruthy();
                expectTypeOf(element1.value).toBeString();
            } else {
                fail('WeightedElement type narrowing failed');
            }
        });

        describe('Input validation', (): void => {
            const scenarios: Scenario[] = [
                {
                    label: 'Non-function type inputs',
                    inputs: [
                        ...nonFunctionInputs
                    ],
                    expected: PrimitiveTypeError
                }
            ];

            describe.each(
                scenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Type guard input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect((): void => {
                        WeightedElementUtility.isWeightedElement({}, testInput as ((value: unknown) => value is unknown));
                    }).toThrow(testExpected);
                });
            });
        });
    });

    describe('[DEPRECATED] buildWeightedElement', (): void => {
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

    describe('[DEPRECATED] buildWeightedList', (): void => {
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

    describe('[DEPRECATED] isGenericWeightedList', (): void => {
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
                            { value: 'hello', weight: 0 },
                            { value: 'hi', weight: 0.5 },
                            500
                        ],
                        [
                            { value: 'hello', weight: 0 },
                            { value: 'hi', weight: 0.5 },
                            'string value'
                        ],
                        [
                            { value: 'hello', weight: 0 },
                            { value: 'hi', weight: 0.5 },
                            { key: 'value' }
                        ],
                        [
                            { value: 'hello', weight: 0 },
                            { value: 'hi', weight: 0.5 },
                            { key: 'value' }
                        ]
                    ],
                    expected: false
                },
                {
                    label: 'Weighted elements weight sum is not equal to 1',
                    inputs: [
                        [
                            { value: 'hello', weight: 0 },
                            { value: 'hi', weight: 0 }
                        ],
                        [
                            { value: 'hello', weight: 0 },
                            { value: 'hi', weight: 0.5 }
                        ],
                        [
                            { value: 'hello', weight: 0.5 },
                            { value: 'hi', weight: 0.5 },
                            { value: 'howdy', weight: 0.0001 }
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

    describe('[DEPRECATED] isWeightedList', (): void => {
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
                            WeightedElementUtility.isWeightedList([{ value: 'test', weight: 1 }], testInput as ((value: unknown) => value is unknown));
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
