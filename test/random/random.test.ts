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

import { describe, test, afterEach, expect, expectTypeOf } from 'vitest';

import {
    PrimitiveTypeError,
    Random,
    RandomNumberGeneratorFactory,
    SeededRandomNumberGenerator,
    StaticInstanceError,
    ValueRangeError
} from '../../src';

import { nonArrayInputs } from '../utils/input/array-inputs';
import { nonFunctionInputs } from '../utils/input/function-inputs';

import {
    invalidSafeNumberInputs,
    nonFiniteNumberInputs,
    nonNumberInputs,
    unsafeNumberInputs,
    zeroInputs
} from '../utils/input/number-inputs';

import { testStaticClassConstructor } from '../utils/static/static-class-tests';

import {
    asciiNamespace,
    asciiSeed,
    getExpectedAsyncSequence,
    getExpectedSequence
} from '../utils/test-case/scenarios/random-number-generator-factory-scenarios';

import { Scenario, TestCase, buildTestCases } from '../utils/test-case/test-case';

describe('Random', (): void => {
    testStaticClassConstructor('Random', Random as unknown as new () => unknown, StaticInstanceError);

    const testRepeatTotal: number = 50;

    const outOfContractDraws: number[] = [-1, -0.5, NaN, 2, Infinity, -Infinity];

    afterEach((): void => {
        Random.randomNumberGenerator = Math.random;
    });

    function validateRandomFloatValues(numbers: number[], min: number, max: number): void {
        const sameMinMax: boolean = min !== max;

        for (const num of numbers) {
            expectTypeOf(num).toBeNumber();
            expect(num).not.toBeNaN();

            if (sameMinMax) {
                expect(num).toBeGreaterThanOrEqual(min);
                expect(num).toBeLessThan(max);
            } else {
                expect(num).toBe(min);
            }
        }

        const numbersSet: Set<number> = new Set<number>(numbers);

        if (sameMinMax) {
            expect(numbersSet.size).toBe(numbers.length);
        } else {
            expect(numbersSet.size).toBe(1);
        }
    }

    function getLowestInt(min: number): number {
        return Math.ceil(min);
    }

    function getHighestInt(min: number, max: number): number {
        if (min === max) {
            return Math.floor(max);
        }

        return Math.ceil(max) - 1;
    }

    function validateRandomIntValues(numbers: number[], min: number, max: number): void {
        const lowest: number = getLowestInt(min);
        const highest: number = getHighestInt(min, max);
        const multipleValues: boolean = highest > lowest;

        for (const num of numbers) {
            expectTypeOf(num).toBeNumber();
            expect(num).not.toBeNaN();
            expect(Number.isInteger(num)).toBe(true);
            expect(num).toBeGreaterThanOrEqual(lowest);
            expect(num).toBeLessThanOrEqual(highest);
        }

        const numbersSet: Set<number> = new Set<number>(numbers);

        if (multipleValues) {
            expect(numbersSet.size).toBeGreaterThan(1);
            expect(numbersSet.size).toBeLessThanOrEqual((highest - lowest) + 1);
        } else {
            expect(numbersSet.size).toBe(1);
            expect(numbersSet.has(lowest)).toBe(true);
        }
    }

    function validateRandomBooleans(booleans: boolean[], expectedValue?: boolean): void {
        for (const bool of booleans) {
            expectTypeOf(bool).toBeBoolean();

            if (expectedValue === undefined) {
                expect(bool).toBeOneOf([true, false]);
            } else if (expectedValue) {
                expect(bool).toBe(true);
            } else {
                expect(bool).toBe(false);
            }
        }

        const booleanSet: Set<boolean> = new Set<boolean>(booleans);

        if (expectedValue === undefined) {
            expect(booleanSet.size).toBe(2);
        } else {
            expect(booleanSet.size).toBe(1);
        }
    }

    function validateRandomElements(selected: unknown[], input: unknown[], type: string): void {
        for (const element of selected) {
            expect(typeof element).toBe(type);
            expect(element).toBeOneOf(input);
        }

        const elementSet: Set<unknown> = new Set<unknown>(selected);
        expect(elementSet.size).toBe(input.length);
    }

    describe('randomNumberGenerator', (): void => {
        describe('Setting random number generator should impact the values returned by all other methods', (): void => {
            test('random', (): void => {
                const expected: number = 1.5;

                Random.randomNumberGenerator = (): number => {
                    return expected;
                };

                for (let i: number = 0; i < testRepeatTotal; i++) {
                    expect(Random.random()).toBe(expected);
                }
            });

            test('randomFloat', (): void => {
                const random: number = 0.25;
                const expected: number = 2;

                Random.randomNumberGenerator = (): number => {
                    return random;
                };

                for (let i: number = 0; i < testRepeatTotal; i++) {
                    expect(Random.randomFloat(0, 8)).toBe(expected);
                }
            });

            test('randomInt', (): void => {
                const random: number = 0.75;
                const expected: number = 3;

                Random.randomNumberGenerator = (): number => {
                    return random;
                };

                for (let i: number = 0; i < testRepeatTotal; i++) {
                    expect(Random.randomInt(0, 4)).toBe(expected);
                }
            });

            test('randomInteger', (): void => {
                const random: number = 0.5;
                const expected: number = 2;

                Random.randomNumberGenerator = (): number => {
                    return random;
                };

                for (let i: number = 0; i < testRepeatTotal; i++) {
                    expect(Random.randomInteger(0, 4)).toBe(expected);
                }
            });
        });

        describe('Setting random number generator with a seeded pseudorandom number generator should return the correct sequence of values', (): void => {
            const seed: string = asciiSeed;
            const namespace: string = asciiNamespace;

            test('With RandomNumberGeneratorFactory.build', (): void => {
                const rng: SeededRandomNumberGenerator = RandomNumberGeneratorFactory.build(seed, namespace);
                const expected: number[] = getExpectedSequence(seed, namespace);
                const repeatTotal: number = expected.length;

                Random.randomNumberGenerator = rng.next.bind(rng);
                const selected: number[] = [];

                for (let i: number = 0; i < repeatTotal; i++) {
                    selected.push(Random.random());
                }

                expect(selected).toEqual(expected);
            });

            test('With RandomNumberGeneratorFactory.asyncBuild', async (): Promise<void> => {
                const rng: SeededRandomNumberGenerator = await RandomNumberGeneratorFactory.asyncBuild(seed, namespace);
                const expected: number[] = getExpectedAsyncSequence(seed, namespace);
                const repeatTotal: number = expected.length;

                Random.randomNumberGenerator = rng.next.bind(rng);
                const selected: number[] = [];

                for (let i: number = 0; i < repeatTotal; i++) {
                    selected.push(Random.random());
                }

                expect(selected).toEqual(expected);
            });
        });

        describe('Input validation', (): void => {
            describe('randomNumberGenerator must be a function', (): void => {
                test.each(
                    nonFunctionInputs
                )('%# - Random.randomNumberGenerator = %o should throw a PrimitiveTypeError', (input: unknown): void => {
                    expect((): void => {
                        Random.randomNumberGenerator = input as (() => number);
                    }).toThrow(PrimitiveTypeError);
                });
            });
        });
    });

    describe('random', (): void => {
        test('random() should return a positive number between 0 inclusive and 1 exclusive', (): void => {
            const min: 0 = 0 as const;
            const max: 1 = 1 as const;
            const numbers: number[] = [];

            for (let i: number = 0; i < testRepeatTotal; i++) {
                const r: number = Random.random();
                numbers.push(r);
            }

            validateRandomFloatValues(numbers, min, max);
        });
    });

    describe('randomFloat', (): void => {
        describe('randomFloat should return a number between the given min and max', (): void => {
            test.each([
                { min: 0, max: 1 },
                { min: 0, max: 50 },
                { min: 100, max: 500 },
                { min: -1, max: 0 },
                { min: -50, max: 0 },
                { min: -500, max: -100 },
                { min: 0.5, max: 0.75 },
                { min: 0, max: 0.5 },
                { min: -0.5, max: 0 },
                { min: -0.75, max: -0.5 },
                { min: -100, max: 100 },
                { min: -0.5, max: 0.5 }
            ])('%# - randomFloat($min, $max) should return a number between $min and $max', ({ min, max }: { min: number; max: number; }): void => {
                const numbers: number[] = [];

                for (let i: number = 0; i < testRepeatTotal; i++) {
                    const r: number = Random.randomFloat(min, max);
                    numbers.push(r);
                }

                validateRandomFloatValues(numbers, min, max);
            });
        });

        describe('randomFloat should never return the exclusive max', (): void => {
            const roundsUp: number = 1 - (Number.EPSILON / 2);

            test.each([
                { min: 1, max: 2 },
                { min: 0, max: 1 },
                { min: -2, max: -1 },
                { min: 0.5, max: 0.75 },
                { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER }
            ])('%# - randomFloat($min, $max) should stay below $max', ({ min, max }: { min: number; max: number; }): void => {
                for (const draw of [roundsUp, 0.9999999999999999, 0.9, 0.5, 0]) {
                    Random.randomNumberGenerator = (): number => draw;
                    const value: number = Random.randomFloat(min, max);

                    expect(value).toBeGreaterThanOrEqual(min);
                    expect(value).toBeLessThan(max);
                }
            });

            test('randomFloat should fall back to min when every draw rounds up to max', (): void => {
                Random.randomNumberGenerator = (): number => 1 - (Number.EPSILON / 2);
                expect(Random.randomFloat(1, 2)).toBe(1);
            });
        });

        describe('randomFloat should retry a rejected draw rather than fall through to min', (): void => {
            const retryScenarios: Scenario[] = [
                {
                    label: 'A single rejected draw before a valid one',
                    inputs: outOfContractDraws.map((draw: number): number[] => {
                        return [draw, 0.5];
                    }),
                    expected: 5
                },
                {
                    label: 'Several rejected draws before a valid one',
                    inputs: [
                        [...outOfContractDraws, 0.5],
                        [2, -1, 0.5],
                        [NaN, NaN, NaN, 0.5]
                    ],
                    expected: 5
                }
            ];

            describe.each(
                retryScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - randomFloat(0, 10) drawing $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    const draws: number[] = testInput as number[];
                    let index: number = 0;

                    Random.randomNumberGenerator = (): number => {
                        const draw: number = draws[index] ?? 0;
                        index++;
                        return draw;
                    };

                    expect(Random.randomFloat(0, 10)).toBe(testExpected);
                });
            });
        });

        describe('randomFloat should reject bounds before drawing from them', (): void => {
            test('randomFloat should throw rather than return NaN when the span would overflow', (): void => {
                Random.randomNumberGenerator = (): number => 0;

                expect((): void => {
                    Random.randomFloat(-Number.MAX_VALUE, Number.MAX_VALUE);
                }).toThrow(PrimitiveTypeError);
            });
        });

        describe('randomFloat should hold min and max to the same limit', (): void => {
            test('randomInt should not return Number.MAX_SAFE_INTEGER', (): void => {
                Random.randomNumberGenerator = (): number => 1 - (Number.EPSILON / 2);
                expect(Random.randomInt(0, Number.MAX_SAFE_INTEGER)).toBeLessThan(Number.MAX_SAFE_INTEGER);
            });
        });
    });

    describe('randomInt and randomInteger', (): void => {
        describe('randomInt and randomInteger should return a number between the given min and max', (): void => {
            test.each([
                { min: 0, max: 1 },
                { min: 0, max: 50 },
                { min: 100, max: 500 },
                { min: -1, max: 0 },
                { min: -50, max: 0 },
                { min: -500, max: -100 },
                { min: -100, max: 100 }
            ])('%# - randomInt($min, $max) and randomInteger($min, $max) should return a number between $min and $max', ({ min, max }: { min: number; max: number; }): void => {
                const intNumbers: number[] = [];
                const integerNumbers: number[] = [];

                for (let i: number = 0; i < testRepeatTotal; i++) {
                    intNumbers.push(Random.randomInt(min, max));
                    integerNumbers.push(Random.randomInteger(min, max));
                }

                validateRandomIntValues(intNumbers, min, max);
                validateRandomIntValues(integerNumbers, min, max);
            });
        });

        describe('randomInt and randomInteger should round float bounds inward to the integers the range contains', (): void => {
            test.each([
                { min: 0.33, max: 1.5 },
                { min: 0.5, max: 50.34 },
                { min: 125.555, max: 400.444 },
                { min: -1.6, max: 0.7 },
                { min: -50.41, max: 0.78 },
                { min: -500.234, max: -100.987 },
                { min: 0.5, max: 10.314 },
                { min: 1.5, max: 9.75 },
                { min: 0, max: 5.5 },
                { min: 2.3, max: 5.7 },
                { min: -3.75, max: -0.5 },
                { min: -100.777, max: 100.222 },
                { min: -0.5, max: 0.5 }
            ])('%# - randomInt($min, $max) and randomInteger($min, $max) should return an integer within [$min, $max)', ({ min, max }: { min: number; max: number; }): void => {
                const intNumbers: number[] = [];
                const integerNumbers: number[] = [];

                for (let i: number = 0; i < testRepeatTotal; i++) {
                    intNumbers.push(Random.randomInt(min, max));
                    integerNumbers.push(Random.randomInteger(min, max));
                }

                validateRandomIntValues(intNumbers, min, max);
                validateRandomIntValues(integerNumbers, min, max);
            });
        });

        describe('Argument errors', (): void => {
            const noIntegerValueScenarios: Scenario[] = [
                {
                    label: 'Ranges that contain no integer values',
                    inputs: [
                        { min: 1.5, max: 1.89 },
                        { min: 10.01, max: 10.99 },
                        { min: 10.001, max: 10.999 },
                        { min: -10.4, max: -10.25 },
                        { min: 0.5, max: 0.75 },
                        { min: 0.99, max: 0.999 },
                        { min: -0.999, max: -0.99 },
                        { min: -0.5, max: 0 }
                    ],
                    expected: ValueRangeError
                }
            ];

            describe.each(
                noIntegerValueScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    const args: { min: number; max: number; } = testInput as { min: number; max: number; };

                    expect((): void => {
                        Random.randomInt(args.min, args.max);
                    }).toThrow(testExpected);

                    expect((): void => {
                        Random.randomInteger(args.min, args.max);
                    }).toThrow(testExpected);
                });
            });

            test('randomInt should reject an unsafe bound before drawing from it', (): void => {
                const min: number = 1e20;
                const max: number = 1e20 + 16384;

                for (const draw of [0, 0.5, 0.9, 1 - (Number.EPSILON / 2)]) {
                    Random.randomNumberGenerator = (): number => draw;

                    expect((): void => {
                        Random.randomInt(min, max);
                    }).toThrow(PrimitiveTypeError);
                }
            });
        });

        describe('randomInt and randomInteger should not return the exclusive max when the draw rounds up to it', (): void => {
            const roundsUp: number = 1 - (Number.EPSILON / 2);

            test.each([
                { min: 1, max: 2 },
                { min: 0, max: 1 },
                { min: -2, max: -1 },
                { min: 5, max: 9 }
            ])('%# - randomInt($min, $max) should stay below $max', ({ min, max }: { min: number; max: number; }): void => {
                Random.randomNumberGenerator = (): number => roundsUp;

                const intValue: number = Random.randomInt(min, max);
                const integerValue: number = Random.randomInteger(min, max);

                expect(intValue).toBeGreaterThanOrEqual(min);
                expect(intValue).toBeLessThan(max);
                expect(integerValue).toBeGreaterThanOrEqual(min);
                expect(integerValue).toBeLessThan(max);
            });
        });

        describe('randomInt and randomInteger should round non-integer bounds inward to an exact value', (): void => {
            test.each([
                { min: 0.33, max: 1.5, expected: 1 },
                { min: 1.2, max: 2.8, expected: 2 },
                { min: -1.5, max: -0.4, expected: -1 },
                { min: 4.01, max: 5.99, expected: 5 }
            ])('%# - randomInt($min, $max) and randomInteger($min, $max) should return $expected', ({ min, max, expected }: { min: number; max: number; expected: number; }): void => {
                for (let i: number = 0; i < testRepeatTotal; i++) {
                    expect(Random.randomInt(min, max)).toBe(expected);
                    expect(Random.randomInteger(min, max)).toBe(expected);
                }
            });
        });
    });

    describe('randomBoolean', (): void => {
        test('randomBoolean should only return true or false', (): void => {
            const booleans: boolean[] = [];

            for (let i: number = 0; i < testRepeatTotal; i++) {
                booleans.push(Random.randomBoolean());
            }

            validateRandomBooleans(booleans);
        });

        test('randomBoolean(0) should always return false', (): void => {
            const booleans: boolean[] = [];

            for (let i: number = 0; i < testRepeatTotal; i++) {
                booleans.push(Random.randomBoolean(0));
            }

            validateRandomBooleans(booleans, false);
        });

        test('randomBoolean(1) should always return true', (): void => {
            const booleans: boolean[] = [];

            for (let i: number = 0; i < testRepeatTotal; i++) {
                booleans.push(Random.randomBoolean(1));
            }

            validateRandomBooleans(booleans, true);
        });

        describe('randomBoolean should return false when the generator returns the chance itself', (): void => {
            const thresholdScenarios: Scenario[] = [
                {
                    label: 'Chance values at the bounds',
                    inputs: [...zeroInputs, 1],
                    expected: false
                },
                {
                    label: 'Chance values between the bounds',
                    inputs: [0.25, 0.5, 0.75],
                    expected: false
                }
            ];

            describe.each(
                thresholdScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - randomBoolean($input) should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    const chance: number = testInput as number;
                    Random.randomNumberGenerator = (): number => chance;
                    expect(Random.randomBoolean(chance)).toBe(testExpected);
                });
            });
        });

        describe('Chance of true validation', (): void => {
            const scenarios: Scenario[] = [
                {
                    label: 'Non-number type inputs',
                    inputs: [...nonNumberInputs.filter((input: unknown): boolean => input !== undefined)],
                    expected: PrimitiveTypeError
                },
                {
                    label: 'Non-finite number inputs',
                    inputs: [...nonFiniteNumberInputs],
                    expected: PrimitiveTypeError
                },
                {
                    label: 'Unsafe number inputs',
                    inputs: [...unsafeNumberInputs],
                    expected: PrimitiveTypeError
                },
                {
                    label: 'Out of range finite number inputs',
                    inputs: [
                        -Number.EPSILON,
                        1 + Number.EPSILON,
                        Number.MIN_SAFE_INTEGER,
                        Number.MAX_SAFE_INTEGER,
                        -1,
                        2,
                        -10,
                        10
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
                )('%# - randomBoolean($input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(() => Random.randomBoolean(testInput as number)).toThrow(testExpected);
                });
            });
        });
    });

    describe('randomElement', (): void => {
        describe('randomElement should return an element from the given list with the proper element type', (): void => {
            test.each([
                {
                    input: [1, 2, 3, 4, 5],
                    type: 'number'
                },
                {
                    input: [1.1, 2.2, 3.3, 4.4, 5.5],
                    type: 'number'
                },
                {
                    input: [1],
                    type: 'number'
                },
                {
                    input: ['it', 'was', 'the', 'best', 'of', 'times'],
                    type: 'string'
                },
                {
                    input: ['see', 'spot', 'run'],
                    type: 'string'
                },
                {
                    input: ['hello'],
                    type: 'string'
                }
            ])('%# - randomElement($input) should return an element from ($input)', ({ input, type }: { input: unknown[]; type: string; }): void => {
                const selected: unknown[] = [];
                const repeatTotal: number = Math.max(testRepeatTotal, input.length * 6);

                for (let i: number = 0; i < repeatTotal; i++) {
                    selected.push(Random.randomElement(input));
                }

                validateRandomElements(selected, input, type);
            });
        });

        describe('randomElement should return an element that is itself undefined', (): void => {
            const undefinedElementScenarios: Scenario[] = [
                {
                    label: 'Arrays whose elements are all undefined',
                    inputs: [
                        [undefined],
                        [undefined, undefined],
                        [undefined, undefined, undefined]
                    ],
                    expected: undefined
                }
            ];

            describe.each(
                undefinedElementScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - randomElement($input) should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(Random.randomElement(testInput as unknown[])).toBe(testExpected);
                });
            });
        });

        describe('Input validation', (): void => {
            describe('Input must be a non-empty array', (): void => {
                const scenarios: Scenario[] = [
                    {
                        label: 'Non-array type inputs',
                        inputs: [...nonArrayInputs],
                        expected: PrimitiveTypeError
                    },
                    {
                        label: 'Empty array input',
                        inputs: [
                            []
                        ],
                        expected: PrimitiveTypeError
                    }
                ];

                describe.each(
                    scenarios
                )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                    const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                    test.each(
                        testCases
                    )('%# - randomElement($input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                        expect((): void => {
                            Random.randomElement(testInput as unknown[]);
                        }).toThrow(testExpected);
                    });
                });
            });
        });
    });

    describe('randomWeightedElement', (): void => {
        interface WeightedListCase {
            readonly input: { value: unknown; weight: number; }[];
            readonly type: string;
        }

        interface ZeroWeightListCase extends WeightedListCase {
            readonly expected: unknown[];
        }

        const weightedListCases: WeightedListCase[] = [
            {
                input: [
                    { value: 1, weight: 0.25 },
                    { value: 2, weight: 0.25 },
                    { value: 3, weight: 0.25 },
                    { value: 4, weight: 0.25 }
                ],
                type: 'number'
            },
            {
                input: [
                    { value: 1, weight: 0.5 },
                    { value: 2, weight: 0.2 },
                    { value: 3, weight: 0.2 },
                    { value: 4, weight: 0.1 }
                ],
                type: 'number'
            },
            {
                input: [
                    { value: 1.1, weight: 0.25 },
                    { value: 2.2, weight: 0.25 },
                    { value: 3.3, weight: 0.25 },
                    { value: 4.4, weight: 0.25 }
                ],
                type: 'number'
            },
            {
                input: [
                    { value: 1, weight: 1 }
                ],
                type: 'number'
            },
            {
                input: [
                    { value: 'it', weight: 0.25 },
                    { value: 'was', weight: 0.25 },
                    { value: 'the', weight: 0.25 },
                    { value: 'best', weight: 0.25 }
                ],
                type: 'string'
            },
            {
                input: [
                    { value: 'see', weight: 0.33 },
                    { value: 'spot', weight: 0.33 },
                    { value: 'run', weight: 0.34 }
                ],
                type: 'string'
            },
            {
                input: [
                    { value: 'hello', weight: 1 }
                ],
                type: 'string'
            }
        ];

        const zeroWeightListCases: ZeroWeightListCase[] = [
            {
                input: [
                    { value: 1, weight: 0.25 },
                    { value: 2, weight: 0 },
                    { value: 3, weight: 0.25 },
                    { value: 4, weight: 0.25 },
                    { value: 5, weight: 0.25 }
                ],
                expected: [1, 3, 4, 5],
                type: 'number'
            },
            {
                input: [
                    { value: 1, weight: 0.5 },
                    { value: 2, weight: 0 },
                    { value: 3, weight: 0.3 },
                    { value: 4, weight: 0.2 }
                ],
                expected: [1, 3, 4],
                type: 'number'
            },
            {
                input: [
                    { value: 1, weight: 0 },
                    { value: 2, weight: 0.3 },
                    { value: 3, weight: 0.3 },
                    { value: 4, weight: 0.4 }
                ],
                expected: [2, 3, 4],
                type: 'number'
            },
            {
                input: [
                    { value: 1, weight: 0.4 },
                    { value: 2, weight: 0.3 },
                    { value: 3, weight: 0.3 },
                    { value: 4, weight: 0 }
                ],
                expected: [1, 2, 3],
                type: 'number'
            },
            {
                input: [
                    { value: 1.1, weight: 0 },
                    { value: 2.2, weight: 0.25 },
                    { value: 3.3, weight: 0.25 },
                    { value: 4.4, weight: 0.5 }
                ],
                expected: [2.2, 3.3, 4.4],
                type: 'number'
            },
            {
                input: [
                    { value: 'it', weight: 0.2 },
                    { value: 'was', weight: 0.4 },
                    { value: 'the', weight: 0 },
                    { value: 'best', weight: 0.4 }
                ],
                expected: ['it', 'was', 'best'],
                type: 'string'
            }
        ];

        describe('randomWeightedElement should return an element from the given list with the proper element type', (): void => {
            test.each(
                weightedListCases
            )('%# - randomWeightedElement($input) should return an element from ($input)', ({ input, type }: WeightedListCase): void => {
                const selected: unknown[] = [];
                const repeatTotal: number = Math.max(testRepeatTotal, input.length * 6);
                const expectedElements: unknown[] = input.map((item: { value: unknown; weight: number; }): unknown => item.value);

                for (let i: number = 0; i < repeatTotal; i++) {
                    selected.push(Random.randomWeightedElement(input));
                }

                validateRandomElements(selected, expectedElements, type);
            });
        });

        describe('randomWeightedElement should not return an element from the given list if the weight is zero', (): void => {
            test.each(
                zeroWeightListCases
            )('%# - randomWeightedElement should not return an element from ($input) if the weight is zero', ({ input, expected, type }: ZeroWeightListCase): void => {
                const selected: unknown[] = [];
                const repeatTotal: number = Math.max(testRepeatTotal, input.length * 10);

                for (let i: number = 0; i < repeatTotal; i++) {
                    selected.push(Random.randomWeightedElement(input));
                }

                validateRandomElements(selected, expected, type);
            });
        });

        describe('randomWeightedElement should return a fallback element if the randomNumberGenerator returns a number outside the range of 0 to 1', (): void => {
            describe.each([
                ...weightedListCases,
                ...zeroWeightListCases
            ])('%# - randomWeightedElement($input) with a randomNumberGenerator outside the range of 0 to 1', ({ input }: WeightedListCase): void => {
                test('Should return elements[0] if the rng function returns a negative number', (): void => {
                    Random.randomNumberGenerator = (): number => {
                        return -0.1;
                    };

                    const selected: unknown = Random.randomWeightedElement(input);
                    expect(selected).toBe(input[0].value);
                });

                test('Should return elements[length - 1] if the rng function returns a number greater than 1', (): void => {
                    Random.randomNumberGenerator = (): number => {
                        return 1.1;
                    };

                    const selected: unknown = Random.randomWeightedElement(input);
                    expect(selected).toBe(input[input.length - 1].value);
                });
            });
        });
    });

    describe('Shared min and max argument errors', (): void => {
        const safeMin: number = 0;
        const safeMax: number = 10;

        const argumentFailureScenarios: Scenario[] = [
            {
                label: 'Invalid min argument',
                inputs: invalidSafeNumberInputs.map((input: unknown): { min: unknown; max: number; } => {
                    return { min: input, max: safeMax };
                }),
                expected: PrimitiveTypeError
            },
            {
                label: 'Invalid max argument',
                inputs: invalidSafeNumberInputs.map((input: unknown): { min: number; max: unknown; } => {
                    return { min: safeMin, max: input };
                }),
                expected: PrimitiveTypeError
            },
            {
                label: 'min is equal to max',
                inputs: [
                    { min: 0, max: 0 },
                    { min: 1, max: 1 },
                    { min: -1, max: -1 },
                    { min: 10, max: 10 },
                    { min: -10, max: -10 },
                    { min: 1.8, max: 1.8 },
                    { min: 10.5, max: 10.5 },
                    { min: -10.5, max: -10.5 },
                    { min: 0.5, max: 0.5 },
                    { min: -0.5, max: -0.5 },
                    { min: Number.MIN_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER },
                    { min: Number.MAX_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER }
                ],
                expected: ValueRangeError
            },
            {
                label: 'min is greater than max',
                inputs: [
                    { min: 0, max: -1 },
                    { min: 10, max: 9 },
                    { min: 10, max: 0 },
                    { min: 10, max: -10 },
                    { min: -10, max: -11 },
                    { min: -10, max: -20 },
                    { min: 0.123, max: -1.123 },
                    { min: 10.123, max: 9.123 },
                    { min: 10.123, max: -10.123 },
                    { min: -10.123, max: -11.123 },
                    { min: 0.456, max: 0.123 },
                    { min: 10.456, max: 10.1234 },
                    { min: -10.123, max: -10.456 },
                    { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER }
                ],
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
                const args: { min: unknown; max: unknown; } = testInput as { min: unknown; max: unknown; };

                expect((): void => {
                    Random.randomFloat(args.min as number, args.max as number);
                }).toThrow(testExpected);

                expect((): void => {
                    Random.randomInt(args.min as number, args.max as number);
                }).toThrow(testExpected);

                expect((): void => {
                    Random.randomInteger(args.min as number, args.max as number);
                }).toThrow(testExpected);
            });
        });
    });

    describe('randomFloat and randomInt should stay in range for a generator outside its contract', (): void => {
        const outOfContractScenarios: Scenario[] = [
            {
                label: 'Draws outside the documented [0, 1) contract',
                inputs: outOfContractDraws,
                expected: undefined
            }
        ];

        describe.each(
            outOfContractScenarios
        )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
            const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

            test.each(
                testCases
            )('%# - A generator returning $input should still yield a value within [0, 10)', ({ input: testInput }: TestCase): void => {
                const draw: number = testInput as number;
                Random.randomNumberGenerator = (): number => draw;

                const floatValue: number = Random.randomFloat(0, 10);
                const intValue: number = Random.randomInt(0, 10);

                expect(Number.isFinite(floatValue)).toBe(true);
                expect(floatValue).toBeGreaterThanOrEqual(0);
                expect(floatValue).toBeLessThan(10);

                expect(Number.isSafeInteger(intValue)).toBe(true);
                expect(intValue).toBeGreaterThanOrEqual(0);
                expect(intValue).toBeLessThan(10);
            });
        });
    });

    describe('randomFloat and randomInt should accept bounds at the safe integer limits', (): void => {
        test.each([
            { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER },
            { min: 0, max: Number.MAX_SAFE_INTEGER },
            { min: Number.MIN_SAFE_INTEGER, max: 0 }
        ])('%# - randomFloat($min, $max) should return a safely truncatable value', ({ min, max }: { min: number; max: number; }): void => {
            for (let i: number = 0; i < testRepeatTotal; i++) {
                const value: number = Random.randomFloat(min, max);

                expect(Number.isFinite(value)).toBe(true);
                expect(Number.isSafeInteger(Math.floor(value))).toBe(true);
                expect(value).toBeGreaterThanOrEqual(min);
                expect(value).toBeLessThan(max);

                const intValue: number = Random.randomInt(min, max);
                expect(Number.isSafeInteger(intValue)).toBe(true);
                expect(intValue).toBeGreaterThanOrEqual(min);
                expect(intValue).toBeLessThan(max);
            }
        });
    });
});
