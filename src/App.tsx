import React, { useState, useEffect } from 'react';
import { Topbar } from './components/Topbar';
import { Navbar } from './components/Navbar';
import { AdSlot } from './components/AdSlot';
import { HomePage } from './pages/HomePage';
import { CheckinPage } from './pages/CheckinPage';
import { SpinPage } from './pages/SpinPage';
import { TaskPage } from './pages/TaskPage';
import { EarnPage } from './pages/EarnPage';
import { WalletPage } from './pages/WalletPage';
import { ReferralPage } from './pages/ReferralPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { AppState, TaskItem, WithdrawalRequest, ExchangeRequest, Announcement } from './types';
import { defaultAdSlots, initialTasks, initialAnnouncements } from './data/initialData';

const STORAGE_KEY = 'adGateHubDemo_v2';

const defaultState: AppState = {
  ni: 1040,
  usdt: 2450.00,
  transactions: [
    { id: 1, type: 'Welcome Bonus', amount: 1040, unit: 'NI', detail: 'Welcome reward points', date: new Date().toLocaleString() }
  ],
  withdrawals: [
    { id: 301, network: 'TRC20', address: 'TYDzsYUEpvnYmQK4W5gtZf94d1aX', amount: 10.0, status: 'Completed', date: new Date(Date.now() - 86400000).toLocaleString() }
  ],
  exchangeRequests: [
    { id: 201, fromAmount: 5000, toAmount: 5.0, rate: '1,000 NI = 1 USDT', status: 'Completed', date: new Date(Date.now() - 43200000).toLocaleString() }
  ],
  claimedCheckin: '',
  lastSpin: '',
  dailySpinDate: '',
  dailySpinCount: 0,
  maxDailySpins: 10,
  tasks: {},
  customTasks: initialTasks,
  videoClaims: 0,
  referrals: [
    { id: 101, name: 'Alex Johnson', date: '2026-11-01', earnings: 50 },
    { id: 102, name: 'Sarah Miller', date: '2026-11-04', earnings: 50 }
  ],
  createdAt: new Date().toISOString(),
  theme: 'dark',
  streak: 3,
  announcements: initialAnnouncements,
  adSlots: defaultAdSlots,
  adminPin: '1234',
  googleAccount: {
    isBound: false,
    email: '',
    name: '',
    picture: '',
    boundAt: ''
  }
};

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatically upgrade low demo balance so main USDT balance combines seamlessly with the 2,450.00 USD baseline
        const upgradedUsdt = (parsed.usdt !== undefined && parsed.usdt < 100)
          ? 2450.00 + parsed.usdt
          : (parsed.usdt ?? 2450.00);

        return {
          ...defaultState,
          ...parsed,
          usdt: upgradedUsdt,
          ni: parsed.ni < 500 ? 1040 : parsed.ni,
          adSlots: { ...defaultAdSlots, ...(parsed.adSlots || {}) }
        };
      }
    } catch (e) {
      console.error('Failed to load state:', e);
    }
    return defaultState;
  });

  const [currentPage, setCurrentPage] = useState<string>('home');
  const [walletTab, setWalletTab] = useState<'exchange' | 'withdraw'>('exchange');
  const [modalData, setModalData] = useState<{ title: string; content: string } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }, [state]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const addTx = (type: string, amount: number, unit: string, detail: string) => {
    setState((prev) => ({
      ...prev,
      transactions: [
        { id: Date.now() + Math.random(), type, amount, unit, detail, date: new Date().toLocaleString() },
        ...prev.transactions
      ].slice(0, 150)
    }));
  };

  const handleNavigate = (page: string, subTab?: 'exchange' | 'withdraw') => {
    if (page === 'video') page = 'earn';
    if (page === 'withdraw' || subTab === 'withdraw') {
      setWalletTab('withdraw');
      setCurrentPage('wallet');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (page === 'exchange' || subTab === 'exchange') {
      setWalletTab('exchange');
      setCurrentPage('wallet');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (subTab) {
      setWalletTab(subTab);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const todayStr = () => new Date().toISOString().slice(0, 10);

  // Check-in handler
  const handleClaimCheckin = () => {
    if (state.claimedCheckin === todayStr()) {
      showToast('Already claimed today!');
      return;
    }
    setState((prev) => ({
      ...prev,
      claimedCheckin: todayStr(),
      streak: prev.streak + 1,
      ni: prev.ni + 20
    }));
    addTx('Daily check-in', 20, 'NI', 'Daily attendance reward');
    showToast('Successfully claimed +20 NI Points!');
  };

  // Spin handler (10 daily spins limit)
  const handleSpinReward = (reward: number) => {
    const today = todayStr();
    const count = (state.dailySpinDate === today ? (state.dailySpinCount || 0) : 0) + 1;
    const maxSpins = state.maxDailySpins || 10;
    const remaining = Math.max(0, maxSpins - count);

    setState((prev) => ({
      ...prev,
      lastSpin: today,
      dailySpinDate: today,
      dailySpinCount: count,
      ni: prev.ni + reward
    }));
    addTx('Lucky Spin', reward, 'NI', `Lucky Spin reward #${count} (+${reward} NI)`);
    setModalData({
      title: 'Lucky Spin Result! 🎉',
      content: `Congratulations! You won +${reward} NI Points! You have ${remaining} of ${maxSpins} spins remaining today.`
    });
  };

  // Task claim handler
  const handleClaimTask = (taskId: string) => {
    const status = state.tasks[taskId] || 'available';
    const task = state.customTasks.find((t) => t.id === taskId);
    if (!task) return;

    if (status === 'available') {
      setState((prev) => ({
        ...prev,
        tasks: { ...prev.tasks, [taskId]: 'joined' }
      }));
      setModalData({
        title: task.title,
        content: `You joined this task! In this demo, tap below to confirm verified completion and claim your reward.`
      });
    } else if (status === 'joined') {
      setState((prev) => ({
        ...prev,
        tasks: { ...prev.tasks, [taskId]: 'claimed' },
        ni: prev.ni + task.reward
      }));
      addTx('Task reward', task.reward, 'NI', task.title);
      showToast(`Claimed +${task.reward} NI Points!`);
    }
  };

  // Video Ad earn handler
  const handleEarnVideo = () => {
    setState((prev) => ({
      ...prev,
      videoClaims: prev.videoClaims + 1,
      ni: prev.ni + 10
    }));
    addTx('Video reward', 10, 'NI', 'Rewarded video ad session');
    showToast('Video reward +10 NI Points credited!');
  };

  // Exchange handler
  const handleExchange = (niAmount: number) => {
    const usdtVal = niAmount / 1000;
    const newEx: ExchangeRequest = {
      id: Date.now(),
      fromAmount: niAmount,
      toAmount: usdtVal,
      rate: '1,000 NI = 1 USDT',
      status: 'Completed',
      date: new Date().toLocaleString()
    };
    setState((prev) => ({
      ...prev,
      ni: prev.ni - niAmount,
      usdt: prev.usdt + usdtVal,
      exchangeRequests: [newEx, ...(prev.exchangeRequests || [])]
    }));
    addTx('Exchange', usdtVal, 'USDT', `${niAmount} NI exchanged`);
    addTx('Exchange', -niAmount, 'NI', 'Points converted to USDT');
    showToast(`Successfully exchanged ${niAmount} NI for ${usdtVal.toFixed(4)} USDT!`);
  };

  // Withdraw handler
  const handleWithdraw = (network: string, address: string, amount: number) => {
    const newReq: WithdrawalRequest = {
      id: Date.now(),
      network,
      address,
      amount,
      status: 'Pending',
      date: new Date().toLocaleString()
    };
    setState((prev) => ({
      ...prev,
      usdt: prev.usdt - amount,
      withdrawals: [newReq, ...prev.withdrawals]
    }));
    addTx('Withdrawal request', -amount, 'USDT', `Pending · ${network} · ${address.slice(0, 8)}...`);
    showToast('Withdrawal request submitted successfully!');
  };

  // Admin slot update
  const handleUpdateAdSlot = (slotId: string, updated: any) => {
    setState((prev) => ({
      ...prev,
      adSlots: {
        ...prev.adSlots,
        [slotId]: {
          ...(prev.adSlots[slotId as keyof typeof prev.adSlots] || {}),
          ...updated
        }
      }
    }));
  };

  // Admin task handlers
  const handleAddTask = (task: TaskItem) => {
    setState((prev) => ({
      ...prev,
      customTasks: [task, ...prev.customTasks]
    }));
    showToast('New task created successfully.');
  };

  const handleDeleteTask = (taskId: string) => {
    setState((prev) => ({
      ...prev,
      customTasks: prev.customTasks.filter((t) => t.id !== taskId)
    }));
    showToast('Task removed.');
  };

  // Admin withdrawal update
  const handleUpdateWithdrawal = (id: string | number, status: 'Approved' | 'Rejected' | 'Processing' | 'Completed') => {
    setState((prev) => ({
      ...prev,
      withdrawals: prev.withdrawals.map((w) => (w.id === id ? { ...w, status } : w))
    }));
    showToast(`Withdrawal status updated to ${status}`);
  };

  // Admin announcement add
  const handleAddAnnouncement = (ann: Announcement) => {
    setState((prev) => ({
      ...prev,
      announcements: [ann, ...prev.announcements]
    }));
    showToast('Announcement published.');
  };

  // Google Account Binding Handlers
  const handleBindGoogle = (email: string, name: string, picture: string, googleId?: string, telegramUserId?: string): boolean => {
    try {
      const boundAccountsJson = localStorage.getItem('adGateHub_bound_google_ids');
      const boundMap: Record<string, string> = boundAccountsJson ? JSON.parse(boundAccountsJson) : {};

      if (googleId && boundMap[googleId] && boundMap[googleId] !== (telegramUserId || 'demo_user')) {
        showToast('Error: This Google Account is already linked to another Telegram User ID!');
        return false;
      }

      if (googleId) {
        boundMap[googleId] = telegramUserId || 'demo_user';
        localStorage.setItem('adGateHub_bound_google_ids', JSON.stringify(boundMap));
      }
    } catch (e) {
      console.error('Bound account check error:', e);
    }

    setState((prev) => ({
      ...prev,
      googleAccount: {
        isBound: true,
        email,
        name,
        picture,
        googleId,
        telegramUserId,
        boundAt: new Date().toLocaleDateString()
      },
      ni: prev.ni + 50
    }));
    addTx('Account Bind', 50, 'NI', `Google account linked (${email})`);
    showToast('Google account linked! +50 NI Points added');
    return true;
  };

  const handleUnbindGoogle = () => {
    if (state.googleAccount?.googleId) {
      try {
        const boundAccountsJson = localStorage.getItem('adGateHub_bound_google_ids');
        const boundMap: Record<string, string> = boundAccountsJson ? JSON.parse(boundAccountsJson) : {};
        delete boundMap[state.googleAccount.googleId];
        localStorage.setItem('adGateHub_bound_google_ids', JSON.stringify(boundMap));
      } catch (e) {
        console.error('Unbind error:', e);
      }
    }

    setState((prev) => ({
      ...prev,
      googleAccount: {
        isBound: false,
        email: '',
        name: '',
        picture: '',
        googleId: '',
        telegramUserId: '',
        boundAt: ''
      }
    }));
    showToast('Google account unlinked.');
  };

  // External Admin Connection Bridge:
  // Connects with external admin panel dashboard via window / API
  useEffect(() => {
    (window as any).AdGateHub = {
      getState: () => state,
      updateAdSlot: handleUpdateAdSlot,
      applyAdConfig: (slotsConfig: any) => {
        setState((prev) => ({
          ...prev,
          adSlots: { ...prev.adSlots, ...slotsConfig }
        }));
      },
      addTask: handleAddTask,
      deleteTask: handleDeleteTask,
      updateWithdrawal: handleUpdateWithdrawal,
      addAnnouncement: handleAddAnnouncement
    };
  }, [state]);

  const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user || null;
  const userName = tgUser ? tgUser.first_name : '';
  const userId = tgUser ? tgUser.id : 'demo_user';

  return (
    <div className="max-w-[540px] min-h-screen mx-auto bg-[#090909] text-[#f5f5f5] pb-[108px] font-['DM_Sans',sans-serif] selection:bg-cyan-500 selection:text-black">
      <div className="p-4 sm:p-5">
        <Topbar
          onOpenSupport={() =>
            setModalData({
              title: 'Support & Help',
              content: 'Need assistance with Ad Gate Hub? Contact our support team via Telegram @AdGateHubSupport or read our FAQ docs.'
            })
          }
          onOpenNotifications={() => {
            const latest = state.announcements[0];
            setModalData({
              title: latest?.title || 'Notifications',
              content: latest?.content || 'You are all caught up with announcements!'
            });
          }}
          adSlots={state.adSlots}
        />

        <main className="mt-4">
          {currentPage === 'home' && (
            <HomePage state={state} onNavigate={handleNavigate} adSlots={state.adSlots} userName={userName} />
          )}
          {currentPage === 'checkin' && (
            <CheckinPage
              claimedCheckin={state.claimedCheckin}
              streak={state.streak}
              onClaimCheckin={handleClaimCheckin}
              onNavigate={handleNavigate}
              adSlots={state.adSlots}
            />
          )}
          {currentPage === 'spin' && (
            <SpinPage
              dailySpinCount={state.dailySpinDate === todayStr() ? (state.dailySpinCount || 0) : 0}
              dailySpinDate={state.dailySpinDate || ''}
              maxDailySpins={state.maxDailySpins || 10}
              onSpinReward={handleSpinReward}
              onNavigate={handleNavigate}
              adSlots={state.adSlots}
            />
          )}
          {currentPage === 'task' && (
            <TaskPage
              tasks={state.customTasks}
              taskStates={state.tasks}
              onClaimTask={handleClaimTask}
              adSlots={state.adSlots}
            />
          )}
          {currentPage === 'earn' && (
            <EarnPage onEarnVideo={handleEarnVideo} transactions={state.transactions} adSlots={state.adSlots} />
          )}
          {currentPage === 'wallet' && (
            <WalletPage
              ni={state.ni}
              usdt={state.usdt}
              initialTab={walletTab}
              onExchange={handleExchange}
              onWithdraw={handleWithdraw}
              transactions={state.transactions}
              withdrawals={state.withdrawals}
              exchangeRequests={state.exchangeRequests || []}
              adSlots={state.adSlots}
            />
          )}
          {currentPage === 'referral' && (
            <ReferralPage referrals={state.referrals} userId={userId} adSlots={state.adSlots} />
          )}
          {currentPage === 'history' && <HistoryPage transactions={state.transactions} adSlots={state.adSlots} />}
          {currentPage === 'profile' && (
            <ProfilePage
              createdAt={state.createdAt}
              googleAccount={state.googleAccount}
              onBindGoogle={handleBindGoogle}
              onUnbindGoogle={handleUnbindGoogle}
              onResetDemo={() => {
                if (window.confirm('Reset all demo data on this device?')) {
                  localStorage.removeItem(STORAGE_KEY);
                  setState(defaultState);
                  showToast('Demo data reset.');
                }
              }}
              adSlots={state.adSlots}
            />
          )}
        </main>
      </div>

      <Navbar currentPage={currentPage} onNavigate={handleNavigate} adSlots={state.adSlots} />

      {/* Global Sticky Banner Ad Slot */}
      <div className="fixed bottom-[74px] left-1/2 -translate-x-1/2 w-[min(540px,100%)] px-3 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <AdSlot slotId="sticky_banner" adSlots={state.adSlots} />
        </div>
      </div>

      {/* Modal Dialog */}
      {modalData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#151515] border border-[#303030] rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white m-0">{modalData.title}</h3>
              <button
                onClick={() => setModalData(null)}
                className="w-8 h-8 rounded-full bg-[#262626] text-zinc-300 hover:text-white flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed mb-5">{modalData.content}</p>
            <button
              onClick={() => {
                // If modal is for task completion confirmation
                setModalData(null);
              }}
              className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-xl font-extrabold text-xs shadow-lg shadow-cyan-500/20"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed z-50 bottom-24 left-1/2 -translate-x-1/2 bg-cyan-400 text-black px-4 py-2.5 rounded-full text-xs font-bold shadow-xl shadow-cyan-500/30 animate-in fade-in slide-in-from-bottom-3 max-w-[90vw] truncate">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
