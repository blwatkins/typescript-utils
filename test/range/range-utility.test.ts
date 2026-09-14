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

import { describe } from 'vitest';

import { RangeUtility, SchemaTypeError, StaticInstanceError } from '../../src';

import { testAssertMethod, testIsMethod } from '../utils/assert/assert-tests';
import { nonBooleanInputs } from '../utils/input/boolean-inputs';
import { nonFiniteNumberInputs, nonNumberInputs } from '../utils/input/number-inputs';
import { nonObjectInputs } from '../utils/input/object-inputs';
import { testStaticClassConstructor } from '../utils/static/static-class-tests';
import { Scenario } from '../utils/test-case/test-case';

describe('RangeUtility', (): void => {
    testStaticClassConstructor('RangeUtility', RangeUtility as unknown as new () => unknown, StaticInstanceError);

    const definedNonBooleanInputs: unknown[] = nonBooleanInputs.filter((input: unknown): boolean => {
        return input !== undefined;
    });

    const failureScenarios: Scenario[] = [
        {
            label: 'Non-object type inputs',
            inputs: nonObjectInputs,
            expected: SchemaTypeError
        },
        {
            label: 'Array type inputs',
            inputs: [
                [],
                [0, 10],
                [1, 2, 3],
                ['a', 'b', 'c']
            ],
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs missing min property',
            inputs: [
                { max: 10 },
                { max: 0, isMinInclusive: true },
                { max: -5, isMinInclusive: false, isMaxInclusive: false }
            ],
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs missing max property',
            inputs: [
                { min: 0 },
                { min: -5, isMaxInclusive: false },
                { min: 10, isMinInclusive: true, isMaxInclusive: true }
            ],
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs missing min and max properties',
            inputs: [
                {},
                { isMinInclusive: true },
                { isMaxInclusive: false },
                { isMinInclusive: true, isMaxInclusive: true }
            ],
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with non-numeric min property',
            inputs: nonNumberInputs.map((input: unknown): { min: unknown; max: number; } => {
                return { min: input, max: 10 };
            }),
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with non-numeric max property',
            inputs: nonNumberInputs.map((input: unknown): { min: number; max: unknown; } => {
                return { min: 0, max: input };
            }),
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with non-finite min property',
            inputs: nonFiniteNumberInputs.map((input: number): { min: number; max: number; } => {
                return { min: input, max: 10 };
            }),
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with non-finite max property',
            inputs: nonFiniteNumberInputs.map((input: number): { min: number; max: number; } => {
                return { min: 0, max: input };
            }),
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with non-finite min and max properties',
            inputs: [
                { min: NaN, max: NaN },
                { min: -Infinity, max: Infinity },
                { min: Infinity, max: Infinity },
                { min: -Infinity, max: -Infinity },
                { min: NaN, max: Infinity },
                { min: -Infinity, max: NaN }
            ],
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with non-boolean isMinInclusive property',
            inputs: definedNonBooleanInputs.map((input: unknown): { min: number; max: number; isMinInclusive: unknown; } => {
                return { min: 0, max: 10, isMinInclusive: input };
            }),
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with non-boolean isMaxInclusive property',
            inputs: definedNonBooleanInputs.map((input: unknown): { min: number; max: number; isMaxInclusive: unknown; } => {
                return { min: 0, max: 10, isMaxInclusive: input };
            }),
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs with additional properties',
            inputs: [
                { min: 0, max: 10, name: 'bob' },
                { min: 0, max: 10, step: 2 },
                { min: 0, max: 10, isMinInclusive: true, age: 42 },
                { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: true, day: 7 }
            ],
            expected: SchemaTypeError
        },
        {
            label: 'Object inputs where min is greater than max',
            inputs: [
                { min: 10, max: 0 },
                { min: 1, max: -1 },
                { min: 0.5, max: 0.25 },
                { min: Number.EPSILON, max: 0 },
                { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER },
                { min: 10, max: 0, isMinInclusive: true, isMaxInclusive: true }
            ],
            expected: SchemaTypeError
        }
    ];

    const successScenarios: Scenario[] = [
        {
            label: 'Range objects where min is less than max',
            inputs: [
                { min: 0, max: 10 },
                { min: -10, max: 10 },
                { min: -10, max: -1 },
                { min: -1.5, max: 1.5 },
                { min: -Number.MIN_VALUE, max: 0 }
                { min: Number.MIN_VALUE, max: Number.MAX_VALUE },
                { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER }
            ],
            expected: undefined
        },
        {
            label: 'Range objects where min is equal to max',
            inputs: [
                { min: 0, max: 0 },
                { min: 5, max: 5 },
                { min: -5.5, max: -5.5 },
                { min: Number.MAX_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER },
                { min: Number.MIN_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER }
            ],
            expected: undefined
        },
        {
            label: 'Range objects with isMinInclusive property',
            inputs: [
                { min: 0, max: 10, isMinInclusive: true },
                { min: 0, max: 10, isMinInclusive: false },
                { min: -5, max: -5, isMinInclusive: true }
            ],
            expected: undefined
        },
        {
            label: 'Range objects with isMaxInclusive property',
            inputs: [
                { min: 0, max: 10, isMaxInclusive: true },
                { min: 0, max: 10, isMaxInclusive: false },
                { min: -5, max: -5, isMaxInclusive: false }
            ],
            expected: undefined
        },
        {
            label: 'Range objects with isMinInclusive and isMaxInclusive properties',
            inputs: [
                { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: true },
                { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: false },
                { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: true },
                { min: 0, max: 10, isMinInclusive: false, isMaxInclusive: false }
            ],
            expected: undefined
        },
        {
            label: 'Range objects with explicitly undefined isMinInclusive and isMaxInclusive properties',
            inputs: [
                { min: 0, max: 10, isMinInclusive: undefined },
                { min: 0, max: 10, isMaxInclusive: undefined },
                { min: 0, max: 10, isMinInclusive: undefined, isMaxInclusive: undefined },
                { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: undefined }
            ],
            expected: undefined
        }
    ];

    describe('Range', (): void => {
        describe('assertRange', (): void => {
            testAssertMethod(
                RangeUtility.assertRange.bind(RangeUtility),
                successScenarios,
                failureScenarios,
                'Input does not match schema requirements for Range.'
            );
        });

        describe('isRange', (): void => {
            testIsMethod(RangeUtility.isRange.bind(RangeUtility), successScenarios, failureScenarios);
        });
    });
});
