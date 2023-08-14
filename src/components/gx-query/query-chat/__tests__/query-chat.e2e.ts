import { newE2EPage } from "@stencil/core/testing";

describe("query chat", () => {
  it("renders and responds to the size property", async () => {
    const page = await newE2EPage();

    // In order to test against any global styles you may have, don't forget to set the link to the global css. You don't have to do this if your stencil.config.ts file doesn't build a global css file with globalStyle.
    await page.setContent(`<gx-query-chat main-title="title"></gx-query-chat>`);

    const element = await page.find("gx-query-chat");
    expect(element).toHaveClass("hydrated");
  });
});
