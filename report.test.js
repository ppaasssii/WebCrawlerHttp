const { sortPages } = require('./report.js');
const { test, expect } = require('@jest/globals');

/**
 * Test case for the sortPages function with 2 pages.
 */
test('sortPages 2 pages', () => {
    const input = {
        'https://wagslane.dev/path': 1,
        'https://wagslane.dev/': 3
    };
    const actual = sortPages(input);
    const expected = [
        ['https://wagslane.dev/', 3],
        ['https://wagslane.dev/path', 1]
    ];
    expect(actual).toEqual(expected);
});

/**
 * Test case for the sortPages function with 6 pages.
 */
test('sortPages 6 pages', () => {
    const input = {
        'https://wagslane.dev/path': 7,
        'https://wagslane.dev/': 3,
        'https://wagslane.dev/path/17': 4,
        'https://wagslane.dev/path/2': 6,
        'https://wagslane.dev/path/3': 5,
        'https://wagslane.dev/path/4': 1
    };
    const actual = sortPages(input);
    const expected = [
        ['https://wagslane.dev/path', 7],
        ['https://wagslane.dev/path/2', 6],
        ['https://wagslane.dev/path/3', 5],
        ['https://wagslane.dev/path/17', 4],
        ['https://wagslane.dev/', 3],
        ['https://wagslane.dev/path/4', 1]
    ];
    expect(actual).toEqual(expected);
});