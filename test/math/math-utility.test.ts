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

import { describe, test, expect } from 'vitest';

import { MathUtility, PrimitiveTypeError, StaticInstanceError, ValueRangeError } from '../../src';

import {
    negativeSafeIntegerInputs,
    nonFiniteNumberInputs,
    nonNumberInputs,
    safeFloatInputs,
    unsafeNumberInputs,
    zeroInputs
} from '../utils/input/number-inputs';

import { testStaticClassConstructor } from '../utils/static/static-class-tests';
import { Scenario, TestCase, buildTestCases } from '../utils/test-case/test-case';

describe('MathUtility', (): void => {
    testStaticClassConstructor('MathUtility', MathUtility as unknown as new () => unknown, StaticInstanceError);

    describe('constrain', (): void => {
        describe('constrain should return the proper value for number arguments within the safe integer range', (): void => {
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
                { value: 5, min: Number.MIN_SAFE_INTEGER, max: 10, expected: 5 },
                { value: 5, min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER, expected: 5 },
                { value: 1.12345678912343, min: 1.12345678912344, max: 2.12345678912345, expected: 1.12345678912344 },
                { value: 2.12345678912346, min: 1.12345678912344, max: 2.12345678912345, expected: 2.12345678912345 },
                { value: 1.12345678912344, min: 1.12345678912344, max: 2.12345678912345, expected: 1.12345678912344 },
                { value: 2.12345678912345, min: 1.12345678912344, max: 2.12345678912345, expected: 2.12345678912345 }
            ])('%# - constrain($value, $min, $max) should return $expected', ({ value, min, max, expected }: { value: number; min: number; max: number; expected: number; }): void => {
                expect(MathUtility.constrain(value, min, max)).toBe(expected);
            });
        });

        describe('Argument errors', (): void => {
            const defaultValue: number = 5;
            const defaultMin: number = Number.MIN_SAFE_INTEGER;
            const defaultMax: number = Number.MAX_SAFE_INTEGER;

            const argumentFailureScenarios: Scenario[] = [
                {
                    label: 'Invalid value argument',
                    inputs: [
                        ...nonNumberInputs,
                        ...nonFiniteNumberInputs,
                        ...unsafeNumberInputs
                    ].map((input: unknown): { value: unknown; min: number; max: number; } => {
                        return {
                            value: input,
                            min: defaultMin,
                            max: defaultMax
                        };
                    }),
                    expected: PrimitiveTypeError
                },
                {
                    label: 'Invalid min argument',
                    inputs: [
                        ...nonNumberInputs,
                        ...nonFiniteNumberInputs,
                        ...unsafeNumberInputs
                    ].map((input: unknown): { value: number; min: unknown; max: number; } => {
                        return {
                            value: defaultValue,
                            min: input,
                            max: defaultMax
                        };
                    }),
                    expected: PrimitiveTypeError
                },
                {
                    label: 'Invalid max argument',
                    inputs: [
                        ...nonNumberInputs,
                        ...nonFiniteNumberInputs,
                        ...unsafeNumberInputs
                    ].map((input: unknown): { value: number; min: number; max: unknown; } => {
                        return {
                            value: defaultValue,
                            min: defaultMin,
                            max: input
                        };
                    }),
                    expected: PrimitiveTypeError
                },
                {
                    label: 'Invalid min/max range',
                    inputs: [
                        { value: defaultValue, min: defaultMax, max: defaultMin },
                        { value: defaultValue, min: defaultMax, max: 0 },
                        { value: defaultValue, min: 0, max: defaultMin },
                        { value: defaultValue, min: 0, max: -1 },
                        { value: defaultValue, min: 1, max: -1 },
                        { value: defaultValue, min: 1, max: 0 },
                        { value: defaultValue, min: 50, max: 10 },
                        { value: defaultValue, min: -10, max: -50 },
                        { value: defaultValue, min: 50.5, max: 10.5 },
                        { value: defaultValue, min: -10.5, max: -50.5 },
                        { value: defaultValue, min: 50, max: 10.5 },
                        { value: defaultValue, min: -10, max: -50.5 },
                        { value: defaultValue, min: 50.5, max: 10 },
                        { value: defaultValue, min: -10.5, max: -50 },
                        { value: defaultValue, min: 1.12345678912345, max: 1.12345678912344 },
                        { value: defaultValue, min: -1.12345678912344, max: -1.12345678912345 }
                    ],
                    expected: ValueRangeError
                }
            ];

            describe.each(
                argumentFailureScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    const args: { value: unknown; min: unknown; max: unknown; } = testInput as { value: unknown; min: unknown; max: unknown; };

                    expect((): void => {
                        MathUtility.constrain(args.value as number, args.min as number, args.max as number);
                    }).toThrow(testExpected);
                });
            });
        });
    });

    describe('toFlatIndex', (): void => {
        describe('toFlatIndex should return the proper index for positive arguments', (): void => {
            test.each([
                { x: 0, y: 0, columns: 1, rows: 1, expected: 0 },
                { x: 0, y: 0, columns: 5, rows: 5, expected: 0 },
                { x: 0, y: 0, columns: 5, rows: 10, expected: 0 },
                { x: 0, y: 0, columns: 10, rows: 5, expected: 0 },
                { x: 4, y: 4, columns: 5, rows: 5, expected: ((5 * 5) - 1) },
                { x: 4, y: 9, columns: 5, rows: 10, expected: ((5 * 10) - 1) },
                { x: 9, y: 4, columns: 10, rows: 5, expected: ((10 * 5) - 1) },
                { x: 4, y: 0, columns: 5, rows: 1, expected: 4 },
                { x: 0, y: 4, columns: 1, rows: 5, expected: 4 },
                { x: Number.MAX_SAFE_INTEGER - 1, y: 0, columns: Number.MAX_SAFE_INTEGER, rows: 1, expected: Number.MAX_SAFE_INTEGER - 1 },
                { x: 0, y: Number.MAX_SAFE_INTEGER - 1, columns: 1, rows: Number.MAX_SAFE_INTEGER, expected: Number.MAX_SAFE_INTEGER - 1 }
            ])('%# - toFlatIndex($x, $y, $columns, $rows) should return $expected', ({ x, y, columns, rows, expected }: { x: number; y: number; columns: number; rows: number; expected: number; }): void => {
                expect(MathUtility.toFlatIndex(x, y, columns, rows)).toBe(expected);
            });
        });

        describe('Argument errors', (): void => {
            const defaultX: number = 0;
            const defaultY: number = 0;
            const defaultColumns: number = 1;
            const defaultRows: number = 1;

            const argumentFailureScenarios: Scenario[] = [
                {
                    label: 'Invalid x argument',
                    inputs: [
                        ...nonNumberInputs,
                        ...nonFiniteNumberInputs,
                        ...unsafeNumberInputs,
                        ...safeFloatInputs,
                        ...negativeSafeIntegerInputs
                    ].map((input: unknown): { x: unknown; y: number; columns: number; rows: number; } => {
                        return {
                            x: input,
                            y: defaultY,
                            columns: defaultColumns,
                            rows: defaultRows
                        };
                    }),
                    expected: PrimitiveTypeError
                },
                {
                    label: 'Invalid y argument',
                    inputs: [
                        ...nonNumberInputs,
                        ...nonFiniteNumberInputs,
                        ...unsafeNumberInputs,
                        ...safeFloatInputs,
                        ...negativeSafeIntegerInputs
                    ].map((input: unknown): { x: number; y: unknown; columns: number; rows: number; } => {
                        return {
                            x: defaultX,
                            y: input,
                            columns: defaultColumns,
                            rows: defaultRows
                        };
                    }),
                    expected: PrimitiveTypeError
                },
                {
                    label: 'Invalid columns argument',
                    inputs: [
                        ...nonNumberInputs,
                        ...nonFiniteNumberInputs,
                        ...unsafeNumberInputs,
                        ...safeFloatInputs,
                        ...negativeSafeIntegerInputs,
                        ...zeroInputs
                    ].map((input: unknown): { x: number; y: number; columns: unknown; rows: number; } => {
                        return {
                            x: defaultX,
                            y: defaultY,
                            columns: input,
                            rows: defaultRows
                        };
                    }),
                    expected: PrimitiveTypeError
                },
                {
                    label: 'Invalid rows argument',
                    inputs: [
                        ...nonNumberInputs,
                        ...nonFiniteNumberInputs,
                        ...unsafeNumberInputs,
                        ...safeFloatInputs,
                        ...negativeSafeIntegerInputs,
                        ...zeroInputs
                    ].map((input: unknown): { x: number; y: number; columns: number; rows: unknown; } => {
                        return {
                            x: defaultX,
                            y: defaultY,
                            columns: defaultColumns,
                            rows: input
                        };
                    }),
                    expected: PrimitiveTypeError
                },
                {
                    label: 'Invalid coordinates for the given columns and rows',
                    inputs: [
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
                    ],
                    expected: ValueRangeError
                },
                {
                    label: 'Grid size larger than the maximum safe integer',
                    inputs: [
                        { x: 0, y: 0, columns: Number.MAX_SAFE_INTEGER, rows: 2 },
                        { x: 0, y: 0, columns: 2, rows: Number.MAX_SAFE_INTEGER },
                        { x: 0, y: 0, columns: Math.ceil(Math.sqrt(Number.MAX_SAFE_INTEGER)), rows: Math.ceil(Math.sqrt(Number.MAX_SAFE_INTEGER)) }
                    ],
                    expected: ValueRangeError
                }
            ];

            describe.each(
                argumentFailureScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    const args: { x: unknown; y: unknown; columns: unknown; rows: unknown; } = testInput as { x: unknown; y: unknown; columns: unknown; rows: unknown; };

                    expect((): void => {
                        MathUtility.toFlatIndex(args.x as number, args.y as number, args.columns as number, args.rows as number);
                    }).toThrow(testExpected);
                });
            });
        });
    });
});
