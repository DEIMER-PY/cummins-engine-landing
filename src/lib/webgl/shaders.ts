export const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

export const FRAG = /* glsl */ `#version 300 es
precision highp float;

uniform sampler2D uA;
uniform sampler2D uB;
uniform vec2 uSizeA;
uniform vec2 uSizeB;
uniform vec2 uRes;
uniform vec2 uMouse;
uniform float uMix;
uniform float uHeat;
uniform float uLens;
uniform float uGlow;
uniform float uDim;
uniform float uZoom;
uniform float uTime;

in vec2 vUv;
out vec4 outColor;

// Equivalente a object-fit: cover, con zoom desde el centro.
vec2 cover(vec2 uv, vec2 tex) {
  float rs = uRes.x / uRes.y;
  float rt = tex.x / tex.y;
  vec2 s = rs > rt ? vec2(1.0, rt / rs) : vec2(rs / rt, 1.0);
  vec2 c = (uv - 0.5) * s / uZoom + 0.5;
  return vec2(c.x, 1.0 - c.y);
}

float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

// Paleta de camara termografica: frio (anil) -> magenta -> naranja -> blanco.
vec3 termica(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 a = vec3(0.02, 0.01, 0.10);
  vec3 b = vec3(0.36, 0.03, 0.52);
  vec3 c = vec3(0.90, 0.16, 0.22);
  vec3 d = vec3(1.00, 0.62, 0.10);
  vec3 e = vec3(1.00, 0.97, 0.82);
  if (t < 0.25) return mix(a, b, t / 0.25);
  if (t < 0.50) return mix(b, c, (t - 0.25) / 0.25);
  if (t < 0.75) return mix(c, d, (t - 0.50) / 0.25);
  return mix(d, e, (t - 0.75) / 0.25);
}

vec3 muestra(vec2 uv) {
  vec3 a = texture(uA, cover(uv, uSizeA)).rgb;
  if (uMix <= 0.001) return a;
  vec3 b = texture(uB, cover(uv, uSizeB)).rgb;
  // Fundido con barrido ruidoso en lugar de un crossfade plano.
  float n = noise(uv * 6.0 + uTime * 0.05);
  float m = smoothstep(0.0, 1.0, clamp(uMix * 1.6 - n * 0.6, 0.0, 1.0));
  return mix(a, b, m);
}

void main() {
  vec2 uv = vUv;
  vec3 col = muestra(uv);
  float l = luma(col);

  // --- Lente termica bajo el cursor + termica global ---
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  float dist = distance(uv * asp, uMouse * asp);
  float radio = 0.24;
  float borde = noise(uv * 14.0 + uTime * 0.25) * 0.035;
  float lente = smoothstep(radio + borde, radio * 0.72 + borde, dist) * uLens;
  float calor = max(uHeat, lente);

  if (calor > 0.001) {
    vec2 px = 1.5 / uRes;
    float lx = luma(muestra(uv + vec2(px.x, 0.0))) - luma(muestra(uv - vec2(px.x, 0.0)));
    float ly = luma(muestra(uv + vec2(0.0, px.y))) - luma(muestra(uv - vec2(0.0, px.y)));
    float arista = clamp(length(vec2(lx, ly)) * 9.0, 0.0, 1.0);
    float flujo = noise(uv * 5.0 + vec2(0.0, -uTime * 0.18)) * 0.14;
    float t = pow(l, 0.72) * 1.05 + flujo * l + arista * 0.3;
    vec3 th = termica(t) + arista * vec3(0.25, 0.3, 0.45);
    col = mix(col, th, calor);
    // Aro de la lente
    float aro = smoothstep(0.012, 0.0, abs(dist - radio)) * uLens * (1.0 - uHeat);
    col += aro * vec3(1.0, 0.6, 0.12) * 0.55;
  }

  // --- Brillo de combustion ---
  if (uGlow > 0.001) {
    float pulso = 0.85 + 0.15 * sin(uTime * 9.0);
    vec3 fuego = vec3(1.0, 0.42, 0.06) * pow(l, 1.6) * 2.2 + vec3(0.35, 0.05, 0.0) * (1.0 - uv.y);
    col += fuego * uGlow * pulso;
  }

  // --- Acabado: vineta, oscurecido y grano de pelicula ---
  float vig = smoothstep(1.15, 0.35, length((uv - 0.5) * vec2(1.0, 1.25)));
  col *= mix(0.55, 1.0, vig);
  col *= 1.0 - uDim;
  col += (hash(uv * uRes + fract(uTime) * 91.7) - 0.5) * 0.05;

  outColor = vec4(col, 1.0);
}`;
