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

import { SeedVersions } from '../../../src';
import { RandomNumberGeneratorFactory } from '../../../src/random/seeded-random/random-number-generator-factory';
import { SeededRandomNumberGenerator } from '../../../src/random/seeded-random/seeded-random-number-generator';

import { nonStringInputs } from '../../utils/input/string-inputs';
import {
    negativeNumberInputs,
    nonFiniteNumberInputs,
    nonNumberInputs,
    positiveFloatInputs
} from '../../utils/input/number-inputs';
import {
    asyncScenarios,
    getExpectedSequence,
    scenarios
} from '../../utils/random/random-number-generator-factory-scenarios';
import { buildTestCases, Scenario, SingleInputScenario, TestCase } from '../../utils/test-case/test-case';

describe('RandomNumberGeneratorFactory', (): void => {
    const sequenceLength: 5 = 5;

    function callBuild(seed: string, namespace?: string, version?: number): SeededRandomNumberGenerator {
        if (version !== undefined) {
            return RandomNumberGeneratorFactory.build(seed, namespace, version);
        } else if (namespace !== undefined) {
            return RandomNumberGeneratorFactory.build(seed, namespace);
        }

        return RandomNumberGeneratorFactory.build(seed);
    }

    function buildActualSequence(seed: string, namespace?: string, version?: number): number[] {
        const rng: SeededRandomNumberGenerator = callBuild(seed, namespace, version);
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
                    const sequence: number[] = buildActualSequence(input.seed, input.namespace, input.version);
                    expect(sequence).toEqual(expected);
                }
            );
        });

        describe('sequence distinctness contracts', (): void => {
            test('changing seed changes sequence', (): void => {
                const a: number[] = buildActualSequence('test-seed-00');
                const b: number[] = buildActualSequence('test-seed-01');
                expect(a).not.toEqual(b);
            });

            test('changing namespace changes sequence', (): void => {
                const a: number[] = buildActualSequence('test-seed-00', 'test-namespace-00');
                const b: number[] = buildActualSequence('test-seed-00', 'test-namespace-01');
                expect(a).not.toEqual(b);
            });

            test('changing valid version changes sequence for same seed and namespace', (): void => {
                const v0: number[] = buildActualSequence('test-seed-00', 'test-namespace-00', 0);
                const v1: number[] = buildActualSequence('test-seed-00', 'test-namespace-00', 1);
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
                const testScenarios: Scenario[] = [
                    {
                        label: 'non-string namespaces',
                        inputs: [
                            ...nonStringInputs.filter((s: unknown): boolean => s !== undefined)
                        ],
                        expected: TypeError
                    }
                ];

                describe.each(
                    testScenarios
                )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                    const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                    test.each(
                        testCases
                    )('%# - build("", $input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                        expect((): void => {
                            RandomNumberGeneratorFactory.build('', testInput as string);
                        }).toThrow(testExpected);
                        expect((): void => {
                            RandomNumberGeneratorFactory.build('', testInput as string, 0);
                        }).toThrow(testExpected);
                    });
                });
            });

            describe('invalid version inputs', (): void => {
                const testScenarios: Scenario[] = [
                    {
                        label: 'non-number versions',
                        inputs: [
                            ...nonNumberInputs.filter((s: unknown): boolean => s !== undefined),
                        ],
                        expected: TypeError
                    },
                    {
                        label: 'invalid number versions',
                        inputs: [
                            ...nonFiniteNumberInputs,
                            ...negativeNumberInputs,
                            ...positiveFloatInputs
                        ],
                        expected: TypeError
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

        describe('version fallback', (): void => {
            const seed: string = 'test-seed-00';
            const namespace: string = 'test-namespace-00';
            const fallbackVersion: 0 = 0;

            test.each([
                SeedVersions.size,
                SeedVersions.size + 1,
                Number.MAX_SAFE_INTEGER,
                500,
                1_000
            ])('%# - invalid integer version %d defaults to version 0', (version: number): void => {
                const expected: number[] = getExpectedSequence(seed, undefined, fallbackVersion);
                const expectedWithNamespace: number[] = getExpectedSequence(seed, namespace, fallbackVersion);
                expect(buildActualSequence(seed, undefined, version)).toEqual(expected);
                expect(buildActualSequence(seed, namespace, version)).toEqual(expectedWithNamespace);
            });
        });
    });

    describe('asyncBuild', (): void => {
        describe('asyncBuild with valid inputs', (): void => {
            test.each(
                asyncScenarios
            )('%# - $label - asyncBuild should return a SeededRandomNumberGenerator with the expected sequence.',
                async ({ input: scenarioInput, expected: scenarioExpected }: SingleInputScenario): Promise<void> => {
                    const expected = scenarioExpected as number[];
                    const input = scenarioInput as { seed: string; namespace?: string; };
                    const rng: SeededRandomNumberGenerator = await callAsyncBuild(input.seed, input.namespace);
                    const sequence: number[] = [];

                    for (let i: number = 0; i < sequenceLength; i++) {
                        sequence.push(rng.next());
                    }

                    expect(sequence).toEqual(expected);
                }
            );
        });

        test.todo('async build with invalid inputs');

        // describe('build with invalid inputs', (): void => {
        //     describe('invalid seed inputs', (): void => {
        //         const scenarios: Scenario[] = [
        //             {
        //                 label: 'non-string seeds',
        //                 inputs: [
        //                     ...nonStringInputs
        //                 ],
        //                 expected: TypeError
        //             }
        //         ];
        //
        //         describe.each(
        //             scenarios
        //         )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
        //             const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);
        //
        //             test.each(
        //                 testCases
        //             )('%# - build($input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
        //                 expect((): void => {
        //                     RandomNumberGeneratorFactory.build(testInput as string);
        //                 }).toThrow(testExpected);
        //                 expect((): void => {
        //                     RandomNumberGeneratorFactory.build(testInput as string, undefined, 0);
        //                 }).toThrow(testExpected);
        //                 expect((): void => {
        //                     RandomNumberGeneratorFactory.build(testInput as string, '', 0);
        //                 }).toThrow(testExpected);
        //             });
        //         });
        //     });
        //
        //     describe('invalid namespace inputs', (): void => {
        //         const scenarios: Scenario[] = [
        //             {
        //                 label: 'non-string namespaces',
        //                 inputs: [
        //                     ...nonStringInputs.filter((s: unknown): boolean => s !== undefined)
        //                 ],
        //                 expected: TypeError
        //             }
        //         ];
        //
        //         describe.each(
        //             scenarios
        //         )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
        //             const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);
        //
        //             test.each(
        //                 testCases
        //             )('%# - build("", $input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
        //                 expect((): void => {
        //                     RandomNumberGeneratorFactory.build('', testInput as string);
        //                 }).toThrow(testExpected);
        //                 expect((): void => {
        //                     RandomNumberGeneratorFactory.build('', testInput as string, 0);
        //                 }).toThrow(testExpected);
        //             });
        //         });
        //     });
        //
        //     describe('invalid version inputs', (): void => {
        //         const scenarios: Scenario[] = [
        //             {
        //                 label: 'non-number versions',
        //                 inputs: [
        //                     ...nonNumberInputs.filter((s: unknown): boolean => s !== undefined),
        //                     ...nonFiniteNumberInputs,
        //                     ...negativeNumberInputs,
        //                     ...positiveFloatInputs
        //                 ],
        //                 expected: TypeError
        //             }
        //         ];
        //
        //         describe.each(
        //             scenarios
        //         )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
        //             const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);
        //
        //             test.each(
        //                 testCases
        //             )('%# - build("", "", $input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
        //                 expect((): void => {
        //                     RandomNumberGeneratorFactory.build('', '', testInput as number);
        //                 }).toThrow(testExpected);
        //             });
        //         });
        //     });
        //
        //     describe('invalid version integer inputs', (): void => {
        //         const seed: string = 'test-seed-00';
        //         const namespace: string = 'test-namespace-00';
        //
        //         const scenarios: Scenario[] = [
        //             {
        //                 label: 'integer versions without a matching index entry',
        //                 inputs: [
        //                     SeedVersions.size,
        //                     SeedVersions.size + 1,
        //                     Number.MAX_SAFE_INTEGER,
        //                     500,
        //                     1_000
        //                 ],
        //                 expected: [getSequence(seed), getSequence(seed, namespace)]
        //             }
        //         ];
        //
        //         describe.each(
        //             scenarios
        //         )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
        //             const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);
        //
        //             test.each(
        //                 testCases
        //             )('%# - build with version $input should default to version 0', ({ input: testInput, expected: testExpected }: TestCase): void => {
        //                 const expected: number[][] = testExpected as number[][];
        //                 const input: number = testInput as number;
        //                 const rng1: SeededRandomNumberGenerator = callBuild(seed, undefined, input);
        //                 const rng2: SeededRandomNumberGenerator = callBuild(seed, namespace, input);
        //                 const sequence1: number[] = [];
        //                 const sequence2: number[] = [];
        //
        //                 for (let i: number = 0; i < Math.min(expected[0].length, expected[1].length); i++) {
        //                     sequence1.push(rng1.next());
        //                     sequence2.push(rng2.next());
        //                 }
        //
        //                 expect([sequence1, sequence2]).toEqual(expected);
        //             });
        //         });
        //     });
        // });
    });
});
