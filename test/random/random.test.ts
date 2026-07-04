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

import { Random } from '../../src';

describe('Random', (): void => {
    const testRepeatTotal: number = 20;

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

        describe('Setting random number generator with a seeded pseudorandom number generator', (): void => {
            test.todo('Setting random number generator with a seeded pseudorandom number generator');
        });

        describe('Input validation', (): void => {
            test.todo('Input validation');
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
            ])('randomFloat($min, $max) should return a number between $min and $max', ({ min, max }: { min: number; max: number; }): void => {
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
            ])('randomFloat($min, $max) should return $min', ({ min, max }: { min: number; max: number; }): void => {
                const numbers: number[] = [];

                for (let i: number = 0; i < testRepeatTotal; i++) {
                    const r: number = Random.randomFloat(min, max);
                    numbers.push(r);
                }

                validateRandomFloatValues(numbers, min, max);
            });
        });

        test.todo('Input validation');
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
            ])('randomInt($min, $max) and randomInteger($min, $max) should return a number between $min and $max', ({ min, max }: { min: number; max: number; }): void => {
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
            ])('randomInt($min, $max) and randomInteger($min, $max) should return a number between Math.floor($min) and Math.floor($max)', ({ min, max }: { min: number; max: number; }): void => {
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
                { min: -10, max: -10 },
            ])('randomInt($min, $max) and randomInteger($min, $max) should return $min', ({ min, max }: { min: number; max: number; }): void => {
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
            ])('randomInt($min, $max) and randomInteger($min, $max) should return Math.floor($min)', ({ min, max }: { min: number; max: number; }): void => {
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
                { min: -0.99, max: -0.999 }
            ])('randomInt($min, $max) and randomInteger($min, $max) should return Math.floor($min)', ({ min, max }: { min: number; max: number; }): void => {
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

        test.todo('Input validation');
    });
});
