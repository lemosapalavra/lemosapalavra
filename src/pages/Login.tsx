import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield } from "lucide-react";
import { setAdminMode } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";

import avatarAbraao from "@/assets/avatar-abraao.png";
import avatarAnjo from "@/assets/avatar-anjo.png";
import avatarDaniel from "@/assets/avatar-daniel.png";
import avatarDavi from "@/assets/avatar-davi.png";
import avatarJesus from "@/assets/avatar-jesus.png";
import avatarJoao from "@/assets/avatar-joao.png";
import avatarJose from "@/assets/avatar-jose.png";
import avatarMaria from "@/assets/avatar-maria.png";
import avatarMateus from "@/assets/avatar-mateus.png";
import avatarMoises from "@/assets/avatar-moises.png";
import avatarPedro from "@/assets/avatar-pedro.png";
import avatarTiago from "@/assets/avatar-tiago.png";

const avatars = [
  { src: avatarJesus, name: "Jesus" },
  { src: avatarMaria, name: "Maria" },
  { src: avatarDavi, name: "Davi" },
  { src: avatarDaniel, name: "Daniel" },
  { src: avatarMoises, name: "Moisés" },
  { src: avatarAbraao, name: "Abraão" },
  { src: avatarJose, name: "José" },
  { src: avatarJoao, name: "João" },
  { src: avatarMateus, name: "Mateus" },
  { src: avatarPedro, name: "Pedro" },
  { src: avatarTiago, name: "Tiago" },
  { src: avatarAnjo, name: "Anjo" },
];

type Role = "mãe" | "pai" | "filho" | "filha";
type Mode = "login" | "register";
type AgeRange = "criancas" | "adolescentes" | "jovens" | "adultos" | "idosos";

const AGE_RANGES: { id: AgeRange; label: string; emoji: string }[] = [
  { id: "criancas",      label: "Crianças (0–12)",          emoji: "🧒" },
  { id: "adolescentes",  label: "Adolescentes (13–17)",     emoji: "🧑" },
  { id: "jovens",        label: "Jovens adultos (18–24)",   emoji: "🧑‍🎓" },
  { id: "adultos",       label: "Adultos (25–59)",          emoji: "🧔" },
  { id: "idosos",        label: "Idosos (60+)",             emoji: "🧓" },
];

