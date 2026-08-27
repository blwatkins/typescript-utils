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
    RandomNumberGeneratorFactory,
    SeedVersions,
    SeededRandomNumberGenerator,
    PrimitiveTypeError,
    ValueRangeError
} from '../../../src';

import { nonStringInputs } from '../../utils/input/string-inputs';

import {
    floatInputs,
    negativeIntegerInputs,
    nonFiniteNumberInputs,
    nonNumberInputs
} from '../../utils/input/number-inputs';

import { testStaticClassConstructor } from '../../utils/static/static-class-tests';

import {
    Scenario,
    SingleInputScenario,
    TestCase,
    buildTestCases
} from '../../utils/test-case/test-case';

import {
    asyncScenarios,
    scenarios,
    asciiSeed,
    alternateAsciiSeed,
    asciiNamespace,
    alternateAsciiNamespace
} from '../../utils/test-case/scenarios/random-number-generator-factory-scenarios';

describe('RandomNumberGeneratorFactory', (): void => {
    testStaticClassConstructor('RandomNumberGeneratorFactory', RandomNumberGeneratorFactory as unknown as new () => unknown, Error);

    const sequenceLength: 5 = 5 as const;

    function callBuild(seed: string, namespace?: string, version?: number): SeededRandomNumberGenerator {
        if (version !== undefined) {
            return RandomNumberGeneratorFactory.build(seed, namespace, version);
        } else if (namespace !== undefined) {
            return RandomNumberGeneratorFactory.build(seed, namespace);
        }

        return RandomNumberGeneratorFactory.build(seed);
    }

    function buildActualSequence(rng: SeededRandomNumberGenerator, length: number): number[] {
        const sequence: number[] = [];

        for (let i: number = 0; i < length; i++) {
            sequence.push(rng.next());
        }

        return sequence;
    }

    async function callAsyncBuild(seed: string, namespace?: string): Promise<SeededRandomNumberGenerator> {
        if (namespace !== undefined) {
            return await RandomNumberGeneratorFactory.asyncBuild(seed, namespace);
        }

        return await RandomNumberGeneratorFactory.asyncBuild(seed);
    }

    describe('build', (): void => {
        describe('build() with valid inputs', (): void => {
            test.each(
                scenarios
            )('%# - $label',
                ({ input: scenarioInput, expected: scenarioExpected }: SingleInputScenario): void => {
                    const expected = scenarioExpected as number[];
                    const input = scenarioInput as { seed: string; namespace?: string; version?: number; };
                    const rng: SeededRandomNumberGenerator = callBuild(input.seed, input.namespace, input.version);
                    const sequence: number[] = buildActualSequence(rng, sequenceLength);
                    expect(sequence).toEqual(expected);
                }
            );
        });

        describe('Sequence distinctness contracts', (): void => {
            test('Changing seed changes sequence', (): void => {
                const rngA: SeededRandomNumberGenerator = callBuild(asciiSeed);
                const rngB: SeededRandomNumberGenerator = callBuild(alternateAsciiSeed);
                const a: number[] = buildActualSequence(rngA, sequenceLength);
                const b: number[] = buildActualSequence(rngB, sequenceLength);
                expect(a).not.toEqual(b);
            });

            test('Changing namespace changes sequence', (): void => {
                const rngA: SeededRandomNumberGenerator = callBuild(asciiSeed, asciiNamespace);
                const rngB: SeededRandomNumberGenerator = callBuild(asciiSeed, alternateAsciiNamespace);
                const a: number[] = buildActualSequence(rngA, sequenceLength);
                const b: number[] = buildActualSequence(rngB, sequenceLength);
                expect(a).not.toEqual(b);
            });

            test('Changing valid version changes sequence for same seed and namespace', (): void => {
                const rngA: SeededRandomNumberGenerator = callBuild(asciiSeed, asciiNamespace, 0);
                const rngB: SeededRandomNumberGenerator = callBuild(asciiSeed, asciiNamespace, 1);
                const v0: number[] = buildActualSequence(rngA, sequenceLength);
                const v1: number[] = buildActualSequence(rngB, sequenceLength);
                expect(v0).not.toEqual(v1);
            });
        });

        describe('Input validation', (): void => {
            describe('Invalid seed inputs', (): void => {
                test.each(
                    nonStringInputs
                )('%# - Invalid seed %o should throw a TypeError', (seed: unknown): void => {
                    expect((): void => {
                        RandomNumberGeneratorFactory.build(seed as string);
                    }).toThrow(TypeError);
                });
            });

            describe('Invalid namespace inputs', (): void => {
                test.each(
                    nonStringInputs.filter((s: unknown): boolean => s !== undefined)
                )('%# - Invalid namespace %o should throw a TypeError', (namespace: unknown): void => {
                    expect((): void => {
                        RandomNumberGeneratorFactory.build('', namespace as string);
                    }).toThrow(TypeError);
                });
            });

            describe('Invalid version inputs', (): void => {
                const testScenarios: Scenario[] = [
                    {
                        label: 'Non-number, non-finite, and float versions',
                        inputs: [
                            ...nonNumberInputs.filter((s: unknown): boolean => s !== undefined),
                            ...nonFiniteNumberInputs,
                            ...floatInputs
                        ],
                        expected: PrimitiveTypeError
                    },
                    {
                        label: 'Negative integer versions',
                        inputs: negativeIntegerInputs,
                        expected: PrimitiveTypeError
                    },
                    {
                        label: 'Out-of-range integer versions',
                        inputs: [
                            SeedVersions.size,
                            SeedVersions.size + 1,
                            Number.MAX_SAFE_INTEGER,
                            500,
                            1_000
                        ],
                        expected: ValueRangeError
                    }
                ];

                describe.each(
                    testScenarios
                )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                    const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                    test.each(
                        testCases
                    )('%# - build("", "", $input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                        expect((): void => {
                            RandomNumberGeneratorFactory.build('', '', testInput as number);
                        }).toThrow(testExpected);
                    });
                });
            });
        });
    });

    describe('asyncBuild', (): void => {
        describe('asyncBuild() with valid inputs', (): void => {
            test.each(
                asyncScenarios
            )('%# - $label',
                async ({ input: scenarioInput, expected: scenarioExpected }: SingleInputScenario): Promise<void> => {
                    const expected = scenarioExpected as number[];
                    const input = scenarioInput as { seed: string; namespace?: string; };
                    const rng: SeededRandomNumberGenerator = await callAsyncBuild(input.seed, input.namespace);
                    const sequence: number[] = buildActualSequence(rng, sequenceLength);
                    expect(sequence).toEqual(expected);
                }
            );
        });

        describe('Sequence distinctness contracts', (): void => {
            test('Changing seed changes sequence', async (): Promise<void> => {
                const rngA: SeededRandomNumberGenerator = await callAsyncBuild(asciiSeed);
                const rngB: SeededRandomNumberGenerator = await callAsyncBuild(alternateAsciiSeed);
                const a: number[] = buildActualSequence(rngA, sequenceLength);
                const b: number[] = buildActualSequence(rngB, sequenceLength);
                expect(a).not.toEqual(b);
            });

            test('Changing namespace changes sequence', async (): Promise<void> => {
                const rngA: SeededRandomNumberGenerator = await callAsyncBuild(asciiSeed, asciiNamespace);
                const rngB: SeededRandomNumberGenerator = await callAsyncBuild(asciiSeed, alternateAsciiNamespace);
                const a: number[] = buildActualSequence(rngA, sequenceLength);
                const b: number[] = buildActualSequence(rngB, sequenceLength);
                expect(a).not.toEqual(b);
            });
        });

        describe('Input validation', (): void => {
            describe('Invalid seed inputs', (): void => {
                test.each(
                    nonStringInputs
                )('%# - Invalid seed %o should throw a TypeError', async (seed: unknown): Promise<void> => {
                    await expect(RandomNumberGeneratorFactory.asyncBuild(seed as string)).rejects.toThrow(TypeError);
                });
            });

            describe('Invalid namespace inputs', (): void => {
                test.each(
                    nonStringInputs.filter((s: unknown): boolean => s !== undefined)
                )('%# - Invalid namespace %o should throw a TypeError', async (namespace: unknown): Promise<void> => {
                    await expect(RandomNumberGeneratorFactory.asyncBuild('', namespace as string)).rejects.toThrow(TypeError);
                });
            });
        });
    });
});
