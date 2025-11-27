import supabase from "@/utils/supabase";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthStore, User } from "@/types";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (newUser: User | null) => set({ user: newUser }),

      // 로그아웃 (상태 + Supabase 세션 모두 제거)
      reset: async () => {
        await supabase.auth.signOut();

        set({ user: null }); // Zustand 상태 초기화
        localStorage.removeItem("auth-storage"); // 로컬스토리지 auth-storage 제거
      },
    }),
    { name: "auth-storage" }
  )
);
