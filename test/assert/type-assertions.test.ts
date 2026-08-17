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

import { describe } from 'vitest';

import { PrimitiveTypeError, RandomNumberGeneratorFactory, StaticInstanceError, TypeAssertions } from '../../src';

import { testAssertMethod } from '../utils/assert/assert-tests';
import { nonArrayInputs } from '../utils/input/array-inputs';
import { nonFunctionInputs } from '../utils/input/function-inputs';
import { nonObjectInputs } from '../utils/input/object-inputs';
import { emptyStringInputs, nonEmptyStringInputs, nonStringInputs } from '../utils/input/string-inputs';
import { testStaticClassConstructor } from '../utils/static/static-class-tests';
import { Scenario } from '../utils/test-case/test-case';

describe('TypeAssertions', (): void => {
    testStaticClassConstructor('TypeAssertions', TypeAssertions as unknown as new () => unknown, StaticInstanceError);

    describe('assertArrayType', (): void => {
        const successScenarios: Scenario[] = [
            {
                label: 'Array inputs',
                inputs: [
                    [],
                    [1, 2, 3],
                    ['a', 'b', 'c'],
                    [{ key: 1 }, { key: 2 }, { key: 3 }],
                    [[1, 2, 3], [4, 5, 6]]
                ],
                expected: undefined
            }
        ];

        const failureScenarios: Scenario[] = [
            {
                label: 'Non-array inputs',
                inputs: nonArrayInputs,
                expected: PrimitiveTypeError
            }
        ];

        testAssertMethod(
            TypeAssertions.assertArrayType.bind(TypeAssertions),
            successScenarios,
            failureScenarios,
            (input: unknown): string => {
                return `Expected an array, but received: ${typeof input}.`;
            }
        );
    });

    describe('assertFunctionType', (): void => {
        const successScenarios: Scenario[] = [
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

        const failureScenarios: Scenario[] = [
            {
                label: 'Non-function inputs',
                inputs: nonFunctionInputs,
                expected: PrimitiveTypeError
            }
        ];

        testAssertMethod(
            TypeAssertions.assertFunctionType.bind(TypeAssertions),
            successScenarios,
            failureScenarios,
            (input: unknown): string => {
                return `Expected a function, but received: ${typeof input}.`;
            }
        );
    });

    describe('assertObjectType', (): void => {
        const successScenarios: Scenario[] = [
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

        const failureScenarios: Scenario[] = [
            {
                label: 'Non-object inputs',
                inputs: nonObjectInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Array inputs',
                inputs: [
                    [],
                    [1, 2, 3],
                    ['a', 'b', 'c'],
                    [{ key: 1 }, { key: 2 }, { key: 3 }],
                    [[1, 2, 3], [4, 5, 6]]
                ],
                expected: PrimitiveTypeError
            }
        ];

        testAssertMethod(
            TypeAssertions.assertObjectType.bind(TypeAssertions),
            successScenarios,
            failureScenarios,
            (input: unknown): string => {
                return `Expected a non-array object, but received: ${typeof input}.`;
            }
        );
    });

    describe('assertStringType', (): void => {
        const successScenarios: Scenario[] = [
            {
                label: 'String inputs',
                inputs: [
                    ...emptyStringInputs,
                    ...nonEmptyStringInputs
                ],
                expected: undefined
            }
        ];

        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            }
        ];

        testAssertMethod(
            TypeAssertions.assertStringType.bind(TypeAssertions),
            successScenarios,
            failureScenarios,
            (input: unknown): string => {
                return `Expected a string, but received: ${typeof input}.`;
            }
        );
    });
});
