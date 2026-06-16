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
        [0.6126510770991445, 0.3232760636601597, 0.5053844235371798, 0.5004723358433694, 0.8444383488968015],
        [0.49630083329975605, 0.26718430570326746, 0.5911665598396212, 0.9048203160054982, 0.24119087704457343]
    ],
    'test-seed-00': [
        [0.634432977065444, 0.8579290516208857, 0.8093228186480701, 0.06116068898700178, 0.4406876463908702],
        [0.9131155568175018, 0.8299572116229683, 0.8383598797954619, 0.09797090291976929, 0.7856007595546544]
    ],
    'test-seed-01': [
        [0.13497344846837223, 0.8579290620982647, 0.06300078285858035, 0.06043651350773871, 0.4764115291181952],
        [0.41257508541457355, 0.8296138364821672, 0.7415374778211117, 0.5689590640831739, 0.29441579757258296]
    ],
    '⭐': [
        [0.9694232840556651, 0.9242921115364879, 0.8754217408131808, 0.5243206792511046, 0.45104918046854436],
        [0.7025466905906796, 0.5448313450906426, 0.6962815392762423, 0.12431758479215205, 0.5638441045302898]
    ],
    '\x00': [
        [0.39831331721507013, 0.4331224621273577, 0.6937443742062896, 0.19698031223379076, 0.8398848185315728],
        [0.00922908284701407, 0.3375692891422659, 0.3045982476323843, 0.6381423401180655, 0.7763565834611654]
    ],
    '\x00test-seed-00': [
        [0.9857979689259082, 0.24636835046112537, 0.5494615291245282, 0.5093912568408996, 0.7697517338674515],
        [0.32814985048025846, 0.22640329715795815, 0.7572518708184361, 0.619672927306965, 0.4001562672201544]
    ],
    '\x00\u{2B50}': [
        [0.37069141771644354, 0.7518799216486514, 0.5597348269075155, 0.24565381254069507, 0.3822676679119468],
        [0.5586106355767697, 0.7711917855776846, 0.13673554244451225, 0.4313397004734725, 0.4484977489337325]
    ],
    'test-namespace-00\x00': [
        [0.429135010112077, 0.9545914956834167, 0.29680075077340007, 0.8279441504273564, 0.574660626007244],
        [0.9561880675610155, 0.029570659156888723, 0.866864052368328, 0.8682383687701076, 0.2566059669479728]
    ],
    'test-namespace-00\x00test-seed-00': [
        [0.36890324554406106, 0.7137624127790332, 0.36981175979599357, 0.35915147769264877, 0.6547805801965296],
        [0.16553925978951156, 0.3284351306501776, 0.5189291620627046, 0.4091069942805916, 0.28637753427028656]
    ],
    'test-namespace-00\x00test-seed-01': [
        [0.8683627741411328, 0.7439748151227832, 0.16317949281074107, 0.568283086642623, 0.9389660542365164],
        [0.6660797311924398, 0.3273193002678454, 0.8574078464880586, 0.17541947425343096, 0.7369510729331523]
    ],
    'test-namespace-00\x00\u{2B50}': [
        [0.1261833724565804, 0.7054455352481455, 0.4621034248266369, 0.0775483485776931, 0.5545738856308162],
        [0.6907067145220935, 0.7749281642027199, 0.6223566802218556, 0.09803495625965297, 0.9999574376270175]
    ],
    'test-namespace-01\x00test-seed-00': [
        [0.3755729671102017, 0.7366348921786994, 0.5166533759329468, 0.46790983714163303, 0.0813936865888536],
        [0.5370737644843757, 0.010037466185167432, 0.7695884795393795, 0.48961918940767646, 0.13595098350197077]
    ],
    '\u{2B50}\x00': [
        [0.6774915291462094, 0.42525860690511763, 0.48324807826429605, 0.9759493807796389, 0.1881356928497553],
        [0.6262183571234345, 0.6668216432444751, 0.17892914125695825, 0.9449690030887723, 0.6770415755454451]
    ],
    '\u{2B50}\x00test-seed-00': [
        [0.4105529813095927, 0.14086026255972683, 0.5024991780519485, 0.9953345011454076, 0.1419054747093469],
        [0.6641748060937971, 0.600806294940412, 0.6795372383203357, 0.28646355867385864, 0.4634526001755148]
    ],
    '\u{2B50}\x00\u{2B50}': [
        [0.8694517486728728, 0.267334503820166, 0.5202956276480108, 0.7923379603307694, 0.156677037011832],
        [0.4572813929989934, 0.6103907972574234, 0.8155440571717918, 0.743932654382661, 0.09259677515365183]
    ]
};

