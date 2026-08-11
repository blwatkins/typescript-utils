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

import { PrimitiveTypeError, RandomNumberGeneratorFactory, StaticInstanceError, TypeAssertions } from '../../src';

import { nonArrayInputs } from '../utils/input/array-inputs';
import { nonFunctionInputs } from '../utils/input/function-inputs';
import { nonObjectInputs } from '../utils/input/object-inputs';
import { nonStringInputs, singleLineTrimmedFailureInputs } from '../utils/input/string-inputs';
import { testStaticClassConstructor } from '../utils/static/static-class-tests';
import { TestCase, buildTestCases } from '../utils/test-case/test-case';

describe('TypeAssertions', (): void => {
    testStaticClassConstructor('TypeAssertions', TypeAssertions as unknown as new () => unknown, StaticInstanceError);

    function testTypeAssertions(
        methodName: string,
        method: (input: unknown, message?: string) => asserts input is unknown,
        expectedType: string,
        successInputs: unknown[],
        failureInputs: unknown[]
    ): void {
        const successCases: TestCase[] = buildTestCases(successInputs, undefined);
        const failureCases: TestCase[] = buildTestCases(failureInputs, undefined);

        describe(methodName, (): void => {
            describe('Failure cases should throw a PrimitiveTypeError', (): void => {
                describe('With default message', (): void => {
                    test.each(
                        failureCases
                    )(`%# - ${methodName}($input)`, ({ input: testInput }: TestCase): void => {
                        const expectedMessage: string = `Expected ${expectedType}, but received: ${typeof testInput}`;

                        expect((): void => {
                            method(testInput);
                        }).toThrow(new PrimitiveTypeError(expectedMessage));
                    });
                });

                describe('With custom message', (): void => {
                    const expectedMessage: string = `Test Custom Error: ${methodName}`;

                    test.each(
                        failureCases
                    )(`%# - ${methodName}($input, ${expectedMessage})`, ({ input: testInput }: TestCase): void => {
                        expect((): void => {
                            method(testInput, expectedMessage);
                        }).toThrow(new PrimitiveTypeError(expectedMessage));
                    });
                });

                describe('With invalid message type', (): void => {
                    describe.each(
                        failureCases
                    )(`%# - ${methodName}($input, message) should throw with default message when given message is not a single-line trimmed string`, ({ input: testInput }: TestCase): void => {
                        const expectedMessage: string = `Expected ${expectedType}, but received: ${typeof testInput}`;

                        describe('Non-string type message', (): void => {
                            const nonStringCases: TestCase[] = buildTestCases(nonStringInputs, undefined);

                            test.each(
                                nonStringCases
                            )(`%# - ${methodName}(input, $input)`, ({ input: message }: TestCase): void => {
                                expect((): void => {
                                    method(testInput, message as string);
                                }).toThrow(new PrimitiveTypeError(expectedMessage));
                            });
                        });

                        describe('String type messages that are not single-line trimmed', (): void => {
                            const stringFailureCases: TestCase[] = buildTestCases(singleLineTrimmedFailureInputs, undefined);

                            test.each(
                                stringFailureCases
                            )(`%# - ${methodName}(input, $input)`, ({ input: message }: TestCase): void => {
                                expect((): void => {
                                    method(testInput, message as string);
                                }).toThrow(new PrimitiveTypeError(expectedMessage));
                            });
                        });
                    });
                });
            });

            describe('Success cases should not throw an error', (): void => {
                test.each(
                    successCases
                )(`${methodName}($input)`, ({ input: testInput }: TestCase): void => {
                    expect((): void => {
                        method(testInput);
                    }).not.toThrow();
                });
            });
        });
    }

    testTypeAssertions(
        'assertFunctionType',
        (input: unknown, message?: string): void => {
            TypeAssertions.assertFunctionType(input, message);
        },
        'a function',
        [
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
        nonFunctionInputs
    );

    testTypeAssertions(
        'assertObjectType',
        (input: unknown, message?: string): void => {
            TypeAssertions.assertObjectType(input, message);
        },
        'a non-array object',
        [
            {},
            { key: 'value' },
            { 'other key': 'other value' },
            RandomNumberGeneratorFactory.build('seed'),
            new Error(),
            new Set<string>()
        ],
        [
            ...nonObjectInputs,
            [],
            [1, 2, 3],
            ['a', 'b', 'c'],
            [{ key: 1 }, { key: 2 }, { key: 3 }]
        ]
    );

    testTypeAssertions(
        'assertArrayType',
        (input: unknown, message?: string): void => {
            TypeAssertions.assertArrayType(input, message);
        },
        'an array',
        [
            [],
            [1, 2, 3],
            ['a', 'b', 'c'],
            [{ key: 1 }, { key: 2 }, { key: 3 }],
            [[1, 2, 3], [4, 5, 6]]
        ],
        nonArrayInputs
    );
});
