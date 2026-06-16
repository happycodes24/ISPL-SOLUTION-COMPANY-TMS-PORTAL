import Head from "next/head";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import TrainingTrends from "@/components/dashboard/TrainingTrends";
import ComplianceChart from "@/components/dashboard/ComplianceChart";
import UpcomingTrainings from "@/components/dashboard/UpcomingTrainings";
import ProgressCircle from "@/components/common/ProgressCircle";
import GlassCard from "@/components/common/GlassCard";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/utils/constants";
import { dashboardService } from "@/services/dashboard.service";
import { DashboardStat } from "@/types";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [completion, setCompletion] = useState({ rate: 0, completed: 0, inProgress: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    dashboardService
      .stats()
      .then((res) => {
        if (!active) return;
        setStats(res.stats);
        setCompletion(res.completion);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  };


  return (
    <MainLayout>
      <Head>
        <title>Dashboard · IAVISPL TMS</title>
      </Head>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--text-muted)]">
            {greeting()}, {user?.name.split(" ")[0]} · {user ? ROLE_LABELS[user.role] : ""}
          </p>
          <h1 className="font-display text-2xl font-700 text-[var(--text)] md:text-3xl">
            Training overview
          </h1>
        </div>
        <span className="rounded-full bg-iav-grad-soft px-3 py-1.5 text-xs font-600 text-iav-red">
          Fiscal Year 2026 · Q2
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-[148px] rounded-2xl" />
            ))
          : stats.map((s, i) => <StatCard key={s.key} stat={s} index={i} />)}
      </div>

      {/* Charts row */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrainingTrends />
        </div>
        <GlassCard className="flex flex-col items-center justify-center gap-4">
          <h3 className="self-start font-display text-lg font-600 text-[var(--text)]">
            Overall completion
          </h3>
          <ProgressCircle value={completion.rate} label="completed" />
          <div className="grid w-full grid-cols-2 gap-3 text-center">
            <div className="card p-3">
              <div className="font-display text-xl font-700 text-[var(--text)]">{completion.completed}</div>
              <div className="text-xs text-[var(--text-muted)]">Completed</div>
            </div>
            <div className="card p-3">
              <div className="font-display text-xl font-700 text-iav-red">{completion.inProgress}</div>
              <div className="text-xs text-[var(--text-muted)]">In progress</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Compliance + upcoming */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ComplianceChart />
        <UpcomingTrainings />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center text-xs text-[var(--text-muted)]"
      >
        IAVISPL Training Management System · Powered by Integral Solutions Private Limited
      </motion.p>
    </MainLayout>
  );
}
