import React, { useState, useEffect, useRef } from 'react';
import { AdSlot } from '../components/AdSlot';

interface SpinPageProps {
  dailySpinCount: number;
  dailySpinDate: string;
  maxDailySpins?: number;
  onSpinReward: (reward: number) => void;
  onNavigate: (page: string) => void;
  adSlots: Record<string, any>;
}

export interface SpinSegment {
  amount: number;
  label: string;
  sublabel: string;
  bg: string;
  textColor: string;
  accent: string;
}

// 10 Balanced & Exciting Reward Segments (36 degrees each)
export const SPIN_SEGMENTS: SpinSegment[] = [
  { amount: 10, label: '10', sublabel: 'NI', bg: '#161d24', textColor: '#00F0FF', accent: '#00F0FF' },
  { amount: 50, label: '50', sublabel: 'NI', bg: '#222933', textColor: '#FFFFFF', accent: '#3b82f6' },
  { amount: 20, label: '20', sublabel: 'NI', bg: '#161d24', textColor: '#00F0FF', accent: '#00F0FF' },
  { amount: 100, label: '100', sublabel: 'NI', bg: '#083344', textColor: '#38bdf8', accent: '#38bdf8' },
  { amount: 15, label: '15', sublabel: 'NI', bg: '#222933', textColor: '#FFFFFF', accent: '#3b82f6' },
  { amount: 75, label: '75', sublabel: 'NI', bg: '#161d24', textColor: '#00F0FF', accent: '#00F0FF' },
  { amount: 30, label: '30', sublabel: 'NI', bg: '#222933', textColor: '#FFFFFF', accent: '#3b82f6' },
  { amount: 200, label: '200', sublabel: 'JACKPOT', bg: '#362203', textColor: '#fbbf24', accent: '#f59e0b' },
  { amount: 25, label: '25', sublabel: 'NI', bg: '#161d24', textColor: '#00F0FF', accent: '#00F0FF' },
  { amount: 5, label: '5', sublabel: 'NI', bg: '#222933', textColor: '#94a3b8', accent: '#64748b' }
];

