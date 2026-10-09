import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { setAdminMode, useIsAdmin } from "@/hooks/useIsAdmin";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Novos avatares fornecidos para o cadastro. Arquivos em public/avatars-login/.
const avatars = [
  { src: "/avatars-login/jesus.webp", name: "Jesus" },
  { src: "/avatars-login/maria.webp", name: "Maria" },
  { src: "/avatars-login/davi.webp", name: "Davi" },
  { src: "/avatars-login/moises.webp", name: "Moisés" },
  { src: "/avatars-login/abraao.webp", name: "Abraão" },
  { src: "/avatars-login/jose.webp", name: "José" },
  { src: "/avatars-login/lia.webp", name: "Lia" },
  { src: "/avatars-login/marta.webp", name: "Marta" },
  { src: "/avatars-login/noe.webp", name: "Noé" },
  { src: "/avatars-login/paulo.webp", name: "Paulo" },
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

/** Senha interna determinística — o usuário nunca digita senha. */
export function derivePassword(phone: string): string {
  return `lemos-${phone.replace(/\D/g, "")}-app`;
}

export type RegistrationInput = {
  name: string;
  ageRange: string;
  avatar: string;
  phone: string;
};

/** Valida o cadastro. Retorna null quando tudo está correto. */
export function validateRegistration(
  input: RegistrationInput,
): { field: keyof RegistrationInput; message: string } | null {
  if (!input.name.trim()) return { field: "name", message: "Informe seu nome." };
  if (!input.ageRange) return { field: "ageRange", message: "Escolha sua faixa etária." };
  const phoneErr = validatePhone(input.phone);
  if (phoneErr) return { field: "phone", message: phoneErr };
  if (!input.avatar) return { field: "avatar", message: "Escolha um avatar para o seu perfil." };
  return null;
}



export default function Login() {
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(true);
  const [showLegacy, setShowLegacy] = useState(false);
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

  /**
   * Garante que a conta do celular exista no backend com a senha interna
   * correta (inclusive para contas antigas criadas com outro padrão).
   */
  const ensureAccount = async (
    action: "login" | "register",
    payload: { phone: string; name?: string; ageRange?: string; avatar?: string },
  ): Promise<{ found: boolean; error?: string }> => {
    const { data, error } = await supabase.functions.invoke("phone-auth", {
      body: { action, ...payload },
    });
    if (error) {
      console.error("[auth] phone-auth falhou", error.message);
      return { found: false, error: error.message };
    }
    if ((data as any)?.error) return { found: false, error: (data as any).error };
    return { found: !!(data as any)?.found };
  };

  const doLogin = async (overridePhone?: string) => {
    const raw = (overridePhone ?? email).trim();

    if (!name.trim()) { alert("Informe seu nome."); return; }
    if (!raw) { alert("Informe seu celular."); return; }
    // Aceita celular (padrão) ou e-mail (compatibilidade com contas antigas).
    const isEmail = raw.includes("@");
    const em = isEmail ? raw : phoneToEmail(raw);
    if (!isEmail) {
      const err = validatePhone(raw);
      if (err) {
        setPhoneError(err);
        toast({ title: "Celular inválido", description: err, variant: "destructive" });
        return;
      }
      setPhoneError(null);
    }
    setBusy(true);
    if (!isEmail) {
      const ensured = await ensureAccount("login", { phone: raw });
      if (!ensured.found) {
        setBusy(false);
        toast({
          title: "Conta não encontrada",
          description: ensured.error || "Não localizamos uma conta com esse celular.",
          variant: "destructive",
        });
        alert("Não encontramos sua conta com esse celular. Clique em CRIAR UMA CONTA.");
        return;
      }
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: em,
      password: derivePassword(raw),
    });
    setBusy(false);
    if (error || !data.user) {
      console.error("[login] signIn falhou", { email: em, message: error?.message });
      alert("Não conseguimos entrar agora. Confira seu celular e tente novamente.");
      return;
    }
    await hydrateLocalProfile(data.user.id, data.user.email || em);
    // Admin state is derived from the database (user_roles) — no client toggle.
    const { logEvent } = await import("@/lib/logEvent");
    logEvent("Login", { userId: data.user.id, email: data.user.email || em });
    navigate("/");
  };

  const doRegister = async () => {
    const validation = validateRegistration({ name, ageRange, avatar: finalAvatar, phone });
    if (validation) {
      setPhoneError(validation.field === "phone" ? validation.message : null);
      toast({ title: "Confira o cadastro", description: validation.message, variant: "destructive" });
      alert(validation.message);
      return;
    }
    setPhoneError(null);
    const derivedEmail = phoneToEmail(phone);
    const derivedPassword = derivePassword(phone);
    setBusy(true);
    const ensured = await ensureAccount("register", {
      phone,
      name: name.trim(),
      ageRange,
      avatar: finalAvatar,
    });
    if (!ensured.found) {
      setBusy(false);
      console.error("[cadastro] falhou", { email: derivedEmail, error: ensured.error });
      toast({
        title: "Não foi possível criar sua conta",
        description: ensured.error || "Tente novamente em instantes.",
        variant: "destructive",
      });
      alert("Não foi possível criar sua conta. Tente novamente.");
      return;
    }
    const { data: signIn, error: signInError } = await supabase.auth.signInWithPassword({
      email: derivedEmail,
      password: derivedPassword,
    });
    setBusy(false);
    if (signInError || !signIn.user) {
      console.error("[cadastro] login automático falhou", signInError?.message);
      alert("Cadastro criado! Entre com seu nome e celular.");
      setMode("login");
      setEmail(phone);
      return;
    }
    await hydrateLocalProfile(signIn.user.id, derivedEmail);
    const { logEvent } = await import("@/lib/logEvent");
    logEvent("Cadastro", { userId: signIn.user.id, email: derivedEmail });
    navigate("/");
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

          {/* Google é a entrada principal. O cadastro anterior permanece acessível durante a migração. */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-amber-300 bg-white px-4 py-3 font-display font-bold text-foreground shadow-sm transition hover:bg-amber-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 disabled:opacity-60"
            >
              <svg aria-hidden="true" viewBox="0 0 48 48" className="h-6 w-6">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 38.03 46.98 31.9 46.98 24.55z"/>
                <path fill="#FBBC05" d="M10.53 28.59A14.41 14.41 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.2A23.92 23.92 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.92-2.13 15.89-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continuar com Google
            </button>
            <button type="button" onClick={() => navigate("/")} className="w-full rounded-xl py-2 text-sm font-semibold text-amber-900 underline underline-offset-4">
              Continuar como visitante
            </button>
            <p className="text-center text-xs text-muted-foreground">
              O acesso pelo Google não exige SMS. Para crianças, use uma conta autorizada pelo responsável.
            </p>
            <p className="text-center text-xs text-muted-foreground border-t border-amber-200 pt-3">
              Por segurança, o acesso antigo apenas com número de celular está temporariamente indisponível.
              Seus dados cadastrados foram preservados.
            </p>
          </div>

          {/* Formulário anterior preservado temporariamente para migração dos cadastros. */}
          {false && showLegacy && <div className="space-y-4">
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
                  Usamos seu celular apenas para identificar sua conta. Não pedimos senha.
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
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
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
                        <img src={av.src} alt={av.name} className="w-full aspect-square object-contain" loading="lazy" width="1024" height="1024" />
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




          </div>}

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
