"use client";

import { AuthPage } from "../auth";

export default function PaneSignUp() {
  return (
    <AuthPage
      title="Start with a quiet inbox."
      lead="Create an account and import from Gmail, Outlook or IMAP. Sorting starts on the first message."
      points={[
        "Free for personal use, no card required",
        "Import keeps labels, filters and signatures",
        "Export everything whenever you want",
      ]}
      formTitle="Create your account"
      fields={[
        { label: "Name", type: "text", placeholder: "Maya Lindqvist" },
        {
          label: "Email address",
          type: "email",
          placeholder: "you@company.com",
        },
        {
          label: "Password",
          type: "password",
          placeholder: "At least 12 characters",
        },
      ]}
      submitLabel="Create account"
      switchPrompt="Already using Pane?"
      switchLabel="Sign in"
      switchHref="/signin"
    />
  );
}
