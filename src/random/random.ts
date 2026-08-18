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
 */

import { TypeAssertions } from '../assert';
import { PrimitiveTypeError, StaticInstanceError } from '../error';
import { NumberUtility } from '../number';

import { WeightedList, WeightedListUtility } from './weighted-element';

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
     * @throws {PrimitiveTypeError} When the given random number generator is not a function.
     *
     * @public
     * @since 0.1.0
     */
    public static set randomNumberGenerator(rng: () => number) {
        TypeAssertions.assertFunctionType(rng, 'Random number generator must be a function.');
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
     * Get a random floating-point number within the given range.
     *
     * @param {number} min - The minimum value (inclusive).
     * @param {number} max - The maximum value (exclusive).
     *
     * @returns {number} A random floating-point number in the range [min, max) (min inclusive, max exclusive).
     *
     * @throws {PrimitiveTypeError} When `min` is not a finite number.
     * @throws {PrimitiveTypeError} When `max` is not a finite number.
     * @throws {ValueRangeError} When `min` is not less than or equal `max`.
     *
     * @public
     * @since 0.1.0
     */
    public static randomFloat(min: number, max: number): number {
        NumberUtility.assertValidRange(min, max);
        return (Random.random() * (max - min)) + min;
    }

    /**
     * Get a random integer within the given range.
     * If `min` or `max` is not an integer, it is rounded down with `Math.floor` before a value is generated.
     *
     * @param {number} min - The minimum value (inclusive).
     * Non-integer values are rounded down with `Math.floor`.
     * @param {number} max - The maximum value (exclusive).
     * Non-integer values are rounded down with `Math.floor`.
     *
     * @returns {number} A random integer in the range [Math.floor(min), Math.floor(max)) (min inclusive, max exclusive).
     *
     * @throws {PrimitiveTypeError} When `min` is not a finite number.
     * @throws {PrimitiveTypeError} When `max` is not a finite number.
     * @throws {ValueRangeError} When `min` is not less than or equal `max`.
     *
     * @public
     * @since 0.1.0
     */
    public static randomInt(min: number, max: number): number {
        NumberUtility.assertValidRange(min, max);
        const floorMin: number = Math.floor(min);
        const floorMax: number = Math.floor(max);
        return Math.floor(Random.randomFloat(floorMin, floorMax));
    }

    /**
     * Get a random integer within the given range.
     * If `min` or `max` is not an integer, it is rounded down with `Math.floor` before a value is generated.
     *
     * @see {@link Random.randomInt}
     *
     * @param {number} min - The minimum value (inclusive).
     * Non-integer values are rounded down with `Math.floor`.
     * @param {number} max - The maximum value (exclusive).
     * Non-integer values are rounded down with `Math.floor`.
     *
     * @returns {number} A random integer in the range [Math.floor(min), Math.floor(max)) (min inclusive, max exclusive).
     *
     * @throws {PrimitiveTypeError} When `min` is not a finite number.
     * @throws {PrimitiveTypeError} When `max` is not a finite number.
     * @throws {ValueRangeError} When `min` is not less than or equal `max`.
     *
     * @public
     * @since 0.1.0
     */
    public static randomInteger(min: number, max: number): number {
        return Random.randomInt(min, max);
    }

    /**
     * Get a random boolean.
     *
     * @param {number} chanceOfTrue - The probability of returning `true` (between 0 and 1).
     * Default value is `0.5`.
     *
     * @returns {boolean} A random boolean value.
     *
     * @throws {PrimitiveTypeError} When `chanceOfTrue` is not a finite number.
     * @throws {ValueRangeError} When `chanceOfTrue` is not in the range [0, 1] (inclusive).
     *
     * @public
     * @since 0.1.0
     */
    public static randomBoolean(chanceOfTrue: number = 0.5): boolean {
        NumberUtility.assertInRange(chanceOfTrue, 0, 1, 'Chance of true must be between 0 and 1.');
        return Random.random() < chanceOfTrue;
    }

    /**
     * Get a random element from the given array.
     *
     * @param {Type[]} elements - An array of elements to choose from.
     *
     * @returns {Type} A random element from the array.
     *
     * @throws {PrimitiveTypeError} When elements is not a non-empty array.
     *
     * @public
     * @since 0.1.0
     */
    public static randomElement<Type>(elements: Type[]): Type {
        TypeAssertions.assertArrayType(elements);

        if (elements.length === 0) {
            throw new PrimitiveTypeError('Elements must be a non-empty array.');
        }

        return elements[Random.randomInt(0, elements.length)];
    }

    /**
     * Get a random element from the given {@link WeightedList}.
     *
     * @see {@link WeightedListUtility.isGenericWeightedList}
     * @see {@link WeightedElementUtility.isGenericWeightedElement}
     *
     * @param {WeightedList} elements - The {@link WeightedList} to select a random element from.
     *
     * @returns {Type} A random element from the given {@link WeightedList}, where the selection probability is equal to the {@link WeightedElement.weight} of each element.
     *
     * @throws {SchemaTypeError} When the given list is not a valid {@link WeightedList}.
     * For a {@link WeightedList} to be valid, it must be a non-empty array of {@link WeightedElement} objects, where the sum of {@link WeightedElement.weight} properties in the array is equal to 1.
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
}
