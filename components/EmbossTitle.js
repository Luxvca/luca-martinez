"use client";

import { useLayoutEffect, useRef } from "react";
import { blurField } from "./deboss-field";

// A tighter reference profile for 18–30px type. No face tint or fill.
export const EMBOSS_DEFAULTS = {
  depth: .78, size: .7, soften: .12,
  angle: 225, altitude: 21, highlight: .28, shadow: .35,
};
const PAD_Y = 6;
const VERTEX = `attribute vec2 aPosition;
varying vec2 vUV;
void main() {
  vUV = vec2(aPosition.x * .5 + .5, .5 - aPosition.y * .5);
  gl_Position = vec4(aPosition, 0., 1.);
}`;
const FRAGMENT = `precision highp float;
varying vec2 vUV;
uniform sampler2D uField;
uniform vec2 uStep, uLight;
uniform float uLightZ, uDepth, uHi, uSh, uHighlightOpacity;
void main() {
  // Positive Gaussian height, central differences and normals from the reference.
  float hL = texture2D(uField, vUV - vec2(uStep.x, 0.)).g;
  float hR = texture2D(uField, vUV + vec2(uStep.x, 0.)).g;
  float hT = texture2D(uField, vUV - vec2(0., uStep.y)).g;
  float hB = texture2D(uField, vUV + vec2(0., uStep.y)).g;
  vec2 slope = vec2(hR - hL, hB - hT) * uDepth * 16.;
  vec3 N = normalize(vec3(-slope, 1.));
  float bevel = clamp(length(slope), 0., 1.);
  float diff = dot(N, normalize(vec3(uLight, uLightZ)));
  float hi = pow(max(diff, 0.), 1.2) * bevel * uHi * uHighlightOpacity;
  float sh = max(-diff, 0.) * bevel * uSh;
  // White/black light only. Omit the opaque plaster, grunge, tint and face
  // darkening so the page's animated material continues through the letters.
  float light = hi - sh;
  gl_FragColor = vec4(vec3(light > 0. ? 1. : 0.), abs(light));
}`;

