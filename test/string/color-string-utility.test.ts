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

import { ColorStringUtility } from '../../src';

import {
    hexColorFailureInputs,
    hexColorInputs,
    hexColorMixedCaseInputs,
    hexColorRGBALowercaseInputs,
    hexColorRGBANumberInputs,
    hexColorRGBAUppercaseInputs,
    hexColorRGBLowercaseInputs,
    hexColorRGBNumberInputs,
    hexColorRGBUppercaseInputs
} from '../utils/input/color-string-inputs';

import { emptyStringInputs, nonStringInputs } from '../utils/input/string-inputs';
import { Scenario, TestCase, buildTestCases } from '../utils/test-case/test-case';

describe('ColorStringUtility', (): void => {
    describe('new ColorStringUtility()', (): void => {
        describe('Runtime behavior guards', (): void => {
            test('Constructor should throw an error when instantiated at runtime', (): void => {
                const RuntimeConstructor = ColorStringUtility as unknown as new () => ColorStringUtility;
                expect((): ColorStringUtility => new RuntimeConstructor()).toThrow(Error);
            });
        });
    });

    describe('isHexColor', (): void => {
        const scenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: [
                    ...nonStringInputs
                ],
                expected: false
            },
            {
                label: 'Empty string inputs',
                inputs: [
                    ...emptyStringInputs
                ],
                expected: false
            },
            {
                label: 'Hex color string failure inputs',
                inputs: [
                    ...hexColorFailureInputs,
                    ...hexColorMixedCaseInputs
                ],
                expected: false
            },
            {
                label: 'Hex color inputs',
                inputs: [
                    ...hexColorInputs
                ],
                expected: true
            }
        ];

        describe.each(
            scenarios
        )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
            const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

            test.each(
                testCases
            )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                expect(ColorStringUtility.isHexColor(testInput)).toBe(testExpected);
            });
        });
    });

    describe('isHexColorRGB', (): void => {
        const scenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: [
                    ...nonStringInputs
                ],
                expected: false
            },
            {
                label: 'Empty string inputs',
                inputs: [
                    ...emptyStringInputs
                ],
                expected: false
            },
            {
                label: 'Hex color string failure inputs',
                inputs: [
                    ...hexColorFailureInputs,
                    ...hexColorMixedCaseInputs
                ],
                expected: false
            },
            {
                label: 'RGBA hex color inputs',
                inputs: [
                    ...hexColorRGBANumberInputs,
                    ...hexColorRGBALowercaseInputs,
                    ...hexColorRGBAUppercaseInputs
                ],
                expected: false
            },
            {
                label: 'RGB hex color inputs',
                inputs: [
                    ...hexColorRGBNumberInputs,
                    ...hexColorRGBLowercaseInputs,
                    ...hexColorRGBUppercaseInputs
                ],
                expected: true
            }
        ];

        describe.each(
            scenarios
        )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
            const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

            test.each(
                testCases
            )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                expect(ColorStringUtility.isHexColorRGB(testInput)).toBe(testExpected);
            });
        });
    });

    describe('isHexColorRGBA', (): void => {
        const scenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: [
                    ...nonStringInputs
                ],
                expected: false
            },
            {
                label: 'Empty string inputs',
                inputs: [
                    ...emptyStringInputs
                ],
                expected: false
            },
            {
                label: 'Hex color string failure inputs',
                inputs: [
                    ...hexColorFailureInputs,
                    ...hexColorMixedCaseInputs
                ],
                expected: false
            },
            {
                label: 'RGBA hex color inputs',
                inputs: [
                    ...hexColorRGBANumberInputs,
                    ...hexColorRGBALowercaseInputs,
                    ...hexColorRGBAUppercaseInputs
                ],
                expected: true
            },
            {
                label: 'RGB hex color inputs',
                inputs: [
                    ...hexColorRGBNumberInputs,
                    ...hexColorRGBLowercaseInputs,
                    ...hexColorRGBUppercaseInputs
                ],
                expected: false
            }
        ];

        describe.each(
            scenarios
        )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
            const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

            test.each(
                testCases
            )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                expect(ColorStringUtility.isHexColorRGBA(testInput)).toBe(testExpected);
            });
        });
    });
});
