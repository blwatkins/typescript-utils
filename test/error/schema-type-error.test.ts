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

import { SchemaTypeError } from '../../src';

describe('SchemaTypeError', (): void => {
    describe('new SchemaTypeError()', (): void => {
        test('new SchemaTypeError() should extend TypeError', (): void => {
            expect(() => {
                throw new SchemaTypeError();
            }).toThrow(TypeError);
        });
    });

    describe('code', (): void => {
        const expectedCode: 'ERR_INVALID_ARG_TYPE' = 'ERR_INVALID_ARG_TYPE' as const;

        test(`Error code should be ${expectedCode}`, (): void => {
            try {
                throw new SchemaTypeError();
            } catch (error) {
                expect((error as SchemaTypeError).code).to.equal(expectedCode);
            }
        });
    });
});
