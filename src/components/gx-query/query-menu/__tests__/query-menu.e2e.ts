import { E2EPage, newE2EPage } from "@stencil/core/testing";
import { GxQueryItem, GxQueryOptions } from "../../../../common/basic-types";
import * as servicesManager from "../../../../services/services-manager";

describe("QueryMenu", () => {
  let page: E2EPage;

  const mockData = [
    {
      Description: "Yesterday",
      Expression: "Query EuropaCases []",
      Id: "b88-2t2",
      Modified: new Date("2023-08-14T03:00:00.000Z"),
      Name: "EuropaCases",
      differenceInDays: 1
    },
    {
      Description: "Today",
      Expression: "Query AmericanTotalCases []",
      Id: "a66-9e2",
      Modified: new Date("2023-08-15T03:00:00.000Z"),
      Name: "AmericanTotalCases",
      differenceInDays: 0
    },
    {
      Description: "July 2021",
      Expression: "Query WorldTotalCases []",
      Id: "14c-6fe",
      Modified: new Date("2021-07-22T03:00:00.000Z"),
      Name: "WorldTotalCases",
      differenceInDays: 767
    }
  ] as GxQueryItem[];
  const RealDate = Date.now;
  const listQuerySpy = jest.spyOn(servicesManager, "asyncGetListQuery");
  // beforeAll(() => {
  //   jest.spyOn(console, "log").mockImplementation(jest.fn());
  //   jest.spyOn(console, "error").mockImplementation(jest.fn());
  //   jest.spyOn(console, "warn").mockImplementation(jest.fn());
  //   jest.spyOn(console, "info").mockImplementation(jest.fn());
  //   jest.spyOn(console, "debug").mockImplementation(jest.fn());
  // });

  beforeAll(() => {
    global.Date.now = jest.fn(() => new Date("2023-08-15T14:09:49").getTime());
    const options = {} as GxQueryOptions;
    // @ts-ignore
    listQuerySpy.mockImplementation(options, callback => {
      callback(mockData);
    });
  });

  afterAll(() => {
    global.Date.now = RealDate;
    listQuerySpy.mockRestore();
  });

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(
      `<gx-query-menu><h3 slot="header">Custom title</h3></gx-query-menu>`
    );
  });

  it("should include the title", async () => {
    const header = await page.find("gx-query-menu h3");

    expect(header).toEqualText("Custom title");
  });
});
