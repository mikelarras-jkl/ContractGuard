# Fixture: contrato correcto

Par schema–example **sintético** para contrastar con `contrato-incorrecto`. Mismo dominio (pedido), sin las reglas estructurales del MVP.

| Regla | Cómo se evita |
| ----- | ------------- |
| `required-on-array` | `required` solo en objetos (`id`/`email` en raíz; `sku` en cada línea) |
| `items-as-array` | `lines.items` es un schema objeto, no un array |
| `properties-items-in-array` | el nodo `lines` no declara `properties` |
| `orphan-property-keys` | `email` está dentro de `properties` |
| `required-not-in-properties` | las claves de `required` existen en `properties` |
