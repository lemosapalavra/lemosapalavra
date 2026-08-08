import { useState, useEffect } from "react";
import { applySoftVoice, ensureVoicesLoaded } from "@/lib/speak";

import PageHeader from "@/components/PageHeader";
import FeedbackFooter from "@/components/FeedbackFooter";
import CategoryOrbit from "@/components/CategoryOrbit";
import iconBiblia from "@/assets/icon-biblia.png";
import pergaminhoBg from "@/assets/pergaminho-bg.png";
import iconVT from "@/assets/icon-velho-testamento.png";
import iconNT from "@/assets/icon-novo-testamento.png";
import iconDic from "@/assets/icon-dicionario.png";
import { bookChapters, chapterThemes } from "@/data/bibleStructure";

const antigoTestamento = [
  "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio",
  "Josué", "Juízes", "Rute", "1 Samuel", "2 Samuel",
  "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras",
  "Neemias", "Ester", "Jó", "Salmos", "Provérbios",
  "Eclesiastes", "Cânticos", "Isaías", "Jeremias", "Lamentações",
  "Ezequiel", "Daniel", "Oséias", "Joel", "Amós",
  "Obadias", "Jonas", "Miquéias", "Naum", "Habacuque",
  "Sofonias", "Ageu", "Zacarias", "Malaquias",
];

const novoTestamento = [
  "Mateus", "Marcos", "Lucas", "João", "Atos",
  "Romanos", "1 Coríntios", "2 Coríntios", "Gálatas", "Efésios",
  "Filipenses", "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses",
  "1 Timóteo", "2 Timóteo", "Tito", "Filemom", "Hebreus",
  "Tiago", "1 Pedro", "2 Pedro", "1 João", "2 João",
  "3 João", "Judas", "Apocalipse",
];

// Mapping from Portuguese book names to bible-api.com book IDs
const bookIdMap: Record<string, string> = {
  "Gênesis": "GEN", "Êxodo": "EXO", "Levítico": "LEV", "Números": "NUM", "Deuteronômio": "DEU",
  "Josué": "JOS", "Juízes": "JDG", "Rute": "RUT", "1 Samuel": "1SA", "2 Samuel": "2SA",
  "1 Reis": "1KI", "2 Reis": "2KI", "1 Crônicas": "1CH", "2 Crônicas": "2CH", "Esdras": "EZR",
  "Neemias": "NEH", "Ester": "EST", "Jó": "JOB", "Salmos": "PSA", "Provérbios": "PRO",
  "Eclesiastes": "ECC", "Cânticos": "SNG", "Isaías": "ISA", "Jeremias": "JER", "Lamentações": "LAM",
  "Ezequiel": "EZK", "Daniel": "DAN", "Oséias": "HOS", "Joel": "JOL", "Amós": "AMO",
  "Obadias": "OBA", "Jonas": "JON", "Miquéias": "MIC", "Naum": "NAM", "Habacuque": "HAB",
  "Sofonias": "ZEP", "Ageu": "HAG", "Zacarias": "ZEC", "Malaquias": "MAL",
  "Mateus": "MAT", "Marcos": "MRK", "Lucas": "LUK", "João": "JHN", "Atos": "ACT",
  "Romanos": "ROM", "1 Coríntios": "1CO", "2 Coríntios": "2CO", "Gálatas": "GAL", "Efésios": "EPH",
  "Filipenses": "PHP", "Colossenses": "COL", "1 Tessalonicenses": "1TH", "2 Tessalonicenses": "2TH",
  "1 Timóteo": "1TI", "2 Timóteo": "2TI", "Tito": "TIT", "Filemom": "PHM", "Hebreus": "HEB",
  "Tiago": "JAS", "1 Pedro": "1PE", "2 Pedro": "2PE", "1 João": "1JN", "2 João": "2JN",
  "3 João": "3JN", "Judas": "JUD", "Apocalipse": "REV",
};

