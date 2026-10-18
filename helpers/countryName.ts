import {CountryItem} from "../types/Types";

/**
 * Name of the country in the requested language, or in English when that
 * translation is missing or empty.
 */
export const countryName = (country: CountryItem, lang: string): string => {
    const name = country.name[lang];
    return name?.length ? name : country.name.en;
};
