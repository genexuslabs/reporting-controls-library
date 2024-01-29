// query-menu.e2e.ts

import { E2EPage, newE2EPage } from "@stencil/core/testing";
import * as servicesManager from "@services";
import { GxQueryItem, GxQueryOptions } from "@common/basic-types";

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
