import React from 'react';
import { AdSlot } from './AdSlot';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  adSlots: Record<string, any>;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, adSlots }) => {
  return (
    <>
      <nav aria-label="Main navigation" className="fixed z-20 bottom-0 left-1/2 -translate-x-1/2 w-[min(540px,100%)] px-2.5 pt-2 pb-[calc(9px+env(safe-area-inset-bottom))] bg-[#151515]/90 border-t border-[#303030] backdrop-blur-lg shadow-[0_-10px_30px_rgba(0,0,0,0.4)]">
        {/* Bottom Navigation Sponsored Slot */}
        <div className="px-1 mb-1">
          <AdSlot slotId="nav_sponsored_slot" adSlots={adSlots} />
        </div>

        <div className="grid grid-cols-6 gap-1">
          <button
            onClick={() => onNavigate('home')}
            className={`nav-item flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-bold transition ${
              currentPage === 'home' ? 'text-cyan-400 bg-cyan-500/10 active' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-house-chimney text-lg"></i>
            <span>Home</span>
          </button>

          <button
            onClick={() => onNavigate('task')}
            className={`nav-item flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-bold transition ${
              currentPage === 'task' ? 'text-cyan-400 bg-cyan-500/10 active' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-list-check text-lg"></i>
            <span>Task</span>
          </button>

          <button
            onClick={() => onNavigate('earn')}
            className={`nav-item flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-bold transition ${
              currentPage === 'earn' ? 'text-cyan-400 bg-cyan-500/10 active' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-circle-play text-lg"></i>
            <span>Earn</span>
          </button>

          <button
            onClick={() => onNavigate('wallet')}
            className={`nav-item flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-bold transition ${
              currentPage === 'wallet' ? 'text-cyan-400 bg-cyan-500/10 active' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-wallet text-lg"></i>
            <span>Wallet</span>
          </button>

          <button
            onClick={() => onNavigate('referral')}
            className={`nav-item flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-bold transition ${
              currentPage === 'referral' ? 'text-cyan-400 bg-cyan-500/10 active' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-people-group text-lg"></i>
            <span>Referral</span>
          </button>

          <button
            onClick={() => onNavigate('profile')}
            className={`nav-item flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-bold transition ${
              currentPage === 'profile' ? 'text-cyan-400 bg-cyan-500/10 active' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-circle-user text-lg"></i>
            <span>Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};
