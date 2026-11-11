# Sistema de diseño: "placa de datos"

Todo sale del propio motor. Nada de plantilla genérica.

## Color

| Token                | Hex                   | Origen                     | Uso                               |
| -------------------- | --------------------- | -------------------------- | --------------------------------- |
| `carter`             | `#08090a`             | Interior del cárter        | Fondo de página                   |
| `hierro`             | `#1b1d1f`             | Hierro fundido             | Superficies                       |
| `fundicion`          | `#2c2f32`             | Fundición mecanizada       | Bordes, divisores                 |
| `acero`              | `#6d7377`             | Acero                      | Texto secundario                  |
| `aluminio`           | `#c8cbcc`             | Placa de datos             | Fondo de placas                   |
| `beige`              | `#d8cba8`             | Beige histórico de Cummins | Texto sobre oscuro                |
| `rojo` / `rojo-vivo` | `#c41e2a` / `#e5303c` | Pintura de motor           | Marca y acciones                  |
| `ambar`              | `#ff9a1f`             | Combustión                 | **Solo** calor, combustión y foco |

## Tipografía

- **Big Shoulders** (`font-display`): condensada industrial, titulares en peso 800, interlínea 0.9.
- **Archivo** (`font-sans`): cuerpo; con eje de anchura. La clase `.cifra` la estrecha al 85 %
  y fija cifras tabulares para fichas técnicas y contadores.
- Escala: `text-dato`, `text-cuerpo`, `text-entrada`, `text-titulo`, `text-monumental`.
- Etiquetas en minúscula normal (sin versalitas espaciadas). Líneas de menos de 80 caracteres.

## Elemento firma

La **placa remachada** (`.placa` + `.remache`): aluminio cepillado con texto estampado.
Se usa en el nav, en las tarjetas de los hotspots y en el footer. Es el único adorno
recurrente; el resto de la interfaz se mantiene sobrio para que mande la secuencia del motor.

## Nav

`src/components/ui/Nav.tsx`. Una placa remachada fija con:

- wordmark tipográfico (marca + modelo en rojo);
- enlaces a las secciones, con la sección actual marcada (`aria-current`);
- **tacómetro**: traduce la velocidad de scroll a rpm (650 al ralentí, 2 100 al corte) con
  subida rápida y caída lenta, como una aguja real;
- línea roja de progreso del recorrido en el borde inferior;
- acción principal "Pedir ficha técnica".

Se esconde al bajar y vuelve al subir. Por debajo de `lg` los enlaces pasan a un menú a
pantalla completa (se cierra con Escape y bloquea el scroll).

## Footer

`src/components/sections/Footer.tsx`. Llamada a la acción con enlace al sitio oficial, la placa
de datos del motor con la ficha real, tres columnas (recorrido, gama QSK, herramientas), aviso
de proyecto no oficial y el nombre del modelo a escala monumental, que emerge con el scroll.

## Preloader y hero

El preloader cuenta hasta 88 y espera ahí a que llegue la primera pasada de frames; al
completarse libera el scroll, refresca los triggers y descubre la página con una cortina.
El hero tiene la única coreografía automática: titular por líneas y cifras que cuentan.
