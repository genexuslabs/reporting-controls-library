// query-menu.e2e.ts

import { E2EPage, newE2EPage } from "@stencil/core/testing";
import * as servicesManager from "@genexus/reporting-api";
import { GxQueryItem, GxQueryOptions } from "@genexus/reporting-api";

describe("QueryMenu", () => {
  let page: E2EPage;

  const mockData = [
    {
      description: "Yesterday",
      expression: "Query EuropaCases []",
      id: "b88-2t2",
      modified: new Date("2023-08-14T03:00:00.000Z"),
      name: "EuropaCases",
      differenceInDays: 1
    },
    {
      description: "Today",
      Expression: "Query AmericanTotalCases []",
      Id: "a66-9e2",
      Modified: new Date("2023-08-15T03:00:00.000Z"),
      Name: "AmericanTotalCases",
      differenceInDays: 0
    },
    {
      description: "July 2021",
      Expression: "Query WorldTotalCases []",
      Id: "14c-6fe",
      Modified: new Date("2021-07-22T03:00:00.000Z"),
      Name: "WorldTotalCases",
      differenceInDays: 767
    }
  ] as GxQueryItem[];
  const RealDate = Date.now;
  const listQuerySpy = jest.spyOn(servicesManager, "asyncGetListQuery");

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
