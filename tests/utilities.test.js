// Browser-based test suite for utilities
// This runs in the browser environment with ES6 modules

import { getRandomInt, getRandomElement, deepClone } from '../core/utilities.js';

export async function runUtilitiesTestSuite(addResult) {
    addResult('Starting Utilities Test Suite', true);

    // Test getRandomInt
    try {
        const result = getRandomInt(1, 10);
        const passed = result >= 1 && result <= 10 && Number.isInteger(result);
        addResult('getRandomInt(1, 10) returns valid integer', passed,
            passed ? `Got: ${result}` : `Expected 1-10, got: ${result}`);
    } catch (e) {
        addResult('getRandomInt(1, 10) throws error', false, e.message);
    }

    // Test getRandomElement
    try {
        const array = ['a', 'b', 'c'];
        const result = getRandomElement(array);
        const passed = array.includes(result);
        addResult('getRandomElement returns array element', passed,
            passed ? `Got: ${result}` : `Not in array: ${result}`);
    } catch (e) {
        addResult('getRandomElement throws error', false, e.message);
    }

    // Test getRandomElement with empty array
    try {
        const result = getRandomElement([]);
        const passed = result === null;
        addResult('getRandomElement([]) returns null', passed,
            passed ? 'Correctly returned null' : `Expected null, got: ${result}`);
    } catch (e) {
        addResult('getRandomElement([]) throws error', false, e.message);
    }

    // Test deepClone
    try {
        const original = { a: 1, b: { c: 2 } };
        const cloned = deepClone(original);
        cloned.b.c = 3;
        const passed = original.b.c === 2 && cloned.b.c === 3;
        addResult('deepClone creates independent copy', passed,
            passed ? 'Clone is independent' : 'Clone is not independent');
    } catch (e) {
        addResult('deepClone throws error', false, e.message);
    }

    addResult('Utilities Test Suite Complete', true);
}