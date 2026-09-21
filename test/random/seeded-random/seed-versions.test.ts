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

import {
    PrimitiveTypeError,
    SeedVersion,
    SeedVersions,
    StaticInstanceError,
    ValueRangeError
} from '../../../src';

import { testAssertMethod, testIsMethod } from '../../utils/assert/assert-tests';

import {
    negativeSafeIntegerInputs,
    nonFiniteNumberInputs,
    nonNumberInputs,
    safeFloatInputs,
    unsafeNumberInputs
} from '../../utils/input/number-inputs';

import { testStaticClassConstructor } from '../../utils/static/static-class-tests';
import { Scenario, TestCase, buildTestCases } from '../../utils/test-case/test-case';

describe('SeedVersions', (): void => {
    testStaticClassConstructor('SeedVersions', SeedVersions as unknown as new () => unknown, StaticInstanceError);

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

    function buildValidIndexes(): number[] {
        const indexes: number[] = [];

        for (let i = 0; i < expectedSeedVersions.length; i++) {
            indexes.push(i);
        }

        return indexes;
    }

    const argumentFailureScenarios: Scenario[] = [
        {
            label: 'Non-number inputs',
            inputs: nonNumberInputs,
            expected: PrimitiveTypeError
        },
        {
            label: 'Non-finite number inputs',
            inputs: nonFiniteNumberInputs,
            expected: PrimitiveTypeError
        },
        {
            label: 'Number inputs outside the safe integer range',
            inputs: unsafeNumberInputs,
            expected: PrimitiveTypeError
        },
        {
            label: 'Float inputs',
            inputs: safeFloatInputs,
            expected: PrimitiveTypeError
        },
        {
            label: 'Negative integer inputs',
            inputs: negativeSafeIntegerInputs,
            expected: PrimitiveTypeError
        }
    ];

    const outOfBoundsInputs: number[] = [
        expectedSeedVersions.length,
        expectedSeedVersions.length + 1,
        Number.MAX_SAFE_INTEGER
    ];

    describe('size', (): void => {
        test(`Size should be ${expectedSeedVersions.length}`, (): void => {
            expect(SeedVersions.size).toBe(expectedSeedVersions.length);
        });
    });

    describe('ValidIndex', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Out of bounds number indexes',
                inputs: outOfBoundsInputs,
                expected: ValueRangeError
            }
        ];

        const successScenarios: Scenario[] = [
            {
                label: 'Valid indexes',
                inputs: buildValidIndexes(),
                expected: undefined
            }
        ];

        describe('assertValidIndex', (): void => {
            function assertValidIndex(input: unknown, message?: string): void {
                SeedVersions.assertValidIndex(input as number, message);
            }

            testAssertMethod(
                assertValidIndex,
                successScenarios,
                failureScenarios,
                'index must be a valid seed version index.'
            );
        });

        describe('isValidIndex', (): void => {
            function isValidIndex(input: unknown): boolean {
                return SeedVersions.isValidIndex(input as number);
            }

            testIsMethod(isValidIndex, successScenarios, failureScenarios);
        });

        describe('Argument Errors', (): void => {
            describe.each(
                argumentFailureScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                describe('Argument errors - assertValidIndex', (): void => {
                    test.each(
                        testCases
                    )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                        expect((): void => {
                            SeedVersions.assertValidIndex(testInput as number);
                        }).toThrow(testExpected);
                    });
                });

                describe('Argument errors - isValidIndex', (): void => {
                    test.each(
                        testCases
                    )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                        expect((): void => {
                            SeedVersions.isValidIndex(testInput as number);
                        }).toThrow(testExpected);
                    });
                });
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
                ...argumentFailureScenarios,
                {
                    label: 'Out of bounds number indexes',
                    inputs: outOfBoundsInputs,
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
                    expect((): void => {
                        SeedVersions.getVersion(testInput as number);
                    }).toThrow(testExpected);
                });
            });
        });
    });
});
