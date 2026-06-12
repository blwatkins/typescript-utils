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

import { RandomNumberGeneratorFactory, SeedVersions, SeededRandomNumberGenerator } from '../../../src';

import { nonStringInputs } from '../../utils/input/string-inputs';

import {
    floatInputs,
    negativeIntegerInputs,
    nonFiniteNumberInputs,
    nonNumberInputs
} from '../../utils/input/number-inputs';

import {
    asyncScenarios,
    scenarios,
    asciiSeed,
    alternateAsciiSeed,
    asciiNamespace,
    alternateAsciiNamespace
} from '../../utils/random/random-number-generator-factory-scenarios';

import {
    Scenario,
    SingleInputScenario,
    TestCase,
    buildTestCases
} from '../../utils/test-case/test-case';

describe('RandomNumberGeneratorFactory', (): void => {
    const sequenceLength: 5 = 5 as const;

    function callBuild(seed: string, namespace?: string, version?: number): SeededRandomNumberGenerator {
        if (version !== undefined) {
            return RandomNumberGeneratorFactory.build(seed, namespace, version);
        } else if (namespace !== undefined) {
            return RandomNumberGeneratorFactory.build(seed, namespace);
        }

        return RandomNumberGeneratorFactory.build(seed);
    }

    function buildActualSequence(rng: SeededRandomNumberGenerator): number[] {
        const sequence: number[] = [];

        for (let i: number = 0; i < sequenceLength; i++) {
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

    describe('new RandomNumberGeneratorFactory()', (): void => {
        describe('Runtime behavior guards', (): void => {
            test('Constructor should throw an error when instantiated at runtime', (): void => {
                const RuntimeConstructor = RandomNumberGeneratorFactory as unknown as new () => RandomNumberGeneratorFactory;
                expect((): RandomNumberGeneratorFactory => new RuntimeConstructor()).toThrow(Error);
            });
        });
    });

    describe('build', (): void => {
        describe('build with valid inputs', (): void => {
            test.each(
                scenarios
            )('%# - $label',
                ({ input: scenarioInput, expected: scenarioExpected }: SingleInputScenario): void => {
                    const expected = scenarioExpected as number[];
                    const input = scenarioInput as { seed: string; namespace?: string; version?: number; };
                    const rng: SeededRandomNumberGenerator = callBuild(input.seed, input.namespace, input.version);
                    const sequence: number[] = buildActualSequence(rng);
                    expect(sequence).toEqual(expected);
                }
            );
        });

        describe('sequence distinctness contracts', (): void => {
            test('changing seed changes sequence', (): void => {
                const rngA: SeededRandomNumberGenerator = callBuild(asciiSeed);
                const rngB: SeededRandomNumberGenerator = callBuild(alternateAsciiSeed);
                const a: number[] = buildActualSequence(rngA);
                const b: number[] = buildActualSequence(rngB);
                expect(a).not.toEqual(b);
            });

            test('changing namespace changes sequence', (): void => {
                const rngA: SeededRandomNumberGenerator = callBuild(asciiSeed, asciiNamespace);
                const rngB: SeededRandomNumberGenerator = callBuild(asciiSeed, alternateAsciiNamespace);
                const a: number[] = buildActualSequence(rngA);
                const b: number[] = buildActualSequence(rngB);
                expect(a).not.toEqual(b);
            });

            test('changing valid version changes sequence for same seed and namespace', (): void => {
                const rngA: SeededRandomNumberGenerator = callBuild(asciiSeed, asciiNamespace, 0);
                const rngB: SeededRandomNumberGenerator = callBuild(asciiSeed, asciiNamespace, 1);
                const v0: number[] = buildActualSequence(rngA);
                const v1: number[] = buildActualSequence(rngB);
                expect(v0).not.toEqual(v1);
            });
        });

        describe('input validation', (): void => {
            describe('invalid seed inputs', (): void => {
                test.each(
                    nonStringInputs
                )('%# - invalid seed %o should throw a TypeError', (seed: unknown): void => {
                    expect((): void => {
                        RandomNumberGeneratorFactory.build(seed as string);
                    }).toThrow(TypeError);
                });
            });

            describe('invalid namespace inputs', (): void => {
                test.each(
                    nonStringInputs.filter((s: unknown): boolean => s !== undefined)
                )('%# - invalid namespace %o should throw a TypeError', (namespace: unknown): void => {
                    expect((): void => {
                        RandomNumberGeneratorFactory.build('', namespace as string);
                    }).toThrow(TypeError);
                });
            });

            describe('invalid version inputs', (): void => {
                const testScenarios: Scenario[] = [
                    {
                        label: 'non-number, non-finite, and float versions',
                        inputs: [
                            ...nonNumberInputs.filter((s: unknown): boolean => s !== undefined),
                            ...nonFiniteNumberInputs,
                            ...floatInputs
                        ],
                        expected: TypeError
                    },
                    {
                        label: 'out-of-range integer versions',
                        inputs: [
                            ...negativeIntegerInputs,
                            SeedVersions.size,
                            SeedVersions.size + 1,
                            Number.MAX_SAFE_INTEGER,
                            500,
                            1_000
                        ],
                        expected: RangeError
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
        describe('asyncBuild with valid inputs', (): void => {
            test.each(
                asyncScenarios
            )('%# - $label',
                async ({ input: scenarioInput, expected: scenarioExpected }: SingleInputScenario): Promise<void> => {
                    const expected = scenarioExpected as number[];
                    const input = scenarioInput as { seed: string; namespace?: string; };
                    const rng: SeededRandomNumberGenerator = await callAsyncBuild(input.seed, input.namespace);
                    const sequence: number[] = buildActualSequence(rng);
                    expect(sequence).toEqual(expected);
                }
            );
        });

        describe('sequence distinctness contracts', (): void => {
            test('changing seed changes sequence', async (): Promise<void> => {
                const rngA: SeededRandomNumberGenerator = await callAsyncBuild(asciiSeed);
                const rngB: SeededRandomNumberGenerator = await callAsyncBuild(alternateAsciiSeed);
                const a: number[] = buildActualSequence(rngA);
                const b: number[] = buildActualSequence(rngB);
                expect(a).not.toEqual(b);
            });

            test('changing namespace changes sequence', async (): Promise<void> => {
                const rngA: SeededRandomNumberGenerator = await callAsyncBuild(asciiSeed, asciiNamespace);
                const rngB: SeededRandomNumberGenerator = await callAsyncBuild(asciiSeed, alternateAsciiNamespace);
                const a: number[] = buildActualSequence(rngA);
                const b: number[] = buildActualSequence(rngB);
                expect(a).not.toEqual(b);
            });
        });

        describe('input validation', (): void => {
            describe('invalid seed inputs', (): void => {
                test.each(
                    nonStringInputs
                )('%# - invalid seed %o should throw a TypeError', async (seed: unknown): Promise<void> => {
                    await expect(RandomNumberGeneratorFactory.asyncBuild(seed as string)).rejects.toThrow(TypeError);
                });
            });

            describe('invalid namespace inputs', (): void => {
                test.each(
                    nonStringInputs.filter((s: unknown): boolean => s !== undefined)
                )('%# - invalid namespace %o should throw a TypeError', async (namespace: unknown): Promise<void> => {
                    await expect(RandomNumberGeneratorFactory.asyncBuild('', namespace as string)).rejects.toThrow(TypeError);
                });
            });
        });
    });
});
