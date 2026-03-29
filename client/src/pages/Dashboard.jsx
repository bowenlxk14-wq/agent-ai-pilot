import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";

export default function Dashboard() {
  const { tasks, leads, toggleTask, markReplied, markFollowUpDone } =
    useContext(AppContext);
  const today = new Date().toISOString().slice(0, 10);
  const awaitingReplies = leads.filter(
    (lead) => lead.status === "awaiting_reply" && !lead.replied
  );
  const followUpsToday = leads.filter(
    (lead) => lead.followUpDate === today && !lead.followUpDone
  );

  const totalTasks =
    tasks.length + awaitingReplies.length + followUpsToday.length;
  const completedTasks =
    tasks.filter((task) => task.completed).length +
    leads.filter((lead) => lead.replied).length +
    leads.filter((lead) => lead.followUpDone).length;
  const rate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const rateColor =
    rate >= 80 ? "text-emerald-600" : rate >= 50 ? "text-amber-500" : "text-rose-500";

  useEffect(() => {
    if (totalTasks === 0) return;
    const stored = localStorage.getItem("dailyExecutionRates");
    const rates = stored ? JSON.parse(stored) : [];
    const todayEntry = { date: today, rate };
    const updated = rates.filter((entry) => entry.date !== today);
    updated.push(todayEntry);
    const trimmed = updated.slice(-7);
    localStorage.setItem("dailyExecutionRates", JSON.stringify(trimmed));
  }, [rate, today, totalTasks]);

  return (
    <section className="space-y-8">
      <header className="space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-ink-500">Today</p>
          <h2 className="font-display text-3xl">{today}</h2>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-sand-100 flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-500">
            Daily Execution Rate
          </p>
          <div className="flex items-end gap-3">
            <p className={`font-display text-5xl ${rateColor}`}>{rate}%</p>
            <p className="text-sm text-ink-500">
              {completedTasks} of {totalTasks} tasks complete
            </p>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-sand-100 space-y-4">
          <div>
            <h3 className="font-display text-xl">Today's Post</h3>
            <p className="text-sm text-ink-500">Keep your pipeline warm.</p>
          </div>
          {tasks.map((task) => (
            <label
              key={task.id}
              className="flex items-center justify-between gap-4 p-4 rounded-xl bg-sand-50"
            >
              <div>
                <p className="text-base font-medium">{task.title}</p>
                <p className="text-sm text-ink-500">AI-generated content task</p>
              </div>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="h-6 w-6 accent-ink-900"
              />
            </label>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-sand-100 space-y-4">
          <div>
            <h3 className="font-display text-xl">Replies Needed</h3>
            <p className="text-sm text-ink-500">Leads waiting on your reply.</p>
          </div>
          <div className="space-y-3">
            {awaitingReplies.length === 0 && (
              <p className="text-sm text-ink-500">No replies needed today.</p>
            )}
            {awaitingReplies.map((lead) => (
              <div
                key={lead.name}
                className="flex flex-col gap-3 p-4 rounded-xl bg-sand-50"
              >
                <div>
                  <p className="text-base font-medium">{lead.name}</p>
                  <p className="text-sm text-ink-500">{lead.lastMessage}</p>
                </div>
                <button
                  type="button"
                  onClick={() => markReplied(lead.name)}
                  className="h-11 px-4 rounded-xl bg-ink-900 text-white text-base font-medium"
                >
                  Mark Replied
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-soft border border-sand-100 space-y-4">
          <div>
            <h3 className="font-display text-xl">Follow-Ups Today</h3>
            <p className="text-sm text-ink-500">Scheduled outreach due today.</p>
          </div>
          <div className="space-y-3">
            {followUpsToday.length === 0 && (
              <p className="text-sm text-ink-500">No follow-ups due today.</p>
            )}
            {followUpsToday.map((lead) => (
              <div
                key={lead.name}
                className="flex flex-col gap-3 p-4 rounded-xl bg-sand-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-medium">{lead.name}</p>
                    <p className="text-sm text-ink-500">{lead.followUpStage}</p>
                  </div>
                  <span className="text-xs text-ink-500">{lead.stage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => markFollowUpDone(lead.name)}
                  className="h-11 px-4 rounded-xl bg-ink-900 text-white text-base font-medium"
                >
                  Mark Done
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
