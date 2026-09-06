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

import { PrimitiveTypeError, SeedVersion, SeedVersions, ValueRangeError } from '../../../src';

import {
    floatInputs,
    negativeIntegerInputs,
    nonNumberInputs
} from '../../utils/input/number-inputs';

import { testStaticClassConstructor } from '../../utils/static/static-class-tests';
import { Scenario, TestCase, buildTestCases } from '../../utils/test-case/test-case';

describe('SeedVersions', () => {
    testStaticClassConstructor('SeedVersions', SeedVersions as unknown as new () => unknown, Error);

    /**
     * @remarks Once a seed version has been published, it should NEVER be changed or updated.
     * The order of seed versions should NEVER be changed.
     * New seed versions can only be added to the end of the array.
     * Each element in the offsets array should be unique.
     * This array is meant to ensure that the published SeedVersion data NEVER changes.
     */
    const expectedSeedVersions: readonly SeedVersion[] = [
        {
            offsets: Object.freeze([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a])
        },
        {
            offsets: Object.freeze([0x811c9dc5, 0x34f9a34, 0xa1b2c3d4, 0x5e6f7a8b])
        }
    ];

    function buildValidIndexes() {
        const indexes: number[] = [];

        for (let i = 0; i < expectedSeedVersions.length; i++) {
            indexes.push(i);
        }

        return indexes;
    }

    describe('size', () => {
        test(`Size should be ${expectedSeedVersions.length}`, () => {
            expect(SeedVersions.size).toBe(expectedSeedVersions.length);
        });
    });

    describe('isValidIndex', () => {
        const scenarios: Scenario[] = [
            {
                label: 'Non-number inputs',
                inputs: nonNumberInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Float and negative integer inputs',
                inputs: [
                    ...floatInputs,
                    ...negativeIntegerInputs
                ],
                expected: PrimitiveTypeError
            },
            {
                label: 'Out of bounds number indexes',
                inputs: [
                    expectedSeedVersions.length,
                    expectedSeedVersions.length + 1,
                    Number.MAX_SAFE_INTEGER
                ],
                expected: false
            },
            {
                label: 'Valid indexes',
                inputs: buildValidIndexes(),
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
                if (typeof testExpected === 'boolean') {
                    expect(SeedVersions.isValidIndex(testInput)).toBe(testExpected);
                } else {
                    expect(() => {
                        SeedVersions.isValidIndex(testInput);
                    }).toThrow(testExpected);
                }
            });
        });
    });

    describe('getVersion', (): void => {
        test.each(
            buildValidIndexes()
        )('%# - Valid index (%i) should return the expected seed version.', (index: number): void => {
            expect(SeedVersions.getVersion(index)).toEqual(expectedSeedVersions[index]);
        });

        describe('Input validation', (): void => {
            const scenarios: Scenario[] = [
                {
                    label: 'Non-number inputs',
                    inputs: nonNumberInputs,
                    expected: PrimitiveTypeError
                },
                {
                    label: 'Float and negative integer inputs',
                    inputs: [
                        ...floatInputs,
                        ...negativeIntegerInputs
                    ],
                    expected: PrimitiveTypeError
                },
                {
                    label: 'Out of bounds number indexes',
                    inputs: [
                        expectedSeedVersions.length,
                        expectedSeedVersions.length + 1,
                        Number.MAX_SAFE_INTEGER
                    ],
                    expected: ValueRangeError
                }
            ];

            describe.each(
                scenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Invalid index $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(() => {
                        SeedVersions.getVersion(testInput as number);
                    }).toThrow(testExpected);
                });
            });
        });
    });
});
