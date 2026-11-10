import React, { useState } from 'react';
import { AdSlotId, AdType, TaskItem, WithdrawalRequest, Announcement } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  adSlots: Record<string, any>;
  onUpdateAdSlot: (slotId: string, updated: any) => void;
  tasks: TaskItem[];
  onAddTask: (task: TaskItem) => void;
  onDeleteTask: (taskId: string) => void;
  withdrawals: WithdrawalRequest[];
  onUpdateWithdrawal: (id: string | number, status: 'Approved' | 'Rejected' | 'Processing' | 'Completed') => void;
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Announcement) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  adSlots,
  onUpdateAdSlot,
  tasks,
  onAddTask,
  onDeleteTask,
  withdrawals,
  onUpdateWithdrawal,
  announcements,
  onAddAnnouncement
}) => {
  const [activeTab, setActiveTab] = useState<'ads' | 'tasks' | 'withdrawals' | 'announcements' | 'stats'>('ads');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('home_top_banner');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskReward, setNewTaskReward] = useState('30');
  const [newTaskLink, setNewTaskLink] = useState('https://t.me');
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
  const [newAnnouncementContent, setNewAnnouncementContent] = useState('');

  if (!isOpen) return null;

  const currentSlot = adSlots[selectedSlotId] || {};

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl max-h-[92vh] bg-[#151515] border border-[#303030] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#303030] bg-[#1c1c1c]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-lg">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h2 className="font-['Space_Grotesk'] text-lg font-bold m-0">Admin Management System</h2>
              <p className="text-xs text-zinc-400 m-0">Centralized advertising control & platform governance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#262626] text-zinc-300 hover:text-white flex items-center justify-center transition"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-3 bg-[#181818] border-b border-[#303030] overflow-x-auto">
          <button
            onClick={() => setActiveTab('ads')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'ads' ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-500/20' : 'bg-[#202020] text-zinc-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-rectangle-ad mr-1.5"></i> Ad Slots (21)
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'tasks' ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-500/20' : 'bg-[#202020] text-zinc-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-list-check mr-1.5"></i> Tasks Center
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'withdrawals' ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-500/20' : 'bg-[#202020] text-zinc-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-wallet mr-1.5"></i> Withdrawals ({withdrawals.filter(w => w.status === 'Pending').length})
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'announcements' ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-500/20' : 'bg-[#202020] text-zinc-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-bullhorn mr-1.5"></i> Announcements
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'stats' ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-500/20' : 'bg-[#202020] text-zinc-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-chart-pie mr-1.5"></i> Ad Analytics
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 bg-[#101010]">
          {activeTab === 'ads' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Slot Selector Sidebar */}
              <div className="bg-[#151515] border border-[#292929] rounded-xl p-3 flex flex-col gap-1.5 max-h-[500px] overflow-y-auto">
                <div className="text-xs font-bold text-cyan-400 px-2 py-1 uppercase tracking-wider">Required Ad Slots</div>
                {Object.values(adSlots).map((slot: any) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                      selectedSlotId === slot.id
                        ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
                        : 'bg-[#1f1f1f] text-zinc-300 hover:bg-[#252525]'
                    }`}
                  >
                    <span className="truncate">{slot.name}</span>
                    <span className={`w-2 h-2 rounded-full ${slot.enabled ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-zinc-600'}`}></span>
                  </button>
                ))}
              </div>

              {/* Slot Editor Form */}
              <div className="md:col-span-2 bg-[#151515] border border-[#292929] rounded-xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[#292929] pb-3">
                  <div>
                    <h3 className="font-['Space_Grotesk'] text-base font-bold m-0 text-cyan-400">{currentSlot.name}</h3>
                    <p className="text-xs text-zinc-400 m-0">Page: {currentSlot.page} · Placement: {currentSlot.placement}</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs font-bold text-zinc-300">Enable Slot</span>
                    <input
                      type="checkbox"
                      checked={currentSlot.enabled}
                      onChange={(e) => onUpdateAdSlot(selectedSlotId, { enabled: e.target.checked })}
                      className="w-5 h-5 accent-cyan-400 rounded cursor-pointer"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Ad Network / Type</label>
                    <select
                      value={currentSlot.adType}
                      onChange={(e) => onUpdateAdSlot(selectedSlotId, { adType: e.target.value as AdType })}
                      className="w-full bg-[#202020] border border-[#303030] text-white rounded-xl p-2.5 text-xs outline-none focus:border-cyan-400"
                    >
                      <option value="banner">Banner Ad (320x50)</option>
                      <option value="native">Native Ad (300x250)</option>
                      <option value="responsive">Responsive Ad</option>
                      <option value="html">HTML Ad Snippet</option>
                      <option value="custom_js">Custom JavaScript Ad</option>
                      <option value="rewarded">Rewarded Video Ad</option>
                      <option value="adsterra">Adsterra Direct Link / Script</option>
                      <option value="monetag">Monetag Popunder / Tag</option>
                      <option value="adsense">Google AdSense</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Dimensions</label>
                    <input
                      type="text"
                      value={currentSlot.dimensions}
                      onChange={(e) => onUpdateAdSlot(selectedSlotId, { dimensions: e.target.value })}
                      className="w-full bg-[#202020] border border-[#303030] text-white rounded-xl p-2.5 text-xs outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentSlot.desktopVisible}
                        onChange={(e) => onUpdateAdSlot(selectedSlotId, { desktopVisible: e.target.checked })}
                        className="accent-cyan-400 w-4 h-4"
                      />
                      <span className="text-xs text-zinc-300">Desktop Visible</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentSlot.mobileVisible}
                        onChange={(e) => onUpdateAdSlot(selectedSlotId, { mobileVisible: e.target.checked })}
                        className="accent-cyan-400 w-4 h-4"
                      />
                      <span className="text-xs text-zinc-300">Mobile Visible</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">Priority (1-100)</label>
                    <input
                      type="number"
                      value={currentSlot.priority}
                      onChange={(e) => onUpdateAdSlot(selectedSlotId, { priority: Number(e.target.value) })}
                      className="w-full bg-[#202020] border border-[#303030] text-white rounded-xl p-2.5 text-xs outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Advertising Code (HTML / JavaScript / Adsterra / Monetag / AdSense snippet)
                  </label>
                  <textarea
                    rows={5}
                    value={currentSlot.adCode}
                    onChange={(e) => onUpdateAdSlot(selectedSlotId, { adCode: e.target.value })}
                    placeholder="Paste banner iframe, HTML script, or Adsterra/Monetag tag here..."
                    className="w-full bg-[#1c1c1c] border border-[#303030] text-cyan-300 font-mono rounded-xl p-3 text-xs outline-none focus:border-cyan-400"
                  ></textarea>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Security notice: Untrusted ad scripts are safely isolated inside client slots and never executed within this privileged admin panel.
                  </p>
                </div>

                <div className="bg-[#1e1e1e] border border-[#2c2c2c] rounded-xl p-3 flex justify-around text-center">
                  <div>
                    <div className="text-[10px] text-zinc-400">Impressions</div>
                    <div className="text-sm font-bold text-white">{currentSlot.stats?.impressions || 0}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-400">Clicks</div>
                    <div className="text-sm font-bold text-cyan-400">{currentSlot.stats?.clicks || 0}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-400">Est. Earnings</div>
                    <div className="text-sm font-bold text-emerald-400">${(currentSlot.stats?.earnings || 0).toFixed(4)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <div className="bg-[#151515] border border-[#292929] rounded-xl p-4">
                <h3 className="font-['Space_Grotesk'] text-sm font-bold mb-3 text-cyan-400">Create New Task</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Task Title (e.g., Join Telegram Channel)"
                    className="bg-[#202020] border border-[#303030] rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  />
                  <input
                    type="number"
                    value={newTaskReward}
                    onChange={(e) => setNewTaskReward(e.target.value)}
                    placeholder="Reward NI Points"
                    className="bg-[#202020] border border-[#303030] rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder="Description"
                    className="bg-[#202020] border border-[#303030] rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    value={newTaskLink}
                    onChange={(e) => setNewTaskLink(e.target.value)}
                    placeholder="Task Link URL"
                    className="bg-[#202020] border border-[#303030] rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!newTaskTitle.trim()) return;
                    onAddTask({
                      id: 'task_' + Date.now(),
                      category: 'telegram',
                      title: newTaskTitle,
                      description: newTaskDesc || 'Complete task to earn reward',
                      reward: Number(newTaskReward) || 25,
                      link: newTaskLink || 'https://t.me',
                      instructions: 'Complete activity and claim reward.',
                      status: 'available'
                    });
                    setNewTaskTitle('');
                    setNewTaskDesc('');
                  }}
                  className="bg-cyan-400 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-cyan-300 transition"
                >
                  <i className="fa-solid fa-plus mr-1"></i> Add Task
                </button>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-zinc-400">Existing Tasks ({tasks.length})</div>
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-[#151515] border border-[#292929] rounded-xl">
                    <div>
                      <strong className="text-xs block text-white">{task.title}</strong>
                      <span className="text-[10px] text-zinc-400">{task.description} · Reward: +{task.reward} NI</span>
                    </div>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/20 transition"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'withdrawals' && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-zinc-400">Withdrawal Requests ({withdrawals.length})</div>
              {withdrawals.length === 0 ? (
                <div className="text-center py-10 text-zinc-500 text-xs">No withdrawal requests found.</div>
              ) : (
                withdrawals.map((w) => (
                  <div key={w.id} className="p-4 bg-[#151515] border border-[#292929] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm text-cyan-400">{w.amount.toFixed(2)} USDT</strong>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#202020] text-zinc-300">{w.network}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          w.status === 'Completed' || w.status === 'Approved' ? 'bg-emerald-500/15 text-emerald-400' :
                          w.status === 'Rejected' ? 'bg-red-500/15 text-red-400' : 'bg-yellow-500/15 text-yellow-400'
                        }`}>{w.status}</span>
                      </div>
                      <div className="text-xs text-zinc-400 mt-1 font-mono break-all">Address: {w.address}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{w.date}</div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => onUpdateWithdrawal(w.id, 'Approved')}
                        className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-xl text-xs font-bold hover:bg-emerald-500/30 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onUpdateWithdrawal(w.id, 'Rejected')}
                        className="flex-1 sm:flex-none px-3 py-1.5 bg-red-500/20 border border-red-500/40 text-red-400 rounded-xl text-xs font-bold hover:bg-red-500/30 transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className="bg-[#151515] border border-[#292929] rounded-xl p-4">
                <h3 className="font-['Space_Grotesk'] text-sm font-bold mb-3 text-cyan-400">Post Announcement</h3>
                <input
                  type="text"
                  value={newAnnouncementTitle}
                  onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                  placeholder="Announcement Title"
                  className="w-full bg-[#202020] border border-[#303030] rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400 mb-3"
                />
                <textarea
                  rows={3}
                  value={newAnnouncementContent}
                  onChange={(e) => setNewAnnouncementContent(e.target.value)}
                  placeholder="Announcement Content..."
                  className="w-full bg-[#202020] border border-[#303030] rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-400 mb-3"
                ></textarea>
                <button
                  onClick={() => {
                    if (!newAnnouncementTitle.trim()) return;
                    onAddAnnouncement({
                      id: Date.now(),
                      title: newAnnouncementTitle,
                      content: newAnnouncementContent,
                      date: new Date().toLocaleDateString()
                    });
                    setNewAnnouncementTitle('');
                    setNewAnnouncementContent('');
                  }}
                  className="bg-cyan-400 text-black px-4 py-2 rounded-xl text-xs font-bold hover:bg-cyan-300 transition"
                >
                  <i className="fa-solid fa-bullhorn mr-1"></i> Publish Announcement
                </button>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-zinc-400">Recent Announcements</div>
                {announcements.map((a) => (
                  <div key={a.id} className="p-3 bg-[#151515] border border-[#292929] rounded-xl">
                    <strong className="text-xs block text-white">{a.title}</strong>
                    <p className="text-[11px] text-zinc-300 mt-1">{a.content}</p>
                    <small className="text-[10px] text-zinc-500 mt-1 block">{a.date}</small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-[#151515] border border-[#292929] rounded-xl text-center">
                  <div className="text-xs text-zinc-400">Total Ad Impressions</div>
                  <div className="text-2xl font-bold font-['Space_Grotesk'] text-cyan-400 mt-1">
                    {Object.values(adSlots).reduce((acc: number, s: any) => acc + (s.stats?.impressions || 0), 0).toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-[#151515] border border-[#292929] rounded-xl text-center">
                  <div className="text-xs text-zinc-400">Total Ad Clicks</div>
                  <div className="text-2xl font-bold font-['Space_Grotesk'] text-white mt-1">
                    {Object.values(adSlots).reduce((acc: number, s: any) => acc + (s.stats?.clicks || 0), 0).toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-[#151515] border border-[#292929] rounded-xl text-center">
                  <div className="text-xs text-zinc-400">Total Ad Revenue</div>
                  <div className="text-2xl font-bold font-['Space_Grotesk'] text-emerald-400 mt-1">
                    ${Object.values(adSlots).reduce((acc: number, s: any) => acc + (s.stats?.earnings || 0), 0).toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-[#151515] border border-[#292929] rounded-xl">
                <h4 className="font-['Space_Grotesk'] text-sm font-bold mb-3 text-cyan-400">Ad Network Integration Status</h4>
                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex justify-between items-center p-2 bg-[#1f1f1f] rounded-lg">
                    <span>Adsterra Direct Links & Banners</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">Configured</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-[#1f1f1f] rounded-lg">
                    <span>Monetag Popunders & In-Page Push</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">Configured</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-[#1f1f1f] rounded-lg">
                    <span>Google AdSense (Eligible Slots)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-yellow-500/20 text-yellow-400 font-bold">Ready</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
