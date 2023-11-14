import { Config } from "@stencil/core";
import { sass } from "@stencil/sass";
import dotenvPlugin from "rollup-plugin-dotenv";

export const config: Config = {
  namespace: "reporting",
  globalStyle: "src/global/common.scss",
  outputTargets: [
    {
      type: "dist",
      esmLoaderPath: "../loader"
    },
    {
      type: "dist-custom-elements"
    },
    {
      type: "docs-readme"
    },
    {
      type: "www",
      serviceWorker: null // disable service workers
    }
  ],
  bundles: [
    { components: ["gx-query-viewer", "gx-query-viewer-controller"] },

    // The card and its controller must be in the same bundle; otherwise
    // Stencil would make a bundle with the card and the chart, resulting in a
    // larger bundle size when only the card is used
    { components: ["gx-query-viewer-card", "gx-query-viewer-card-controller"] }
  ],
  plugins: [sass(), dotenvPlugin()]
};
