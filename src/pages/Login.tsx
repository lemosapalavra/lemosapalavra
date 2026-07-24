import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield, Copy } from "lucide-react";
import { setAdminMode, useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import InstallShortcut from "@/components/InstallShortcut";

import avatarJesus from "@/assets/avatar-jesus.png";
import avatarMaria from "@/assets/avatar-maria.png";
import avatarDavi from "@/assets/avatar-davi.png";
import avatarDaniel from "@/assets/avatar-daniel.png";
import avatarMoises from "@/assets/avatar-moises.png";
import avatarAnjo from "@/assets/avatar-anjo.png";

const avatars = [
  { src: avatarJesus, name: "Jesus" },
  { src: avatarMaria, name: "Maria" },
  { src: avatarDavi, name: "Davi" },
  { src: avatarDaniel, name: "Daniel" },
  { src: avatarMoises, name: "Moisés" },
  { src: avatarAnjo, name: "Anjo" },
];

type Mode = "login" | "register";
type AgeRange = "criancas" | "adolescentes" | "jovens" | "adultos";

const AGE_RANGES: { id: AgeRange; label: string; emoji: string }[] = [
  { id: "criancas",      label: "Crianças (0–12)",          emoji: "🧒" },
  { id: "adolescentes",  label: "Adolescentes (13–17)",     emoji: "🧑" },
  { id: "jovens",        label: "Jovens adultos (18–24)",   emoji: "🧑‍🎓" },
  { id: "adultos",       label: "Adultos (25 e mais)",      emoji: "🧔" },
];

const OWNER_FLAG_KEY = "lemos_owner_unlocked";

// Hydrate the legacy localStorage profile object that the rest of the
// app already reads from (`lemos_user`) using the Supabase profile row.
async function hydrateLocalProfile(userId: string, fallbackEmail: string) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, age_range, phone, role, avatar, email, created_at")
    .eq("id", userId)
    .maybeSingle();
  const u = {
    name: profile?.name || "",
    ageRange: profile?.age_range || "",
    phone: profile?.phone || "",
    role: profile?.role || "",
    avatar: profile?.avatar || "",
    email: profile?.email || fallbackEmail,
    createdAt: profile?.created_at || new Date().toISOString(),
  };
  localStorage.setItem("lemos_user", JSON.stringify(u));
  return u;
}

// Auto-derive a valid e-mail from the phone number so the register form
// no longer needs to expose an e-mail field to the end user.
function phoneToEmail(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `celular${digits}@lemosapalavra.app`;
}

