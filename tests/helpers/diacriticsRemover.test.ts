import assert from "node:assert/strict";
import test from "node:test";

import {removeDiacritics} from "../../helpers/diacriticsRemover";

test("removes accents so that a search without them still matches", () => {
    assert.equal(removeDiacritics("éèêëàçôÉ"), "eeeeacoE");
    assert.equal(removeDiacritics("Côte d’Ivoire"), "Cote d’Ivoire");
});

test("leaves a text without diacritics unchanged", () => {
    assert.equal(removeDiacritics("France"), "France");
});