const bookSummaries: Record<string, string> = {
  "Gênesis": "O livro dos começos: criação do mundo, Adão e Eva, Noé, Abraão, Isaque, Jacó e José.",
  "Êxodo": "A saída do Egito: Moisés, as 10 pragas, travessia do Mar Vermelho e os Dez Mandamentos.",
  "Levítico": "Leis de santidade: regras para sacrifícios, festas e a vida do povo de Deus.",
  "Números": "A jornada no deserto: contagem do povo, murmurações e peregrinação de 40 anos.",
  "Deuteronômio": "A segunda lei: Moisés repete as leis antes de entrarem na Terra Prometida.",
  "Josué": "Conquista da Terra Prometida: travessia do Jordão, queda de Jericó, divisão da terra.",
  "Juízes": "Ciclos de pecado e libertação: Gideão, Sansão, Débora salvam Israel.",
  "Rute": "Fidelidade: Rute segue o Deus de Israel e se torna ancestral de Davi.",
  "1 Samuel": "De Samuel a Saul: o último juiz, primeiro rei e ascensão de Davi.",
  "2 Samuel": "O reinado de Davi: vitórias, pecado e consequências.",
  "1 Reis": "Salomão e a divisão: sabedoria, Templo e divisão do reino.",
  "2 Reis": "Reis e profetas até o exílio na Babilônia.",
  "1 Crônicas": "Genealogia e reinado de Davi focado na adoração.",
  "2 Crônicas": "De Salomão ao exílio com foco no Templo.",
  "Esdras": "Retorno do exílio e reconstrução do Templo.",
  "Neemias": "Reconstrução dos muros de Jerusalém.",
  "Ester": "A rainha que salvou o povo judeu.",
  "Jó": "O sofrimento do justo e a restauração por Deus.",
  "Salmos": "150 cânticos de alegria, dor, esperança e adoração.",
  "Provérbios": "Sabedoria prática para viver com temor a Deus.",
  "Eclesiastes": "O sentido da vida e o propósito verdadeiro.",
  "Cânticos": "Poema de amor simbolizando o amor de Deus.",
  "Isaías": "Profecias sobre Jesus e a esperança de salvação.",
  "Jeremias": "Alertas sobre juízo e promessas de nova aliança.",
  "Lamentações": "Lamentos pela destruição de Jerusalém.",
  "Ezequiel": "Visões de glória e restauração de Israel.",
  "Daniel": "Fé na Babilônia e visões proféticas.",
  "Oséias": "Amor fiel de Deus por Israel infiel.",
  "Joel": "Chamado ao arrependimento e promessa do Espírito.",
  "Amós": "Justiça social e denúncia da opressão.",
  "Obadias": "Julgamento contra o orgulho de Edom.",
  "Jonas": "O profeta relutante e Nínive arrependida.",
  "Miquéias": "Justiça, misericórdia e profecia sobre Belém.",
  "Naum": "A queda de Nínive pelo juízo divino.",
  "Habacuque": "O justo viverá pela fé.",
  "Sofonias": "O Dia do Senhor e restauração.",
  "Ageu": "Encorajamento para reconstruir o Templo.",
  "Zacarias": "Visões messiânicas e restauração de Jerusalém.",
  "Malaquias": "Último profeta: repreensão e promessa do mensageiro.",
  "Mateus": "Jesus, o Rei prometido a Israel.",
  "Marcos": "Jesus, o Servo cheio de ação e milagres.",
  "Lucas": "Jesus, o Salvador amigo de todos.",
  "João": "Jesus, o Filho de Deus eterno.",
  "Atos": "A Igreja nasce pelo Espírito Santo.",
  "Romanos": "Justificação pela fé e graça de Deus.",
  "1 Coríntios": "Orientações sobre divisões, dons e amor.",
  "2 Coríntios": "Força na fraqueza e ministério de Paulo.",
  "Gálatas": "Liberdade em Cristo contra o legalismo.",
  "Efésios": "Unidade da Igreja e armadura de Deus.",
  "Filipenses": "Alegria e contentamento em Cristo.",
  "Colossenses": "Supremacia e suficiência de Cristo.",
  "1 Tessalonicenses": "Esperança da segunda vinda de Jesus.",
  "2 Tessalonicenses": "Firmeza e o Dia do Senhor.",
  "1 Timóteo": "Instruções pastorais ao jovem Timóteo.",
  "2 Timóteo": "Última carta de Paulo: permaneça firme.",
  "Tito": "Liderança saudável na igreja de Creta.",
  "Filemom": "Perdão e reconciliação pelo escravo Onésimo.",
  "Hebreus": "Cristo é superior a tudo.",
  "Tiago": "Fé verdadeira se demonstra em obras.",
  "1 Pedro": "Esperança no sofrimento.",
  "2 Pedro": "Alertas contra falsos mestres.",
  "1 João": "Deus é amor; certeza da salvação.",
  "2 João": "Caminhar na verdade e amor.",
  "3 João": "Hospitalidade e fidelidade cristã.",
  "Judas": "Contender pela fé contra falsos mestres.",
  "Apocalipse": "Visões do fim: Jesus glorificado, juízo e novo céu.",
};

