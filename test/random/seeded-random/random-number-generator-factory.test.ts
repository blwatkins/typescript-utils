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
    RandomNumberGeneratorFactory,
    SeedVersions,
    SeededRandomNumberGenerator,
    StaticInstanceError,
    ValueRangeError
} from '../../../src';

import {
    definedNonStringInputs,
    nonStringInputs,
    nullCharacterStringInputs
} from '../../utils/input/string-inputs';
import { definedInvalidSafePositiveIntegerInputs } from '../../utils/input/number-inputs';
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
    testStaticClassConstructor('RandomNumberGeneratorFactory', RandomNumberGeneratorFactory as unknown as new () => unknown, StaticInstanceError);

    const sequenceLength: 5 = 5 as const;

    function buildActualSequence(rng: SeededRandomNumberGenerator, length: number): number[] {
        const sequence: number[] = [];

        for (let i: number = 0; i < length; i++) {
            sequence.push(rng.next());
        }

        return sequence;
    }

    interface SeedAndNamespaceArgs {
        seed: unknown;
        namespace?: unknown;
    }

    const seedAndNamespaceFailureScenarios: Scenario[] = [
        {
            label: 'Invalid seed - not a string',
            inputs: nonStringInputs.map((input: unknown): SeedAndNamespaceArgs => {
                return {
                    seed: input
                };
            }),
            expected: PrimitiveTypeError
        },
        {
            label: 'Invalid seed - string with null character',
            inputs: nullCharacterStringInputs.map((input: unknown): SeedAndNamespaceArgs => {
                return {
                    seed: input
                };
            }),
            expected: ValueRangeError
        },
        {
            label: 'Invalid namespace - not a string or undefined',
            inputs: definedNonStringInputs.map((input: unknown): SeedAndNamespaceArgs => {
                return {
                    seed: '',
                    namespace: input
                };
            }),
            expected: PrimitiveTypeError
        },
        {
            label: 'Invalid namespace - string with null character',
            inputs: nullCharacterStringInputs.map((input: unknown): SeedAndNamespaceArgs => {
                return {
                    seed: '',
                    namespace: input
                };
            }),
            expected: ValueRangeError
        }
    ];

    describe('build', (): void => {
        interface BuildArgs {
            seed: unknown;
            namespace?: unknown;
            version?: unknown;
        }

        function callBuild(args: BuildArgs): SeededRandomNumberGenerator {
            if (args.version !== undefined) {
                return RandomNumberGeneratorFactory.build(args.seed as string, args.namespace as string, args.version as number);
            } else if (args.namespace !== undefined) {
                return RandomNumberGeneratorFactory.build(args.seed as string, args.namespace as string);
            }

            return RandomNumberGeneratorFactory.build(args.seed as string);
        }

        describe('Should build a SeededRandomNumberGenerator that returns the expected sequence', (): void => {
            test.each(
                scenarios
            )('%# - $label',
                ({ input: scenarioInput, expected: scenarioExpected }: SingleInputScenario): void => {
                    const expected = scenarioExpected as number[];
                    const rng: SeededRandomNumberGenerator = callBuild(scenarioInput as BuildArgs);
                    const sequence: number[] = buildActualSequence(rng, sequenceLength);

                    expect(rng).toBeInstanceOf(SeededRandomNumberGenerator);
                    expect(sequence).toEqual(expected);
                }
            );
        });

        describe('Should preserve sequence distinctness contracts', (): void => {
            test('Changing the seed should change the sequence', (): void => {
                const rngA: SeededRandomNumberGenerator = callBuild({ seed: asciiSeed });
                const rngB: SeededRandomNumberGenerator = callBuild({ seed: alternateAsciiSeed });
                const a: number[] = buildActualSequence(rngA, sequenceLength);
                const b: number[] = buildActualSequence(rngB, sequenceLength);

                expect(rngA).toBeInstanceOf(SeededRandomNumberGenerator);
                expect(rngB).toBeInstanceOf(SeededRandomNumberGenerator);
                expect(a).not.toEqual(b);
            });

            test('Changing the namespace should change the sequence', (): void => {
                const rngA: SeededRandomNumberGenerator = callBuild({ seed: asciiSeed, namespace: asciiNamespace });
                const rngB: SeededRandomNumberGenerator = callBuild({ seed: asciiSeed, namespace: alternateAsciiNamespace });
                const a: number[] = buildActualSequence(rngA, sequenceLength);
                const b: number[] = buildActualSequence(rngB, sequenceLength);

                expect(rngA).toBeInstanceOf(SeededRandomNumberGenerator);
                expect(rngB).toBeInstanceOf(SeededRandomNumberGenerator);
                expect(a).not.toEqual(b);
            });

            test('An absent namespace and an empty namespace should produce different sequences', (): void => {
                const rngA: SeededRandomNumberGenerator = callBuild({ seed: asciiSeed });
                const rngB: SeededRandomNumberGenerator = callBuild({ seed: asciiSeed, namespace: '' });
                const a: number[] = buildActualSequence(rngA, sequenceLength);
                const b: number[] = buildActualSequence(rngB, sequenceLength);

                expect(rngA).toBeInstanceOf(SeededRandomNumberGenerator);
                expect(rngB).toBeInstanceOf(SeededRandomNumberGenerator);
                expect(a).not.toEqual(b);
            });

            test('Changing the seed version should change the sequence for the same seed and namespace', (): void => {
                const rngA: SeededRandomNumberGenerator = callBuild({ seed: asciiSeed, namespace: asciiNamespace, version: 0 });
                const rngB: SeededRandomNumberGenerator = callBuild({ seed: asciiSeed, namespace: asciiNamespace, version: 1 });
                const a: number[] = buildActualSequence(rngA, sequenceLength);
                const b: number[] = buildActualSequence(rngB, sequenceLength);

                expect(rngA).toBeInstanceOf(SeededRandomNumberGenerator);
                expect(rngB).toBeInstanceOf(SeededRandomNumberGenerator);
                expect(a).not.toEqual(b);
            });
        });

        describe('Argument errors', (): void => {
            const argumentFailureScenarios: Scenario[] = [
                ...seedAndNamespaceFailureScenarios,
                {
                    label: 'Invalid version - invalid safe positive integer',
                    inputs: definedInvalidSafePositiveIntegerInputs.map((input: unknown): BuildArgs => {
                        return {
                            seed: '',
                            version: input
                        };
                    }),
                    expected: PrimitiveTypeError
                },
                {
                    label: 'Invalid version - out of range safe positive integer',
                    inputs: [SeedVersions.size, SeedVersions.size + 1, Number.MAX_SAFE_INTEGER, 500, 1_000].map((input: unknown): BuildArgs => {
                        return {
                            seed: '',
                            version: input
                        };
                    }),
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
                    expect((): void => {
                        callBuild(testInput as BuildArgs);
                    }).toThrow(testExpected);
                });
            });
        });
    });

    describe('asyncBuild', (): void => {
        interface AsyncBuildArgs {
            seed: unknown;
            namespace?: unknown;
        }

        async function callAsyncBuild(args: AsyncBuildArgs): Promise<SeededRandomNumberGenerator> {
            if (args.namespace !== undefined) {
                return await RandomNumberGeneratorFactory.asyncBuild(args.seed as string, args.namespace as string);
            }

            return await RandomNumberGeneratorFactory.asyncBuild(args.seed as string);
        }

        describe('Should build a SeededRandomNumberGenerator that returns the expected sequence', (): void => {
            test.each(
                asyncScenarios
            )('%# - $label',
                async ({ input: scenarioInput, expected: scenarioExpected }: SingleInputScenario): Promise<void> => {
                    const expected = scenarioExpected as number[];
                    const input = scenarioInput as AsyncBuildArgs;
                    const rng: SeededRandomNumberGenerator = await callAsyncBuild(input);
                    const sequence: number[] = buildActualSequence(rng, sequenceLength);

                    expect(rng).toBeInstanceOf(SeededRandomNumberGenerator);
                    expect(sequence).toEqual(expected);
                }
            );
        });

        describe('Should preserve sequence distinctness contracts', (): void => {
            test('Changing the seed should change the sequence', async (): Promise<void> => {
                const rngA: SeededRandomNumberGenerator = await callAsyncBuild({ seed: asciiSeed });
                const rngB: SeededRandomNumberGenerator = await callAsyncBuild({ seed: alternateAsciiSeed });
                const a: number[] = buildActualSequence(rngA, sequenceLength);
                const b: number[] = buildActualSequence(rngB, sequenceLength);

                expect(rngA).toBeInstanceOf(SeededRandomNumberGenerator);
                expect(rngB).toBeInstanceOf(SeededRandomNumberGenerator);
                expect(a).not.toEqual(b);
            });

            test('Changing the namespace should change the sequence', async (): Promise<void> => {
                const rngA: SeededRandomNumberGenerator = await callAsyncBuild({ seed: asciiSeed, namespace: asciiNamespace });
                const rngB: SeededRandomNumberGenerator = await callAsyncBuild({ seed: asciiSeed, namespace: alternateAsciiNamespace });
                const a: number[] = buildActualSequence(rngA, sequenceLength);
                const b: number[] = buildActualSequence(rngB, sequenceLength);

                expect(rngA).toBeInstanceOf(SeededRandomNumberGenerator);
                expect(rngB).toBeInstanceOf(SeededRandomNumberGenerator);
                expect(a).not.toEqual(b);
            });

            test('An absent namespace and an empty namespace should produce different sequences', async (): Promise<void> => {
                const rngA: SeededRandomNumberGenerator = await callAsyncBuild({ seed: asciiSeed });
                const rngB: SeededRandomNumberGenerator = await callAsyncBuild({ seed: asciiSeed, namespace: '' });
                const a: number[] = buildActualSequence(rngA, sequenceLength);
                const b: number[] = buildActualSequence(rngB, sequenceLength);

                expect(rngA).toBeInstanceOf(SeededRandomNumberGenerator);
                expect(rngB).toBeInstanceOf(SeededRandomNumberGenerator);
                expect(a).not.toEqual(b);
            });
        });

        describe('Argument errors', (): void => {
            describe.each(
                seedAndNamespaceFailureScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);
                test.each(
                    testCases
                )('%# - Input $input should throw $expected', async ({ input: testInput, expected: testExpected }: TestCase): Promise<void> => {
                    await expect(callAsyncBuild(testInput as AsyncBuildArgs)).rejects.toThrow(testExpected);
                });
            });
        });
    });
});
