import { spawnSync } from "node:child_process";
import path from "node:path";

const repoRoot = path.resolve(__dirname, "..");

function validate(target: string) {
  return spawnSync("yarn", ["validate", target], {
    cwd: repoRoot,
    encoding: "utf8",
  });
}

test("validate reports required-on-array on contrato-incorrecto", () => {
  const fixture = path.join("tests", "fixtures", "contrato-incorrecto");
  const result = validate(fixture);

  expect(result.status).not.toBe(0);
  expect(result.stdout).toContain("required-on-array: /lines");
});

test("validate reports items-as-array on contrato-incorrecto", () => {
  const fixture = path.join("tests", "fixtures", "contrato-incorrecto");
  const result = validate(fixture);

  expect(result.status).not.toBe(0);
  expect(result.stdout).toContain("items-as-array: /lines");
});

test("validate reports properties-items-in-array on contrato-incorrecto", () => {
  const fixture = path.join("tests", "fixtures", "contrato-incorrecto");
  const result = validate(fixture);

  expect(result.status).not.toBe(0);
  expect(result.stdout).toContain("properties-items-in-array: /lines");
});

test("validate reports orphan-property-keys on contrato-incorrecto", () => {
  const fixture = path.join("tests", "fixtures", "contrato-incorrecto");
  const result = validate(fixture);

  expect(result.status).not.toBe(0);
  expect(result.stdout).toContain("orphan-property-keys: /email");
});

test("validate reports required-not-in-properties on contrato-incorrecto", () => {
  const fixture = path.join("tests", "fixtures", "contrato-incorrecto");
  const result = validate(fixture);

  expect(result.status).not.toBe(0);
  expect(result.stdout).toContain("required-not-in-properties: /email");
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

test("validate walks a tree of schema-example pairs", () => {
  const result = validate(path.join("tests", "fixtures"));

  expect(result.status).not.toBe(0);
  expect(result.stdout).toContain("required-on-array: /lines");
});
