import React, { useEffect, useRef } from 'react';
import { AdSlotId } from '../types';

interface AdSlotProps {
  slotId: AdSlotId;
  adSlots: Record<string, any>;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ slotId, adSlots, className = '' }) => {
  const slot = adSlots[slotId];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slot || !slot.enabled || !slot.adCode || !containerRef.current) return;
    
    // Safely render HTML/JS ad snippet
    const container = containerRef.current;
    container.innerHTML = '';

    try {
      const template = document.createElement('template');
      template.innerHTML = slot.adCode;
      const nodes = Array.from(template.content.childNodes);

      nodes.forEach((node) => {
        if (node.nodeName.toLowerCase() === 'script') {
          const script = document.createElement('script');
          Array.from((node as HTMLElement).attributes).forEach((attr) => {
            script.setAttribute(attr.name, attr.value);
          });
          script.text = node.textContent || '';
          container.appendChild(script);
        } else {
          container.appendChild(node.cloneNode(true));
        }
      });
    } catch (err) {
      console.error(`Error rendering ad slot ${slotId}:`, err);
    }
  }, [slot, slotId]);

  if (!slot || !slot.enabled) {
    return null; // Hide slot if disabled or not configured
  }

  // If enabled but no custom code provided yet, show a clean placeholder or ad badge
  if (!slot.adCode || !slot.adCode.trim()) {
    return (
      <div className={`ad-slot-placeholder border border-dashed border-[#303030] rounded-xl p-3 text-center my-3 bg-[#121212] ${className}`}>
        <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
          <i className="fa-solid fa-rectangle-ad text-cyan-400"></i>
          <span>Sponsored Slot — {slot.name}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`ad-slot is-active my-3 overflow-hidden rounded-xl text-center ${className}`}
      data-ad-slot={slotId}
    />
  );
};
