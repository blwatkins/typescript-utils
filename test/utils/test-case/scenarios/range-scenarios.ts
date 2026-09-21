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

import { SchemaTypeError } from '../../../../src';

import { definedNonBooleanInputs } from '../../input/boolean-inputs';
import { nonFiniteNumberInputs, nonNumberInputs, unsafeNumberInputs } from '../../input/number-inputs';
import { nonObjectInputs } from '../../input/object-inputs';

import { Scenario } from '../test-case';

export const validRangeScenarios: Scenario[] = [
    {
        label: 'Minimum less than maximum',
        inputs: [
            { min: 5, max: 10, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 5.5, max: 10, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 5, max: 10.5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -5, max: 10, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -5.5, max: 10, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -5, max: 10.5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -5.5, max: 10.5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -10, max: 10, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -10, max: -5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -10.5, max: -5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -10, max: -5.5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -10.5, max: -5.5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -1.5, max: 1.5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: Number.MIN_VALUE, max: Number.MAX_SAFE_INTEGER, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 10.12345678912344, max: 10.12345678912345, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -10.12345678912345, max: -10.12345678912344, isMinInclusive: undefined, isMaxInclusive: undefined }
        ],
        expected: undefined
    },
    {
        label: 'Minimum equal to maximum',
        inputs: [
            { min: 10, max: 10, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -10, max: -10, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 10.12345678912345, max: 10.12345678912345, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -10.12345678912345, max: -10.12345678912345, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 0, max: 0, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -0, max: -0, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -0, max: 0, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 0, max: -0, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 5, max: 5, isMinInclusive: true, isMaxInclusive: true },
            { min: 0, max: 0, isMinInclusive: true, isMaxInclusive: undefined },
            { min: -5.5, max: -5.5, isMinInclusive: undefined, isMaxInclusive: true }
        ],
        expected: undefined
    },
    {
        label: 'Every combination of defined and undefined inclusivity',
        inputs: [
            { min: 5, max: 10, isMinInclusive: true, isMaxInclusive: undefined },
            { min: 5, max: 10, isMinInclusive: false, isMaxInclusive: undefined },
            { min: 5, max: 10, isMinInclusive: undefined, isMaxInclusive: true },
            { min: 5, max: 10, isMinInclusive: undefined, isMaxInclusive: false },
            { min: 5, max: 10, isMinInclusive: true, isMaxInclusive: true },
            { min: 5, max: 10, isMinInclusive: true, isMaxInclusive: false },
            { min: 5, max: 10, isMinInclusive: false, isMaxInclusive: true },
            { min: 5, max: 10, isMinInclusive: false, isMaxInclusive: false }
        ],
        expected: undefined
    },
    {
        label: 'Adjacent bounds where one bound is included',
        inputs: [
            { min: 1, max: 1 + Number.EPSILON, isMinInclusive: true, isMaxInclusive: false },
            { min: 0, max: Number.MIN_VALUE, isMinInclusive: true, isMaxInclusive: false },
            { min: 0, max: Number.MIN_VALUE, isMinInclusive: false, isMaxInclusive: true },
            { min: -1 - Number.EPSILON, max: -1, isMinInclusive: false, isMaxInclusive: true },
            { min: -1 - Number.EPSILON, max: -1, isMinInclusive: true, isMaxInclusive: false },
            { min: Number.MAX_SAFE_INTEGER - 1, max: Number.MAX_SAFE_INTEGER, isMinInclusive: true, isMaxInclusive: false },
            { min: Number.MAX_SAFE_INTEGER - 1, max: Number.MAX_SAFE_INTEGER, isMinInclusive: false, isMaxInclusive: true },
            { min: Number.MIN_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER + 1, isMinInclusive: true, isMaxInclusive: false }
        ],
        expected: undefined
    },
    {
        label: 'Midpoint rounds onto an included bound',
        inputs: [
            { min: 1 + Number.EPSILON, max: 1 + (2 * Number.EPSILON), isMinInclusive: true, isMaxInclusive: false },
            { min: 1, max: 1 + Number.EPSILON, isMinInclusive: false, isMaxInclusive: true },
            { min: -1 - (2 * Number.EPSILON), max: -1 - Number.EPSILON, isMinInclusive: true, isMaxInclusive: false }
        ],
        expected: undefined
    },
    {
        label: 'Ranges at the safe integer limits',
        inputs: [
            { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER, isMinInclusive: false, isMaxInclusive: false },
            { min: 0, max: Number.MAX_SAFE_INTEGER, isMinInclusive: false, isMaxInclusive: false },
            { min: Number.MIN_SAFE_INTEGER, max: 0, isMinInclusive: false, isMaxInclusive: false },
            { min: Number.MAX_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER, isMinInclusive: true, isMaxInclusive: true },
            { min: Number.MIN_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER, isMinInclusive: undefined, isMaxInclusive: undefined }
        ],
        expected: undefined
    },
    {
        label: 'Ranges spanning zero at the smallest representable width',
        inputs: [
            { min: -Number.MIN_VALUE, max: Number.MIN_VALUE, isMinInclusive: false, isMaxInclusive: false },
            { min: -Number.MIN_VALUE, max: Number.MIN_VALUE, isMinInclusive: true, isMaxInclusive: true },
            { min: -Number.MIN_VALUE, max: 0, isMinInclusive: true, isMaxInclusive: false },
            { min: 0, max: Number.MIN_VALUE, isMinInclusive: false, isMaxInclusive: true }
        ],
        expected: undefined
    }
];

