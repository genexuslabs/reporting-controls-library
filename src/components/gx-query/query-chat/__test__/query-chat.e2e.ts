import { newE2EPage } from '@stencil/core/testing';

describe('gx-query-chat', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<gx-query-chat></gx-query-chat>');

    const element = await page.find('gx-query-chat');
    expect(element).toHaveClass('hydrated');
  });
});
