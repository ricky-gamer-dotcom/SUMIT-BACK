import { useEffect, useRef } from 'react';

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Organic fireflies (jugnu) floating gently with soft glowing aura & breathing luminescence
    const fireflyCount = Math.min(Math.floor((width * height) / 18000), 55);
    const fireflies: Array<{
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      radius: number;
      // Movement parameters for organic wandering
      angle: number;
      speed: number;
      driftSpeedX: number;
      driftSpeedY: number;
      wanderRadiusX: number;
      wanderRadiusY: number;
      wanderSpeed: number;
      // Glow and glow pulsation (jugnu luminescence)
      glowRadius: number;
      pulseSpeed: number;
      pulsePhase: number;
      minAlpha: number;
      maxAlpha: number;
    }> = [];

    for (let i = 0; i < fireflyCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = Math.random() * 1.6 + 1.0; // 1.0px to 2.6px core dot

      fireflies.push({
        x,
        y,
        baseX: x,
        baseY: y,
        radius,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.4 + 0.15,
        driftSpeedX: (Math.random() - 0.5) * 0.35,
        driftSpeedY: (Math.random() - 0.5) * 0.35 - 0.1, // subtle natural upward drift
        wanderRadiusX: Math.random() * 45 + 20,
        wanderRadiusY: Math.random() * 45 + 20,
        wanderSpeed: Math.random() * 0.015 + 0.006,
        glowRadius: radius * (Math.random() * 3.5 + 4.5), // Soft halo around the firefly
        pulseSpeed: Math.random() * 0.025 + 0.01, // Breathing glow pace
        pulsePhase: Math.random() * Math.PI * 2,
        minAlpha: Math.random() * 0.12 + 0.05,
        maxAlpha: Math.random() * 0.4 + 0.55,
      });
    }

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      fireflies.forEach((f) => {
        // Natural curved undulating flight path (sine/cosine organic sway)
        f.baseX += f.driftSpeedX;
        f.baseY += f.driftSpeedY;

        // Wrap around borders smoothly
        if (f.baseX < -60) f.baseX = width + 60;
        if (f.baseX > width + 60) f.baseX = -60;
        if (f.baseY < -60) f.baseY = height + 60;
        if (f.baseY > height + 60) f.baseY = -60;

        // Wander wave displacement for lively floating
        f.angle += f.wanderSpeed;
        f.x = f.baseX + Math.sin(f.angle) * f.wanderRadiusX;
        f.y = f.baseY + Math.cos(f.angle * 0.8) * f.wanderRadiusY;

        // Jugnu breathing glow calculation: smooth rise and fall
        const pulseCycle = Math.sin(time * f.pulseSpeed + f.pulsePhase);
        // Normalize between 0 and 1 with an ease curve
        const pulseNormalized = (pulseCycle + 1) / 2;
        const currentAlpha = f.minAlpha + (f.maxAlpha - f.minAlpha) * Math.pow(pulseNormalized, 1.8);

        // 1. Draw outer soft glow halo (firefly light aura)
        if (currentAlpha > 0.12) {
          const haloGrad = ctx.createRadialGradient(
            f.x,
            f.y,
            0,
            f.x,
            f.y,
            f.glowRadius * (0.85 + pulseNormalized * 0.4)
          );
          haloGrad.addColorStop(0, `rgba(255, 255, 255, ${currentAlpha * 0.45})`);
          haloGrad.addColorStop(0.4, `rgba(240, 245, 255, ${currentAlpha * 0.18})`);
          haloGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.beginPath();
          ctx.arc(f.x, f.y, f.glowRadius * (0.85 + pulseNormalized * 0.4), 0, Math.PI * 2);
          ctx.fillStyle = haloGrad;
          ctx.fill();
        }

        // 2. Draw intense central bright firefly core dot
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, currentAlpha * 1.3)})`;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Pure Obsidian Black background */}
      <div className="absolute inset-0 bg-[#000000]" />

      {/* Subtle aesthetic drifting moonlit aura (pure monochrome glass atmosphere, NO orange) */}
      <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full bg-white/[0.035] blur-[150px] animate-ambient-1 pointer-events-none" />
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-slate-400/[0.025] blur-[140px] animate-ambient-2 pointer-events-none" />
      <div className="absolute -bottom-[10%] left-1/2 -translate-x-1/2 w-[550px] h-[450px] rounded-full bg-white/[0.025] blur-[150px] animate-ambient-1 pointer-events-none" />

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-75" />
    </div>
  );
}

