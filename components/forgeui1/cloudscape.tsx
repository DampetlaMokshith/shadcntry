"use client";

import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

const vertexShaderGLSL = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShaderGLSL = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_colorBottom;
uniform vec3 u_colorMid;
uniform vec3 u_colorTop;
uniform float u_speed;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p, float t) {
  float v = 0.0;
  float a = 0.5;
  float fi = 0.0;
  mat2 rot = mat2(0.86, 0.51, -0.51, 0.86);

  for (int i = 0; i < 5; i++) {
    vec2 morph = vec2(sin(t * 0.5 + fi), cos(t * 0.3 - fi)) * 0.05;
    v += a * noise(p + morph);
    p = rot * p * 2.0;
    a *= 0.5;
    fi += 1.0;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float t = u_time * u_speed;

  /*
   * PORTRAIT / MOBILE FIX
   * On a portrait phone the raw aspect ratio (~0.44) compresses the noise
   * x-range so much that FBM output is nearly constant → plain gradient.
   * Clamping to min 1.0 ensures cloud texture is always visible.
   * Desktop (ar ≈ 2.1) is completely unaffected.
   */
  float rawAr = u_resolution.x / max(u_resolution.y, 1.0);
  float ar = max(rawAr, 1.0);
  vec2 p = (uv - 0.5) * vec2(ar, 1.0);

  vec2 wind = vec2(t * 0.1, t * 0.02);
  float pattern = fbm(p * 2.2 - wind, t);

  float bandLow  = smoothstep(0.3, 0.65, pattern);
  float bandHigh = smoothstep(0.7, 0.95, pattern);

  vec3 color = mix(u_colorBottom, u_colorMid, bandLow);
  color = mix(color, u_colorTop, bandHigh);

  gl_FragColor = vec4(color, 1.0);
}
`;

interface CloudscapeProps extends React.HTMLAttributes<HTMLDivElement> {
  colorBottom?: string;
  colorMid?: string;
  colorTop?: string;
  speed?: number;
  height?: string;
}

const DEFAULT_COLOR = "#0d1117";
const COLOR_HEX_PATTERN = /^#?[0-9a-fA-F]{6}$/;

function normalizeHexColor(value: string, fallback: string) {
  const trimmed = value.trim();
  if (!COLOR_HEX_PATTERN.test(trimmed)) return fallback;
  return trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
}

function hexToRgbNormalized(hex: string): [number, number, number] {
  const normalized = normalizeHexColor(hex, DEFAULT_COLOR).replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16) / 255;
  const g = parseInt(normalized.slice(2, 4), 16) / 255;
  const b = parseInt(normalized.slice(4, 6), 16) / 255;
  return [r, g, b];
}

const Cloudscape = ({
  colorBottom = "#87ceeb",
  colorMid = "#f8f8f8",
  colorTop = "#ffffff",
  speed = 1,
  height = "100vh",
  className,
  style,
  ...props
}: CloudscapeProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);

  const settings = useMemo(
    () => ({ colorBottom, colorMid, colorTop, speed }),
    [colorBottom, colorMid, colorTop, speed],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: true });
    if (!gl) {
      console.error("[Cloudscape] WebGL not supported");
      return;
    }

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("[Cloudscape] Shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vertexShaderGLSL);
    const fs = compileShader(gl.FRAGMENT_SHADER, fragmentShaderGLSL);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[Cloudscape] Link error:", gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }

    gl.useProgram(program);

    const posLoc = gl.getAttribLocation(program, "position");
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes   = gl.getUniformLocation(program, "u_resolution");
    const uTime  = gl.getUniformLocation(program, "u_time");
    const uBot   = gl.getUniformLocation(program, "u_colorBottom");
    const uMid   = gl.getUniformLocation(program, "u_colorMid");
    const uTop   = gl.getUniformLocation(program, "u_colorTop");
    const uSpeed = gl.getUniformLocation(program, "u_speed");

    if (!uRes || !uTime || !uBot || !uMid || !uTop || !uSpeed) {
      console.error("[Cloudscape] Uniforms not found");
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }

    /*
     * SIZING — use window.innerWidth/Height as primary source.
     *
     * getBoundingClientRect() is unreliable during the first useEffect run on
     * Android Chrome — it can return 0×0 before the browser's first layout/
     * compositing pass. window.innerWidth/innerHeight are always valid.
     *
     * For a fullscreen hero (the only use case here) these values are identical
     * to the element's bounding rect. The ResizeObserver corrects any mismatch.
     */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = host.getBoundingClientRect();
      const w = Math.max(1, Math.floor((rect.width  || window.innerWidth)  * dpr));
      const h = Math.max(1, Math.floor((rect.height || window.innerHeight) * dpr));
      canvas.width  = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };

    resize();
    const t1 = setTimeout(resize, 0);
    const t2 = setTimeout(resize, 150);
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    window.addEventListener("resize", resize, { passive: true });

    const [rb, gb, bb] = hexToRgbNormalized(settings.colorBottom);
    const [rm, gm, bm] = hexToRgbNormalized(settings.colorMid);
    const [rt, gt, bt] = hexToRgbNormalized(settings.colorTop);
    gl.uniform3f(uBot,   rb, gb, bb);
    gl.uniform3f(uMid,   rm, gm, bm);
    gl.uniform3f(uTop,   rt, gt, bt);
    gl.uniform1f(uSpeed, settings.speed);

    let rafId = 0;
    const start = performance.now();

    const render = (now: number) => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    };

    /*
     * Pause the rAF loop only when the tab is hidden — NOT with IntersectionObserver.
     * On mobile, IO fires before the first rAF and reports isIntersecting=false due
     * to the address-bar / layout-viewport mismatch, permanently killing the loop.
     */
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (rafId === 0) {
        rafId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
      ro.disconnect();
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
   }, [settings]);

  const initialBg = `linear-gradient(to top, ${colorBottom} 0%, ${colorMid} 50%, ${colorTop} 100%)`;

  return (
    <div
      ref={hostRef}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height, background: initialBg, ...style }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ display: "block" }}
      />
    </div>
  );
};

export default Cloudscape;
