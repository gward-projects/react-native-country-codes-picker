import assert from "node:assert/strict";
import test from "node:test";

import type {CountryItem} from "../../types/Types";
import {countryName} from "../../helpers/countryName";

const france: CountryItem = {
    name: {en: "France", fr: "France", ru: "", de: "Frankreich"},
    dial_code: "+33",
    code: "FR",
    flag: "🇫🇷",
};

test("returns the name in the requested language", () => {
    assert.equal(countryName(france, "de"), "Frankreich");
});

test("falls back to English when the language is unknown", () => {
    assert.equal(countryName(france, "xx"), "France");
});

test("falls back to English when the translation is empty", () => {
    assert.equal(countryName(france, "ru"), "France");
});
