import { newE2EPage } from "@stencil/core/testing";

describe("QueryViewerContainer", () => {
  const title = "Mock title";
  const metadata = "metadataMock";

  it("should create a header withe the specific title", async () => {
    const page = await newE2EPage();
    await page.setContent(
      `<gx-query-viewer-container main-title="${title}"></gx-query-viewer-container>`
    );

    const header = await page.find("gx-query-viewer-container >>> header");
    expect(header.innerHTML).toContain(title);
  });

  it("should call update query when save button is pushed", async () => {
    const title = "Mock title";

    const page = await newE2EPage();
    const mockCallBack = jest.fn();

    await page.setContent(
      `<gx-query-viewer-container main-title="${title}" metadata-name="${metadata}"></gx-query-viewer-container>`
    );
    await page.exposeFunction("asyncUpdateQuery", mockCallBack);
    const buttons = await page.findAll(
      "gx-query-viewer-container >>> gx-button"
    );

    expect(buttons.length).toBe(2);

    await buttons[1].click();
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });
});
