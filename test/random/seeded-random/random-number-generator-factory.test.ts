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
                [
                    1, 2, 3, 4, 5
                ]
            ],
            'test-seed-01': [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5]],
            'test-seed-02': [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5]],
            'test-namespace-00\x00test-seed-00': [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5]],
            'test-namespace-01\x00test-seed-00': [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5]],
        };

        const seeds: readonly string[] = Object.freeze([
            'test-seed-00',
            'test-seed-01',
            'test-seed-02'
        ]);

        const namespaces: readonly (string|undefined)[] = Object.freeze([
            'test-namespace-00',
            'test-namespace-01',
            undefined
        ]);

        function buildInputs(): { seed: string; namespace: string|undefined, version?: number }[] {
            const inputs: { seed: string; namespace: string|undefined, version?: number }[] = [];

            for (const seed of seeds) {
                for (const namespace of namespaces) {
                    for (let i = 0; i < SeedVersions.size; i++) {
                        inputs.push({ seed, namespace, version: i });
                    }

                    inputs.push({ seed, namespace, version: undefined });
                }
            }

            return inputs;
        }

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

        test.each(
            buildInputs()
        )('build($seed, $namespace, $version) should return the expected sequence.', ({seed, namespace, version}): void => {
            const expectedSequence = getSequence(seed, namespace, version);
            const otherSequences = getOtherSequences(seed, namespace, version);
            const rng = RandomNumberGeneratorFactory.build(seed, namespace, version);
            const sequence: number[] = [];

            for (let i = 0; i < expectedSequence.length; i++) {
                sequence.push(rng.next());
            }

            expect(sequence).toEqual(expectedSequence);

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
