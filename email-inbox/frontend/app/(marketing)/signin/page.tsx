"use client";

import { AuthPage } from "../auth";

export default function PaneSignIn() {
  return (
    <AuthPage
      title="Welcome back."
      lead="Sign in to pick up where you left off. Sessions stay active for 30 days on trusted devices."
      points={[
        "Passkeys and hardware keys supported",
        "Every active session is listed and revocable",
        "Trouble signing in? Support answers in under an hour",
      ]}
      formTitle="Sign in to Pane"
      fields={[
        {
          label: "Email address",
          type: "email",
          placeholder: "you@company.com",
        },
        {
          label: "Password",
          type: "password",
          placeholder: "••••••••••••",
        },
      ]}
      submitLabel="Sign in"
      switchPrompt="No account yet?"
      switchLabel="Create one free"
      switchHref="/signup"
    />
  );
}
