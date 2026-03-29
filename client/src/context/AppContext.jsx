import { createContext, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  limit
} from "firebase/firestore";
import { db } from "../firebase";
import { mockLeads } from "../data/leads";
import { useAuth } from "./AuthContext";

const defaultTasks = [
  { id: "post-task", title: "Write and post your social media content", completed: false }
];

const todayISO = () => new Date().toISOString().slice(0, 10);

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState(defaultTasks);
  const [leads, setLeads] = useState([]);
  const [completion, setCompletion] = useState({
    dashboard: 0.4,
    content: 0.2,
    chat: 0.6,
    followUp: 0.3,
    metrics: 0.5
  });

  const loadDailyTasks = async () => {
    if (!user) return;
    const date = todayISO();
    const taskRef = doc(db, "users", user.uid, "dailyTasks", date);
    const snapshot = await getDoc(taskRef);
    if (snapshot.exists()) {
      setTasks(snapshot.data().tasks || defaultTasks);
    } else {
      await setDoc(taskRef, { date, tasks: defaultTasks });
      setTasks(defaultTasks);
    }
  };

  const loadLeads = async () => {
    if (!user) return;
    const leadsRef = collection(db, "users", user.uid, "leads");
    const snapshot = await getDocs(leadsRef);
    if (snapshot.empty) {
      const seeded = await Promise.all(
        mockLeads.map((lead) =>
          addDoc(leadsRef, {
            ...lead,
            source: lead.source || "Referral",
            notes: lead.lastMessage || "",
            status: lead.status || "active"
          })
        )
      );
      const seedDocs = await Promise.all(seeded.map((ref) => getDoc(ref)));
      setLeads(seedDocs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
    } else {
      setLeads(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })));
    }
  };

  useEffect(() => {
    if (!user) return;
    loadDailyTasks();
    loadLeads();
  }, [user]);

  const toggleTask = (taskId) => {
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      if (user) {
        const taskRef = doc(db, "users", user.uid, "dailyTasks", todayISO());
        setDoc(taskRef, { date: todayISO(), tasks: updated }, { merge: true });
      }
      return updated;
    });
  };

  const updateLead = (leadId, updates) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, ...updates } : lead))
    );
    if (user) {
      const leadRef = doc(db, "users", user.uid, "leads", leadId);
      updateDoc(leadRef, updates);
    }
  };

  const markReplied = (leadId) => {
    updateLead(leadId, { replied: true, status: "active" });
  };

  const markFollowUpDone = (leadId) => {
    updateLead(leadId, { followUpDone: true });
  };

  const addLead = async (leadData) => {
    if (!user) return;
    const leadsRef = collection(db, "users", user.uid, "leads");
    const docRef = await addDoc(leadsRef, leadData);
    const snapshot = await getDoc(docRef);
    setLeads((prev) => [{ id: snapshot.id, ...snapshot.data() }, ...prev]);
  };

  const recordDailyRate = async (rate) => {
    if (!user) return;
    const date = todayISO();
    const metricRef = doc(db, "users", user.uid, "metrics", date);
    await setDoc(metricRef, { date, rate }, { merge: true });
  };

  const fetchRecentMetrics = async () => {
    if (!user) return [];
    const metricsRef = collection(db, "users", user.uid, "metrics");
    const metricsQuery = query(metricsRef, orderBy("date", "desc"), limit(7));
    const snapshot = await getDocs(metricsQuery);
    return snapshot.docs.map((docSnap) => docSnap.data()).reverse();
  };

  const value = useMemo(
    () => ({
      tasks,
      setTasks,
      toggleTask,
      leads,
      setLeads,
      addLead,
      markReplied,
      markFollowUpDone,
      updateLead,
      recordDailyRate,
      fetchRecentMetrics,
      completion,
      setCompletion
    }),
    [tasks, leads, completion, user]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
