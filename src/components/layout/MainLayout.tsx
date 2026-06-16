import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "@/context/AuthContext";
import LoadingAnimation from "@/components/common/LoadingAnimation";

export default function MainLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--bg)]">
        <LoadingAnimation label="Loading workspace" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Sidebar open={open} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onToggleSidebar={() => setOpen((o) => !o)} />
        <motion.main
          key={router.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex-1 px-4 py-6 md:px-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
