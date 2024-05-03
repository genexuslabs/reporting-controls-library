import { valueOrPercentage } from "./card-utils";
import { GxBigNumber } from "@genexus/web-standard-functions/dist/lib/types/gxbignumber";
import { QueryViewerShowDataAs } from "@genexus/reporting-api";
import { QueryViewerServiceMetaDataData } from "@genexus/reporting-api";

describe("valueOrPercentage", () => {
  it("should return the value as a string when showDataAs is Values", () => {
    const showDataAs = "Values" as QueryViewerShowDataAs;
    const value = new GxBigNumber(10);
    const datum = {
      targetValue: 100
    } as QueryViewerServiceMetaDataData;

    const result = valueOrPercentage(showDataAs, value, datum);

    expect(result).toBe("10");
  });

  it("should return the percentage as a string when showDataAs is Percentages", () => {
    const showDataAs = "Percentages" as QueryViewerShowDataAs;
    const value = new GxBigNumber(10);
    const datum = {
      targetValue: 100
    } as QueryViewerServiceMetaDataData;

    const result = valueOrPercentage(showDataAs, value, datum);

    expect(result).toBe("10%");
  });

  it("should return the value and percentage as a string when showDataAs is ValuesAndPercentages", () => {
    const showDataAs = "ValuesAndPercentages" as QueryViewerShowDataAs;
    const value = new GxBigNumber(10);
    const datum = {
      targetValue: 100
    } as QueryViewerServiceMetaDataData;

    const result = valueOrPercentage(showDataAs, value, datum);

    expect(result).toBe("10 (10%)");
  });
});
