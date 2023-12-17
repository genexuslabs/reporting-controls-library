import { calculateDateDifference } from "../date";

describe("calculates the difference in days between two dates", () => {
  it("should return 8", () => {
    const startDate = "2023-08-15";
    const endDate = "2023-08-23";
    const expected = 8;

    const actualDifference = calculateDateDifference(startDate, endDate);
    expect(actualDifference).toBe(expected);
  });

  it("should returns 295", () => {
    const startDate = "2022-11-01";
    const endDate = "2023-08-23";
    const expected = 295;

    const actualDifference = calculateDateDifference(startDate, endDate);
    expect(actualDifference).toBe(expected);
  });

  it("should returns 964", () => {
    const startDate = "2023-08-23";
    const endDate = "2021-1-1";
    const expected = 964;

    const actualDifference = calculateDateDifference(startDate, endDate);
    expect(actualDifference).toBe(expected);
  });

  it("should returns 0", () => {
    const startDate = "2023-08-23";
    const endDate = "2023-08-23";
    const expected = 0;

    const actualDifference = calculateDateDifference(startDate, endDate);
    expect(actualDifference).toBe(expected);
  });

  it("should returns 964", () => {
    const startDate = "2023-08-23T18:34:26.951Z";
    const endDate = "2021-01-01T20:25:15.951Z";
    const expected = 964;

    const actualDifference = calculateDateDifference(startDate, endDate);
    expect(actualDifference).toBe(expected);
  });
});
