"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import {
  GameModeId,
  GameRound,
  Prediction,
  UserProfile,
  PointsLedgerEntry,
  DailyRewardRecord,
  NotificationItem,
  SupportTicket,
  ColorSelection,
  BigSmallSelection,
  NumberSelection,
} from "@/types";
import {
  getCurrentPeriodInfo,
  calculateRoundDetails,
  deriveResultNumber,
  generateSeedHash,
  evaluatePrediction,
  generateInitialHistory,
  GAME_DURATIONS,
} from "@/lib/game/engine";
import { sound } from "@/lib/audio/sounds";

interface BetPayload {
  betType: "color" | "number" | "big_small";
  selection: ColorSelection | BigSmallSelection | NumberSelection;
  amount: number;
  multiplier: number;
}

interface GameContextType {
  user: UserProfile;
  updateAvatar: (avatarUrl: string) => void;
  updateUsername: (name: string) => void;
  gameId: GameModeId;
  setGameId: (id: GameModeId) => void;
  periodId: string;
  secondsRemaining: number;
  isLocked: boolean;
  history: GameRound[];
  userBets: Prediction[];
  activeBetModal: {
    isOpen: boolean;
    betType: "color" | "number" | "big_small";
    selection: string;
    title: string;
    badgeColor: string;
  } | null;
  openBetModal: (
    betType: "color" | "number" | "big_small",
    selection: string,
    title: string,
    badgeColor: string
  ) => void;
  closeBetModal: () => void;
  placeBet: (payload: BetPayload) => { success: boolean; message: string };
  lastResultPopup: {
    isOpen: boolean;
    round: GameRound | null;
    userWonAmount: number;
    userLostAmount: number;
  } | null;
  closeLastResultPopup: () => void;
  claimDailyReward: () => { success: boolean; points: number; message: string };
  dailyClaimedToday: boolean;
  streakCount: number;
  wheelSpinsRemaining: number;
  spinLuckyWheel: () => { success: boolean; prize: number; sliceIndex: number; message: string };
  claimReferralBonus: () => { success: boolean; points: number; message: string };
  referralPointsClaimed: number;
  ledger: PointsLedgerEntry[];
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  supportTickets: SupportTicket[];
  createSupportTicket: (subject: string, category: string, message: string) => void;
  soundMuted: boolean;
  toggleSound: () => void;
  toggleAdminRole: () => void;
  adminAdjustPoints: (targetUserId: string, amount: number, notes: string) => void;
  adminChangeUserStatus: (targetUserId: string, status: "active" | "suspended") => void;
  allUsers: UserProfile[];
}

const DEFAULT_USER: UserProfile = {
  id: "usr_77a89b01",
  username: "LuckyPlayer_92",
  email: "lucky92@gamers.sim",
  avatar_url: "",
  virtual_points: 2500,
  role: "user",
  status: "active",
  total_rounds_played: 48,
  total_wins: 33,
  total_losses: 15,
  accuracy_percentage: 68.75,
  created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
  updated_at: new Date().toISOString(),
};

