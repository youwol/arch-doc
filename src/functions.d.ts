/**
 * Get the remaining months for the arch library before to be obsolete and useless.
 * We make the library obsolete after few months in order to force the user to use a
 * more recent version. Therefore, sometime it can be necessary to purge the cache of
 * the web-browser, or replace the node.js arch-library by a new one.
 * @returns The number of valid months
 */
export function license(): number
