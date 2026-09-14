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
    WeightedElementUtility
} from '../../../src';

import { testAssertMethod, testIsMethod } from '../../utils/assert/assert-tests';
import { nonFunctionInputs } from '../../utils/input/function-inputs';
import { nonFiniteNumberInputs, nonNumberInputs } from '../../utils/input/number-inputs';
import { nonObjectInputs } from '../../utils/input/object-inputs';
import { testStaticClassConstructor } from '../../utils/static/static-class-tests';
import { Scenario, TestCase, buildTestCases } from '../../utils/test-case/test-case';

describe('WeightedElementUtility', (): void => {
    testStaticClassConstructor('WeightedElementUtility', WeightedElementUtility as unknown as new () => unknown, StaticInstanceError);

    const typeGuard: (input: unknown) => input is string = (input: unknown): input is string => {
        return StringUtility.isSingleLineTrimmedString(input);
    };

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
                [1, 2, 3],
                ['a', 'b', 'c']
            ],
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs missing value property',
            inputs: [
                { weight: 0 },
                { weight: 0.5 },
                { weight: 1 }
            ],
            expected: SchemaTypeError
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
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with non-numeric weight property',
            inputs: nonNumberInputs.map((input: unknown): { value: string; weight: unknown; } => {
                return { value: 'test', weight: input };
            }),
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with non-finite weight property',
            inputs: nonFiniteNumberInputs.map((input: number): { value: string; weight: number; } => {
                return { value: 'test', weight: input };
            }),
            expected: SchemaTypeError
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
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with additional properties',
            inputs: [
                { value: 'hello', weight: 0, name: 'bob' },
                { value: 'hello', weight: 0.5, age: 42 },
                { value: 'hello', weight: 1, day: 7 }
            ],
            expected: SchemaTypeError
        }
    ];

    const successScenarios: Scenario[] = [
        {
            label: 'Valid weighted element objects',
            inputs: [
                { value: 'hello', weight: 0 },
                { value: 'hi', weight: 0.5 },
                { value: 'hey', weight: 1 },
                { value: 100, weight: 0.5 },
                { value: { key: 'value' }, weight: 1 }
            ],
            expected: undefined
        }
    ];

    describe('GenericWeightedElement', (): void => {
        describe('assertGenericWeightedElement', (): void => {
            testAssertMethod(
                WeightedElementUtility.assertGenericWeightedElement.bind(WeightedElementUtility),
                successScenarios,
                failureScenarios,
                'Input does not match schema requirements for generic WeightedElement.'
            );
        });

        describe('isGenericWeightedElement', (): void => {
            testIsMethod(
                WeightedElementUtility.isGenericWeightedElement.bind(WeightedElementUtility),
                successScenarios,
                failureScenarios
            );
        });
    });

    describe('WeightedElement', (): void => {
        const typedSuccessScenarios: Scenario[] = [
            {
                label: 'Valid weighted element objects',
                inputs: [
                    { value: 'hello', weight: 0 },
                    { value: 'hi', weight: 0.5 },
                    { value: 'hey', weight: 1 },
                    { value: 'single line', weight: 0.5 }
                ],
                expected: undefined
            }
        ];

        const typedFailureScenarios: Scenario[] = [
            ...failureScenarios,
            {
                label: 'Valid weighted elements with incorrect value type',
                inputs: [
                    { value: 'multi\nline', weight: 1 },
                    { value: 100, weight: 1 }
                ],
                expected: SchemaTypeError
            }
        ];

        describe('assertWeightedElement', (): void => {
            function assertWeightedElement(input: unknown, message?: string): void {
                WeightedElementUtility.assertWeightedElement(input, typeGuard, message);
            }

            testAssertMethod(
                assertWeightedElement,
                typedSuccessScenarios,
                typedFailureScenarios,
                'Input does not match schema requirements for WeightedElement.'
            );
        });

        describe('isWeightedElement', (): void => {
            function isWeightedElement(input: unknown): boolean {
                return WeightedElementUtility.isWeightedElement<string>(input, typeGuard);
            }

            testIsMethod(isWeightedElement, typedSuccessScenarios, typedFailureScenarios);

            test('Should successfully narrow value property based on the given type guard', (): void => {
                const element: unknown = { value: 'single line', weight: 1 };

                if (WeightedElementUtility.isWeightedElement<string>(element, typeGuard)) {
                    expect(element.value).toBeTruthy();
                    expectTypeOf(element.value).toBeString();
                    expectTypeOf(element.value.toLowerCase()).toBeString();
                } else {
                    fail('WeightedElement type narrowing failed');
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

            describe('Argument errors - assertWeightedElement', (): void => {
                test.each(
                    testCases
                )('%# - Type guard input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect((): void => {
                        WeightedElementUtility.assertWeightedElement({}, testInput as ((value: unknown) => value is unknown));
                    }).toThrow(testExpected);
                });
            });

            describe('Argument errors - isWeightedElement', (): void => {
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
});
