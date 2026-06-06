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

import { StringUtility } from '../../src';
import { Scenario, TestCase, buildTestCases } from '../utils/test-case/test-case';
import {
    emptyStringInputs,
    nonEmptyStringInputs,
    nonStringInputs,
    numberAndSymbolTrimmedInputs,
    singleLineLowercaseTrimmedFailureInputs,
    singleLineLowercaseTrimmedInputs,
    singleLineMixedCaseTrimmedInputs,
    singleLineUppercaseTrimmedInputs
} from '../utils/input/string-inputs';

describe('StringUtility', (): void => {
    describe('new StringUtility()', (): void => {
        describe('Runtime behavior guards', (): void => {
            test('Constructor should throw an error when instantiated at runtime', (): void => {
                const RuntimeConstructor = StringUtility as unknown as new () => StringUtility;
                expect((): StringUtility => new RuntimeConstructor()).toThrow(Error);
            });
        });
    });

    describe('isString', (): void => {
        const scenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: [...nonStringInputs],
                expected: false
            },
            {
                label: 'String inputs',
                inputs: [...emptyStringInputs, ...nonEmptyStringInputs],
                expected: true
            }
        ];

        describe.each(
            scenarios
        )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
            const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

            test.each(
                testCases
            )('%# - $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                expect(StringUtility.isString(testInput)).toBe(testExpected);
            });
        });
    });

    describe('isSingleLineLowercaseTrimmedString', (): void => {
        const scenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: [...nonStringInputs],
                expected: false
            },
            {
                label: 'Empty string inputs',
                inputs: [...emptyStringInputs],
                expected: false
            },
            {
                label: 'Incorrect case inputs',
                inputs: [
                    ...singleLineUppercaseTrimmedInputs,
                    ...singleLineMixedCaseTrimmedInputs
                ],
                expected: false
            },
            {
                label: 'Whitespace failure inputs',
                inputs: [...singleLineLowercaseTrimmedFailureInputs],
                expected: false
            },
            {
                label: 'Single line lowercase trimmed inputs',
                inputs: [...singleLineLowercaseTrimmedInputs],
                expected: true
            },
            {
                label: 'Number and symbol trimmed inputs',
                inputs: [...numberAndSymbolTrimmedInputs],
                expected: true
            }
        ];

        describe.each(
            scenarios
        )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
            const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

            test.each(
                testCases
            )('%# - $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                expect(StringUtility.isSingleLineLowercaseTrimmedString(testInput)).toBe(testExpected);
            });
        });
    });
});
