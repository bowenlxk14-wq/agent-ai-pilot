import { useState } from "react";

import apiBase from "../apiBase";

export default function Chat() {
  const [clientMessage, setClientMessage] = useState("");
  const [mode, setMode] = useState("trust");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!clientMessage.trim()) {
      setError("Please paste a client message first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiBase}/api/chat/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientMessage, mode })
      });
      if (!response.ok) {
        throw new Error("Unable to generate reply.");
      }
      const data = await response.json();
      setReply(data.reply || "");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!reply) return;
    await navigator.clipboard.writeText(reply);
  };

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h2 className="font-display text-3xl">Chat Assistant</h2>
        <p className="text-ink-500 text-base">
          Draft professional, human replies to client messages.
        </p>
      </header>

      <div className="bg-white rounded-2xl p-6 shadow-soft border border-sand-100 space-y-5">
        <div className="space-y-2">
          <label className="text-sm uppercase tracking-[0.2em] text-ink-500">
            Paste the client's message here
          </label>
          <textarea
            value={clientMessage}
            onChange={(event) => setClientMessage(event.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-sand-50 border border-sand-100 text-base"
            placeholder="Paste the client message..."
          />
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <button
            type="button"
            onClick={() => setMode("trust")}
            className={`h-12 px-4 rounded-xl text-base font-medium border ${
              mode === "trust"
                ? "bg-ink-900 text-white border-ink-900"
                : "bg-white text-ink-700 border-sand-100"
            }`}
          >
            🤝 Trust Mode — build rapport, do not push
          </button>
          <button
            type="button"
            onClick={() => setMode("conversion")}
            className={`h-12 px-4 rounded-xl text-base font-medium border ${
              mode === "conversion"
                ? "bg-ink-900 text-white border-ink-900"
                : "bg-white text-ink-700 border-sand-100"
            }`}
          >
            🎯 Conversion Mode — guide toward sharing contact info or booking appointment
          </button>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="h-12 px-5 rounded-xl bg-ink-900 text-white text-base font-medium disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate Reply"}
        </button>
        {error && <p className="text-sm text-rose-500">{error}</p>}
      </div>

      {reply && (
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-sand-100 space-y-4">
          <div>
            <h3 className="font-display text-xl">Suggested Reply</h3>
            <p className="text-sm text-ink-500">Ready to send or personalize.</p>
          </div>
          <div className="p-4 rounded-xl bg-sand-50 text-base leading-relaxed">
            {reply}
          </div>
          <button
            type="button"
            onClick={copyToClipboard}
            className="h-11 px-4 rounded-xl bg-ink-900 text-white text-base font-medium"
          >
            Copy Reply
          </button>
        </div>
      )}
    </section>
  );
}
