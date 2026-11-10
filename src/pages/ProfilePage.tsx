import React, { useState } from 'react';
import { AdSlot } from '../components/AdSlot';
import { GoogleAccount } from '../types';
import { bindGoogleAccountWithOAuth, unbindGoogleOAuth } from '../services/firebaseAuth';

interface ProfilePageProps {
  createdAt: string;
  googleAccount?: GoogleAccount;
  onBindGoogle: (email: string, name: string, picture: string, googleId?: string, telegramUserId?: string) => boolean | void;
  onUnbindGoogle: () => void;
  onResetDemo: () => void;
  adSlots: Record<string, any>;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  createdAt,
  googleAccount,
  onBindGoogle,
  onUnbindGoogle,
  onResetDemo,
  adSlots
}) => {
  const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user || null;
  const name = tgUser ? [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ') : 'Guest User';
  const username = tgUser && tgUser.username ? `@${tgUser.username}` : '@demo_user';
  const userId = tgUser ? String(tgUser.id) : '982147';
  const initials = (name || 'AG').split(/\s+/).map((x) => x[0]).join('').slice(0, 2).toUpperCase();

  const [copiedUid, setCopiedUid] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showUnbindConfirm, setShowUnbindConfirm] = useState(false);
  const [isBindingLoading, setIsBindingLoading] = useState(false);
  const [bindError, setBindError] = useState<string | null>(null);

  const isGoogleBound = Boolean(googleAccount?.isBound);

  const handleCopyUid = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    } catch {
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const handleDownloadFile = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (e) {
      window.location.href = url;
    }
  };

  const handleGoogleOAuthBind = async () => {
    setIsBindingLoading(true);
    setBindError(null);
    try {
      const result = await bindGoogleAccountWithOAuth();
      const success = onBindGoogle(
        result.email,
        result.displayName,
        result.photoURL,
        result.googleId,
        userId
      );
      if (success === false) {
        setBindError('This Google Account is already bound to another Telegram User ID!');
      }
    } catch (err: any) {
      if (
        err?.code !== 'auth/popup-closed-by-user' &&
        err?.code !== 'auth/cancelled-popup-request'
      ) {
        console.error('Google OAuth Error:', err);
      }
      if (err?.code === 'auth/popup-closed-by-user') {
        setBindError('Sign-in window was closed. Tap "Bind Google Account" to select your account.');
      } else if (err?.code === 'auth/cancelled-popup-request') {
        setBindError('Authentication window already open. Please complete sign-in in the open popup.');
      } else {
        setBindError(err?.message || 'Google OAuth 2.0 authentication failed. Please try again.');
      }
    } finally {
      setIsBindingLoading(false);
    }
  };

  const handleConfirmUnbind = async () => {
    try {
      await unbindGoogleOAuth();
    } catch (e) {
      console.error('Unbind error:', e);
    }
    onUnbindGoogle();
    setShowUnbindConfirm(false);
  };

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <div className="text-[11px] font-extrabold uppercase tracking-widest text-zinc-400">ACCOUNT SETTINGS</div>
        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-white mt-1 mb-1">Profile</h1>
        <p className="text-xs text-zinc-400 m-0">Your Telegram Mini App account & security management.</p>
      </div>

      {/* Required Ad Slot: Profile Top Ad */}
      <AdSlot slotId="profile_top_ad" adSlots={adSlots} />

      {/* 1. PREMIUM PROFILE HEADER */}
      <div className="bg-gradient-to-br from-[#152329] via-[#12181c] to-[#0d1012] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Decorative glow circles */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Badges */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 rounded-full text-[11px] font-extrabold shadow-[0_0_12px_rgba(0,240,255,0.25)]">
            <i className="fa-solid fa-circle-check text-cyan-400"></i>
            <span>Verified Account</span>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#202020] border border-[#353535] rounded-full text-[10px] font-bold text-zinc-300">
            <i className="fa-solid fa-crown text-amber-400 text-[10px]"></i> VIP Tier 1
          </span>
        </div>

        {/* 2. Large Circular Profile Picture */}
        <div className="flex flex-col items-center text-center relative z-10">
          <div className="relative mb-3">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-500 shadow-[0_0_25px_rgba(0,240,255,0.35)] flex items-center justify-center">
              {isGoogleBound && googleAccount?.picture ? (
                <img
                  src={googleAccount.picture}
                  alt="Google Avatar"
                  className="w-full h-full rounded-full object-cover bg-[#101010]"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1a2e38] to-[#0c1a20] flex items-center justify-center text-cyan-300 font-['Space_Grotesk'] text-3xl font-extrabold select-none">
                  {initials}
                </div>
              )}
            </div>

            {/* Google bind indicator on avatar */}
            {isGoogleBound && (
              <div
                className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-white border-2 border-[#151515] flex items-center justify-center shadow-lg"
                title="Google Account Linked"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.37 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z"/>
                </svg>
              </div>
            )}
          </div>

          {/* 3. Name & Username */}
          <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-white m-0 tracking-tight flex items-center justify-center gap-1.5">
            <span>{isGoogleBound && googleAccount?.name ? googleAccount.name : name}</span>
          </h2>
          <div className="text-xs text-cyan-400 font-semibold mt-0.5 flex items-center justify-center gap-1">
            <span>{username}</span>
            <i className="fa-solid fa-badge-check text-cyan-400 text-sm"></i>
          </div>

          {/* 4. Unique User ID */}
          <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#181d20] border border-[#2b353b] rounded-full shadow-inner">
            <span className="text-[11px] text-zinc-400 font-mono">UID: <b className="text-white">{userId}</b></span>
            <button
              onClick={handleCopyUid}
              className="text-cyan-400 hover:text-white transition text-xs flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-cyan-500/20"
              title="Copy User ID"
            >
              <i className={copiedUid ? "fa-solid fa-check text-emerald-400" : "fa-regular fa-copy"}></i>
              <span className="text-[10px] font-bold">{copiedUid ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. PREMIUM GOOGLE ACCOUNT BINDING CARD (Purple + Blue Gradient Glassmorphism) */}
      <div className="bg-gradient-to-r from-[#20103a]/90 via-[#131d47]/90 to-[#0e223b]/90 border border-purple-500/35 rounded-3xl p-5 shadow-[0_12px_36px_rgba(112,0,255,0.18)] relative overflow-hidden backdrop-blur-md">
        {/* Neon Ambient Background Bulbs */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/95 p-2 shadow-lg flex items-center justify-center flex-shrink-0 border border-purple-200">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.37 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z"/>
              </svg>
            </div>
            <div>
              <h2 className="font-['Space_Grotesk'] text-base font-bold text-white m-0 tracking-wide">
                Google Account Bind
              </h2>
              <span className="text-[11px] text-purple-200/80">Google OAuth 2.0 Security & Sync</span>
            </div>
          </div>

          {/* Connected / Not Connected Status Badge */}
          {isGoogleBound ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Not Connected
            </span>
          )}
        </div>

        {bindError && (
          <div className="relative z-10 my-3 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-start gap-2">
            <i className="fa-solid fa-circle-exclamation text-red-400 text-sm mt-0.5 flex-shrink-0"></i>
            <span className="leading-snug">{bindError}</span>
          </div>
        )}

        {/* Bound Details vs Bind Button */}
        {isGoogleBound ? (
          <div className="relative z-10 space-y-3 mt-4">
            <div className="flex items-center gap-3 p-3.5 bg-black/40 border border-purple-500/30 rounded-2xl backdrop-blur-sm">
              <img
                src={googleAccount?.picture}
                alt="Google user avatar"
                className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400 shadow-md flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <strong className="text-xs text-white truncate">{googleAccount?.name || 'Google User'}</strong>
                  <i className="fa-solid fa-circle-check text-emerald-400 text-xs" title="Verified Google SSO"></i>
                </div>
                <span className="text-xs text-cyan-300 font-mono truncate block mt-0.5">{googleAccount?.email}</span>
                <div className="text-[9px] text-purple-200/60 mt-0.5">
                  Linked with Telegram UID: <code className="text-white font-mono">{userId}</code>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-purple-200/80 flex items-center gap-1.5">
                <i className="fa-solid fa-shield-check text-emerald-400 text-xs"></i> Protected via Google OAuth 2.0
              </span>
              <button
                onClick={() => setShowUnbindConfirm(true)}
                className="px-3.5 py-1.5 bg-red-500/15 border border-red-500/40 text-red-300 hover:bg-red-500/25 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Unbind Account
              </button>
            </div>
          </div>
        ) : (
          <div className="relative z-10 mt-3">
            <p className="text-xs text-purple-100/80 leading-relaxed mb-4">
              Tap below to choose your Gmail account via Google OAuth 2.0. Protect your reward points and earn an instant <b>+50 NI Points</b> bonus!
            </p>

            <button
              onClick={handleGoogleOAuthBind}
              disabled={isBindingLoading}
              className="w-full py-3.5 bg-white hover:bg-zinc-100 text-zinc-900 rounded-2xl font-bold text-xs shadow-xl transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isBindingLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-purple-600 text-sm"></i>
                  <span className="font-extrabold text-zinc-800">Opening Google Account Chooser...</span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.43 7.37 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.27 2.57 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z"/>
                    </svg>
                  </div>
                  <span className="font-extrabold text-zinc-900 tracking-wide text-xs">
                    Bind Google Account (+50 NI Bonus)
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 6. ACCOUNT SECURITY CARD */}
      <div className="bg-[#151515] border border-[#303030] rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-lg">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h2 className="font-['Space_Grotesk'] text-base font-bold text-white m-0">Account Security</h2>
              <span className="text-[11px] text-zinc-400">Protection, 2FA & active sessions</span>
            </div>
          </div>
          <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full">
            98% High
          </span>
        </div>

        {/* Security Meter Progress Bar */}
        <div className="h-2 w-full bg-[#202020] rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 w-[98%] shadow-[0_0_10px_#00F0FF]"></div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between p-3 bg-[#1c1c1c] rounded-xl text-xs">
            <span className="text-zinc-300 flex items-center gap-2">
              <i className="fa-brands fa-telegram text-cyan-400 text-sm"></i> Telegram Session
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <i className="fa-solid fa-check"></i> Encrypted
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#1c1c1c] rounded-xl text-xs">
            <span className="text-zinc-300 flex items-center gap-2">
              <i className="fa-solid fa-key text-amber-400 text-sm"></i> Withdrawal PIN Protection
            </span>
            <span className="text-cyan-400 font-bold">Enabled</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#1c1c1c] rounded-xl text-xs">
            <span className="text-zinc-300 flex items-center gap-2">
              <i className="fa-solid fa-mobile-screen text-zinc-400 text-sm"></i> Device Handshake
            </span>
            <span className="text-zinc-400 font-mono text-[11px]">Telegram WebApp 8.0</span>
          </div>
        </div>
      </div>

      {/* 7. HELP & SUPPORT CARD */}
      <div className="bg-[#151515] border border-[#303030] rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#202020] text-cyan-400 flex items-center justify-center text-lg">
            <i className="fa-solid fa-headset"></i>
          </div>
          <div>
            <h2 className="font-['Space_Grotesk'] text-base font-bold text-white m-0">Help & Support</h2>
            <span className="text-[11px] text-zinc-400">24/7 Community & Official assistance</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-3 bg-[#1c1c1c] hover:bg-[#242424] border border-[#292929] rounded-xl text-xs text-white transition font-medium"
          >
            <i className="fa-brands fa-telegram text-cyan-400 text-base"></i>
            <div className="truncate">
              <strong className="block text-white text-[11px]">Support Bot</strong>
              <small className="text-[9px] text-zinc-400">@AdGateSupport</small>
            </div>
          </a>

          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-3 bg-[#1c1c1c] hover:bg-[#242424] border border-[#292929] rounded-xl text-xs text-white transition font-medium"
          >
            <i className="fa-solid fa-bullhorn text-cyan-400 text-base"></i>
            <div className="truncate">
              <strong className="block text-white text-[11px]">Official Channel</strong>
              <small className="text-[9px] text-zinc-400">Announcements</small>
            </div>
          </a>
        </div>

        <button
          onClick={() => setShowFaqModal(true)}
          className="w-full mt-3 py-2.5 bg-[#202020] hover:bg-[#262626] border border-[#303030] text-zinc-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-circle-question text-cyan-400"></i> View Frequently Asked Questions (FAQ)
        </button>
      </div>

      {/* 8. COMPLETE PROJECT DOWNLOAD SECTION */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-[#10221c]/90 to-[#0e2730]/90 border border-emerald-500/35 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 flex items-center justify-center text-lg">
            <i className="fa-solid fa-file-zipper"></i>
          </div>
          <div>
            <h2 className="font-['Space_Grotesk'] text-base font-bold text-white m-0">Download Project Files</h2>
            <span className="text-[11px] text-emerald-200/80">Export complete source code & standalone HTML</span>
          </div>
        </div>

        <p className="text-xs text-zinc-300 mt-2 mb-3.5 leading-relaxed">
          আপনার Ad Gate Hub Mini App-এর সম্পূর্ণ Source Code (ZIP) এবং Offline Single-File HTML অ্যাপ নিচে দেওয়া বোতামে ক্লিক করে সরাসরি ডাউনলোড করতে পারবেন:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            onClick={() => handleDownloadFile('/Ad_Gate_Hub_Complete_ZIP_Project.zip', 'Ad_Gate_Hub_Complete_ZIP_Project.zip')}
            className="flex items-center justify-center gap-2.5 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold rounded-xl text-xs shadow-lg transition-all transform active:scale-95 cursor-pointer"
          >
            <i className="fa-solid fa-file-arrow-down text-base"></i>
            <span>Download ZIP Project</span>
          </button>

          <button
            onClick={() => handleDownloadFile('/Ad_Gate_Hub_Standalone_App.html', 'Ad_Gate_Hub_Standalone_App.html')}
            className="flex items-center justify-center gap-2.5 py-3 px-4 bg-[#1c2e28] hover:bg-[#243d35] border border-emerald-400/40 text-emerald-300 font-bold rounded-xl text-xs transition-all transform active:scale-95 cursor-pointer"
          >
            <i className="fa-solid fa-code text-base"></i>
            <span>Standalone HTML App</span>
          </button>
        </div>
      </div>

      {/* Required Ad Slot: Profile Bottom Ad */}
      <AdSlot slotId="profile_bottom_ad" adSlots={adSlots} />

      {/* Reset Demo Data Action */}
      <button
        onClick={onResetDemo}
        className="w-full py-3 bg-[#1c1c1c] border border-[#303030] text-red-400 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition hover:bg-[#252525]"
      >
        <i className="fa-solid fa-rotate-left"></i> Reset Demo Data
      </button>

      {/* UNBIND CONFIRMATION MODAL */}
      {showUnbindConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#151515] border border-[#303030] rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <i className="fa-solid fa-triangle-exclamation text-lg"></i>
                <h3 className="font-['Space_Grotesk'] text-base font-bold text-white m-0">Unbind Google Account?</h3>
              </div>
              <button
                onClick={() => setShowUnbindConfirm(false)}
                className="w-8 h-8 rounded-full bg-[#262626] text-zinc-300 hover:text-white flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <p className="text-xs text-zinc-300 mb-5 leading-relaxed">
              Are you sure you want to unbind <b className="text-cyan-300">{googleAccount?.email}</b> from this Ad Gate Hub Telegram account (UID: <code className="text-white font-mono">{userId}</code>)?
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowUnbindConfirm(false)}
                className="flex-1 py-3 bg-[#202020] text-zinc-300 rounded-xl font-bold text-xs hover:bg-[#282828] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUnbind}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-extrabold text-xs shadow-lg shadow-red-500/25 transition"
              >
                Confirm Unbind
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ MODAL */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#151515] border border-[#303030] rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-['Space_Grotesk'] text-base font-bold text-white m-0">Frequently Asked Questions</h3>
              <button
                onClick={() => setShowFaqModal(false)}
                className="w-8 h-8 rounded-full bg-[#262626] text-zinc-300 hover:text-white flex items-center justify-center"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="p-3 bg-[#1e1e1e] rounded-xl">
                <strong className="block text-cyan-400 mb-1">How do I earn NI Points?</strong>
                <span>You can earn NI Points through Daily Check-in, 10 Daily Lucky Spins, Watch & Earn Video Ads, and completing Task Center activities.</span>
              </div>
              <div className="p-3 bg-[#1e1e1e] rounded-xl">
                <strong className="block text-cyan-400 mb-1">How does USDT withdrawal work?</strong>
                <span>Exchange at least 1,000 NI Points for Master USDT in your Wallet. Then select your network (TRC20, BEP20, bKash, Nagad) and submit your withdrawal request.</span>
              </div>
              <div className="p-3 bg-[#1e1e1e] rounded-xl">
                <strong className="block text-cyan-400 mb-1">Why bind my Google Account?</strong>
                <span>Binding your Google Account protects your account against losing Telegram access, provides cross-platform recovery, and awards you +50 NI Points!</span>
              </div>
            </div>

            <button
              onClick={() => setShowFaqModal(false)}
              className="w-full mt-4 py-3 bg-cyan-400 text-black rounded-xl font-bold text-xs"
            >
              Close FAQ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

