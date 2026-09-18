/*
 * Copyright (c) 2022-2026 Brittni Watkins.
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

import { TypeAssertions } from '../assert';
import { PrimitiveTypeError, StaticInstanceError, ValueRangeError } from '../error';
import { NumberUtility } from '../number';

import { WeightedList, WeightedListUtility } from './weighted-element';

/**
 * The maximum number of times {@link Random.randomFloat} draws a new value when a draw falls outside
 * the range.
 *
 * @default 10
 *
 * @type {number}
 * @private
 */
const maxDrawAttempts: number = 10;

/**
 * Static properties and methods for generating random values and for selecting random elements from arrays.
 *
 * @since 0.1.0
 */
export class Random {
    /**
     * The primary function used to generate random numbers.
     * By default, this is set to {@link Math.random}, but it can be overridden for testing or seeded pseudorandom number generation.
     *
     * @default {@link Math.random}
     *
     * @type {() => number}
     * @private
     */
    static #rng: () => number = Math.random;

    /**
     * Private constructor.
     *
     * @throws {StaticInstanceError} When class is instantiated.
     * {@link Random} is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new StaticInstanceError('Random is a static class and cannot be instantiated.');
    }

    /**
     * Set the primary function used to generate random numbers.
     *
     * @param {() => number} rng - A function that returns a random number in the range [0, 1) (zero inclusive, one exclusive).
     *
     * @throws {PrimitiveTypeError} When `rng` is not a function.
     *
     * @public
     * @since 0.1.0
     */
    public static set randomNumberGenerator(rng: () => number) {
        TypeAssertions.assertFunction(rng, 'rng must be a function.');
        Random.#rng = rng;
    }

    /**
     * Get a random number.
     *
     * @returns {number} A random number in the range [0, 1) (zero inclusive, one exclusive).
     *
     * @public
     * @since 0.1.0
     */
    public static random(): number {
        return Random.#rng();
    }

    /**
     * Get a random floating-point number within the range [min, max) (min inclusive, max exclusive).
     *
     * @remarks This method draws a random floating-point number, then checks to ensure it does not round to a value outside the range.
     * A draw that falls outside the range is discarded and replaced.
     * When no draw succeeds, `min` is returned.
     *
     * @param {number} min - The inclusive minimum value.
     * @param {number} max - The exclusive maximum value.
     *
     * @returns {number} A random floating-point number in the range [min, max) (min inclusive, max exclusive), or `min` if no draw succeeds.
     *
     * @throws {PrimitiveTypeError} When `min` and `max` are not both numbers within the safe integer range.
     * @throws {ValueRangeError} When `min` is not less than `max`.
     *
     * @public
     * @since 0.1.0
     */
    public static randomFloat(min: number, max: number): number {
        return Random.#drawValidRandomFloat(min, max);
    }

    /**
     * Get a random integer within the range [min, max) (min inclusive, max exclusive).
     *
     * @remarks Non-integer bounds are rounded inward to the smallest and largest integers that the range contains.
     * A range that contains no integer values, such as [1.5, 1.89) will throw a {@link ValueRangeError}.
     *
     * @param {number} min - The inclusive minimum value.
     * @param {number} max - The exclusive maximum value.
     *
     * @returns {number} A random integer within the range [min, max) (min inclusive, max exclusive).
     *
     * @throws {PrimitiveTypeError} When `min` and `max` are not both numbers within the safe integer range.
     * @throws {ValueRangeError} When `min` is not less than `max`.
     * @throws {ValueRangeError} When the range contains no integer values.
     *
     * @public
     * @since 0.1.0
     */
    public static randomInt(min: number, max: number): number {
        NumberUtility.assertSafe(min, 'min must be within the safe integer range.');
        NumberUtility.assertSafe(max, 'max must be within the safe integer range.');
        NumberUtility.assertLessThan(min, max, 'min must be less than max.');

        const lowest: number = Math.ceil(min);
        const highest: number = Math.ceil(max) - 1;

        if (lowest > highest) {
            throw new ValueRangeError('The range contains no integer values.');
        }

        return Math.floor(Random.randomFloat(lowest, highest + 1));
    }

    /**
     * Get a random boolean.
     *
     * @param {number} chanceOfTrue - The probability of returning `true` (between 0 and 1).
     * Default value is `0.5`.
     *
     * @returns {boolean} A random boolean value.
     *
     * @throws {PrimitiveTypeError} When `chanceOfTrue` is not a number within the safe integer range.
     * @throws {ValueRangeError} When `chanceOfTrue` is not in the range [0, 1] (inclusive).
     *
     * @public
     * @since 0.1.0
     */
    public static randomBoolean(chanceOfTrue: number = 0.5): boolean {
        NumberUtility.assertInRange(chanceOfTrue, 0, 1, 'chanceOfTrue must be between 0 and 1.');
        return Random.random() < chanceOfTrue;
    }

