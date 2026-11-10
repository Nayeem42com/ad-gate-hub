import React from 'react';
import { AdSlot } from '../components/AdSlot';
import { TaskItem } from '../types';

interface TaskPageProps {
  tasks: TaskItem[];
  taskStates: Record<string, string>;
  onClaimTask: (id: string) => void;
  adSlots: Record<string, any>;
}

export const TaskPage: React.FC<TaskPageProps> = ({ tasks, taskStates, onClaimTask, adSlots }) => {
  const availableCount = tasks.filter((t) => taskStates[t.id] !== 'claimed').length;

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400">AVAILABLE ACTIVITIES</div>
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-white mt-1 mb-1">Task Center</h1>
        <p className="text-xs text-zinc-400 m-0">Join tasks, complete activities and claim NI Points.</p>
      </div>

      {/* Required Ad Slot: Task Center Top Ad */}
      <AdSlot slotId="task_top_ad" adSlots={adSlots} />

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-['Space_Grotesk'] text-base font-bold m-0 text-white">Available tasks</h2>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#262626] text-white">{availableCount} available</span>
      </div>

      <div className="space-y-2.5">
        {tasks.map((task) => {
          const status = taskStates[task.id] || 'available';
          const isClaimed = status === 'claimed';
          const isJoined = status === 'joined';
          const label = isClaimed ? 'Claimed' : isJoined ? 'Claim reward' : 'Join task';

          return (
            <div key={task.id} className="flex items-center gap-3 p-4 bg-[#151515] border border-[#303030] rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-[#202a2d] text-cyan-400 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-list-check"></i>
              </div>
              <div className="flex-1 min-w-0">
                <strong className="text-xs block text-white truncate">{task.title}</strong>
                <small className="text-[10px] text-zinc-400 block truncate">{task.description}</small>
                <div className="mt-1.5">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold ${isClaimed ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-[#202020] text-zinc-400'}`}>
                    {isClaimed ? 'Completed' : isJoined ? 'Ready to claim' : 'Available'}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-bold text-cyan-400">+{task.reward} NI</div>
                <button
                  onClick={() => onClaimTask(task.id)}
                  disabled={isClaimed}
                  className="mt-2 px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-xl text-[10px] font-extrabold shadow-md shadow-cyan-500/20 transition hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {label}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Required Ad Slot: Task Center Middle Ad */}
      <AdSlot slotId="task_middle_ad" adSlots={adSlots} />

      <div className="p-3.5 border border-dashed border-[#303030] rounded-2xl text-zinc-400 text-[11px] leading-relaxed bg-[#121212]">
        Demo task completion is simulated locally. In production, task membership and completion must be verified by your server before rewards are credited.
      </div>

      {/* Required Ad Slot: Task Center Bottom Ad */}
      <AdSlot slotId="task_bottom_ad" adSlots={adSlots} />
    </div>
  );
};
