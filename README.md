# ContractGuard

Herramienta **CLI/script determinista** para comprobar contratos API: **JSON Schema**, **examples** y reglas del proyecto. El binario previsto se llama `schema-auditor` (véase [GLOSSARY.md](GLOSSARY.md)).

## Qué es

ContractGuard automatiza comprobaciones que una validación Ajv de examples no cubre por sí sola: **reglas estructurales** del schema y **mutation testing** sobre pares schema–example. Mismos inputs → mismos diagnósticos, informe y **código de salida**, apto para CI y revisión humana.

## Objetivos

- Salida **reproducible** (informes JSON/Markdown, exit codes estables).
- Errores **accionables**: reglas con nombre estable, ubicación y severidad.
- **Seams** claros para tests: CLI (`stdout`/`stderr`, exit code) y API exportada de auditoría.

## Alcance

**Incluye (MVP orientativo):**

- Descubrimiento de pares schema–example en una ruta indicada a la CLI.
- Validación Ajv del example frente al schema.
- Reglas estructurales del schema (p. ej. `required-on-array`, `items-as-array`; detalle en [GLOSSARY.md](GLOSSARY.md)).
- Mutation testing: el example original debe pasar; mutaciones controladas deben ser rechazadas.
- Informe determinista de la corrida.

**No incluye (por ahora):**

- Ejecución ni validación del **runtime** del backend.
- Corrección automática de schemas, AST completo de TypeScript o publicación en PR.
- [TBD] Comparación schema ↔ DTO TypeScript (fuera del MVP de la herramienta).
- [TBD] Soporte completo de todos los drafts de JSON Schema.

El repositorio **anfitrión** (fake-server, dataset del TFM) es producto de referencia; los tests de esta CLI usan **fixtures** locales, no ese árbol completo.

## Requisitos

- **Node.js** — versión mínima [TBD] cuando se fije en `package.json` / CI.
- **Yarn** — gestor de paquetes del proyecto (no usar `npm install` ni `npm ci` aquí).
- **TypeScript** — lenguaje de consenso para código y tests.

## Uso

```bash
yarn install
yarn test
```

| Comando | Propósito |
| ------- | --------- |
| `yarn test` | Suite Jest (`tests/**/*.test.ts`). Incluye un dummy de cableado; los de la CLI se irán añadiendo con TDD. |
| `yarn typecheck` | `tsc --noEmit` (TypeScript estricto). |
| `yarn validate` | Invocar el auditor sobre una ruta (equivalente al binario `schema-auditor`). **Pendiente.** |

Un hook **pre-push** de [Husky](https://typicode.github.io/husky/) ejecuta `yarn test` antes de cada `git push`. Si la suite falla, el push se aborta.

## Desarrollo

El proyecto sigue desarrollo **test-first** (TDD): test que falla → implementación mínima → refactor. No anticipar features en el mismo ciclo red–green.

- Metodología: [.agents/skills/tdd/SKILL.md](.agents/skills/tdd/SKILL.md)
- Vocabulario y reglas de dominio: [GLOSSARY.md](GLOSSARY.md)

Cambios pequeños y acotados; sin secretos en el repositorio.

## Documentación

| Recurso | Contenido |
| ------- | --------- |
| [GLOSSARY.md](GLOSSARY.md) | Términos, reglas del MVP, mutaciones, evaluación TFM. |
| [.cursor/rules/contractguard.mdc](.cursor/rules/contractguard.mdc) | Charter del proyecto (misión, stack, determinismo) para agentes en Cursor. |
| [.cursor/rules/typescript-cli.mdc](.cursor/rules/typescript-cli.mdc) | Layout `src/`, seams de test, convenciones CLI y código. |
| `docs/adr/` | Decisiones arquitectónicas (cuando existan). |

## Licencia

MIT — ver `package.json`.
