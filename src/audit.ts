import fs from "node:fs";
import path from "node:path";
import { parse as parseJsonSourceMap } from "json-source-map";

export type Diagnostic = {
  rule:
    | "required-on-array"
    | "items-as-array"
    | "properties-items-in-array"
    | "orphan-property-keys"
    | "required-not-in-properties";
  path: string;
  file: string;
  line: number;
};

type Pointers = Record<
  string,
  {
    key?: { line: number };
    value?: { line: number };
  }
>;

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

const SCHEMA_SUFFIX = ".schema.json";
const EXAMPLE_SUFFIX = ".example.json";

export function auditPath(target: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  for (const schemaFile of discoverSchemaFiles(target)) {
    const raw = fs.readFileSync(schemaFile, "utf8");
    const mapped = parseJsonSourceMap(raw);
    const file = path.relative(process.cwd(), schemaFile) || schemaFile;
    diagnostics.push(...auditSchema(mapped.data, mapped.pointers, file));
  }
  return diagnostics;
}

function discoverSchemaFiles(root: string): string[] {
  const found: string[] = [];

  function visit(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const names = new Set(
      entries.filter((entry) => entry.isFile()).map((entry) => entry.name),
    );

    if (names.has("schema.json") && names.has("example.json")) {
      found.push(path.join(dir, "schema.json"));
    }

    for (const name of names) {
      if (!name.endsWith(SCHEMA_SUFFIX)) {
        continue;
      }
      const stem = name.slice(0, -SCHEMA_SUFFIX.length);
      if (stem === "") {
        continue;
      }
      if (names.has(`${stem}${EXAMPLE_SUFFIX}`)) {
        found.push(path.join(dir, name));
      }
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

function joinPointer(base: string, token: string): string {
  return `${base}/${token.replace(/~/g, "~0").replace(/\//g, "~1")}`;
}

function lineOf(pointers: Pointers, jsonPointer: string): number {
  const loc = pointers[jsonPointer];
  if (loc?.key !== undefined) {
    return loc.key.line + 1;
  }
  if (loc?.value !== undefined) {
    return loc.value.line + 1;
  }
  return 1;
}

function auditSchema(
  node: unknown,
  pointers: Pointers,
  file: string,
  displayPointer = "",
  jsonPointer = "",
): Diagnostic[] {
  if (node === null || typeof node !== "object" || Array.isArray(node)) {
    return [];
  }

  const schema = node as Record<string, unknown>;
  const diagnostics: Diagnostic[] = [];
  const here = displayPointer === "" ? "/" : displayPointer;
  const properties = schema.properties;

  const locating = (rule: Diagnostic["rule"], displayPath: string, locPointer: string): Diagnostic => ({
    rule,
    path: displayPath,
    file,
    line: lineOf(pointers, locPointer),
  });

  if (schema.type === "array" && Array.isArray(schema.required)) {
    diagnostics.push(
      locating("required-on-array", here, joinPointer(jsonPointer, "required")),
    );
  }

  if (Array.isArray(schema.items)) {
    diagnostics.push(
      locating("items-as-array", here, joinPointer(jsonPointer, "items")),
    );
  }

  if (schema.type === "array" && propertiesHasItems(schema.properties)) {
    diagnostics.push(
      locating("properties-items-in-array", here, joinPointer(jsonPointer, "properties")),
    );
  }

  for (const key of Object.keys(schema)) {
    if (!SCHEMA_KEYWORDS.has(key) && isSchemaLike(schema[key])) {
      diagnostics.push(
        locating("orphan-property-keys", `${displayPointer}/${key}`, joinPointer(jsonPointer, key)),
      );
    }
  }

  if (Array.isArray(schema.required)) {
    const declared =
      properties !== null && typeof properties === "object" && !Array.isArray(properties)
        ? new Set(Object.keys(properties as Record<string, unknown>))
        : new Set<string>();
    for (const name of schema.required) {
      if (typeof name === "string" && !declared.has(name)) {
        diagnostics.push(
          locating(
            "required-not-in-properties",
            `${displayPointer}/${name}`,
            joinPointer(jsonPointer, "required"),
          ),
        );
      }
    }
  }

  if (properties !== null && typeof properties === "object" && !Array.isArray(properties)) {
    for (const [name, child] of Object.entries(properties as Record<string, unknown>)) {
      diagnostics.push(
        ...auditSchema(
          child,
          pointers,
          file,
          `${displayPointer}/${name}`,
          joinPointer(joinPointer(jsonPointer, "properties"), name),
        ),
      );
    }
  }

  return diagnostics;
}
