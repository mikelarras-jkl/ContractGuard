# Glosario de ContractGuard

Vocabulario de dominio del proyecto. Usar estos términos en nombres de tests, mensajes de error y documentación para mantener un lenguaje común entre humanos y agentes.

## Contexto

ContractGuard (CLI `schema-auditor`) convierte en comprobaciones **deterministas** lo que una validación Ajv de examples (`yarn schemas` o equivalente) no cubre: reglas estructurales del schema y *mutation testing*. Vive en **este repo**.

El producto de referencia es el **repositorio anfitrión** (schemas/examples del fake-server, script de validación Ajv, DTOs). La skill original de ese repo es una checklist **manual** para agentes, no el runtime de esta CLI.

Hay dos tipos de prueba, que no se mezclan:

| Tipo | Dónde | Qué demuestra |
| ---- | ----- | ------------- |
| **Tests de la CLI** | Este repo, sobre **fixtures** | La herramienta detecta reglas/mutaciones de forma reproducible. |
| **Evaluación del TFM** | Repositorio anfitrión o **sandbox** con dataset congelado | Tres escenarios de agente (sin skill / skill original / skill + herramienta). |

No instalar la skill original en `.agents/skills/` de ContractGuard mientras se desarrolla la CLI: contaminaría TDD y el escenario 1.

## Términos

| Término | Definición |
| ------- | ---------- |
| **JSON Schema** | Definición JSON que describe la forma válida de un payload; unidad principal que la herramienta recorre como árbol. |
| **Example** | Instancia JSON (archivo de ejemplo) que debe validar contra su schema asociado. |
| **Par schema–example** | Schema y example emparejados en un árbol de directorios; unidad de trabajo del auditor. |
| **Contrato** | Expectativa de forma y validez del payload: en el MVP, lo expresan el schema y el example; la persona confirma si el contrato de negocio es correcto. |
| **Descubrimiento** | Paso que localiza schemas y examples en la ruta indicada a la CLI. |
| **Validación** | Comprobación determinista; mismo input → mismos diagnósticos y código de salida. Incluye reglas estructurales, Ajv y comprobaciones de mutaciones. |
| **Validación Ajv** | Comprobar que el example original cumple el schema con Ajv (equivalente en espíritu a parte de `yarn schemas`). |
| **Regla** | Comprobación con **nombre estable** (identificador en código, tests e informes). Las reglas estructurales del MVP son cinco (ver abajo). |
| **Regla estructural** | Regla que inspecciona la forma del schema (no ejecuta negocio del backend). No sustituye el juicio sobre DTOs o dominio. |
| **Diagnóstico** | Hallazgo concreto: regla que lo emitió, ubicación en el schema o el example, severidad y mensaje accionable. |
| **Severidad** | Clasificación del diagnóstico (p. ej. error frente a advertencia); p. ej. `items` como array puede ser advertencia por posible tuple validation. |
| **Mutación** | Copia del example alterada de forma controlada para que sea **inválida** respecto al contrato esperado. |
| **Mutation testing** | El example original debe pasar Ajv; cada mutación debe ser **rechazada** por el schema. Si una mutación pasa, es una **mutación superviviente** y señala debilidad del schema o del emparejamiento. |
| **Mutación superviviente** | Mutación que el schema no rechaza cuando debería; indicador de posible hueco contractual. |
| **Informe** | Salida reproducible de una ejecución (JSON y Markdown): diagnósticos, resultados de mutaciones y metadatos de la corrida. |
| **`$ref`** | Referencia en el schema; la herramienta puede resolver referencias **locales** cuando esté implementado. |
| **Seam** | Frontera pública donde se observa comportamiento: CLI (stdout/stderr, exit code), API exportada de auditoría y formato del informe. Los tests no deben acoplarse a parsers internos. |
| **Fixture** | Par schema–example sintético y congelado en este repo (p. ej. `tests/fixtures/`) para tests de la CLI. No es el dataset del TFM. |
| **Dataset** | Recorte congelado de pares reales del repositorio anfitrión usado en la **evaluación del TFM**. Mismo conjunto en los tres escenarios. |
| **Ground truth** | Lista de defectos esperados en el dataset, fijada **antes** de las corridas de agente. Sirve para defectos detectados y falsos positivos. |
| **Skill original** | Checklist del repositorio anfitrión: patrones estructurales que la validación Ajv de examples no captura. Línea base del escenario 2; no reescribirla “de memoria”. |
| **Skill de la herramienta** | Skill **nueva o adaptada** del escenario 3: cuándo ejecutar `schema-auditor` y cómo interpretar el informe. Distinta de la skill original. |
| **Sandbox de evaluación** | Copia o worktree con dataset + skill original (snapshot) + acceso al binario de ContractGuard. No es el árbol de desarrollo de la CLI. |

