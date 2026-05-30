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
import {SeedVersion, SeedVersions} from "../../../src/random/seeded-random/seed-versions";
import {buildTestCases, Scenario, TestCase} from "../../utils/test-case/test-case";
import {negativeNumberInputs, nonNumberInputs} from "../../utils/input/number-inputs";

describe('SeedVersions', () => {
    const expectedSeedVersions: SeedVersion[] = [
        {
            offsets: Object.freeze([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a]),
            defaultStateValue: Object.freeze(0x6a09e667)
        },
        {
            offsets: Object.freeze([0x811c9dc5, 0x34f9a34, 0xa1b2c3d4, 0x5e6f7a8b]),
            defaultStateValue: Object.freeze(0x811c9dc5)
        }
    ];

   describe('size', () => {
      test(`SeedVersions.size should be ${expectedSeedVersions.length}`, () => {
         expect(SeedVersions.size).toBe(expectedSeedVersions.length);
      });
   });

   describe('isValidIndex', () => {
       function buildValidIndexes() {
           const indexes: number[] = [];

           for (let i = 0; i < SeedVersions.size; i++) {
               indexes.push(i);
           }

           return indexes;
       }

       const scenarios: Scenario[] = [
           {
               label: 'Non-number inputs',
               inputs: [...nonNumberInputs],
               expected: false
           },
           {
             label: 'Invalid number indexes',
               inputs: [
                   SeedVersions.size,
                   SeedVersions.size + 1,
                   ...negativeNumberInputs
               ],
               expected: false
           },
           {
               label: 'Valid indexes',
               inputs: [
                   ...buildValidIndexes()
               ],
               expected: true
           },
       ];

       describe.each(
           scenarios
       )('$label', ({ inputs: scenarioInputs, expected: scenarioExpected }: Scenario): void => {
           const testCases: TestCase[] = buildTestCases(scenarioInputs, scenarioExpected);

           test.each(
               testCases
           )('$input should return $expected', ({ input: testInput, expected: testExpected }: TestCase): void => {
               expect(SeedVersions.isValidIndex(testInput as number)).toBe(testExpected);
           });
       });
   });
});
