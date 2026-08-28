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
    WeightedElement,
    WeightedElementUtility
} from '../../../src';

import { testAssertMethod } from '../../utils/assert/assert-tests';
import { nonFunctionInputs } from '../../utils/input/function-inputs';
import { nonFiniteNumberInputs, nonNumberInputs } from '../../utils/input/number-inputs';
import { nonObjectInputs } from '../../utils/input/object-inputs';
import { testStaticClassConstructor } from '../../utils/static/static-class-tests';
import { Scenario, TestCase, buildTestCases } from '../../utils/test-case/test-case';

describe('WeightedElementUtility', (): void => {
    testStaticClassConstructor('WeightedElementUtility', WeightedElementUtility as unknown as new () => unknown, StaticInstanceError);

    const failureScenarios: Scenario[] = [
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
            expected: true
        }
    ];

    const assertFailureScenarios: Scenario[] = failureScenarios.map((scenario: Scenario): Scenario => {
        return {
            ...scenario,
            expected: SchemaTypeError
        };
    });

    describe('assertGenericWeightedElement', (): void => {
        const assertSuccessScenarios: Scenario[] = successScenarios.map((scenario: Scenario): Scenario => {
            return {
                ...scenario,
                expected: undefined
            };
        });

        testAssertMethod(
            WeightedElementUtility.assertGenericWeightedElement.bind(WeightedElementUtility),
            assertSuccessScenarios,
            assertFailureScenarios,
            (): string => {
                return 'Input does not match schema requirements for generic WeightedElement.';
            }
        );
    });

    describe('assertWeightedElement', (): void => {
        const typeGuard: (input: unknown) => input is string = (input: unknown): input is string => {
            return StringUtility.isSingleLineTrimmedString(input);
        };

        function assertWeightedElement(input: unknown, message?: string): void {
            WeightedElementUtility.assertWeightedElement(input, typeGuard, message);
        }

        testAssertMethod(
            assertWeightedElement,
            [
                {
                    label: 'Valid weighted element objects',
                    inputs: [
                        { value: 'hello', weight: 0 },
                        { value: 'hi', weight: 0.5 },
                        { value: 'hey', weight: 1 },
                        { value: 'single line', weight: 0.5 }
                    ],
                    expected: true
                }
            ],
            [
                ...assertFailureScenarios,
                {
                    label: 'Valid weighted elements with incorrect value type',
                    inputs: [
                        { value: 'multi\nline', weight: 1 },
                        { value: 100, weight: 1 }
                    ],
                    expected: SchemaTypeError
                }
            ],
            (): string => {
                return 'Input does not match schema requirements for WeightedElement.';
            }
        );
    });

    describe('isGenericWeightedElement', (): void => {
        describe('Should correctly identify WeightedElement objects', (): void => {
            describe.each([
                ...failureScenarios,
                ...successScenarios
            ])('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
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
                expectTypeOf(element1.value.toLowerCase()).toBeString();
            } else {
                fail('WeightedElement type narrowing failed');
            }
        });

        describe('Should return false for invalid weighted elements', (): void => {
            describe.each(
                failureScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(WeightedElementUtility.isWeightedElement(testInput, typeGuard)).toBe(testExpected);
                });
            });
        });
    });

    describe('Input validation', (): void => {
        describe('Function type guard input validation', (): void => {
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

                describe('isWeightedElement', (): void => {
                    test.each(
                        testCases
                    )('%# - Type guard input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                        expect((): void => {
                            WeightedElementUtility.isWeightedElement({}, testInput as ((value: unknown) => value is unknown));
                        }).toThrow(testExpected);
                    });
                });

                describe('assertWeightedElement', (): void => {
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
    });
});
