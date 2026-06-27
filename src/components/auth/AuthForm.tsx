"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Tabs } from "@/components/ui/Tabs";

function safeRedirect(path: string | null) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }
  if (path === "/login" || path.startsWith("/admin/login")) {
    return "/";
  }
  return path;
}

function formatAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("rate limit")) {
    return "Too many emails were sent recently. Wait a few minutes, then try again—or check your inbox for an earlier confirmation or reset link.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Confirm your email before signing in. Check your inbox for the confirmation link we sent when you signed up.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Incorrect email or password. Try again or use Forgot password.";
  }

  if (normalized.includes("user already registered")) {
    return "An account with this email already exists. Sign in instead, or use Forgot password.";
  }

  return message;
}

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unauthorized = searchParams.get("error") === "unauthorized";
  const redirectTo = safeRedirect(searchParams.get("redirect"));

  const [mode, setMode] = useState<"signin" | "signup" | "forgot" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(
    unauthorized
      ? "You need an admin account to access that area."
      : null,
  );
  const [messageVariant, setMessageVariant] = useState<"error" | "success" | "info">(
    unauthorized ? "error" : "info",
  );

  useEffect(() => {
    if (searchParams.get("recovery") === "1") {
      setMode("reset");
    }

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("reset");
        setMessage(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [searchParams]);

  async function redirectAfterAuth(userId: string) {
    const supabase = createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    const destination =
      profile?.role === "admin"
        ? redirectTo.startsWith("/admin")
          ? redirectTo
          : "/admin"
        : redirectTo;

    router.push(destination);
    router.refresh();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    if (mode === "reset") {
      if (password !== confirmPassword) {
        setMessage("Passwords do not match.");
        setMessageVariant("error");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setMessage(formatAuthError(error.message));
        setMessageVariant("error");
        setLoading(false);
        return;
      }

      setMessage("Password updated. You are signed in.");
      setMessageVariant("success");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await redirectAfterAuth(user.id);
        return;
      }

      setMode("signin");
      setLoading(false);
      return;
    }

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?recovery=1`,
      });

      if (error) {
        setMessage(formatAuthError(error.message));
        setMessageVariant("error");
        setLoading(false);
        return;
      }

      setMessage(
        `We sent a password reset link to ${email}. Check your inbox and follow the link to choose a new password.`,
      );
      setMessageVariant("success");
      setMode("signin");
      setLoading(false);
      return;
    }

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setMessage(formatAuthError(error.message));
        setMessageVariant("error");
        setLoading(false);
        return;
      }

      setMessage(
        `We sent a confirmation link to ${email}. Check your inbox, confirm your email, then sign in to start ordering.`,
      );
      setMessageVariant("success");
      setMode("signin");
      setPassword("");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(formatAuthError(error.message));
      setMessageVariant("error");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Unable to verify session.");
      setMessageVariant("error");
      setLoading(false);
      return;
    }

    await redirectAfterAuth(user.id);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-brand-900">
          {mode === "forgot"
            ? "Reset password"
            : mode === "reset"
              ? "Choose a new password"
              : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {mode === "forgot"
            ? "Enter your email and we will send you a link to reset your password."
            : mode === "reset"
              ? "Enter and confirm your new password below."
              : "Sign in to browse the menu and place your order."}
        </p>
      </div>

      {mode === "signin" || mode === "signup" ? (
        <Tabs
          tabs={[
            { id: "signin", label: "Sign in" },
            { id: "signup", label: "Sign up" },
          ]}
          activeTab={mode}
          onChange={(id) => {
            setMode(id as "signin" | "signup");
            setMessage(null);
          }}
        />
      ) : null}

      {message ? <Alert variant={messageVariant}>{message}</Alert> : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode !== "reset" ? (
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        ) : null}
        {mode !== "forgot" ? (
          <div>
            {mode === "reset" ? (
              <Label htmlFor="password">New password</Label>
            ) : (
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <Label htmlFor="password" className="mb-0">
                  Password
                </Label>
                {mode === "signin" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setMessage(null);
                    }}
                    className="text-xs font-medium text-brand-700 transition hover:text-brand-900"
                  >
                    Forgot password?
                  </button>
                ) : null}
              </div>
            )}
            <PasswordInput
              id="password"
              autoComplete={
                mode === "signup" || mode === "reset" ? "new-password" : "current-password"
              }
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
        ) : null}
        {mode === "reset" ? (
          <div>
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <PasswordInput
              id="confirm-password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>
        ) : null}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading
            ? "Please wait..."
            : mode === "signin"
              ? "Sign in"
              : mode === "signup"
                ? "Create account"
                : mode === "reset"
                  ? "Update password"
                  : "Send reset link"}
        </Button>
        {mode === "forgot" ? (
          <p className="text-center text-sm text-muted">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setMessage(null);
              }}
              className="font-medium text-brand-700 transition hover:text-brand-900"
            >
              Back to sign in
            </button>
          </p>
        ) : null}
      </form>
    </div>
  );
}
