import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && password !== confirmPassword) {
      alert("Passwords must match");
      return;
    }
    const body: any = { email, password };
    if (mode === "signup") {
      body.confirmPassword = confirmPassword;
      body.firstName = firstName;
      body.lastName = lastName;
    }
    const res = await fetch(`/api/${mode === "signin" ? "login" : "register"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const j = await res.json();
    if (!res.ok) {
      alert(j.message || "Auth error");
      return;
    }
    nav("/dashboard");
  };

  return (
    <form onSubmit={submit} className="p-6 max-w-md mx-auto space-y-4">
      <div className="flex space-x-2">
        <button type="button" onClick={() => setMode("signin")} className={mode === "signin" ? "font-bold" : ""}>Sign In</button>
        <button type="button" onClick={() => setMode("signup")} className={mode === "signup" ? "font-bold" : ""}>Sign Up</button>
      </div>
      {mode === "signup" && (
        <div className="grid grid-cols-2 gap-2">
          <input required placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
          <input required placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
        </div>
      )}
      <input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      {mode === "signup" && (
        <input type="password" required placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
      )}
      <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded">
        {mode === "signin" ? "Sign In" : "Create Account"}
      </button>
    </form>
);
}
