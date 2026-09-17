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

import { fail } from 'node:assert';
import { describe, test, expect, expectTypeOf } from 'vitest';

import {
    PrimitiveTypeError,
    SchemaTypeError,
    StaticInstanceError,
    StringUtility,
    WeightedListUtility
} from '../../../src';

import { testAssertMethod, testIsMethod } from '../../utils/assert/assert-tests';
import { testStaticClassConstructor } from '../../utils/static/static-class-tests';
import { nonArrayInputs } from '../../utils/input/array-inputs';
import { nonFunctionInputs } from '../../utils/input/function-inputs';
import { Scenario, TestCase, buildTestCases } from '../../utils/test-case/test-case';

describe('WeightedListUtility', (): void => {
    testStaticClassConstructor('WeightedListUtility', WeightedListUtility as unknown as new () => unknown, StaticInstanceError);

    const typeGuard: (input: unknown) => input is string = (input: unknown): input is string => {
        return StringUtility.isSingleLine(input);
    };

    const failureScenarios: Scenario[] = [
        {
            label: 'Non-array type inputs',
            inputs: nonArrayInputs,
            expected: SchemaTypeError
        },
        {
            label: 'Empty array inputs',
            inputs: [
                []
            ],
            expected: SchemaTypeError
        },
        {
            label: 'Array inputs do not contain weighted elements',
            inputs: [
                [1, 2, 3],
                ['a', 'b', 'c']
            ],
            expected: SchemaTypeError
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
            expected: SchemaTypeError
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
            expected: SchemaTypeError
        },
        {
            label: 'Weighted elements sum is equal to 1 but contains invalid weights',
            inputs: [
                [
                    { value: 'hello', weight: -1 },
                    { value: 'hi', weight: 2 }
                ]
            ],
            expected: SchemaTypeError
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
            expected: undefined
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
            expected: SchemaTypeError
        },
        {
            label: 'Mixed single and multi line values',
            inputs: [
                [
                    { value: 'single line', weight: 1 },
                    { value: 'multi\nline', weight: 0 }
                ]
            ],
            expected: SchemaTypeError
        },
        {
            label: 'Non-string values',
            inputs: [
                [
                    { value: 100, weight: 1 },
                    { value: 200, weight: 0 }
                ]
            ],
            expected: SchemaTypeError
        },
        {
            label: 'Mixed string and non-string values',
            inputs: [
                [
                    { value: 'single line', weight: 1 },
                    { value: 200, weight: 0 }
                ]
            ],
            expected: SchemaTypeError
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
            expected: undefined
        }
    ];

    describe('GenericWeightedList', (): void => {
        const genericSuccessScenarios: Scenario[] = [
            ...successScenarios,
            ...stringListSuccessScenarios,
            ...stringListFailureScenarios
        ];

        describe('assertGenericWeightedList', (): void => {
            testAssertMethod(
                WeightedListUtility.assertGenericWeightedList.bind(WeightedListUtility),
                genericSuccessScenarios,
                failureScenarios,
                'Input does not match schema requirements for generic WeightedList.'
            );
        });

        describe('isGenericWeightedList', (): void => {
            testIsMethod(
                WeightedListUtility.isGenericWeightedList.bind(WeightedListUtility),
                genericSuccessScenarios,
                failureScenarios
            );
        });
    });

    describe('WeightedList', (): void => {
        const typedSuccessScenarios: Scenario[] = [
            ...successScenarios,
            ...stringListSuccessScenarios
        ];

        const typedFailureScenarios: Scenario[] = [
            ...failureScenarios,
            ...stringListFailureScenarios
        ];

        describe('assertWeightedList', (): void => {
            function assertWeightedList(input: unknown, message?: string): void {
                WeightedListUtility.assertWeightedList(input, typeGuard, message);
            }

            testAssertMethod(
                assertWeightedList,
                typedSuccessScenarios,
                typedFailureScenarios,
                'Input does not match schema requirements for WeightedList.'
            );
        });

        describe('isWeightedList', (): void => {
            function isWeightedList(input: unknown): boolean {
                return WeightedListUtility.isWeightedList<string>(input, typeGuard);
            }

            testIsMethod(isWeightedList, typedSuccessScenarios, typedFailureScenarios);

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
        });
    });

    describe('Argument Errors', (): void => {
        const argumentFailureScenarios: Scenario[] = [
            {
                label: 'Non-function type guard inputs',
                inputs: nonFunctionInputs,
                expected: PrimitiveTypeError
            }
        ];

        describe.each(
            argumentFailureScenarios
        )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
            const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

            describe('Argument errors - assertWeightedList', (): void => {
                test.each(
                    testCases
                )('%# - Type guard input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect((): void => {
                        WeightedListUtility.assertWeightedList({}, testInput as ((value: unknown) => value is unknown));
                    }).toThrow(testExpected);
                });
            });

            describe('Argument errors - isWeightedList', (): void => {
                test.each(
                    testCases
                )('%# - Type guard input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect((): void => {
                        WeightedListUtility.isWeightedList({}, testInput as ((value: unknown) => value is unknown));
                    }).toThrow(testExpected);
                });
            });
        });
    });
});
