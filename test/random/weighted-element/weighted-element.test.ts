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

import { Static, Type } from 'typebox';
import { describe, test, expect, expectTypeOf } from 'vitest';

import { WeightedElement, weightedElementSchema } from '../../../src';

describe('WeightedElement', (): void => {
    describe('weightedElementSchema and WeightedElement interface should be equivalent', (): void => {
        const numberSchema = Type.Call(weightedElementSchema, [Type.Number()]);
        type NumberStatic = Static<typeof numberSchema>;
        const stringSchema = Type.Call(weightedElementSchema, [Type.String()]);
        type StringStatic = Static<typeof stringSchema>;

        test('String type', (): void => {
            expect(stringSchema).toBeDefined();

            expectTypeOf<StringStatic>().toExtend<WeightedElement<string>>();
            expectTypeOf<WeightedElement<string>>().toExtend<StringStatic>();

            expectTypeOf<NumberStatic>().not.toExtend<WeightedElement<string>>();
            expectTypeOf<WeightedElement<string>>().not.toExtend<NumberStatic>();
        });

        test('Number type', (): void => {
            expect(numberSchema).toBeDefined();

            expectTypeOf<NumberStatic>().toExtend<WeightedElement<number>>();
            expectTypeOf<WeightedElement<number>>().toExtend<NumberStatic>();

            expectTypeOf<StringStatic>().not.toExtend<WeightedElement<number>>();
            expectTypeOf<WeightedElement<number>>().not.toExtend<StringStatic>();
        });
    });
});
