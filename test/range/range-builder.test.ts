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

import { PrimitiveTypeError, Range, RangeBuilder } from '../../src';

import { nonBooleanInputs } from '../utils/input/boolean-inputs';

import {
    negativeNumberInputs,
    nonFiniteNumberInputs,
    nonNumberInputs,
    positiveNumberInputs,
    zeroInputs
} from '../utils/input/number-inputs';

import { Scenario, TestCase, buildTestCases } from '../utils/test-case/test-case';

describe('RangeBuilder', (): void => {
    const finiteNumberScenarios: Scenario[] = [
        {
            label: 'Zero inputs',
            inputs: zeroInputs,
            expected: undefined
        },
        {
            label: 'Finite number inputs',
            inputs: [
                ...positiveNumberInputs.filter(input => input !== Number.MAX_VALUE),
                ...negativeNumberInputs.filter(input => input !== -Number.MAX_VALUE)
            ],
            expected: undefined
        }
    ];

    const nonFiniteNumberScenarios: Scenario[] = [
        {
            label: 'Non-number inputs',
            inputs: nonNumberInputs,
            expected: PrimitiveTypeError
        },
        {
            label: 'Non-finite number inputs',
            inputs: nonFiniteNumberInputs,
            expected: PrimitiveTypeError
        }
    ];

    const nonBooleanScenarios: Scenario[] = [
        {
            label: 'Non-boolean inputs',
            inputs: nonBooleanInputs.filter(input => input !== undefined),
            expected: PrimitiveTypeError
        }
    ];

    const booleanScenarios: Scenario[] = [
        {
            label: 'Boolean inputs',
            inputs: [true, false],
            expected: undefined
        },
        {
            label: 'Undefined input',
            inputs: [undefined],
            expected: undefined
        }
    ];

    describe('buildFrom', (): void => {
        test.todo('buildFrom');
    });

    describe('setMin', (): void => {
        describe('setMin should set the minimum value of the range', (): void => {
            describe.each(
                finiteNumberScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should build a valid Range', ({ input: testInput }: TestCase): void => {
                    const builder: RangeBuilder = new RangeBuilder();
                    builder.setMin(testInput as number);
                    const range: Range = builder.build();
                    expect(range.min).toBe(testInput);
                });
            });
        });

        describe('Argument errors', (): void => {
            describe.each(
                nonFiniteNumberScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    const builder: RangeBuilder = new RangeBuilder();
                    expect((): void => {
                        builder.setMin(testInput as number);
                    }).toThrow(testExpected);
                });
            });
        });
    });

    describe('setMax', (): void => {
        describe('setMax should set the maximum value of the range', (): void => {
            describe.each(
                finiteNumberScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should build a valid Range', ({ input: testInput }: TestCase): void => {
                    const builder: RangeBuilder = new RangeBuilder();
                    builder.setMax(testInput as number);
                    const range: Range = builder.build();
                    expect(range.max).toBe(testInput);
                });
            });
        });

        describe('Argument errors', (): void => {
            describe.each(
                nonFiniteNumberScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    const builder: RangeBuilder = new RangeBuilder();
                    expect((): void => {
                        builder.setMax(testInput as number);
                    }).toThrow(testExpected);
                });
            });
        });
    });

    describe('setMinInclusive', (): void => {
        describe('setMinInclusive should set the isMinInclusive value of the range', (): void => {
            describe.each(
                booleanScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should build a valid Range', ({ input: testInput }: TestCase): void => {
                    const builder: RangeBuilder = new RangeBuilder();
                    builder.setMinInclusive(testInput as boolean);
                    const range: Range = builder.build();
                    expect(range.isMinInclusive).toBe(testInput);
                });
            });
        });

        describe('Argument errors', (): void => {
            describe.each(
                nonBooleanScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    const builder: RangeBuilder = new RangeBuilder();
                    expect((): void => {
                        builder.setMinInclusive(testInput as boolean);
                    }).toThrow(testExpected);
                });
            });
        });
    });

    describe('setMaxInclusive', (): void => {
        describe('setMaxInclusive should set the isMaxInclusive value of the range', (): void => {
            describe.each(
                booleanScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should build a valid Range', ({ input: testInput }: TestCase): void => {
                    const builder: RangeBuilder = new RangeBuilder();
                    builder.setMaxInclusive(testInput as boolean);
                    const range: Range = builder.build();
                    expect(range.isMaxInclusive).toBe(testInput);
                });
            });
        });

        describe('Argument errors', (): void => {
            describe.each(
                nonBooleanScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    const builder: RangeBuilder = new RangeBuilder();
                    expect((): void => {
                        builder.setMaxInclusive(testInput as boolean);
                    }).toThrow(testExpected);
                });
            });
        });
    });
});
