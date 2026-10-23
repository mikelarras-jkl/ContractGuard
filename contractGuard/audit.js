"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditPath = auditPath;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const json_source_map_1 = require("json-source-map");
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
function auditPath(target, pairingFile) {
    const diagnostics = [];
    const schemaFiles = uniquePaths([
        ...discoverSchemaFiles(target),
        ...(pairingFile === undefined ? [] : schemasFromPairingFile(pairingFile)),
    ]);
    for (const schemaFile of schemaFiles) {
        const raw = node_fs_1.default.readFileSync(schemaFile, "utf8");
        const mapped = (0, json_source_map_1.parse)(raw);
        const file = node_path_1.default.relative(process.cwd(), schemaFile) || schemaFile;
        diagnostics.push(...auditSchema(mapped.data, mapped.pointers, file));
    }
    return diagnostics;
}
function uniquePaths(files) {
    return [...new Set(files.map((file) => node_path_1.default.resolve(file)))];
}
function schemasFromPairingFile(pairingFile) {
    const manifestPath = node_path_1.default.resolve(pairingFile);
    if (!node_fs_1.default.existsSync(manifestPath)) {
        return [];
    }
    const parsed = JSON.parse(node_fs_1.default.readFileSync(manifestPath, "utf8"));
    if (!Array.isArray(parsed)) {
        return [];
    }
    const baseDir = node_path_1.default.dirname(manifestPath);
    const schemas = [];
    for (const entry of parsed) {
        if (!Array.isArray(entry) || entry.length < 2) {
            continue;
        }
        const exampleRel = entry[0];
        const schemaRel = entry[1];
        if (typeof exampleRel !== "string" || typeof schemaRel !== "string") {
            continue;
        }
        const exampleFile = node_path_1.default.resolve(baseDir, exampleRel);
        const schemaFile = node_path_1.default.resolve(baseDir, schemaRel);
        if (node_fs_1.default.existsSync(exampleFile) && node_fs_1.default.existsSync(schemaFile)) {
            schemas.push(schemaFile);
        }
    }
    return schemas;
}
function discoverSchemaFiles(root) {
    const found = [];
    function visit(dir) {
        const entries = node_fs_1.default.readdirSync(dir, { withFileTypes: true });
        const names = new Set(entries.filter((entry) => entry.isFile()).map((entry) => entry.name));
        if (names.has("schema.json") && names.has("example.json")) {
            found.push(node_path_1.default.join(dir, "schema.json"));
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
                found.push(node_path_1.default.join(dir, name));
            }
        }
        for (const entry of entries) {
            if (entry.isDirectory()) {
                visit(node_path_1.default.join(dir, entry.name));
            }
        }
    }
    visit(root);
    return found;
}
function isSchemaLike(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}
function propertiesHasItems(properties) {
    return (properties !== null &&
        typeof properties === "object" &&
        !Array.isArray(properties) &&
        "items" in properties);
}
function joinPointer(base, token) {
    return `${base}/${token.replace(/~/g, "~0").replace(/\//g, "~1")}`;
}
function lineOf(pointers, jsonPointer) {
    const loc = pointers[jsonPointer];
    if (loc?.key !== undefined) {
        return loc.key.line + 1;
    }
    if (loc?.value !== undefined) {
        return loc.value.line + 1;
    }
    return 1;
}
function auditSchema(node, pointers, file, displayPointer = "", jsonPointer = "") {
    if (node === null || typeof node !== "object" || Array.isArray(node)) {
        return [];
    }
    const schema = node;
    const diagnostics = [];
    const here = displayPointer === "" ? "/" : displayPointer;
    const properties = schema.properties;
    const locating = (rule, displayPath, locPointer) => ({
        rule,
        path: displayPath,
        file,
        line: lineOf(pointers, locPointer),
    });
    if (schema.type === "array" && Array.isArray(schema.required)) {
        diagnostics.push(locating("required-on-array", here, joinPointer(jsonPointer, "required")));
    }
    if (Array.isArray(schema.items)) {
        diagnostics.push(locating("items-as-array", here, joinPointer(jsonPointer, "items")));
    }
    if (schema.type === "array" && propertiesHasItems(schema.properties)) {
        diagnostics.push(locating("properties-items-in-array", here, joinPointer(jsonPointer, "properties")));
    }
    for (const key of Object.keys(schema)) {
        if (!SCHEMA_KEYWORDS.has(key) && isSchemaLike(schema[key])) {
            diagnostics.push(locating("orphan-property-keys", `${displayPointer}/${key}`, joinPointer(jsonPointer, key)));
        }
    }
    if (Array.isArray(schema.required)) {
        const declared = properties !== null && typeof properties === "object" && !Array.isArray(properties)
            ? new Set(Object.keys(properties))
            : new Set();
        for (const name of schema.required) {
            if (typeof name === "string" && !declared.has(name)) {
                diagnostics.push(locating("required-not-in-properties", `${displayPointer}/${name}`, joinPointer(jsonPointer, "required")));
            }
        }
    }
    if (properties !== null && typeof properties === "object" && !Array.isArray(properties)) {
        for (const [name, child] of Object.entries(properties)) {
            diagnostics.push(...auditSchema(child, pointers, file, `${displayPointer}/${name}`, joinPointer(joinPointer(jsonPointer, "properties"), name)));
        }
    }
    return diagnostics;
}
