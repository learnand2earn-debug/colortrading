"use client";

import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { MessageCircle, X, Send, LifeBuoy, CheckCircle } from "lucide-react";

export const SupportWidget: React.FC = () => {
  const { supportTickets, createSupportTicket } = useGame();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");
  const [subject, setSubject] = useState<string>("");
  const [category, setCategory] = useState<string>("gameplay");
  const [message, setMessage] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    createSupportTicket(subject, category, message);
    setSubject("");
    setMessage("");
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setActiveTab("history");
    }, 1500);
  };

  return (
    <>
      {/* Floating launcher button matching user photo */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-game-green to-emerald-400 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,184,92,0.4)] hover:scale-110 active:scale-95 transition-all border-2 border-white"
        title="24/7 Virtual Support"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white animate-ping" />
      </button>

      {/* Support Chat / Ticket Drawer Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 shadow-2xl flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-game-green flex items-center justify-center">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Player Support & Help</h3>
                  <span className="text-[10px] text-game-green font-bold">Online & Ready to Help</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 mb-3">
              <button
                type="button"
                onClick={() => setActiveTab("new")}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "new"
                    ? "bg-game-green text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                New Ticket
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "history"
                    ? "bg-game-green text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                My Tickets ({supportTickets.length})
              </button>
            </div>

            {/* Tab 1: New Ticket Form */}
            {activeTab === "new" && (
              <form onSubmit={handleSubmit} className="space-y-3 overflow-y-auto pr-1">
                {submitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <CheckCircle className="w-8 h-8 text-game-green mx-auto" />
                    <p className="text-sm font-black text-slate-900">Ticket Submitted!</p>
                    <p className="text-xs text-slate-600">
                      Our automated support agent has received your request and will respond shortly.
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-game-green"
                      >
                        <option value="gameplay">Game Rules & Payouts</option>
                        <option value="account">Account & Virtual Points</option>
                        <option value="streak">Daily Streak & Rewards</option>
                        <option value="bug">Technical Bug / Feedback</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Brief summary of your question"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-game-green"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Message
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your issue or feedback in detail..."
                        rows={4}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-game-green"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-game-green text-white font-black text-xs shadow-neon-green hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Ticket</span>
                    </button>
                  </>
                )}
              </form>
            )}

            {/* Tab 2: Ticket History */}
            {activeTab === "history" && (
              <div className="space-y-3 overflow-y-auto max-h-[350px] pr-1">
                {supportTickets.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">
                    No support tickets found.
                  </p>
                ) : (
                  supportTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate max-w-[200px]">
                          {ticket.subject}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ticket.status === "resolved"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>

                      {ticket.replies && ticket.replies.length > 0 && (
                        <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
                          <span className="text-[10px] text-game-green font-bold block">
                            {ticket.replies[ticket.replies.length - 1].sender_name}:
                          </span>
                          <p>{ticket.replies[ticket.replies.length - 1].message}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
