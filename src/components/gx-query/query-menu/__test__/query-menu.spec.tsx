// query-menu.spec.tsx

import { newSpecPage } from "@stencil/core/testing";
import * as servicesManager from "@genexus/reporting-api/dist";
import { QueryMenu } from "../query-menu";
import { GxQueryItem, GxQueryOptions } from "@genexus/reporting-api/dist/types/basic-types";

describe("QueryMenu", () => {
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
      expression: "Query AmericanTotalCases []",
      id: "a66-9e2",
      modified: new Date("2023-08-15T03:00:00.000Z"),
      name: "AmericanTotalCases",
      differenceInDays: 0
    },
    {
      description: "July 2021",
      expression: "Query WorldTotalCases []",
      id: "14c-6fe",
      modified: new Date("2021-07-22T03:00:00.000Z"),
      name: "WorldTotalCases",
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

  it("should call listQuery", async () => {
    const page = await newSpecPage({
      components: [QueryMenu],
      html: `<gx-query-menu></gx-query-menu>`
    });

    const component = page.rootInstance as QueryMenu;

    component.connectedCallback();

    expect(listQuerySpy).toHaveBeenCalled();
  });

  it.skip("should group the items correctly", async () => {
    const page = await newSpecPage({
      components: [QueryMenu],
      html: `<gx-query-menu></gx-query-menu>`
    });

    await page.waitForChanges();

    expect(page.rootInstance._filteredItems).toEqual(
      jasmine.arrayContaining([
        { items: [mockData[1]], label: "Today" },
        { items: [mockData[0]], label: "Yesterday" },
        { items: [mockData[2]], label: "2021 July" }
      ])
    );
  });

  it("should render three gx-query-menu-item components", async () => {
    const page = await newSpecPage({
      components: [QueryMenu],
      html: `<gx-query-menu><h3 slot="header">Title</h3></gx-query-menu>`
    });

    const items = page.body
      .querySelector("gx-query-menu")
      .shadowRoot.querySelector("[part=query-menu__sidebar]")
      .querySelectorAll("gx-query-menu-item");

    expect(items.length).toBe(3);
  });
});
