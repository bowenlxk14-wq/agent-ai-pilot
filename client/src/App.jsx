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
import { useContext } from "react";
import { AppContext } from "./context/AppContext";

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
          <AppBody ActivePage={ActivePage} />
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

function AppBody({ ActivePage }) {
  const { dataLoading } = useContext(AppContext);

  if (dataLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-sand-100 rounded-xl animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-48 bg-white rounded-2xl border border-sand-100 shadow-soft animate-pulse" />
          <div className="h-48 bg-white rounded-2xl border border-sand-100 shadow-soft animate-pulse" />
        </div>
        <div className="h-64 bg-white rounded-2xl border border-sand-100 shadow-soft animate-pulse" />
      </div>
    );
  }

  return <ActivePage />;
}
