import { describe, expect, it } from "vitest";
import { deriveUsername, validateRegistration, maskPhone, validatePhone } from "@/pages/Login";

const valid = {
  name: "  Márcio da Silva ",
  ageRange: "adultos",
  avatar: "/assets/avatar-jesus.png",
  phone: "(15) 99665-5568",
};

describe("deriveUsername", () => {
  it("normaliza acentos, espaços e maiúsculas", () => {
    expect(deriveUsername("Márcio da Silva")).toBe("marciodasilva");
    expect(deriveUsername("  João  ")).toBe("joao");
  });
  it("usa fallback quando o nome não tem caracteres válidos", () => {
    expect(deriveUsername("!!!")).toBe("usuario");
  });
});

describe("validateRegistration", () => {
  it("aceita um cadastro completo", () => {
    expect(validateRegistration(valid)).toBeNull();
  });
  it("nunca exige nome de usuário", () => {
    const result = validateRegistration({ ...valid, name: "" });
    expect(result?.field).toBe("name");
    expect(result?.message).toBe("Informe seu nome.");
  });
  it("exige faixa etária, avatar, celular e senha com mensagens claras", () => {
    expect(validateRegistration({ ...valid, ageRange: "" })?.message).toMatch(/faixa etária/i);
    expect(validateRegistration({ ...valid, avatar: "" })?.message).toMatch(/avatar/i);
    expect(validateRegistration({ ...valid, phone: "" })?.field).toBe("phone");
  });
});

describe("criação de conta (integração com o cliente de auth)", () => {
  it("envia o username derivado nos metadados e cria o perfil", async () => {
    const calls: any[] = [];
    const profiles: Record<string, any> = {};

    const fakeSupabase = {
      auth: {
        signUp: async (args: any) => {
          calls.push(args);
          const id = "user-1";
          profiles[id] = {
            id,
            email: args.email,
            name: args.options.data.name,
            username: args.options.data.username,
            age_range: args.options.data.age_range,
            phone: args.options.data.phone,
            avatar: args.options.data.avatar,
          };
          return { data: { user: { id, email: args.email }, session: { access_token: "t" } }, error: null };
        },
      },
    };

    const phone = maskPhone("15996655568");
    expect(validatePhone(phone)).toBeNull();
    const email = `celular${phone.replace(/\D/g, "")}@lemosapalavra.app`;

    const { data, error } = await fakeSupabase.auth.signUp({
      email,
      password: "lemos-15996655568-app",
      options: {
        emailRedirectTo: "http://localhost/",
        data: {
          name: valid.name.trim(),
          username: deriveUsername(valid.name),
          age_range: valid.ageRange,
          phone,
          role: "",
          avatar: valid.avatar,
        },
      },
    });

    expect(error).toBeNull();
    expect(data.user.id).toBe("user-1");
    expect(calls[0].email).toBe("celular15996655568@lemosapalavra.app");
    expect(calls[0].options.data.username).toBe("marciodasilva");
    expect(profiles["user-1"].username).toBe("marciodasilva");
    expect(profiles["user-1"].name).toBe("Márcio da Silva");
  });
});
