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

import { Discriminated, DiscriminatorRegistration, DiscriminatorRegistry, TypeGuard } from '../../src';

import { nonFunctionInputs } from '../utils/input/function-inputs';
import { nonObjectInputs } from '../utils/input/object-inputs';
import { emptyStringInputs, nonStringInputs, singleLineTrimmedFailureInputs } from '../utils/input/string-inputs';
import { Scenario, TestCase, buildTestCases } from '../utils/test-case/test-case';

describe('DiscriminatorRegistry', (): void => {
    enum TestDiscriminators {
        TEST = '@blwat/utils:DiscriminatorRegistryTests'
    }

    interface TestObject extends Discriminated {
        discriminator: TestDiscriminators.TEST;
        key: string;
    }

    const isTestObject: TypeGuard<TestObject> = DiscriminatorRegistry.register<TestObject>({
        discriminator: TestDiscriminators.TEST,
        validator: (input: unknown): boolean => {
            return typeof input === 'object'
                && (input as Discriminated).discriminator === TestDiscriminators.TEST.valueOf()
                && typeof (input as TestObject).key === 'string';
        }
    });

    describe('new DiscriminatorRegistry()', (): void => {
        describe('Runtime behavior guards', (): void => {
            test('Constructor should throw an error when instantiated at runtime', (): void => {
                const RuntimeConstructor = DiscriminatorRegistry as unknown as new () => DiscriminatorRegistry;
                expect((): DiscriminatorRegistry => new RuntimeConstructor()).toThrow(Error);
            });
        });
    });

    describe('has', (): void => {
        test('Unregistered keys should return false', (): void => {
            expect(DiscriminatorRegistry.has('unregistered')).toBe(false);
        });

        test('Registered keys should return true', (): void => {
            expect(DiscriminatorRegistry.has(TestDiscriminators.TEST)).toBe(true);
        });

        describe('input validation', (): void => {
            const scenarios: Scenario[] = [
                {
                    label: 'non-string discriminators',
                    inputs: [
                        ...nonStringInputs
                    ],
                    expected: false
                }
            ];

            describe.each(
                scenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(DiscriminatorRegistry.has(testInput as string)).toBe(testExpected);
                });
            });

            test('has("") should always return false', (): void => {
                expect(DiscriminatorRegistry.has('')).toBe(false);
            });
        });
    });

    describe('register', (): void => {
        describe('Register should return a method that validates the registered Discriminated type', (): void => {
            const scenarios: Scenario[] = [
                {
                    label: 'non-object inputs',
                    inputs: [
                        ...nonObjectInputs
                    ],
                    expected: false
                },
                {
                    label: 'object inputs without discriminator',
                    inputs: [
                        {},
                        { property: 'value' },
                        { key: 'value' }
                    ],
                    expected: false
                },
                {
                    label: 'object inputs with incorrect discriminator',
                    inputs: [
                        { discriminator: '' },
                        { discriminator: 'invalid' },
                        { discriminator: 5 },
                        {
                            discriminator: 'invalid',
                            key: 'value'
                        }
                    ],
                    expected: false
                },
                {
                    label: 'object inputs with correct discriminator, but incorrect schema',
                    inputs: [
                        {
                            discriminator: TestDiscriminators.TEST
                        },
                        {
                            discriminator: TestDiscriminators.TEST,
                            key: 10
                        },
                        {
                            discriminator: TestDiscriminators.TEST,
                            key: (): number => 10
                        },
                        {
                            discriminator: TestDiscriminators.TEST,
                            key: (): string => 'value'
                        },
                        {
                            discriminator: TestDiscriminators.TEST,
                            property: 'value'
                        }
                    ],
                    expected: false
                },
                {
                    label: 'object inputs with correct schema',
                    inputs: [
                        {
                            discriminator: TestDiscriminators.TEST,
                            key: 'value'
                        },
                        {
                            discriminator: TestDiscriminators.TEST,
                            key: ''
                        }
                    ],
                    expected: true
                }
            ];

            describe.each(
                scenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(isTestObject(testInput)).toBe(testExpected);
                });
            });
        });

        describe('Register should return a method that can act as a type guard for the Discriminated type', (): void => {
            test('Type guard should narrow the type of the input to the registered Discriminated type', (): void => {
                const valueA: string = 'valueA';
                const inputA: unknown = {
                    discriminator: TestDiscriminators.TEST,
                    key: valueA
                };

                if (isTestObject(inputA)) {
                    expect(inputA.key).toBe(valueA);
                } else {
                    fail('Type guard failed to narrow the type of the input to the registered Discriminated type');
                }
            });

            test('Type guard should not narrow the type of inputs that do not match the registered Discriminated type', (): void => {
                const inputA: unknown = {
                    discriminator: TestDiscriminators.TEST
                };

                if (isTestObject(inputA)) {
                    fail('Type guard incorrectly narrowed the type of the input to the registered Discriminated type');
                }
            });
        });

        describe('Input validation', (): void => {
            function buildRegistrations(discriminators: unknown[], validators: unknown[]): DiscriminatorRegistration[] {
                const registrations: DiscriminatorRegistration[] = [];

                discriminators.forEach((discriminator: unknown): void => {
                    validators.forEach((validator: unknown): void => {
                        registrations.push({
                            discriminator: discriminator as string,
                            validator: validator as ((input: unknown) => boolean)
                        });
                    });
                });

                return registrations;
            }

            const scenarios: Scenario[] = [
                {
                    label: 'non-object registration',
                    inputs: [
                        ...nonObjectInputs
                    ],
                    expected: TypeError
                },
                {
                    label: 'non-string discriminators',
                    inputs: [
                        ...buildRegistrations([
                            ...nonStringInputs
                        ], [(): boolean => false])
                    ],
                    expected: TypeError
                },
                {
                    label: 'empty string discriminators',
                    inputs: [
                        ...buildRegistrations([
                            ...emptyStringInputs
                        ], [(): boolean => false])
                    ],
                    expected: TypeError
                },
                {
                    label: 'multi-line string discriminators',
                    inputs: [
                        ...buildRegistrations([
                            ...singleLineTrimmedFailureInputs
                        ], [(): boolean => false])
                    ],
                    expected: TypeError
                },
                {
                    label: 'non-function validators',
                    inputs: [
                        ...buildRegistrations(['test-discriminator'], [
                            ...nonFunctionInputs
                        ])
                    ],
                    expected: TypeError
                }
            ];

            describe.each(
                scenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - invalid registration $input should throw $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect((): TypeGuard<Discriminated> => DiscriminatorRegistry.register(testInput as DiscriminatorRegistration)).toThrow(testExpected);
                });
            });
        });
    });
});
