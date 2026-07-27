"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { ptBRLocale } from "@sanity/locale-pt-br";
import { apiVersion, dataset, projectId } from "./services/sanity/env";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "omnichat",
  title: "OmniChat Web",
  projectId: projectId || "placeholder",
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } },
    }),
    ptBRLocale(),
  ],
  schema: { types: schemaTypes },
  apiVersion,
});
