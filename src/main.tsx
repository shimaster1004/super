import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import "./index.css";
import RootLayout from "./pages/layout.tsx"; // 전역 공통 레이아웃
import App from "./App.tsx"; // 메인 페이지
import SignUp from "./pages/auth/sign-up.tsx"; // 회원가입 페이지
import SignIn from "./pages/auth/sign-in.tsx"; // 로그인 페이지
import AuthCallback from "./pages/auth/callback.tsx"; // 소셜 로그인 콜백 페이지
import CreateTopic from "./pages/topic/create-topic.tsx"; // 토픽 작성 페이지
import DetailTopic from "./pages/topic/detail-topic.tsx"; // 토픽 상세 페이지 (조회 페이지)
import UpdateTopic from "./pages/topic/update-topic.tsx"; // 토픽 수정 페이지
import UserProfile from "./pages/user/profile.tsx"; // 유저 프로필 페이지

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          {/* ROOT */}
          <Route index element={<App />} />
          {/* AUTH */}
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          {/* USER */}
          <Route path="/user/:user_id/profile" element={<UserProfile />} />
          {/* TOPIC */}
          <Route path="/topic/:topic_id/create" element={<CreateTopic />} />
          <Route path="/topic/:topic_id" element={<DetailTopic />} />
          <Route path="/topic/:topic_id/edit" element={<UpdateTopic />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
