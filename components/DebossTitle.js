'use client';
import { useLayoutEffect, useRef } from 'react';
import { makeDepthField } from './deboss-field';
export const DEBOSS_DEFAULTS = {
    depth: 0.82, wall: 1.8, softness: 0.7, angle: 225, altitude: 30,
    highlight: 0.4, shadow: 0.7, castShadow: 2.4, ao: 0.12, tint: 0.24, thickness: 1.3,
};
const VERTEX = `attribute vec2 position;
varying vec2 uv;
void main() { uv = vec2(position.x * .5 + .5, .5 - position.y * .5); gl_Position = vec4(position, 0., 1.); }`;
const FRAGMENT = `precision highp float;
varying vec2 uv;
uniform sampler2D field;
uniform vec2 size;
uniform float depth, angle, altitude, highlight, shadow, castShadow, ao, tint, highlightOpacity;
float level(vec2 p) { return -texture2D(field, p / size).r * depth; }
void main() {
  vec2 p = uv * size;
  vec4 f = texture2D(field, uv);
  float h = -f.r * depth;
  float stepPx = .4;
  vec2 slope = vec2(level(p + vec2(stepPx, 0.)) - level(p - vec2(stepPx, 0.)),
                    level(p + vec2(0., stepPx)) - level(p - vec2(0., stepPx))) / (2. * stepPx);
  vec3 N = normalize(vec3(-slope, 1.));
  vec2 direction = vec2(cos(angle), sin(angle)); // CSS coordinates: 225 degrees = top left.
  vec3 L = vec3(direction * cos(altitude), sin(altitude));
  float bevel = smoothstep(0., .65, length(slope));
  float relief = (dot(N, L) - L.z) * bevel;
  float occlusion = 0.;
  for (int i = 1; i <= 8; i++) {
    float travel = castShadow * float(i) / 8.;
    float ray = h + travel * tan(altitude);
    float blocker = level(p + direction * travel) - ray;
    float penumbra = .09 + travel * .16;
    occlusion = max(occlusion, smoothstep(-penumbra, penumbra, blocker) * (1. - float(i) / 10.));
  }
  occlusion *= smoothstep(0., .15, castShadow) * smoothstep(.25, .85, f.r);
  float ambient = ao * (f.r + .7 * max(0., f.r - f.g));
  float dark = clamp(max(0., -relief) * shadow + occlusion * shadow * .48 + ambient, 0., .88);
  float bright = clamp(max(0., relief) * highlight * highlightOpacity, 0., .45);
  // Give the flat recessed floor its own translucent pigment. Previously the
  // blue inherited AO's low alpha, so it was effectively invisible.
  float blueFill = tint * smoothstep(.18, .82, f.r);
  float litWall = smoothstep(.002, .018, bright);
  vec3 recessedBlue = vec3(.035, .105, .16);
  vec3 overlay = mix(recessedBlue, vec3(1.), litWall);
  float opacity = mix(max(dark, blueFill), bright * (1. - occlusion), litWall);
  gl_FragColor = vec4(overlay, opacity * smoothstep(0., .1, depth));
}`;
export default function DebossTitle({ word, className = '', ...settings }) {
    const hostRef = useRef(null);
    const { depth, wall, softness, angle, altitude, highlight, shadow, castShadow, ao, tint, thickness } = { ...DEBOSS_DEFAULTS, ...settings };
    const text = word.toUpperCase();
    useLayoutEffect(() => {
        const host = hostRef.current;
        const fallback = host?.querySelector('.deboss-title-fallback');
        if (!host || !fallback)
            return;
        const canvas = document.createElement('canvas');
        canvas.className = 'deboss-title-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        host.appendChild(canvas);
        const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false, depth: false, stencil: false });
        if (!gl) {
            canvas.remove();
            return;
        }
        let program = null, buffer = null, texture = null;
        let disposed = false, timer = 0, lastKey = '';
        const preview = host.closest('.project-link')?.querySelector('.preview');
        let previewVisible = preview?.getAttribute('data-visible') === 'true';
        function release() {
            gl.deleteTexture(texture);
            gl.deleteBuffer(buffer);
            gl.deleteProgram(program);
            texture = null;
            buffer = null;
            program = null;
        }
        function initialize() {
            const shaders = [];
            try {
                program = gl.createProgram();
                if (!program)
                    throw new Error('Program unavailable');
                for (const [type, source] of [[gl.VERTEX_SHADER, VERTEX], [gl.FRAGMENT_SHADER, FRAGMENT]]) {
                    const shader = gl.createShader(type);
                    if (!shader)
                        throw new Error('Shader unavailable');
                    shaders.push(shader);
                    gl.shaderSource(shader, source);
                    gl.compileShader(shader);
                    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
                        throw new Error(gl.getShaderInfoLog(shader) || 'Shader compilation failed');
                    gl.attachShader(program, shader);
                }
                gl.linkProgram(program);
                if (!gl.getProgramParameter(program, gl.LINK_STATUS))
                    throw new Error('Shader linking failed');
                buffer = gl.createBuffer();
                texture = gl.createTexture();
                if (!buffer || !texture)
                    throw new Error('Allocation failed');
                gl.useProgram(program);
                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
                const position = gl.getAttribLocation(program, 'position');
                gl.enableVertexAttribArray(position);
                gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                for (const param of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER])
                    gl.texParameteri(gl.TEXTURE_2D, param, gl.LINEAR);
                for (const param of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T])
                    gl.texParameteri(gl.TEXTURE_2D, param, gl.CLAMP_TO_EDGE);
                gl.uniform1i(gl.getUniformLocation(program, 'field'), 0);
                for (const [name, value] of Object.entries({ depth, angle: angle * Math.PI / 180, altitude: altitude * Math.PI / 180, highlight, shadow, castShadow, ao, tint })) {
                    gl.uniform1f(gl.getUniformLocation(program, name), value);
                }
                return true;
            }
            catch (error) {
                if (process.env.NODE_ENV === 'development')
                    console.warn('DebossTitle: using CSS fallback', error);
                release();
                return false;
            }
            finally {
                shaders.forEach(shader => gl.deleteShader(shader));
            }
        }
        function draw() {
            if (!program || disposed || gl.isContextLost() || !lastKey)
                return;
            gl.useProgram(program);
            gl.uniform1f(gl.getUniformLocation(program, 'highlightOpacity'), previewVisible ? .5 : 1);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        }
        function render() {
            if (disposed || !program || gl.isContextLost())
                return;
            const bounds = host.getBoundingClientRect();
            const style = getComputedStyle(fallback);
            const width = bounds.width, height = bounds.height;
            if (width < 1 || height < 1)
                return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const key = [width, height, dpr, style.font, style.letterSpacing].join(':');
            if (key === lastKey)
                return;
            const limit = Math.min(8192, gl.getParameter(gl.MAX_TEXTURE_SIZE));
            const scale = Math.min(4, limit / width, limit / height, Math.sqrt(4_194_304 / (width * height)));
            const mask = document.createElement('canvas');
            mask.width = Math.ceil(width * scale);
            mask.height = Math.ceil(height * scale);
            const ctx = mask.getContext('2d', { willReadFrequently: true });
            if (!ctx)
                return;
            ctx.scale(scale, scale);
            const size = parseFloat(style.fontSize);
            ctx.font = `${style.fontWeight} ${size}px ${style.fontFamily}`;
            ctx.fillStyle = ctx.strokeStyle = '#fff';
            ctx.lineJoin = 'round';
            const stem = ctx.measureText('I');
            ctx.lineWidth = (stem.actualBoundingBoxLeft + stem.actualBoundingBoxRight) * Math.max(0, thickness - 1);
            // DOM ranges retain native tracking, wrapping and the | glyph on mobile.
            // Draw whole lines to preserve the browser's kerning rather than scaling
            // a long title down or forcing it onto one line.
            const node = fallback.firstChild;
            if (!node)
                return;
            const range = document.createRange();
            const lines = [];
            for (let i = 0; i < text.length; i++) {
                range.setStart(node, i);
                range.setEnd(node, i + 1);
                const rect = range.getBoundingClientRect();
                if (!rect.width)
                    continue;
                const previous = lines[lines.length - 1];
                if (previous && Math.abs(previous.y - (rect.top - bounds.top)) < 1)
                    previous.text += text[i];
                else
                    lines.push({ text: text[i], x: rect.left - bounds.left, y: rect.top - bounds.top, height: rect.height });
            }
            ctx.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing;
            for (const line of lines) {
                const metrics = ctx.measureText(line.text);
                const ascent = metrics.fontBoundingBoxAscent ?? size * .8;
                const descent = metrics.fontBoundingBoxDescent ?? size * .2;
                const baseline = line.y + (line.height - ascent - descent) / 2 + ascent;
                ctx.fillText(line.text, line.x, baseline);
                if (thickness > 1)
                    ctx.strokeText(line.text, line.x, baseline);
            }
            const pixels = makeDepthField(ctx.getImageData(0, 0, mask.width, mask.height).data, mask.width, mask.height, scale, wall, softness);
            canvas.width = Math.ceil(width * dpr);
            canvas.height = Math.ceil(height * dpr);
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, mask.width, mask.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            gl.uniform2f(gl.getUniformLocation(program, 'size'), width, height);
            lastKey = key;
            draw();
            host.dataset.debossReady = 'true';
        }
        const schedule = () => { window.clearTimeout(timer); timer = window.setTimeout(render, 120); };
        const lost = (event) => { event.preventDefault(); delete host.dataset.debossReady; lastKey = ''; };
        const restored = () => { release(); if (initialize())
            render(); };
        canvas.addEventListener('webglcontextlost', lost);
        canvas.addEventListener('webglcontextrestored', restored);
        const observer = new ResizeObserver(schedule);
        observer.observe(host);
        window.addEventListener('resize', schedule);
        const mutation = new MutationObserver(() => {
            const visible = preview?.getAttribute('data-visible') === 'true';
            if (visible === previewVisible)
                return;
            previewVisible = visible;
            draw(); // cached field; no rasterization on pointer moves
        });
        if (preview)
            mutation.observe(preview, { attributes: true, attributeFilter: ['data-visible'] });
        if (initialize())
            void document.fonts.ready.then(() => { if (!disposed)
                render(); });
        return () => {
            disposed = true;
            window.clearTimeout(timer);
            observer.disconnect();
            mutation.disconnect();
            window.removeEventListener('resize', schedule);
            canvas.removeEventListener('webglcontextlost', lost);
            canvas.removeEventListener('webglcontextrestored', restored);
            release();
            gl.getExtension('WEBGL_lose_context')?.loseContext();
            canvas.remove();
            delete host.dataset.debossReady;
        };
    }, [text, depth, wall, softness, angle, altitude, highlight, shadow, castShadow, ao, tint, thickness]);
    return <span ref={hostRef} className={`deboss-title ${className}`} role="img" aria-label={text}><span className="deboss-title-fallback" aria-hidden="true">{text}</span></span>;
}
