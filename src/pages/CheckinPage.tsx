import React from 'react';
import { AdSlot } from '../components/AdSlot';

interface CheckinPageProps {
  claimedCheckin: string;
  streak: number;
  onClaimCheckin: () => void;
  onNavigate: (page: string) => void;
  adSlots: Record<string, any>;
}

export const CheckinPage: React.FC<CheckinPageProps> = ({ claimedCheckin, streak, onClaimCheckin, onNavigate, adSlots }) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const isClaimed = claimedCheckin === todayStr;

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400">DAILY REWARD</div>
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-white mt-1 mb-1">Daily Check-in</h1>
        <p className="text-xs text-zinc-400 m-0">Come back each day and build your streak.</p>
      </div>

      {/* Required Ad Slot: Check-in Top Ad */}
      <AdSlot slotId="checkin_top_ad" adSlots={adSlots} />

      <div className="bg-[#151515] border border-[#303030] rounded-2xl p-5 shadow-xl">
        <div className="text-center py-2">
          <div className="w-16 h-16 rounded-2xl bg-[#202a2d] border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl mx-auto mb-3.5 shadow-md">
            <i className="fa-solid fa-calendar-check"></i>
          </div>
          <h2 className="font-['Space_Grotesk'] text-lg font-bold text-white m-0">Your daily reward</h2>
          <div className="font-['Space_Grotesk'] text-3xl font-bold text-cyan-400 my-2">+20 NI</div>
          <p className="text-xs text-zinc-400 m-0">Claim once per calendar day.</p>
        </div>

        <div className="flex justify-between gap-2 my-5">
          {Array.from({ length: 7 }, (_, i) => {
            const isDone = i < Math.min(streak, 7);
            return (
              <div
                key={i}
                className={`flex-1 rounded-xl text-center py-2.5 px-1 text-[10px] font-bold ${
                  isDone ? 'bg-cyan-400 text-black shadow-[0_0_12px_rgba(0,240,255,0.3)]' : 'bg-[#202020] text-zinc-400'
                }`}
              >
                DAY
                <b className={`block text-xs mt-1 ${isDone ? 'text-black' : 'text-white'}`}>{i + 1}</b>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClaimCheckin}
          disabled={isClaimed}
          className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-xl font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition hover:opacity-95 disabled:opacity-55 disabled:cursor-not-allowed"
        >
          {isClaimed ? 'Already claimed today' : 'Claim +20 NI Points'}
        </button>

        <p className="text-center text-xs text-zinc-400 mt-3 mb-0">
          {isClaimed ? "Today's reward has already been claimed." : 'Your reward is ready.'}
        </p>
      </div>

      {/* Required Ad Slot: Check-in Bottom Ad */}
      <AdSlot slotId="checkin_bottom_ad" adSlots={adSlots} />

      <button
        onClick={() => onNavigate('home')}
        className="w-full py-3 bg-[#151515] border border-[#303030] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition hover:bg-[#202020]"
      >
        <i className="fa-solid fa-arrow-left"></i> Back to Home
      </button>
    </div>
  );
};
