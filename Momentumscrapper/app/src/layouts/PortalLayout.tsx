import { useState } from "react";
import { Link, useLocation } from "react-router";
import {
  LayoutDashboard, Radar, BarChart3, History, Wallet,
  Settings, Bell, Search, Menu, X, TrendingUp, Activity
} from "lucide-react";
import { useTranslation, LangSwitcher } from "@/i18n/I18nContext";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { path: "/", label: t("layout.dashboard"), icon: LayoutDashboard },
    { path: "/scan", label: t("layout.scan"), icon: Radar },
    { path: "/analysis", label: t("layout.analysis"), icon: BarChart3 },
    { path: "/history", label: t("layout.history"), icon: History },
    { path: "/portfolio", label: t("layout.portfolio"), icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/60 transition-all duration-300 ${
          sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:w-16 lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-800/60">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-sm font-bold text-white leading-tight">NASDAQ Scanner</h1>
                <p className="text-[10px] text-slate-400">{t("layout.version")}</p>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-emerald-400" : ""}`} />
                  {sidebarOpen && <span>{item.label}</span>}
                  {isActive && sidebarOpen && (
                    <Activity className="w-3.5 h-3.5 ml-auto text-emerald-400 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          {sidebarOpen && (
            <div className="p-4 border-t border-slate-800/60">
              <div className="bg-slate-800/40 rounded-xl p-3">
                <p className="text-[10px] text-slate-500 mb-1">{t("layout.marketStatus")}</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-medium">{t("layout.bull")}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">SPY 9EMA &gt; 20EMA</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800/60 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <div className="hidden md:flex items-center gap-2 bg-slate-800/40 rounded-lg px-3 py-1.5 border border-slate-700/40">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder={t("layout.searchPlaceholder")}
                className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-48"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LangSwitcher />
            <button className="relative p-2 rounded-lg bg-slate-800/40 text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-slate-800/40 rounded-lg px-3 py-1.5 border border-slate-700/40">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold">
                U
              </div>
              <span className="text-sm text-slate-300">{t("layout.user")}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
