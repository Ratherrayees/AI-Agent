'use client';

import React, { useRef, useState } from 'react';
import { Play, Volume2, VolumeX, Maximize2, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function LandingVideoShowcase() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section id="video-showcase" className="relative z-20 -mt-16 sm:-mt-24 lg:-mt-32 pb-16 pt-4 sm:pb-20 px-4 sm:px-6 bg-transparent">
      <div className="max-w-[1150px] mx-auto">
        {/* Top Pill Bar exactly following Cleanvoice/StateAI social proof strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 px-2">
          <div className="inline-flex items-center gap-2.5 rounded-[100px] bg-white border border-black/[0.08] py-2 px-4 shadow-[0_18px_60px_rgba(15,23,42,0.03)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3e3ef4] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3e3ef4]" />
            </span>
            <span className="text-xs sm:text-sm font-medium text-black">
              Watch Ru&apos;a in Action • Autonomous Voice & Text Demo
            </span>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-black/70 bg-white px-3.5 py-1.5 rounded-[100px] border border-black/[0.08] shadow-[0_18px_60px_rgba(15,23,42,0.03)]">
            <Zap className="w-3.5 h-3.5 text-[#3e3ef4]" />
            <span>Real-Time Neural Acoustics v2</span>
          </div>
        </div>

        {/* Video Card strictly using exact website border & shadow tokens */}
        <div className="bg-white rounded-[24px] sm:rounded-[32px] p-2 sm:p-3 border border-black/[0.08] shadow-[0_24px_70px_rgba(62,62,244,0.12)]">
          <div className="relative rounded-[20px] sm:rounded-[26px] overflow-hidden bg-[#060612] aspect-video w-full border border-black/[0.12] flex items-center justify-center group">
            {/* Video Element */}
            <video
              ref={videoRef}
              src="/assets/rua-promotional-video.mp4"
              playsInline
              controls={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover rounded-[20px] sm:rounded-[26px]"
            />

            {/* Custom Interactive Play Overlay */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#060612]/60 hover:bg-[#060612]/50 transition-all duration-300 cursor-pointer z-10 p-6 text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-white/25 bg-gradient-to-b from-[#242424] from-[19%] to-black text-white flex items-center justify-center shadow-2xl mb-6 transition-all group-hover:border-[#3e3ef4]"
                >
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-white ml-1 text-white" />
                </motion.div>

                <h3 className="text-xl sm:text-3xl font-normal tracking-[-0.02em] text-white mb-2">
                  See how Ru&apos;a qualifies leads. .{' '}
                  <em className="font-serif italic text-white/90 block sm:inline font-normal">
                    In real time
                  </em>
                </h3>
                <p className="text-xs sm:text-sm font-light text-white/80 max-w-md leading-relaxed">
                  Listen to sub-280ms acoustic latency, natural pauses, and seamless real estate objection handling.
                </p>

                <div className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-[100px] border border-white/20 bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-all">
                  <Sparkles className="w-3.5 h-3.5 text-[#3e3ef4]" />
                  <span>Click to play promotional video</span>
                </div>
              </div>
            )}


          </div>
        </div>

        {/* 3 Highlight Cards matching exact LandingCapabilities card tokens */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {[
            {
              title: 'Sub-280ms Voice Latency',
              desc: 'Indistinguishable human speech pacing, pauses, and emotional warmth.',
              icon: Zap,
              metric: 'Acoustic Speed'
            },
            {
              title: 'Real-Time Objection Handling',
              desc: 'Answers pricing, HOA fees, timeline, and neighborhood questions accurately.',
              icon: CheckCircle2,
              metric: 'Smart Dialogue'
            },
            {
              title: 'Full Appwrite & Calendar Sync',
              desc: 'Automatically logs transcripts, lead scores, and booked showings.',
              icon: ShieldCheck,
              metric: '100% Automated'
            }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-[24px] p-6 sm:p-8 border border-black/[0.06] shadow-[0_18px_60px_rgba(15,23,42,0.03)] hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(62,62,244,0.08)] transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#242424] to-black text-white shadow-xs border border-white/20">
                      <Icon className="w-4.5 h-4.5 text-white" />
                    </span>
                    <span className="text-xs font-semibold tracking-wide text-white uppercase bg-gradient-to-b from-[#242424] to-black px-3 py-1 rounded-full border border-black/10 shadow-xs">
                      {item.metric}
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-semibold tracking-[-0.02em] text-black mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm font-light text-black/75 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
