import React from 'react';
import { AdSlot } from '../components/AdSlot';
import { Transaction } from '../types';

interface HomePageProps {
  state: {
    ni: number;
    usdt: number;
    transactions: Transaction[];
  };
  onNavigate: (page: string, subTab?: 'exchange' | 'withdraw') => void;
  adSlots: Record<string, any>;
  userName: string;
}

export const HomePage: React.FC<HomePageProps> = ({ state, onNavigate, adSlots, userName }) => {
  const [showBalance, setShowBalance] = React.useState(true);

  // Unified portfolio calculation: Main USDT balance + Converted NI points (1000 NI = 1 USD)
  // With 2450.00 USDT + 1040 NI points = exactly $2,451.04 USD!
  const totalBalance = Number(state.usdt || 0) + (Number(state.ni || 0) / 1000);
  const formattedBalance = totalBalance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div className="space-y-4">
      {/* Modern & Premium Crypto Wallet / Currency Balance Card (Unified with Main Balance) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121c24] via-[#0e161c] to-[#090d10] border border-cyan-500/30 p-5 shadow-[0_12px_36px_rgba(0,240,255,0.12)]">
        {/* Ambient neon backlights */}
        <div className="absolute -right-10 -top-10 w-44 h-44 bg-cyan-400/15 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -left-12 -bottom-12 w-36 h-36 bg-blue-500/10 rounded-full blur-xl pointer-events-none"></div>

        {/* Card Header: Title, eye toggle, and network pill */}
        <div className="relative z-10 flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Main Portfolio Balance
            </span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              title={showBalance ? 'Hide balance' : 'Show balance'}
              className="text-zinc-400 hover:text-cyan-400 transition-colors p-1"
            >
              <i className={showBalance ? 'fa-regular fa-eye text-xs' : 'fa-regular fa-eye-slash text-xs'}></i>
            </button>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#16222b] border border-cyan-500/25 text-[10px] font-semibold text-cyan-300 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            BEP-20 / Web3
          </div>
        </div>

        {/* Main Balance Display */}
        <div className="relative z-10 flex items-baseline gap-2.5 my-1">
          <div className="font-['Space_Grotesk'] text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {showBalance ? `$${formattedBalance}` : '$ ••••••••'}
          </div>
          <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded-md self-center">
            USD
          </span>
        </div>

        {/* Growth & Equivalent indicator */}
        <div className="relative z-10 flex items-center gap-2.5 mb-3.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
            <i className="fa-solid fa-arrow-trend-up text-[10px]"></i> +5.2% Today
          </span>
          <span className="text-[11px] text-zinc-400 font-medium">
            ≈ {showBalance ? `${(totalBalance / 685).toFixed(4)} BNB` : '•••• BNB'}
          </span>
        </div>

        {/* Unified Main Balance Breakdown Bar (এক সাথে: Main USDT + NI Points) */}
        <div className="relative z-10 grid grid-cols-2 gap-2.5 my-3.5 p-3 rounded-2xl bg-[#0b1014]/85 border border-[#1e2a33]">
          <button
            onClick={() => onNavigate('wallet', 'withdraw')}
            className="text-left border-r border-[#1e2a33] pr-2 hover:opacity-90 transition"
          >
            <div className="text-[10px] text-zinc-400 flex items-center gap-1 font-semibold">
              <i className="fa-solid fa-dollar-sign text-emerald-400"></i> Main USDT
            </div>
            <div className="font-['Space_Grotesk'] text-base font-bold text-white mt-0.5 break-all">
              {showBalance ? `$${Number(state.usdt || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$ ••••'}
            </div>
            <div className="text-[9px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
              <span>Withdrawable</span>
              <i className="fa-solid fa-chevron-right text-[8px]"></i>
            </div>
          </button>

          <button
            onClick={() => onNavigate('wallet', 'exchange')}
            className="text-left pl-2 hover:opacity-90 transition"
          >
            <div className="text-[10px] text-zinc-400 flex items-center gap-1 font-semibold">
              <i className="fa-solid fa-coins text-cyan-400"></i> NI Points
            </div>
            <div className="font-['Space_Grotesk'] text-base font-bold text-cyan-300 mt-0.5 break-all">
              {showBalance ? Math.floor(state.ni).toLocaleString() : '••••'} <span className="text-[10px] text-zinc-400 font-normal">pts</span>
            </div>
            <div className="text-[9px] text-cyan-400 font-medium flex items-center gap-1 mt-0.5">
              <span>≈ ${(state.ni / 1000).toFixed(2)} USD</span>
              <i className="fa-solid fa-repeat text-[8px]"></i>
            </div>
          </button>
        </div>

        {/* Quick Action Buttons (Exchange, Withdraw, Earn, History) */}
        <div className="relative z-10 pt-3 border-t border-[#202f38] grid grid-cols-4 gap-2">
          <button
            onClick={() => onNavigate('wallet', 'exchange')}
            className="group flex flex-col items-center gap-1.5 text-center transition-transform hover:scale-105 active:scale-95"
          >
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center text-sm shadow-[0_0_15px_rgba(0,240,255,0.15)] group-hover:bg-cyan-400 group-hover:text-black group-hover:border-cyan-400 transition-all duration-200">
              <i className="fa-solid fa-arrow-right-arrow-left"></i>
            </div>
            <span className="text-[11px] font-semibold text-zinc-300 group-hover:text-white transition-colors">
              Exchange
            </span>
          </button>

          <button
            onClick={() => onNavigate('wallet', 'withdraw')}
            className="group flex flex-col items-center gap-1.5 text-center transition-transform hover:scale-105 active:scale-95"
          >
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center text-sm shadow-[0_0_15px_rgba(0,240,255,0.15)] group-hover:bg-cyan-400 group-hover:text-black group-hover:border-cyan-400 transition-all duration-200">
              <i className="fa-solid fa-arrow-up-from-bracket"></i>
            </div>
            <span className="text-[11px] font-semibold text-zinc-300 group-hover:text-white transition-colors">
              Withdraw
            </span>
          </button>

          <button
            onClick={() => onNavigate('earn')}
            className="group flex flex-col items-center gap-1.5 text-center transition-transform hover:scale-105 active:scale-95"
          >
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center text-sm shadow-[0_0_15px_rgba(0,240,255,0.15)] group-hover:bg-cyan-400 group-hover:text-black group-hover:border-cyan-400 transition-all duration-200">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <span className="text-[11px] font-semibold text-zinc-300 group-hover:text-white transition-colors">
              Earn
            </span>
          </button>

          <button
            onClick={() => onNavigate('history')}
            className="group flex flex-col items-center gap-1.5 text-center transition-transform hover:scale-105 active:scale-95"
          >
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 flex items-center justify-center text-sm shadow-[0_0_15px_rgba(0,240,255,0.15)] group-hover:bg-cyan-400 group-hover:text-black group-hover:border-cyan-400 transition-all duration-200">
              <i className="fa-solid fa-clock-rotate-left"></i>
            </div>
            <span className="text-[11px] font-semibold text-zinc-300 group-hover:text-white transition-colors">
              History
            </span>
          </button>
        </div>
      </div>

      {/* Required Ad Slot 1: Home Top Banner */}
      <AdSlot slotId="home_top_banner" adSlots={adSlots} />

      <div className="flex items-center justify-between mt-5 mb-3">
        <h2 className="font-['Space_Grotesk'] text-lg font-bold m-0">Daily rewards</h2>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#262626] text-white">Keep your streak</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('spin')}
          className="text-left bg-gradient-to-br from-[#151515] to-[#181c1d] border border-[#353535] rounded-2xl p-4 transition hover:border-cyan-400/50 hover:scale-[1.02]"
        >
          <div className="w-14 h-14 rounded-xl bg-[#202a2d] border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl mb-3.5 shadow-md">
            <i className="fa-solid fa-dharmachakra"></i>
          </div>
          <strong className="font-['Space_Grotesk'] text-sm block text-white">Lucky Spin (10/day)</strong>
          <p className="text-[11px] text-zinc-400 mt-1 mb-0">10 daily spins & rewards</p>
        </button>

        <button
          onClick={() => onNavigate('checkin')}
          className="text-left bg-gradient-to-br from-[#151515] to-[#181c1d] border border-[#353535] rounded-2xl p-4 transition hover:border-cyan-400/50 hover:scale-[1.02]"
        >
          <div className="w-14 h-14 rounded-xl bg-[#202a2d] border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl mb-3.5 shadow-md">
            <i className="fa-solid fa-calendar-check"></i>
          </div>
          <strong className="font-['Space_Grotesk'] text-sm block text-white">Daily Check-in</strong>
          <p className="text-[11px] text-zinc-400 mt-1 mb-0">Claim your daily reward</p>
        </button>
      </div>

      {/* Required Ad Slot 2: Home Middle Banner */}
      <AdSlot slotId="home_middle_banner" adSlots={adSlots} />

      <div className="flex items-center justify-between mt-6 mb-3">
        <h2 className="font-['Space_Grotesk'] text-lg font-bold m-0 flex items-center gap-1.5">
          <i className="fa-solid fa-wand-magic-sparkles text-cyan-400"></i> Quick access
        </h2>
        <button onClick={() => onNavigate('task')} className="border-0 bg-transparent text-white text-xs font-extrabold p-1 hover:text-cyan-400 transition">
          View all <i className="fa-solid fa-arrow-right ml-1"></i>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2.5">
        <button
          onClick={() => onNavigate('earn')}
          className="bg-[#151515] border border-[#303030] rounded-2xl p-3 text-center text-white transition hover:border-cyan-400/50 hover:scale-[1.03]"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#202a2d] border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl mx-auto mb-2 shadow-md">
            <i className="fa-solid fa-circle-play"></i>
          </div>
          <span className="text-[11px] font-bold block">Video Ads</span>
        </button>

        <button
          onClick={() => onNavigate('task')}
          className="bg-[#151515] border border-[#303030] rounded-2xl p-3 text-center text-white transition hover:border-cyan-400/50 hover:scale-[1.03]"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#202a2d] border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl mx-auto mb-2 shadow-md">
            <i className="fa-solid fa-list-check"></i>
          </div>
          <span className="text-[11px] font-bold block">Tasks</span>
        </button>

        <button
          onClick={() => onNavigate('referral')}
          className="bg-[#151515] border border-[#303030] rounded-2xl p-3 text-center text-white transition hover:border-cyan-400/50 hover:scale-[1.03]"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#202a2d] border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl mx-auto mb-2 shadow-md">
            <i className="fa-solid fa-user-group"></i>
          </div>
          <span className="text-[11px] font-bold block">Referral</span>
        </button>

        <button
          onClick={() => onNavigate('wallet')}
          className="bg-[#151515] border border-[#303030] rounded-2xl p-3 text-center text-white transition hover:border-cyan-400/50 hover:scale-[1.03]"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#202a2d] border border-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl mx-auto mb-2 shadow-md">
            <i className="fa-solid fa-wallet"></i>
          </div>
          <span className="text-[11px] font-bold block">Wallet</span>
        </button>
      </div>

      {/* Required Ad Slot 3: Home Bottom Banner */}
      <AdSlot slotId="home_bottom_banner" adSlots={adSlots} />

      <div className="flex items-center justify-between mt-6 mb-3">
        <h2 className="font-['Space_Grotesk'] text-lg font-bold m-0 flex items-center gap-1.5">
          <i className="fa-solid fa-chart-line text-cyan-400"></i> Recent activity
        </h2>
        <button onClick={() => onNavigate('history')} className="border-0 bg-transparent text-white text-xs font-extrabold p-1 hover:text-cyan-400 transition">
          History <i className="fa-regular fa-clock ml-1"></i>
        </button>
      </div>

      <div className="space-y-2">
        {state.transactions.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-xs bg-[#151515] border border-[#303030] rounded-2xl">
            <i className="fa-regular fa-folder-open text-2xl mb-2 block"></i>
            No activity yet. Start earning to see activity.
          </div>
        ) : (
          state.transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="flex items-center gap-3 p-3.5 bg-[#151515] border border-[#303030] rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-[#262626] text-cyan-400 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-arrow-right-arrow-left"></i>
              </div>
              <div className="flex-1 min-w-0">
                <strong className="text-xs block text-white truncate">{tx.detail || tx.type}</strong>
                <small className="text-[10px] text-zinc-400">{tx.date}</small>
              </div>
              <div className="text-right text-xs font-bold text-white">
                {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.unit}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-center text-zinc-500 text-[10px] py-4">
        Ad Gate Hub · Demo interface · No real funds are processed
      </div>
    </div>
  );
};