/**
 * Async sequences are keyed by their namespace and seed input.
 *
 * @remarks Once a test seed and namespace sequence has been determined, any deviation from that expected behavior is indicative of a breaking change and should be investigated immediately.
 */
const asyncSequences: Record<string, number[]> = {
    '': [0.10194779536686838, 0.8687931925524026, 0.6169332698918879, 0.04443511459976435, 0.6241352290380746],
    'test-seed-00': [0.9076406969688833, 0.6098317999858409, 0.9328209655359387, 0.5094148449134082, 0.2175430792849511],
    'test-seed-01': [0.3070254453923553, 0.7158542282413691, 0.32328090630471706, 0.7637609918601811, 0.6076300465501845],
    '⭐': [0.8377553941681981, 0.6493078039493412, 0.7882305386010557, 0.8368003044743091, 0.5761441388167441],
    '\x00': [0.6245411166455597, 0.7754172058776021, 0.5487484480254352, 0.7929416585247964, 0.2837489349767566],
    '\x00test-seed-00': [0.7357294938992709, 0.44334239908494055, 0.9587394662667066, 0.4657019639853388, 0.15596137894317508],
    '\x00\u{2B50}': [0.3601902867667377, 0.5524721273686737, 0.5090957335196435, 0.5732383935246617, 0.8367531762924045],
    'test-namespace-00\x00': [0.2743232031352818, 0.8386674583889544, 0.8201178782619536, 0.5006979953031987, 0.676017084158957],
    'test-namespace-00\x00test-seed-00': [0.3368256282992661, 0.306678319349885, 0.3597193385940045, 0.17725183605216444, 0.05706538958474994],
    'test-namespace-00\x00test-seed-01': [0.19497346016578376, 0.8657614930998534, 0.8378473380580544, 0.25677067530341446, 0.15881527075544],
    'test-namespace-00\x00\u{2B50}': [0.9165182146243751, 0.345295230159536, 0.9465904582757503, 0.23891182569786906, 0.33318979456089437],
    'test-namespace-01\x00test-seed-00': [0.4541384584736079, 0.9451300515793264, 0.40614309906959534, 0.8936089973431081, 0.7948203277774155],
    '\u{2B50}\x00': [0.2128569260239601, 0.2632070886902511, 0.0334383191075176, 0.4704423751682043, 0.7389969332143664],
    '\u{2B50}\x00test-seed-00': [0.723055761307478, 0.7636905149556696, 0.3315331041812897, 0.3865609485656023, 0.48024735739454627],
    '\u{2B50}\x00\u{2B50}': [0.5487537963781506, 0.07445831736549735, 0.5099981590174139, 0.15358263882808387, 0.9415363778825849]
};

function buildKey(seed: string, namespace?: string): string {
    if (StringUtility.isString(namespace)) {
        return `${namespace}\x00${seed}`;
    } else {
        return seed;
    }
}

function getExpectedSequence(seed: string, namespace?: string, version?: number): number[] {
    const key: string = buildKey(seed, namespace);
    const index: number = version ?? 0;
    return sequences[key][index];
}

function getExpectedAsyncSequence(seed: string, namespace?: string): number[] {
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
        [0, 1],
        true
    )
];
