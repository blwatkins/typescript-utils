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

import { MathUtility } from '../../src';
import { buildTestCases, Scenario, TestCase } from '../utils/test-case/test-case';
import { nonFiniteNumberInputs, nonNumberInputs } from '../utils/input/number-inputs';

describe('MathUtility', (): void => {
    describe('new MathUtility()', (): void => {
        describe('Runtime behavior guards', (): void => {
            test('Constructor should throw an error when instantiated at runtime', (): void => {
                const RuntimeConstructor = MathUtility as unknown as new () => MathUtility;
                expect((): MathUtility => new RuntimeConstructor()).toThrow(Error);
            });
        });
    });

    describe('constrain', (): void => {
        describe('constrain should return the proper value for finite number arguments', (): void => {
            test.each([
                { value: 5, min: 0, max: 10, expected: 5 },
                { value: 2, min: 1, max: 3, expected: 2 },
                { value: 0, min: -5, max: 5, expected: 0 },
                { value: -2, min: -3, max: -1, expected: -2 },
                { value: -2, min: -3, max: 0, expected: -2 },
                { value: 5.5, min: 0.5, max: 10.5, expected: 5.5 },
                { value: 2.5, min: 1.5, max: 3.5, expected: 2.5 },
                { value: 0.5, min: -5.5, max: 5.5, expected: 0.5 },
                { value: -2.5, min: -3.5, max: -1.5, expected: -2.5 },
                { value: -2.5, min: -3.5, max: -0.5, expected: -2.5 },
                { value: 100, min: 0, max: 10, expected: 10 },
                { value: -100, min: 0, max: 10, expected: 0 },
                { value: 1000, min: 100, max: 200, expected: 200 },
                { value: 50, min: 100, max: 200, expected: 100 },
                { value: -100, min: -300, max: -200, expected: -200 },
                { value: -400, min: -300, max: -200, expected: -300 },
                { value: 5, min: 1, max: 1, expected: 1 },
                { value: 0, min: 1, max: 1, expected: 1 },
                { value: Number.MAX_SAFE_INTEGER, min: 5, max: 500, expected: 500 },
                { value: Number.MIN_SAFE_INTEGER, min: 5, max: 500, expected: 5 },
                { value: 5, min: 0, max: Number.MAX_SAFE_INTEGER, expected: 5 },
                { value: 5, min: Number.MIN_SAFE_INTEGER, max: 10, expected: 5 }
            ])('%# - constrain($value, $min, $max) should return $expected', ({ value, min, max, expected }): void => {
                expect(MathUtility.constrain(value, min, max)).toBe(expected);
            });
        });

        describe('Input validation', (): void => {
            describe('All parameters must be finite numbers', (): void => {
                const scenarios: Scenario[] = [
                    {
                        label: 'Non-number inputs',
                        inputs: [...nonNumberInputs],
                        expected: TypeError
                    },
                    {
                        label: 'Non-finite number inputs',
                        inputs: [...nonFiniteNumberInputs],
                        expected: TypeError
                    }
                ];

                describe.each(
                    scenarios
                )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                    const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);
                    const defaultValue: number = 5;
                    const defaultMin: number = 0;
                    const defaultMax: number = 10;

                    describe('value parameter', (): void => {
                        test.each(
                            testCases
                        )(`%# - constrain($input, ${defaultMin}, ${defaultMax}) should throw $expected`, ({ input: testInput, expected: testExpected }: TestCase): void => {
                            expect((): void => {
                                MathUtility.constrain(testInput as number, defaultMin, defaultMax);
                            }).toThrow(testExpected);
                        });
                    });

                    describe('min parameter', (): void => {
                        test.each(
                            testCases
                        )(`%# - constrain(${defaultValue}, $input, ${defaultMax}) should throw $expected`, ({ input: testInput, expected: testExpected }: TestCase): void => {
                            expect((): void => {
                                MathUtility.constrain(defaultValue, testInput as number, defaultMax);
                            }).toThrow(testExpected);
                        });
                    });

                    describe('max parameter', (): void => {
                        test.each(
                            testCases
                        )(`%# - constrain(${defaultValue}, ${defaultMin}, $input) should throw $expected`, ({ input: testInput, expected: testExpected }: TestCase): void => {
                            expect((): void => {
                                MathUtility.constrain(defaultValue, defaultMin, testInput as number);
                            }).toThrow(testExpected);
                        });
                    });
                });
            });

            describe('Minimum constraint must be less than or equal to maximum constraint', (): void => {
                test.todo('min <= max');
            });
        });
    });

    describe('toFlatIndex', (): void => {
        test.todo('toFlatIndex unit tests');
    });
});
