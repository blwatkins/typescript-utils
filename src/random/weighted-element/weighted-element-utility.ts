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

import Value from 'typebox/value';

import { Type } from 'typebox';

import { TypeAssertions } from '../../assert';
import { SchemaTypeError, StaticInstanceError } from '../../error';
import { StringUtility } from '../../string';

import { WeightedElement, weightedElementSchema } from './weighted-element';

/**
 * Static methods and properties for validating {@link WeightedElement} objects.
 *
 * @since 0.1.0
 */
export class WeightedElementUtility {
    /**
     * Private constructor.
     *
     * @throws {StaticInstanceError} When class is instantiated.
     * {@link WeightedElementUtility} is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new StaticInstanceError('WeightedElementUtility is a static class and cannot be instantiated.');
    }

    /**
     * Assert that `input` is a valid generic {@link WeightedElement} object.
     *
     * @remarks This method does not enforce type checking for {@link WeightedElement.value}.
     * For a {@link WeightedElement} object to be valid, its {@link WeightedElement.weight} must be a finite number between {@link minWeight} and {@link maxWeight}, inclusive.
     *
     * @see {@link WeightedElementUtility.isGenericWeightedElement}
     *
     * @param {unknown} input - The input to check.
     * @param {string|undefined} message - Optional message for the error thrown when `input` is not a valid generic {@link WeightedElement} object.
     *
     * @returns {asserts input is WeightedElement<unknown>} Asserts that `input` is a valid generic {@link WeightedElement} object.
     *
     * @throws {SchemaTypeError} When `input` is not a valid generic {@link WeightedElement} object.
     *
     * @public
     * @since 0.1.0
     */
    public static assertGenericWeightedElement(input: unknown, message?: string): asserts input is WeightedElement<unknown> {
        if (!WeightedElementUtility.isGenericWeightedElement(input)) {
            if (StringUtility.isSingleLineTrimmedString(message)) {
                throw new SchemaTypeError(message);
            }

            throw new SchemaTypeError('Input does not match schema requirements for generic WeightedElement.');
        }
    }

    /**
     * Assert that `input` is valid a {@link WeightedElement} object.
     *
     * @remarks For a {@link WeightedElement} object to be valid, its {@link WeightedElement.weight} must be a finite number between {@link minWeight} and {@link maxWeight}, inclusive.
     *
     * @see {@link WeightedElementUtility.isWeightedElement}
     *
     * @template TValue The type of the value property of the {@link WeightedElement} object.
     *
     * @param {unknown} input - The input to check.
     * @param {(value: unknown) => value is TValue} valueTypeGuard - The type guard function used to validate the type or schema of {@link WeightedElement.value}.
     * This method should return `true` if the {@link WeightedElement.value} property matches the expected type or schema, and `false` otherwise.
     * The type validated by the function should match the assigned type of the {@link WeightedElement}.
     * @param {string|undefined} message - Optional message for the error thrown when `input` is not a valid {@link WeightedElement} object.
     *
     * @returns {asserts input is WeightedElement<TValue>} Asserts that `input` is a valid {@link WeightedElement} object whose value matches the expected type or schema.
     *
     * @throws {PrimitiveTypeError} When `valueTypeGuard` is not a function.
     * @throws {SchemaTypeError} When `input` is not a valid {@link WeightedElement} object.
     *
     * @public
     * @since 0.1.0
     */
    public static assertWeightedElement<TValue>(input: unknown, valueTypeGuard: (value: unknown) => value is TValue, message?: string): asserts input is WeightedElement<TValue> {
        if (!WeightedElementUtility.isWeightedElement(input, valueTypeGuard)) {
            if (StringUtility.isSingleLineTrimmedString(message)) {
                throw new SchemaTypeError(message);
            }

            throw new SchemaTypeError('Input does not match schema requirements for WeightedElement.');
        }
    }

    /**
     * Is `input` a valid generic {@link WeightedElement} object?
     *
     * @remarks This method does not enforce type checking for {@link WeightedElement.value}.
     * For a {@link WeightedElement} object to be valid, its {@link WeightedElement.weight} must be a finite number between {@link minWeight} and {@link maxWeight}, inclusive.
     *
     * @param {unknown} input - The input to check.
     *
     * @returns {input is WeightedElement<unknown>} `true` if `input` is a valid generic {@link WeightedElement} object; `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static isGenericWeightedElement(input: unknown): input is WeightedElement<unknown> {
        return Value.Check(Type.Call(weightedElementSchema, [Type.Unknown()]), input);
    }

    /**
     * Is `input` a valid {@link WeightedElement} object?
     *
     * @remarks For a {@link WeightedElement} object to be valid, its {@link WeightedElement.weight} must be a finite number between {@link minWeight} and {@link maxWeight}, inclusive.
     *
     * @see {@link WeightedElementUtility.isGenericWeightedElement}
     *
     * @template TValue The type of the value property of the {@link WeightedElement} object.
     *
     * @param {unknown} input - The input to check.
     * @param {(value: unknown) => value is TValue} valueTypeGuard - The type guard function used to validate the type or schema of {@link WeightedElement.value}.
     * This method should return `true` if the {@link WeightedElement.value} property matches the expected type or schema, and `false` otherwise.
     * The type validated by the function should match the assigned type of the {@link WeightedElement}.
     *
     * @returns {input is WeightedElement<TValue>} `true` if `input` is a valid {@link WeightedElement} object whose value matches the expected type or schema; `false` otherwise.
     *
     * @throws {PrimitiveTypeError} When `valueTypeGuard` is not a function.
     *
     * @public
     * @since 0.1.0
     */
    public static isWeightedElement<TValue>(input: unknown, valueTypeGuard: (value: unknown) => value is TValue): input is WeightedElement<TValue> {
        TypeAssertions.assertFunctionType(valueTypeGuard, 'valueTypeGuard must be a function.');
        return WeightedElementUtility.isGenericWeightedElement(input) && valueTypeGuard(input.value);
    }
}