export const SpinPage: React.FC<SpinPageProps> = ({
  dailySpinCount = 0,
  dailySpinDate = '',
  maxDailySpins = 10,
  onSpinReward,
  onNavigate,
  adSlots
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const spinsUsedToday = dailySpinDate === todayStr ? dailySpinCount : 0;
  const spinsLeft = Math.max(0, maxDailySpins - spinsUsedToday);

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winningIndex, setWinningIndex] = useState<number | null>(null);
  const [recentSpins, setRecentSpins] = useState<{ id: number; reward: number; time: string }[]>([]);
  const [timeLeftToMidnight, setTimeLeftToMidnight] = useState('');

  const currentRotationRef = useRef(0);
  const wheelRef = useRef<SVGSVGElement>(null);

  // Countdown timer to midnight reset
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeftToMidnight(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSpin = () => {
    if (spinsLeft <= 0 || spinning) return;
    setSpinning(true);
    setWinningIndex(null);

    // Pick a random segment (0 to 9)
    const idx = Math.floor(Math.random() * SPIN_SEGMENTS.length);
    const chosen = SPIN_SEGMENTS[idx];

    // Math for 10 segments (36 degrees each)
    // Slices are centered at: idx * 36 + 18 degrees (starting from 12 o'clock / top)
    // To align the center of slice idx with the 12 o'clock pointer at top:
    // targetAngle = 360 - (idx * 36 + 18)
    const targetAngle = (360 - (idx * 36 + 18) + 360) % 360;

    const current = currentRotationRef.current;
    const currentMod = current % 360;
    const diff = (targetAngle - currentMod + 360) % 360;

    // Guaranteed 6 full clockwise rotations + precise diff to target angle
    const additionalFullRotations = 360 * 6;
    const nextRotation = current + additionalFullRotations + diff;

    currentRotationRef.current = nextRotation;
    setRotation(nextRotation);

    setTimeout(() => {
      setSpinning(false);
      setWinningIndex(idx);
      onSpinReward(chosen.amount);
      setRecentSpins((prev) => [
        { id: Date.now(), reward: chosen.amount, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) },
        ...prev.slice(0, 4)
      ]);
    }, 4200);
  };

  // Helper to generate SVG pie slices for 10 segments
  const size = 300;
  const center = size / 2;
  const radius = center - 12;

  const getCoordinatesForPercent = (fraction: number) => {
    // 0 is top (12 o'clock, -90 degrees in Cartesian)
    const angle = fraction * 2 * Math.PI - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return [x, y];
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400">DAILY BONUS</div>
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-white mt-1 mb-1">Lucky Spin</h1>
        <p className="text-xs text-zinc-400 m-0">
          Spin the 10-reward wheel up to 10 times daily to win NI Points!
        </p>
      </div>

      {/* Required Ad Slot: Lucky Spin Top Ad */}
      <AdSlot slotId="spin_top_ad" adSlots={adSlots} />

      <div className="bg-[#151515] border border-[#303030] rounded-2xl p-4 sm:p-5 shadow-2xl text-center relative overflow-hidden">
        {/* Spins Header & Progress */}
        <div className="flex items-center justify-between bg-[#1d1d1d] border border-[#2d2d2d] rounded-xl px-3.5 py-2.5 mb-4">
          <div className="text-left">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Daily Spins Limit</span>
            <strong className="text-sm font-['Space_Grotesk'] text-cyan-400">
              {spinsLeft} / {maxDailySpins} Spins Remaining
            </strong>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-zinc-400 block font-semibold">Resets In</span>
            <span className="text-xs font-mono font-bold text-zinc-300">{timeLeftToMidnight}</span>
          </div>
        </div>

        {/* 10-Dot Progress Indicator */}
        <div className="flex items-center justify-center gap-1.5 mb-5 px-2">
          {Array.from({ length: maxDailySpins }, (_, i) => {
            const isUsed = i < spinsUsedToday;
            return (
              <div
                key={i}
                title={`Spin ${i + 1}`}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  isUsed
                    ? 'bg-zinc-700'
                    : 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                }`}
              />
            );
          })}
        </div>

        {/* The 10-Segment Wheel Container */}
        <div className="py-2 flex justify-center items-center relative">
          <div className="w-[min(300px,82vw)] aspect-square relative flex items-center justify-center p-2 rounded-full bg-gradient-to-br from-cyan-400 via-blue-600 to-cyan-500 shadow-[0_15px_35px_rgba(0,240,255,0.25)] border border-cyan-400/40">
            {/* Top Pointer Indicator */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
              <i className={`fa-solid fa-location-arrow text-cyan-300 text-3xl rotate-[225deg] drop-shadow-[0_0_12px_#00F0FF] ${spinning ? 'animate-bounce' : ''}`}></i>
            </div>

            {/* SVG Wheel with 10 exact wedges */}
            <svg
              ref={wheelRef}
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full rounded-full transition-transform duration-[4200ms]"
              style={{
                transform: `rotate(${rotation}deg)`,
                transitionTimingFunction: 'cubic-bezier(0.15, 0.88, 0.15, 1)'
              }}
            >
              <defs>
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 10 Wedges */}
              {SPIN_SEGMENTS.map((seg, i) => {
                const startFraction = i / 10;
                const endFraction = (i + 1) / 10;
                const [startX, startY] = getCoordinatesForPercent(startFraction);
                const [endX, endY] = getCoordinatesForPercent(endFraction);
                const pathData = `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY} Z`;

                // Calculate center angle for text placement
                const midAngle = (i * 36 + 18);
                const textAngleRad = (midAngle - 90) * (Math.PI / 180);
                const textDist = radius * 0.68;
                const tx = center + textDist * Math.cos(textAngleRad);
                const ty = center + textDist * Math.sin(textAngleRad);

                return (
                  <g key={i}>
                    <path
                      d={pathData}
                      fill={seg.bg}
                      stroke="#0d1117"
                      strokeWidth="2.5"
                      className="transition-colors"
                    />
                    {/* Radial Text Label */}
                    <g transform={`translate(${tx}, ${ty}) rotate(${midAngle})`}>
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={seg.textColor}
                        fontSize={seg.amount >= 100 ? "13" : "15"}
                        fontWeight="900"
                        fontFamily="Space Grotesk, sans-serif"
                      >
                        {seg.label}
                      </text>
                      <text
                        y="11"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={seg.accent}
                        fontSize="7"
                        fontWeight="800"
                        letterSpacing="0.5"
                      >
                        {seg.sublabel}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Outer decorative ring dots */}
              {Array.from({ length: 20 }, (_, d) => {
                const dotAngle = (d * (360 / 20) - 90) * (Math.PI / 180);
                const dx = center + (radius + 5) * Math.cos(dotAngle);
                const dy = center + (radius + 5) * Math.sin(dotAngle);
                return (
                  <circle
                    key={d}
                    cx={dx}
                    cy={dy}
                    r={d % 2 === 0 ? "2.5" : "1.8"}
                    fill={d % 2 === 0 ? "#00F0FF" : "#ffffff"}
                    opacity="0.9"
                  />
                );
              })}

              {/* Center Hub */}
              <circle cx={center} cy={center} r="28" fill="#151515" stroke="#00F0FF" strokeWidth="4" filter="url(#neonGlow)" />
              <circle cx={center} cy={center} r="22" fill="#0c1013" />
              <text
                x={center}
                y={center}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#00F0FF"
                fontSize="12"
                fontWeight="900"
                fontFamily="Space Grotesk"
              >
                SPIN
              </text>
            </svg>
          </div>
        </div>

        {/* Spin Actions */}
        <div className="mt-5 space-y-3">
          <button
            onClick={handleSpin}
            disabled={spinsLeft <= 0 || spinning}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-xl font-extrabold text-sm shadow-lg shadow-cyan-500/25 transition hover:opacity-95 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {spinning ? (
              <>
                <i className="fa-solid fa-spinner fa-spin text-base"></i>
                <span>Spinning 10-Reward Wheel...</span>
              </>
            ) : spinsLeft <= 0 ? (
              <>
                <i className="fa-solid fa-circle-check"></i>
                <span>All 10 Daily Spins Used</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-dharmachakra text-base"></i>
                <span>Spin For Free ({spinsLeft}/10 Left)</span>
              </>
            )}
          </button>

          <p className="text-xs text-zinc-400 m-0">
            {spinsLeft <= 0
              ? `You have reached today's 10-spin limit. Resets in ${timeLeftToMidnight}.`
              : `You have ${spinsLeft} free ${spinsLeft === 1 ? 'spin' : 'spins'} left today.`}
          </p>
        </div>

        {/* 10 Reward Segments Grid Preview */}
        <div className="mt-5 pt-4 border-t border-[#262626]">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2.5 text-left flex items-center justify-between">
            <span>Wheel Rewards (10 Segments)</span>
            <span className="text-cyan-400">Random Server Fair Play</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {SPIN_SEGMENTS.map((seg, i) => (
              <div
                key={i}
                className={`p-1.5 rounded-lg border text-center transition-all ${
                  winningIndex === i
                    ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_12px_#00F0FF]'
                    : 'border-[#262626] bg-[#1a1a1a]'
                }`}
              >
                <div className="text-xs font-bold text-white">+{seg.amount}</div>
                <div className="text-[8px] text-cyan-400 font-bold">{seg.sublabel}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Recent Spins Log */}
        {recentSpins.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#262626] text-left">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
              Recent Spins Today
            </span>
            <div className="space-y-1.5">
              {recentSpins.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#1c1c1c] text-xs"
                >
                  <span className="text-zinc-300 font-medium">Won +{s.reward} NI Points</span>
                  <span className="text-[10px] text-zinc-500 font-mono">{s.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Required Ad Slot: Lucky Spin Bottom Ad */}
      <AdSlot slotId="spin_bottom_ad" adSlots={adSlots} />

      <button
        onClick={() => onNavigate('home')}
        className="w-full py-3 bg-[#151515] border border-[#303030] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition hover:bg-[#202020]"
      >
        <i className="fa-solid fa-arrow-left"></i> Back to Home
      </button>
    </div>
  );
};