const ADMIN_EMAIL = "admin@lemos.local";
const ADMIN_SHORTCUT_LOGIN = "admin";
const ADMIN_SHORTCUT_PASSWORD = "1234";

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

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  // register-only fields
  const [name, setName] = useState("");
  const [ageRange, setAgeRange] = useState<AgeRange | "">("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [customAvatar, setCustomAvatar] = useState<string>("");

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

  const loginAsAdmin = () => {
    const adminUser = {
      name: "Administrador",
      ageRange: "adultos",
      phone: "",
      role: "admin",
      avatar: "",
      email: ADMIN_EMAIL,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("lemos_user", JSON.stringify(adminUser));
    setAdminMode(true);
    navigate("/");
  };

  const doLogin = async (overrideEmail?: string, overridePassword?: string) => {
    const em = (overrideEmail ?? email).trim();
    const pw = overridePassword ?? password;
    if (!em || !pw) { alert("Informe e-mail e senha."); return; }
    // 🔐 Atalho de administrador
    if (em.toLowerCase() === ADMIN_SHORTCUT_LOGIN && pw === ADMIN_SHORTCUT_PASSWORD) {
      loginAsAdmin();
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error || !data.user) {
      alert("E-mail ou senha incorretos. Se ainda não tem cadastro, clique em CRIAR UMA CONTA.");
      return;
    }
    await hydrateLocalProfile(data.user.id, data.user.email || email);
    if ((data.user.email || "").toLowerCase() === ADMIN_EMAIL) setAdminMode(true);
    navigate("/");
  };

  const doRegister = async () => {
    if (!name || !role || !ageRange || !finalAvatar) {
      alert("Preencha nome, faixa etária, função e escolha um avatar.");
      return;
    }
    if (!email || !password || password.length < 6) {
      alert("Informe um e-mail válido e uma senha com pelo menos 6 caracteres.");
      return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { name, age_range: ageRange, phone, role, avatar: finalAvatar },
      },
    });
    if (error) {
      setBusy(false);
      if (/registered|already/i.test(error.message)) {
        alert("Este e-mail já tem cadastro. Faça login com sua senha.");
        setMode("login");
      } else {
        alert("Não foi possível criar sua conta: " + error.message);
      }
      return;
    }
    // Auto-confirm está ativo → já temos sessão. Garantimos sessão ativa
    // (fallback: tenta login imediato) e hidratamos o perfil local.
    let userId = data.user?.id;
    if (!data.session) {
      const { data: signIn } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      userId = signIn.user?.id ?? userId;
    }
    setBusy(false);
    if (!userId) {
      alert("Cadastro criado! Faça login para continuar.");
      setMode("login");
      return;
    }
    await hydrateLocalProfile(userId, email);
    if (email.toLowerCase() === ADMIN_EMAIL) setAdminMode(true);
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

  const handleAdminShortcut = () => {
    const pwd = prompt("🔐 Acesso administrador\n\nDigite a senha de admin:");
    if (pwd === "admin123" || pwd === "lemos2025") {
      setAdminMode(true);
      alert("✓ Modo administrador ativado. Indo para configurações...");
      navigate("/config");
    } else if (pwd !== null) {
      alert("Senha incorreta.");
    }
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
      if (result.redirected) return; // browser will redirect
      // Sessão pronta — hidrata o perfil local
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await hydrateLocalProfile(data.user.id, data.user.email || "");
        if ((data.user.email || "").toLowerCase() === ADMIN_EMAIL) setAdminMode(true);
      }
      navigate("/");
    } catch (e: any) {
      alert("Erro no login com Google: " + (e?.message || String(e)));
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
                <Field label="Nome completo *">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-sky-50 border border-amber-300/60 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Nome e sobrenome"
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
                <Field label="Telefone">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-sky-50 border border-amber-300/60 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="(11) 99999-9999"
                  />
                </Field>
                <Field label="Você é:">
                  <div className="flex gap-2 flex-wrap">
                    {(["mãe", "pai", "filho", "filha"] as Role[]).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`px-3 py-1.5 rounded-full text-xs font-body border-2 transition capitalize ${
                          role === r
                            ? "bg-amber-500 text-white border-amber-600"
                            : "bg-white text-foreground border-amber-300 hover:border-amber-400"
                        }`}
                      >
                        {r === "mãe" ? "👩 Mãe" : r === "pai" ? "👨 Pai" : r === "filho" ? "👦 Filho" : "👧 Filha"}
                      </button>
                    ))}
                  </div>
                </Field>
              </>
            )}

            <Field label="E-mail *">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-sky-50 border border-amber-300/60 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="seuemail@exemplo.com"
              />
            </Field>

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
                <button
                  type="button"
                  onClick={handleForgotPwd}
                  className="text-rose-600 font-body font-semibold hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
            )}

            {mode === "register" && (
              <>
                <Field label="Escolha seu avatar:">
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
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

          {/* Admin shortcut */}
          <div className="mt-5 pt-4 border-t border-amber-200/60 flex flex-col items-center gap-2">
            <button
              onClick={loginAsAdmin}
              className="flex items-center gap-2 text-sm bg-amber-500 hover:bg-amber-600 text-white font-display font-bold px-4 py-2 rounded-lg shadow transition"
              title="Entrar como administrador"
            >
              <Shield className="w-4 h-4" />
              Entrar como Admin
            </button>
            <button
              onClick={handleAdminShortcut}
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-amber-700 transition font-body"
              title="Acesso administrador avançado"
            >
              <Shield className="w-3 h-3" />
              Acesso administrador avançado
            </button>
          </div>
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
