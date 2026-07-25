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

export function testErrorType(name: string, constructor: new() => unknown, inheritedType: new() => Error /* defaultMessage: string, code: string */): void {
    describe(`new ${name}()`, (): void => {
        test(`new ${name}() should return an instance of ${name}`, (): void => {
            expect(new constructor()).toBeInstanceOf(constructor);
        });

        test(`${name} should extend ${inheritedType.name}`, (): void => {
            expect(new constructor()).toBeInstanceOf(inheritedType);
        });
    });

    // describe('defaultMessage', (): void => {
    //     test('Default message should be the expected default message', (): void => {
    //         expect(SchemaTypeError.defaultMessage).toBe('Input does not match schema requirements');
    //     });
    // });
    //
    // describe('code', (): void => {
    //     test('Code should be ERR_INVALID_ARG_TYPE', (): void => {
    //         expect(new SchemaTypeError().code).toBe('ERR_INVALID_ARG_TYPE');
    //     });
    // });
    //
    // describe('name', (): void => {
    //     test('Name should be SchemaTypeError', (): void => {
    //         expect(new SchemaTypeError().name).toBe('SchemaTypeError');
    //     });
    // });
    //
    // describe('message', (): void => {
    //     test('Message should use the default message when not set', (): void => {
    //         expect(new SchemaTypeError().message).toBe(SchemaTypeError.defaultMessage);
    //     });
    //
    //     test('Message should use the given message when set', (): void => {
    //         const message: string = 'custom schema failure';
    //         expect(new SchemaTypeError(message).message).toBe(message);
    //     });
    // });
}
