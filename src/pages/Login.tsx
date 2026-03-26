import { useState } from "react";
import { useNavigate } from "react-router-dom";
import iconLogin from "@/assets/icon-login.png";

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userName = isRegister ? name : email.split("@")[0];
    localStorage.setItem("lemos_user", JSON.stringify({ name: userName, email }));
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(180deg, hsl(200,80%,90%), hsl(45,100%,95%))" }}>
      <div className="bg-popover rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="flex flex-col items-center mb-6">
          <img src={iconLogin} alt="Login" width={100} height={100} />
          <h1 className="font-display text-2xl font-bold text-foreground mt-2">
            {isRegister ? "Cadastre-se" : "Entrar"}
          </h1>
          <p className="text-muted-foreground text-sm">Lemos a Palavra ❤️</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-xl border border-border bg-background px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          )}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border border-border bg-background px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-xl border border-border bg-background px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
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
