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

  const [showAgePrompt, setShowAgePrompt] = useState(false);

  const enterJourney = async () => {
    if (!name.trim()) { toast({ title: "Informe seu nome" }); return; }
    const error = validatePhone(phone);
    if (error) { setPhoneError(error); toast({ title: "Confira o celular", description: error, variant: "destructive" }); return; }
    setEmail(phone);
    setPhoneError(null);
    setBusy(true);
    try {
      const existing = await ensureAccount("login", { phone });
      if (existing.error) {
        toast({ title: "Não foi possível verificar o celular", description: existing.error, variant: "destructive" });
        return;
      }
      if (existing.found) {
        const em = phoneToEmail(phone);
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: em, password: derivePassword(phone) });
        if (signInError || !data.user) {
          toast({ title: "Não foi possível entrar", description: "Confira o celular ou tente novamente.", variant: "destructive" });
          return;
        }
        await hydrateLocalProfile(data.user.id, data.user.email || em);
        navigate("/");
      } else {
        if (!finalAvatar) { toast({ title: "Escolha seu avatar" }); return; }
        setShowAgePrompt(true);
      }
    } finally { setBusy(false); }
  };

  const avatarSpotsMobile = [
    { name: "Jesus", x: 23, y: 68.1 }, { name: "Maria", x: 36.5, y: 68.1 },
    { name: "Davi", x: 49.5, y: 68.1 }, { name: "Moisés", x: 62.5, y: 68.1 },
    { name: "Abraão", x: 76, y: 68.1 }, { name: "José", x: 21, y: 76.2 },
    { name: "Lia", x: 33.5, y: 76.2 }, { name: "Marta", x: 46, y: 76.2 },
    { name: "Noé", x: 58.5, y: 76.2 }, { name: "Paulo", x: 71, y: 76.2 },
    { name: "Mateus", x: 83, y: 76.2 },
  ];
  const avatarSpotsDesktop = [
    { name: "Jesus", x: 25, y: 73.7 }, { name: "Maria", x: 35.5, y: 73.7 },
    { name: "Moisés", x: 45, y: 73.7 }, { name: "Davi", x: 54.5, y: 73.7 },
    { name: "Mateus", x: 64.3, y: 73.7 }, { name: "Anjo", x: 74, y: 73.7 },
  ];

  const interactiveArt = (mobile: boolean) => (
    <div className={mobile ? "relative block h-[100dvh] min-h-[100svh] w-full overflow-hidden sm:hidden" : "relative hidden h-[100dvh] min-h-[100svh] w-full overflow-hidden sm:block"}>
      <img
        src={mobile ? "/login-jornada-mobile.png" : "/login-jornada.png"}
        alt="Lemos a Palavra — jornada bíblica: informe seu nome, celular e escolha um avatar"
        className="absolute inset-0 block h-full w-full object-fill"
      />
      <label className="absolute z-10" style={mobile ? { left: "33%", top: "50.3%", width: "40%", height: "2.5%" } : { left: "36%", top: "44.3%", width: "31%", height: "3.3%" }}>
        <span className="sr-only">Seu nome</span>
        <input aria-label="Seu nome" autoComplete="name" value={name} onChange={e => setName(e.target.value)}
          placeholder="Digite seu nome" className="h-full w-full rounded-md border-0 bg-[#fff8ee] px-1 text-[clamp(10px,1.8vw,20px)] text-[#51301b] outline-none focus:ring-2 focus:ring-amber-500" />
      </label>
      <label className="absolute z-10" style={mobile ? { left: "33%", top: "55.9%", width: "40%", height: "2.5%" } : { left: "36%", top: "52.4%", width: "31%", height: "3.3%" }}>
        <span className="sr-only">Celular</span>
        <input aria-label="Celular" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={e => setPhone(maskPhone(e.target.value))}
          placeholder="(11) 99999-9999" className="h-full w-full rounded-md border-0 bg-[#fff8ee] px-1 text-[clamp(10px,1.8vw,20px)] text-[#51301b] outline-none focus:ring-2 focus:ring-amber-500" />
      </label>
      {(mobile ? avatarSpotsMobile : avatarSpotsDesktop).map(a => (
        <button key={a.name} type="button" title={a.name} aria-label={`Escolher avatar ${a.name}`}
          aria-pressed={selectedAvatar === a.name}
          onClick={() => { setSelectedAvatar(a.name); setCustomAvatar(""); }}
          className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-600 ${selectedAvatar === a.name ? "border-amber-400 bg-amber-300/20 shadow-[0_0_12px_3px_#fbbf24]" : "border-transparent"}`}
          style={{ left: `${a.x}%`, top: `${a.y}%`, width: mobile ? "11.5%" : "9%", height: mobile ? "7.5%" : "15%" }} />
      ))}
      <button type="button" disabled={busy} onClick={enterJourney}
        aria-label="Entrar e Começar"
        className="absolute z-10 rounded-full bg-transparent focus-visible:outline focus-visible:outline-4 focus-visible:outline-white disabled:opacity-60"
        style={mobile ? { left: "23%", top: "80.4%", width: "54%", height: "5.6%" } : { left: "34%", top: "85.1%", width: "32%", height: "9.5%" }} />
    </div>
  );

  return (
    <main className="flex h-[100dvh] min-h-[100svh] w-full flex-col items-center justify-start overflow-hidden bg-[#f6dfb4]">
      {interactiveArt(true)}
      {interactiveArt(false)}
      {phoneError && <p role="alert" className="p-3 text-center text-red-700">{phoneError}</p>}
      {showAgePrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4">
          <form onSubmit={e => { e.preventDefault(); void doRegister(); }} className="w-full max-w-sm rounded-2xl border-2 border-amber-400 bg-[#fff4d9] p-6 text-[#51301b] shadow-2xl">
            <h2 className="mb-2 text-center text-2xl font-bold">Quase lá!</h2>
            <p className="mb-4 text-center">Para criar seu cadastro, escolha sua faixa etária.</p>
            <label htmlFor="login-age" className="mb-2 block font-semibold">Faixa etária</label>
            <select id="login-age" required value={ageRange} onChange={e => setAgeRange(e.target.value as AgeRange)}
              className="w-full rounded-lg border border-amber-400 bg-white p-3 text-[#51301b]">
              <option value="">Selecione...</option>
              {AGE_RANGES.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
            </select>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setShowAgePrompt(false)} className="flex-1 rounded-lg border border-amber-500 p-3">Voltar</button>
              <button type="submit" disabled={busy || !ageRange} className="flex-1 rounded-lg bg-amber-500 p-3 font-bold disabled:opacity-50">{busy ? "Aguarde..." : "Criar cadastro"}</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-display text-sm font-semibold text-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}
