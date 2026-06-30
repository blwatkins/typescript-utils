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
        for (const num of numbers) {
            expectTypeOf(num).toBeNumber();
            expect(num).not.toBeNaN();
            expect(num).toBeGreaterThanOrEqual(min);
            expect(num).toBeLessThan(max);
        }

        const numbersSet: Set<number> = new Set<number>(numbers);
        expect(numbersSet.size).toBe(numbers.length);
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
                { min: -500, max: -100 }
            ])('randomFloat($min, $max) should return a number between $min and $max', ({ min, max }: { min: number; max: number; }): void => {
                const numbers: number[] = [];

                for (let i: number = 0; i < testRepeatTotal; i++) {
                    const r: number = Random.randomFloat(min, max);
                    numbers.push(r);
                }

                validateRandomFloatValues(numbers, min, max);
            });
        });

        test.todo('randomFloat should return min when min and max are equal');

        test.todo('Input validation');
    });
});
