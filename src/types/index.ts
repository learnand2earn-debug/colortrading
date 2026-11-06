export type GameModeId = 'wingo_30s' | 'wingo_1m' | 'wingo_3m' | 'wingo_5m';

export type BetType = 'color' | 'number' | 'big_small';

export type ColorSelection = 'green' | 'violet' | 'red';
export type BigSmallSelection = 'big' | 'small';
export type NumberSelection = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type RoundStatus = 'betting' | 'locked' | 'completed' | 'cancelled';

export type ColorResult = 'green' | 'red' | 'violet' | 'green_violet' | 'red_violet';

export interface GameRound {
  id: string;
  game_id: GameModeId;
  period_id: string;
  start_time: string;
  end_time: string;
  status: RoundStatus;
  result_number: number | null;
  result_color: ColorResult | null;
  result_big_small: BigSmallSelection | null;
  seed_hash: string;
  secret_salt?: string | null;
  total_bets_count: number;
  total_points_wagered: number;
  total_points_payout: number;
  created_at: string;
  resolved_at?: string | null;
}

export interface Prediction {
  id: string;
  user_id: string;
  round_id: string;
  period_id: string;
  game_id: GameModeId;
  bet_type: BetType;
  selection: string;
  points_amount: number;
  multiplier: number;
  total_bet_points: number;
  odds: number;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
  payout_points: number;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  virtual_points: number;
  role: 'user' | 'moderator' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  total_rounds_played: number;
  total_wins: number;
  total_losses: number;
  accuracy_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface PointsLedgerEntry {
  id: string;
  user_id: string;
  tx_type: 'signup_bonus' | 'daily_reward' | 'bet_placed' | 'bet_won' | 'admin_adjustment' | 'system_refund';
  amount: number;
  balance_after: number;
  reference_id?: string;
  notes?: string;
  created_at: string;
}

export interface DailyRewardRecord {
  id: string;
  user_id: string;
  claim_date: string;
  points_rewarded: number;
  streak_count: number;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'system' | 'win' | 'reward' | 'support';
  is_read: boolean;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  user_name?: string;
  subject: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  replies?: SupportReply[];
}

export interface SupportReply {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_name?: string;
  is_admin: boolean;
  message: string;
  created_at: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  banner_type: 'info' | 'alert' | 'event';
  is_active: boolean;
  created_at: string;
}

export interface AuditLogItem {
  id: string;
  admin_id: string;
  admin_name?: string;
  action: string;
  target_type: string;
  target_id: string;
  details: Record<string, unknown>;
  ip_address?: string;
  created_at: string;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  username: string;
  avatar_url?: string;
  virtual_points: number;
  total_wins: number;
  total_rounds_played: number;
  accuracy_percentage: number;
}