export const invalidRangeScenarios: Scenario[] = [
    {
        label: 'Minimum greater than maximum',
        inputs: [
            { min: 0, max: -5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 0, max: -5.5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 5, max: 0, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 5.5, max: 0, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 10, max: 5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 10, max: 5.5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 10.5, max: 5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 10.5, max: 5.5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 10, max: -5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 10, max: -5.5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 10.5, max: -5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 10.5, max: -5.5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 1, max: -1, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 0.5, max: 0.25, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -5, max: -10, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -5.5, max: -10, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -5, max: -10.5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -5.5, max: -10.5, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 10.12345678912345, max: 10.12345678912344, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: -10.12345678912344, max: -10.12345678912345, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: Number.EPSILON, max: 0, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: Number.MAX_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 10, max: 0, isMinInclusive: true, isMaxInclusive: true }
        ],
        expected: SchemaTypeError
    },
    {
        label: 'Equal bounds where a bound is excluded',
        inputs: [
            { min: 5, max: 5, isMinInclusive: false, isMaxInclusive: true },
            { min: 5, max: 5, isMinInclusive: true, isMaxInclusive: false },
            { min: 5, max: 5, isMinInclusive: false, isMaxInclusive: false },
            { min: 0, max: 0, isMinInclusive: false, isMaxInclusive: undefined },
            { min: 0, max: 0, isMinInclusive: undefined, isMaxInclusive: false },
            { min: -0, max: 0, isMinInclusive: false, isMaxInclusive: true },
            { min: 0, max: -0, isMinInclusive: true, isMaxInclusive: false },
            { min: -5.5, max: -5.5, isMinInclusive: undefined, isMaxInclusive: false },
            { min: -5.5, max: -5.5, isMinInclusive: false, isMaxInclusive: true },
            { min: Number.MAX_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER, isMinInclusive: false, isMaxInclusive: false },
            { min: Number.MIN_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER, isMinInclusive: true, isMaxInclusive: false }
        ],
        expected: SchemaTypeError
    },
    {
        label: 'Adjacent excluded bounds that contain no representable value',
        inputs: [
            { min: 1, max: 1 + Number.EPSILON, isMinInclusive: false, isMaxInclusive: false },
            { min: 0, max: Number.MIN_VALUE, isMinInclusive: false, isMaxInclusive: false },
            { min: -Number.MIN_VALUE, max: 0, isMinInclusive: false, isMaxInclusive: false },
            { min: -1 - Number.EPSILON, max: -1, isMinInclusive: false, isMaxInclusive: false },
            { min: Number.MAX_SAFE_INTEGER - 1, max: Number.MAX_SAFE_INTEGER, isMinInclusive: false, isMaxInclusive: false },
            { min: Number.MIN_SAFE_INTEGER, max: Number.MIN_SAFE_INTEGER + 1, isMinInclusive: false, isMaxInclusive: false }
        ],
        expected: SchemaTypeError
    },
    {
        label: 'Midpoint rounds onto an excluded bound',
        inputs: [
            { min: 1 + Number.EPSILON, max: 1 + (2 * Number.EPSILON), isMinInclusive: false, isMaxInclusive: false },
            { min: -1 - (2 * Number.EPSILON), max: -1 - Number.EPSILON, isMinInclusive: false, isMaxInclusive: false }
        ],
        expected: SchemaTypeError
    }
];

export const optionalPropertyRangeScenarios: Scenario[] = [
    {
        label: 'Range objects with only min and max properties',
        inputs: [
            { min: 0, max: 10 },
            { min: -10, max: -1 },
            { min: 5, max: 5 },
            { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER }
        ],
        expected: undefined
    },
    {
        label: 'Range objects with one inclusivity property present',
        inputs: [
            { min: 0, max: 10, isMinInclusive: true },
            { min: 0, max: 10, isMinInclusive: false },
            { min: 0, max: 10, isMaxInclusive: true },
            { min: 0, max: 10, isMaxInclusive: false },
            { min: -5, max: -5, isMinInclusive: true },
            { min: 1, max: 1 + Number.EPSILON, isMaxInclusive: false },
            { min: 1, max: 1 + Number.EPSILON, isMinInclusive: false }
        ],
        expected: undefined
    },
    {
        label: 'Range objects with explicitly undefined inclusivity properties',
        inputs: [
            { min: 0, max: 10, isMinInclusive: undefined },
            { min: 0, max: 10, isMaxInclusive: undefined },
            { min: 0, max: 10, isMinInclusive: undefined, isMaxInclusive: undefined },
            { min: 0, max: 10, isMinInclusive: undefined, isMaxInclusive: false },
            { min: 0, max: 10, isMinInclusive: true, isMaxInclusive: undefined }
        ],
        expected: undefined
    }
];

export const invalidRangeSchemaScenarios: Scenario[] = [
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
        label: 'Object inputs with a bound outside the safe integer range',
        inputs: [
            ...unsafeNumberInputs.map((input: number): { min: number; max: number; } => {
                return { min: input, max: Number.MAX_SAFE_INTEGER };
            }),
            ...unsafeNumberInputs.map((input: number): { min: number; max: number; } => {
                return { min: Number.MIN_SAFE_INTEGER, max: input };
            }),
            { min: 0, max: 1e16 },
            { min: 0, max: 1e100 },
            { min: -1e300, max: 1e300 },
            { min: -Number.MAX_VALUE, max: Number.MAX_VALUE },
            { min: -Number.MAX_VALUE, max: 0 },
            { min: 0, max: Math.pow(2, 53) }
        ],
        expected: SchemaTypeError
    }
];
