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

import { PrimitiveTypeError } from '../../../../src';

import {
    negativeSafeIntegerInputs,
    nonFiniteNumberInputs,
    nonNumberInputs,
    safeFloatInputs,
    unsafeNumberInputs
} from '../../input/number-inputs';

import { Scenario } from '../test-case';

export const positiveIntegerFailureScenarios: Scenario[] = [
    {
        label: 'Non-number inputs',
        inputs: nonNumberInputs,
        expected: PrimitiveTypeError
    },
    {
        label: 'Non-finite number inputs',
        inputs: nonFiniteNumberInputs,
        expected: PrimitiveTypeError
    },
    {
        label: 'Number inputs outside the safe integer range',
        inputs: unsafeNumberInputs,
        expected: PrimitiveTypeError
    },
    {
        label: 'Float inputs',
        inputs: safeFloatInputs,
        expected: PrimitiveTypeError
    },
    {
        label: 'Negative integer inputs',
        inputs: negativeSafeIntegerInputs,
        expected: PrimitiveTypeError
    }
];
