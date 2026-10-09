import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const avatars = ["jesus", "maria", "davi", "moises", "abraao", "jose", "lia", "marta", "noe", "paulo"];
const ages = [
  { value: "criancas", label: "Crianças (0–12)" },
  { value: "adolescentes", label: "Adolescentes (13–17)" },
  { value: "jovens", label: "Jovens adultos (18–24)" },
  { value: "adultos", label: "Adultos (25 ou mais)" },
];
export default function WelcomeProfile() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      if (!user) { navigate("/login", { replace: true }); return; }
      const { data: profile } = await supabase.from("profiles").select("name, age_range, avatar").eq("id", user.id).maybeSingle();
      if (!active) return;
      if (profile?.name && profile?.age_range && profile?.avatar) { navigate("/", { replace: true }); return; }
      const draft = (() => { try { return JSON.parse(sessionStorage.getItem("lemos_registration_draft") || "{}"); } catch { return {}; } })();
      setName(profile?.name || draft.name || user.user_metadata?.full_name || user.user_metadata?.name || "");
      setPhone(draft.phone || "");
      setAge(profile?.age_range || "");
      setAvatar(profile?.avatar || draft.avatar || "");
      setLoading(false);
    })();
    return () => { active = false; };
  }, [navigate]);
  const save = async () => {
    if (!name.trim() || !age || !avatar) {
      toast({ title: "Complete seu perfil", description: "Informe nome, faixa etária e avatar." });
      return;
    }
    setBusy(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/login", { replace: true }); return; }
      // Only write to the authenticated user's own profile. Never match by name or email.
      const { data: old, error: readError } = await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle();
      if (readError) throw readError;
      const digits = phone.replace(/\D/g, "");
      if (digits && !/^\d{2}9\d{8}$/.test(digits)) throw new Error("Informe um celular válido com DDD.");
      const values = { name: name.trim(), age_range: age, avatar, ...(digits ? {phone: digits} : {}) };
      const result = old
        ? await supabase.from("profiles").update(values).eq("id", user.id)
        : await supabase.from("profiles").insert({ ...values, id: user.id, email: user.email || "" });
      if (result.error) throw result.error;
      localStorage.setItem("lemos_user", JSON.stringify({ name: values.name, ageRange: age, avatar, email: user.email || "", userId: user.id }));
      sessionStorage.removeItem("lemos_registration_draft");
      window.dispatchEvent(new Event("lemos_admin_change"));
      navigate("/", { replace: true });
    } catch (error: any) {
      toast({ title: "Não foi possível salvar o perfil", description: error?.message || "Tente novamente.", variant: "destructive" });
    } finally { setBusy(false); }
  };
  if (loading) return <div className="min-h-screen flex items-center justify-center">Preparando seu perfil...</div>;
  return <main className="min-h-screen flex items-center justify-center px-4 py-10">
    <section className="w-full max-w-xl rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-xl space-y-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-amber-950">Bem-vindo ao Lemos-a-Palavra!</h1>
        <p className="text-sm text-amber-900">Escolha como deseja aparecer em nossa família.</p>
      </div>
      <label className="block text-sm font-semibold">Seu nome de exibição
        <input className="mt-2 w-full rounded-xl border border-amber-300 bg-white p-3" value={name} onChange={e => setName(e.target.value)} maxLength={60} autoComplete="nickname" />
      </label>
      <label className="block text-sm font-semibold">Celular (DDD + número)
        <input className="mt-2 w-full rounded-xl border border-amber-300 bg-white p-3" value={phone} onChange={e => setPhone(e.target.value.replace(/\\D/g,"").slice(0,11))} inputMode="numeric" placeholder="11999999999" />
      </label>
      <label className="block text-sm font-semibold">Faixa etária
        <select className="mt-2 w-full rounded-xl border border-amber-300 bg-white p-3" value={age} onChange={e => setAge(e.target.value)}>
          <option value="">Escolha uma faixa etária</option>
          {ages.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
      </label>
      <div>
        <p className="mb-2 text-sm font-semibold">Escolha seu avatar bíblico</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {avatars.map(a => <button type="button" key={a} onClick={() => setAvatar("/avatars-login/" + a + ".webp")} aria-pressed={avatar === "/avatars-login/" + a + ".webp"}
            className={`rounded-xl border-2 p-2 capitalize ${avatar === "/avatars-login/" + a + ".webp" ? "border-amber-600 bg-amber-200" : "border-amber-200 bg-white"}`}>
            <img src={`/avatars-login/${a}.webp`} alt={a} className="aspect-square w-full object-contain" onError={e => { e.currentTarget.style.display = "none"; }} />
            <span className="text-xs">{a}</span>
          </button>)}
        </div>
      </div>
      <button type="button" onClick={save} disabled={busy} className="w-full rounded-xl bg-amber-700 p-3 font-bold text-white disabled:opacity-50">{busy ? "Salvando..." : "Salvar e começar"}</button>
      <p className="text-center text-xs text-amber-800">Seu perfil fica vinculado à sua conta Google. Cadastros antigos não serão alterados.</p>
    </section>
  </main>;
}
