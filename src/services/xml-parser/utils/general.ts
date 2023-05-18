const METADATA_VERSION = 2;

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const trimUtil = (str: any) =>
  typeof str === "string"
    ? str
        .replace(/^[\s]+/, "")
        .replace(/[\s]+$/, "")
        .replace(/[\s]{2,}/, " ")
    : null;

/**
 * It is controlled that it is different from null by executing queries through
 * the GXquery API, which do not return a version because they are older
 * services.
 */
export const ServicesVersionOK = (version: any) =>
  version == null || parseInt(version) === METADATA_VERSION;
