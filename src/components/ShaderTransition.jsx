import React, { useRef, useEffect, useCallback } from 'react';

const ShaderTransition = ({ isActive, onComplete, onEnd }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const glRef = useRef(null);
  const programRef = useRef(null);
  const phaseRef = useRef('cover');
  const hasCalledCompleteRef = useRef(false);
  const totalTimeRef = useRef(0);

  const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 vUv;
    
    void main() {
      vUv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision highp float;
    
    uniform float uTime;
    uniform float uProgress;
    uniform vec2 uResolution;
    uniform vec3 uColor;
    uniform int uPhase; // 0 = covering, 1 = revealing
    
    varying vec2 vUv;
    
    float random(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x)
           + (c - a) * u.y * (1.0 - u.x)
           + (d - b) * u.x * u.y;
    }
    
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 6; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }
      return v;
    }
    
    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      uv.x *= uResolution.x / uResolution.y;
      
      float t = uTime * 0.2;
      
      // Flowing smoke effect
      vec2 flow = vec2(
        fbm(uv * 1.5 + t),
        fbm(uv * 1.5 - t + 10.0)
      );
      
      float smoke = fbm(uv * 1.2 + flow * 2.0);
      
      float mask;
      
      if (uPhase == 0) {
        // Phase 1: Cover screen (smoke fills in) - progress 0 to 1
        // Smoke grows to cover everything
        float threshold = uProgress * 1.4; // overshoot to ensure full coverage
        mask = smoothstep(smoke - 0.3, smoke + 0.1, threshold);
      } else {
        // Phase 2: Reveal new page (smoke clears) - progress 1 to 0
        // Smoke dissolves away
        float threshold = uProgress * 1.4;
        mask = smoothstep(smoke - 0.1, smoke + 0.3, threshold);
      }
      
      // Ensure we can reach full opacity
      mask = clamp(mask, 0.0, 1.0);
      
      // Enhanced color variation - more visible lighter and darker terracotta areas
      float colorNoise = fbm(uv * 3.0 + t * 0.8);
      float colorNoise2 = fbm(uv * 1.5 - t * 0.6 + 5.0);
      
      vec3 lightTerracotta = uColor + vec3(0.18, 0.14, 0.10);
      vec3 darkTerracotta = uColor - vec3(0.15, 0.12, 0.08);
      
      // Blend between light and dark based on noise
      vec3 finalColor = mix(darkTerracotta, lightTerracotta, colorNoise);
      
      // Add secondary color wave for more depth and visible movement
      finalColor = mix(finalColor, uColor * 1.1, colorNoise2 * 0.4);
      
      // Smoke-based shading for extra depth
      finalColor = mix(finalColor, darkTerracotta * 0.9, smoke * 0.25);
      
      // Subtle highlight on smoke edges
      float edgeHighlight = abs(smoke - 0.5) * 2.0;
      finalColor += vec3(0.05, 0.04, 0.03) * edgeHighlight * mask;
      
      gl_FragColor = vec4(finalColor, mask);
    }
  `;

  const compileShader = useCallback((gl, source, type) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }, []);

  const initGL = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) return false;

    glRef.current = gl;

    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return false;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Link error:', gl.getProgramInfoLog(program));
      return false;
    }

    programRef.current = program;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    return true;
  }, [compileShader, vertexShaderSource, fragmentShaderSource]);

  const animate = useCallback((timestamp) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    
    const gl = glRef.current;
    const program = programRef.current;
    const canvas = canvasRef.current;
    if (!gl || !program || !canvas) return;

    const elapsed = (timestamp - startTimeRef.current) / 1000;
    totalTimeRef.current += 0.016; // Approximate frame time for continuous time
    
    const coverDuration = 1.5;   // Time to fully cover
    const revealDuration = 1.5; // Time to fully reveal
    
    let progress;
    let phase;
    
    if (phaseRef.current === 'cover') {
      // Phase 1: Cover the screen completely
      const rawProgress = elapsed / coverDuration;
      progress = Math.min(rawProgress, 1);
      
      // Smooth easing
      progress = progress * progress * (3 - 2 * progress);
      phase = 0;
      
      // Only switch phase when FULLY covered (progress >= 1)
      if (rawProgress >= 0.5) {
        phaseRef.current = 'hold';
        startTimeRef.current = timestamp;
      }
    } else if (phaseRef.current === 'hold') {
      // Brief hold at full coverage to switch page
      progress = 1.0;
      phase = 0;
      
      if (elapsed >= 0.05) { // 50ms hold
        if (!hasCalledCompleteRef.current) {
          hasCalledCompleteRef.current = true;
          onComplete?.();
        }
        phaseRef.current = 'reveal';
        startTimeRef.current = timestamp;
      }
    } else {
      // Phase 2: Reveal the new page
      const rawProgress = elapsed / revealDuration;
      progress = 1 - Math.min(rawProgress, 1);
      
      // Smooth easing
      const t = 1 - progress;
      progress = 1 - (t * t * (3 - 2 * t));
      phase = 1;
      
      if (rawProgress >= 1.0) {
        onEnd?.();
        return;
      }
    }

    // Update canvas size
    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    gl.uniform1f(gl.getUniformLocation(program, 'uTime'), totalTimeRef.current);
    gl.uniform1f(gl.getUniformLocation(program, 'uProgress'), progress);
    gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
    gl.uniform3f(gl.getUniformLocation(program, 'uColor'), 0.757, 0.498, 0.349);
    gl.uniform1i(gl.getUniformLocation(program, 'uPhase'), phase);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    animationRef.current = requestAnimationFrame(animate);
  }, [onComplete, onEnd]);

  useEffect(() => {
    if (isActive) {
      phaseRef.current = 'cover';
      hasCalledCompleteRef.current = false;
      startTimeRef.current = null;
      totalTimeRef.current = 0;
      
      requestAnimationFrame(() => {
        if (initGL()) {
          animationRef.current = requestAnimationFrame(animate);
        }
      });
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isActive, initGL, animate]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        pointerEvents: 'none'
      }}
    />
  );
};

export default ShaderTransition;