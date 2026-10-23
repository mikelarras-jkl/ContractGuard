import { auditPath } from "./audit";

const target = process.argv[2];
if (target === undefined) {
  process.stderr.write("usage: yarn validate <ruta>\n");
  process.exit(2);
}

const diagnostics = auditPath(target);
for (const diagnostic of diagnostics) {
  process.stdout.write(
    `${diagnostic.file}:${diagnostic.line}: ${diagnostic.rule}: ${diagnostic.path}\n`,
  );
}

process.exit(diagnostics.length === 0 ? 0 : 1);
