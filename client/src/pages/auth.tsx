import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [mode, setMode] = useState<'signin'|'signup'>('signin');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup' && password !== confirmPassword) {
      alert('Passwords must match');
      return;
    }
    const endpoint = mode === 'signin' ? '/api/login' : '/api/register';
    const body = { email, password } as any;
    if (mode === 'signup') {
      Object.assign(body, { confirmPassword, firstName, lastName });
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Auth error');
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.message || 'Registration/Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      {/* Mode toggle, inputs for firstName/lastName when signup, email, password, confirmPassword, submit button */}
    </form>
  );
}
