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

import { ArrayUtility, PrimitiveTypeError, StaticInstanceError } from '../../src';

import { testAssertMethod, testIsMethod } from '../utils/assert/assert-tests';
import { arrayInputs, nonArrayInputs, sparseArrayInputs } from '../utils/input/array-inputs';
import { testStaticClassConstructor } from '../utils/static/static-class-tests';
import { Scenario } from '../utils/test-case/test-case';

describe('ArrayUtility', (): void => {
    testStaticClassConstructor('ArrayUtility', ArrayUtility as unknown as new () => unknown, StaticInstanceError);

    const nonArrayScenario: Scenario = {
        label: 'Non-array inputs',
        inputs: nonArrayInputs,
        expected: PrimitiveTypeError
    };

    const denseArraySuccessScenarios: Scenario[] = [
        {
            label: 'Dense array inputs',
            inputs: arrayInputs,
            expected: undefined
        }
    ];

    const denseArrayFailureScenarios: Scenario[] = [
        nonArrayScenario,
        {
            label: 'Sparse array inputs',
            inputs: sparseArrayInputs,
            expected: PrimitiveTypeError
        }
    ];

    const arraySuccessScenarios: Scenario[] = [
        ...denseArraySuccessScenarios,
        {
            label: 'Sparse array inputs',
            inputs: sparseArrayInputs,
            expected: undefined
        }
    ];

    const arrayFailureScenarios: Scenario[] = [
        nonArrayScenario
    ];

    describe('Array', (): void => {
        describe('assertArray', (): void => {
            testAssertMethod(
                ArrayUtility.assertArray.bind(ArrayUtility),
                arraySuccessScenarios,
                arrayFailureScenarios,
                'Expected an array.'
            );
        });

        describe('isArray', (): void => {
            testIsMethod(ArrayUtility.isArray.bind(ArrayUtility), arraySuccessScenarios, arrayFailureScenarios);
        });
    });

    describe('DenseArray', (): void => {
        describe('assertDenseArray', (): void => {
            testAssertMethod(
                ArrayUtility.assertDenseArray.bind(ArrayUtility),
                denseArraySuccessScenarios,
                denseArrayFailureScenarios,
                'Expected a dense array.'
            );
        });

        describe('isDenseArray', (): void => {
            testIsMethod(ArrayUtility.isDenseArray.bind(ArrayUtility), denseArraySuccessScenarios, denseArrayFailureScenarios);
        });
    });
});
