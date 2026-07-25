/*
 * Copyright (c) 2024-2026 Brittni Watkins.
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

import { Type, type Static } from 'typebox';

/**
 * TypeBox schema for validating that an object implements the {@link Discriminated} type.
 *
 * @since 0.1.0
 */
export const discriminatedSchema = Type.Object(
    {
        /**
         * The discriminator value that identifies the type of a {@link Discriminated} object.
         * This value must be unique across all registered discriminators.
         *
         * @type {string}
         * @since 0.1.0
         */
        discriminator: Type.Readonly(Type.String())
    }
);

/**
 * Discriminated objects can be type checked using the discriminator registry.
 *
 * @since 0.1.0
 */
export type Discriminated = Static<typeof discriminatedSchema>;
