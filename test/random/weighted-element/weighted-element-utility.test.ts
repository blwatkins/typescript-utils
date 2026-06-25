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

import { describe, test, expect } from 'vitest';

import { WeightedElement, WeightedElementUtility } from '../../../src';
import {Scenario} from "../../utils/test-case/test-case";

describe('WeightedElementUtility', (): void => {
    describe('new WeightedElementUtility()', (): void => {
        describe('Runtime behavior guards', (): void => {
            test('Constructor should throw an error when instantiated at runtime', (): void => {
                const RuntimeConstructor = WeightedElementUtility as unknown as new () => WeightedElementUtility;
                expect((): WeightedElementUtility => new RuntimeConstructor()).toThrow(Error);
            });
        });
    });

    describe('buildWeightedElement', (): void => {
        test('buildWeightedElement() should return a typed weighed element', (): void => {
            const element: WeightedElement<string> = WeightedElementUtility.buildWeightedElement({ value: 'test value', weight: 0.5 });

            expect(WeightedElementUtility.isWeightedElement(element, (input: unknown): input is string => typeof input === 'string')).toBe(true);
        });

        describe('Input validation', (): void => {
            const scenarios: Scenario[] = [
                {
                    label: 'Non-object type inputs',
                    inputs: [],
                    expected: null
                },
                {
                    label: 'Array type inputs',
                    inputs: [],
                    expected: null
                },
                {
                    label: 'Object inputs missing value property',
                    inputs: [],
                    expected: null
                },
                {
                    label: 'Object inputs missing weight property',
                    inputs: [],
                    expected: null
                },
                {
                    label: 'Object inputs with non-numeric weight property',
                    inputs: [],
                    expected: null
                },
                {
                    label: 'Object inputs with non-finite weight property',
                    inputs: [],
                    expected: null
                },
                {
                    label: 'Object inputs with out of range weight property',
                    inputs: [],
                    expected: null
                },
                {
                    label: 'Object inputs with additional properties',
                    inputs: [],
                    expected: null
                }
            ];
        });
    });

    test.todo('buildWeightedElement');

    test.todo('buildWeightedList');

    test.todo('isGenericWeightedElement');

    test.todo('isWeightedElement');

    test.todo('isGenericWeightedList');

    test.todo('isWeightedList');
});
