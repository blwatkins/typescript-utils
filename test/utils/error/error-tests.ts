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

export function testErrorType(name: string, ErrorConstructor: new(message?: string) => Error, InheritedErrorType: new() => Error, expectedDefaultMessage: string): void {
    describe(`new ${name}()`, (): void => {
        test(`new ${name}() should return an instance of ${ErrorConstructor.name}`, (): void => {
            expect(new ErrorConstructor()).toBeInstanceOf(ErrorConstructor);
        });

        test(`${name} should extend ${InheritedErrorType.name}`, (): void => {
            expect(new ErrorConstructor()).toBeInstanceOf(InheritedErrorType);
        });
    });

    describe('name', (): void => {
        test(`Name should be ${name}`, (): void => {
            expect(new ErrorConstructor().name).toBe(name);
        });
    });

    describe('message', (): void => {
        test('Message should use the default message when not set', (): void => {
            expect(new ErrorConstructor().message).toBe(expectedDefaultMessage);
        });

        test('Message should use the given message when set', (): void => {
            const message: string = 'TEST FAILURE MESSAGE';
            expect(new ErrorConstructor(message).message).toBe(message);
        });
    });
}
