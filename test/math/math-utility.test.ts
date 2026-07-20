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
import { floatInputs, negativeIntegerInputs, nonFiniteNumberInputs, nonNumberInputs } from '../utils/input/number-inputs';

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
            ])('%# - constrain($value, $min, $max) should return $expected', ({ value, min, max, expected }: { value: number; min: number; max: number; expected: number; }): void => {
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
                const defaultValue: number = 0;

                test.each([
                    { min: 0, max: -1 },
                    { min: 1, max: -1 },
                    { min: 1, max: 0 }
                ])(`%# - contrain(${defaultValue}, $min, $max) should throw RangeError`, ({ min, max }: { min: number; max: number; }): void => {
                    expect((): void => {
                        MathUtility.constrain(defaultValue, min, max);
                    }).toThrow(RangeError);
                });
            });
        });
    });

    describe('toFlatIndex', (): void => {
        describe('toFlatIndex should return the proper index for positive arguments', (): void => {
            test.todo('toFlatIndex unit tests');
            // test.each([
            //
            // ])('', (): void => {
            //
            // });
        });

        describe('Input validation', (): void => {
            describe('All parameters must be positive integers', (): void => {
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
                    },
                    {
                        label: 'Float number inputs',
                        inputs: [...floatInputs],
                        expected: TypeError
                    },
                    {
                        label: 'Negative integer inputs',
                        inputs: [...negativeIntegerInputs],
                        expected: TypeError
                    }
                ];

                describe.each(
                    scenarios
                )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                    const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);
                    const defaultX: number = 0;
                    const defaultY: number = 0;
                    const defaultColumns: number = 1;
                    const defaultRows: number = 1;

                    describe('x parameter', (): void => {
                        test.each(
                            testCases
                        )(`%# - toFlatIndex($input, ${defaultY}, ${defaultColumns}, ${defaultRows}) should throw $expected`, ({ input: testInput, expected: testExpected }: TestCase): void => {
                            expect((): void => {
                                MathUtility.toFlatIndex(testInput as number, defaultY, defaultColumns, defaultRows);
                            }).toThrow(testExpected);
                        });
                    });

                    describe('y parameter', (): void => {
                        test.each(
                            testCases
                        )(`%# - toFlatIndex(${defaultX}, $input, ${defaultColumns}, ${defaultRows}) should throw $expected`, ({ input: testInput, expected: testExpected }: TestCase): void => {
                            expect((): void => {
                                MathUtility.toFlatIndex(defaultX, testInput as number, defaultColumns, defaultRows);
                            }).toThrow(testExpected);
                        });
                    });

                    describe('columns parameter', (): void => {
                        test.each(
                            testCases
                        )(`%# - toFlatIndex(${defaultX}, ${defaultY}, $input, ${defaultRows}) should throw $expected`, ({ input: testInput, expected: testExpected }: TestCase): void => {
                            expect((): void => {
                                MathUtility.toFlatIndex(defaultX, defaultY, testInput as number, defaultRows);
                            }).toThrow(testExpected);
                        });
                    });

                    describe('rows parameter', (): void => {
                        test.each(
                            testCases
                        )(`%# - toFlatIndex(${defaultX}, ${defaultY}, ${defaultColumns}, $input) should throw $expected`, ({ input: testInput, expected: testExpected }: TestCase): void => {
                            expect((): void => {
                                MathUtility.toFlatIndex(defaultX, defaultY, defaultColumns, testInput as number);
                            }).toThrow(testExpected);
                        });
                    });

                    test('columns and rows parameters cannot be zero', (): void => {
                        expect((): void => {
                            MathUtility.toFlatIndex(defaultX, defaultY, 0, defaultRows);
                        }).toThrow(TypeError);

                        expect((): void => {
                            MathUtility.toFlatIndex(defaultX, defaultY, defaultColumns, 0);
                        }).toThrow(TypeError);
                    });
                });
            });

            describe('toFlatIndex should not accept coordinates outside the valid index range for the given columns and rows', (): void => {
                test.each([
                    { x: 1, y: 0, columns: 1, rows: 1 },
                    { x: 0, y: 1, columns: 1, rows: 1 },
                    { x: 1, y: 1, columns: 1, rows: 1 },
                    { x: 2, y: 0, columns: 1, rows: 1 },
                    { x: 0, y: 2, columns: 1, rows: 1 },
                    { x: 2, y: 2, columns: 1, rows: 1 },
                    { x: 5, y: 0, columns: 5, rows: 1 },
                    { x: 0, y: 5, columns: 1, rows: 5 },
                    { x: 5, y: 5, columns: 5, rows: 5 },
                    { x: 5, y: 10, columns: 10, rows: 5 },
                    { x: 4, y: 9, columns: 10, rows: 5 },
                    { x: 10, y: 5, columns: 5, rows: 10 },
                    { x: 9, y: 4, columns: 5, rows: 10 }
                ])('%# - toFlatIndex($x, $y, $columns, $rows) should throw RangeError', ({ x, y, columns, rows }: { x: number; y: number; columns: number; rows: number; }): void => {
                    expect((): void => {
                        MathUtility.toFlatIndex(x ,y , columns, rows);
                    }).toThrow(RangeError);
                });
            });
        });
    });
});
