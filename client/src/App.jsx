import { useState } from "react";
import { AppProvider } from "./context/AppContext";
import TopNav from "./components/TopNav";
import Dashboard from "./pages/Dashboard";
import Content from "./pages/Content";
import Chat from "./pages/Chat";
import FollowUp from "./pages/FollowUp";
import Metrics from "./pages/Metrics";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";

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
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState("login");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-500">
        Loading...
      </div>
    );
  }

  if (!user) {
    return authView === "login" ? (
      <Login onSwitch={() => setAuthView("register")} />
    ) : (
      <Register onSwitch={() => setAuthView("login")} />
    );
  }

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
