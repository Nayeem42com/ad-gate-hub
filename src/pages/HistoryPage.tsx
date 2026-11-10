import React, { useState } from 'react';
import { AdSlot } from '../components/AdSlot';
import { Transaction } from '../types';

interface HistoryPageProps {
  transactions: Transaction[];
  adSlots: Record<string, any>;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ transactions, adSlots }) => {
  const [filter, setFilter] = useState<string>('All');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = transactions.filter((t) => {
    if (filter === 'All') return true;
    if (filter === 'Earnings') return t.amount > 0 && t.unit === 'NI';
    if (filter === 'Withdrawals') return t.unit === 'USDT' && t.amount < 0;
    if (filter === 'Task Rewards') return t.type.toLowerCase().includes('task');
    if (filter === 'Video Ads') return t.type.toLowerCase().includes('video');
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400">TRANSACTION LOGS</div>
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-white mt-1 mb-1">History & Records</h1>
        <p className="text-xs text-zinc-400 m-0">Review all your earnings, rewards, exchanges, and withdrawals.</p>
      </div>

      {/* Required Ad Slot: History Top Ad */}
      <AdSlot slotId="history_top_ad" adSlots={adSlots} />

      <div className="flex gap-2 overflow-x-auto pb-1">
        {['All', 'Earnings', 'Withdrawals', 'Task Rewards', 'Video Ads'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setFilter(tab);
              setPage(1);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filter === tab ? 'bg-cyan-400 text-black shadow-md shadow-cyan-500/20' : 'bg-[#151515] border border-[#303030] text-zinc-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {paginated.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 text-xs bg-[#151515] border border-[#303030] rounded-2xl">
            <i className="fa-regular fa-folder-open text-2xl mb-2 block"></i>
            No records found for this filter.
          </div>
        ) : (
          paginated.map((tx) => (
            <div key={tx.id} className="flex items-center gap-3 p-3.5 bg-[#151515] border border-[#303030] rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-[#202020] text-cyan-400 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-arrow-right-arrow-left"></i>
              </div>
              <div className="flex-1 min-w-0">
                <strong className="text-xs block text-white truncate">{tx.detail || tx.type}</strong>
                <small className="text-[10px] text-zinc-400">{tx.date}</small>
              </div>
              <div className={`text-right text-xs font-bold ${tx.amount > 0 ? 'text-emerald-400' : 'text-zinc-300'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.unit}
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-[#151515] border border-[#303030] rounded-xl text-xs font-bold disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-zinc-400">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-[#151515] border border-[#303030] rounded-xl text-xs font-bold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Required Ad Slot: History Bottom Ad */}
      <AdSlot slotId="history_bottom_ad" adSlots={adSlots} />
    </div>
  );
};
