"use client";

import { useEffect, useRef, useState } from "react";

const MAX_LIGHTS = 6;

export const CONFIG = {
  speed: 0.006,
  drift: 0.02,
  fps: 20,
  grainIntensity: 0.3,
  animateGrain: false,
  grainFps: 18,
  maxPixelRatio: 1.5,
  base: 0.015,
  // y is measured from the bottom of the screen: 1 = top.
  // After inversion these read as dark patches; up to MAX_LIGHTS are supported.
  lights: [
    { x: 0.88, y: 0.62, radius: 0.5, brightness: 1.05 },
    { x: 0.45, y: 0.12, radius: 0.64, brightness: 0.34 },
    { x: 0.12, y: 0.82, radius: 0.48, brightness: 0.66 },
    { x: 0.6, y: 0.34, radius: 0.3, brightness: 0.16 },
    { x: 0.05, y: 0.2, radius: 0.5, brightness: 0.54 },
    { x: 0.34, y: 0.62, radius: 0.26, brightness: 0.1 }
  ]
};

const VERTEX = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uGrain;
uniform float uGrainSeed;
uniform float uBase;
uniform vec4 uLights[6];

float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.11, 0.17, 0.23));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(
      mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
      mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x),
      f.y
    ),
    mix(
      mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
      mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x),
      f.y
    ),
    f.z
  );
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p *= 2.02;
    amplitude *= 0.5;
  }

  return value;
}

// Diffused window light. The warp/stretch fields are sampled once per pixel and shared by
// every light, and each light's slow drift is applied on the CPU — both were per-pixel
// constants, so evaluating them per light was pure waste.
float leak(vec2 uv, vec4 light, float aspect, float warp, float stretch) {
  vec2 d = uv - light.xy;
  d.x *= aspect;
  d.y *= stretch;

  float r = length(d) * (1.0 + 0.9 * warp);

  return exp(-pow(max(r, 0.0) / light.z, 1.55) * 2.3) * light.w;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float aspect = uResolution.x / uResolution.y;

  float warp = fbm(vec3(uv * 1.7, uTime * 0.35)) - 0.5;
  float stretch = 0.72 + 0.5 * fbm(vec3(uv * 0.9, uTime * 0.25));

  float v = uBase;

  for (int i = 0; i < 6; i++) {
    v += leak(uv, uLights[i], aspect, warp, stretch);
  }

  v = pow(clamp(v, 0.0, 1.0), 1.12);

  // Hold the top strip back so the header and nav keep contrast against the leak.
  v *= 1.0 - 0.45 * smoothstep(0.86, 1.0, uv.y);

  // Where the field is strongest the page tints blue; everywhere else stays paper white.
  // Overlapping smoothsteps keep each step's ramp wide, so no band edge is visible.
  vec3 c = vec3(1.0);
  c = mix(c, vec3(0.859, 0.882, 0.914), smoothstep(0.0, 0.26, v));
  c = mix(c, vec3(0.545, 0.612, 0.698), smoothstep(0.16, 0.56, v));
  c = mix(c, vec3(0.267, 0.325, 0.408), smoothstep(0.42, 0.8, v));
  c = mix(c, vec3(0.129, 0.165, 0.224), smoothstep(0.68, 1.0, v));

  float g = hash(vec3(gl_FragCoord.xy, uGrainSeed));
  float lum = dot(c, vec3(0.2126, 0.7152, 0.0722));
  float midtone = 4.0 * lum * (1.0 - lum);
  c += (g - 0.5) * uGrain * (0.09 + 0.55 * midtone);

  gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

export default function LightLeak() {
  const canvasRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });

    if (!gl) {
      setFailed(true);
      return;
    }

    const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const program = gl.createProgram();

    if (!vertex || !fragment) {
      setFailed(true);
      return;
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      resolution: gl.getUniformLocation(program, "uResolution"),
      time: gl.getUniformLocation(program, "uTime"),
      grain: gl.getUniformLocation(program, "uGrain"),
      grainSeed: gl.getUniformLocation(program, "uGrainSeed"),
      base: gl.getUniformLocation(program, "uBase"),
      lights: gl.getUniformLocation(program, "uLights[0]")
    };

    const lights = CONFIG.lights.slice(0, MAX_LIGHTS);
    const packed = new Float32Array(MAX_LIGHTS * 4);

    const packLights = (t) => {
      lights.forEach((light, index) => {
        const phase = index * 1.7;
        const driftX = Math.sin(t * 0.21 + phase) * 0.6 + Math.sin(t * 0.09 + phase * 2.3) * 0.4;
        const driftY = Math.cos(t * 0.17 + phase * 1.4) * 0.6 + Math.cos(t * 0.07 + phase) * 0.4;

        packed.set(
          [
            light.x + driftX * CONFIG.drift,
            light.y + driftY * CONFIG.drift,
            light.radius,
            light.brightness
          ],
          index * 4
        );
      });

      gl.uniform4fv(uniforms.lights, packed);
    };

    gl.uniform1f(uniforms.grain, CONFIG.grainIntensity);
    gl.uniform1f(uniforms.base, CONFIG.base);
    packLights(0);

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, CONFIG.maxPixelRatio);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let rafId = 0;
    let running = false;

    const render = (time) => {
      const t = time * 0.001 * CONFIG.speed;

      gl.uniform1f(uniforms.time, t);
      packLights(t);

      if (CONFIG.animateGrain && frame % Math.max(Math.round(60 / CONFIG.grainFps), 1) === 0) {
        gl.uniform1f(uniforms.grainSeed, Math.random() * 1000.0);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame += 1;
    };

    // The drift is nearly imperceptible, so there is nothing to gain from drawing at 60fps.
    const interval = 1000 / CONFIG.fps;
    let last = 0;

    const loop = (time) => {
      if (time - last >= interval) {
        last = time;
        render(time);
      }

      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduced.matches) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    };

    const stop = () => {
      cancelAnimationFrame(rafId);
      running = false;
    };

    const onVisibility = () => (document.hidden ? stop() : start());

    const onResize = () => {
      resize();
      if (!running) render(performance.now());
    };

    resize();

    if (reduced.matches) {
      render(0);
    } else {
      start();
    }

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteBuffer(buffer);
    };
  }, []);

  if (failed) {
    return <div className="leak-fallback" aria-hidden="true" />;
  }

  return <canvas ref={canvasRef} className="leak-canvas" aria-hidden="true" />;
}
