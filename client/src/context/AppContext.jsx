import { createContext, useEffect, useMemo, useState } from "react";
import { mockLeads } from "../data/leads";

const defaultTasks = [
  { id: "post-task", title: "Write and post your social media content", completed: false }
];

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("dailyTasks");
    return stored ? JSON.parse(stored) : defaultTasks;
  });
  const [leads, setLeads] = useState(() => {
    const stored = localStorage.getItem("dashboardLeads");
    return stored ? JSON.parse(stored) : mockLeads;
  });
  const [completion, setCompletion] = useState({
    dashboard: 0.4,
    content: 0.2,
    chat: 0.6,
    followUp: 0.3,
    metrics: 0.5
  });

  const toggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const markReplied = (leadName) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.name === leadName ? { ...lead, replied: true, status: "active" } : lead
      )
    );
  };

  const markFollowUpDone = (leadName) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.name === leadName ? { ...lead, followUpDone: true } : lead
      )
    );
  };

  useEffect(() => {
    localStorage.setItem("dailyTasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("dashboardLeads", JSON.stringify(leads));
  }, [leads]);

  const value = useMemo(
    () => ({
      tasks,
      setTasks,
      toggleTask,
      leads,
      setLeads,
      markReplied,
      markFollowUpDone,
      completion,
      setCompletion
    }),
    [tasks, leads, completion]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
