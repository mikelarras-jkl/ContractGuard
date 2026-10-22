# Fixture: contrato incorrecto

Par schema–example **sintético** para tests de la CLI. No es RAML: en este repo el contrato es JSON Schema + example ([GLOSSARY.md](../../../GLOSSARY.md)).

Defectos estructurales previstos (ids del MVP):

| Regla | Dónde |
| ----- | ----- |
| `required-on-array` | `lines.required` sobre un nodo `type: array` |
| `items-as-array` | `lines.items` como array (posible validación tipo tupla) |
| `properties-items-in-array` | `lines.properties.items` dentro del array |
| `orphan-property-keys` | `email` declarado en la raíz, fuera de `properties` |
| `required-not-in-properties` | `required` incluye `email`, ausente en `properties` |
