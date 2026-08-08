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

import { fail } from 'node:assert';
import { describe, test, expect } from 'vitest';

import { PrimitiveTypeAssertions, PrimitiveTypeError, RandomNumberGeneratorFactory, StaticInstanceError } from '../../src';

import { nonArrayInputs } from '../utils/input/array-inputs';
import { nonFunctionInputs } from '../utils/input/function-inputs';
import { nonObjectInputs } from '../utils/input/object-inputs';
import { nonStringInputs, singleLineTrimmedFailureInputs } from '../utils/input/string-inputs';
import { testStaticClassConstructor } from '../utils/static/static-class-tests';

describe('PrimitiveTypeAssertions', () => {
    testStaticClassConstructor('PrimitiveTypeAssertions', PrimitiveTypeAssertions as unknown as new () => unknown, StaticInstanceError);

    function testPrimitiveTypeAssertions(
        methodName: string,
        method: (input: unknown, message?: string) => asserts input is unknown,
        expectedType: string,
        successInputs: unknown[],
        failureInputs: unknown[]
    ): void {
        describe(methodName, (): void => {
            describe('Failure cases should throw a PrimitiveTypeError', (): void => {
                describe('With default message', (): void => {
                    test.each(
                        failureInputs
                    )(`%# - ${methodName}(%o)`, (input: unknown): void => {
                        const expectedMessage = `Expected ${expectedType}, but received: ${typeof input}`;

                        try {
                            method(input);
                            fail('Method should throw error');
                        } catch (e) {
                            const error: PrimitiveTypeError = e as PrimitiveTypeError;
                            expect(error.message).toBe(expectedMessage);
                        }
                    });
                });

                describe('With custom message', (): void => {
                    const expectedMessage: string = `Test Custom Error: ${methodName}`;

                    test.each(
                        failureInputs
                    )(`%# - ${methodName}(%o, ${expectedMessage})`, (input: unknown): void => {
                        try {
                            method(input, expectedMessage);
                            fail('Method should throw error');
                        } catch (e) {
                            const error: PrimitiveTypeError = e as PrimitiveTypeError;
                            expect(error.message).toBe(expectedMessage);
                        }
                    });
                });

                describe('With invalid message type', (): void => {
                    describe.each(
                        failureInputs
                    )(`%# - ${methodName}(%o, message) should throw with default message when given message is not a single-line trimmed string`, (input: unknown): void => {
                        const expectedMessage: string = `Expected ${expectedType}, but received: ${typeof input}`;

                        describe('Non-string type message', (): void => {
                            test.each(
                                nonStringInputs
                            )(`%# - ${methodName}(${input as string}, %o)`, (message: unknown): void => {
                                try {
                                    method(input, message as string);
                                    fail('Method should throw error');
                                } catch (e) {
                                    const error: PrimitiveTypeError = e as PrimitiveTypeError;
                                    expect(error.message).toBe(expectedMessage);
                                }
                            });
                        });

                        describe('String type messages that are not single-line trimmed', (): void => {
                            test.each(
                                singleLineTrimmedFailureInputs
                            )(`%# - ${methodName}(${input as string}, %s)`, (message: string): void => {
                                try {
                                    method(input, message);
                                    fail('Method should throw error');
                                } catch (e) {
                                    const error: PrimitiveTypeError = e as PrimitiveTypeError;
                                    expect(error.message).toBe(expectedMessage);
                                }
                            });
                        });
                    });
                });
            });

            describe('Success cases should not throw an error', (): void => {
                test.each(
                    successInputs
                )(`${methodName}(%o)`, (input: unknown): void => {
                    expect((): void => {
                        method(input);
                    }).not.toThrow();
                });
            });
        });
    }

    testPrimitiveTypeAssertions(
        'assertFunctionType',
        PrimitiveTypeAssertions.assertFunctionType.bind(PrimitiveTypeAssertions),
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

    testPrimitiveTypeAssertions(
        'assertObjectType',
        PrimitiveTypeAssertions.assertObjectType.bind(PrimitiveTypeAssertions),
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
            new Array([]),
            new Array([1, 2, 3]),
            new Array(['a', 'b', 'c'])
        ]
    );

    testPrimitiveTypeAssertions(
        'assertArrayType',
        PrimitiveTypeAssertions.assertArrayType.bind(PrimitiveTypeAssertions),
        'an array',
        [
            new Array([]),
            new Array([1, 2, 3]),
            new Array(['a', 'b', 'c'])
        ],
        nonArrayInputs
    );
});
