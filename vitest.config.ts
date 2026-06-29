/*
 * Copyright (c) 2025-2026 Brittni Watkins.
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

import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: [
            'node_modules/**',
            '_dist/**',
            '_compiled/**',
            '_coverage/**',
            '_doc/**',
            'docs/**'
        ],
        typecheck: {
            enabled: true,
            tsconfig: './tsconfig.vitest.json',
            include: ['test/**/*.{test,spec}.{ts,mts,cts,tsx}']
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov', 'json', 'json-summary', 'clover', 'html'],
            reportsDirectory: './_coverage',
            exclude: [
                'node_modules/**',
                '_dist/**',
                '_compiled/**',
                '_doc/**',
                'docs/**',
                'test/**',
                '**/*.d.ts',
                '**/*.config.{js,mjs,cjs,ts}',
                'eslint.config.*.mjs'
            ]
        }
    }
});
