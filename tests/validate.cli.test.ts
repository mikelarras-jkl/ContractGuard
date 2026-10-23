import { spawnSync } from "node:child_process";
import path from "node:path";

const repoRoot = path.resolve(__dirname, "..");

function validate(target: string, manifest?: string) {
  const args = ["validate", target];
  if (manifest !== undefined) {
    args.push(manifest);
  }
  return spawnSync("yarn", args, {
    cwd: repoRoot,
    encoding: "utf8",
  });
}

test("validate reports required-on-array on contrato-incorrecto", () => {
  const fixture = path.join("tests", "fixtures", "contrato-incorrecto");
  const result = validate(fixture);

  expect(result.status).not.toBe(0);
  expect(result.stdout).toContain(
    "tests/fixtures/contrato-incorrecto/schema.json:15: required-on-array: /lines",
  );
});

test("validate reports items-as-array on contrato-incorrecto", () => {
  const fixture = path.join("tests", "fixtures", "contrato-incorrecto");
  const result = validate(fixture);

  expect(result.status).not.toBe(0);
  expect(result.stdout).toContain(
    "tests/fixtures/contrato-incorrecto/schema.json:16: items-as-array: /lines",
  );
});

test("validate reports properties-items-in-array on contrato-incorrecto", () => {
  const fixture = path.join("tests", "fixtures", "contrato-incorrecto");
  const result = validate(fixture);

  expect(result.status).not.toBe(0);
  expect(result.stdout).toContain(
    "tests/fixtures/contrato-incorrecto/schema.json:24: properties-items-in-array: /lines",
  );
});

test("validate reports orphan-property-keys on contrato-incorrecto", () => {
  const fixture = path.join("tests", "fixtures", "contrato-incorrecto");
  const result = validate(fixture);

  expect(result.status).not.toBe(0);
  expect(result.stdout).toContain(
    "tests/fixtures/contrato-incorrecto/schema.json:31: orphan-property-keys: /email",
  );
});

test("validate reports required-not-in-properties on contrato-incorrecto", () => {
  const fixture = path.join("tests", "fixtures", "contrato-incorrecto");
  const result = validate(fixture);

  expect(result.status).not.toBe(0);
  expect(result.stdout).toContain(
    "tests/fixtures/contrato-incorrecto/schema.json:34: required-not-in-properties: /email",
  );
});

test("validate accepts contrato-correcto", () => {
  const fixture = path.join("tests", "fixtures", "contrato-correcto");
  const result = validate(fixture);

  expect(result.status).toBe(0);
  expect(result.stdout).not.toContain("required-on-array:");
  expect(result.stdout).not.toContain("items-as-array:");
  expect(result.stdout).not.toContain("properties-items-in-array:");
  expect(result.stdout).not.toContain("orphan-property-keys:");
  expect(result.stdout).not.toContain("required-not-in-properties:");
});

test("validate prints a one-line summary of errors and files", () => {
  const fixture = path.join("tests", "fixtures", "contrato-incorrecto");
  const result = validate(fixture);

  expect(result.status).not.toBe(0);
  expect(result.stdout).toContain("6 errores en 1 archivo");
});

test("validate audits schemas listed in an optional pairing file", () => {
  const tree = path.join("tests", "fixtures", "pares-aliasados");
  const manifest = path.join(tree, "schemasAValidar.json");
  const result = validate(tree, manifest);

  expect(result.status).not.toBe(0);
  expect(result.stdout).toContain(
    "tests/fixtures/pares-aliasados/extra/pedido.res.schema.json:15: required-on-array: /lines",
  );
});

test("validate walks a tree of schema-example pairs", () => {
  const result = validate(path.join("tests", "fixtures"));

  expect(result.status).not.toBe(0);
  expect(result.stdout).toContain(
    "tests/fixtures/contrato-incorrecto/schema.json:15: required-on-array: /lines",
  );
});
