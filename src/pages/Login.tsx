import { useState } from "react";
import { useNavigate } from "react-router-dom";
import iconLogin from "@/assets/icon-login.png";

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
  { src: avatarAnjo, name: "Anjo" },
];

type Role = "mãe" | "pai" | "filho" | "filha";

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      if (!role) return;
      if (!finalAvatar) return;
      const userData = { name, birthDate, role, email, avatar: finalAvatar };
      localStorage.setItem("lemos_user", JSON.stringify(userData));
    } else {
      const stored = localStorage.getItem("lemos_user");
      if (stored) {
        const userData = JSON.parse(stored);
        if (userData.email !== email) {
          alert("E-mail não encontrado. Cadastre-se primeiro.");
          return;
        }
      } else {
        alert("Nenhum cadastro encontrado. Cadastre-se primeiro.");
        return;
      }
    }
    navigate("/");
  };

  const inputClass =
    "rounded-xl border border-border bg-background px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full";

  return (
    <div
      className="min-h-screen flex items-center justify-center py-8 px-4"
      style={{ background: "linear-gradient(180deg, hsl(200,80%,90%), hsl(45,100%,95%))" }}
    >
      <div className="bg-popover rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-lg mx-auto">
        <div className="flex flex-col items-center mb-4">
          <img src={iconLogin} alt="Login" width={80} height={80} />
          <h1 className="font-display text-2xl font-bold text-foreground mt-2">
            {isRegister ? "Cadastre-se" : "Entrar"}
          </h1>
          <p className="text-muted-foreground text-sm text-center">Lemos a Palavra ❤️</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {isRegister && (
            <>
              <input
                type="text"
                placeholder="Nome e Sobrenome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClass}
              />
              <input
                type="date"
                placeholder="Data de nascimento"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className={inputClass}
              />

              {/* Role selection */}
              <div>
                <p className="font-body text-sm text-foreground mb-2">Você é:</p>
                <div className="flex gap-2 flex-wrap">
                  {(["mãe", "pai", "filho", "filha"] as Role[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`px-4 py-2 rounded-full font-body text-sm border-2 transition-all capitalize ${
                        role === r
                          ? "bg-primary text-primary-foreground border-primary scale-105"
                          : "bg-background text-foreground border-border hover:border-primary/50"
                      }`}
                    >
                      {r === "mãe" ? "👩 Mãe" : r === "pai" ? "👨 Pai" : r === "filho" ? "👦 Filho" : "👧 Filha"}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />

          {!isRegister && (
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputClass}
            />
          )}

          {isRegister && (
            <>
              {/* Avatar selection */}
              <div>
                <p className="font-body text-sm text-foreground mb-2">Escolha seu avatar:</p>
                <div className="grid grid-cols-5 gap-2">
                  {avatars.map((av) => (
                    <button
                      key={av.name}
                      type="button"
                      onClick={() => { setSelectedAvatar(av.src); setCustomAvatar(""); }}
                      className={`rounded-full border-3 transition-all overflow-hidden ${
                        selectedAvatar === av.src && !customAvatar
                          ? "border-primary scale-110 ring-2 ring-primary/50"
                          : "border-transparent hover:border-primary/30"
                      }`}
                    >
                      <img src={av.src} alt={av.name} className="w-full h-full rounded-full" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom avatar upload */}
              <div>
                <label className="font-body text-sm text-foreground mb-1 block">
                  Ou envie sua própria foto:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomAvatar}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
                {customAvatar && (
                  <div className="flex items-center gap-2 mt-2">
                    <img src={customAvatar} alt="Seu avatar" className="w-12 h-12 rounded-full border-2 border-primary" />
                    <span className="text-xs text-muted-foreground">Foto selecionada ✓</span>
                  </div>
                )}
              </div>

              {/* Preview selected avatar */}
              {finalAvatar && !customAvatar && (
                <div className="flex items-center gap-2">
                  <img src={finalAvatar} alt="Avatar selecionado" className="w-12 h-12 rounded-full border-2 border-primary" />
                  <span className="text-xs text-muted-foreground">Avatar selecionado ✓</span>
                </div>
              )}

              <p className="text-xs text-center text-muted-foreground bg-accent/30 rounded-lg p-2">
                ✨ Você só precisa se cadastrar uma vez! Nas próximas visitas, o site entrará automaticamente.
              </p>
            </>
          )}

          <button type="submit" className="btn-cartoon py-3 px-6 text-lg">
            {isRegister ? "Criar conta" : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {isRegister ? "Já tem conta?" : "Não tem conta?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-secondary font-bold underline"
          >
            {isRegister ? "Entrar" : "Cadastre-se"}
          </button>
        </p>
      </div>
    </div>
  );
}
