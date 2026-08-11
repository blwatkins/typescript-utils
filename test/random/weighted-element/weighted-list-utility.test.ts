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
import { describe, test, expect, expectTypeOf } from 'vitest';

import {
    SchemaTypeError,
    StaticInstanceError,
    StringUtility,
    WeightedListUtility
} from '../../../src';

import { testStaticClassConstructor } from '../../utils/static/static-class-tests';
import { nonArrayInputs } from '../../utils/input/array-inputs';
import { buildTestCases, Scenario, TestCase } from '../../utils/test-case/test-case';

describe('WeightedListUtility', (): void => {
    testStaticClassConstructor('WeightedListUtility', WeightedListUtility as unknown as new () => unknown, StaticInstanceError);

    const failureScenarios: Scenario[] = [
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
                    [5, 6, 7]
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
                ],
                [
                    { value: 'hello', weight: 5 },
                    { value: 'hi', weight: 5 }
                ],
                [
                    { value: 'hello', weight: -3 },
                    { value: 'hi', weight: -2 }
                ]
            ],
            expected: false
        },
        {
            label: 'Weighted elements sum is equal to 1 but contains invalid weights',
            inputs: [
                [
                    { value: 'hello', weight: -1 },
                    { value: 'hi', weight: 2 }
                ]
            ],
            expected: false
        }
    ];

    const successScenarios: Scenario[] = [
        {
            label: 'Weighted elements weight sum is equal to 1 and all weights are valid',
            inputs: [
                [
                    { value: 'hello', weight: 0 },
                    { value: 'hi', weight: 1 }
                ],
                [
                    { value: 'hello', weight: 0.5 },
                    { value: 'hi', weight: 0.5 }
                ],
                [
                    { value: 'hello', weight: 0.5 },
                    { value: 'hi', weight: 0.25 },
                    { value: 'howdy', weight: 0.25 }
                ]
            ],
            expected: true
        }
    ];

    const stringListFailureScenarios: Scenario[] = [
        {
            label: 'All multi line values',
            inputs: [
                [
                    { value: 'multi\nline', weight: 1 },
                    { value: 'another\nmulti\nline', weight: 0 }
                ]
            ],
            expected: false
        },
        {
            label: 'Mixed single and multi line values',
            inputs: [
                [
                    { value: 'single line', weight: 1 },
                    { value: 'multi\nline', weight: 0 }
                ]
            ],
            expected: false
        },
        {
            label: 'Non-string values',
            inputs: [
                [
                    { value: 100, weight: 1 },
                    { value: 200, weight: 0 }
                ]
            ],
            expected: false
        },
        {
            label: 'Mixed string and non-string values',
            inputs: [
                [
                    { value: 'single line', weight: 1 },
                    { value: 200, weight: 0 }
                ]
            ],
            expected: false
        }
    ];

    const stringListSuccessScenarios: Scenario[] = [
        {
            label: 'All single line values',
            inputs: [
                [
                    { value: 'single line', weight: 1 },
                    { value: 'another single line', weight: 0 }
                ]
            ],
            expected: true
        }
    ];

    describe('assertGenericWeightedList', (): void => {
        describe('Should correctly identify generic WeightedList objects', (): void => {
            describe('Failure scenarios', (): void => {
                describe.each(
                    failureScenarios
                )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                    const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                    test.each(
                        testCases
                    )('%# - Input $input should throw a SchemaTypeError', ({ input: testInput }: TestCase): void => {
                        expect((): void => {
                            WeightedListUtility.assertGenericWeightedList(testInput);
                        }).toThrow(SchemaTypeError);
                    });
                });
            });

            describe('Success scenarios', (): void => {
                describe.each(
                    successScenarios
                )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                    const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                    test.each(
                        testCases
                    )('%# - Input $input should not throw any errors', ({ input: testInput }: TestCase): void => {
                        expect((): void => {
                            WeightedListUtility.assertGenericWeightedList(testInput);
                        }).not.toThrow();
                    });
                });
            });
        });
    });

    describe('assertWeightedList', (): void => {
        const typeGuard: (input: unknown) => input is string = (input: unknown): input is string => {
            return StringUtility.isSingleLineTrimmedString(input);
        };

        describe('Should assert based on the value property of each element passing the given type guard', (): void => {
            describe.each(
                stringListFailureScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should throw SchemaTypeError', ({ input: testInput }: TestCase): void => {
                    expect((): void => {
                        WeightedListUtility.assertWeightedList<string>(testInput, typeGuard);
                    }).toThrow(SchemaTypeError);
                });
            });

            describe.each(
                stringListSuccessScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should not throw any errors', ({ input: testInput }: TestCase): void => {
                    expect((): void => {
                        WeightedListUtility.assertWeightedList<string>(testInput, typeGuard);
                    }).not.toThrow();
                });
            });
        });

        describe('Should throw for invalid weighted lists', (): void => {
            describe.each(
                failureScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should return $expected', ({ input: testInput }: TestCase): void => {
                    expect((): void => {
                        WeightedListUtility.assertWeightedList(testInput, typeGuard);
                    }).toThrow(SchemaTypeError);
                });
            });
        });
    });

    describe('isGenericWeightedList', (): void => {
        describe('Should correctly identify WeightedList objects', (): void => {
            describe.each([
                ...failureScenarios,
                ...successScenarios
            ])('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(WeightedListUtility.isGenericWeightedList(testInput)).toBe(testExpected);
                });
            });
        });
    });

    describe('isWeightedList', (): void => {
        const typeGuard: (input: unknown) => input is string = (input: unknown): input is string => {
            return StringUtility.isSingleLineTrimmedString(input);
        };

        describe('Should test the value property of each element based on the given type guard', (): void => {
            describe.each([
                ...stringListFailureScenarios,
                ...stringListSuccessScenarios
            ])('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(WeightedListUtility.isWeightedList<string>(testInput, typeGuard)).toBe(testExpected);
                });
            });
        });

        test('Should successfully narrow value property based on the given type guard', (): void => {
            const input: unknown = [
                { value: 'single line', weight: 1 },
                { value: 'another single line', weight: 0 }
            ];

            if (WeightedListUtility.isWeightedList<string>(input, typeGuard)) {
                expect(input[0]).toBeTruthy();
                expect(input[0].value).toBeTruthy();
                expectTypeOf(input[0].value).toBeString();
                expectTypeOf(input[0].value.toLowerCase()).toBeString();
            } else {
                fail('WeightedList type narrowing failed');
            }
        });

        describe('Should return false for invalid weighted lists', (): void => {
            describe.each(
                failureScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(WeightedListUtility.isWeightedList(testInput, typeGuard)).toBe(testExpected);
                });
            });
        });
    });
});
