'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Dancing_Script } from 'next/font/google';

const dancingScript = Dancing_Script({ subsets: ['latin'] });

export default function RomanticPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isFading, setIsFading] = useState(false);
  
  const photos = [
    '/foto/4-up on 18-04-26 at 01.52 (compiled).jpg',
    '/foto/IMG_1515.JPG',
    '/foto/IMG_1625.JPG',
    '/foto/IMG_1640.JPG',
    '/foto/IMG_1672.JPG'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: HeartParticle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class HeartParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      rotation: number;
      rotationSpeed: number;

      constructor() {
        this.x = canvas!.width / 2;
        this.y = canvas!.height / 2;
        this.size = Math.random() * 15 + 5;
        const angle = Math.random() * Math.PI * 2;
        const force = Math.random() * 5 + 2;
        this.speedX = Math.cos(angle) * force;
        this.speedY = Math.sin(angle) * force;
        this.color = Math.random() > 0.5 ? '#ff4d6d' : '#ff758f';
        this.opacity = 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.1;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        // Draw Heart Shape
        ctx.beginPath();
        const d = this.size;
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-d / 2, -d / 2, -d, d / 3, 0, d);
        ctx.bezierCurveTo(d, d / 3, d / 2, -d / 2, 0, 0);
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.008;
        this.rotation += this.rotationSpeed;
      }
    }

    // Initial bloom
    for (let i = 0; i < 30; i++) {
      particles.push(new HeartParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Slow and steady spawn rate
      if (particles.length < 100 && Math.random() > 0.96) {
        particles.push(new HeartParticle());
      }

      particles = particles.filter(p => p.opacity > 0);
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleButtonClick = () => {
    setIsFading(true);
    setTimeout(() => {
      setShowVideo(true);
    }, 800);
  };

  return (
    <main className={`relative min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden ${dancingScript.className}`}>
      {/* Background Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,77,109,0.15)_0%,_transparent_70%)] pointer-events-none" />
      
      {/* Background Canvas for Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      <div className="z-10 text-center px-4 w-full max-w-2xl">
        {!showVideo ? (
          <div className={`transition-all duration-1000 transform ${isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            <h1 className="text-5xl md:text-7xl text-[#ff758f] mb-12 drop-shadow-[0_0_15px_rgba(255,77,109,0.5)]">
              Halo mutia na atuu...
            </h1>
            
            <button
              onClick={handleButtonClick}
              className="group relative px-8 py-4 bg-white/10 text-[#ff758f] backdrop-blur-sm rounded-full text-2xl md:text-3xl border-2 border-[#ffb3c1]/30 shadow-[0_0_15px_rgba(255,179,193,0.2)] hover:shadow-[0_0_25px_rgba(255,77,109,0.4)] transition-all duration-500 hover:scale-110 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">See something cute</span>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        ) : (
          <div className="relative w-full">
            {/* Floating Photos Animation - Spread further away */}
            <div className="absolute -inset-32 md:-inset-60 pointer-events-none overflow-visible">
              {photos.map((src, index) => (
                <div
                  key={src}
                  className="absolute animate-float-slow opacity-0"
                  style={{
                    left: `${index % 2 === 0 ? (index * 15) % 30 : 70 + (index * 10) % 30}%`,
                    top: `${(index * 25) % 100}%`,
                    animationDelay: `${index * 2}s`,
                    width: '150px',
                    transform: `rotate(${index * 20 - 40}deg)`
                  }}
                >
                  <img
                    src={src}
                    alt="Memory"
                    className="w-full rounded-lg shadow-2xl border-2 border-white/40 object-cover aspect-square"
                  />
                </div>
              ))}
            </div>

            <div className="animate-in fade-in zoom-in duration-1000 w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-[#ff758f]/30 bg-black relative z-10">
              <video
                width="100%"
                height="100%"
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/mutia.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute bottom-10 left-0 right-0 text-center bg-black/40 backdrop-blur-md py-4">
                <p className="text-white text-3xl md:text-5xl animate-pulse drop-shadow-[0_2px_10px_rgba(255,117,143,0.5)]">
                  terima kasih sudah selalu lucu
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes heartGlow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(255, 77, 109, 0.4)); }
          50% { filter: drop-shadow(0 0 15px rgba(255, 77, 109, 0.8)); }
        }

        @keyframes float-slow {
          0% { transform: translateY(50px) rotate(0deg); opacity: 0; }
          20% { opacity: 0.7; }
          80% { opacity: 0.7; }
          100% { transform: translateY(-70px) rotate(15deg); opacity: 0; }
        }

        .animate-float-slow {
          animation: float-slow 12s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
