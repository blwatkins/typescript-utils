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

import { StringUtility } from '../string';

import { Discriminated } from './discriminated';

/**
 * A type guard function that checks if an input is of a specific {@link Discriminated} type.
 *
 * @public
 * @since 0.1.0
 */
export type TypeGuard<T extends Discriminated> = (input: unknown) => input is T;

/**
 * A registration for a discriminator to the {@link DiscriminatorRegistry}.
 *
 * @public
 * @since 0.1.0
 */
export interface DiscriminatorRegistration {
    /**
     * The discriminator value that identifies the type of a {@link Discriminated} object.
     * This value must be unique across all registered discriminators.
     *
     * @type {string}
     * @readonly
     * @since 0.1.0
     */
    readonly discriminator: string;

    /**
     * A method that validates whether an input matches the type associated with the {@link discriminator}.
     *
     * @param {unknown} input - The input to validate.
     *
     * @returns {boolean} - `true` if the input matches the type associated with the discriminator, `false` otherwise.
     *
     * @type {(input: unknown) => boolean}
     * @readonly
     * @since 0.1.0
     */
    readonly validator: (input: unknown) => boolean;
}

/**
 * Static registry for managing discriminators and their associated type guards.
 * Discriminators are used to identify the type of a {@link Discriminated} object and validate it using a registered type guard function.
 *
 * @public
 * @since 0.1.0
 */
export class DiscriminatorRegistry {
    /**
     * A map of discriminator values to their corresponding validation functions.
     *
     * @type {Map<string, (input: unknown) => boolean>}
     * @readonly
     * @private
     */
    static readonly #discriminators: Map<string, (input: unknown) => boolean> = new Map<string, (input: unknown) => boolean>();

    /**
     * Private constructor.
     *
     * @throws {Error} - DiscriminatorRegistry is a static class and cannot be instantiated.
     *
     * @private
     */
    private constructor() {
        throw new Error('DiscriminatorRegistry is a static class and cannot be instantiated.');
    }

    /**
     * Checks if a discriminator is already registered.
     *
     * @param {string} discriminator - The discriminator value to check.
     *
     * @returns {boolean} - `true` if the discriminator is registered, `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static has(discriminator: string): boolean {
        return DiscriminatorRegistry.#discriminators.has(discriminator);
    }

    /**
     * Registers a new discriminator and its associated validation function.
     *
     * @param {DiscriminatorRegistration} registration - The registration details for the discriminator.
     *
     * @returns {TypeGuard<T>} - A type guard function for the registered type.
     *
     * @throws {TypeError} - When the given input is not an object.
     * @throws {TypeError} - When the {@link DiscriminatorRegistration.discriminator} is not a non-empty single line trimmed string.
     * @throws {TypeError} - When the {@link DiscriminatorRegistration.validator} property is not a function.
     * @throws {Error} - When the {@link DiscriminatorRegistration.discriminator} is already registered.
     *
     * @public
     * @since 0.1.0
     */
    public static register<T extends Discriminated>(registration: DiscriminatorRegistration): TypeGuard<T> {
        DiscriminatorRegistry.#validateRegistration(registration);
        DiscriminatorRegistry.#discriminators.set(registration.discriminator, registration.validator);

        return (input: unknown): input is T => {
            return DiscriminatorRegistry.validate(input, registration.discriminator);
        };
    }

    /**
     * Validates an input against a specific discriminator.
     *
     * @param {unknown} input - The input to validate.
     * @param {string} discriminator - The discriminator value to check.
     *
     * @returns {boolean} - `true` if the input matches the type associated with the discriminator, `false` otherwise.
     *
     * @public
     * @since 0.1.0
     */
    public static validate(input: unknown, discriminator: string): boolean {
        if (!DiscriminatorRegistry.#isDiscriminated(input, discriminator)) {
            return false;
        }

        const validator: ((input: unknown) => boolean) | undefined = DiscriminatorRegistry.#discriminators.get(discriminator);

        if (validator) {
            return validator(input);
        }

        return false;
    }

    /**
     * Validates a discriminator registration object to ensure it has the required properties and that the discriminator value is unique.
     *
     * @see {@link StringUtility.isSingleLineTrimmedString}
     *
     * @param {unknown} input - The input to validate.
     *
     * @returns {void}
     *
     * @throws {TypeError} - When the given input is not an object.
     * @throws {TypeError} - When the {@link DiscriminatorRegistration.discriminator} is not a non-empty single line trimmed string.
     * @throws {TypeError} - When the {@link DiscriminatorRegistration.validator} property is not a function.
     * @throws {Error} - When the {@link DiscriminatorRegistration.discriminator} is already registered.
     *
     * @private
     */
    static #validateRegistration(input: unknown): void {
        if (!input || typeof input !== 'object' || Array.isArray(input)) {
            throw new TypeError('Registration must be an object.');
        }

        const record = input as Record<string, unknown>;

        if (!StringUtility.isSingleLineTrimmedString(record['discriminator'])) {
            throw new TypeError(`Discriminator '${record['discriminator'] as string}' must be a non-empty single line trimmed string.`);
        }

        if (typeof record['validator'] !== 'function') {
            throw new TypeError(`Discriminator '${record['discriminator']}' must have a validator function.`);
        }

        if (DiscriminatorRegistry.has(record['discriminator'])) {
            throw new Error(`Discriminator '${record['discriminator']}' is already registered.`);
        }
    }

    /**
     * Is the given input an object with a discriminator property that matches the given discriminator value?
     *
     * @param {unknown} input - The input to check.
     * @param {string} discriminator - The discriminator value to match.
     *
     * @returns {boolean} - `true` if the input is an object with a discriminator property that matches the given discriminator value, `false` otherwise.
     *
     * @private
     */
    static #isDiscriminated(input: unknown, discriminator: string): boolean {
        if (input && typeof input === 'object') {
            return (input as Discriminated).discriminator === discriminator;
        }

        return false;
    }
}
