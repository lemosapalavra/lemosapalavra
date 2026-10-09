import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const avatars = ["Jesus", "Maria", "Davi", "Moisés", "Abraão", "José", "Lia", "Marta", "Noé", "Paulo"];
const avatarFile = (name: string) => name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const digitsOnly = (v: string) => v.replace(/\D/g, "");
const brazilPhone = (v: string) => {
  const d = digitsOnly(v);
  if (d.length !== 11 || d[2] !== "9" || d[0] === "0" || d[1] === "0") return null;
  return "+55" + d;
};

export default function SmsLogin() {
  const navigate = useNavigate();
  const [register, setRegister] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [avatar, setAvatar] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const normalized = brazilPhone(phone);

  const sendCode = async () => {
    if (!normalized) { toast({ title: "Informe um celular válido com DDD (11 dígitos).", variant: "destructive" }); return; }
    if (register && (!name.trim() || !ageRange || !avatar || !accepted)) {
      toast({ title: "Preencha nome, faixa etária, avatar e aceite os termos.", variant: "destructive" }); return;
    }
    setBusy(true);
    // A identidade é comprovada pelo SMS do Supabase Auth; nunca por senha derivada do celular.
    const { error } = await supabase.auth.signInWithOtp({
      phone: normalized,
      options: { shouldCreateUser: register, ...(register ? { data: { name: name.trim(), age_range: ageRange, avatar, phone: normalized } } : {}) },
    });
    setBusy(false);
    if (error) {
      toast({ title: "Não foi possível enviar o SMS", description: error.message, variant: "destructive" });
      return;
    }
    setSent(true);
    toast({ title: "Código enviado", description: "Confira o SMS recebido no celular." });
  };

  const confirmCode = async () => {
    if (!normalized || !/^\d{6,8}$/.test(code.trim())) {
      toast({ title: "Digite o código recebido por SMS.", variant: "destructive" }); return;
    }
    setBusy(true);
    const { data, error } = await supabase.auth.verifyOtp({ phone: normalized, token: code.trim(), type: "sms" });
    if (error || !data.user) {
      setBusy(false);
      toast({ title: "Código inválido ou expirado", description: error?.message, variant: "destructive" });
      return;
    }
    const user = data.user;
    // Só atualiza perfil depois de verificar o número. Não sobrescreve perfis antigos no login.
    if (register) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id, name: name.trim(), age_range: ageRange, phone: normalized, avatar,
      }, { onConflict: "id" });
      if (profileError) console.warn("Não foi possível salvar o perfil:", profileError.message);
    }
    const { data: profile } = await supabase.from("profiles")
      .select("name, age_range, phone, role, avatar, email, created_at").eq("id", user.id).maybeSingle();
    localStorage.setItem("lemos_user", JSON.stringify({
      name: profile?.name || user.user_metadata?.name || name.trim(),
      ageRange: profile?.age_range || user.user_metadata?.age_range || ageRange,
      phone: profile?.phone || normalized,
      role: profile?.role || "",
      avatar: profile?.avatar || user.user_metadata?.avatar || avatar,
      email: profile?.email || "",
      createdAt: profile?.created_at || new Date().toISOString(),
    }));
    window.dispatchEvent(new Event("lemos_admin_change"));
    setBusy(false);
    navigate("/");
  };

  return <main className="min-h-screen flex items-center justify-center p-4">
    <section className="w-full max-w-md rounded-3xl border border-amber-200 bg-[hsl(36,60%,97%)] p-6 shadow-xl">
      <h1 className="text-center font-display text-2xl font-extrabold">Lemos-a-Palavra</h1>
      <p className="mb-5 text-center text-sm text-muted-foreground">Onde a Palavra ganha Vida</p>
      <div className="mb-5 grid grid-cols-2 gap-2">
        <button type="button" onClick={() => { setRegister(false); setSent(false); setCode(""); }} className={`rounded-full px-3 py-2 font-bold ${!register ? "bg-amber-500 text-white" : "bg-amber-100"}`}>Entrar</button>
        <button type="button" onClick={() => { setRegister(true); setSent(false); setCode(""); }} className={`rounded-full px-3 py-2 font-bold ${register ? "bg-amber-500 text-white" : "bg-amber-100"}`}>Criar conta</button>
      </div>
      {!sent ? <div className="space-y-4">
        {register && <>
          <label className="block text-sm font-semibold">Seu nome<input value={name} onChange={e => setName(e.target.value)} autoComplete="name" className="mt-1 w-full rounded-xl border p-3" maxLength={80}/></label>
          <label className="block text-sm font-semibold">Faixa etária<select value={ageRange} onChange={e => setAgeRange(e.target.value)} className="mt-1 w-full rounded-xl border p-3"><option value="">Selecione</option><option value="criancas">Crianças (0–12)</option><option value="adolescentes">Adolescentes (13–17)</option><option value="jovens">Jovens (18–24)</option><option value="adultos">Adultos (25+)</option></select></label>
          <p className="text-sm font-semibold">Escolha seu avatar</p>
          <div className="grid grid-cols-5 gap-2">{avatars.map(item => {
            const url = `/avatars-login/${avatarFile(item)}.webp`;
            return <button type="button" key={item} title={item} aria-label={item} aria-pressed={avatar === url} onClick={() => setAvatar(url)} className={`overflow-hidden rounded-full border-2 ${avatar === url ? "border-amber-600 ring-2 ring-amber-300" : "border-amber-200"}`}><img src={url} alt={item} className="aspect-square w-full object-contain"/></button>;
          })}</div>
          <label className="flex items-start gap-2 text-xs"><input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="mt-1"/> Confirmo que sou maior de idade ou que tenho autorização de meu responsável para este cadastro e para receber SMS.</label>
        </>}
        <label className="block text-sm font-semibold">Celular com DDD<input type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="(11) 99999-9999" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 w-full rounded-xl border p-3" maxLength={18}/></label>
        <p className="text-xs text-muted-foreground">Enviaremos um código de verificação por SMS. O envio depende da configuração do serviço de SMS do site.</p>
        <button type="button" disabled={busy} onClick={sendCode} className="w-full rounded-xl bg-amber-600 p-3 font-bold text-white disabled:opacity-50">{busy ? "Enviando..." : "Receber código por SMS"}</button>
      </div> : <div className="space-y-4">
        <p className="text-sm">Digite o código enviado para o celular terminado em {digitsOnly(phone).slice(-4)}.</p>
        <label className="block text-sm font-semibold">Código de verificação<input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0,8))} inputMode="numeric" autoComplete="one-time-code" className="mt-1 w-full rounded-xl border p-3 text-center tracking-widest" /></label>
        <button type="button" disabled={busy} onClick={confirmCode} className="w-full rounded-xl bg-amber-600 p-3 font-bold text-white disabled:opacity-50">{busy ? "Verificando..." : "Confirmar e entrar"}</button>
        <div className="flex justify-between text-sm"><button type="button" onClick={() => { setSent(false); setCode(""); }} className="underline">Alterar número</button><button type="button" disabled={busy} onClick={sendCode} className="underline">Reenviar SMS</button></div>
      </div>}
      <button type="button" onClick={() => navigate("/")} className="mt-5 w-full text-center text-sm underline">Continuar como visitante</button>
    </section>
  </main>;
}
