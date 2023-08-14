import { SpecPage, newSpecPage } from "@stencil/core/testing";
import { QueryChat } from "../query-chat";

describe("query chat", () => {
  const value = "Hello World";
  let page: SpecPage;

  beforeEach(async () => {
    page = await newSpecPage({
      components: [QueryChat],
      html: `<gx-query-chat main-title="${value}"></gx-query-chat>`
    });
  });

  it("builds", () => {
    expect(new QueryChat()).toBeTruthy();
  });

  it("should render the title", async () => {
    // Act
    const chatTitle = page.body
      .querySelector("gx-query-chat")
      .shadowRoot.querySelector<HTMLDivElement>("[part=query-chat__title]");

    // Assert
    expect(chatTitle).toEqualHtml(`
      <h1 part="query-chat__title">${value}</h1>
    `);
  });

  it("should render controls", async () => {
    // Act
    const chatTitle = page.body
      .querySelector("gx-query-chat")
      .shadowRoot.querySelector<HTMLDivElement>("[part=query-chat__controls]");

    // Assert
    expect(chatTitle).toEqualHtml(`
      <div part="query-chat__controls">
        <gx-button accessible-name="unlocked" height="20px" image-position="below" main-image-src="./assets/undock.svg" role="button" tabindex="0" width="20px"></gx-button>
        <gx-button accessible-name="minimize" height="20px" image-position="below" main-image-src="./assets/minimize.svg" role="button"
        tabindex="0" width="20px"></gx-button>
      </div>
    `);
  });
});
