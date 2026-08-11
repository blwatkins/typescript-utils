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

import { describe, test, expect } from 'vitest';

import { StaticInstanceError, WeightedListUtility } from '../../../src';

import { testStaticClassConstructor } from '../../utils/static/static-class-tests';
import { nonArrayInputs } from '../../utils/input/array-inputs';
import { buildTestCases, Scenario, TestCase } from '../../utils/test-case/test-case';

describe('WeightedListUtility', (): void => {
    testStaticClassConstructor('WeightedElementUtility', WeightedListUtility as unknown as new () => unknown, StaticInstanceError);

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
                    [ 5, 6, 7 ]
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
});
