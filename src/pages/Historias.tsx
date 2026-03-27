import PageHeader from "@/components/PageHeader";
import iconHistorias from "@/assets/icon-historias.png";

import avatarDavi from "@/assets/avatar-davi.png";
import avatarDaniel from "@/assets/avatar-daniel.png";
import avatarMoises from "@/assets/avatar-moises.png";
import avatarJose from "@/assets/avatar-jose.png";
import avatarJoao from "@/assets/avatar-joao.png";
import avatarMaria from "@/assets/avatar-maria.png";
import avatarJesus from "@/assets/avatar-jesus.png";
import avatarAbraao from "@/assets/avatar-abraao.png";

const stories = [
  { title: "Davi e Golias", img: avatarDavi, desc: "Um menino corajoso enfrenta um gigante" },
  { title: "Daniel na Cova dos Leões", img: avatarDaniel, desc: "A fé que fechou a boca dos leões" },
  { title: "Moisés e o Mar Vermelho", img: avatarMoises, desc: "Deus abre caminho pelo mar" },
  { title: "José do Egito", img: avatarJose, desc: "De escravo a governador" },
  { title: "João Batista", img: avatarJoao, desc: "O profeta que preparou o caminho" },
  { title: "O Nascimento de Jesus", img: avatarMaria, desc: "A maior história já contada" },
  { title: "Jesus Acalma a Tempestade", img: avatarJesus, desc: "Paz no meio da tempestade" },
  { title: "Abraão e Isaque", img: avatarAbraao, desc: "A fé que não vacilou" },
];

export default function Historias() {
  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "linear-gradient(180deg, hsl(200,80%,92%), hsl(45,100%,96%))" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Histórias" subtitle="Histórias bíblicas para toda família" icon={iconHistorias} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stories.map((s, i) => (
            <div key={i} className="bg-popover rounded-2xl p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border flex items-center gap-4">
              <img src={s.img} alt={s.title} className="w-16 h-16 rounded-full border-2 border-primary/30" />
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">{s.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
