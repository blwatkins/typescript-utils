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

import { SeededRandomNumberGenerator } from '../../../src';

import { nonArrayInputs } from '../../utils/input/array-inputs';
import { Scenario, TestCase, buildTestCases } from '../../utils/test-case/test-case';

describe('SeededRandomNumberGenerator', () => {
    describe('new SeededRandomNumberGenerator()', () => {
        describe('input validation', (): void => {
            const scenarios: Scenario[] = [
                {
                    label: 'non-array inputs',
                    inputs: [
                        ...nonArrayInputs
                    ],
                    expected: TypeError
                },
                {
                    label: 'array inputs with incorrect length',
                    inputs: [
                        [],
                        [1],
                        [1, 2],
                        [1, 2, 3],
                        [1, 2, 3, 4, 5]
                    ],
                    expected: TypeError
                },
                {
                    label: 'array inputs with non-integer elements',
                    inputs: [
                        [1.5, 0, 0, 0],
                        [0, 1.5, 0, 0],
                        [0, 0, 1.5, 0],
                        [0, 0, 0, 1.5]
                    ],
                    expected: RangeError
                },
                {
                    label: 'array inputs with negative elements',
                    inputs: [
                        [-1, 0, 0, 0],
                        [0, -1, 0, 0],
                        [0, 0, -1, 0],
                        [0, 0, 0, -1]
                    ],
                    expected: RangeError
                },
                {
                    label: 'array input with zero state (all elements are 0)',
                    inputs: [[0, 0, 0, 0]],
                    expected: RangeError
                }
            ];

            describe.each(
                scenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - invalid state $input should throw an error $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect((): SeededRandomNumberGenerator => new SeededRandomNumberGenerator(testInput as [number, number, number, number])).toThrow(testExpected);
                });
            });
        });
    });
});
