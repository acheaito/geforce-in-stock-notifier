'use strict';

const quietPeriod = require('../quiet-period');

beforeEach(() => {
    quietPeriod.endQuietPeriod();
});

afterEach(() => {
    quietPeriod.endQuietPeriod();
});

test('enables quiet period', () => {
    quietPeriod.startQuietPeriod();
    expect(quietPeriod.isInQuietPeriod(1)).toBe(true);
});

test('disables quiet period', () => {
    quietPeriod.startQuietPeriod();
    quietPeriod.endQuietPeriod();
    expect(quietPeriod.isInQuietPeriod(1)).toBe(false);
});

test('out of quiet period', () => {
    quietPeriod.startQuietPeriod();
    expect(quietPeriod.isInQuietPeriod(0)).toBe(false);
});

test('gracefully handle reset when quiet period is not enabled', () => {
    quietPeriod.endQuietPeriod();
    quietPeriod.endQuietPeriod();
});

test('gracefully handle enabling when quiet period is already enabled', () => {
    quietPeriod.startQuietPeriod();
    quietPeriod.startQuietPeriod();
});