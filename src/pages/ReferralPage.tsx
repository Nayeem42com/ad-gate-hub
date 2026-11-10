import React, { useState } from 'react';
import { AdSlot } from '../components/AdSlot';
import { ReferralUser } from '../types';

interface ReferralPageProps {
  referrals: ReferralUser[];
  userId: string | number;
  adSlots: Record<string, any>;
}

export const ReferralPage: React.FC<ReferralPageProps> = ({ referrals, userId, adSlots }) => {
  const [copied, setCopied] = useState(false);
  const botName = 'AdGateHubBot';
  const refLink = `https://t.me/${botName}?start=ref_${userId || 'demo'}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(refLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400">GROW TOGETHER</div>
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-white mt-1 mb-1">Referral program</h1>
        <p className="text-xs text-zinc-400 m-0">Invite friends and track your community earnings.</p>
      </div>

      {/* Required Ad Slot: Referral Top Ad */}
      <AdSlot slotId="referral_top_ad" adSlots={adSlots} />

      <div className="bg-gradient-to-br from-cyan-400 to-blue-500 text-black rounded-3xl p-5 shadow-[0_8px_25px_rgba(0,240,255,0.2)]">
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#09232d]">YOUR INVITE LINK</div>
        <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#061014] my-2">Share Ad Gate Hub</h2>
        <div className="bg-black/10 border border-black/15 rounded-xl p-3 text-xs font-semibold text-[#061014] break-all">
          {refLink}
        </div>
        <button
          onClick={handleCopy}
          className="w-full mt-3.5 py-3 bg-[#090909] text-cyan-400 border border-[#090909] rounded-xl font-extrabold text-xs shadow-lg shadow-black/30 transition hover:bg-[#1a1a1a]"
        >
          <i className="fa-regular fa-copy mr-1.5"></i> {copied ? 'Copied to clipboard!' : 'Copy referral link'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#151515] border border-[#303030] rounded-2xl p-4">
          <div className="text-xs text-zinc-400">Total referrals</div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-white my-1">{referrals.length}</div>
        </div>
        <div className="bg-[#151515] border border-[#303030] rounded-2xl p-4">
          <div className="text-xs text-zinc-400">Commission earned</div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-cyan-400 my-1">0</div>
          <div className="text-[10px] text-zinc-400">NI Points · demo</div>
        </div>
      </div>

      <div className="bg-[#151515] border border-[#303030] rounded-2xl p-5">
        <h2 className="font-['Space_Grotesk'] text-base font-bold text-white mb-3">How it works</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#262626] text-cyan-400 flex items-center justify-center font-bold text-xs flex-shrink-0">1</div>
            <div>
              <strong className="text-xs block text-white">Share your invite link</strong>
              <small className="text-[10px] text-zinc-400">Send it to friends and Telegram contacts.</small>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#262626] text-cyan-400 flex items-center justify-center font-bold text-xs flex-shrink-0">2</div>
            <div>
              <strong className="text-xs block text-white">Friends join</strong>
              <small className="text-[10px] text-zinc-400">Referral identity must be verified by the server.</small>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#262626] text-cyan-400 flex items-center justify-center font-bold text-xs flex-shrink-0">3</div>
            <div>
              <strong className="text-xs block text-white">Earn commission</strong>
              <small className="text-[10px] text-zinc-400">Get ongoing rewards for active referrals.</small>
            </div>
          </div>
        </div>
      </div>

      {/* Required Ad Slot: Referral Bottom Ad */}
      <AdSlot slotId="referral_bottom_ad" adSlots={adSlots} />

      <div className="flex items-center justify-between mt-6 mb-3">
        <h2 className="font-['Space_Grotesk'] text-base font-bold m-0 text-white">Referral history</h2>
      </div>

      <div className="space-y-2">
        {referrals.length === 0 ? (
          <div className="text-center py-6 text-zinc-500 text-xs bg-[#151515] border border-[#303030] rounded-2xl">
            No verified referrals yet.
          </div>
        ) : (
          referrals.map((r) => (
            <div key={r.id} className="flex items-center justify-between p-3.5 bg-[#151515] border border-[#303030] rounded-2xl">
              <div>
                <strong className="text-xs block text-white">{r.name}</strong>
                <small className="text-[10px] text-zinc-400">{r.date}</small>
              </div>
              <div className="text-xs font-bold text-cyan-400">+{r.earnings} NI</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
