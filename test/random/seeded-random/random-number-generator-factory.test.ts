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

import { RandomNumberGeneratorFactory } from '../../../src/random/seeded-random/random-number-generator-factory';

import { buildTestCases, Scenario, TestCase } from '../../utils/test-case/test-case';

describe('RandomNumberGeneratorFactory', (): void => {
    describe('new RandomNumberGeneratorFactory()', (): void => {
        describe('Runtime behavior guards', (): void => {
            test('Constructor should throw an error when instantiated at runtime', (): void => {
                const RuntimeConstructor = RandomNumberGeneratorFactory as unknown as new () => RandomNumberGeneratorFactory;
                expect((): RandomNumberGeneratorFactory => new RuntimeConstructor()).toThrow(Error);
            });
        });
    });

    describe('build', (): void => {
        /**
         * Sequences are keyed by their namespace and seed input. The version index should match the index of the sequence in the array.
         *
         * @remarks Once a seed version has been published, it should <b>NEVER</b> be changed or updated.
         * The order of seed versions should <b>NEVER</b> be changed.
         * New seed versions can only be added to the end of the array.
         * This array is meant to help ensure that the published SeedVersion data <b>NEVER</b> changes.
         * Once a test seed and namespace sequence has been determined, any deviation from that expected behavior is indicative of a breaking change and should be investigated immediately.
         */
        const sequences: { [key: string]: number[][] } = {
            'test-seed-00': [
                [0.634432977065444, 0.8579290516208857, 0.8093228186480701, 0.06116068898700178, 0.4406876463908702],
                [0.9131155568175018, 0.8299572116229683, 0.8383598797954619, 0.09797090291976929, 0.7856007595546544]
            ],
            'test-seed-01': [
                [0.13497344846837223, 0.8579290620982647, 0.06300078285858035, 0.06043651350773871, 0.4764115291181952],
                [0.41257508541457355, 0.8296138364821672, 0.7415374778211117, 0.5689590640831739, 0.29441579757258296]
            ],
            'test-seed-02': [
                [0.6355139177758247, 0.8595759070012718, 0.49183768266811967, 0.07090507377870381, 0.9302758108824492],
                [0.9120346161071211, 0.838282746495679, 0.4679519219789654, 0.47057552030310035, 0.46148116467520595]
            ],
            'test-namespace-00\x00test-seed-00': [
                [0.36890324554406106, 0.7137624127790332, 0.36981175979599357, 0.35915147769264877, 0.6547805801965296],
                [0.16553925978951156, 0.3284351306501776, 0.5189291620627046, 0.4091069942805916, 0.28637753427028656]
            ],
            'test-namespace-00\x00test-seed-01': [
                [1, 2, 3, 4, 5],
                [1, 2, 3, 4, 5]
            ],
            'test-namespace-01\x00test-seed-00': [
                [0.3755729671102017, 0.7366348921786994, 0.5166533759329468, 0.46790983714163303, 0.0813936865888536],
                [0.5370737644843757, 0.010037466185167432, 0.7695884795393795, 0.48961918940767646, 0.13595098350197077]
            ]
        };

        function buildKey(seed: string, namespace?: string): string {
            if (namespace) {
                return `${namespace}\x00${seed}`;
            } else {
                return seed;
            }
        }

        function getSequence(seed: string, namespace?: string, version?: number) {
            const key: string = buildKey(seed, namespace);
            const index: number = version ?? 0;
            return sequences[key][index];
        }

        function getOtherSequences(seed: string, namespace?: string, version?: number): number[][] {
            const key: string = buildKey(seed, namespace);
            const index: number = version ?? 0;
            const keySequences = sequences[key];
            const otherKeys: string[] = Object.keys(sequences).filter(k => k !== key);
            const otherSequences: number[][] = [];

            otherKeys.forEach(k => {
                const others = sequences[k];
                otherSequences.push(...others);
            });

            for (let i = 0; i < keySequences.length; i++) {
                if (i === index) {
                    continue;
                }

                otherSequences.push(keySequences[i]);
            }

            return otherSequences;
        }

        // TODO - make special scenario type for these tests. Single input, single output.
        const scenarios: Scenario[] = [
            {
                label: 'build(test-seed-00, undefined, 0)',
                inputs: [
                    {
                        seed: 'test-seed-00',
                        namespace: undefined,
                        version: 0,
                    }
                ],
                expected: getSequence('test-seed-00', undefined, 0)
            },
            {
                label: 'build(test-seed-00, undefined, 1)',
                inputs: [
                    {
                        seed: 'test-seed-00',
                        namespace: undefined,
                        version: 1,
                    }
                ],
                expected: getSequence('test-seed-00', undefined, 1)
            },
            {
                label: 'build(test-seed-00)',
                inputs: [
                    {
                        seed: 'test-seed-00',
                    }
                ],
                expected: getSequence('test-seed-00')
            },
            {
                label: 'build(test-seed-01, undefined, 0)',
                inputs: [
                    {
                        seed: 'test-seed-01',
                        namespace: undefined,
                        version: 0,
                    }
                ],
                expected: getSequence('test-seed-01', undefined, 0)
            },
            {
                label: 'build(test-seed-01, undefined, 1)',
                inputs: [
                    {
                        seed: 'test-seed-01',
                        namespace: undefined,
                        version: 1,
                    }
                ],
                expected: getSequence('test-seed-01', undefined, 1)
            },
            {
                label: 'build(test-seed-01)',
                inputs: [
                    {
                        seed: 'test-seed-01',
                    }
                ],
                expected: getSequence('test-seed-01')
            },
            {
                label: 'build(test-seed-00, test-namespace-00, 0)',
                inputs: [
                    {
                        seed: 'test-seed-00',
                        namespace: 'test-namespace-00',
                        version: 0,
                    }
                ],
                expected: getSequence('test-seed-00', 'test-namespace-00', 0)
            },
            {
                label: 'build(test-seed-00, test-namespace-00, 1)',
                inputs: [
                    {
                        seed: 'test-seed-00',
                        namespace: 'test-namespace-00',
                        version: 1,
                    }
                ],
                expected: getSequence('test-seed-00', 'test-namespace-00', 1)
            },
            {
                label: 'build(test-seed-00, test-namespace-00)',
                inputs: [
                    {
                        seed: 'test-seed-00',
                        namespace: 'test-namespace-00',
                    }
                ],
                expected: getSequence('test-seed-00', 'test-namespace-00')
            }
        ];

        function callBuild(seed: string, namespace?: string, version?: number) {
            if (version !== undefined) {
                return RandomNumberGeneratorFactory.build(seed, namespace, version);
            } else if (namespace !== undefined) {
                return RandomNumberGeneratorFactory.build(seed, namespace);
            }

            return RandomNumberGeneratorFactory.build(seed);
        }

        describe.each(
            scenarios
        )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
            const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

            test.each(
                testCases
            )('build should return a SeededRandomNumberGenerator with the expected sequence.', ({ input: testInput, expected: testExpected }: TestCase): void => {
                const e = testExpected as number[];
                const i = testInput as { seed: string; namespace?: string; version?: number };
                const otherSequences = getOtherSequences(i.seed, i.namespace, i.version);
                const rng = callBuild(i.seed, i.namespace, i.version);

                const sequence: number[] = [];

                for (let i = 0; i < e.length; i++) {
                    sequence.push(rng.next());
                }

                expect(sequence).toEqual(e);

                otherSequences.forEach((other: number[]): void => {
                    if (other.length === sequence.length) {
                        expect(sequence).not.toEqual(other);
                    } else if (other.length < sequence.length) {
                        expect(sequence.slice(0, other.length)).not.toEqual(other);
                    } else if (other.length > sequence.length) {
                        expect(sequence).not.toEqual(other.slice(0, sequence.length));
                    }
                });
            });
        });
    });

    test.todo('build with invalid inputs');

    test.todo('async build with valid inputs');

    test.todo('async build with invalid inputs');
});