import { dicionarioBiblico as dicionario } from "@/data/bibleDictionary";

interface Verse {
  verse: number;
  text: string;
}

type Tab = "antigo" | "novo" | "dicionario";

export default function Biblia() {
  const [tab, setTab] = useState<Tab>("antigo");
  const [search, setSearch] = useState("");
  const [dictSearch, setDictSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [verseError, setVerseError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(16);
  const [fromSticker, setFromSticker] = useState(false);
  const [speaking, setSpeaking] = useState(false);


  // Deep-link via ?book=Gênesis&chapter=1 (usado a partir do Álbum)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const b = params.get("book");
    const c = params.get("chapter");
    if (b && bookIdMap[b]) {
      setSelectedBook(b);
      setFromSticker(true);
      if (c && Number(c) > 0) setSelectedChapter(Number(c));
    }
  }, []);

  // Stop any TTS when leaving chapter or unmounting.
  useEffect(() => {
    return () => {
      try { window.speechSynthesis?.cancel(); } catch { /* ignore */ }
    };
  }, []);
  useEffect(() => {
    if (!selectedChapter) {
      try { window.speechSynthesis?.cancel(); } catch { /* ignore */ }
      setSpeaking(false);
    }
  }, [selectedChapter]);

  const toggleListen = () => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) { alert("Seu navegador não suporta leitura em voz alta."); return; }
      if (speaking) { synth.cancel(); setSpeaking(false); return; }
      const text = `${selectedBook} capítulo ${selectedChapter}. ` +
        verses.map((v) => `Versículo ${v.verse}. ${v.text}`).join(" ");
      setSpeaking(true);
      ensureVoicesLoaded(() => {
        const u = new SpeechSynthesisUtterance(text);
        applySoftVoice(u);
        u.onend = () => setSpeaking(false);
        u.onerror = () => setSpeaking(false);
        synth.cancel();
        synth.speak(u);
      });
    } catch {
      setSpeaking(false);
    }
  };




  // Fetch verses from bible-api.com when chapter is selected
  useEffect(() => {
    if (!selectedBook || !selectedChapter) {
      setVerses([]);
      setVerseError(null);
      return;
    }

    const bookId = bookIdMap[selectedBook];
    if (!bookId) {
      setVerseError("Livro não encontrado na API.");
      return;
    }

    setLoadingVerses(true);
    setVerseError(null);
    setVerses([]);

    fetch(`https://bible-api.com/data/almeida/${bookId}/${selectedChapter}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.verses && Array.isArray(data.verses)) {
          setVerses(
            data.verses.map((v: { verse: number; text: string }) => ({
              verse: v.verse,
              text: v.text.trim(),
            }))
          );
        } else {
          setVerseError("Formato de resposta inesperado.");
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar versículos:", err);
        setVerseError("Não foi possível carregar os versículos. Verifique sua conexão.");
      })
      .finally(() => setLoadingVerses(false));
  }, [selectedBook, selectedChapter]);

  const filterBooks = (books: string[]) =>
    books.filter((b) => b.toLowerCase().includes(search.toLowerCase()));

  const filteredDict = dictSearch.trim().length >= 2
    ? dicionario.filter(
        (d) =>
          d.term.toLowerCase().includes(dictSearch.toLowerCase()) ||
          d.def.toLowerCase().includes(dictSearch.toLowerCase())
      ).slice(0, 30)
    : [];

  const tabs = [
    { key: "antigo" as Tab, label: "Antigo Testamento", count: 39, icon: iconVT },
    { key: "novo" as Tab, label: "Novo Testamento", count: 27, icon: iconNT },
    { key: "dicionario" as Tab, label: "Dicionário Bíblico", count: dicionario.length, icon: iconDic },
  ];

  const totalChapters = selectedBook ? (bookChapters[selectedBook] || 0) : 0;
  const chapterTheme = selectedBook && selectedChapter
    ? chapterThemes[selectedBook]?.[selectedChapter]
    : null;

  const goToNextChapter = () => {
    if (selectedBook && selectedChapter && selectedChapter < totalChapters) {
      setSelectedChapter(selectedChapter + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevChapter = () => {
    if (selectedBook && selectedChapter && selectedChapter > 1) {
      setSelectedChapter(selectedChapter - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderBookGrid = (books: string[], emoji: string) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {filterBooks(books).map((book, i) => (
        <div
          key={i}
          onClick={() => { setSelectedBook(book); setSelectedChapter(null); }}
          className="bg-popover rounded-2xl p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer border border-border text-center"
        >
          <span className="text-2xl block mb-1">{emoji}</span>
          <span className="font-body text-sm text-foreground font-semibold">{book}</span>
          <span className="block text-[10px] text-muted-foreground mt-0.5">{bookChapters[book] || "?"} capítulos</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen py-6 px-4" style={{ background: "transparent" }}>
      <div className="max-w-4xl mx-auto">
        <PageHeader title="Bíblia" subtitle="66 livros para explorar" icon={iconBiblia} />
        <p className="text-center -mt-6 mb-6 font-body text-sm italic text-primary font-semibold">
          Tradução: João Ferreira de Almeida
        </p>

        {/* Category selector: icons above central logo */}
        {!selectedBook && (
          <div className="mb-6 flex flex-col items-center gap-4">
            <div className="flex items-start justify-center gap-4 sm:gap-8">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => { setTab(t.key); setSelectedBook(null); setSelectedChapter(null); }}
                  className={`flex flex-col items-center gap-1 transition-transform hover:scale-110 ${tab === t.key ? "scale-110" : ""}`}
                >
                  <img loading="lazy" decoding="async"
                    src={t.icon}
                    alt={t.label}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 shadow-lg bg-white object-cover ${tab === t.key ? "border-primary" : "border-primary/30"}`}
                  />
                  <span className="text-[10px] sm:text-xs font-bold text-primary text-center leading-tight max-w-[80px]">
                    {t.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">({t.count})</span>
                </button>
              ))}
            </div>
            <img loading="lazy" decoding="async" src={iconBiblia} alt="Explorar a Bíblia" className="w-28 sm:w-36 drop-shadow-xl" />
          </div>
        )}

        {/* Search */}
        {(tab === "antigo" || tab === "novo") && !selectedBook && (
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Pesquisar livro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-background pl-12 pr-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {/* Chapter view with full verses */}
        {selectedBook && selectedChapter && (
          <div
            className="relative rounded-2xl shadow-2xl border border-amber-900/30 mb-4 mx-[-1rem] sm:mx-[-2rem]"
            style={
              fromSticker
                ? {
                    background: "hsl(45,60%,97%)",
                    minHeight: "600px",
                    color: "hsl(25 50% 22%)",
                    padding: "clamp(2rem, 5vw, 4rem) clamp(1.25rem, 5vw, 4rem)",
                  }
                : {
                    backgroundImage: `url(${pergaminhoBg})`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    minHeight: "600px",
                    color: "hsl(25 50% 22%)",
                    padding: "clamp(2.5rem, 6vw, 5rem) clamp(1.25rem, 5vw, 4rem)",
                  }
            }>


            <button
              onClick={() => setSelectedChapter(null)}
              className="text-primary font-display text-sm font-bold mb-4 hover:underline"
            >
              ← Voltar aos capítulos
            </button>

            <h2 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-1">
              📖 {selectedBook} — Capítulo {selectedChapter}
            </h2>

            {/* Theme summary */}
            {chapterTheme && (
              <div className="bg-primary/5 rounded-xl p-3 mb-4 border border-primary/20">
                <p className="font-body text-sm text-foreground/80 italic">{chapterTheme}</p>
              </div>
            )}

            {/* Font size control */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs text-muted-foreground">Tamanho:</span>
              <button
                onClick={() => setFontSize((s) => Math.max(12, s - 2))}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground font-bold hover:bg-muted/80"
              >
                A-
              </button>
              <span className="text-sm text-muted-foreground">{fontSize}px</span>
              <button
                onClick={() => setFontSize((s) => Math.min(28, s + 2))}
                className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground font-bold hover:bg-muted/80"
              >
                A+
              </button>
              <button
                onClick={toggleListen}
                disabled={!verses.length}
                className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-display font-extrabold shadow transition ${
                  speaking
                    ? "bg-rose-500 text-white hover:bg-rose-600"
                    : "bg-amber-400 text-amber-950 hover:bg-amber-300"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                title={speaking ? "Parar leitura" : "Ouvir capítulo"}
              >
                {speaking ? "⏸️ Parar" : "🔊 Ouvir"}
              </button>
            </div>


            {/* Verses */}
            {loadingVerses && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Carregando versículos...</p>
              </div>
            )}

            {verseError && (
              <div className="bg-destructive/10 rounded-xl p-4 border border-destructive/20 text-center">
                <p className="text-sm text-destructive">{verseError}</p>
                <button
                  onClick={() => {
                    // retry
                    const ch = selectedChapter;
                    setSelectedChapter(null);
                    setTimeout(() => setSelectedChapter(ch), 100);
                  }}
                  className="mt-2 text-xs text-primary underline"
                >
                  Tentar novamente
                </button>
              </div>
            )}

            {!loadingVerses && !verseError && verses.length > 0 && (
              <div className="space-y-2" style={{ fontSize: `${fontSize}px` }}>
                {verses.map((v) => (
                  <p key={v.verse} className="font-body text-foreground leading-relaxed">
                    <span className="font-bold text-primary text-xs align-super mr-1">
                      {v.verse}
                    </span>
                    {v.text}
                  </p>
                ))}
              </div>
            )}

            {/* Chapter navigation */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
              <button
                onClick={goToPrevChapter}
                disabled={selectedChapter <= 1}
                className="flex items-center gap-1 text-sm font-display font-bold text-primary disabled:text-muted-foreground disabled:cursor-not-allowed hover:underline"
              >
                ← Anterior
              </button>
              <span className="text-xs text-muted-foreground">
                Cap. {selectedChapter} de {totalChapters}
              </span>
              <button
                onClick={goToNextChapter}
                disabled={selectedChapter >= totalChapters}
                className="flex items-center gap-1 text-sm font-display font-bold text-primary disabled:text-muted-foreground disabled:cursor-not-allowed hover:underline"
              >
                Próximo →
              </button>
            </div>

            {/* Translation credit */}
            <p className="text-[10px] text-muted-foreground text-center mt-4">
              Tradução João Ferreira de Almeida — Domínio Público — via bible-api.com
            </p>
          </div>
        )}

        {/* Book detail with chapters */}
        {selectedBook && !selectedChapter && (
          <div className="bg-popover rounded-2xl p-6 shadow-lg border border-border mb-4">
            <button
              onClick={() => setSelectedBook(null)}
              className="text-primary font-display text-sm font-bold mb-4 hover:underline"
            >
              ← Voltar
            </button>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">📖 {selectedBook}</h2>
            <p className="font-body text-foreground leading-relaxed mb-4">
              {bookSummaries[selectedBook] || "Conteúdo em breve..."}
            </p>

            <h3 className="font-display text-lg font-bold text-foreground mb-3">
              📑 Capítulos ({totalChapters})
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
              {Array.from({ length: totalChapters }, (_, i) => i + 1).map((ch) => (
                <button
                  key={ch}
                  onClick={() => setSelectedChapter(ch)}
                  className="aspect-square rounded-xl border flex items-center justify-center font-display font-bold text-sm transition-all hover:scale-110 bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Book grid */}
        {tab === "antigo" && !selectedBook && renderBookGrid(antigoTestamento, "📜")}
        {tab === "novo" && !selectedBook && renderBookGrid(novoTestamento, "✝️")}

        {/* Dictionary */}
        {tab === "dicionario" && (
          <div>
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
              <input
                type="text"
                placeholder="Digite pelo menos 2 letras para buscar..."
                value={dictSearch}
                onChange={(e) => setDictSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-background pl-12 pr-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {dictSearch.trim().length < 2 ? (
              <div className="text-center py-12">
                <span className="text-6xl block mb-4">🔍</span>
                <p className="font-display text-lg font-bold text-foreground">Use a lupa para buscar</p>
                <p className="font-body text-sm text-muted-foreground mt-2">
                  O dicionário contém {dicionario.length} termos extraídos de toda a Bíblia.
                </p>
              </div>
            ) : filteredDict.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-body text-muted-foreground">Nenhum resultado para "{dictSearch}"</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDict.map((d, i) => (
                  <div key={i} className="bg-popover rounded-2xl p-4 shadow-md border border-border">
                    <h3 className="font-display text-lg font-bold text-primary">{d.term}</h3>
                    <p className="font-body text-sm text-foreground mt-1">{d.def}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <FeedbackFooter />
    </div>
  );
}
