// AuthPage.jsx — Inscription / Connexion
import { useState } from 'react';
import { useAuthStore } from '../lib/auth';

export default function AuthPage() {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const { login, register, error, clearError } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Champs connexion
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPwd, setShowLoginPwd] = useState(false);

  // Champs inscription
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [showRegPwd, setShowRegPwd] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError(null);
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (regPassword !== regConfirm) { setFormError('Les mots de passe ne correspondent pas'); return; }
    setLoading(true);
    try {
      await register(regUsername, regEmail, regPassword);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t) => { setTab(t); setFormError(null); clearError(); };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at top, #2c1810 0%, #1a1208 100%)' }}>
      <div className="w-full max-w-md animate-float-in">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-shimmer font-display text-5xl font-black mb-1">7 WONDERS</h1>
          <p className="text-ancient-sand font-body text-xs tracking-widest uppercase opacity-70">
            Construis ta civilisation
          </p>
        </div>

        {/* Onglets */}
        <div className="flex mb-1 rounded-xl overflow-hidden border border-gold-800/40"
          style={{ background: 'rgba(0,0,0,0.3)' }}>
          {[['login', 'Se connecter'], ['register', 'Créer un compte']].map(([id, label]) => (
            <button key={id} onClick={() => switchTab(id)}
              className="flex-1 py-3 text-sm font-display font-bold tracking-wider transition-all"
              style={{
                background: tab === id ? 'rgba(212,172,13,0.15)' : 'transparent',
                color: tab === id ? '#D4AC0D' : '#9E8B6E',
                borderBottom: tab === id ? '2px solid #D4AC0D' : '2px solid transparent',
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Formulaire */}
        <div className="panel-gold p-6">

          {/* Erreur */}
          {formError && (
            <div className="mb-4 px-4 py-3 rounded-lg text-sm font-body"
              style={{ background: 'rgba(239,83,80,0.15)', border: '1px solid #EF5350', color: '#EF9A9A' }}>
              ⚠️ {formError}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Field label="Email" type="email" value={loginEmail} onChange={setLoginEmail}
                placeholder="ton@email.com" required />
              <PasswordField label="Mot de passe" value={loginPassword} onChange={setLoginPassword}
                show={showLoginPwd} onToggle={() => setShowLoginPwd(v => !v)}
                placeholder="••••••••" required />

              <button type="submit" disabled={loading}
                className="btn-gold w-full py-4 rounded-lg font-display text-sm tracking-widest animate-glow mt-2">
                {loading ? '⏳ Connexion...' : '🏛️ SE CONNECTER'}
              </button>

              <p className="text-center text-xs font-body text-ancient-stone">
                Pas encore de compte ?{' '}
                <button type="button" onClick={() => switchTab('register')}
                  className="text-gold-400 hover:text-gold-300 underline">
                  Créer un compte
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <Field label="Pseudo" type="text" value={regUsername} onChange={setRegUsername}
                placeholder="Archimède_42" required
                hint="3-20 caractères, lettres/chiffres/underscore" />
              <Field label="Email" type="email" value={regEmail} onChange={setRegEmail}
                placeholder="ton@email.com" required />
              <PasswordField label="Mot de passe" value={regPassword} onChange={setRegPassword}
                show={showRegPwd} onToggle={() => setShowRegPwd(v => !v)}
                placeholder="Minimum 8 caractères" required />
              <PasswordField label="Confirmer le mot de passe" value={regConfirm} onChange={setRegConfirm}
                show={showRegPwd} onToggle={() => setShowRegPwd(v => !v)}
                placeholder="••••••••" required />

              <button type="submit" disabled={loading}
                className="btn-gold w-full py-4 rounded-lg font-display text-sm tracking-widest animate-glow mt-2">
                {loading ? '⏳ Création...' : '⭐ CRÉER MON COMPTE'}
              </button>

              <p className="text-center text-xs font-body text-ancient-stone">
                Déjà un compte ?{' '}
                <button type="button" onClick={() => switchTab('login')}
                  className="text-gold-400 hover:text-gold-300 underline">
                  Se connecter
                </button>
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs font-body text-ancient-stone mt-4 opacity-50">
          🔒 Mots de passe chiffrés avec bcrypt
        </p>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder, required, hint }) {
  return (
    <div>
      <label className="block text-xs font-body font-semibold text-ancient-sand mb-1 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-lg font-body text-sm outline-none transition-all"
        style={{
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid rgba(212,172,13,0.3)',
          color: '#f5e6c8',
        }}
        onFocus={e => (e.target.style.borderColor = '#D4AC0D')}
        onBlur={e => (e.target.style.borderColor = 'rgba(212,172,13,0.3)')}
      />
      {hint && <p className="text-xs font-body text-ancient-stone mt-1 opacity-70">{hint}</p>}
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle, placeholder, required }) {
  return (
    <div>
      <label className="block text-xs font-body font-semibold text-ancient-sand mb-1 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-3 pr-12 rounded-lg font-body text-sm outline-none transition-all"
          style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid rgba(212,172,13,0.3)',
            color: '#f5e6c8',
          }}
          onFocus={e => (e.target.style.borderColor = '#D4AC0D')}
          onBlur={e => (e.target.style.borderColor = 'rgba(212,172,13,0.3)')}
        />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ancient-stone hover:text-gold-400 transition-colors">
          {show ? '🙈' : '👁️'}
        </button>
      </div>
    </div>
  );
}
