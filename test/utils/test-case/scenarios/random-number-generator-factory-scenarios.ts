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

import { StringUtility } from '../../../../src';

import { SingleInputScenario } from '../test-case';

export const emptySeed: '' = '' as const;
export const emptyNamespace: '' = '' as const;
export const asciiSeed: 'test-seed-00' = 'test-seed-00' as const;
export const asciiNamespace: 'test-namespace-00' = 'test-namespace-00' as const;
export const unicodeSeed: '⭐' = '⭐' as const;
export const unicodeNamespace: '⭐' = '⭐' as const;
export const alternateAsciiSeed: 'test-seed-01' = 'test-seed-01' as const;
export const alternateAsciiNamespace: 'test-namespace-01' = 'test-namespace-01' as const;

/**
 * Sequences are keyed by their namespace and seed input. The version index should match the index of the sequence in the array.
 *
 * @remarks Once a seed version has been published, it should <b>NEVER</b> be changed or updated.
 * The order of seed versions should <b>NEVER</b> be changed.
 * New seed versions can only be added to the end of the array.
 * This array is meant to help ensure that the published SeedVersion data <b>NEVER</b> changes.
 * Once a test seed and namespace sequence has been determined, any deviation from that expected behavior is indicative of a breaking change and should be investigated immediately.
 */
const sequences: Record<string, number[][]> = {
    '': [
        [0.6126510770991445, 0.5643946416676044, 0.38175466656684875, 0.7515274793840945, 0.24603260564617813],
        [0.49630083329975605, 0.3427316921297461, 0.28943420201539993, 0.6272190597373992, 0.2841759657021612]
    ],
    'test-seed-00': [
        [0.634432977065444, 0.892023580847308, 0.2270001454744488, 0.7762062316760421, 0.9114420970436186],
        [0.9131155568175018, 0.8059730781242251, 0.13445386267267168, 0.7454464859329164, 0.9733928176574409]
    ],
    '⭐': [
        [0.9694232840556651, 0.9931980220135301, 0.6968804970383644, 0.2225059326738119, 0.24260783242061734],
        [0.7025466905906796, 0.6626785513944924, 0.7744495859369636, 0.045551665127277374, 0.4164407670032233]
    ],
    '\x00': [
        [0.39831331721507013, 0.4843225418590009, 0.7735811343882233, 0.9703194696921855, 0.2822851568926126],
        [0.00922908284701407, 0.15999095444567502, 0.23520832019858062, 0.1600181821268052, 0.8902565788011998]
    ],
    '\x00test-seed-00': [
        [0.9857979689259082, 0.5769003783352673, 0.3536436597350985, 0.14313794649206102, 0.6637496363837272],
        [0.32814985048025846, 0.7384980493225157, 0.37214375496841967, 0.3978444791864604, 0.013932629488408566]
    ],
    '\x00\u{2B50}': [
        [0.37069141771644354, 0.23734862101264298, 0.4412805705796927, 0.26357401884160936, 0.759549948386848],
        [0.5586106355767697, 0.39822131232358515, 0.1882337681017816, 0.2828179846983403, 0.8249882343225181]
    ],
    'test-namespace-00\x00': [
        [0.429135010112077, 0.4059295004699379, 0.7453151112422347, 0.9019149499945343, 0.7944666889961809],
        [0.9561880675610155, 0.39894641819410026, 0.8380574230104685, 0.12452865252271295, 0.7112857436295599]
    ],
    'test-namespace-00\x00test-seed-00': [
        [0.36890324554406106, 0.2832383685745299, 0.21109182643704116, 0.02280737296678126, 0.5548975511919707],
        [0.16553925978951156, 0.0020829227287322283, 0.4036088711582124, 0.5670350436121225, 0.02660752390511334]
    ],
    'test-namespace-00\x00\u{2B50}': [
        [0.1261833724565804, 0.7378131372388452, 0.9022562480531633, 0.4827564770821482, 0.9167597892228514],
        [0.6907067145220935, 0.7445812716614455, 0.04893128853291273, 0.6886665096972138, 0.2619732986204326]
    ],
    '\u{2B50}\x00': [
        [0.6774915291462094, 0.12901692721061409, 0.6346780364401639, 0.011455404106527567, 0.42550288373604417],
        [0.6262183571234345, 0.7334636326413602, 0.6237742265220731, 0.0703495570924133, 0.2775019649416208]
    ],
    '\u{2B50}\x00test-seed-00': [
        [0.4105529813095927, 0.26229324261657894, 0.22036562953144312, 0.7276874219533056, 0.09586782101541758],
        [0.6641748060937971, 0.2833109265193343, 0.8234883081167936, 0.890097884926945, 0.06740028411149979]
    ],
    '\u{2B50}\x00\u{2B50}': [
        [0.8694517486728728, 0.31749202124774456, 0.3135748093482107, 0.8771793032065034, 0.3635869675781578],
        [0.4572813929989934, 0.7933702548034489, 0.36279187840409577, 0.5844328647945076, 0.9936174526810646]
    ]
};

