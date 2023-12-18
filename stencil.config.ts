import { Config } from "@stencil/core";
import { reactOutputTarget } from "@stencil/react-output-target";
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
      type: "dist-custom-elements",
      copy: [
        {
          src: "**/*.{svg}",
          dest: "dist/components/assets",
          warn: true
        }
      ]
    },
    {
      type: "docs-readme"
    },
    {
      type: "www",
      serviceWorker: null // disable service workers
    },
    reactOutputTarget({
      componentCorePackage: "@genexus/reporting-controls-library",
      proxiesFile:
        "../reporting-controls-react/lib/components/stencil-generated/index.ts",
      excludeComponents: [
        "gx-action-sheet-item",
        "gx-action-sheet",
        "gx-audio",
        "gx-button",
        "gx-canvas-cell",
        "gx-canvas",
        "gx-card-header",
        "gx-card",
        "gx-checkbox",
        "gx-chronometer",
        "gx-dynamic-form",
        "gx-edit",
        "gx-form-field",
        "gx-gauge-range",
        "gx-gauge",
        "gx-grid-empty-indicator",
        "gx-grid-flex",
        "gx-grid-fs",
        "gx-grid-horizontal",
        "gx-grid-image-map-item",
        "gx-grid-image-map",
        "gx-grid-infinite-scroll",
        "gx-grid-smart-cell",
        "gx-grid-smart-css",
        "gx-group",
        "gx-header-row-pattern-marker",
        "gx-icon",
        "gx-image-annotations",
        "gx-image-picker",
        "gx-image",
        "gx-interactive-image",
        "gx-layout",
        "gx-loading",
        "gx-lottie",
        "gx-map-circle",
        "gx-map-line",
        "gx-map-marker",
        "gx-map-polygon",
        "gx-map",
        "gx-message",
        "gx-modal",
        "gx-navbar-item",
        "gx-navbar",
        "gx-password-edit",
        "gx-progress-bar",
        "gx-radio-group",
        "gx-radio-option",
        "gx-rating",
        "gx-select-option",
        "gx-select",
        "gx-switch",
        "gx-tab-caption",
        "gx-tab-page",
        "gx-tab",
        "gx-table-cell",
        "gx-table",
        "gx-textblock",
        "gx-video"
      ]
    })
  ],
  bundles: [
    { components: ["gx-query-viewer", "gx-query-viewer-controller"] },

    // The card and its controller must be in the same bundle; otherwise
    // Stencil would make a bundle with the card and the chart, resulting in a
    // larger bundle size when only the card is used
    { components: ["gx-query-viewer-card", "gx-query-viewer-card-controller"] },

    { components: ["gx-query-viewer-pivot", "gx-query-viewer-pivot-render"] }
  ],
  plugins: [sass(), dotenvPlugin()]
};
