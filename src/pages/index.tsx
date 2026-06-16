import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { BRAND } from "@/utils/constants";

export default function Splash() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => {
      if (loading) return;
      router.replace(user ? "/dashboard" : "/login");
    }, 1900);
    return () => clearTimeout(t);
  }, [loading, user, router]);

  return (
    <div className="grid min-h-screen place-items-center bg-surface-night text-white">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Image src="/logo-mark.svg" alt="IAV" width={92} height={92} priority />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 font-display text-2xl font-700 tracking-tight"
        >
          IAVISPL <span className="text-iav-red">TMS</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-1 text-sm text-white/50"
        >
          {BRAND.poweredBy}
        </motion.p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 180 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mt-8 h-0.5 overflow-hidden rounded-full bg-white/10"
        >
          <div className="h-full w-1/2 animate-[shimmer_1.4s_infinite] bg-iav-grad" />
        </motion.div>
      </div>
    </div>
  );
}
