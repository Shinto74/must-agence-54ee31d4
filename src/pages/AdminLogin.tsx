import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const AdminLogin = () => {
  const { user, isAdmin, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Chargement...</p></div>;
  if (user && isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error: err } = await signIn(email, password);
    if (err) setError("Email ou mot de passe incorrect");
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-clash text-3xl font-bold text-foreground text-center mb-8">Admin</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary/40"
          />
          <input
            type="password" placeholder="Mot de passe" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-text-dim focus:outline-none focus:border-primary/40"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <button
            type="submit" disabled={submitting}
            className="w-full py-3 rounded-pill bg-primary text-primary-foreground font-mono text-sm uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-50"
          >
            {submitting ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
