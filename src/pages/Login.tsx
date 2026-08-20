import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield } from "lucide-react";
import { setAdminMode, useIsAdmin } from "@/hooks/useIsAdmin";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

import { useIpLocation } from "@/hooks/useIpLocation";
import {
  OWNER_FLAG_KEY,
  ownerDeviceUnlocked,
  getOwnerIp,
  setOwnerIp,
  ipMatchesOwner,
  clearOwnerAccess,
} from "@/data/ownerAccess";

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

/** Mantém apenas dígitos e formata como (11) 99999-9999 (máx. 11 dígitos). */
export function maskPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Retorna mensagem de erro ou null quando o celular é válido. */
export function validatePhone(value: string): string | null {
  const d = value.replace(/\D/g, "");
  if (!d) return "Informe seu celular.";
  if (/[^\d\s()\-+]/.test(value)) return "O celular deve conter apenas números.";
  if (d.length < 10) return "Celular incompleto — use DDD + número (ex.: (11) 99999-9999).";
  if (d.length > 11) return "Celular inválido — máximo de 11 dígitos.";
  if (Number(d[0]) === 0 || Number(d[1]) === 0) return "DDD inválido.";
  if (d.length === 11 && d[2] !== "9") return "Celular inválido — o número deve começar com 9 após o DDD.";
  return null;
}

/** Nome de usuário derivado automaticamente do nome informado. */
export function deriveUsername(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "") || "usuario"
  );
}

export type RegistrationInput = {
  name: string;
  ageRange: string;
  avatar: string;
  phone: string;
  password: string;
};

