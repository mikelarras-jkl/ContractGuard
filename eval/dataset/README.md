# Dataset de evaluación (congelado)

20 schemas sintéticos y **50** defectos estructurales de las cinco reglas del MVP. No es el fake-server de lkweb: sirve para fijar *ground truth* y comprobar la CLI.

## Cómo auditar

Desde la raíz de ContractGuard:

```bash
yarn validate eval/dataset eval/dataset/schemasAValidar.json
```

Debe terminar en `50 errores en 20 archivos`.

## Contenido

| Carpeta | Emparejamiento |
| ------- | -------------- |
| `pares/` | 18 pares `*.schema.json` + `*.example.json` (mismo prefijo) |
| `aliasados/` | 2 pares con example de otro nombre, listados en `schemasAValidar.json` |

La tabla de defectos esperados está en [ground-truth.md](ground-truth.md).
