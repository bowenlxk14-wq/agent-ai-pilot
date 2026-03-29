import { useContext, useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { AppContext } from "../context/AppContext";

export default function Metrics() {
  const { leads, fetchRecentMetrics } = useContext(AppContext);
  const [dailyRates, setDailyRates] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetchRecentMetrics().then((data) => {
      if (mounted) setDailyRates(data);
    });
    return () => {
      mounted = false;
    };
  }, [fetchRecentMetrics]);

  const metrics = useMemo(() => {
    const totalLeads = leads.length;
    const leadsNeedingReply = leads.filter(
      (lead) => lead.status === "awaiting_reply"
    );
    const repliedLeads = leads.filter((lead) => lead.replied);
    const replyRate =
      leadsNeedingReply.length === 0
        ? 0
        : Math.round((repliedLeads.length / leadsNeedingReply.length) * 100);
    const appointmentsBooked = leads.filter(
      (lead) => lead.status === "Appointment Booked"
    ).length;
    const averageRate =
      dailyRates.length === 0
        ? 0
        : Math.round(
            dailyRates.reduce((sum, entry) => sum + entry.rate, 0) /
              dailyRates.length
          );

    return {
      totalLeads,
      replyRate,
      appointmentsBooked,
      averageRate
    };
  }, [leads, dailyRates]);

  const chartData = dailyRates.map((entry) => ({
    date: entry.date.slice(5),
    rate: entry.rate
  }));

  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <h2 className="font-display text-3xl">Metrics Dashboard</h2>
        <p className="text-ink-500 text-base">
          A quick performance overview based on the last 7 days.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-sand-100">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-500">Total Leads</p>
          <p className="text-4xl font-display mt-2">{metrics.totalLeads}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-sand-100">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-500">Reply Rate</p>
          <p className="text-4xl font-display mt-2">{metrics.replyRate}%</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-sand-100">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-500">
            Appointments Booked
          </p>
          <p className="text-4xl font-display mt-2">
            {metrics.appointmentsBooked}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-soft border border-sand-100">
          <p className="text-sm uppercase tracking-[0.2em] text-ink-500">
            Daily Execution Rate
          </p>
          <p className="text-4xl font-display mt-2">{metrics.averageRate}%</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-soft border border-sand-100 space-y-4">
        <h3 className="font-display text-xl">Last 7 Days</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="rate" fill="#1f6f8b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
