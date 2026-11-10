import React, { useState, useEffect } from 'react';
import { AdSlot } from '../components/AdSlot';
import { Transaction } from '../types';

interface EarnPageProps {
  onEarnVideo: () => void;
  transactions: Transaction[];
  adSlots: Record<string, any>;
}

export const EarnPage: React.FC<EarnPageProps> = ({ onEarnVideo, transactions, adSlots }) => {
  const [timer, setTimer] = useState(0);
  const [watching, setWatching] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let interval: any;
    if (watching && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setWatching(false);
            setCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [watching, timer]);

  const startVideoAd = () => {
    setTimer(10);
    setWatching(true);
    setCompleted(false);
  };

  const handleClaim = () => {
    if (!completed) return;
    onEarnVideo();
    setCompleted(false);
  };

  const videoRewards = transactions.filter((t) => t.type === 'Video reward' || t.detail?.includes('Video'));

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400">VIDEO REWARDS</div>
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-white mt-1 mb-1">Watch & Earn</h1>
        <p className="text-xs text-zinc-400 m-0">Watch a video ad session and claim your NI Points reward.</p>
      </div>

      {/* Required Ad Slot: Video Ads Page Banner */}
      <AdSlot slotId="video_ads_banner" adSlots={adSlots} />

      <div className="bg-[#151515] border border-[#303030] rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">REWARDED VIDEO</div>
            <h2 className="font-['Space_Grotesk'] text-lg font-bold text-white m-0 mt-1">Video Ad Session</h2>
            <p className="text-xs text-zinc-400 m-0 mt-0.5">Complete a demo watch session to claim 10 NI Points.</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#202a2d] text-cyan-400 flex items-center justify-center text-xl flex-shrink-0">
            <i className="fa-solid fa-play"></i>
          </div>
        </div>

        {watching && (
          <div className="space-y-2 mb-4">
            <div className="h-2 bg-[#202020] rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-1000 shadow-[0_0_10px_#00F0FF]"
                style={{ width: `${((10 - timer) / 10) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-cyan-400 font-semibold text-center">
              Demo ad playing: {timer} seconds remaining
            </div>
          </div>
        )}

        {completed ? (
          <button
            onClick={handleClaim}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-xl font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition hover:opacity-95"
          >
            <i className="fa-solid fa-gift mr-1.5"></i> Claim +10 NI Reward
          </button>
        ) : (
          <button
            onClick={startVideoAd}
            disabled={watching}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-xl font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className="fa-solid fa-circle-play mr-1.5"></i> {watching ? 'Watching Ad...' : 'Start video ad session'}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mt-6 mb-3">
        <h2 className="font-['Space_Grotesk'] text-base font-bold m-0 text-white">Reward history</h2>
      </div>

      <div className="space-y-2">
        {videoRewards.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-xs bg-[#151515] border border-[#303030] rounded-2xl">
            <i className="fa-regular fa-folder-open text-2xl mb-2 block"></i>
            No video rewards claimed yet.
          </div>
        ) : (
          videoRewards.map((vr) => (
            <div key={vr.id} className="flex items-center gap-3 p-3.5 bg-[#151515] border border-[#303030] rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-[#262626] text-cyan-400 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-circle-play"></i>
              </div>
              <div className="flex-1 min-w-0">
                <strong className="text-xs block text-white truncate">{vr.detail}</strong>
                <small className="text-[10px] text-zinc-400">{vr.date}</small>
              </div>
              <div className="text-right text-xs font-bold text-cyan-400">+{vr.amount} {vr.unit}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
