import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import TopNav from "./components/TopNav";
import Dashboard from "./pages/Dashboard";
import Content from "./pages/Content";
import Chat from "./pages/Chat";
import FollowUp from "./pages/FollowUp";
import Metrics from "./pages/Metrics";

const tabs = {
  Dashboard,
  Content,
  Chat,
  "Follow-Up": FollowUp,
  Metrics
};

export default function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const ActivePage = tabs[activeTab];

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-sea-100">
        <TopNav activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <ActivePage />
        </main>
        <footer className="max-w-6xl mx-auto px-4 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-sand-100 px-4 py-2 text-sm text-ink-700">
            <span>⚠️ Compliance</span>
            <span>All AI content is filtered for regulatory compliance.</span>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}