const INITIAL_USERS: UserProfile[] = [
  DEFAULT_USER,
  {
    id: "usr_adm_001",
    username: "SystemMaster",
    email: "admin@92lucky.sim",
    avatar_url: "",
    virtual_points: 50000,
    role: "admin",
    status: "active",
    total_rounds_played: 120,
    total_wins: 89,
    total_losses: 31,
    accuracy_percentage: 74.16,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "usr_pro_002",
    username: "ApexTrader",
    email: "apex@crypto.sim",
    avatar_url: "",
    virtual_points: 18450,
    role: "user",
    status: "active",
    total_rounds_played: 88,
    total_wins: 62,
    total_losses: 26,
    accuracy_percentage: 70.45,
    created_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [gameId, setGameId] = useState<GameModeId>("wingo_30s");

  const [periodId, setPeriodId] = useState<string>("");
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const [wheelSpinsRemaining, setWheelSpinsRemaining] = useState<number>(1);
  const [referralPointsClaimed, setReferralPointsClaimed] = useState<number>(1500);

  // Restore avatar and username from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAvatar = localStorage.getItem("92lucky_user_avatar");
      const savedName = localStorage.getItem("92lucky_user_name");
      if (savedAvatar || savedName) {
        setUser((prev) => ({
          ...prev,
          avatar_url: savedAvatar || prev.avatar_url,
          username: savedName || prev.username,
        }));
      }
    }
  }, []);

  const updateAvatar = (avatarUrl: string) => {
    setUser((prev) => ({ ...prev, avatar_url: avatarUrl }));
    if (typeof window !== "undefined") {
      localStorage.setItem("92lucky_user_avatar", avatarUrl);
    }
    sound.playWin();
  };

  const updateUsername = (name: string) => {
    if (!name.trim()) return;
    setUser((prev) => ({ ...prev, username: name }));
    if (typeof window !== "undefined") {
      localStorage.setItem("92lucky_user_name", name);
    }
  };

  const [historyMap, setHistoryMap] = useState<Record<GameModeId, GameRound[]>>({
    wingo_30s: generateInitialHistory("wingo_30s", 25),
    wingo_1m: generateInitialHistory("wingo_1m", 25),
    wingo_3m: generateInitialHistory("wingo_3m", 25),
    wingo_5m: generateInitialHistory("wingo_5m", 25),
  });

  const [userBets, setUserBets] = useState<Prediction[]>([]);
  const [ledger, setLedger] = useState<PointsLedgerEntry[]>([
    {
      id: "tx_welcome",
      user_id: DEFAULT_USER.id,
      tx_type: "signup_bonus",
      amount: 1000,
      balance_after: 1000,
      notes: "92 Lucky Free Starter Welcome Pack",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "tx_daily_prev",
      user_id: DEFAULT_USER.id,
      tx_type: "daily_reward",
      amount: 250,
      balance_after: 1250,
      notes: "Day 1 Daily Reward Claimed",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif_1",
      user_id: DEFAULT_USER.id,
      title: "Welcome to 92 Lucky!",
      message: "Enjoy free virtual color prediction trading. Upload your profile photo in Account!",
      type: "reward",
      is_read: false,
      created_at: new Date().toISOString(),
    },
  ]);

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: "ticket_101",
      user_id: DEFAULT_USER.id,
      user_name: DEFAULT_USER.username,
      subject: "How do 0 and 5 Violet split payouts work?",
      category: "gameplay",
      priority: "low",
      status: "resolved",
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      replies: [
        {
          id: "rep_1",
          ticket_id: "ticket_101",
          sender_id: "usr_adm_001",
          sender_name: "92 Lucky Team",
          is_admin: true,
          message:
            "Hello! When number 0 appears, it contains Red and Violet. Players who bet on Violet receive 4.5x, and Red receives a 1.5x split payout. Similarly, number 5 is Green and Violet!",
          created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ],
    },
  ]);

  const [dailyClaimedToday, setDailyClaimedToday] = useState<boolean>(false);
  const [streakCount, setStreakCount] = useState<number>(3);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);

  const [activeBetModal, setActiveBetModal] = useState<{
    isOpen: boolean;
    betType: "color" | "number" | "big_small";
    selection: string;
    title: string;
    badgeColor: string;
  } | null>(null);

  const [lastResultPopup, setLastResultPopup] = useState<{
    isOpen: boolean;
    round: GameRound | null;
    userWonAmount: number;
    userLostAmount: number;
  } | null>(null);

  useEffect(() => {
    setSoundMuted(sound.getMuted());
  }, []);

  const toggleSound = () => {
    const isMuted = sound.toggleMute();
    setSoundMuted(isMuted);
  };

  const openBetModal = (
    betType: "color" | "number" | "big_small",
    selection: string,
    title: string,
    badgeColor: string
  ) => {
    sound.playClick();
    setActiveBetModal({
      isOpen: true,
      betType,
      selection,
      title,
      badgeColor,
    });
  };

  const closeBetModal = () => {
    setActiveBetModal(null);
  };

  const closeLastResultPopup = () => {
    setLastResultPopup(null);
  };

  const toggleAdminRole = () => {
    setUser((prev) => {
      const newRole = prev.role === "admin" ? "user" : "admin";
      return {
        ...prev,
        role: newRole,
        username: newRole === "admin" ? "Admin_92Lucky" : "LuckyPlayer_92",
      };
    });
  };

  const adminAdjustPoints = (targetUserId: string, amount: number, notes: string) => {
    setAllUsers((prev) =>
      prev.map((u) => {
        if (u.id === targetUserId) {
          const newPts = Math.max(0, u.virtual_points + amount);
          return { ...u, virtual_points: newPts };
        }
        return u;
      })
    );
    if (user.id === targetUserId) {
      setUser((prev) => ({
        ...prev,
        virtual_points: Math.max(0, prev.virtual_points + amount),
      }));
      setLedger((prev) => [
        {
          id: `tx_admin_${Date.now()}`,
          user_id: targetUserId,
          tx_type: "admin_adjustment",
          amount,
          balance_after: Math.max(0, user.virtual_points + amount),
          notes: notes || "Administrative balance adjustment",
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  const adminChangeUserStatus = (targetUserId: string, status: "active" | "suspended") => {
    setAllUsers((prev) =>
      prev.map((u) => (u.id === targetUserId ? { ...u, status } : u))
    );
    if (user.id === targetUserId) {
      setUser((prev) => ({ ...prev, status }));
    }
  };

  const placeBet = (payload: BetPayload) => {
    const totalWager = payload.amount * payload.multiplier;

    if (user.status !== "active") {
      return { success: false, message: "Your account is not active" };
    }

    if (isLocked) {
      return { success: false, message: "Predictions are locked for this period" };
    }

    if (user.virtual_points < totalWager) {
      return { success: false, message: "Insufficient virtual points balance" };
    }

    let odds = 2.0;
    if (payload.betType === "number") odds = 9.0;
    else if (payload.betType === "color" && payload.selection === "violet") odds = 4.5;
    else odds = 2.0;

    const newBalance = user.virtual_points - totalWager;

    const newBet: Prediction = {
      id: `pred_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: user.id,
      round_id: `round_${periodId}`,
      period_id: periodId,
      game_id: gameId,
      bet_type: payload.betType,
      selection: payload.selection,
      points_amount: payload.amount,
      multiplier: payload.multiplier,
      total_bet_points: totalWager,
      odds,
      status: "pending",
      payout_points: 0,
      created_at: new Date().toISOString(),
    };

    setUser((prev) => ({
      ...prev,
      virtual_points: newBalance,
      total_rounds_played: prev.total_rounds_played + 1,
    }));

    setLedger((prev) => [
      {
        id: `tx_${Date.now()}`,
        user_id: user.id,
        tx_type: "bet_placed",
        amount: -totalWager,
        balance_after: newBalance,
        reference_id: periodId,
        notes: `Prediction on ${payload.selection.toUpperCase()} (${payload.betType})`,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    setUserBets((prev) => [newBet, ...prev]);

    sound.playBetPlaced();
    closeBetModal();

    return {
      success: true,
      message: `Prediction placed: ${totalWager} pts on ${payload.selection.toUpperCase()}`,
    };
  };

  const claimDailyReward = () => {
    if (dailyClaimedToday) {
      return { success: false, points: 0, message: "Already claimed today! Come back tomorrow." };
    }

    const rewardPoints = 250 + streakCount * 25;
    const newBal = user.virtual_points + rewardPoints;
    const newStreak = streakCount + 1;

    setUser((prev) => ({
      ...prev,
      virtual_points: newBal,
    }));

    setDailyClaimedToday(true);
    setStreakCount(newStreak);

    setLedger((prev) => [
      {
        id: `tx_daily_${Date.now()}`,
        user_id: user.id,
        tx_type: "daily_reward",
        amount: rewardPoints,
        balance_after: newBal,
        notes: `Day ${newStreak} Daily Streak Reward`,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    sound.playWin();
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}

    return {
      success: true,
      points: rewardPoints,
      message: `Successfully claimed +${rewardPoints} free virtual points!`,
    };
  };

  // Lucky Spin Wheel Action
  const spinLuckyWheel = () => {
    if (wheelSpinsRemaining <= 0) {
      return {
        success: false,
        prize: 0,
        sliceIndex: 0,
        message: "No spins remaining today! Check back tomorrow.",
      };
    }

    const slices = [50, 100, 250, 500, 1000, 2500, 5000, 75];
    const pickedIndex = Math.floor(Math.random() * slices.length);
    const prizeAmount = slices[pickedIndex];

    const newBal = user.virtual_points + prizeAmount;
    setUser((prev) => ({ ...prev, virtual_points: newBal }));
    setWheelSpinsRemaining((prev) => Math.max(0, prev - 1));

    setLedger((prev) => [
      {
        id: `tx_wheel_${Date.now()}`,
        user_id: user.id,
        tx_type: "daily_reward",
        amount: prizeAmount,
        balance_after: newBal,
        notes: `Lucky Wheel Prize: +${prizeAmount} pts`,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    sound.playWin();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
      });
    } catch {}

    return {
      success: true,
      prize: prizeAmount,
      sliceIndex: pickedIndex,
      message: `Congratulations! You won +${prizeAmount} virtual points!`,
    };
  };

  // Claim Referral Bonus
  const claimReferralBonus = () => {
    const bonusPoints = 500;
    const newBal = user.virtual_points + bonusPoints;
    setUser((prev) => ({ ...prev, virtual_points: newBal }));
    setReferralPointsClaimed((prev) => prev + bonusPoints);

    setLedger((prev) => [
      {
        id: `tx_ref_${Date.now()}`,
        user_id: user.id,
        tx_type: "daily_reward",
        amount: bonusPoints,
        balance_after: newBal,
        notes: "Friend Invitation Referral Bonus",
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);

    sound.playWin();
    try {
      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.6 },
      });
    } catch {}

    return {
      success: true,
      points: bonusPoints,
      message: `+500 Virtual Points claimed for your invited player!`,
    };
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const createSupportTicket = (subject: string, category: string, message: string) => {
    const newTicket: SupportTicket = {
      id: `ticket_${Date.now().toString(36)}`,
      user_id: user.id,
      user_name: user.username,
      subject,
      category,
      priority: "medium",
      status: "open",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      replies: [
        {
          id: `rep_${Date.now()}`,
          ticket_id: `ticket_${Date.now().toString(36)}`,
          sender_id: user.id,
          sender_name: user.username,
          is_admin: false,
          message,
          created_at: new Date().toISOString(),
        },
      ],
    };

    setSupportTickets((prev) => [newTicket, ...prev]);

    setTimeout(() => {
      setSupportTickets((prev) =>
        prev.map((t) => {
          if (t.id === newTicket.id) {
            return {
              ...t,
              status: "in_progress",
              replies: [
                ...(t.replies || []),
                {
                  id: `rep_auto_${Date.now()}`,
                  ticket_id: t.id,
                  sender_id: "usr_adm_001",
                  sender_name: "92 Lucky Support Bot",
                  is_admin: true,
                  message:
                    "Thanks for reaching out! A gaming support agent has been notified and will review your inquiry shortly. Feel free to explore other game modes in the meantime.",
                  created_at: new Date().toISOString(),
                },
              ],
            };
          }
          return t;
        })
      );
    }, 2500);
  };

  const previousPeriodRef = useRef<string>("");

  useEffect(() => {
    const tick = () => {
      const info = getCurrentPeriodInfo(gameId);
      setPeriodId(info.periodId);
      setSecondsRemaining(info.secondsRemaining);
      setIsLocked(info.isLocked);

      if (info.isLocked && info.secondsRemaining > 0 && info.secondsRemaining <= 5) {
        sound.playTick();
      }

      if (previousPeriodRef.current && previousPeriodRef.current !== info.periodId) {
        const resolvedPeriodId = previousPeriodRef.current;
        const secretSalt = `provable_salt_${resolvedPeriodId}_${Math.floor(Math.random() * 99999)}`;
        const seedHash = generateSeedHash(resolvedPeriodId, secretSalt);
        const resultNumber = deriveResultNumber(secretSalt);
        const { color, bigSmall } = calculateRoundDetails(resultNumber);

        const newCompletedRound: GameRound = {
          id: `round_${resolvedPeriodId}`,
          game_id: gameId,
          period_id: resolvedPeriodId,
          start_time: new Date(Date.now() - GAME_DURATIONS[gameId] * 1000).toISOString(),
          end_time: new Date().toISOString(),
          status: "completed",
          result_number: resultNumber,
          result_color: color,
          result_big_small: bigSmall,
          seed_hash: seedHash,
          secret_salt: secretSalt,
          total_bets_count: 156 + Math.floor(Math.random() * 50),
          total_points_wagered: 22000 + Math.floor(Math.random() * 8000),
          total_points_payout: 19500 + Math.floor(Math.random() * 6000),
          created_at: new Date(Date.now() - GAME_DURATIONS[gameId] * 1000).toISOString(),
          resolved_at: new Date().toISOString(),
        };

        setHistoryMap((prev) => ({
          ...prev,
          [gameId]: [newCompletedRound, ...(prev[gameId] || []).slice(0, 49)],
        }));

        setUserBets((prevBets) => {
          let userWonPointsTotal = 0;
          let userLostPointsTotal = 0;
          let hadBets = false;

          const updatedBets = prevBets.map((bet) => {
            if (bet.period_id === resolvedPeriodId && bet.status === "pending") {
              hadBets = true;
              const evalRes = evaluatePrediction(bet, resultNumber, color, bigSmall);
              if (evalRes.isWin) {
                userWonPointsTotal += evalRes.payoutPoints;
                return {
                  ...bet,
                  status: "won" as const,
                  payout_points: evalRes.payoutPoints,
                };
              } else {
                userLostPointsTotal += bet.total_bet_points;
                return {
                  ...bet,
                  status: "lost" as const,
                  payout_points: 0,
                };
              }
            }
            return bet;
          });

          if (hadBets) {
            if (userWonPointsTotal > 0) {
              setUser((prevUser) => {
                const newTotalWins = prevUser.total_wins + 1;
                const newAccuracy = Number(
                  ((newTotalWins / Math.max(1, prevUser.total_rounds_played)) * 100).toFixed(2)
                );
                return {
                  ...prevUser,
                  virtual_points: prevUser.virtual_points + userWonPointsTotal,
                  total_wins: newTotalWins,
                  accuracy_percentage: newAccuracy,
                };
              });

              setLedger((prev) => [
                {
                  id: `tx_won_${Date.now()}`,
                  user_id: user.id,
                  tx_type: "bet_won",
                  amount: userWonPointsTotal,
                  balance_after: user.virtual_points + userWonPointsTotal,
                  reference_id: resolvedPeriodId,
                  notes: `Won ${userWonPointsTotal} pts on Period ${resolvedPeriodId}`,
                  created_at: new Date().toISOString(),
                },
                ...prev,
              ]);

              sound.playWin();
              try {
                confetti({
                  particleCount: 120,
                  spread: 70,
                  origin: { y: 0.5 },
                });
              } catch {}
            } else if (userLostPointsTotal > 0) {
              setUser((prevUser) => {
                const newTotalLoss = prevUser.total_losses + 1;
                const newAccuracy = Number(
                  ((prevUser.total_wins / Math.max(1, prevUser.total_rounds_played)) * 100).toFixed(2)
                );
                return {
                  ...prevUser,
                  total_losses: newTotalLoss,
                  accuracy_percentage: newAccuracy,
                };
              });
              sound.playLose();
            }

            setLastResultPopup({
              isOpen: true,
              round: newCompletedRound,
              userWonAmount: userWonPointsTotal,
              userLostAmount: userLostPointsTotal,
            });
          }

          return updatedBets;
        });
      }

      previousPeriodRef.current = info.periodId;
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [gameId, user.id, user.virtual_points]);

  return (
    <GameContext.Provider
      value={{
        user,
        updateAvatar,
        updateUsername,
        gameId,
        setGameId,
        periodId,
        secondsRemaining,
        isLocked,
        history: historyMap[gameId] || [],
        userBets,
        activeBetModal,
        openBetModal,
        closeBetModal,
        placeBet,
        lastResultPopup,
        closeLastResultPopup,
        claimDailyReward,
        dailyClaimedToday,
        streakCount,
        wheelSpinsRemaining,
        spinLuckyWheel,
        claimReferralBonus,
        referralPointsClaimed,
        ledger,
        notifications,
        markNotificationRead,
        supportTickets,
        createSupportTicket,
        soundMuted,
        toggleSound,
        toggleAdminRole,
        adminAdjustPoints,
        adminChangeUserStatus,
        allUsers,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
