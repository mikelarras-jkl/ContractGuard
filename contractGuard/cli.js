"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const audit_1 = require("./audit");
const target = process.argv[2];
if (target === undefined) {
    process.stderr.write("usage: yarn validate <ruta> [schemasAValidar.json]\n");
    process.exit(2);
}
const pairingFile = process.argv[3];
const diagnostics = (0, audit_1.auditPath)(target, pairingFile);
for (const diagnostic of diagnostics) {
    process.stdout.write(`${diagnostic.file}:${diagnostic.line}: ${diagnostic.rule}: ${diagnostic.path}\n`);
}
const files = new Set(diagnostics.map((diagnostic) => diagnostic.file)).size;
const errorWord = diagnostics.length === 1 ? "error" : "errores";
const fileWord = files === 1 ? "archivo" : "archivos";
process.stdout.write(`${diagnostics.length} ${errorWord} en ${files} ${fileWord}\n`);
process.exit(diagnostics.length === 0 ? 0 : 1);
