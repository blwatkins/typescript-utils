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

import { describe, test, expect } from 'vitest';

import { Scenario, TestCase, buildTestCases } from '../test-case/test-case';

export function testAssertMethod(
    method: (input: unknown, message?: string) => asserts input is unknown,
    successScenarios: Scenario[],
    failureScenarios: Scenario[],
    buildDefaultMessage?: (input: unknown) => string
): void {
    const maxMessageTestCases: number = 5;

    describe('Success scenarios should not throw an error', (): void => {
        describe.each(
            successScenarios
        )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
            const successCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

            test.each(
                successCases
            )(`${method.name}($input) should not throw an error`, ({ input: testInput }: TestCase): void => {
                expect((): void => {
                    method(testInput);
                }).not.toThrow();
            });
        });
    });

    describe('Failure scenarios should throw an error with the correct type and message', (): void => {
        describe.each(
            failureScenarios
        )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
            const failureCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

            if (buildDefaultMessage) {
                describe('Failure scenarios should throw the expected error with default message', (): void => {
                    test.each(
                        failureCases
                    )(`%# - ${method.name}($input) should throw $expected with default message`, ({ input: testInput, expected: testExpected }: TestCase): void => {
                        const expectedMessage: string = buildDefaultMessage(testInput);
                        const ExpectedErrorType: new (message?: string) => Error = testExpected as new (message?: string) => Error;

                        expect((): void => {
                            method(testInput);
                        }).toThrow(new ExpectedErrorType(expectedMessage));
                    });
                });
            } else {
                describe('Failure scenarios should throw the expected error', (): void => {
                    test.each(
                        failureCases
                    )(`%# - ${method.name}($input) should throw $expected`, ({ input: testInput, expected: testExpected }: TestCase): void => {
                        expect((): void => {
                            method(testInput);
                        }).toThrow(testExpected);
                    });
                });
            }

            describe('Failure scenarios should throw the expected error with custom message', (): void => {
                test.each(
                    failureCases.slice(0, Math.min(maxMessageTestCases, failureCases.length))
                )(`%# - ${method.name}($input) should throw $expected with custom message`, ({ input: testInput, expected: testExpected }: TestCase): void => {
                    const expectedMessage: string = `CUSTOM TEST ERROR MESSAGE: ${method.name}`;
                    const ExpectedErrorType: new (message?: string) => Error = testExpected as new (message?: string) => Error;

                    expect((): void => {
                        method(testInput, expectedMessage);
                    }).toThrow(new ExpectedErrorType(expectedMessage));
                });
            });

            describe('Failure scenarios should throw the expected error with default message when given message is not properly formatted', (): void => {
                const messageScenarios: Scenario[] = [
                    {
                        label: 'Non-string type message',
                        inputs: [
                            10,
                            false,
                            undefined,
                            null,
                            (): string => {
                                return 'hello';
                            },
                            {}
                        ],
                        expected: undefined
                    },
                    {
                        label: 'String type messages that are not single-line trimmed',
                        inputs: ['     ', ' \n\tmessage\t\n ', 'Multi\nLine\nMessage', 'MULTI\tTAB\tMESSAGE'],
                        expected: undefined
                    }
                ];

                describe.each(
                    failureCases.slice(0, Math.min(maxMessageTestCases, failureCases.length))
                )(`%# - ${method.name}($input, message) should throw $expected with default message if message is not properly formatted`, ({ input: failureInput, expected: failureExpected }: TestCase): void => {
                    describe.each(
                        messageScenarios
                    )('%# - $label', ({ inputs: messageScenarioInputs, expected: messageScenarioExpected }: Scenario): void => {
                        const messageTestCases: TestCase[] = buildTestCases(messageScenarioInputs, messageScenarioExpected);

                        test.each(
                            messageTestCases
                        )(`%# - ${method.name}(input, $input) should throw with default message`, ({ input: message }: TestCase): void => {
                            const ExpectedErrorType: new (message?: string) => Error = failureExpected as new (message?: string) => Error;

                            if (buildDefaultMessage) {
                                const expectedMessage: string = buildDefaultMessage(failureInput);

                                expect((): void => {
                                    method(failureInput, message as string);
                                }).toThrow(new ExpectedErrorType(expectedMessage));
                            } else {
                                expect((): void => {
                                    method(failureInput, message as string);
                                }).toThrow(ExpectedErrorType);

                                expect((): void => {
                                    method(failureInput, message as string);
                                }).not.toThrow(new ExpectedErrorType(message as string));
                            }
                        });
                    });
                });
            });
        });
    });
}
