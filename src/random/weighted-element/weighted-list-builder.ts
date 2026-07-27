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

import { PrimitiveTypeAssertions } from '../../assert/primitive-type-assertions';

import {WeightedElement, WeightedList} from './weighted-element';
import { WeightedListUtility } from './weighted-list-utility';

export class WeightedListBuilder<TValue> {
    readonly #elements: WeightedElement<TValue>[] = [];
    readonly #valueTypeGuard: ((value: unknown) => value is TValue) | undefined;

    public constructor(valueTypeGuard?: (value: unknown) => value is TValue) {
        PrimitiveTypeAssertions.assertFunctionType(valueTypeGuard);
        this.#valueTypeGuard = valueTypeGuard;
    }

    public build(): WeightedList<TValue> {
        if (this.#valueTypeGuard) {
            WeightedListUtility.assertWeightedList(this.#elements, this.#valueTypeGuard);
        } else {
            WeightedListUtility.assertGenericWeightedList(this.#elements);
        }

        return this.#elements;
    }
}
