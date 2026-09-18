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

import {
    PrimitiveTypeError,
    RandomNumberGeneratorFactory,
    StaticInstanceError,
    TypeAssertions
} from '../../src';

import { testAssertMethod } from '../utils/assert/assert-tests';
import { nonArrayInputs } from '../utils/input/array-inputs';
import { nonBooleanInputs } from '../utils/input/boolean-inputs';
import { nonFunctionInputs } from '../utils/input/function-inputs';
import { nonObjectInputs } from '../utils/input/object-inputs';
import { emptyStringInputs, nonEmptyStringInputs, nonStringInputs } from '../utils/input/string-inputs';
import { testStaticClassConstructor } from '../utils/static/static-class-tests';
import { Scenario } from '../utils/test-case/test-case';

describe('TypeAssertions', (): void => {
    testStaticClassConstructor('TypeAssertions', TypeAssertions as unknown as new () => unknown, StaticInstanceError);

    const arrayInputs: unknown[] = [
        [],
        [1, 2, 3],
        ['a', 'b', 'c'],
        [{ key: 1 }, { key: 2 }, { key: 3 }],
        [[1, 2, 3], [4, 5, 6]]
    ];

    const arrayFailureScenarios: Scenario[] = [
        {
            label: 'Non-array inputs',
            inputs: nonArrayInputs,
            expected: PrimitiveTypeError
        }
    ];

    const arraySuccessScenarios: Scenario[] = [
        {
            label: 'Array inputs',
            inputs: arrayInputs,
            expected: undefined
        }
    ];

    const booleanFailureScenarios: Scenario[] = [
        {
            label: 'Non-boolean inputs',
            inputs: nonBooleanInputs,
            expected: PrimitiveTypeError
        }
    ];

    const booleanSuccessScenarios: Scenario[] = [
        {
            label: 'Boolean inputs',
            inputs: [
                true,
                false
            ],
            expected: undefined
        }
    ];

    const functionFailureScenarios: Scenario[] = [
        {
            label: 'Non-function inputs',
            inputs: nonFunctionInputs,
            expected: PrimitiveTypeError
        }
    ];

    const functionSuccessScenarios: Scenario[] = [
        {
            label: 'Functions',
            inputs: [
                Math.random,
                (): boolean => {
                    return false;
                },
                (): number => {
                    return 2;
                },
                (x: number, y: number): number => {
                    return (x * y) - (x + y);
                }
            ],
            expected: undefined
        }
    ];

    const objectFailureScenarios: Scenario[] = [
        {
            label: 'Non-object inputs',
            inputs: nonObjectInputs,
            expected: PrimitiveTypeError
        },
        {
            label: 'Array inputs',
            inputs: arrayInputs,
            expected: PrimitiveTypeError
        }
    ];

    const objectSuccessScenarios: Scenario[] = [
        {
            label: 'Non-array objects',
            inputs: [
                {},
                { key: 'value' },
                { 'other key': 'other value' },
                RandomNumberGeneratorFactory.build('seed'),
                new Error(),
                new Set<string>()
            ],
            expected: undefined
        }
    ];

    const stringFailureScenarios: Scenario[] = [
        {
            label: 'Non-string inputs',
            inputs: nonStringInputs,
            expected: PrimitiveTypeError
        }
    ];

    const stringSuccessScenarios: Scenario[] = [
        {
            label: 'String inputs',
            inputs: [
                ...emptyStringInputs,
                ...nonEmptyStringInputs
            ],
            expected: undefined
        }
    ];

    describe('assertArray', (): void => {
        testAssertMethod(
            TypeAssertions.assertArray.bind(TypeAssertions),
            arraySuccessScenarios,
            arrayFailureScenarios,
            'Expected an array.'
        );
    });

    describe('assertBoolean', (): void => {
        testAssertMethod(
            TypeAssertions.assertBoolean.bind(TypeAssertions),
            booleanSuccessScenarios,
            booleanFailureScenarios,
            'Expected a boolean.'
        );
    });

    describe('assertFunction', (): void => {
        testAssertMethod(
            TypeAssertions.assertFunction.bind(TypeAssertions),
            functionSuccessScenarios,
            functionFailureScenarios,
            'Expected a function.'
        );
    });

    describe('assertObject', (): void => {
        testAssertMethod(
            TypeAssertions.assertObject.bind(TypeAssertions),
            objectSuccessScenarios,
            objectFailureScenarios,
            'Expected a non-array object.'
        );
    });

    describe('assertString', (): void => {
        testAssertMethod(
            TypeAssertions.assertString.bind(TypeAssertions),
            stringSuccessScenarios,
            stringFailureScenarios,
            'Expected a string.'
        );
    });

    /* ******************* TODO: DEPRECATED ******************* */

    describe('[DEPRECATED] assertArrayType', (): void => {
        testAssertMethod(
            TypeAssertions.assertArrayType.bind(TypeAssertions),
            arraySuccessScenarios,
            arrayFailureScenarios,
            'Expected an array.'
        );
    });

    describe('[DEPRECATED] assertFunctionType', (): void => {
        testAssertMethod(
            TypeAssertions.assertFunctionType.bind(TypeAssertions),
            functionSuccessScenarios,
            functionFailureScenarios,
            'Expected a function.'
        );
    });

    describe('[DEPRECATED] assertObjectType', (): void => {
        testAssertMethod(
            TypeAssertions.assertObjectType.bind(TypeAssertions),
            objectSuccessScenarios,
            objectFailureScenarios,
            'Expected a non-array object.'
        );
    });

    describe('[DEPRECATED] assertStringType', (): void => {
        testAssertMethod(
            TypeAssertions.assertStringType.bind(TypeAssertions),
            stringSuccessScenarios,
            stringFailureScenarios,
            'Expected a string.'
        );
    });
});
