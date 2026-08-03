"use client";

import { useState, useEffect } from "react";
import { Mail, Search, Trash2, Reply } from "lucide-react";

interface ContactMessage {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/contact");
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessages(messages.filter((msg) => msg._id !== id));
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="font-serif text-[28px] md:text-[32px] font-medium text-[#0f3a2a] tracking-tight flex items-center gap-3">
              Contact Messages
              <Mail className="h-6 w-6 text-[#8b926d]" />
            </h1>
            <p className="text-[13px] text-slate-500 max-w-xl leading-relaxed">
              View and manage incoming contact messages from your website visitors.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search messages..."
                className="pl-9 pr-4 py-2.5 rounded-lg border border-black/[0.08] bg-[#F1EFE7]/50 text-[12px] font-medium text-slate-700 outline-none focus:border-[#073623]/30 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="rounded-xl border border-black/[0.06] bg-white p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-[18px] font-medium text-slate-800">Inbox</h2>
          <span className="px-2.5 py-1 rounded-full bg-[#073623]/[0.06] border border-[#073623]/15 text-[10px] font-bold text-[#073623] uppercase tracking-wide">
            {messages.length} Total
          </span>
        </div>

        <div className="space-y-3">
          {loading ? (
             <div className="py-10 text-center text-slate-500 text-[13px]">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400 border border-dashed border-black/[0.08] rounded-xl bg-[#F1EFE7]/40">
              <Mail className="h-10 w-10 text-slate-300 mb-3" />
              <p className="text-[12px] font-semibold text-slate-500">No messages found.</p>
              <p className="text-[11px] text-slate-400 mt-1">When users contact you, they will appear here.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg._id} className="p-5 rounded-xl border border-black/[0.05] bg-[#FDFBF7] flex flex-col gap-4 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[14px] font-semibold text-slate-800">{msg.firstName} {msg.lastName}</h3>
                    <p className="text-[12px] text-slate-500">{msg.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    <button 
                      onClick={() => window.location.href = `mailto:${msg.email}`}
                      className="p-1.5 rounded-md hover:bg-[#073623]/10 text-slate-400 hover:text-[#073623] transition-colors"
                      title="Reply"
                    >
                      <Reply className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => deleteMessage(msg._id)}
                      className="p-1.5 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white border border-black/[0.03]">
                  <p className="text-[13px] text-slate-700 whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
