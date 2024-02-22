import { defineConfig } from "vite";
import { crx, defineManifest } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
const viteManifestHackIssue846: Plugin & {
  renderCrxManifest: (manifest: any, bundle: any) => void;
} = {
  // Workaround from https://github.com/crxjs/chrome-extension-tools/issues/846#issuecomment-1861880919.
  name: "manifestHackIssue846",
  renderCrxManifest(_manifest, bundle) {
    bundle["manifest.json"] = bundle[".vite/manifest.json"];
    bundle["manifest.json"].fileName = "manifest.json";
    delete bundle[".vite/manifest.json"];
  },
};

const manifest = defineManifest({
  manifest_version: 3,
  name: "Reading Saver",
  description:
    "This extension saves your reading progress on specific page and allows you to set patterns to save.",
  version: "1.0",
  permissions: ["tabs", "storage", "activeTab", "scripting"],
  action: {
    default_popup: "./src/popup/index.html",
    default_title: "Reading time",
  },
  content_scripts: [
    {
      matches: ["https://*/*"],
      js: ["src/main.ts"],
    },
  ],
  icons: {
    16: "icons/16.png",
    32: "icons/32.png",
    48: "icons/48.png",
    128: "icons/128.png",
  },
});

export default defineConfig({
  plugins: [react(), viteManifestHackIssue846, crx({ manifest })],
  server: {
    port: 5174,
    strictPort: true,
    hmr: {
      port: 5174,
    },
  },
});
