/*
 * Copyright (c) 2024-2026 Brittni Watkins.
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

import { NumberUtility } from '../number';

/**
 * Static properties and methods for generating random numbers and booleans, and for selecting random elements from arrays.
 *
 * @since 0.1.0
 */
export class Random {
    /**
     * The primary function used to generate random numbers.
     * By default, this is set to `Math.random`, but it can be overridden for testing or seeded pseudorandom number generation.
     *
     * @default Math.random
     *
     * @type {() => number}
     * @private
     */
    static #rand: () => number = Math.random;

    /**
     * @throws {Error} - Random is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new Error('Random is a static class and cannot be instantiated.');
    }

    /**
     * Set the primary function used to generate random numbers.
     *
     * @param {() => number} rand - A function that returns a random number in the range [0, 1) (zero inclusive, one exclusive).
     *
     * @throws {TypeError} - If the given rand is not a function.
     *
     * @public
     * @since 0.1.0
     */
    public static set rand(rand: () => number) {
        if (typeof rand !== 'function') {
            throw new TypeError('rand must be a function');
        }

        Random.#rand = rand;
    }

    /**
     * @returns {number} A random number in the range [0, 1) (zero inclusive, one exclusive).
     *
     * @public
     * @since 0.1.0
     */
    public static random(): number {
        return Random.#rand();
    }

    /**
     * @param {number} min - The minimum value (inclusive).
     * @param {number} max - The maximum value (exclusive).
     *
     * @returns {number} A random floating-point number in the range [min, max) (min inclusive, max exclusive).
     *
     * @public
     * @since 0.1.0
     */
    public static randomFloat(min: number, max: number): number {
        Random.#validateRange(min, max);
        return (Random.random() * (max - min)) + min;
    }

    /**
     * @param {number} min - The minimum value (inclusive).
     * @param {number} max - The maximum value (exclusive).
     *
     * @returns {number} A random integer in the range [min, max) (min inclusive, max exclusive).
     *
     * @public
     * @since 0.1.0
     */
    public static randomInt(min: number, max: number): number {
        Random.#validateRange(min, max);
        return Math.floor(Random.randomFloat(min, max));
    }

    /**
     * @param {number} chanceOfTrue - The probability of returning true (between 0 and 1).
     *
     * @returns {boolean} A random boolean value.
     *
     * @public
     * @since 0.1.0
     */
    public static randomBoolean(chanceOfTrue: number = 0.5): boolean {
        Random.#validateChanceOfTrue(chanceOfTrue);
        return Random.random() < chanceOfTrue;
    }

    /**
     * @param {Type[]} elements - An array of elements to choose from.
     *
     * @returns {Type} A random element from the array.
     *
     * @public
     * @since 0.1.0
     */
    public static randomElement<Type>(elements: Type[]): Type {
        Random.#validateElements(elements);
        return elements[Random.randomInt(0, elements.length)];
    }

    /**
     * Validate min and max values for random number generation.
     *
     * @see {@link NumberUtility.isFiniteNumber}
     *
     * @param {unknown} min - Minimum value to validate. Should be a finite number less than or equal to the given max.
     * @param {unknown} max - Maximum value to validate. Should be a finite number greater than or equal to the given min.
     *
     * @throws {TypeError} - When the given min is not a finite number.
     * @throws {TypeError} - When the given max is not a finite number.
     * @throws {RangeError} - When the given min is not less than or equal to the given max.
     *
     * @private
     */
    static #validateRange(min: unknown, max: unknown): void {
        if (!NumberUtility.isFiniteNumber(min)) {
            throw new TypeError('min must be a finite number');
        }

        if (!NumberUtility.isFiniteNumber(max)) {
            throw new TypeError('max must be a finite number');
        }

        if (min > max) {
            throw new RangeError(`min (${min}) must be less than max (${max})`);
        }
    }

    /**
     * Validate chanceOfTrue input for random boolean generation.
     *
     * @param {unknown} chanceOfTrue - Chance of returning true. Should be a finite number between 0 and 1 (inclusive).
     *
     * @throws {TypeError} - When the given chanceOfTrue is not a finite number.
     * @throws {RangeError} - When the given chanceOfTrue is not between 0 and 1 (inclusive).
     *
     * @private
     */
    static #validateChanceOfTrue(chanceOfTrue: unknown): void {
        if (!NumberUtility.isFiniteNumber(chanceOfTrue)) {
            throw new TypeError('chanceOfTrue must be a finite number');
        }

        if (chanceOfTrue < 0 || chanceOfTrue > 1) {
            throw new RangeError(`chance (${chanceOfTrue}) must be between 0 and 1`);
        }
    }

    /**
     * Validate elements input for random element selection.
     *
     * @param {unknown} elements - Elements to select from. Should be a non-empty array.
     *
     * @throws {TypeError} - When the given elements is not a non-empty array.
     *
     * @private
     */
    static #validateElements(elements: unknown): void {
        if (!elements || !Array.isArray(elements) || elements.length === 0) {
            throw new TypeError('elements must be a non-empty array');
        }
    }
}
