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

import { describe, test, afterEach, expect } from 'vitest';

import { Random } from '../../src';

describe('Random', (): void => {
    const testRepeatTotal: number = 20;

    afterEach((): void => {
        Random.randomNumberGenerator = Math.random;
    });

    describe('new Random()', (): void => {
        describe('Runtime behavior guards', (): void => {
            test('Constructor should throw an error when instantiated at runtime', (): void => {
                const RuntimeConstructor = Random as unknown as new () => Random;
                expect((): Random => new RuntimeConstructor()).toThrow(Error);
            });
        });
    });

    describe('Random.randomNumberGenerator', (): void => {
        describe('Setting random number generator should impact the values returned by all other methods', (): void => {
            test('random', (): void => {
                const expected: number = 1.5;

                Random.randomNumberGenerator = (): number => {
                    return expected;
                }

                for (let i: number = 0; i < testRepeatTotal; i++) {
                    expect(Random.random()).toBe(expected);
                }
            });

            test.todo('randomFloat');

            test.todo('randomInt');
        });

        describe('Setting random number generator with a seeded pseudorandom number generator', (): void => {
            test.todo('Setting random number generator with a seeded pseudorandom number generator');
        });

        describe('Input validation', (): void => {
            test.todo('Input validation');
        });
    });
});
