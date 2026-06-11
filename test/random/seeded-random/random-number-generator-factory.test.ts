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

import { SeedVersions, StringUtility } from '../../../src';
import { RandomNumberGeneratorFactory } from '../../../src/random/seeded-random/random-number-generator-factory';
import { SeededRandomNumberGenerator } from '../../../src/random/seeded-random/seeded-random-number-generator';

import { nonStringInputs } from '../../utils/input/string-inputs';
import {
    negativeNumberInputs,
    nonFiniteNumberInputs,
    nonNumberInputs,
    positiveFloatInputs
} from '../../utils/input/number-inputs';
import { buildTestCases, Scenario, SingleInputScenario, TestCase } from '../../utils/test-case/test-case';

describe('RandomNumberGeneratorFactory', (): void => {
    const sequenceLength: number = 5;

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
        const sequences: Record<string, number[][]> = {
            '': [
                [0.6126510770991445, 0.3232760636601597, 0.5053844235371798, 0.5004723358433694, 0.8444383488968015],
                [0.49630083329975605, 0.26718430570326746, 0.5911665598396212, 0.9048203160054982, 0.24119087704457343]
            ],
            '\x00': [
                [0.39831331721507013, 0.4331224621273577, 0.6937443742062896, 0.19698031223379076, 0.8398848185315728],
                [0.00922908284701407, 0.3375692891422659, 0.3045982476323843, 0.6381423401180655, 0.7763565834611654]
            ],
            'Ë': [
                [0.8712875235360116, 0.26320099574513733, 0.10322601883672178, 0.09657859709113836, 0.8213197118602693],
                [0.627448758808896, 0.789355386979878, 0.22389372275210917, 0.7672866720240563, 0.8605319424532354]
            ],
            '\u{00CB}\x00\u{00CB}': [
                [0.7256847326643765, 0.8443186667282134, 0.3638235698454082, 0.24236159515567124, 0.049290241207927465],
                [0.38947216677479446, 0.4713413678109646, 0.7621940351091325, 0.30963829858228564, 0.08248079381883144]
            ],
            '⭐': [
                [0.9694232840556651, 0.9242921115364879, 0.8754217408131808, 0.5243206792511046, 0.45104918046854436],
                [0.7025466905906796, 0.5448313450906426, 0.6962815392762423, 0.12431758479215205, 0.5638441045302898]
            ],
            '\u{2B50}\x00\u{2B50}': [
                [0.8694517486728728, 0.267334503820166, 0.5202956276480108, 0.7923379603307694, 0.156677037011832],
                [0.4572813929989934, 0.6103907972574234, 0.8155440571717918, 0.743932654382661, 0.09259677515365183]
            ],
            'test-seed-00': [
                [0.634432977065444, 0.8579290516208857, 0.8093228186480701, 0.06116068898700178, 0.4406876463908702],
                [0.9131155568175018, 0.8299572116229683, 0.8383598797954619, 0.09797090291976929, 0.7856007595546544]
            ],
            '\x00test-seed-00': [
                [0.9857979689259082, 0.24636835046112537, 0.5494615291245282, 0.5093912568408996, 0.7697517338674515],
                [0.32814985048025846, 0.22640329715795815, 0.7572518708184361, 0.619672927306965, 0.4001562672201544]
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
                [0.8683627741411328, 0.7439748151227832, 0.16317949281074107, 0.568283086642623, 0.9389660542365164],
                [0.6660797311924398, 0.3273193002678454, 0.8574078464880586, 0.17541947425343096, 0.7369510729331523]
            ],
            'test-namespace-01\x00test-seed-00': [
                [0.3755729671102017, 0.7366348921786994, 0.5166533759329468, 0.46790983714163303, 0.0813936865888536],
                [0.5370737644843757, 0.010037466185167432, 0.7695884795393795, 0.48961918940767646, 0.13595098350197077]
            ]
        };

        function buildKey(seed: string, namespace?: string): string {
            if (StringUtility.isString(namespace)) {
                return `${namespace}\x00${seed}`;
            } else {
                return seed;
            }
        }

        function getSequence(seed: string, namespace?: string, version?: number): number[] {
            const key: string = buildKey(seed, namespace);
            const index: number = version ?? 0;
            return sequences[key][index];
        }

        function callBuild(seed: string, namespace?: string, version?: number): SeededRandomNumberGenerator {
            if (version !== undefined) {
                return RandomNumberGeneratorFactory.build(seed, namespace, version);
            } else if (namespace !== undefined) {
                return RandomNumberGeneratorFactory.build(seed, namespace);
            }

            return RandomNumberGeneratorFactory.build(seed);
        }

        describe('build with valid inputs', (): void => {
            function getOtherSequences(seed: string, namespace?: string, version?: number): number[][] {
                const key: string = buildKey(seed, namespace);
                const index: number = version ?? 0;
                const keySequences: number[][] = sequences[key];
                const otherKeys: string[] = Object.keys(sequences).filter((k: string): boolean => k !== key);
                const otherSequences: number[][] = [];

                otherKeys.forEach((k: string): void => {
                    const others: number[][] = sequences[k];
                    otherSequences.push(...others);
                });

                for (let i: number = 0; i < keySequences.length; i++) {
                    if (i === index) {
                        continue;
                    }

                    otherSequences.push(keySequences[i]);
                }

                return otherSequences;
            }

            const scenarios: SingleInputScenario[] = [
                {
                    label: 'build("")',
                    input: {
                        seed: ''
                    },
                    expected: getSequence('')
                },
                {
                    label: 'build("", undefined, 0)',
                    input: {
                        seed: '',
                        version: 0
                    },
                    expected: getSequence('', undefined, 0)
                },
                {
                    label: 'build("", undefined, 1)',
                    input:
                        {
                            seed: '',
                            version: 1
                        },
                    expected: getSequence('', undefined, 1)
                },
                {
                    label: 'build("", "", 0)',
                    input: {
                        seed: '',
                        namespace: '',
                        version: 0
                    },
                    expected: getSequence('', '', 0)
                },
                {
                    label: 'build("", "", 1)',
                    input:
                        {
                            seed: '',
                            namespace: '',
                            version: 1
                        },
                    expected: getSequence('', '', 1)
                },
                {
                    label: 'build(test-seed-00)',
                    input: {
                        seed: 'test-seed-00'
                    },
                    expected: getSequence('test-seed-00')
                },
                {
                    label: 'build(test-seed-00, undefined, 0)',
                    input: {
                        seed: 'test-seed-00',
                        version: 0
                    },
                    expected: getSequence('test-seed-00', undefined, 0)
                },
                {
                    label: 'build(test-seed-00, undefined, 1)',
                    input:
                        {
                            seed: 'test-seed-00',
                            version: 1
                        },
                    expected: getSequence('test-seed-00', undefined, 1)
                },
                {
                    label: 'build(test-seed-00, "")',
                    input: {
                        seed: 'test-seed-00',
                        namespace: ''
                    },
                    expected: getSequence('test-seed-00', '')
                },
                {
                    label: 'build(test-seed-00, "", 0)',
                    input: {
                        seed: 'test-seed-00',
                        namespace: '',
                        version: 0
                    },
                    expected: getSequence('test-seed-00', '', 0)
                },
                {
                    label: 'build(test-seed-00, "", 1)',
                    input:
                        {
                            seed: 'test-seed-00',
                            namespace: '',
                            version: 1
                        },
                    expected: getSequence('test-seed-00', '', 1)
                },
                {
                    label: 'build(test-seed-01)',
                    input:
                        {
                            seed: 'test-seed-01'
                        },
                    expected: getSequence('test-seed-01')
                },
                {
                    label: 'build(test-seed-01, undefined, 0)',
                    input: {
                        seed: 'test-seed-01',
                        version: 0
                    },
                    expected: getSequence('test-seed-01', undefined, 0)
                },
                {
                    label: 'build(test-seed-01, undefined, 1)',
                    input: {
                        seed: 'test-seed-01',
                        version: 1
                    },
                    expected: getSequence('test-seed-01', undefined, 1)
                },
                {
                    label: 'build(test-seed-00, test-namespace-00)',
                    input: {
                        seed: 'test-seed-00',
                        namespace: 'test-namespace-00'
                    },
                    expected: getSequence('test-seed-00', 'test-namespace-00')
                },
                {
                    label: 'build(test-seed-00, test-namespace-00, 0)',
                    input: {
                        seed: 'test-seed-00',
                        namespace: 'test-namespace-00',
                        version: 0
                    },
                    expected: getSequence('test-seed-00', 'test-namespace-00', 0)
                },
                {
                    label: 'build(test-seed-00, test-namespace-00, 1)',
                    input: {
                        seed: 'test-seed-00',
                        namespace: 'test-namespace-00',
                        version: 1
                    },
                    expected: getSequence('test-seed-00', 'test-namespace-00', 1)
                },
                {
                    label: 'build(test-seed-01, test-namespace-00)',
                    input: {
                        seed: 'test-seed-01',
                        namespace: 'test-namespace-00'
                    },
                    expected: getSequence('test-seed-01', 'test-namespace-00')
                },
                {
                    label: 'build(test-seed-01, test-namespace-00, 0)',
                    input: {
                        seed: 'test-seed-01',
                        namespace: 'test-namespace-00',
                        version: 0
                    },
                    expected: getSequence('test-seed-01', 'test-namespace-00', 0)
                },
                {
                    label: 'build(test-seed-01, test-namespace-00, 1)',
                    input: {
                        seed: 'test-seed-01',
                        namespace: 'test-namespace-00',
                        version: 1
                    },
                    expected: getSequence('test-seed-01', 'test-namespace-00', 1)
                },
                {
                    label: 'build(test-seed-00, test-namespace-01)',
                    input: {
                        seed: 'test-seed-00',
                        namespace: 'test-namespace-01'
                    },
                    expected: getSequence('test-seed-00', 'test-namespace-01')
                },
                {
                    label: 'build(test-seed-00, test-namespace-01, 0)',
                    input: {
                        seed: 'test-seed-00',
                        namespace: 'test-namespace-01',
                        version: 0
                    },
                    expected: getSequence('test-seed-00', 'test-namespace-01', 0)
                },
                {
                    label: 'build(test-seed-00, test-namespace-01, 1)',
                    input: {
                        seed: 'test-seed-00',
                        namespace: 'test-namespace-01',
                        version: 1
                    },
                    expected: getSequence('test-seed-00', 'test-namespace-01', 1)
                },
                {
                    label: 'build(⭐)',
                    input: {
                        seed: '⭐'
                    },
                    expected: getSequence('⭐')
                },
                {
                    label: 'build(\u{2B50})',
                    input: {
                        seed: '\u{2B50}'
                    },
                    expected: getSequence('\u{2B50}')
                },
                {
                    label: 'build(⭐, undefined, 0)',
                    input: {
                        seed: '⭐',
                        version: 0
                    },
                    expected: getSequence('⭐', undefined, 0)
                },
                {
                    label: 'build(⭐, undefined, 1)',
                    input:
                        {
                            seed: '⭐',
                            version: 1
                        },
                    expected: getSequence('⭐', undefined, 1)
                },
                {
                    label: 'build(Ë)',
                    input: {
                        seed: 'Ë'
                    },
                    expected: getSequence('Ë')
                },
                {
                    label: 'build(\u{00CB})',
                    input: {
                        seed: '\u{00CB}'
                    },
                    expected: getSequence('\u{00CB}')
                },
                {
                    label: 'build(Ë, undefined, 0)',
                    input: {
                        seed: 'Ë',
                        version: 0
                    },
                    expected: getSequence('Ë', undefined, 0)
                },
                {
                    label: 'build(Ë, undefined, 1)',
                    input:
                        {
                            seed: 'Ë',
                            version: 1
                        },
                    expected: getSequence('Ë', undefined, 1)
                },
                {
                    label: 'build(⭐, ⭐)',
                    input: {
                        seed: '⭐',
                        namespace: '⭐'
                    },
                    expected: getSequence('⭐', '⭐')
                },
                {
                    label: 'build(\u{2B50}, \u{2B50})',
                    input: {
                        seed: '\u{2B50}',
                        namespace: '\u{2B50}'
                    },
                    expected: getSequence('\u{2B50}', '\u{2B50}')
                },
                {
                    label: 'build(⭐, ⭐, 0)',
                    input: {
                        seed: '⭐',
                        namespace: '⭐',
                        version: 0
                    },
                    expected: getSequence('⭐', '⭐', 0)
                },
                {
                    label: 'build(⭐, ⭐, 1)',
                    input: {
                        seed: '⭐',
                        namespace: '⭐',
                        version: 1
                    },
                    expected: getSequence('⭐', '⭐', 1)
                },
                {
                    label: 'build(Ë, Ë)',
                    input: {
                        seed: 'Ë',
                        namespace: 'Ë'
                    },
                    expected: getSequence('Ë', 'Ë')
                },
                {
                    label: 'build(\u{00CB}, \u{00CB})',
                    input: {
                        seed: '\u{00CB}',
                        namespace: '\u{00CB}'
                    },
                    expected: getSequence('\u{00CB}', '\u{00CB}')
                },
                {
                    label: 'build(Ë, Ë, 0)',
                    input: {
                        seed: 'Ë',
                        namespace: 'Ë',
                        version: 0
                    },
                    expected: getSequence('Ë', 'Ë', 0)
                },
                {
                    label: 'build(Ë, Ë, 1)',
                    input: {
                        seed: 'Ë',
                        namespace: 'Ë',
                        version: 1
                    },
                    expected: getSequence('Ë', 'Ë', 1)
                }
            ];

            test.each(
                scenarios
            )('%# - $label - build should return a SeededRandomNumberGenerator with the expected sequence.',
                ({ input: scenarioInput, expected: scenarioExpected }: SingleInputScenario): void => {
                    const expected = scenarioExpected as number[];
                    const input = scenarioInput as { seed: string; namespace?: string; version?: number; };
                    const otherSequences: number[][] = getOtherSequences(input.seed, input.namespace, input.version);
                    const rng: SeededRandomNumberGenerator = callBuild(input.seed, input.namespace, input.version);
                    const sequence: number[] = [];

                    for (let i: number = 0; i < sequenceLength; i++) {
                        sequence.push(rng.next());
                    }

                    expect(sequence).toEqual(expected);

                    otherSequences.forEach((other: number[]): void => {
                        if (other.length === sequence.length) {
                            expect(sequence).not.toEqual(other);
                        } else if (other.length < sequence.length) {
                            expect(sequence.slice(0, other.length)).not.toEqual(other);
                        } else if (other.length > sequence.length) {
                            expect(sequence).not.toEqual(other.slice(0, sequence.length));
                        }
                    });
                }
            );
        });

        describe('build with invalid inputs', (): void => {
            describe('invalid seed inputs', (): void => {
                const scenarios: Scenario[] = [
                    {
                        label: 'non-string seeds',
                        inputs: [
                            ...nonStringInputs
                        ],
                        expected: TypeError
                    }
                ];

                describe.each(
                    scenarios
                )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                    const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                    test.each(
                        testCases
                    )('%# - build($input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                        expect((): void => {
                            RandomNumberGeneratorFactory.build(testInput as string);
                        }).toThrow(testExpected);
                        expect((): void => {
                            RandomNumberGeneratorFactory.build(testInput as string, undefined, 0);
                        }).toThrow(testExpected);
                        expect((): void => {
                            RandomNumberGeneratorFactory.build(testInput as string, '', 0);
                        }).toThrow(testExpected);
                    });
                });
            });

            describe('invalid namespace inputs', (): void => {
                const scenarios: Scenario[] = [
                    {
                        label: 'non-string namespaces',
                        inputs: [
                            ...nonStringInputs.filter((s: unknown): boolean => s !== undefined)
                        ],
                        expected: TypeError
                    }
                ];

                describe.each(
                    scenarios
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
                const scenarios: Scenario[] = [
                    {
                        label: 'non-number versions',
                        inputs: [
                            ...nonNumberInputs.filter((s: unknown): boolean => s !== undefined),
                            ...nonFiniteNumberInputs,
                            ...negativeNumberInputs,
                            ...positiveFloatInputs
                        ],
                        expected: TypeError
                    }
                ];

                describe.each(
                    scenarios
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

            describe('invalid version integer inputs', (): void => {
                const seed: string = 'test-seed-00';
                const namespace: string = 'test-namespace-00';

                const scenarios: Scenario[] = [
                    {
                        label: 'integer versions without a matching index entry',
                        inputs: [
                            SeedVersions.size,
                            SeedVersions.size + 1,
                            Number.MAX_SAFE_INTEGER,
                            500,
                            1_000
                        ],
                        expected: [getSequence(seed), getSequence(seed, namespace)]
                    }
                ];

                describe.each(
                    scenarios
                )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                    const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                    test.each(
                        testCases
                    )('%# - build with version $input should default to version 0', ({ input: testInput, expected: testExpected }: TestCase): void => {
                        const expected: number[][] = testExpected as number[][];
                        const input: number = testInput as number;
                        const rng1: SeededRandomNumberGenerator = callBuild(seed, undefined, input);
                        const rng2: SeededRandomNumberGenerator = callBuild(seed, namespace, input);
                        const sequence1: number[] = [];
                        const sequence2: number[] = [];

                        for (let i: number = 0; i < Math.min(expected[0].length, expected[1].length); i++) {
                            sequence1.push(rng1.next());
                            sequence2.push(rng2.next());
                        }

                        expect([sequence1, sequence2]).toEqual(expected);
                    });
                });
            });
        });
    });

    test.todo('async build with valid inputs');

    test.todo('async build with invalid inputs');
});
