import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { AdSlot } from '../components/AdSlot';
import { Transaction, WithdrawalRequest, ExchangeRequest } from '../types';
import cryptoSwapIcon from '../assets/images/crypto_swap_icon_1794218956586.jpg';

interface WalletPageProps {
  ni: number;
  usdt: number;
  initialTab?: 'exchange' | 'withdraw';
  onExchange: (niAmount: number) => void;
  onWithdraw: (network: string, address: string, amount: number) => void;
  transactions: Transaction[];
  withdrawals: WithdrawalRequest[];
  exchangeRequests?: ExchangeRequest[];
  adSlots: Record<string, any>;
}

export const WalletPage: React.FC<WalletPageProps> = ({
  ni,
  usdt,
  initialTab,
  onExchange,
  onWithdraw,
  transactions,
  withdrawals,
  exchangeRequests = [],
  adSlots
}) => {
  const [activeTab, setActiveTab] = useState<'exchange' | 'withdraw'>(initialTab || 'exchange');
  const [historyTab, setHistoryTab] = useState<'withdrawals' | 'exchanges'>(
    (initialTab || 'exchange') === 'withdraw' ? 'withdrawals' : 'exchanges'
  );

  // Synchronize when initialTab changes (e.g. user navigates from Home clicking Withdraw or Exchange)
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
      setHistoryTab(initialTab === 'withdraw' ? 'withdrawals' : 'exchanges');
    }
  }, [initialTab]);

  const handleSelectTab = (tab: 'exchange' | 'withdraw') => {
    setActiveTab(tab);
    setHistoryTab(tab === 'withdraw' ? 'withdrawals' : 'exchanges');
  };
  const [exchangeNi, setExchangeNi] = useState('');
  const [network, setNetwork] = useState('TRC20');
  const [address, setAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isExchanging, setIsExchanging] = useState(false);
  const [floatingBonus, setFloatingBonus] = useState<string | null>(null);

  const niCardRef = useRef<HTMLDivElement>(null);
  const usdtCardRef = useRef<HTMLDivElement>(null);
  const exchangeBtnRef = useRef<HTMLButtonElement>(null);
  const animContainerRef = useRef<HTMLDivElement>(null);
  const floatingBadgeRef = useRef<HTMLDivElement>(null);

  const exchangeVal = Number(exchangeNi) || 0;
  const convertedUsdt = exchangeVal / 1000;

  // Max selectable NI in increments of 1000
  const maxExchangeableNi = Math.floor(ni / 1000) * 1000;

  const triggerExchangeAnimation = (points: number, usdtValue: number) => {
    setIsExchanging(true);

    const niCard = niCardRef.current;
    const usdtCard = usdtCardRef.current;
    const btn = exchangeBtnRef.current;
    const container = animContainerRef.current;

    if (!container || !niCard || !usdtCard) {
      onExchange(points);
      setIsExchanging(false);
      setExchangeNi('');
      return;
    }

    const niRect = niCard.getBoundingClientRect();
    const usdtRect = usdtCard.getBoundingClientRect();
    const btnRect = btn ? btn.getBoundingClientRect() : niRect;

    const startX = btnRect.left + btnRect.width / 2;
    const startY = btnRect.top + btnRect.height / 2;

    const niCenterX = niRect.left + niRect.width / 2;
    const niCenterY = niRect.top + niRect.height / 2;

    const usdtCenterX = usdtRect.left + usdtRect.width / 2;
    const usdtCenterY = usdtRect.top + usdtRect.height / 2;

    // Master GSAP timeline
    const tl = gsap.timeline({
      onComplete: () => {
        setIsExchanging(false);
        setExchangeNi('');
      }
    });

    // 1. Exchange button press punch
    if (btn) {
      tl.to(btn, {
        scale: 0.94,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    }

    // 2. NI card reaction: contraction & cyan glow pulse
    tl.to(
      niCard,
      {
        scale: 0.95,
        borderColor: '#00F0FF',
        boxShadow: '0 0 25px rgba(0, 240, 255, 0.4)',
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out'
      },
      '-=0.05'
    );

    // 3. Create flying token particles
    const particleCount = 12;
    const particles: HTMLElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className =
        'fixed pointer-events-none z-50 flex items-center justify-center rounded-full text-cyan-300 font-bold';
      p.style.width = '24px';
      p.style.height = '24px';
      p.style.background = 'radial-gradient(circle, #00F0FF 0%, #0066FF 100%)';
      p.style.boxShadow = '0 0 12px #00F0FF, 0 0 20px rgba(0, 240, 255, 0.5)';
      p.style.border = '1.5px solid #E0FFFF';
      p.style.left = `${niCenterX}px`;
      p.style.top = `${niCenterY}px`;
      p.style.transform = 'translate(-50%, -50%) scale(0)';
      p.innerHTML = '<i class="fa-solid fa-coins text-[11px] text-black"></i>';

      container.appendChild(p);
      particles.push(p);
    }

    // Animate particles burst from NI Card and arc smoothly towards USDT Card
    particles.forEach((p, index) => {
      const spreadX = (Math.random() - 0.5) * 60;
      const spreadY = (Math.random() - 0.5) * 40 - 20;
      const delay = index * 0.04;

      tl.to(
        p,
        {
          scale: 1 + Math.random() * 0.3,
          x: spreadX,
          y: spreadY,
          rotation: (Math.random() - 0.5) * 180,
          duration: 0.25,
          ease: 'back.out(2)'
        },
        0.2 + delay
      );

      tl.to(
        p,
        {
          x: usdtCenterX - niCenterX + (Math.random() - 0.5) * 20,
          y: usdtCenterY - niCenterY + (Math.random() - 0.5) * 20,
          rotation: (Math.random() - 0.5) * 360,
          scale: 0.5,
          opacity: 0.9,
          duration: 0.55,
          ease: 'power3.in',
          onComplete: () => {
            gsap.to(usdtCard, {
              scale: 1.03,
              duration: 0.08,
              yoyo: true,
              repeat: 1,
              ease: 'power1.out'
            });
            p.remove();
          }
        },
        0.45 + delay
      );
    });

    // 4. Climax when particles finish arriving
    const impactTime = 0.45 + particleCount * 0.04 + 0.35;

    tl.call(
      () => {
        onExchange(points);
        setFloatingBonus(`+${usdtValue.toFixed(4)} USDT`);
      },
      [],
      impactTime
    );

    // USDT card big explosion & gold/cyan glow
    tl.to(
      usdtCard,
      {
        scale: 1.07,
        borderColor: '#00F0FF',
        boxShadow: '0 0 35px rgba(0, 240, 255, 0.7), inset 0 0 20px rgba(0, 240, 255, 0.2)',
        duration: 0.25,
        ease: 'power2.out'
      },
      impactTime
    );

    tl.to(
      usdtCard,
      {
        scale: 1,
        borderColor: '#303030',
        boxShadow: '0 8px 28px rgba(0, 0, 0, 0.28)',
        duration: 0.4,
        ease: 'power2.inOut'
      },
      impactTime + 0.3
    );

    // 5. Floating "+X.XXXX USDT" badge animation
    tl.call(
      () => {
        if (floatingBadgeRef.current) {
          gsap.fromTo(
            floatingBadgeRef.current,
            { opacity: 0, y: 10, scale: 0.7 },
            {
              opacity: 1,
              y: -30,
              scale: 1.1,
              duration: 0.4,
              ease: 'back.out(1.7)',
              onComplete: () => {
                gsap.to(floatingBadgeRef.current, {
                  opacity: 0,
                  y: -50,
                  duration: 0.4,
                  delay: 0.8,
                  ease: 'power2.in',
                  onComplete: () => setFloatingBonus(null)
                });
              }
            }
          );
        }
      },
      [],
      impactTime + 0.05
    );
  };

  const handleExchangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isExchanging) return;

    if (exchangeVal < 1000 || exchangeVal % 1000 !== 0) {
      alert('Enter at least 1,000 NI in 1,000-point increments.');
      return;
    }
    if (exchangeVal > ni) {
      alert('Insufficient NI Points balance.');
      return;
    }

    triggerExchangeAnimation(exchangeVal, convertedUsdt);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(withdrawAmount);
    if (!network || address.trim().length < 8 || amt < 5) {
      alert('Please check network, enter a valid address (min 8 chars), and minimum 5 USDT.');
      return;
    }
    if (amt > usdt) {
      alert('Insufficient USDT balance.');
      return;
    }
    onWithdraw(network, address.trim(), amt);
    setAddress('');
    setWithdrawAmount('');
  };

  const isCryptoNetwork = network.startsWith('TRC') || network.startsWith('BEP') || network.startsWith('ERC');
  const withdrawAmtNum = Number(withdrawAmount) || 0;

  return (
    <div className="space-y-4 relative">
      {/* Container for GSAP flying token particles */}
      <div ref={animContainerRef} className="pointer-events-none fixed inset-0 z-50 overflow-hidden" />

      <div className="mb-2">
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400">YOUR FUNDS</div>
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-white mt-1 mb-1">Wallet & Funds</h1>
        <p className="text-xs text-zinc-400 m-0">Swap earned NI Points for USDT and manage secure payouts.</p>
      </div>

      {/* Required Ad Slot: Wallet Top Ad */}
      <AdSlot slotId="wallet_top_ad" adSlots={adSlots} />

      {/* Balances Overview Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* NI Points Card */}
        <div
          ref={niCardRef}
          className="bg-[#151515] border border-cyan-500/30 rounded-2xl p-4 bg-gradient-to-br from-[#151515] to-[#1a2327] shadow-[0_8px_25px_rgba(0,240,255,0.1)] transition-transform duration-200"
        >
          <div className="text-xs text-cyan-400 flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-coins"></i> NI Points
            </span>
            <span className="text-[10px] text-zinc-400 font-normal">Reward</span>
          </div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-white my-2 break-all">
            {Math.floor(ni).toLocaleString()}
          </div>
          <div className="text-[10px] text-zinc-400">Available to swap</div>
        </div>

        {/* Master USDT Card */}
        <div
          ref={usdtCardRef}
          className="relative bg-[#151515] border border-[#303030] rounded-2xl p-4 shadow-lg transition-transform duration-200"
        >
          {floatingBonus && (
            <div
              ref={floatingBadgeRef}
              className="absolute -top-3 right-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-lg shadow-cyan-500/30 whitespace-nowrap z-30 pointer-events-none"
            >
              {floatingBonus}
            </div>
          )}
          <div className="text-xs text-zinc-400 flex items-center justify-between font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <i className="fa-solid fa-dollar-sign"></i> Master USDT
            </span>
            <span className="text-[10px] text-zinc-400 font-normal">Withdrawable</span>
          </div>
          <div className="font-['Space_Grotesk'] text-2xl font-bold text-white my-2 break-all">
            {Number(usdt || 0).toFixed(2)}
          </div>
          <div className="text-[10px] text-zinc-400">Payout balance</div>
        </div>
      </div>

      {/* Top Tab / Toggle Switch (Exchange vs Withdraw) */}
      <div className="p-1 bg-[#151515] border border-[#2a2a2a] rounded-2xl flex items-center shadow-lg">
        <button
          onClick={() => handleSelectTab('exchange')}
          className={`flex-1 py-2.5 rounded-xl font-['Space_Grotesk'] text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
            activeTab === 'exchange'
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md shadow-cyan-500/25 scale-[1.01]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-arrow-right-arrow-left"></i>
          <span>Exchange (Swap)</span>
        </button>
        <button
          onClick={() => handleSelectTab('withdraw')}
          className={`flex-1 py-2.5 rounded-xl font-['Space_Grotesk'] text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
            activeTab === 'withdraw'
              ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md shadow-cyan-500/25 scale-[1.01]'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <i className="fa-solid fa-arrow-up-from-bracket"></i>
          <span>Withdraw USDT</span>
        </button>
      </div>

      {/* Tab 1: Crypto Swap Interface for Exchange */}
      {activeTab === 'exchange' && (
        <div className="bg-[#151515] border border-cyan-500/25 rounded-3xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute -right-16 -top-16 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.35)] flex-shrink-0 bg-[#090d10] p-0.5">
                <img src={cryptoSwapIcon} alt="Swap Icon" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div>
                <h2 className="font-['Space_Grotesk'] text-base font-bold text-white m-0">
                  Instant Points Swap
                </h2>
                <p className="text-[11px] text-zinc-400 mt-0.5 mb-0">Convert your reward points to Master USDT instantly</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[10px] font-bold text-cyan-400">
              1,000 NI = 1 USDT
            </span>
          </div>

          <form onSubmit={handleExchangeSubmit} className="space-y-3">
            {/* "You Pay" Box */}
            <div className="bg-[#0f1418] border border-[#23313a] rounded-2xl p-4 focus-within:border-cyan-400/70 transition-colors">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-zinc-400 font-semibold">You Pay</span>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                  <span>Balance:</span>
                  <span className="font-bold text-cyan-300">{Math.floor(ni).toLocaleString()} NI</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  disabled={isExchanging}
                  value={exchangeNi}
                  onChange={(e) => setExchangeNi(e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent text-white font-['Space_Grotesk'] text-2xl font-bold outline-none placeholder:text-zinc-600 disabled:opacity-50"
                />

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {maxExchangeableNi >= 1000 && (
                    <button
                      type="button"
                      onClick={() => setExchangeNi(maxExchangeableNi.toString())}
                      className="px-2 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-[10px] font-extrabold text-cyan-300 hover:bg-cyan-500 hover:text-black transition"
                    >
                      MAX
                    </button>
                  )}
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#1b252c] border border-cyan-500/30 text-xs font-bold text-white shadow-sm">
                    <i className="fa-solid fa-coins text-cyan-400"></i>
                    <span>NI</span>
                  </div>
                </div>
              </div>

              {/* Quick Chip Presets */}
              <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-[#1e2a31]">
                <span className="text-[10px] text-zinc-500">Quick:</span>
                {[1000, 3000, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    disabled={isExchanging || amt > ni}
                    onClick={() => setExchangeNi(amt.toString())}
                    className="px-2 py-0.5 rounded-md bg-[#162127] border border-[#263742] text-[10px] text-zinc-300 hover:border-cyan-400 hover:text-cyan-300 transition disabled:opacity-30 disabled:pointer-events-none"
                  >
                    +{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Swap Divider Icon (3D Crypto Swap Image) */}
            <div className="flex items-center justify-center -my-3 relative z-10">
              <div
                className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-cyan-400 via-blue-500 to-amber-400 shadow-[0_0_20px_rgba(0,240,255,0.45)] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer"
                title="Instant Swap"
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-[#090d10]">
                  <img
                    src={cryptoSwapIcon}
                    alt="Crypto Swap Emblem"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* "You Receive" Box */}
            <div className="bg-[#0f1418] border border-[#23313a] rounded-2xl p-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-zinc-400 font-semibold">You Receive (Estimated)</span>
                <span className="text-[11px] text-emerald-400 font-semibold">Instant Credit</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="font-['Space_Grotesk'] text-2xl font-bold text-emerald-400 tracking-tight">
                  {convertedUsdt.toFixed(4)}
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#17251e] border border-emerald-500/30 text-xs font-bold text-white shadow-sm flex-shrink-0">
                  <i className="fa-solid fa-dollar-sign text-emerald-400"></i>
                  <span>USDT</span>
                  <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 rounded">BEP20</span>
                </div>
              </div>
            </div>

            {/* Swap Summary */}
            <div className="p-3 rounded-xl bg-[#111619] border border-[#20292f] space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-zinc-400">
                <span>Exchange Rate</span>
                <span className="text-white font-medium">1,000 NI = 1.0000 USDT</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Swap Slippage</span>
                <span className="text-emerald-400 font-medium">0% (Guaranteed Fixed)</span>
              </div>
              <div className="flex items-center justify-between text-zinc-400">
                <span>Network Protocol Fee</span>
                <span className="text-emerald-400 font-semibold">Free (0 NI)</span>
              </div>
            </div>

            <button
              ref={exchangeBtnRef}
              type="submit"
              disabled={isExchanging}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-xl font-['Space_Grotesk'] font-extrabold text-sm shadow-lg shadow-cyan-500/20 transition hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isExchanging ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Swapping NI to USDT...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-repeat"></i> Swap Points for USDT
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Modern Payment Gateway & Withdrawal Interface */}
      {activeTab === 'withdraw' && (
        <div className="bg-[#151515] border border-cyan-500/25 rounded-3xl p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute -left-16 -top-16 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-['Space_Grotesk'] text-base font-bold text-white m-0 flex items-center gap-1.5">
                <i className="fa-solid fa-shield-halved text-cyan-400"></i> Withdraw USDT
              </h2>
              <p className="text-[11px] text-zinc-400 mt-0.5 mb-0">Secure payouts to your personal crypto wallet or mobile account</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 block">Available</span>
              <span className="text-xs font-bold text-emerald-400 font-['Space_Grotesk']">
                ${Number(usdt || 0).toFixed(2)} USDT
              </span>
            </div>
          </div>

          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            {/* Payment Method / Network Selection */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-2 flex items-center justify-between">
                <span>1. Select Payout Method & Network</span>
                <span className="text-[10px] text-cyan-400 font-semibold">Multiple Options</span>
              </label>

              {/* Quick Network Selector Chips */}
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[
                  { id: 'TRC20', label: 'USDT (TRC20)', badge: 'Tron' },
                  { id: 'BEP20', label: 'USDT (BEP20)', badge: 'BSC' },
                  { id: 'bKash', label: 'bKash Wallet', badge: 'Personal' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setNetwork(item.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      network === item.id
                        ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-sm shadow-cyan-500/20'
                        : 'bg-[#1a1a1a] border-[#2d2d2d] text-zinc-400 hover:border-zinc-500'
                    }`}
                  >
                    <div className="text-xs font-bold text-white truncate">{item.id}</div>
                    <div className="text-[9px] text-zinc-400">{item.badge}</div>
                  </button>
                ))}
              </div>

              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full bg-[#202020] border border-[#303030] rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-400 font-medium"
              >
                <option value="TRC20">USDT (TRC20 - Tron Network) - Recommended</option>
                <option value="BEP20">USDT (BEP20 - BNB Smart Chain) - Fast</option>
                <option value="ERC20">USDT (ERC20 - Ethereum Network)</option>
                <option value="bKash">bKash (Personal Mobile Account)</option>
                <option value="Nagad">Nagad (Personal Mobile Account)</option>
                <option value="Rocket">Rocket (Personal Mobile Account)</option>
              </select>
            </div>

            {/* Recipient Address / Account Input */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center justify-between">
                <span>2. {isCryptoNetwork ? 'Recipient Wallet Address' : 'Personal Mobile Account Number'}</span>
                <span className="text-[10px] text-zinc-400">Strictly verified</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={
                    isCryptoNetwork
                      ? 'Paste your TRC20 / BEP20 destination address'
                      : 'Enter 11-digit personal mobile number (e.g. 017XXXXXXXX)'
                  }
                  className="w-full bg-[#202020] border border-[#303030] rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-400 font-mono pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs pointer-events-none">
                  <i className={isCryptoNetwork ? 'fa-solid fa-wallet' : 'fa-solid fa-mobile-screen'}></i>
                </div>
              </div>
            </div>

            {/* Withdrawal Amount */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label className="font-bold text-zinc-300">3. Withdrawal Amount (USDT)</label>
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(usdt > 0 ? usdt.toString() : '5')}
                  className="text-[10px] font-bold text-cyan-400 hover:underline"
                >
                  MAX: ${Number(usdt || 0).toFixed(2)}
                </button>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="5"
                  step="0.01"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Minimum 5.00 USDT"
                  className="w-full bg-[#202020] border border-[#303030] rounded-xl p-3 text-xs text-white outline-none focus:border-cyan-400 font-['Space_Grotesk'] font-bold text-base pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-400 pointer-events-none">
                  USDT
                </span>
              </div>

              {/* Quick Amount Pills */}
              <div className="flex items-center gap-2 mt-2">
                {[5, 10, 25, 50].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setWithdrawAmount(amt.toString())}
                    className="flex-1 py-1 rounded-lg bg-[#202020] border border-[#303030] text-[10px] font-bold text-zinc-300 hover:border-cyan-400 hover:text-cyan-400 transition"
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Fee Deduction & Payout Summary Card */}
            <div className="p-3.5 rounded-2xl bg-[#0e1418] border border-cyan-500/20 space-y-2">
              <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center justify-between">
                <span>Fee Deduction & Summary</span>
                <span className="text-[10px] text-emerald-400 font-normal">
                  <i className="fa-solid fa-check-circle"></i> 0% Fee Promo
                </span>
              </div>

              <div className="space-y-1 text-xs pt-1 border-t border-[#1b262d]">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Gross Requested Amount</span>
                  <span className="text-white font-medium">${withdrawAmtNum.toFixed(2)} USDT</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Gateway Handling Fee</span>
                  <span className="text-emerald-400 font-medium">$0.00 (Free)</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Network Gas Fee</span>
                  <span className="text-emerald-400 font-medium">$0.00 (Subsidized)</span>
                </div>
                <div className="flex items-center justify-between text-white font-bold pt-1.5 border-t border-[#1b262d]">
                  <span>Net Payout to You</span>
                  <span className="text-cyan-400 font-['Space_Grotesk'] text-sm">
                    ${withdrawAmtNum.toFixed(2)} {isCryptoNetwork ? 'USDT' : 'USDT Equiv.'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 pt-1">
                <i className="fa-solid fa-clock-rotate-left text-cyan-400"></i>
                <span>Estimated processing time: <strong>5 ~ 30 minutes</strong></span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#141b17] border border-emerald-500/20 text-[10px] text-emerald-300">
              <i className="fa-solid fa-lock text-emerald-400"></i>
              <span>256-bit SSL encrypted payout gateway. Safe and verified.</span>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-xl font-['Space_Grotesk'] font-extrabold text-sm shadow-lg shadow-cyan-500/20 transition hover:opacity-95 flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-paper-plane"></i> Submit Withdrawal Request
            </button>
          </form>
        </div>
      )}

      {/* Required Ad Slot: Wallet Bottom Ad */}
      <AdSlot slotId="wallet_bottom_ad" adSlots={adSlots} />

      {/* Requests History Segmented Tabs */}
      <div className="flex items-center justify-between mt-6 mb-3">
        <div className="flex items-center gap-1.5 p-1 bg-[#151515] border border-[#2a2a2a] rounded-xl shadow-sm">
          <button
            onClick={() => setHistoryTab('withdrawals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-['Space_Grotesk'] flex items-center gap-1.5 transition-all ${
              historyTab === 'withdrawals'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-arrow-up-from-bracket text-[10px]"></i>
            <span>Withdrawal Requests</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[9px] ${
                historyTab === 'withdrawals' ? 'bg-black/20 text-black font-extrabold' : 'bg-[#262626] text-zinc-300'
              }`}
            >
              {withdrawals.length}
            </span>
          </button>

          <button
            onClick={() => setHistoryTab('exchanges')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-['Space_Grotesk'] flex items-center gap-1.5 transition-all ${
              historyTab === 'exchanges'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <i className="fa-solid fa-repeat text-[10px]"></i>
            <span>Exchange Requests</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[9px] ${
                historyTab === 'exchanges' ? 'bg-black/20 text-black font-extrabold' : 'bg-[#262626] text-zinc-300'
              }`}
            >
              {exchangeRequests.length}
            </span>
          </button>
        </div>
      </div>

      {/* History Tab 1: Withdrawal Requests */}
      {historyTab === 'withdrawals' && (
        <div className="space-y-2 animate-in fade-in duration-200">
          {withdrawals.length === 0 ? (
            <div className="text-center py-6 text-zinc-500 text-xs bg-[#151515] border border-[#303030] rounded-2xl">
              <i className="fa-solid fa-arrow-up-from-bracket text-xl mb-1.5 block text-zinc-600"></i>
              No withdrawal requests submitted yet.
            </div>
          ) : (
            withdrawals.map((w) => (
              <div
                key={w.id}
                className="p-3.5 bg-[#151515] border border-[#303030] rounded-2xl flex items-center justify-between"
              >
                <div>
                  <strong className="text-xs block text-cyan-400 font-['Space_Grotesk']">
                    {w.amount.toFixed(2)} USDT ({w.network})
                  </strong>
                  <small className="text-[10px] text-zinc-400 font-mono">To: {w.address.slice(0, 12)}...</small>
                  <div className="text-[9px] text-zinc-500 mt-0.5">{w.date}</div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    w.status === 'Completed' || w.status === 'Approved'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : w.status === 'Rejected'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {w.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* History Tab 2: Exchange Requests */}
      {historyTab === 'exchanges' && (
        <div className="space-y-2 animate-in fade-in duration-200">
          {exchangeRequests.length === 0 ? (
            <div className="text-center py-6 text-zinc-500 text-xs bg-[#151515] border border-[#303030] rounded-2xl">
              <i className="fa-solid fa-repeat text-xl mb-1.5 block text-zinc-600"></i>
              No exchange requests yet. Swap points above to see records.
            </div>
          ) : (
            exchangeRequests.map((ex) => (
              <div
                key={ex.id}
                className="p-3.5 bg-[#151515] border border-[#303030] rounded-2xl flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-xs text-white">
                      {ex.fromAmount.toLocaleString()} NI
                    </strong>
                    <i className="fa-solid fa-arrow-right text-[10px] text-cyan-400"></i>
                    <strong className="text-xs text-emerald-400 font-['Space_Grotesk']">
                      +{Number(ex.toAmount).toFixed(4)} USDT
                    </strong>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    Rate: {ex.rate || '1,000 NI = 1 USDT'}
                  </div>
                  <div className="text-[9px] text-zinc-500 mt-0.5">{ex.date}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                  <i className="fa-solid fa-check text-[9px]"></i> {ex.status || 'Completed'}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
