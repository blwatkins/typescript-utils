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

import Value from 'typebox/value';

import { Type } from 'typebox';

import { DiscriminatorRegistry, Discriminators, TypeGuard } from '../../discriminator';

import { WeightedElement, WeightedList, weightedElementSchema } from './weighted-element';

export class WeightedElementUtility {
    /**
     * @throws {Error} - WeightedElementUtility is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new Error('WeightedElementUtility is a static class and cannot be instantiated.');
    }

    static readonly #isGenericWeightedElement: TypeGuard<WeightedElement<unknown>> = DiscriminatorRegistry.register<WeightedElement<unknown>>({
        discriminator: Discriminators.WeightedElement,
        validator: (input: unknown): input is WeightedElement<unknown> => {
            return Value.Check(Type.Call(weightedElementSchema, [Type.Unknown()]), input);
        }
    });

    public static buildWeightedElement<Type>(input: { value: Type; weight: number; }): WeightedElement<Type> {
        WeightedElementUtility.#validateBuildWeightedElementInput(input);

        const weightedElement = {
            ...input,
            discriminator: Discriminators.WeightedElement
        };

        WeightedElementUtility.#validateWeightedElement(weightedElement);
        return weightedElement;
    }

    public static buildWeightedList<Type>(elements: { value: Type; weight: number; }[]): WeightedList<Type> {
        const weightedElements: WeightedElement<Type>[] = elements.map((element: { value: Type; weight: number; }): WeightedElement<Type> => {
            return WeightedElementUtility.buildWeightedElement(element);
        });

        if (!WeightedElementUtility.isGenericWeightedList(weightedElements)) {
            throw new TypeError('Input does not match schema requirements for weighted list');
        }

        return weightedElements;
    }

    public static isGenericWeightedElement(input: unknown): input is WeightedElement<unknown> {
        return WeightedElementUtility.#isGenericWeightedElement(input);
    }

    public static isWeightedElement<Type>(input: unknown, valueTypeGuard: (value: unknown) => value is Type): input is WeightedElement<Type> {
        if (typeof valueTypeGuard !== 'function') {
            throw new TypeError('Value type guard must be a function');
        }

        return WeightedElementUtility.isGenericWeightedElement(input) && valueTypeGuard(input.value);
    }

    public static isGenericWeightedList(input: unknown): input is WeightedList<unknown> {
        if (!input || !Array.isArray(input) || input.length === 0) {
            return false;
        }

        const containsWeightedElements: boolean = input.reduce((accumulator: boolean, element: unknown): boolean => {
            return accumulator && WeightedElementUtility.isGenericWeightedElement(element);
        }, true);

        if (!containsWeightedElements) {
            return false;
        }

        const weightSum: number = input.reduce((sum: number, element: unknown): number => sum + (element as WeightedElement<unknown>).weight, 0);
        const precisionSum: number = Number.parseFloat(weightSum.toFixed(4));
        return precisionSum === 1;
    }

    public static isWeightedList<Type>(input: unknown, valueTypeGuard: (value: unknown) => value is Type): input is WeightedList<Type> {
        if (typeof valueTypeGuard !== 'function') {
            throw new TypeError('Value type guard must be a function');
        }

        if (!WeightedElementUtility.isGenericWeightedList(input)) {
            return false;
        }

        return input.reduce((accumulator: boolean, element: unknown): boolean => {
            return accumulator && WeightedElementUtility.isWeightedElement(element, valueTypeGuard);
        }, true);
    }

    static #validateBuildWeightedElementInput(input: unknown): void {
        if (!input || typeof input !== 'object' || Array.isArray(input)) {
            throw new TypeError('Input must be an object');
        }
    }

    static #validateWeightedElement(element: unknown): void {
        if (!WeightedElementUtility.isGenericWeightedElement(element)) {
            throw new TypeError(`Element does not match schema requirements for weighted element`);
        }
    }
}