## Reglas estructurales del MVP

Identificadores orientativos para tests e informes (ajustar al código cuando existan):

| Id / tema | Qué detecta |
| --------- | ----------- |
| `required-on-array` | `required` aplicado sobre un array (uso incorrecto de la palabra clave). |
| `items-as-array` | `items` definido como array (advertencia: posible validación tipo tupla). |
| `properties-items-in-array` | `properties.items` dentro de un nodo tipo array. |
| `orphan-property-keys` | Propiedades aparentemente declaradas fuera de `properties`. |
| `required-not-in-properties` | Claves listadas en `required` ausentes en `properties`. |

Comprobaciones adicionales del MVP (no necesariamente “reglas” con el mismo peso):

- Comparación básica entre claves raíz del schema y del example.
- Resolución de `$ref` locales (si el tiempo lo permite).

## Tipos de mutación (MVP)

Alteraciones previstas sobre el example:

- Eliminar propiedades obligatorias.
- Cambiar tipos de valor.
- Valores fuera de un `enum`.
- Romper elementos de arrays.
- Eliminar el wrapper raíz.

## División de responsabilidades

| Actor | Rol |
| ----- | --- |
| **Herramienta** (este repo) | Comprobaciones objetivas y reproducibles; informes. Tests propios sobre fixtures. |
| **Skill original** | Escenario 2: guía al agente para revisar a mano los patrones estructurales. Snapshot; no se instala aquí al desarrollar. |
| **Skill de la herramienta** | Escenario 3: cuándo lanzar la CLI y cómo leer el resultado. |
| **Agente** | En evaluación: mismos prompt y dataset; varía solo skill/CLI. Análisis contextual (p. ej. schema vs DTO) y propuestas. |
| **Persona** | Ground truth, requisitos contractuales finales y autorización de cambios. |

### Escenarios del TFM

1. Agente **sin** skill ni CLI.
2. Agente **con skill original**.
3. Agente **con skill de la herramienta** y binario de ContractGuard.

Corridas en el repositorio anfitrión o sandbox; no en el repo vacío de la CLI. Mismo prompt, dataset, modelo; varias repeticiones.

## Términos pendientes

- [TBD] Nombres canónicos exactos de reglas en código (snake-case vs kebab-case) y mapeo a severidad por regla.
- [TBD] Convención de emparejamiento schema/example en el árbol de directorios (nombres de archivo en fake-server).
- [TBD] Draft(s) de JSON Schema soportados en Ajv para el MVP.
- [TBD] Layout de `eval/` o sandbox (snapshot de skill, dataset, protocolo) frente a dejar el material solo en el repositorio anfitrión.
- [TBD] Métricas del TFM en el informe de la CLI vs solo en la evaluación externa.
- [TBD] Alcance de la comparación schema ↔ DTO TypeScript (fuera del MVP de la herramienta; solo agente).

## Fuera de alcance (recordatorio)

Corrección automática, AST completo de TypeScript, publicación en PR, CI obligatorio, todos los drafts, PDFs y el universo completo de schemas del repositorio anfitrión. Evaluar agentes dentro de este repo sin dataset ni DTOs.
