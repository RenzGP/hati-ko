"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (isLogin) {
        //  LOGIN
        result = await supabase.auth.signInWithPassword({ email, password });

        if (result.error) throw result.error;

        // check if profile exists
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", result.data.user.id)
          .single();

        if (!profileData && !profileError) {
          // insert profile on first login
          await supabase.from("profiles").insert({
            id: result.data.user.id,
            email: email,
          });
        }

        Swal.fire("Welcome!", "Login successful", "success").then(() => {
          router.push("/dashboard");
        });

      } else {
        // ✅ REGISTER
        result = await supabase.auth.signUp({ email, password });

        if (result.error) throw result.error;

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

  return (
    <div className="modal_overlay">
      <div className="modal_content">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="modal_actions">
            <button type="submit" className="btn_primary">
              {isLogin ? "Login" : "Register"}
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Need an account? Register" : "Have an account? Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
