# Ground truth

50 defectos reales en 20 archivos. Etiquetados a propósito al construir el dataset (patrones 1–4 de la skill + `required-not-in-properties`). No incluir `if`/`then`/`else` ni schema↔DTO.

| id | archivo | regla | puntero |
| -- | ------- | ----- | ------- |
| GT-01 | `pares/01-catalogo.get.res.schema.json` | `required-on-array` | `/lista` |
| GT-02 | `pares/02-avisos.get.res.schema.json` | `items-as-array` | `/lista` |
| GT-03 | `pares/03-intervinientes.get.res.schema.json` | `properties-items-in-array` | `/lista` |
| GT-04 | `pares/04-resultado.post.res.schema.json` | `orphan-property-keys` | `/codigo` |
| GT-05 | `pares/05-filtro.get.res.schema.json` | `required-not-in-properties` | `/codigo` |
| GT-06 | `pares/06-depositos.get.res.schema.json` | `required-on-array` | `/datos` |
| GT-07 | `pares/06-depositos.get.res.schema.json` | `required-not-in-properties` | `/datos/id` |
| GT-08 | `pares/07-lineas.get.res.schema.json` | `required-on-array` | `/lista` |
| GT-09 | `pares/07-lineas.get.res.schema.json` | `items-as-array` | `/lista` |
| GT-10 | `pares/07-lineas.get.res.schema.json` | `required-not-in-properties` | `/lista/id` |
| GT-11 | `pares/08-pedido.get.res.schema.json` | `required-on-array` | `/lines` |
| GT-12 | `pares/08-pedido.get.res.schema.json` | `items-as-array` | `/lines` |
| GT-13 | `pares/08-pedido.get.res.schema.json` | `properties-items-in-array` | `/lines` |
| GT-14 | `pares/08-pedido.get.res.schema.json` | `required-not-in-properties` | `/lines/sku` |
| GT-15 | `pares/09-mensaje.get.res.schema.json` | `orphan-property-keys` | `/resultado` |
| GT-16 | `pares/09-mensaje.get.res.schema.json` | `orphan-property-keys` | `/mensaje` |
| GT-17 | `pares/10-contacto.get.res.schema.json` | `orphan-property-keys` | `/email` |
| GT-18 | `pares/10-contacto.get.res.schema.json` | `required-not-in-properties` | `/email` |
| GT-19 | `pares/10-contacto.get.res.schema.json` | `required-not-in-properties` | `/fax` |
| GT-20 | `pares/11-tags.get.res.schema.json` | `items-as-array` | `/lista` |
| GT-21 | `pares/11-tags.get.res.schema.json` | `properties-items-in-array` | `/lista` |
| GT-22 | `pares/12-documentos.get.res.schema.json` | `orphan-property-keys` | `/extra` |
| GT-23 | `pares/12-documentos.get.res.schema.json` | `required-on-array` | `/lista` |
| GT-24 | `pares/12-documentos.get.res.schema.json` | `required-not-in-properties` | `/lista/id` |
| GT-25 | `pares/13-movimientos.get.res.schema.json` | `required-on-array` | `/lista` |
| GT-26 | `pares/13-movimientos.get.res.schema.json` | `properties-items-in-array` | `/lista` |
| GT-27 | `pares/13-movimientos.get.res.schema.json` | `required-not-in-properties` | `/lista/id` |
| GT-28 | `pares/14-historico.get.res.schema.json` | `orphan-property-keys` | `/nota` |
| GT-29 | `pares/14-historico.get.res.schema.json` | `items-as-array` | `/lista` |
| GT-30 | `pares/15-busqueda.get.res.schema.json` | `orphan-property-keys` | `/fax` |
| GT-31 | `pares/15-busqueda.get.res.schema.json` | `required-not-in-properties` | `/a` |
| GT-32 | `pares/15-busqueda.get.res.schema.json` | `required-not-in-properties` | `/b` |
| GT-33 | `pares/16-completo.get.res.schema.json` | `orphan-property-keys` | `/email` |
| GT-34 | `pares/16-completo.get.res.schema.json` | `required-on-array` | `/lines` |
| GT-35 | `pares/16-completo.get.res.schema.json` | `items-as-array` | `/lines` |
| GT-36 | `pares/16-completo.get.res.schema.json` | `properties-items-in-array` | `/lines` |
| GT-37 | `pares/16-completo.get.res.schema.json` | `required-not-in-properties` | `/lines/sku` |
| GT-38 | `pares/17-anidados.get.res.schema.json` | `items-as-array` | `/a` |
| GT-39 | `pares/17-anidados.get.res.schema.json` | `items-as-array` | `/b` |
| GT-40 | `pares/18-colecciones.get.res.schema.json` | `properties-items-in-array` | `/a` |
| GT-41 | `pares/18-colecciones.get.res.schema.json` | `properties-items-in-array` | `/b` |
| GT-42 | `aliasados/19-resumen.get.res.schema.json` | `orphan-property-keys` | `/x` |
| GT-43 | `aliasados/19-resumen.get.res.schema.json` | `orphan-property-keys` | `/y` |
| GT-44 | `aliasados/19-resumen.get.res.schema.json` | `required-on-array` | `/a` |
| GT-45 | `aliasados/19-resumen.get.res.schema.json` | `required-on-array` | `/b` |
| GT-46 | `aliasados/20-detalle.get.res.schema.json` | `orphan-property-keys` | `/foo` |
| GT-47 | `aliasados/20-detalle.get.res.schema.json` | `orphan-property-keys` | `/bar` |
| GT-48 | `aliasados/20-detalle.get.res.schema.json` | `required-not-in-properties` | `/a` |
| GT-49 | `aliasados/20-detalle.get.res.schema.json` | `required-not-in-properties` | `/b` |
| GT-50 | `aliasados/20-detalle.get.res.schema.json` | `required-not-in-properties` | `/c` |

## Por regla

| regla | cantidad |
| ----- | -------- |
| `required-on-array` | 9 |
| `items-as-array` | 8 |
| `properties-items-in-array` | 7 |
| `orphan-property-keys` | 12 |
| `required-not-in-properties` | 14 |
| **total** | **50** |
