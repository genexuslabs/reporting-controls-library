import { newSpecPage } from '@stencil/core/testing';
import { GxFloatingWindow } from '../gx-floating-window';

describe('gx-floating-window', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [GxFloatingWindow],
      html: `<gx-floating-window></gx-floating-window>`,
    });
    expect(page.root).toEqualHtml(`
      <gx-floating-window aria-label="GxQuery Chat" role="application" style="--gx-sidebar-with: 300px;">
        <mock:shadow-root>
          <header class="header" part="header" role="banner">
            <h1 class="header__title" part="title"></h1>
            <div aria-hidden="true" class="header__controls" part="controls">
              <gx-button accessible-name="unlocked" css-class="controls-btn" image-position="below" main-image-src="/assets/undock.svg" role="button" tabindex="0"></gx-button>
              <gx-button accessible-name="minimize" css-class="controls-btn" image-position="below" main-image-src="/assets/minimize.svg" role="button" tabindex="0"></gx-button>
            </div>
          </header>
          <main class="main-wrapper" part="container">
            <slot></slot>
          </main>
        </mock:shadow-root>
      </gx-floating-window>
    `);
  });
});
