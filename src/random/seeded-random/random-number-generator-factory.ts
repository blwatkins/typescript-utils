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

import { SeededRandomNumberGenerator } from './seeded-random-number-generator';
import { SeedVersions } from './seed-versions';

/**
 * @type {TextEncoder}
 */
const textEncoder: TextEncoder = new TextEncoder();

export class RandomNumberGeneratorFactory {
    /**
     * Prime number for FNV-1a hashing algorithm.
     * This number is an algorithmic constant; it must not change.
     * @constant
     * @private
     * @returns {0x0100019}
     */
    static get #fnvPrime(): 0x01000193 {
        return 0x01000193;
    }

    public static build(seed: string, namespace?: string, version?: number): SeededRandomNumberGenerator {
        const input = RandomNumberGeneratorFactory.#buildInputString(seed, namespace);
        const state = RandomNumberGeneratorFactory.#generateFnvHashState(input);
        return new SeededRandomNumberGenerator(state, version);
    }

    public static async asyncBuild(seed: string, namespace?: string, version: number = 0): Promise<SeededRandomNumberGenerator> {
        const input = RandomNumberGeneratorFactory.#buildInputString(seed, namespace);
        const state = await RandomNumberGeneratorFactory.#generateSha256HashState(input);
        return new SeededRandomNumberGenerator(state, version);
    }

    static #buildInputString(seed: string, namespace?: string): string {
        if (namespace) {
            return `${namespace}\x00${seed}`;
        } else {
            return seed;
        }
    }

    static #generateFnvHashState(input: string, version: number = 0): [number, number, number, number] {
        const bytes = textEncoder.encode(input);
        let offsets;

        if (SeedVersions.isValidIndex(version)) {
            offsets = SeedVersions.getVersion(version).offsets;
        } else {
            console.warn(`Seed version ${version} is not a valid index. Defaulting to version 0.`);
            offsets = SeedVersions.getVersion(0).offsets;
        }

        const [o0, o1, o2, o3] = offsets;

        const hash = (offset: number): number => {
            let h = offset;
            for (const byte of bytes) {
                h ^= byte;
                h = Math.imul(h, RandomNumberGeneratorFactory.#fnvPrime);
            }
            return h >>> 0;
        };

        return [
            hash(o0), hash(o1), hash(o2), hash(o3)
        ];
    }

    // /**
    //  * Hashes str with SHA-256 and folds the 256-bit output into 128 bits by
    //  * XOR-ing the two 128-bit halves together, fully utilising all output bits.
    //  */
    static async #generateSha256HashState(input: string): Promise<[number, number, number, number]> {
        const hashBuffer = await crypto.subtle.digest('SHA-256', textEncoder.encode(input));
        const v = new DataView(hashBuffer);

        return [
            (v.getUint32(0, false) ^ v.getUint32(16, false)) >>> 0,
            (v.getUint32(4, false) ^ v.getUint32(20, false)) >>> 0,
            (v.getUint32(8, false) ^ v.getUint32(24, false)) >>> 0,
            (v.getUint32(12, false) ^ v.getUint32(28, false)) >>> 0
        ];
    }
}