/**
 * Async sequences are keyed by their namespace and seed input.
 *
 * @remarks Once a test seed and namespace sequence has been determined, any deviation from that expected behavior is indicative of a breaking change and should be investigated immediately.
 */
const asyncSequences: Record<string, number[]> = {
    '': [0.10194779536686838, 0.056906999787315726, 0.37946939864195883, 0.5692655819002539, 0.7202949896454811],
    'test-seed-00': [0.9076406969688833, 0.3531756531447172, 0.7949081228580326, 0.4856217729393393, 0.7964264019392431],
    '⭐': [0.8377553941681981, 0.14736592373810709, 0.7329552192240953, 0.016792416805401444, 0.7275526772718877],
    '\x00': [0.6245411166455597, 0.5694993678480387, 0.6542486676480621, 0.8400051710195839, 0.41761275636963546],
    '\x00test-seed-00': [0.7357294938992709, 0.9484208014328033, 0.7492334074340761, 0.38040698366239667, 0.3216912359930575],
    '\x00\u{2B50}': [0.3601902867667377, 0.8510097854305059, 0.05685207503847778, 0.6396459962707013, 0.12097456795163453],
    'test-namespace-00\x00': [0.2743232031352818, 0.5142054653260857, 0.08303596614859998, 0.3077296211849898, 0.01142962509766221],
    'test-namespace-00\x00test-seed-00': [0.3368256282992661, 0.2785994508303702, 0.13822354609146714, 0.7088104309514165, 0.7525648046284914],
    'test-namespace-00\x00\u{2B50}': [0.9165182146243751, 0.9764112357515842, 0.122155416989699, 0.41633519786410034, 0.31247128872200847],
    '\u{2B50}\x00': [0.2128569260239601, 0.6676168274134398, 0.24674423807300627, 0.7099339656997472, 0.1563745115417987],
    '\u{2B50}\x00test-seed-00': [0.723055761307478, 0.6549743947107345, 0.8260620511136949, 0.07214514934457839, 0.34255548589862883],
    '\u{2B50}\x00\u{2B50}': [0.5487537963781506, 0.6774260615929961, 0.505424497416243, 0.46824415773153305, 0.3382368634920567]
};

function buildKey(seed: string, namespace?: string): string {
    if (StringUtility.isString(namespace)) {
        return `${namespace}\x00${seed}`;
    } else {
        return seed;
    }
}

export function getExpectedSequence(seed: string, namespace?: string, version?: number): number[] {
    const key: string = buildKey(seed, namespace);
    const index: number = version ?? 0;
    return sequences[key][index];
}

export function getExpectedAsyncSequence(seed: string, namespace?: string): number[] {
    const key: string = buildKey(seed, namespace);
    return asyncSequences[key];
}

function buildScenarios(seeds: string[], namespaces: string[], versions: number[], isAsync: boolean = false): SingleInputScenario[] {
    const scenarios: SingleInputScenario[] = [];
    let getExpected: (seed: string, namespace?: string, version?: number) => number[] = getExpectedSequence;

    if (isAsync) {
        getExpected = getExpectedAsyncSequence;
    }

    seeds.forEach((seed: string) => {
        scenarios.push({
            label: `build("${seed}")`,
            input: { seed },
            expected: getExpected(seed)
        });

        namespaces.forEach((namespace: string) => {
            scenarios.push({
                label: `build("${seed}", "${namespace}")`,
                input: { seed, namespace },
                expected: getExpected(seed, namespace)
            });

            if (!isAsync) {
                versions.forEach((version: number) => {
                    scenarios.push({
                        label: `build("${seed}", "${namespace}", ${version})`,
                        input: { seed, namespace, version },
                        expected: getExpected(seed, namespace, version)
                    });
                });
            }
        });

        if (!isAsync) {
            versions.forEach((version: number) => {
                scenarios.push({
                    label: `build("${seed}", undefined, ${version})`,
                    input: { seed, version },
                    expected: getExpected(seed, undefined, version)
                });
            });
        }
    });

    return scenarios;
}

export const scenarios: SingleInputScenario[] = [
    ...buildScenarios(
        [emptySeed, asciiSeed, unicodeSeed],
        [emptyNamespace, asciiNamespace, unicodeNamespace],
        [0, 1]
    )
];

export const asyncScenarios: SingleInputScenario[] = [
    ...buildScenarios(
        [emptySeed, asciiSeed, unicodeSeed],
        [emptyNamespace, asciiNamespace, unicodeNamespace],
        [],
        true
    )
];
