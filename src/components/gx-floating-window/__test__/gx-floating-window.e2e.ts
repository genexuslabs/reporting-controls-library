import { newE2EPage } from '@stencil/core/testing';

describe('gx-floating-window', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<gx-floating-window></gx-floating-window>');

    const element = await page.find('gx-floating-window');
    expect(element).toHaveClass('hydrated');
  });
});
