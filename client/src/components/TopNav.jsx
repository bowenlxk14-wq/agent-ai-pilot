import { useAuth } from "../context/AuthContext";

const tabs = [
  "Dashboard",
  "Content",
  "Chat",
  "Follow-Up",
  "Metrics"
];

export default function TopNav({ activeTab, onTabChange }) {
  const { signOut } = useAuth();
  return (
    <nav className="bg-white/80 backdrop-blur border-b border-sand-100 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-ink-500">Agent AI-Pilot</p>
              <h1 className="font-display text-2xl text-ink-900">Daily Assistant for Solo Brokers</h1>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-ink-500">Session: Single User</span>
              <button
                type="button"
                onClick={signOut}
                className="h-10 px-4 rounded-full bg-ink-900 text-white text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`h-11 px-4 rounded-full text-base font-medium whitespace-nowrap transition ${
                  activeTab === tab
                    ? "bg-ink-900 text-white shadow-soft"
                    : "bg-sand-100 text-ink-700 hover:bg-sand-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={signOut}
              className="h-11 px-4 rounded-full bg-ink-900 text-white text-base font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
