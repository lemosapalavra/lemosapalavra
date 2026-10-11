import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
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
  { src: "/avatares/Jesus.png", fallback: avatarJesus, name: "Jesus" },
  { src: "/avatares/Maria.png", fallback: avatarMaria, name: "Maria" },
  { src: "/avatares/Davi.png", fallback: avatarDavi, name: "Davi" },
  { src: "/avatares/Mois%C3%A9s.png", fallback: avatarMoises, name: "Moisés" },
  { src: "/avatares/Abra%C3%A3o.png", fallback: avatarJesus, name: "Abraão" },
  { src: "/avatares/Jos%C3%A9.png", fallback: avatarJesus, name: "José" },
  { src: "/avatares/Lia.png", fallback: avatarMaria, name: "Lia" },
  { src: "/avatares/Marta.png", fallback: avatarMaria, name: "Marta" },
  { src: "/avatares/No%C3%A9.png", fallback: avatarDavi, name: "Noé" },
  { src: "/avatares/Paulo.png", fallback: avatarDavi, name: "Paulo" },
  { src: avatarDaniel, fallback: avatarDaniel, name: "Daniel" },
  { src: avatarAnjo, fallback: avatarAnjo, name: "Anjo" },
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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-300 via-amber-100 to-amber-300 px-3 py-7 sm:px-6 sm:py-10">
      {/* A arte enviada pelo usuário é exibida assim que o arquivo estiver em public/login-jornada.png. */}
      <div className="pointer-events-none absolute inset-0 bg-[url('/login-jornada.png')] bg-cover bg-center opacity-100" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-white/5 to-amber-900/15" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl flex-col items-center justify-center">
        <header className="mb-5 text-center drop-shadow-[0_2px_3px_rgba(255,255,255,.9)]">
          <h1 className="font-display text-4xl font-black text-amber-900 sm:text-6xl" style={{ WebkitTextStroke: "1px #fbbf24" }}>Lemos a Palavra</h1>
          <p className="mt-1 rounded-full bg-amber-50/90 px-5 py-2 font-display text-sm font-bold text-amber-950 shadow sm:text-lg">Onde a Palavra ganha Vida</p>
        </header>
        <section className="w-full rounded-[2rem] border-[3px] border-amber-400 bg-[#fff3d9]/95 p-4 shadow-[0_16px_50px_rgba(84,47,10,.4)] backdrop-blur-sm sm:p-8">
          <div className="mb-5 text-center text-amber-950">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Bem-vindo!</h2>
            <p className="mt-1 text-sm sm:text-base">Faça seu cadastro para começar essa jornada com histórias, jogos e atividades da Bíblia.</p>
          </div>
          <div className="mx-auto max-w-2xl space-y-4">
            <Field label="Seu nome">
              <input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Digite seu nome" className="w-full rounded-2xl border-2 border-amber-200 bg-white/95 px-4 py-3 text-amber-950 outline-none focus:border-amber-500" />
            </Field>
            <Field label="Celular">
              <input type="tel" autoComplete="tel" inputMode="tel" maxLength={15} value={mode === "register" ? phone : email} onChange={(e) => {
                const v = maskPhone(e.target.value);
                if (mode === "register") setPhone(v); else setEmail(v);
                setPhoneError(v ? validatePhone(v) : null);
              }} onBlur={() => setPhoneError(validatePhone(mode === "register" ? phone : email))} placeholder="(11) 99999-9999" className="w-full rounded-2xl border-2 border-amber-200 bg-white/95 px-4 py-3 text-amber-950 outline-none focus:border-amber-500" />
              {phoneError && <p className="mt-1 text-sm text-red-700">{phoneError}</p>}
            </Field>
            {mode === "register" && (
              <Field label="Faixa etária">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {AGE_RANGES.map((a) => <button key={a.id} type="button" onClick={() => setAgeRange(a.id)} className={`rounded-xl border-2 px-2 py-2 text-xs font-bold transition sm:text-sm ${ageRange === a.id ? "border-amber-600 bg-amber-400 text-amber-950" : "border-amber-200 bg-white/90 text-amber-900"}`}>{a.emoji} {a.label}</button>)}
                </div>
              </Field>
            )}
            <div className="pt-2 text-center">
              <h3 className="font-display text-2xl font-extrabold text-amber-950">Escolha seu Avatar</h3>
              <p className="mb-3 text-sm text-amber-900">Selecione o personagem que mais gosta</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
                {avatars.map((av) => (
                  <button key={av.name} type="button" aria-pressed={selectedAvatar === av.src} onClick={() => { setSelectedAvatar(av.src); setCustomAvatar(""); }} className={`overflow-hidden rounded-2xl border-[3px] bg-white/90 transition hover:scale-105 ${selectedAvatar === av.src ? "border-yellow-500 ring-2 ring-yellow-300 shadow-lg" : "border-amber-200"}`}>
                    <img src={av.src} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = av.fallback; }} alt={av.name} className="mx-auto aspect-square w-full object-contain" loading="lazy" />
                    <span className="block truncate bg-amber-100 px-1 py-1 text-xs font-bold text-amber-950">{av.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 pt-3">
              <button type="button" disabled={busy} onClick={() => mode === "register" ? void doRegister() : void doLogin()} className="w-full max-w-md rounded-full border-[3px] border-yellow-300 bg-gradient-to-b from-yellow-400 via-amber-500 to-orange-600 px-5 py-3 font-display text-xl font-extrabold text-white shadow-[0_5px_0_#a85b04,0_8px_18px_#a85b0480] transition hover:brightness-110 disabled:opacity-60">
                ➜ {busy ? "Aguarde..." : mode === "register" ? "Entrar e Começar" : "Entrar"}
              </button>
              <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setPhoneError(null); }} className="text-sm font-bold text-amber-950 underline underline-offset-4">
                {mode === "login" ? "Primeiro acesso? Criar meu cadastro" : "Já tenho cadastro — Fazer login"}
              </button>
              <p className="text-center text-xs text-amber-900">Sem senha: identificação pelo celular. Selecione seu avatar para personalizar o perfil.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
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
