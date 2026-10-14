import { useNavigate } from "react-router-dom";
import BrincandoBiblia from "@/components/BrincandoBiblia";
import { useState } from "react";

/** Cenario APRENDA com quatro desafios Quem Sou Eu. */
export default function Atividades() {
  const navigate = useNavigate();
  const [colorir, setColorir] = useState(false);
  const [paint, setPaint] = useState("#ffcc00");
  const [filled, setFilled] = useState<Record<number,string>>({});
  return (
    <main id="aprenda-novo" className="relative isolate h-[100dvh] w-full overflow-hidden bg-[#bdebf7]">
      <img
        src="/Aprenda.png"
        alt="Aprenda — Jesus com crianças e a Bíblia"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-center"
      />
      {!colorir && <BrincandoBiblia onBack={() => navigate("/")} />}
      {!colorir && <button type="button" onClick={() => setColorir(true)} title="Colorir" aria-label="Colorir"
        className="absolute z-30 left-1/2 top-[18%] -translate-x-1/2 w-[clamp(88px,20vw,152px)] aspect-square rounded-full drop-shadow-[0_5px_12px_rgba(0,0,0,.5)] hover:scale-110 transition-transform">
        <img src="/colorir.png" alt="Colorir" className="w-full h-full object-contain" onError={e => { e.currentTarget.style.display="none"; e.currentTarget.parentElement!.textContent="🎨 Colorir"; }} />
      </button>}
      {colorir && <section className="fixed inset-x-0 bottom-0 top-[100px] z-[55] overflow-y-auto bg-amber-50 p-4 text-center">
        <button onClick={() => setColorir(false)} className="rounded-full bg-amber-300 px-5 py-2 font-bold">← Voltar</button>
        <h2 className="my-4 text-2xl font-black text-amber-900">Colorir</h2>
        <p className="mb-3">Escolha uma cor e toque nas partes do desenho.</p>
        <div className="flex justify-center gap-3 mb-5">{["#ffcc00","#ff5555","#44aaee","#66bb55","#a66be3","#ffffff"].map(c=><button key={c} onClick={()=>setPaint(c)} aria-label={c} className="h-10 w-10 rounded-full border-4 border-amber-700" style={{backgroundColor:c,outline:paint===c?"3px solid black":undefined}} />)}</div>
        <svg viewBox="0 0 300 280" className="mx-auto w-full max-w-[400px] rounded-xl bg-sky-100" aria-label="Desenho para colorir">
          <rect x="15" y="205" width="270" height="60" rx="15" fill={filled[0]||"white"} stroke="#5b3a16" strokeWidth="4" onClick={()=>setFilled(p=>({...p,0:paint}))}/>
          <path d="M150 30 L250 115 L210 115 L210 210 L90 210 L90 115 L50 115 Z" fill={filled[1]||"white"} stroke="#5b3a16" strokeWidth="5" onClick={()=>setFilled(p=>({...p,1:paint}))}/>
          <rect x="125" y="145" width="50" height="65" rx="5" fill={filled[2]||"white"} stroke="#5b3a16" strokeWidth="4" onClick={()=>setFilled(p=>({...p,2:paint}))}/>
          <circle cx="150" cy="85" r="20" fill={filled[3]||"white"} stroke="#5b3a16" strokeWidth="4" onClick={()=>setFilled(p=>({...p,3:paint}))}/>
        </svg>
        <button onClick={()=>setFilled({})} className="mt-4 rounded-full bg-amber-300 px-5 py-2 font-bold">Pintar novamente</button>
      </section>}
    </main>
  );
}