export default function EmbossTitle({ word, className = "", ...settings }) {
  const hostRef = useRef(null);
  const text = word.toUpperCase();
  const { depth, size, soften, angle, altitude, highlight, shadow } = { ...EMBOSS_DEFAULTS, ...settings };
  useLayoutEffect(() => {
    const host = hostRef.current;
    const fallback = host?.querySelector(".emboss-title-fallback");
    if (!host || !fallback) return;
    const canvas = document.createElement("canvas");
    canvas.className = "emboss-title-canvas";
    canvas.setAttribute("aria-hidden", "true");
    host.appendChild(canvas);
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false, depth: false, stencil: false });
    if (!gl) { canvas.remove(); return; }
    let program = null, buffer = null, texture = null;
    let disposed = false, timer = 0, lastKey = "";
    const preview = host.closest(".project-link")?.querySelector(".preview");
    let previewVisible = preview?.getAttribute("data-visible") === "true";
    function release() {
      gl.deleteTexture(texture); gl.deleteBuffer(buffer); gl.deleteProgram(program);
      texture = null; buffer = null; program = null;
    }
    function initialize() {
      const shaders = [];
      try {
        program = gl.createProgram();
        if (!program) throw new Error("WebGL program unavailable");
        for (const [type, source] of [[gl.VERTEX_SHADER, VERTEX], [gl.FRAGMENT_SHADER, FRAGMENT]]) {
          const shader = gl.createShader(type);
          if (!shader) throw new Error("WebGL shader unavailable");
          shaders.push(shader); gl.shaderSource(shader, source); gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
          gl.attachShader(program, shader);
        }
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
        buffer = gl.createBuffer(); texture = gl.createTexture();
        if (!buffer || !texture) throw new Error("WebGL allocation failed");
        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const position = gl.getAttribLocation(program, "aPosition");
        gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        for (const param of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, param, gl.LINEAR);
        for (const param of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D, param, gl.CLAMP_TO_EDGE);
        gl.uniform1i(gl.getUniformLocation(program, "uField"), 0);
        gl.uniform2f(gl.getUniformLocation(program, "uLight"), Math.cos(angle * Math.PI / 180), Math.sin(angle * Math.PI / 180));
        gl.uniform1f(gl.getUniformLocation(program, "uLightZ"), Math.max(.25, Math.sin(altitude * Math.PI / 180) + .3));
        for (const [name, value] of Object.entries({ uDepth: depth, uHi: highlight, uSh: shadow })) gl.uniform1f(gl.getUniformLocation(program, name), value);
        return true;
      } catch (error) {
        if (process.env.NODE_ENV === "development") console.warn("EmbossTitle: using CSS fallback", error);
        release(); return false;
      } finally { shaders.forEach(shader => gl.deleteShader(shader)); }
    }
    function draw() {
      if (!program || !lastKey || disposed || gl.isContextLost()) return;
      gl.useProgram(program);
      gl.uniform1f(gl.getUniformLocation(program, "uHighlightOpacity"), previewVisible ? .5 : 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function render() {
      if (!program || disposed || gl.isContextLost()) return;
      const bounds = host.getBoundingClientRect(), style = getComputedStyle(fallback);
      const width = bounds.width, height = bounds.height + PAD_Y * 2;
      if (width < 1 || bounds.height < 1) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const key = [width, height, dpr, style.font, style.letterSpacing].join(":");
      if (key === lastKey) return;
      const limit = Math.min(8192, gl.getParameter(gl.MAX_TEXTURE_SIZE));
      // Fixed supersampling prevents phone and laptop lighting from diverging.
      const scale = Math.min(4, limit / width, limit / height, Math.sqrt(4194304 / (width * height)));
      const mask = document.createElement("canvas");
      mask.width = Math.ceil(width * scale); mask.height = Math.ceil(height * scale);
      const ctx = mask.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.scale(scale, scale);
      const fontSize = parseFloat(style.fontSize);
      ctx.font = `${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
      ctx.fillStyle = "#fff";
      const node = fallback.firstChild;
      if (!node) return;
      const range = document.createRange(), lines = [];
      // Respect native tracking and mobile line breaks without resizing the font.
      for (let i = 0; i < text.length; i++) {
        range.setStart(node, i); range.setEnd(node, i + 1);
        const rect = range.getBoundingClientRect();
        if (!rect.width) continue;
        const previous = lines[lines.length - 1], y = rect.top - bounds.top + PAD_Y;
        if (previous && Math.abs(previous.y - y) < 1) previous.text += text[i];
        else lines.push({ text: text[i], x: rect.left - bounds.left, y, height: rect.height });
      }
      ctx.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
      for (const line of lines) {
        const metrics = ctx.measureText(line.text);
        const ascent = metrics.fontBoundingBoxAscent ?? fontSize * .8;
        const descent = metrics.fontBoundingBoxDescent ?? fontSize * .2;
        ctx.fillText(line.text, line.x, line.y + (line.height - ascent - descent) / 2 + ascent);
      }
      const crisp = ctx.getImageData(0, 0, mask.width, mask.height).data;
      const alpha = new Float32Array(mask.width * mask.height);
      for (let i = 0; i < alpha.length; i++) alpha[i] = crisp[i * 4 + 3] / 255;
      // Reference blur formula. CPU Gaussian also supports Safari versions
      // without CanvasRenderingContext2D.filter.
      const soft = blurField(alpha, mask.width, mask.height, Math.max(.5, (size + soften) * scale * 1.2));
      const packed = new Uint8Array(crisp.length);
      for (let i = 0; i < alpha.length; i++) {
        packed[i * 4] = crisp[i * 4 + 3];
        packed[i * 4 + 1] = Math.round(soft[i] * 255);
        packed[i * 4 + 3] = 255;
      }
      canvas.width = Math.ceil(width * dpr); canvas.height = Math.ceil(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program); gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, mask.width, mask.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, packed);
      // One CSS-pixel step preserves the reference's strength at every DPR.
      gl.uniform2f(gl.getUniformLocation(program, "uStep"), 1 / width, 1 / height);
      lastKey = key; draw(); host.dataset.embossReady = "true";
    }
    const schedule = () => { window.clearTimeout(timer); timer = window.setTimeout(render, 120); };
    const lost = event => { event.preventDefault(); delete host.dataset.embossReady; lastKey = ""; };
    const restored = () => { release(); if (initialize()) render(); };
    canvas.addEventListener("webglcontextlost", lost); canvas.addEventListener("webglcontextrestored", restored);
    const resize = new ResizeObserver(schedule); resize.observe(host);
    window.addEventListener("resize", schedule);
    const mutation = new MutationObserver(() => {
      const visible = preview?.getAttribute("data-visible") === "true";
      if (visible === previewVisible) return;
      previewVisible = visible; draw();
    });
    if (preview) mutation.observe(preview, { attributes: true, attributeFilter: ["data-visible"] });
    if (initialize()) void document.fonts.ready.then(() => { if (!disposed) render(); });
    return () => {
      disposed = true; window.clearTimeout(timer); resize.disconnect(); mutation.disconnect();
      window.removeEventListener("resize", schedule);
      canvas.removeEventListener("webglcontextlost", lost); canvas.removeEventListener("webglcontextrestored", restored);
      release(); gl.getExtension("WEBGL_lose_context")?.loseContext(); canvas.remove(); delete host.dataset.embossReady;
    };
  }, [text, depth, size, soften, angle, altitude, highlight, shadow]);
  return <span ref={hostRef} className={`emboss-title ${className}`} role="img" aria-label={text}><span className="emboss-title-fallback" aria-hidden="true">{text}</span></span>;
}