export default function Login() {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  // register-only fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [ageRange, setAgeRange] = useState<AgeRange | "">("");
  const [phone, setPhone] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [customAvatar, setCustomAvatar] = useState<string>("");

  // Owner-only UI (Admin shortcut) — hidden unless unlocked with ?owner=1.
  const [ownerUnlocked, setOwnerUnlocked] = useState<boolean>(false);
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("owner") === "1") {
        localStorage.setItem(OWNER_FLAG_KEY, "1");
      }
      if (params.get("owner") === "0") {
        localStorage.removeItem(OWNER_FLAG_KEY);
      }
      setOwnerUnlocked(localStorage.getItem(OWNER_FLAG_KEY) === "1");
    } catch { /* ignore */ }
  }, []);

  const shortcutUrl = typeof window !== "undefined" ? `${window.location.origin}/` : "";

  const handleCustomAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatar(reader.result as string);
        setSelectedAvatar("");
      };
      reader.readAsDataURL(file);
    }
  };

  const finalAvatar = customAvatar || selectedAvatar;

  const doLogin = async (overrideEmail?: string, overridePassword?: string) => {
    const raw = (overrideEmail ?? email).trim();
    const pw = overridePassword ?? password;
    if (!raw || !pw) { alert("Informe seu celular e a senha."); return; }
    // Aceita celular (padrão) ou e-mail (compatibilidade com contas antigas).
    const em = raw.includes("@") ? raw : phoneToEmail(raw);
    const phoneDigits = raw.replace(/\D/g, "");
    if (!raw.includes("@") && phoneDigits.length < 10) {
      alert("Informe um celular válido com DDD (ex.: 11 99999-9999).");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: em,
      password: pw,
    });
    setBusy(false);
    if (error || !data.user) {
      alert("Celular ou senha incorretos. Se ainda não tem cadastro, clique em CRIAR UMA CONTA.");
      return;
    }
    await hydrateLocalProfile(data.user.id, data.user.email || em);
    // Admin state is derived from the database (user_roles) — no client toggle.
    const { logEvent } = await import("@/lib/logEvent");
    logEvent("Login", { userId: data.user.id, email: data.user.email || em });
    navigate("/");
  };

  const doRegister = async () => {
    if (!name || !username.trim() || !ageRange || !finalAvatar) {
      alert("Preencha nome, nome de usuário, faixa etária e escolha um avatar.");
      return;
    }
    const uname = username.trim().replace(/^@+/, "");
    if (uname.length < 3) {
      alert("O nome de usuário deve ter pelo menos 3 caracteres.");
      return;
    }
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      alert("Informe um número de celular válido (com DDD).");
      return;
    }
    if (!password || password.length < 6) {
      alert("Informe uma senha com pelo menos 6 caracteres.");
      return;
    }
    const derivedEmail = phoneToEmail(phone);
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: derivedEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { name, username: uname, age_range: ageRange, phone, role: "", avatar: finalAvatar },
      },
    });
    if (error) {
      setBusy(false);
      if (/registered|already/i.test(error.message)) {
        alert("Este celular já tem cadastro. Faça login com sua senha.");
        setMode("login");
        setEmail(derivedEmail);
      } else {
        alert("Não foi possível criar sua conta: " + error.message);
      }
      return;
    }
    let userId = data.user?.id;
    if (!data.session) {
      const { data: signIn } = await supabase.auth.signInWithPassword({ email: derivedEmail, password });
      userId = signIn.user?.id ?? userId;
    }
    setBusy(false);
    if (!userId) {
      alert("Cadastro criado! Faça login para continuar.");
      setMode("login");
      setEmail(derivedEmail);
      return;
    }
    await hydrateLocalProfile(userId, derivedEmail);
    const { logEvent } = await import("@/lib/logEvent");
    logEvent("Cadastro", { userId, email: derivedEmail });
    navigate("/");
  };

  const handleForgotPwd = async () => {
    if (!email) { alert("Digite seu e-mail acima e clique novamente em 'Esqueci minha senha'."); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });
    if (error) alert("Não foi possível enviar o e-mail: " + error.message);
    else alert("📧 Enviamos um link para redefinir sua senha. Verifique seu e-mail.");
  };

  const handleGoogle = async () => {
    try {
      const { lovable } = await import("@/integrations/lovable/index");
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        alert("Não foi possível entrar com o Google: " + (result.error as any)?.message);
        return;
      }
      if (result.redirected) return;
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await hydrateLocalProfile(data.user.id, data.user.email || "");
        // Admin state is derived from the database (user_roles) — no client toggle.
      }
      navigate("/");
    } catch (e: any) {
      alert("Erro no login com Google: " + (e?.message || String(e)));
    }
  };

  const copyShortcutUrl = async () => {
    try {
      await navigator.clipboard.writeText(shortcutUrl);
      alert("🔗 Link copiado! Cole no navegador para abrir o site.");
    } catch {
      alert(`Link do atalho: ${shortcutUrl}`);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8 px-4"
      style={{ background: "linear-gradient(180deg, hsl(36, 60%, 96%), hsl(45, 80%, 92%))" }}
    >
      <div className="w-full max-w-md">
        <div className="bg-[hsl(36,60%,97%)] border border-amber-200/80 rounded-3xl shadow-2xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="font-display text-3xl font-extrabold text-foreground">
              {mode === "login" ? "Login" : "Criar Conta"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {mode === "login"
                ? "Já tem cadastro? Faça aqui o seu login."
                : "Preencha os dados abaixo para criar sua conta."}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {mode === "register" && (
              <>
                <Field label="Nome *">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-sky-50 border border-amber-300/60 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Seu nome"
                  />
                </Field>
                <Field label="Faixa etária *">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AGE_RANGES.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setAgeRange(a.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-body border-2 transition text-left ${
                          ageRange === a.id
                            ? "bg-amber-500 text-white border-amber-600 shadow"
                            : "bg-white text-foreground border-amber-300 hover:border-amber-400"
                        }`}
                      >
                        <span className="mr-1.5">{a.emoji}</span>{a.label}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Nome de usuário *">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s+/g, ""))}
                    className="w-full bg-sky-50 border border-amber-300/60 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="ex.: joao123"
                    autoComplete="username"
                    required
                    minLength={3}
                  />
                </Field>
                <Field label="Celular *">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-sky-50 border border-amber-300/60 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="(11) 99999-9999"
                    required
                  />
                </Field>
              </>
            )}

            {mode === "login" && (
              <>
                <Field label="Nome">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-sky-50 border border-amber-300/60 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Seu nome (opcional)"
                    autoComplete="name"
                  />
                </Field>
                <Field label="Celular *">
                  <input
                    type="tel"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-sky-50 border border-amber-300/60 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="(11) 99999-9999"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </Field>
              </>
            )}


            <Field label="Senha *">
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-amber-300/60 rounded-lg px-3 py-2.5 pr-10 text-sm font-body focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="••••••••"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </Field>

            {mode === "login" && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="accent-rose-600 w-4 h-4"
                  />
                  <span className="font-body text-foreground">Manter-me logado</span>
                </label>
                <span className="text-muted-foreground font-body">
                  Entre com o mesmo celular do cadastro
                </span>
              </div>
            )}

            {mode === "register" && (
              <>
                <Field label="Escolha seu avatar:">
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {avatars.map((av) => (
                      <button
                        key={av.name}
                        type="button"
                        title={av.name}
                        onClick={() => { setSelectedAvatar(av.src); setCustomAvatar(""); }}
                        className={`rounded-3xl border-2 transition overflow-hidden bg-amber-50 shadow-sm ${
                          selectedAvatar === av.src && !customAvatar
                            ? "border-amber-500 scale-105 ring-2 ring-amber-300"
                            : "border-amber-200 hover:border-amber-300"
                        }`}
                      >
                        <img src={av.src} alt={av.name} className="w-full aspect-square object-cover" loading="lazy" width="1024" height="1024" />
                        <div className="px-1.5 py-1 bg-white/90 border-t border-amber-100">
                          <span className="block text-[11px] font-display font-bold text-amber-900 truncate">{av.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Ou envie sua própria foto:">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCustomAvatar}
                    className="block w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
                  />
                  {finalAvatar && (
                    <div className="flex items-center gap-2 mt-2">
                      <img src={finalAvatar} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-amber-400" />
                      <span className="text-xs text-muted-foreground">Avatar selecionado ✓</span>
                    </div>
                  )}
                </Field>
              </>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              {mode === "login" ? (
                <>
                  <button
                    onClick={() => doLogin()}
                    disabled={busy}
                    className="flex-1 bg-foreground text-background font-display font-bold py-3 rounded-lg hover:opacity-90 transition tracking-wide text-sm disabled:opacity-60"
                  >
                    {busy ? "ENTRANDO..." : "ENTRAR"}
                  </button>
                  <button
                    onClick={() => setMode("register")}
                    disabled={busy}
                    className="flex-1 bg-transparent border-2 border-foreground text-foreground font-display font-bold py-3 rounded-lg hover:bg-foreground/5 transition tracking-wide text-sm disabled:opacity-60"
                  >
                    CRIAR UMA CONTA
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={doRegister}
                    disabled={busy}
                    className="flex-1 bg-foreground text-background font-display font-bold py-3 rounded-lg hover:opacity-90 transition tracking-wide text-sm disabled:opacity-60"
                  >
                    {busy ? "CRIANDO..." : "CRIAR CONTA"}
                  </button>
                  <button
                    onClick={() => setMode("login")}
                    disabled={busy}
                    className="flex-1 bg-transparent border-2 border-foreground text-foreground font-display font-bold py-3 rounded-lg hover:bg-foreground/5 transition tracking-wide text-sm disabled:opacity-60"
                  >
                    VOLTAR
                  </button>
                </>
              )}
            </div>

            {/* Admin-only: QR Code + botão para baixar/instalar o atalho */}
            {(isAdmin || ownerUnlocked) && <InstallShortcut />}



          </div>

          {/* Divider + Google */}
          <div className="mt-6 pt-5 border-t border-amber-200/80">
            <p className="text-center text-xs text-muted-foreground mb-3">
              Ou entre/cadastre-se com a sua conta do:
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleGoogle}
                className="bg-white border border-amber-200 rounded-lg px-5 py-2 shadow-sm hover:shadow-md transition"
              >
                <span className="font-display text-base">
                  <span style={{ color: "#4285F4" }}>G</span>
                  <span style={{ color: "#EA4335" }}>o</span>
                  <span style={{ color: "#FBBC05" }}>o</span>
                  <span style={{ color: "#4285F4" }}>g</span>
                  <span style={{ color: "#34A853" }}>l</span>
                  <span style={{ color: "#EA4335" }}>e</span>
                </span>
              </button>
            </div>
          </div>

          {/* Admin access is granted server-side via the user_roles table. */}
          {ownerUnlocked && (
            <div className="mt-5 pt-4 border-t border-amber-200/60 flex flex-col items-center gap-2 text-center">
              <p className="text-xs text-muted-foreground max-w-xs">
                <Shield className="w-3 h-3 inline mr-1" />
                O acesso de administrador é liberado no banco de dados (tabela <code>user_roles</code>). Faça login normalmente com sua conta administradora.
              </p>
            </div>
          )}

          {/* Gatilho secreto: 5 toques rápidos aqui destravam o Admin (só o dono conhece) */}
          {!ownerUnlocked && (
            <button
              aria-label="."
              onClick={() => {
                const now = Date.now();
                const w = window as any;
                if (!w.__ownerTaps || now - w.__ownerTapsAt > 1500) w.__ownerTaps = 0;
                w.__ownerTaps += 1;
                w.__ownerTapsAt = now;
                if (w.__ownerTaps >= 5) {
                  try { localStorage.setItem(OWNER_FLAG_KEY, "1"); } catch {}
                  setOwnerUnlocked(true);
                  w.__ownerTaps = 0;
                }
              }}
              className="mt-4 mx-auto block w-3 h-3 rounded-full bg-transparent hover:bg-amber-200/40"
              tabIndex={-1}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-display text-sm font-semibold text-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}
