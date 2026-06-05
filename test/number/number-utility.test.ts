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

import { NumberUtility } from '../../src';
import { Scenario, TestCase, buildTestCases } from '../utils/test-case/test-case';
import { negativeNumberInputs, nonNumberInputs, positiveNumberInputs, zeroInputs } from '../utils/input/number-inputs';

describe('NumberUtility', (): void => {
    describe('new NumberUtility()', (): void => {
        describe('Runtime behavior guards', (): void => {
            test('Constructor should throw an error when instantiated at runtime', (): void => {
                const RuntimeConstructor = NumberUtility as unknown as new () => NumberUtility;
                expect((): NumberUtility => new RuntimeConstructor()).toThrow(Error);
            });
        });
    });

    describe('isFiniteNumber', (): void => {
        const scenarios: Scenario[] = [
            {
                label: 'non-number inputs',
                inputs: [...nonNumberInputs],
                expected: false
            },
            {
                label: 'number inputs',
                inputs: [
                    ...positiveNumberInputs,
                    ...negativeNumberInputs,
                    ...zeroInputs
                ],
                expected: true
            },
            {
                label: 'NaN',
                inputs: [NaN],
                expected: false
            },
            {
                label: 'Infinity',
                inputs: [
                    Infinity,
                    -Infinity
                ],
                expected: false
            }
        ];

        describe.each(
            scenarios
        )('$label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
            const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

            test.each(
                testCases
            )('$input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                expect(NumberUtility.isFiniteNumber(testInput)).toBe(testExpected);
            });
        });
    });
});