    /**
     * Get a random element.
     *
     * @param {Type[]} elements - An array of elements to choose from.
     *
     * @returns {Type} A random element from `elements`.
     *
     * @throws {PrimitiveTypeError} When `elements` is not a non-empty array.
     *
     * @public
     * @since 0.1.0
     */
    public static randomElement<Type>(elements: Type[]): Type {
        TypeAssertions.assertArray(elements);

        if (elements.length === 0) {
            throw new PrimitiveTypeError('elements must be a non-empty array.');
        }

        return elements[Random.randomInt(0, elements.length)];
    }

    /**
     * Get a random element from a non-uniform distribution.
     *
     * @remarks For a {@link WeightedList} to be valid, it must be a non-empty array of {@link WeightedElement} objects, where the sum of {@link WeightedElement.weight} properties in the array is equal to 1.
     *
     * @see {@link WeightedListUtility.isGenericWeightedList}
     * @see {@link WeightedElementUtility.isGenericWeightedElement}
     *
     * @param {WeightedList} elements - The {@link WeightedList} to select a random element from.
     *
     * @returns {Type} A random element from `elements`, where the selection probability is equal to the {@link WeightedElement.weight} of each element.
     *
     * @throws {SchemaTypeError} When `elements` is not a valid {@link WeightedList} object.
     *
     * @public
     * @since 0.1.0
     */
    public static randomWeightedElement<Type>(elements: WeightedList<Type>): Type {
        WeightedListUtility.assertGenericWeightedList(elements);
        const r: number = Random.random();
        let cumulativeWeight: number = 0;

        for (const element of elements) {
            cumulativeWeight += element.weight;
            if (r < cumulativeWeight) {
                return element.value;
            }
        }

        return elements[elements.length - 1].value;
    }

    /**
     * Draw a random float within the range [`min`, `max`) (`min` inclusive, `max` exclusive), discarding
     * a draw that falls outside the range.
     *
     * @see {@link Random.randomFloat}
     *
     * @param {number} min - The inclusive minimum value.
     * @param {number} max - The exclusive maximum value.
     *
     * @returns {number} A random floating-point number in the range [min, max) (min inclusive, max exclusive), or `min` if no draw succeeds.
     *
     * @private
     */
    static #drawValidRandomFloat(min: number, max: number): number {
        NumberUtility.assertSafe(min, 'min must be within the safe integer range.');
        NumberUtility.assertSafe(max, 'max must be within the safe integer range.');
        NumberUtility.assertLessThan(min, max, 'min must be less than max.');

        let value: number = Random.#draw(min, max);
        let attempts: number = 1;

        while (!Random.#isInRange(value, min, max) && (attempts < maxDrawAttempts)) {
            value = Random.#draw(min, max);
            attempts++;
        }

        if (!Random.#isInRange(value, min, max)) {
            return min;
        }

        return value;
    }

    /**
     * Get a random float within the range [`min`, `max`) (`min` inclusive, `max` exclusive).
     *
     * @remarks This method assumes that `min` and `max` are finite numbers, where `min` is less than `max`.
     *
     * @param {number} min - The inclusive minimum value.
     * @param {number} max - The exclusive maximum value.
     *
     * @returns {number} A random float within the specified range.
     *
     * @private
     */
    static #draw(min: number, max: number): number {
        return (Random.random() * (max - min)) + min;
    }

    /**
     * Is `value` within the range [`min`, `max`) (`min` inclusive, `max` exclusive)?
     *
     * @remarks This method assumes that `value`, `min`, and `max` are finite numbers, where `min` is less than `max`.
     *
     * @param {number} value - The value to check.
     * @param {number} min - The inclusive minimum value.
     * @param {number} max - The exclusive maximum value.
     *
     * @returns {boolean} `true` if `value` is greater than or equal to `min` and less than `max`; `false` otherwise.
     *
     * @private
     */
    static #isInRange(value: number, min: number, max: number): boolean {
        return value >= min && value < max;
    }

    /* ******************* TODO: DEPRECATED ******************* */

    /**
     * Get a random integer within the range [min, max) (min inclusive, max exclusive).
     *
     * @remarks Non-integer bounds are rounded inward to the smallest and largest integers that the range contains.
     * A range that contains no integer values, such as [1.5, 1.89) will throw a {@link ValueRangeError}.
     *
     * @see {@link Random.randomInt}
     *
     * @param {number} min - The inclusive minimum value.
     * @param {number} max - The exclusive maximum value.
     *
     * @returns {number} A random integer within the range [min, max) (min inclusive, max exclusive).
     *
     * @throws {PrimitiveTypeError} When `min` and `max` are not both numbers within the safe integer range.
     * @throws {ValueRangeError} When `min` is not less than `max`.
     * @throws {ValueRangeError} When the range contains no integer values.
     *
     * @deprecated Replaced by {@link Random.randomInt}. Will be removed in v0.1.0-alpha.5.
     *
     * @public
     * @since 0.1.0
     */
    public static randomInteger(min: number, max: number): number {
        return Random.randomInt(min, max);
    }
}
