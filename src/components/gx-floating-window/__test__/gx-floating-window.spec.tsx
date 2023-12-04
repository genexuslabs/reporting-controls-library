import { newSpecPage } from '@stencil/core/testing';
import { GxFloatingWindow } from '../gx-floating-window';

describe('gx-floating-window', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [GxFloatingWindow],
      html: `<gx-floating-window></gx-floating-window>`,
    });
    expect(page.root).toEqualHtml(`
      <gx-floating-window>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </gx-floating-window>
    `);
  });
});
