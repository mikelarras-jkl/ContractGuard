import fs from "node:fs";
import path from "node:path";

export type Diagnostic = {
  rule:
    | "required-on-array"
    | "items-as-array"
    | "properties-items-in-array"
    | "orphan-property-keys"
    | "required-not-in-properties";
  path: string;
};

const SCHEMA_KEYWORDS = new Set([
  "$schema",
  "$id",
  "$ref",
  "$defs",
  "definitions",
  "title",
  "description",
  "type",
  "properties",
  "required",
  "items",
  "additionalProperties",
  "enum",
  "const",
  "default",
]);

export function auditPath(target: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  for (const pairDir of discoverPairs(target)) {
    const schema = JSON.parse(
      fs.readFileSync(path.join(pairDir, "schema.json"), "utf8"),
    ) as unknown;
    diagnostics.push(...auditSchema(schema));
  }
  return diagnostics;
}

function discoverPairs(root: string): string[] {
  const found: string[] = [];

  function visit(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const names = new Set(entries.map((entry) => entry.name));
    if (names.has("schema.json") && names.has("example.json")) {
      found.push(dir);
    }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        visit(path.join(dir, entry.name));
      }
    }
  }

  visit(root);
  return found;
}

function isSchemaLike(value: unknown): boolean {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function propertiesHasItems(properties: unknown): boolean {
  return (
    properties !== null &&
    typeof properties === "object" &&
    !Array.isArray(properties) &&
    "items" in properties
  );
}

function auditSchema(node: unknown, pointer = ""): Diagnostic[] {
  if (node === null || typeof node !== "object" || Array.isArray(node)) {
    return [];
  }

  const schema = node as Record<string, unknown>;
  const diagnostics: Diagnostic[] = [];
  const here = pointer === "" ? "/" : pointer;
  const properties = schema.properties;

  if (schema.type === "array" && Array.isArray(schema.required)) {
    diagnostics.push({
      rule: "required-on-array",
      path: here,
    });
  }

  if (Array.isArray(schema.items)) {
    diagnostics.push({
      rule: "items-as-array",
      path: here,
    });
  }

  if (
    schema.type === "array" &&
    propertiesHasItems(schema.properties)
  ) {
    diagnostics.push({
      rule: "properties-items-in-array",
      path: here,
    });
  }

  for (const key of Object.keys(schema)) {
    if (!SCHEMA_KEYWORDS.has(key) && isSchemaLike(schema[key])) {
      diagnostics.push({
        rule: "orphan-property-keys",
        path: `${pointer}/${key}`,
      });
    }
  }

  if (Array.isArray(schema.required)) {
    const declared =
      properties !== null && typeof properties === "object" && !Array.isArray(properties)
        ? new Set(Object.keys(properties as Record<string, unknown>))
        : new Set<string>();
    for (const name of schema.required) {
      if (typeof name === "string" && !declared.has(name)) {
        diagnostics.push({
          rule: "required-not-in-properties",
          path: `${pointer}/${name}`,
        });
      }
    }
  }

  if (properties !== null && typeof properties === "object" && !Array.isArray(properties)) {
    for (const [name, child] of Object.entries(properties as Record<string, unknown>)) {
      diagnostics.push(...auditSchema(child, `${pointer}/${name}`));
    }
  }

  return diagnostics;
}
