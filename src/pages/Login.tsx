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
  { src: avatarJesus, name: "Jesus" },
  { src: avatarMaria, name: "Maria" },
  { src: avatarDavi, name: "Davi" },
  { src: avatarDaniel, name: "Daniel" },
  { src: avatarMoises, name: "Moisés" },
  { src: avatarAnjo, name: "Anjo" },
];

type Mode = "login" | "register";
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
    const validation = validateRegistration({ name, ageRange: "", avatar: finalAvatar, phone });
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

  // A arte é a própria tela de entrada. Campos e áreas clicáveis são
  // posicionados em porcentagens da imagem para não encavalar no celular.
  const avatarChoices = [
    { name: "Jesus", src: avatarJesus }, { name: "Maria", src: avatarMaria },
    { name: "Davi", src: avatarDavi }, { name: "Moisés", src: avatarMoises },
    { name: "Abraão", src: avatarMoises }, { name: "José", src: avatarJesus },
    { name: "Lia", src: "/lia-mascote.png" }, { name: "Marta", src: avatarMaria },
    { name: "Noé", src: avatarMoises }, { name: "Paulo", src: avatarDavi },
    { name: "Matheus", src: avatarDaniel },
  ];
  const chooseAvatar = (src: string) => { setSelectedAvatar(src); setCustomAvatar(""); };
  const submitArtwork = () => {
    if (mode === "login") { void doLogin(); return; }
    void doRegister();
  };

  return (
    <main className="fixed inset-0 z-0 flex items-center justify-center overflow-hidden bg-[#1d381c]" aria-label="Entrada do Lemos a Palavra">
      <div className="relative h-[100dvh] w-[100vw] shrink-0 overflow-hidden bg-[#f4d79c]">
        <img src="/login-jornada-mobile.png" alt="Lemos a Palavra: bem-vindo à jornada bíblica" className="absolute inset-0 h-full w-full object-fill select-none pointer-events-none" draggable={false} />
        <label className="absolute left-[31.3%] top-[50.0%] w-[43.4%] h-[3.1%] z-10">
          <span className="sr-only">Seu nome</span>
          <input aria-label="Seu nome" type="text" autoComplete="name" value={name} onChange={e => setName(e.target.value)}
            className="w-full h-full border-0 bg-[#fffaf4] outline-none focus:ring-2 focus:ring-amber-500 rounded-full px-[4%] text-amber-950 placeholder:text-transparent"
            style={{ fontSize: "clamp(10px, 1.65dvh, 17px)" }} />
        </label>
        <label className="absolute left-[31.3%] top-[55.7%] w-[43.4%] h-[3.1%] z-10">
          <span className="sr-only">Celular</span>
          <input aria-label="Celular" type="tel" autoComplete="tel" inputMode="numeric"
            value={mode === "login" ? email : phone}
            onChange={e => { const v = maskPhone(e.target.value); if (mode === "login") setEmail(v); else setPhone(v); }}
            className="w-full h-full border-0 bg-[#fffaf4] outline-none focus:ring-2 focus:ring-amber-500 rounded-full px-[4%] text-amber-950 placeholder:text-transparent"
            style={{ fontSize: "clamp(10px, 1.65dvh, 17px)" }} />
        </label>
        {avatarChoices.map((av, i) => {
          const firstRow = i < 5;
          const col = firstRow ? i : i - 5;
          const left = firstRow ? 18.0 + col * 12.6 : 14.4 + col * 12.0;
          const top = firstRow ? 64.5 : 72.4;
          const selected = selectedAvatar === av.src;
          return <button type="button" key={av.name} aria-label={`Escolher avatar ${av.name}`}
            title={av.name} onClick={() => chooseAvatar(av.src)}
            className={`absolute rounded-xl transition focus-visible:outline-2 focus-visible:outline-amber-500 ${selected ? "ring-[3px] ring-amber-500 bg-amber-200/20" : ""}`}
            style={{ left: `${left}%`, top: `${top}%`, width: firstRow ? "11.5%" : "11.5%", height: "7.5%" }}>{selected && <span className="absolute -top-1 -right-1 rounded-full bg-amber-500 text-white text-[10px] leading-4 w-4 h-4 font-bold shadow">✓</span>}</button>;
        })}
        <button type="button" disabled={busy} onClick={submitArtwork}
          aria-label={mode === "login" ? "Entrar na minha conta" : "Entrar e Começar"}
          className="absolute left-[19.2%] top-[80.9%] w-[61.5%] h-[5.5%] rounded-full focus-visible:ring-4 focus-visible:ring-white disabled:opacity-50 touch-manipulation" />
        <div className="absolute left-[19%] top-[86.1%] w-[62%] flex justify-center z-10">
          <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="rounded-full bg-amber-50/95 border border-amber-700 px-3 py-1 text-amber-950 font-semibold shadow"
            style={{ fontSize: "clamp(9px, 1.45dvh, 13px)" }}>
            {mode === "login" ? "Não tenho conta — cadastrar" : "Já tenho conta — entrar"}
          </button>
        </div>
        {mode === "register" && (
          <div className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto bg-[#18331d]/85 p-3" role="dialog" aria-modal="true" aria-label="Criar uma conta">
            <form onSubmit={(e) => { e.preventDefault(); if (!busy) void doRegister(); }}
              className="my-auto w-full max-w-md space-y-3 rounded-3xl border-4 border-amber-400 bg-[#fff8e5] p-4 text-amber-950 shadow-2xl sm:p-6">
              <h1 className="text-center text-2xl font-extrabold">🌟 Criar minha conta</h1>
              <p className="text-center text-sm">Preencha seus dados e escolha seu avatar para começar.</p>
              <label className="block text-sm font-bold">Seu nome
                <input type="text" autoComplete="name" required value={name} onChange={e => setName(e.target.value)}
                  className="mt-1 block w-full rounded-xl border-2 border-amber-300 bg-white px-3 py-2 text-base outline-none focus:border-amber-600" />
              </label>
              <label className="block text-sm font-bold">Celular com DDD
                <input type="tel" inputMode="numeric" autoComplete="tel" required value={phone} onChange={e => setPhone(maskPhone(e.target.value))}
                  placeholder="(11) 99999-9999"
                  className="mt-1 block w-full rounded-xl border-2 border-amber-300 bg-white px-3 py-2 text-base outline-none focus:border-amber-600" />
              </label>
              <p className="text-sm font-bold">Escolha seu avatar</p>
              <div className="grid grid-cols-6 gap-2">
                {avatars.map(av => <button key={av.name} type="button" title={av.name} aria-label={`Avatar ${av.name}`}
                  aria-pressed={selectedAvatar === av.src} onClick={() => chooseAvatar(av.src)}
                  className={`aspect-square overflow-hidden rounded-full border-4 bg-white ${selectedAvatar === av.src ? "border-green-600 ring-2 ring-green-300" : "border-amber-300"}`}>
                  <img src={av.src} alt={av.name} className="h-full w-full object-cover" />
                </button>)}
              </div>
              <button type="submit" disabled={busy}
                className="w-full rounded-full bg-emerald-700 px-4 py-3 text-base font-extrabold text-white shadow-lg disabled:opacity-60">
                {busy ? "Criando conta..." : "Cadastrar e começar"}
              </button>
              <button type="button" onClick={() => setMode("login")}
                className="w-full rounded-full border-2 border-amber-500 bg-white px-4 py-2 text-sm font-bold">
                Já tenho conta — voltar para entrar
              </button>
            </form>
          </div>
        )}
        {ownerUnlocked && <button type="button" onClick={() => { setAdminMode(true); navigate("/config"); }}
          className="absolute right-[3%] top-[3%] rounded-full bg-amber-50/95 p-2 text-amber-900" title="Administração" aria-label="Administração">
          <Shield size={18} />
        </button>}
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
