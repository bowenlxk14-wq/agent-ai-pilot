import { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const stages = ["Day 1", "Day 3", "Day 7", "Completed"];
const sources = ["Instagram", "WeChat", "Referral", "Other"];

const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (dateString, days) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

export default function FollowUp() {
  const { leads, addLead, updateLead } = useContext(AppContext);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    source: sources[0],
    notes: ""
  });
  const [modal, setModal] = useState({
    open: false,
    loading: false,
    message: "",
    lead: null,
    error: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    const newLead = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      source: form.source,
      notes: form.notes.trim(),
      lastMessage: form.notes.trim(),
      replied: false,
      followUpDone: false,
      stage: "Day 1",
      followUpStage: "Day 1",
      nextFollowUpDate: todayISO(),
      status: "Active"
    };
    addLead(newLead);
    setForm({ name: "", phone: "", source: sources[0], notes: "" });
  };

  const advanceStage = (leadId) => {
    const lead = leads.find((item) => item.id === leadId);
    if (!lead) return;
    const currentIndex = stages.indexOf(lead.stage);
    const nextStage = stages[Math.min(currentIndex + 1, stages.length - 1)];
    const nextDate =
      nextStage === "Day 3"
        ? addDays(todayISO(), 2)
        : nextStage === "Day 7"
          ? addDays(todayISO(), 4)
          : "-";
    updateLead(leadId, {
      stage: nextStage,
      followUpStage: nextStage,
      nextFollowUpDate: nextDate,
      status: nextStage === "Completed" ? "Completed" : lead.status
    });
  };

  const pauseLead = (leadId) => {
    updateLead(leadId, { status: "Paused" });
  };

  const markAppointmentBooked = (leadId) => {
    updateLead(leadId, { status: "Appointment Booked" });
  };

  const openSuggestedMessage = async (lead) => {
    setModal({ open: true, loading: true, message: "", lead, error: "" });
    try {
      const response = await fetch("http://localhost:3001/api/tracker/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadName: lead.name, stage: lead.stage })
      });
      if (!response.ok) {
        throw new Error("Unable to load suggested message.");
      }
      const data = await response.json();
      setModal((prev) => ({
        ...prev,
        loading: false,
        message: data.message || ""
      }));
    } catch (err) {
      setModal((prev) => ({
        ...prev,
        loading: false,
        error: err.message || "Something went wrong."
      }));
    }
  };

  const closeModal = () => {
    setModal({ open: false, loading: false, message: "", lead: null, error: "" });
  };

  const activeLeads = leads;

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h2 className="font-display text-3xl">Follow-Up Rhythm Tracker</h2>
        <p className="text-ink-500 text-base">
          Keep outreach consistent with a respectful, non-harassment cadence.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 shadow-soft border border-sand-100 space-y-4"
      >
        <h3 className="font-display text-xl">Add New Lead</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-[0.2em] text-ink-500">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-sand-50 border border-sand-100 text-base"
              placeholder="Lead name"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-[0.2em] text-ink-500">
              Phone (optional)
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-sand-50 border border-sand-100 text-base"
              placeholder="(555) 123-4567"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-[0.2em] text-ink-500">
              Source
            </label>
            <select
              name="source"
              value={form.source}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-sand-50 border border-sand-100 text-base"
            >
              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-[0.2em] text-ink-500">
              Notes
            </label>
            <input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl bg-sand-50 border border-sand-100 text-base"
              placeholder="Context or reminders"
            />
          </div>
        </div>
        <button
          type="submit"
          className="h-12 px-5 rounded-xl bg-ink-900 text-white text-base font-medium"
        >
          Add Lead
        </button>
      </form>

      <div className="bg-white rounded-2xl p-6 shadow-soft border border-sand-100 space-y-4 overflow-x-auto">
        <h3 className="font-display text-xl">Follow-Up Schedule</h3>
        <table className="w-full text-left text-base">
          <thead className="text-sm uppercase tracking-[0.2em] text-ink-500">
            <tr>
              <th className="py-3">Name</th>
              <th className="py-3">Stage</th>
              <th className="py-3">Next Follow-Up Date</th>
              <th className="py-3">Status</th>
              <th className="py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {activeLeads.map((lead) => (
              <tr key={lead.id} className="align-top">
                <td className="py-4">
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-ink-500">{lead.source}</p>
                </td>
                <td className="py-4">{lead.stage}</td>
                <td className="py-4">{lead.nextFollowUpDate}</td>
                <td className="py-4">{lead.status}</td>
                <td className="py-4">
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => advanceStage(lead.id)}
                      className="h-11 px-4 rounded-xl bg-ink-900 text-white text-base font-medium"
                    >
                      Mark Contacted
                    </button>
                    <button
                      type="button"
                      onClick={() => markAppointmentBooked(lead.id)}
                      className="h-11 px-4 rounded-xl bg-emerald-600 text-white text-base font-medium"
                    >
                      Mark Appointment Booked
                    </button>
                    <button
                      type="button"
                      onClick={() => pauseLead(lead.id)}
                      className="h-11 px-4 rounded-xl bg-sand-100 text-ink-700 text-base font-medium"
                    >
                      Pause
                    </button>
                    <button
                      type="button"
                      onClick={() => openSuggestedMessage(lead)}
                      className="h-11 px-4 rounded-xl border border-sand-100 text-ink-700 text-base font-medium"
                    >
                      View Suggested Message
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {activeLeads.length === 0 && (
              <tr>
                <td className="py-4 text-sm text-ink-500" colSpan={5}>
                  No leads yet. Add your first follow-up lead above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal.open && (
        <div className="fixed inset-0 bg-ink-900/40 flex items-center justify-center px-4 z-30">
          <div className="bg-white rounded-2xl p-6 shadow-soft max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl">Suggested Message</h3>
                <p className="text-sm text-ink-500">
                  {modal.lead?.name} · {modal.lead?.stage}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="h-10 px-3 rounded-xl bg-sand-100 text-ink-700 text-base"
              >
                Close
              </button>
            </div>
            {modal.loading && (
              <p className="text-sm text-ink-500">Generating message...</p>
            )}
            {modal.error && <p className="text-sm text-rose-500">{modal.error}</p>}
            {modal.message && (
              <div className="p-4 rounded-xl bg-sand-50 text-base leading-relaxed">
                {modal.message}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
