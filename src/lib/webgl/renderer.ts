import { FRAG, VERT } from "./shaders";

export type Dibujo = {
  a: ImageBitmap | null;
  b: ImageBitmap | null;
  sizeA: readonly [number, number];
  sizeB: readonly [number, number];
  mix: number;
  heat: number;
  lens: number;
  glow: number;
  dim: number;
  zoom: number;
  mouse: readonly [number, number];
  time: number;
};

export interface Renderer {
  resize(ancho: number, alto: number): void;
  draw(d: Dibujo): void;
  destroy(): void;
}

const UNIFORMS = [
  "uA",
  "uB",
  "uSizeA",
  "uSizeB",
  "uRes",
  "uMouse",
  "uMix",
  "uHeat",
  "uLens",
  "uGlow",
  "uDim",
  "uZoom",
  "uTime",
] as const;

function compilar(gl: WebGL2RenderingContext, tipo: number, fuente: string) {
  const shader = gl.createShader(tipo)!;
  gl.shaderSource(shader, fuente);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? "Error de shader");
  }
  return shader;
}

/** Renderer WebGL2: un triángulo a pantalla completa y un único fragment shader. */
function crearWebGL(canvas: HTMLCanvasElement): Renderer | null {
  const gl = canvas.getContext("webgl2", {
    antialias: false,
    alpha: false,
    powerPreference: "high-performance",
  });
  if (!gl) return null;

  const programa = gl.createProgram()!;
  gl.attachShader(programa, compilar(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(programa, compilar(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(programa);
  if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(programa) ?? "Error de enlace");
  }
  gl.useProgram(programa);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const aPos = gl.getAttribLocation(programa, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = Object.fromEntries(
    UNIFORMS.map((n) => [n, gl.getUniformLocation(programa, n)]),
  ) as Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;

  const crearTextura = (unidad: number) => {
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unidad);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([8, 9, 10, 255]),
    );
    return tex;
  };
  const texturas = [crearTextura(0), crearTextura(1)];
  const subidos: (ImageBitmap | null)[] = [null, null];
  gl.uniform1i(u.uA, 0);
  gl.uniform1i(u.uB, 1);

  // Solo se sube la textura cuando cambia el frame.
  const subir = (unidad: number, img: ImageBitmap | null) => {
    if (!img || subidos[unidad] === img) return;
    gl.activeTexture(gl.TEXTURE0 + unidad);
    gl.bindTexture(gl.TEXTURE_2D, texturas[unidad]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    subidos[unidad] = img;
  };

  return {
    resize(ancho, alto) {
      canvas.width = ancho;
      canvas.height = alto;
      gl.viewport(0, 0, ancho, alto);
    },
    draw(d) {
      subir(0, d.a);
      if (d.mix > 0.001) subir(1, d.b);
      gl.uniform2f(u.uSizeA, d.sizeA[0], d.sizeA[1]);
      gl.uniform2f(u.uSizeB, d.sizeB[0], d.sizeB[1]);
      gl.uniform2f(u.uRes, canvas.width, canvas.height);
      gl.uniform2f(u.uMouse, d.mouse[0], 1 - d.mouse[1]);
      gl.uniform1f(u.uMix, d.mix);
      gl.uniform1f(u.uHeat, d.heat);
      gl.uniform1f(u.uLens, d.lens);
      gl.uniform1f(u.uGlow, d.glow);
      gl.uniform1f(u.uDim, d.dim);
      gl.uniform1f(u.uZoom, d.zoom);
      gl.uniform1f(u.uTime, d.time);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    // El contexto no se libera: un canvas no puede cambiar de contexto y React
    // (StrictMode) vuelve a montar el efecto sobre el mismo elemento.
    destroy() {},
  };
}

/** Fallback sin efectos para navegadores sin WebGL2. */
function crear2D(canvas: HTMLCanvasElement): Renderer {
  const ctx = canvas.getContext("2d")!;
  const cubrir = (img: ImageBitmap, zoom: number) => {
    const escala = Math.max(canvas.width / img.width, canvas.height / img.height) * zoom;
    const w = img.width * escala;
    const h = img.height * escala;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  };
  return {
    resize(ancho, alto) {
      canvas.width = ancho;
      canvas.height = alto;
    },
    draw(d) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#08090a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (d.a) cubrir(d.a, d.zoom);
      if (d.b && d.mix > 0.001) {
        ctx.globalAlpha = d.mix;
        cubrir(d.b, d.zoom);
      }
      ctx.globalAlpha = d.dim;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
    destroy() {},
  };
}

const creados = new WeakMap<HTMLCanvasElement, Renderer>();

/** Un renderer por canvas: si el efecto se vuelve a montar se reutiliza. */
export function crearRenderer(canvas: HTMLCanvasElement): Renderer {
  let renderer = creados.get(canvas);
  if (!renderer) {
    try {
      renderer = crearWebGL(canvas) ?? crear2D(canvas);
    } catch (error) {
      console.warn("WebGL2 no disponible, usando Canvas 2D", error);
      renderer = crear2D(canvas);
    }
    creados.set(canvas, renderer);
  }
  return renderer;
}
