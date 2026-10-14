import { NavLink } from "@/components/NavLink";
import { Home, BookOpen, Heart, HandHeart } from "lucide-react";

const LINKS = [
  { label: "Início", to: "/", Icon: Home, image: "/inicio.png" },
  { label: "Bíblia", to: "/biblia", Icon: BookOpen, image: "/biblia.png" },
  { label: "Devocionais", to: "/devocionais", Icon: Heart, image: "/devocionais.png" },
  { label: "Orar", to: "/pedidos-oracao", Icon: HandHeart, image: "/orar.png" },
];

/** Menu ilustrado superior inspirado no layout aprovado pelo usuário. */
export default function HomeTopNav() {
  return (
    <nav aria-label="Menu superior" className="w-fit max-w-full min-w-0">
      <ul className="flex items-start justify-center gap-0.5 sm:gap-1 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {LINKS.map(({ label, to, Icon, image }) => (
          <li key={to} className="shrink-0">
            <NavLink
              to={to}
              end={to === "/"}
              title={label}
              className="group flex w-[44px] min-[390px]:w-[52px] sm:w-[70px] flex-col items-center text-center no-underline transition-transform hover:-translate-y-0.5"
              activeClassName="brightness-110"
            >
              {image ? <img src={image} alt="" className="h-[44px] w-[44px] min-[390px]:h-[52px] min-[390px]:w-[52px] sm:h-[69px] sm:w-[69px] object-contain drop-shadow-md" /> : <span className="flex h-[47px] w-[52px] sm:h-[54px] sm:w-[62px] items-center justify-center rounded-[18px] border-[3px] border-[#f7ce67] bg-gradient-to-b from-[#ab6427] via-[#754019] to-[#4c290f] shadow-[0_3px_0_#6a370e,0_5px_9px_rgba(0,0,0,.45),inset_0_2px_3px_rgba(255,255,255,.5)] ring-1 ring-[#6d3812]">
                <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-[#fff1c3] drop-shadow-[0_2px_1px_#382008]" strokeWidth={2.5} />
              </span>}
              {!image && <span className="-mt-1.5 relative rounded-lg border border-[#a76224] bg-gradient-to-b from-[#ffe6a1] to-[#e5a746] px-1.5 py-0.5 text-[10px] sm:text-xs font-black leading-tight text-[#482609] shadow-[0_2px_3px_rgba(0,0,0,.35)] whitespace-nowrap">{label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
