export type AdSlotId =
  | 'home_top_banner'
  | 'home_middle_banner'
  | 'home_bottom_banner'
  | 'checkin_top_ad'
  | 'checkin_bottom_ad'
  | 'spin_top_ad'
  | 'spin_bottom_ad'
  | 'task_top_ad'
  | 'task_middle_ad'
  | 'task_bottom_ad'
  | 'video_ads_banner'
  | 'wallet_top_ad'
  | 'wallet_bottom_ad'
  | 'referral_top_ad'
  | 'referral_bottom_ad'
  | 'history_top_ad'
  | 'history_bottom_ad'
  | 'profile_top_ad'
  | 'profile_bottom_ad'
  | 'nav_sponsored_slot'
  | 'sticky_banner'
  | 'video_rewarded'
  | 'interstitial'
  | 'direct_link'
  | 'popunder';

export type AdType = 'banner' | 'native' | 'responsive' | 'html' | 'custom_js' | 'rewarded' | 'adsterra' | 'monetag' | 'adsense';

export interface AdSlotConfig {
  id: AdSlotId;
  name: string;
  page: string;
  placement: string;
  adType: AdType;
  adCode: string; // HTML or JS snippet
  enabled: boolean;
  desktopVisible: boolean;
  mobileVisible: boolean;
  dimensions: string;
  priority: number;
  startDate: string;
  endDate: string;
  stats: {
    impressions: number;
    clicks: number;
    earnings: number;
  };
}

export interface TaskItem {
  id: string;
  category: 'social' | 'telegram' | 'website' | 'app' | 'custom' | 'sponsored';
  title: string;
  description: string;
  reward: number;
  link: string;
  image?: string;
  instructions: string;
  status: 'available' | 'joined' | 'pending' | 'approved' | 'rejected' | 'claimed';
}

export interface Transaction {
  id: string | number;
  type: string;
  amount: number;
  unit: string;
  detail: string;
  date: string;
}

export interface WithdrawalRequest {
  id: string | number;
  network: string;
  address: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Processing' | 'Completed' | 'Rejected';
  date: string;
}

export interface ExchangeRequest {
  id: string | number;
  fromAmount: number;
  toAmount: number;
  rate: string;
  status: 'Completed' | 'Processing';
  date: string;
}

export interface ReferralUser {
  id: string | number;
  name: string;
  date: string;
  earnings: number;
}

export interface Announcement {
  id: string | number;
  title: string;
  content: string;
  date: string;
}

export interface GoogleAccount {
  isBound: boolean;
  email: string;
  name: string;
  picture: string;
  googleId?: string;
  telegramUserId?: string;
  boundAt?: string;
}

export interface AppState {
  ni: number;
  usdt: number;
  transactions: Transaction[];
  withdrawals: WithdrawalRequest[];
  exchangeRequests?: ExchangeRequest[];
  claimedCheckin: string;
  lastSpin: string;
  dailySpinDate?: string;
  dailySpinCount?: number;
  maxDailySpins?: number;
  tasks: Record<string, 'available' | 'joined' | 'pending' | 'approved' | 'rejected' | 'claimed'>;
  customTasks: TaskItem[];
  videoClaims: number;
  referrals: ReferralUser[];
  createdAt: string;
  theme: 'dark';
  streak: number;
  announcements: Announcement[];
  adSlots: Record<AdSlotId, AdSlotConfig>;
  adminPin: string;
  googleAccount?: GoogleAccount;
}
