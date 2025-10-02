"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { acceptInvitationsAfterSignup } from "../utils/acceptInvitationsAfterSignup";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // 🔹 NEW
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      let result;

      if (isLogin) {
        // 🔹 LOGIN
        result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) throw result.error;

        const user = result.data.user;

        if (user && username) {
          // 🔹 Update username if provided (row already exists via trigger)
          await supabase
            .from("user_profile")
            .update({ username })
            .eq("id", user.id);
        }

        Swal.fire("Welcome!", "Login successful", "success").then(() => {
          router.push("/dashboard");
        });
      } else {
        // 🔹 REGISTER
        result = await supabase.auth.signUp({ email, password });
        if (result.error) throw result.error;

        if (result.data.user) {
          // ✅ No insert needed — trigger handles it
          // 🔹 Handle invitations
          await acceptInvitationsAfterSignup(result.data.user.id, email);
        }

        Swal.fire(
          "Check your inbox 📩",
          "We sent you a confirmation link. Please verify your email before logging in.",
          "info"
        );
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Swal.fire("Input Required", "Enter your email first", "warning");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire(
        "Password Reset",
        "We sent a password reset link to your email 📩",
        "info"
      );
    }
  };

  return (
    <div className="modal_overlay">
      <div className="modal_content">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleAuth}>
          {/* Username input for BOTH login and register */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required={!isLogin} // required only on register
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password with eye icon */}
          <div style={{ position: "relative", marginBottom: "0.5rem" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", paddingRight: "2.5rem" }}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "10px",
                top: "35%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "1.2rem",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {isLogin && (
            <button
              type="button"
              onClick={handleForgotPassword}
              style={{
                display: "block",
                marginBottom: "1rem",
                background: "none",
                border: "none",
                color: "#3b82f6",
                cursor: "pointer",
                textAlign: "left",
                padding: 0,
                fontSize: "0.9rem",
              }}
            >
              Forgot Password?
            </button>
          )}

          <div className="modal_actions">
            <button type="submit" className="btn_primary">
              {isLogin ? "Login" : "Register"}
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{ marginLeft: "0.5rem" }}
            >
              {isLogin ? "Need an account? Register" : "Have an account? Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