/** Valida o cadastro. Retorna null quando tudo está correto. */
export function validateRegistration(
  input: RegistrationInput,
): { field: keyof RegistrationInput; message: string } | null {
  if (!input.name.trim()) return { field: "name", message: "Informe seu nome." };
  if (!input.ageRange) return { field: "ageRange", message: "Escolha sua faixa etária." };
  const phoneErr = validatePhone(input.phone);
  if (phoneErr) return { field: "phone", message: phoneErr };
  if (!input.password || input.password.length < 6)
    return { field: "password", message: "Informe uma senha com pelo menos 6 caracteres." };
  if (!input.avatar) return { field: "avatar", message: "Escolha um avatar para o seu perfil." };
  return null;
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
  
  const [ageRange, setAgeRange] = useState<AgeRange | "">("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [customAvatar, setCustomAvatar] = useState<string>("");




  // Owner-only UI (Admin shortcut) — visível apenas neste aparelho (?owner=1)
  // E somente quando o IP atual for o mesmo IP do dono registrado.
  const { ip } = useIpLocation();
  const [ownerDevice, setOwnerDevice] = useState<boolean>(false);
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("owner") === "1") {
        localStorage.setItem(OWNER_FLAG_KEY, "1");
      }
      if (params.get("owner") === "0") {
        clearOwnerAccess();
      }
      setOwnerDevice(ownerDeviceUnlocked());
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    // Registra o IP do dono no primeiro desbloqueio deste aparelho.
    if (ownerDevice && !getOwnerIp()) setOwnerIp(ip);
  }, [ownerDevice, ip]);
  // Aparelho desbloqueado com ?owner=1 basta para mostrar o atalho: o IP do
  // dono muda (4G/Wi-Fi) e escondia o botão. O poder real continua no backend.
  const ownerUnlocked = ownerDevice || ipMatchesOwner(ip);


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
    if (!raw.includes("@")) {
      const err = validatePhone(raw);
      if (err) {
        setPhoneError(err);
        toast({ title: "Celular inválido", description: err, variant: "destructive" });
        return;
      }
      setPhoneError(null);
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
    const validation = validateRegistration({ name, ageRange, avatar: finalAvatar, phone, password });
    if (validation) {
      setPhoneError(validation.field === "phone" ? validation.message : null);
      toast({ title: "Confira o cadastro", description: validation.message, variant: "destructive" });
      alert(validation.message);
      return;
    }
    setPhoneError(null);
    // Nome de usuário derivado automaticamente do nome informado.
    const uname = deriveUsername(name);
    const derivedEmail = phoneToEmail(phone);
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: derivedEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { name: name.trim(), username: uname, age_range: ageRange, phone, role: "", avatar: finalAvatar },
      },
    });
    if (error) {
      setBusy(false);
      console.error("[cadastro] signUp falhou", {
        email: derivedEmail,
        username: uname,
        status: (error as any)?.status,
        code: (error as any)?.code,
        message: error.message,
      });
      const code = (error as any)?.code as string | undefined;
      if (/registered|already/i.test(error.message)) {
        alert("Este celular já tem cadastro. Faça login com sua senha.");
        setMode("login");
        setEmail(derivedEmail);
      } else if (code === "weak_password" || /weak|known to be/i.test(error.message)) {
        const msg =
          "Essa senha é muito fácil de adivinhar. Crie outra senha com pelo menos 6 caracteres, misturando letras e números.";
        toast({ title: "Escolha uma senha mais forte", description: msg, variant: "destructive" });
        alert(msg);
      } else {
        toast({
          title: "Não foi possível criar sua conta",
          description: `${error.message}${code ? ` (código: ${code})` : ""}`,
          variant: "destructive",
        });
        alert("Não foi possível criar sua conta: " + error.message);
      }

      return;
    }
    let userId = data.user?.id;
    if (!data.session) {
      const { data: signIn, error: signInError } = await supabase.auth.signInWithPassword({ email: derivedEmail, password });
      if (signInError) console.error("[cadastro] login automático falhou", signInError.message);
      userId = signIn?.user?.id ?? userId;
    }
    setBusy(false);
    if (!userId) {
      console.warn("[cadastro] conta criada sem sessão ativa", { email: derivedEmail });
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
    const raw = email.trim();
    // Contas criadas com celular usam um e-mail interno que não recebe mensagens.
    if (!raw.includes("@")) {
      alert(
        "Sua conta foi criada com celular, então não é possível enviar link por e-mail.\n\n" +
        "Escreva para lemosapalavra@gmail.com informando seu celular e nome de usuário que ajudamos você a recuperar o acesso."
      );
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(raw, {
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
      style={{ background: "transparent" }}
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
                    className="w-full bg-white border border-amber-300/60 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-amber-400"
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


                <Field label="Celular *">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const v = maskPhone(e.target.value);
                      setPhone(v);
                      setPhoneError(v ? validatePhone(v) : null);
                    }}
                    onBlur={() => setPhoneError(validatePhone(phone))}
                    className={`w-full bg-white border rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 ${phoneError ? "border-destructive focus:ring-destructive" : "border-amber-300/60 focus:ring-amber-400"}`}
                    placeholder="(11) 99999-9999"
                    inputMode="numeric"
                    maxLength={15}
                    required
                  />
                  {phoneError && <p className="mt-1 text-xs font-body text-destructive">{phoneError}</p>}
                </Field>

                <p className="text-xs font-body text-muted-foreground -mt-1">
                  Usamos seu celular apenas para identificar sua conta e recuperar a senha.
                </p>



              </>
            )}

            {mode === "login" && (
              <>
                <Field label="Nome *">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-amber-300/60 rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Seu nome"
                    autoComplete="name"
                  />
                </Field>
                <Field label="Celular *">
                  <input
                    type="tel"
                    value={email}
                    onChange={(e) => {
                      const v = e.target.value.includes("@") ? e.target.value : maskPhone(e.target.value);
                      setEmail(v);
                      setPhoneError(v && !v.includes("@") ? validatePhone(v) : null);
                    }}
                    onBlur={() => setPhoneError(email && !email.includes("@") ? validatePhone(email) : null)}
                    className={`w-full bg-white border rounded-lg px-3 py-2.5 text-sm font-body focus:outline-none focus:ring-2 ${phoneError ? "border-destructive focus:ring-destructive" : "border-amber-300/60 focus:ring-amber-400"}`}
                    placeholder="(11) 99999-9999"
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={15}
                  />
                  {phoneError && <p className="mt-1 text-xs font-body text-destructive">{phoneError}</p>}
                </Field>

              </>
            )}


            <p className="text-xs font-body text-muted-foreground">
              Sem senha: usamos seu nome e celular para identificar sua conta.
            </p>


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
                      <img loading="lazy" decoding="async" src={finalAvatar} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-amber-400" />
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

          {/* Admin shortcut — always visible for the site owner. Single tap unlocks owner mode + goes to Config. */}
          {ownerUnlocked && (
            <div className="mt-6 pt-4 border-t border-amber-200/60 flex flex-col items-center gap-2">
              <button
                onClick={() => {
                  try { localStorage.setItem(OWNER_FLAG_KEY, "1"); } catch {}
                  // Garante que Configuracao (que exige lemos_user) permita entrada do dono.
                  try {
                    if (!localStorage.getItem("lemos_user")) {
                      localStorage.setItem("lemos_user", JSON.stringify({
                        name: "Administrador", role: "admin", avatar: "", email: "", createdAt: new Date().toISOString(),
                      }));
                    }
                  } catch {}
                  setAdminMode(true);
                  toast({
                    title: "Modo administrador ativado ✅",
                    description: "Sessão de dono aplicada. Abrindo as Configurações...",
                  });
                  setTimeout(() => navigate("/config"), 300);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-display font-extrabold text-xs shadow"
                title="Acesso de administrador"
              >
                <Shield className="w-4 h-4" /> Entrar como Administrador
              </button>
            </div>
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
