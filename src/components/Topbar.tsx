import React from 'react';
import { AdSlot } from './AdSlot';

interface TopbarProps {
  onOpenSupport: () => void;
  onOpenNotifications: () => void;
  adSlots: Record<string, any>;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenSupport, onOpenNotifications, adSlots }) => {
  return (
    <>
      <header className="flex items-center justify-between gap-2 sm:gap-3 px-3.5 py-2.5 my-2.5 bg-[#151515] border border-[#292929] rounded-[999px] shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          {/* Logo Emblem Icon from official graphic */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 relative flex-shrink-0 rounded-xl overflow-hidden flex items-center justify-center bg-[#141414] border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
            <img
              src="/assets/aistudio/1794149880893_9f36431c.jpg"
              alt="Ad Gate Hub Emblem"
              className="w-[190%] h-[190%] max-w-none object-cover object-[50%_33%] select-none pointer-events-none"
            />
          </div>

          {/* Complete Brand Typography with full HUB */}
          <div className="flex items-center gap-1.5 font-['Space_Grotesk'] font-extrabold text-base sm:text-lg tracking-tight leading-none whitespace-nowrap select-none">
            <span className="text-[#00F0FF] drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">AD GATE</span>
            <span className="text-[#FFA116] drop-shadow-[0_0_10px_rgba(255,161,22,0.5)]">HUB</span>
          </div>
        </div>

        {/* Action Buttons: Support (Headset) and Notifications (Bell) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onOpenSupport}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border border-[#303030] bg-[#202020] text-cyan-400 flex items-center justify-center text-base transition hover:border-cyan-400/50 hover:scale-105 active:scale-95"
            title="Support"
            aria-label="Support"
          >
            <i className="fa-solid fa-headset"></i>
          </button>
          <button
            onClick={onOpenNotifications}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border border-[#303030] bg-[#202020] text-cyan-400 flex items-center justify-center text-base transition hover:border-cyan-400/50 hover:scale-105 active:scale-95"
            title="Notifications"
            aria-label="Notifications"
          >
            <i className="fa-solid fa-bell"></i>
          </button>
        </div>
      </header>
    </>
  );
};
