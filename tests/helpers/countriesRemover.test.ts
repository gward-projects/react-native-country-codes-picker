import assert from "node:assert/strict";
import test from "node:test";

import {countriesRemover} from "../../helpers/countriesRemover";
import {countryCodes} from "../../constants/countryCodes";

test("keeps every country when nothing is excluded", () => {
    assert.equal(countriesRemover(undefined).length, countryCodes.length);
});

test("removes the excluded countries, whatever the case of their code", () => {
    const remaining = countriesRemover(["fr", "DE"]);

    assert.equal(remaining.length, countryCodes.length - 2);
    assert.equal(remaining.some((country) => country.code === "FR" || country.code === "DE"), false);
});

test("every country has an English name", () => {
    assert.equal(countryCodes.every((country) => country.name.en.length > 0), true);
});
