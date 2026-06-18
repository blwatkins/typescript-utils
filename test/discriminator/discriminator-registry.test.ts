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

import { Discriminated, DiscriminatorRegistry } from '../../src';

describe('DiscriminatorRegistry', (): void => {
    enum TestDiscriminators {
        TEST = '@blwat/utils:DiscriminatorRegistryTests'
    };

    interface TestOject extends Discriminated {
        discriminator: TestDiscriminators.TEST;
    };

    const isTestObject = DiscriminatorRegistry.register({
        discriminator: TestDiscriminators.TEST,
        validate: (input: unknown): boolean => {
            return typeof input === 'object' && (input as Discriminated).discriminator === TestDiscriminators.TEST;
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
        test('unregistered keys should return false', (): void => {
            expect(DiscriminatorRegistry.has('unregistered')).toBe(false);
        });

        test('registered keys should return true', (): void => {
            expect(DiscriminatorRegistry.has(TestDiscriminators.TEST)).toBe(true);
        });

        describe('input validation', (): void => {
            test.todo('has() input validation');

            test.todo('has(empty) should always return false');
        });
    });

    test.todo('DiscriminatorRegistry.register()');

    test.todo('Discriminator must be a non-empty string');
});
