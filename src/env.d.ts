/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_APP_TITLE: string
  readonly STORYBOOK_QUERY_URL: string;
  readonly STORYBOOK_API_KEY: string;
  readonly STORYBOOK_SAIA_TOKEN: string;
  readonly STORYBOOK_SAIA_USER_ID: string;
  readonly STORYBOOK_METADATA_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
