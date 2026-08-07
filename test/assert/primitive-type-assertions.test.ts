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

import { PrimitiveTypeAssertions, PrimitiveTypeError, StaticInstanceError } from '../../src';

import { nonFunctionInputs } from '../utils/input/function-inputs';
import { nonStringInputs, singleLineTrimmedFailureInputs } from '../utils/input/string-inputs';
import { testStaticClassConstructor } from '../utils/static/static-class-tests';

describe('PrimitiveTypeAssertions', () => {
    testStaticClassConstructor('PrimitiveTypeAssertions', PrimitiveTypeAssertions as unknown as new () => unknown, StaticInstanceError);

    describe('assertFunctionType', (): void => {
        describe('Non-function types should throw a PrimitiveTypeError', (): void => {
            describe('With default message', (): void => {
                test.each(
                    nonFunctionInputs
                )('%# - assertFunctionType(%o)', (input: unknown): void => {
                    const expectedMessage = `Expected a function, but received: ${typeof input}`;

                    try {
                        PrimitiveTypeAssertions.assertFunctionType(input);
                        fail('Method should throw error');
                    } catch (e) {
                        const error: PrimitiveTypeError = e as PrimitiveTypeError;
                        expect(error.message).toBe(expectedMessage);
                    }
                });
            });

            describe('With custom message', (): void => {
                const expectedMessage = 'test custom function message';

                test.each(
                    nonFunctionInputs
                )(`%# - assertFunctionType(%o, ${expectedMessage})`, (input: unknown): void => {
                    try {
                        PrimitiveTypeAssertions.assertFunctionType(input, expectedMessage);
                        fail('Method should throw error');
                    } catch (e) {
                        const error: PrimitiveTypeError = e as PrimitiveTypeError;
                        expect(error.message).toBe(expectedMessage);
                    }
                });
            });

            describe('With invalid message type', (): void => {
                describe.each([
                    ...nonFunctionInputs
                ])('%# - assertFunctionType(%o, message) should throw with default message when given message is not a single-line trimmed string', (input: unknown): void => {
                    const expectedMessage = `Expected a function, but received: ${typeof input}`;

                    describe('Non-string type message', (): void => {
                        test.each(
                            nonStringInputs
                        )(`%# - assertFunctionType(${input as string}, %o)`, (message: unknown): void => {
                            try {
                                PrimitiveTypeAssertions.assertFunctionType(input, message as string);
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
                        )(`%# - assertFunctionType(${input as string}, %s)`, (message: string): void => {
                            try {
                                PrimitiveTypeAssertions.assertFunctionType(input, message);
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

        describe('Function types should not throw an error', (): void => {
            test.each([
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
            ])('assertFunctionType(%o)', (input: unknown): void => {
                expect((): void => {
                    PrimitiveTypeAssertions.assertFunctionType(input);
                }).not.toThrow(PrimitiveTypeError);
            });
        });
    });
});
