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

import { describe, test, afterEach, expect, expectTypeOf } from 'vitest';

import {
    Random,
    RandomNumberGeneratorFactory,
    SeededRandomNumberGenerator,
    WeightedElementUtility,
    WeightedList
} from '../../src';

import { nonFunctionInputs } from '../utils/input/function-inputs';
import { nonFiniteNumberInputs, nonNumberInputs } from '../utils/input/number-inputs';
import { buildTestCases, Scenario, TestCase } from '../utils/test-case/test-case';

import {
    asciiNamespace,
    asciiSeed, getExpectedAsyncSequence,
    getExpectedSequence
} from '../utils/test-case/scenarios/random-number-generator-factory-scenarios';
import { nonArrayInputs } from '../utils/input/array-inputs';

describe('Random', (): void => {
    const testRepeatTotal: number = 100;

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

    function validateRandomIntValues(numbers: number[], min: number, max: number): void {
        const sameMinMax: boolean = Math.floor(max) - Math.floor(min) > 1;

        for (const num of numbers) {
            expectTypeOf(num).toBeNumber();
            expect(num).not.toBeNaN();
            expect(Number.isInteger(num)).toBe(true);

            if (sameMinMax) {
                expect(num).toBeGreaterThanOrEqual(Math.floor(min));
                expect(num).toBeLessThan(Math.floor(max));
            } else {
                expect(num).toBe(Math.floor(min));
            }
        }

        const numbersSet: Set<number> = new Set<number>(numbers);

        if (sameMinMax) {
            expect(numbersSet.size).toBeGreaterThan(1);
            expect(numbersSet.size).toBeLessThanOrEqual(Math.floor(max) - Math.floor(min));
        } else {
            expect(numbersSet.size).toBe(1);
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

    describe('new Random()', (): void => {
        describe('Runtime behavior guards', (): void => {
            test('Constructor should throw an error when instantiated at runtime', (): void => {
                const RuntimeConstructor = Random as unknown as new () => Random;
                expect((): Random => new RuntimeConstructor()).toThrow(Error);
            });
        });
    });

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
                const expected: number = 2;

                Random.randomNumberGenerator = (): number => {
                    return expected;
                };

                for (let i: number = 0; i < testRepeatTotal; i++) {
                    expect(Random.randomFloat(0, 1)).toBe(expected);
                }
            });

            test('randomInt', (): void => {
                const random: number = 2.5;
                const expected: number = Math.floor(random);

                Random.randomNumberGenerator = (): number => {
                    return random;
                };

                for (let i: number = 0; i < testRepeatTotal; i++) {
                    expect(Random.randomInt(0, 1)).toBe(expected);
                }
            });

            test('randomInteger', (): void => {
                const random: number = 3.5;
                const expected: number = Math.floor(random);

                Random.randomNumberGenerator = (): number => {
                    return random;
                };

                for (let i: number = 0; i < testRepeatTotal; i++) {
                    expect(Random.randomInteger(0, 1)).toBe(expected);
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
                )('%# - Random.randomNumberGenerator = %o should throw a TypeError', (input: unknown): void => {
                    expect((): void => {
                        Random.randomNumberGenerator = input as (() => number);
                    }).toThrow(TypeError);
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

        describe('randomFloat should return min when min and max are equal', (): void => {
            test.each([
                { min: 0, max: 0 },
                { min: 1, max: 1 },
                { min: 10, max: 10 },
                { min: -10, max: -10 },
                { min: 0.5, max: 0.5 },
                { min: -0.5, max: -0.5 }
            ])('%# - randomFloat($min, $max) should return $min', ({ min, max }: { min: number; max: number; }): void => {
                const numbers: number[] = [];

                for (let i: number = 0; i < testRepeatTotal; i++) {
                    const r: number = Random.randomFloat(min, max);
                    numbers.push(r);
                }

                validateRandomFloatValues(numbers, min, max);
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

        describe('randomInt and randomInteger should return a number between Math.floor(min) and Math.floor(max) when the given min and max are float number types', (): void => {
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
                { min: -0.5, max: 0 },
                { min: -3.75, max: -0.5 },
                { min: -100.777, max: 100.222 },
                { min: -0.5, max: 0.5 }
            ])('%# - randomInt($min, $max) and randomInteger($min, $max) should return a number between Math.floor($min) and Math.floor($max)', ({ min, max }: { min: number; max: number; }): void => {
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

        describe('randomInt and randomInteger should return min when min and max are equal', (): void => {
            test.each([
                { min: 0, max: 0 },
                { min: 1, max: 1 },
                { min: -1, max: -1 },
                { min: 10, max: 10 },
                { min: -10, max: -10 }
            ])('%# - randomInt($min, $max) and randomInteger($min, $max) should return $min', ({ min, max }: { min: number; max: number; }): void => {
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

        describe('randomInt and randomInteger should return Math.floor(min) when min and max are equal and float number types', (): void => {
            test.each([
                { min: 1.8, max: 1.8 },
                { min: 10.5, max: 10.5 },
                { min: -10.5, max: -10.5 },
                { min: 0.5, max: 0.5 },
                { min: -0.5, max: -0.5 }
            ])('%# - randomInt($min, $max) and randomInteger($min, $max) should return Math.floor($min)', ({ min, max }: { min: number; max: number; }): void => {
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

        describe('randomInt and randomInteger should return Math.floor(min) when Math.floor(min) and Math.floor(max) are equal', (): void => {
            test.each([
                { min: 1.5, max: 1.89 },
                { min: 10.01, max: 10.99 },
                { min: 10.001, max: 10.999 },
                { min: -10.4, max: -10.25 },
                { min: 0.5, max: 0.75 },
                { min: 0.99, max: 0.999 },
                { min: -0.999, max: -0.99 }
            ])('%# - randomInt($min, $max) and randomInteger($min, $max) should return Math.floor($min)', ({ min, max }: { min: number; max: number; }): void => {
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

        describe('Chance of true validation', (): void => {
            const scenarios: Scenario[] = [
                {
                    label: 'Non-number type inputs',
                    inputs: [...nonNumberInputs.filter((input: unknown): boolean => input !== undefined)],
                    expected: TypeError
                },
                {
                    label: 'Non-finite number inputs',
                    inputs: [...nonFiniteNumberInputs],
                    expected: TypeError
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
                    expected: RangeError
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

        describe('Input validation', (): void => {
            describe('Input must be a non-empty array', (): void => {
                const scenarios: Scenario[] = [
                    {
                        label: 'Non-array type inputs',
                        inputs: [...nonArrayInputs],
                        expected: TypeError
                    },
                    {
                        label: 'Empty array input',
                        inputs: [
                            []
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
        describe('randomWeightedElement should return an element from the given list with the proper element type', (): void => {
            test.each([
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
            ])('%# - randomWeightedElement($input) should return an element from ($input)', ({ input, type }: { input: { value: unknown; weight: number; }[]; type: string; }): void => {
                const selected: unknown[] = [];
                const repeatTotal: number = Math.max(testRepeatTotal, input.length * 6);
                const weightedElements: WeightedList<unknown> = WeightedElementUtility.buildWeightedList(input);
                const expectedElements: unknown[] = input.map((item: { value: unknown; weight: number; }): unknown => item.value);

                for (let i: number = 0; i < repeatTotal; i++) {
                    selected.push(Random.randomWeightedElement(weightedElements));
                }

                validateRandomElements(selected, expectedElements, type);
            });
        });

        describe('randomWeightedElement should not return an element from the given list if the weight is zero', (): void => {
            test.each([
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
            ])('%# - randomWeightedElement should not return an element from ($input) if the weight is zero', ({ input, expected, type }: { input: { value: unknown; weight: number; }[]; expected: unknown[]; type: string; }): void => {
                const selected: unknown[] = [];
                const repeatTotal: number = Math.max(testRepeatTotal, input.length * 10);
                const weightedElements: WeightedList<unknown> = WeightedElementUtility.buildWeightedList(input);

                for (let i: number = 0; i < repeatTotal; i++) {
                    selected.push(Random.randomWeightedElement(weightedElements));
                }

                validateRandomElements(selected, expected, type);
            });
        });

        describe('randomWeightedElement should return a fallback element if the randomNumberGenerator returns a number outside the range of 0 to 1', (): void => {
            describe.each([
                {
                    input: [
                        { value: 1, weight: 0.25 },
                        { value: 2, weight: 0.25 },
                        { value: 3, weight: 0.25 },
                        { value: 4, weight: 0.25 }
                    ]
                },
                {
                    input: [
                        { value: 1, weight: 0.5 },
                        { value: 2, weight: 0.2 },
                        { value: 3, weight: 0.2 },
                        { value: 4, weight: 0.1 }
                    ]
                },
                {
                    input: [
                        { value: 1.1, weight: 0.25 },
                        { value: 2.2, weight: 0.25 },
                        { value: 3.3, weight: 0.25 },
                        { value: 4.4, weight: 0.25 }
                    ]
                },
                {
                    input: [
                        { value: 1, weight: 1 }
                    ]
                },
                {
                    input: [
                        { value: 'it', weight: 0.25 },
                        { value: 'was', weight: 0.25 },
                        { value: 'the', weight: 0.25 },
                        { value: 'best', weight: 0.25 }
                    ]
                },
                {
                    input: [
                        { value: 'see', weight: 0.33 },
                        { value: 'spot', weight: 0.33 },
                        { value: 'run', weight: 0.34 }
                    ]
                },
                {
                    input: [
                        { value: 'hello', weight: 1 }
                    ]
                },
                {
                    input: [
                        { value: 1, weight: 0.25 },
                        { value: 2, weight: 0 },
                        { value: 3, weight: 0.25 },
                        { value: 4, weight: 0.25 },
                        { value: 5, weight: 0.25 }
                    ]
                },
                {
                    input: [
                        { value: 1, weight: 0.5 },
                        { value: 2, weight: 0 },
                        { value: 3, weight: 0.3 },
                        { value: 4, weight: 0.2 }
                    ]
                },
                {
                    input: [
                        { value: 1, weight: 0 },
                        { value: 2, weight: 0.3 },
                        { value: 3, weight: 0.3 },
                        { value: 4, weight: 0.4 }
                    ]
                },
                {
                    input: [
                        { value: 1, weight: 0.4 },
                        { value: 2, weight: 0.3 },
                        { value: 3, weight: 0.3 },
                        { value: 4, weight: 0 }
                    ]
                },
                {
                    input: [
                        { value: 1.1, weight: 0 },
                        { value: 2.2, weight: 0.25 },
                        { value: 3.3, weight: 0.25 },
                        { value: 4.4, weight: 0.5 }
                    ]
                },
                {
                    input: [
                        { value: 'it', weight: 0.2 },
                        { value: 'was', weight: 0.4 },
                        { value: 'the', weight: 0 },
                        { value: 'best', weight: 0.4 }
                    ]
                }
            ])('%# - randomWeightedElement($input) with a randomNumberGenerator outside the range of 0 to 1', ({ input }: { input: { value: unknown; weight: number; }[]; }): void => {
                test('Should return elements[0] if the rng function returns a negative number', (): void => {
                    Random.randomNumberGenerator = (): number => {
                        return -0.1;
                    };

                    const weightedElements: WeightedList<unknown> = WeightedElementUtility.buildWeightedList(input);
                    const selected: unknown = Random.randomWeightedElement(weightedElements);
                    expect(selected).toBe(input[0].value);
                });

                test('Should return elements[length - 1] if the rng function returns a number greater than 1', (): void => {
                    Random.randomNumberGenerator = (): number => {
                        return 1.1;
                    };

                    const weightedElements: WeightedList<unknown> = WeightedElementUtility.buildWeightedList(input);
                    const selected: unknown = Random.randomWeightedElement(weightedElements);
                    expect(selected).toBe(input[input.length - 1].value);
                });
            });
        });
    });

    describe('Range input validation', (): void => {
        describe('Min and max range validation', (): void => {
            describe('Min and max parameters must be a finite number', (): void => {
                const scenarios: Scenario[] = [
                    {
                        label: 'Non-number inputs',
                        inputs: [...nonNumberInputs],
                        expected: TypeError
                    },
                    {
                        label: 'Non-finite number inputs',
                        inputs: [...nonFiniteNumberInputs],
                        expected: TypeError
                    }
                ];

                describe.each(
                    scenarios
                )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                    const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                    describe('Min parameter validation', (): void => {
                        test.each(
                            testCases
                        )('%# - Min ($input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                            expect((): void => {
                                Random.randomFloat(testInput as number, Number.MAX_SAFE_INTEGER);
                            }).toThrow(testExpected);

                            expect((): void => {
                                Random.randomInt(testInput as number, Number.MAX_SAFE_INTEGER);
                            }).toThrow(testExpected);

                            expect((): void => {
                                Random.randomInteger(testInput as number, Number.MAX_SAFE_INTEGER);
                            }).toThrow(testExpected);
                        });
                    });

                    describe('Max parameter validation', (): void => {
                        test.each(
                            testCases
                        )('%# - Max ($input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                            expect((): void => {
                                Random.randomFloat(Number.MIN_SAFE_INTEGER, testInput as number);
                            }).toThrow(testExpected);

                            expect((): void => {
                                Random.randomInt(Number.MIN_SAFE_INTEGER, testInput as number);
                            }).toThrow(testExpected);

                            expect((): void => {
                                Random.randomInteger(Number.MIN_SAFE_INTEGER, testInput as number);
                            }).toThrow(testExpected);
                        });
                    });
                });
            });

            describe('Min must be less than max', (): void => {
                const scenarios: Scenario[] = [
                    {
                        label: 'Integer min and max',
                        inputs: [
                            { min: 0, max: -1 },
                            { min: 10, max: 9 },
                            { min: 10, max: 0 },
                            { min: 10, max: 1 },
                            { min: 10, max: -10 },
                            { min: -10, max: -11 },
                            { min: -10, max: -20 }
                        ],
                        expected: RangeError
                    },
                    {
                        label: 'Float min and max',
                        inputs: [
                            { min: 0.123, max: -1.123 },
                            { min: 10.123, max: 9.123 },
                            { min: 10.123, max: 0.123 },
                            { min: 10.123, max: 1.123 },
                            { min: 10.123, max: -10.123 },
                            { min: -10.123, max: -11.123 },
                            { min: -10.123, max: -20.123 }
                        ],
                        expected: RangeError
                    },
                    {
                        label: 'Float min and max with equal floors',
                        inputs: [
                            { min: 0.456, max: 0.123 },
                            { min: 10.456, max: 10.1234 },
                            { min: -10.123, max: -10.456 }
                        ],
                        expected: RangeError
                    }
                ];

                describe.each(
                    scenarios
                )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                    const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                    describe('randomFloat', (): void => {
                        test.each(
                            testCases
                        )('%# - randomFloat with input ($input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                            const { min, max } = testInput as { min: number; max: number; };
                            expect((): void => {
                                Random.randomFloat(min, max);
                            }).toThrow(testExpected);
                        });
                    });

                    describe('randomInt', (): void => {
                        test.each(
                            testCases
                        )('%# - randomInt with input ($input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                            const { min, max } = testInput as { min: number; max: number; };
                            expect((): void => {
                                Random.randomInt(min, max);
                            }).toThrow(testExpected);
                        });
                    });

                    describe('randomInteger', (): void => {
                        test.each(
                            testCases
                        )('%# - randomInteger with input ($input) should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                            const { min, max } = testInput as { min: number; max: number; };
                            expect((): void => {
                                Random.randomInteger(min, max);
                            }).toThrow(testExpected);
                        });
                    });
                });
            });
        });
    });
});
