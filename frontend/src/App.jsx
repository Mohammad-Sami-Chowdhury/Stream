import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import OtpVerifyPage from "./pages/OtpVerifyPage.jsx"; // 🆕 OTP Verify page

import PageLoader from "./components/PageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import { useThemeStore } from "./store/useThemeStore.js";
import Friends from "./pages/Friends.jsx";
import PasswordReset from "./pages/PasswordReset.jsx";
import PasswordOtp from "./pages/PasswordOtp.jsx";
import PasswordResetPage from "./pages/PasswordResetPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ChattingPage from "./pages/ChattingPage.jsx";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  const isAuthenticated = Boolean(authUser && authUser.verified);
  const isVerified = authUser?.verified;
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <PageLoader />;

  return (
    <div className="h-screen" data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              !isVerified ? (
                <Navigate to="/verify-otp" />
              ) : isOnboarded ? (
                <Layout showSidebar={true}>
                  <HomePage />
                </Layout>
              ) : (
                <Navigate to="/onboarding" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignUpPage />
            ) : !isVerified ? (
              <Navigate to="/verify-otp" />
            ) : isOnboarded ? (
              <Navigate to="/" />
            ) : (
              <Navigate to="/onboarding" />
            )
          }
        />

        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : !isVerified ? (
              <Navigate to="/verify-otp" />
            ) : isOnboarded ? (
              <Navigate to="/" />
            ) : (
              <Navigate to="/onboarding" />
            )
          }
        />
        <Route
          path="/reset-password-email"
          element={!isAuthenticated ? <PasswordReset /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={
            isAuthenticated && isVerified && isOnboarded ? (
              <Layout showSidebar={true}>
                <ProfilePage />
              </Layout>
            ) : !isAuthenticated ? (
              <Navigate to="/login" />
            ) : !isVerified ? (
              <Navigate to="/verify-otp" />
            ) : (
              <Navigate to="/onboarding" />
            )
          }
        />

        <Route
          path="/reset-password-otp"
          element={!isAuthenticated ? <PasswordOtp /> : <Navigate to="/" />}
        />

        <Route
          path="/reset-password"
          element={
            !isAuthenticated ? <PasswordResetPage /> : <Navigate to="/" />
          }
        />

        <Route
          path="/verify-otp"
          element={
            isAuthenticated && !isVerified ? (
              <OtpVerifyPage />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/onboarding"
          element={
            isAuthenticated ? (
              !isVerified ? (
                <Navigate to="/verify-otp" />
              ) : !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/notifications"
          element={
            isAuthenticated && isVerified && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : !isAuthenticated ? (
              <Navigate to="/login" />
            ) : !isVerified ? (
              <Navigate to="/verify-otp" />
            ) : (
              <Navigate to="/onboarding" />
            )
          }
        />

        <Route
          path="/friends"
          element={
            isAuthenticated && isVerified && isOnboarded ? (
              <Layout showSidebar={true}>
                <Friends />
              </Layout>
            ) : !isAuthenticated ? (
              <Navigate to="/login" />
            ) : !isVerified ? (
              <Navigate to="/verify-otp" />
            ) : (
              <Navigate to="/onboarding" />
            )
          }
        />

        <Route
          path="/call/:id"
          element={
            isAuthenticated && isVerified && isOnboarded ? (
              <CallPage />
            ) : !isAuthenticated ? (
              <Navigate to="/login" />
            ) : !isVerified ? (
              <Navigate to="/verify-otp" />
            ) : (
              <Navigate to="/onboarding" />
            )
          }
        />

        <Route
          path="/chat"
          element={
            isAuthenticated && isVerified && isOnboarded ? (
              <Layout showSidebar={true}>
                <ChattingPage />
              </Layout>
            ) : !isAuthenticated ? (
              <Navigate to="/login" />
            ) : !isVerified ? (
              <Navigate to="/verify-otp" />
            ) : (
              <Navigate to="/onboarding" />
            )
          }
        />

        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isVerified && isOnboarded ? (
              <Layout showSidebar={true}>
                <ChatPage />
              </Layout>
            ) : !isAuthenticated ? (
              <Navigate to="/login" />
            ) : !isVerified ? (
              <Navigate to="/verify-otp" />
            ) : (
              <Navigate to="/onboarding" />
            )
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
