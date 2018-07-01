import {
  formatExtensions,
  frontmatterFormats,
  extensionFormatters,
} from "Formats/formats";
import { IDENTIFIER_FIELDS } from "Constants/fieldInference";

/**
 * The schema had to be wrapped in a function to
 * fix a circular dependency problem for WebPack.
 * The imports had to be resolved asyncronously.
 */
export const getConfigSchema = () => ({
  type: "object",
  properties: {
    backend: {
      type: "object",
      properties: { name: { type: "string", examples: ["test-repo"] } },
      required: ["name"],
    },
    display_url: { type: "string", examples: ["https://example.com"] },
    media_folder: { type: "string", examples: ["assets/uploads"] },
    publish_mode: {
      type: "string",
      enum: ["editorial_workflow"],
      examples: ["editorial_workflow"],
    },
    slug: {
      type: "object",
      properties: {
        encoding: { type: "string", enum: ["unicode", "ascii"] },
        clean_accents: { type: "boolean" },
      },
    },
    collections: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        properties: {
          format: { type: "string", enum: Object.keys(formatExtensions) },
          extension: { type: "string" },
          frontmatter_delimiter: { type: "string" },
          properties: {
            fields: {
              type: "array",
              contains: {
                type: "object",
                properties: {
                  name: { type: "string" },
                },
                required: ["name", "label", "widget"],
              },
            },
          },
        },
        if: { required: ["extension"] },
        then: {
          // Cannot infer format from extension.
          if: {
            properties: {
              extension: { enum: Object.keys(extensionFormatters) },
            },
          },
          else: { required: ["format"] },
        },
        oneOf: [{ required: ["files"] }, { required: ["folder"] }],
        dependencies: {
          frontmatter_delimiter: {
            properties: {
              format: { enum: frontmatterFormats },
            },
            required: ["format"],
          },
          folder: {
            properties: {
              fields: {
                contains: {
                  properties: {
                    name: { enum: IDENTIFIER_FIELDS },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  required: ["backend", "media_folder", "collections"],
});
