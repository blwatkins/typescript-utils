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

import { PrimitiveTypeError, StaticInstanceError, StringUtility } from '../../src';

import { testAssertMethod } from '../utils/assert/assert-tests';

import {
    emptyStringInputs,
    nonEmptyStringInputs,
    nonStringInputs,
    singleLineTrimmedInputsNumsAndSymbols,
    singleLineTrimmedFailureInputsLowercase,
    singleLineTrimmedInputsLowercase,
    singleLineTrimmedInputsMixedCase,
    singleLineTrimmedInputsUppercase,
    singleLineTrimmedFailureInputsUppercase,
    singleLineTrimmedFailureInputsMixedCase,
    singleLineTrimmedFailureInputs,
    singleLineTrimmedInputs
} from '../utils/input/string-inputs';

import { testStaticClassConstructor } from '../utils/static/static-class-tests';
import { Scenario, TestCase, buildTestCases } from '../utils/test-case/test-case';

describe('StringUtility', (): void => {
    testStaticClassConstructor('StringUtility', StringUtility as unknown as new () => unknown, StaticInstanceError);

    describe('String', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            }
        ];

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

        const scenarios: Scenario[] = [
            ...failureScenarios.map((scenario: Scenario): Scenario => {
                return {
                    ...scenario,
                    expected: false
                };
            }),
            ...successScenarios.map((scenario: Scenario): Scenario => {
                return {
                    ...scenario,
                    expected: true
                };
            })
        ];

        describe('assertString', (): void => {
            testAssertMethod(
                StringUtility.assertString.bind(StringUtility),
                successScenarios,
                failureScenarios,
                'Expected a string.'
            );
        });

        describe('isString', (): void => {
            describe.each(
                scenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(StringUtility.isString(testInput)).toBe(testExpected);
                });
            });
        });
    });

    describe('Empty', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Non-empty string inputs',
                inputs: nonEmptyStringInputs,
                expected: PrimitiveTypeError
            }
        ];

        const successScenarios: Scenario[] = [
            {
                label: 'Empty string inputs',
                inputs: emptyStringInputs,
                expected: undefined
            }
        ];

        const scenarios: Scenario[] = [
            ...failureScenarios.map((scenario: Scenario): Scenario => {
                return {
                    ...scenario,
                    expected: false
                };
            }),
            ...successScenarios.map((scenario: Scenario): Scenario => {
                return {
                    ...scenario,
                    expected: true
                };
            })
        ];

        describe('assertEmpty', (): void => {
            testAssertMethod(
                StringUtility.assertEmpty.bind(StringUtility),
                successScenarios,
                failureScenarios,
                'Expected an empty string.'
            );
        });

        describe('isEmpty', (): void => {
            describe.each(
                scenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(StringUtility.isEmpty(testInput)).toBe(testExpected);
                });
            });
        });
    });

    describe('NonEmpty', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Empty string inputs',
                inputs: emptyStringInputs,
                expected: PrimitiveTypeError
            }
        ];

        const successScenarios: Scenario[] = [
            {
                label: 'Non-empty string inputs',
                inputs: nonEmptyStringInputs,
                expected: undefined
            }
        ];

        const scenarios: Scenario[] = [
            ...failureScenarios.map((scenario: Scenario): Scenario => {
                return {
                    ...scenario,
                    expected: false
                };
            }),
            ...successScenarios.map((scenario: Scenario): Scenario => {
                return {
                    ...scenario,
                    expected: true
                };
            })
        ];

        describe('assertNonEmpty', (): void => {
            testAssertMethod(
                StringUtility.assertNonEmpty.bind(StringUtility),
                successScenarios,
                failureScenarios,
                'Expected a non-empty string.'
            );
        });

        describe('isNonEmpty', (): void => {
            describe.each(
                scenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(StringUtility.isNonEmpty(testInput)).toBe(testExpected);
                });
            });
        });
    });

    describe('SingleLine', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Empty string inputs',
                inputs: emptyStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Single-line trimmed failure inputs',
                inputs: singleLineTrimmedFailureInputs,
                expected: PrimitiveTypeError
            }
        ];

        const successScenarios: Scenario[] = [
            {
                label: 'Single-line trimmed inputs',
                inputs: singleLineTrimmedInputs,
                expected: undefined
            }
        ];

        const scenarios: Scenario[] = [
            ...failureScenarios.map((scenario: Scenario): Scenario => {
                return {
                    ...scenario,
                    expected: false
                };
            }),
            ...successScenarios.map((scenario: Scenario): Scenario => {
                return {
                    ...scenario,
                    expected: true
                };
            })
        ];

        describe('assertSingleLine', (): void => {
            testAssertMethod(
                StringUtility.assertSingleLine.bind(StringUtility),
                successScenarios,
                failureScenarios,
                'Expected a single-line string.'
            );
        });

        describe('isSingleLine', (): void => {
            describe.each(
                scenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(StringUtility.isSingleLine(testInput)).toBe(testExpected);
                });
            });
        });

        describe('singleLine', (): void => {
            const stringScenarios: Scenario[] = scenarios.filter(({ inputs: scenarioInputs }: Scenario): boolean => {
                return scenarioInputs !== nonStringInputs;
            });

            describe.each(
                stringScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(StringUtility.singleLine.test(testInput as string)).toBe(testExpected);
                });
            });
        });
    });

    describe('SingleLineLowercase', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Empty string inputs',
                inputs: emptyStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Incorrect case inputs',
                inputs: [
                    ...singleLineTrimmedInputsUppercase,
                    ...singleLineTrimmedInputsMixedCase,
                    ...singleLineTrimmedFailureInputsUppercase,
                    ...singleLineTrimmedFailureInputsMixedCase
                ],
                expected: PrimitiveTypeError
            },
            {
                label: 'Single-line lowercase trimmed failure inputs',
                inputs: singleLineTrimmedFailureInputsLowercase,
                expected: PrimitiveTypeError
            }
        ];

        const successScenarios: Scenario[] = [
            {
                label: 'Single-line lowercase trimmed inputs',
                inputs: singleLineTrimmedInputsLowercase,
                expected: undefined
            },
            {
                label: 'Number and symbol trimmed inputs',
                inputs: singleLineTrimmedInputsNumsAndSymbols,
                expected: undefined
            }
        ];

        const scenarios: Scenario[] = [
            ...failureScenarios.map((scenario: Scenario): Scenario => {
                return {
                    ...scenario,
                    expected: false
                };
            }),
            ...successScenarios.map((scenario: Scenario): Scenario => {
                return {
                    ...scenario,
                    expected: true
                };
            })
        ];

        describe('assertSingleLineLowercase', (): void => {
            testAssertMethod(
                StringUtility.assertSingleLineLowercase.bind(StringUtility),
                successScenarios,
                failureScenarios,
                'Expected a single-line lowercase string.'
            );
        });

        describe('isSingleLineLowercase', (): void => {
            describe.each(
                scenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(StringUtility.isSingleLineLowercase(testInput)).toBe(testExpected);
                });
            });
        });

        describe('singleLineLowercase', (): void => {
            const stringScenarios: Scenario[] = scenarios.filter(({ inputs: scenarioInputs }: Scenario): boolean => {
                return scenarioInputs !== nonStringInputs;
            });

            describe.each(
                stringScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(StringUtility.singleLineLowercase.test(testInput as string)).toBe(testExpected);
                });
            });
        });
    });

    describe('SingleLineUppercase', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Empty string inputs',
                inputs: emptyStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Incorrect case inputs',
                inputs: [
                    ...singleLineTrimmedInputsLowercase,
                    ...singleLineTrimmedInputsMixedCase,
                    ...singleLineTrimmedFailureInputsLowercase,
                    ...singleLineTrimmedFailureInputsMixedCase
                ],
                expected: PrimitiveTypeError
            },
            {
                label: 'Single-line uppercase trimmed failure inputs',
                inputs: singleLineTrimmedFailureInputsUppercase,
                expected: PrimitiveTypeError
            }
        ];

        const successScenarios: Scenario[] = [
            {
                label: 'Single-line uppercase trimmed inputs',
                inputs: singleLineTrimmedInputsUppercase,
                expected: undefined
            },
            {
                label: 'Number and symbol trimmed inputs',
                inputs: singleLineTrimmedInputsNumsAndSymbols,
                expected: undefined
            }
        ];

        const scenarios: Scenario[] = [
            ...failureScenarios.map((scenario: Scenario): Scenario => {
                return {
                    ...scenario,
                    expected: false
                };
            }),
            ...successScenarios.map((scenario: Scenario): Scenario => {
                return {
                    ...scenario,
                    expected: true
                };
            })
        ];

        describe('assertSingleLineUppercase', (): void => {
            testAssertMethod(
                StringUtility.assertSingleLineUppercase.bind(StringUtility),
                successScenarios,
                failureScenarios,
                'Expected a single-line uppercase string.'
            );
        });

        describe('isSingleLineUppercase', (): void => {
            describe.each(
                scenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(StringUtility.isSingleLineUppercase(testInput)).toBe(testExpected);
                });
            });
        });

        describe('singleLineUppercase', (): void => {
            const stringScenarios: Scenario[] = scenarios.filter(({ inputs: scenarioInputs }: Scenario): boolean => {
                return scenarioInputs !== nonStringInputs;
            });

            describe.each(
                stringScenarios
            )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
                const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

                test.each(
                    testCases
                )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                    expect(StringUtility.singleLineUppercase.test(testInput as string)).toBe(testExpected);
                });
            });
        });
    });

    describe('[DEPRECATED] singleLineLowercaseTrimmedPattern', (): void => {
        test('should return the same regular expression as singleLineLowercase', (): void => {
            expect(StringUtility.singleLineLowercaseTrimmedPattern).toBe(StringUtility.singleLineLowercase);
        });
    });

    describe('[DEPRECATED] singleLineUppercaseTrimmedPattern', (): void => {
        test('should return the same regular expression as singleLineUppercase', (): void => {
            expect(StringUtility.singleLineUppercaseTrimmedPattern).toBe(StringUtility.singleLineUppercase);
        });
    });

    describe('[DEPRECATED] singleLineTrimmedPattern', (): void => {
        test('should return the same regular expression as singleLine', (): void => {
            expect(StringUtility.singleLineTrimmedPattern).toBe(StringUtility.singleLine);
        });
    });

    describe('[DEPRECATED] assertStringType', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            }
        ];

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

        testAssertMethod(
            StringUtility.assertStringType.bind(StringUtility),
            successScenarios,
            failureScenarios,
            'Expected a string.'
        );
    });

    describe('[DEPRECATED] assertSingleLineTrimmedString', (): void => {
        const failureScenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: nonStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Empty string inputs',
                inputs: emptyStringInputs,
                expected: PrimitiveTypeError
            },
            {
                label: 'Single-line trimmed failure inputs',
                inputs: singleLineTrimmedFailureInputs,
                expected: PrimitiveTypeError
            }
        ];

        const successScenarios: Scenario[] = [
            {
                label: 'Single-line trimmed inputs',
                inputs: singleLineTrimmedInputs,
                expected: undefined
            }
        ];

        testAssertMethod(
            StringUtility.assertSingleLineTrimmedString.bind(StringUtility),
            successScenarios,
            failureScenarios,
            'Expected a single-line string.'
        );
    });

    describe('[DEPRECATED] isNonEmptyString', (): void => {
        const scenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: [...nonStringInputs],
                expected: false
            },
            {
                label: 'Empty string inputs',
                inputs: [...emptyStringInputs],
                expected: false
            },
            {
                label: 'Non-empty string inputs',
                inputs: [...nonEmptyStringInputs],
                expected: true
            }
        ];

        describe.each(
            scenarios
        )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
            const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

            test.each(
                testCases
            )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                expect(StringUtility.isNonEmptyString(testInput)).toBe(testExpected);
            });
        });
    });

    describe('[DEPRECATED] isSingleLineTrimmedString', (): void => {
        const scenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: [...nonStringInputs],
                expected: false
            },
            {
                label: 'Empty string inputs',
                inputs: [...emptyStringInputs],
                expected: false
            },
            {
                label: 'Single-line trimmed failure inputs',
                inputs: [...singleLineTrimmedFailureInputs],
                expected: false
            },
            {
                label: 'Single-line trimmed inputs',
                inputs: [...singleLineTrimmedInputs],
                expected: true
            }
        ];

        describe.each(
            scenarios
        )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
            const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

            test.each(
                testCases
            )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                expect(StringUtility.isSingleLineTrimmedString(testInput)).toBe(testExpected);
            });
        });
    });

    describe('[DEPRECATED] isSingleLineLowercaseTrimmedString', (): void => {
        const scenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: [...nonStringInputs],
                expected: false
            },
            {
                label: 'Empty string inputs',
                inputs: [...emptyStringInputs],
                expected: false
            },
            {
                label: 'Incorrect case inputs',
                inputs: [
                    ...singleLineTrimmedInputsUppercase,
                    ...singleLineTrimmedInputsMixedCase,
                    ...singleLineTrimmedFailureInputsUppercase,
                    ...singleLineTrimmedFailureInputsMixedCase
                ],
                expected: false
            },
            {
                label: 'Single-line lowercase trimmed failure inputs',
                inputs: [...singleLineTrimmedFailureInputsLowercase],
                expected: false
            },
            {
                label: 'Single-line lowercase trimmed inputs',
                inputs: [...singleLineTrimmedInputsLowercase],
                expected: true
            },
            {
                label: 'Number and symbol trimmed inputs',
                inputs: [...singleLineTrimmedInputsNumsAndSymbols],
                expected: true
            }
        ];

        describe.each(
            scenarios
        )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
            const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

            test.each(
                testCases
            )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                expect(StringUtility.isSingleLineLowercaseTrimmedString(testInput)).toBe(testExpected);
            });
        });
    });

    describe('[DEPRECATED] isSingleLineUppercaseTrimmedString', (): void => {
        const scenarios: Scenario[] = [
            {
                label: 'Non-string inputs',
                inputs: [...nonStringInputs],
                expected: false
            },
            {
                label: 'Empty string inputs',
                inputs: [...emptyStringInputs],
                expected: false
            },
            {
                label: 'Incorrect case inputs',
                inputs: [
                    ...singleLineTrimmedInputsLowercase,
                    ...singleLineTrimmedInputsMixedCase,
                    ...singleLineTrimmedFailureInputsLowercase,
                    ...singleLineTrimmedFailureInputsMixedCase
                ],
                expected: false
            },
            {
                label: 'Single-line uppercase trimmed failure inputs',
                inputs: [...singleLineTrimmedFailureInputsUppercase],
                expected: false
            },
            {
                label: 'Single-line uppercase trimmed inputs',
                inputs: [...singleLineTrimmedInputsUppercase],
                expected: true
            },
            {
                label: 'Number and symbol trimmed inputs',
                inputs: [...singleLineTrimmedInputsNumsAndSymbols],
                expected: true
            }
        ];

        describe.each(
            scenarios
        )('%# - $label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
            const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

            test.each(
                testCases
            )('%# - Input $input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
                expect(StringUtility.isSingleLineUppercaseTrimmedString(testInput)).toBe(testExpected);
            });
        });
    });
});
