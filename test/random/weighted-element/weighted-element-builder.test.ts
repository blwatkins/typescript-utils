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

import { describe, expect, test } from 'vitest';

import {
    Discriminators,
    StaticInstanceError, StringUtility,
    WeightedElement,
    WeightedElementBuilder,
    WeightedElementUtility
} from '../../../src';

import { testStaticClassConstructor } from '../../utils/static/static-class-tests';

describe('WeightedElementBuilder', (): void => {
    testStaticClassConstructor('WeightedElementBuilder', WeightedElementBuilder as unknown as new () => unknown, StaticInstanceError);

    describe('buildFrom', (): void => {
        describe('buildFrom() should return a typed weighed element', (): void => {
            test('with no type guard', (): void => {
                const value: string = 'test value';
                const weight: number = 0.5;
                const element: WeightedElement<string> = WeightedElementBuilder.buildFrom<string>(value, weight);
                expect(element).toEqual({ value, weight, discriminator: Discriminators.WeightedElement });
                expect(WeightedElementUtility.isGenericWeightedElement(element)).toBeTruthy();
                expect((): void => {
                    WeightedElementUtility.assertGenericWeightedElement(element);
                }).not.toThrow();
            });

            test('with undefined type guard', (): void => {
                const value: string = 'test value';
                const weight: number = 0;
                const element: WeightedElement<string> = WeightedElementBuilder.buildFrom<string>(value, weight, undefined);
                expect(element).toEqual({ value, weight, discriminator: Discriminators.WeightedElement });
                expect(WeightedElementUtility.isGenericWeightedElement(element)).toBeTruthy();
                expect((): void => {
                    WeightedElementUtility.assertGenericWeightedElement(element);
                }).not.toThrow();
            });

            test('with type guard', (): void => {
                const value: string = 'TEST VALUE';
                const weight: number = 1;
                const element: WeightedElement<string> = WeightedElementBuilder.buildFrom<string>(value, weight, StringUtility.isNonEmptyString.bind(StringUtility));
                expect(element).toEqual({ value, weight, discriminator: Discriminators.WeightedElement });
                expect(WeightedElementUtility.isGenericWeightedElement(element)).toBeTruthy();
                expect((): void => {
                    WeightedElementUtility.assertGenericWeightedElement(element);
                }).not.toThrow();
            });
        });

        test.todo('buildFrom() should constrain weight between 0 and 1');
    });

    test.todo('buildFromObject');

    test.todo('buildFrom() and buildFromObject() should throw when weight is not a finite number');

    test.todo('buildFrom() and buildFromObject() should throw when type guard is not a function');

    test.todo('buildFrom() and buildFromObject() should throw when value does not pass the type guard');
});
