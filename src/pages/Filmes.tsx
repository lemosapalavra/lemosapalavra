import VideoCentralLayout from "@/components/VideoCentralLayout";
import { filmesVideos } from "@/data/bibleVideos";

export default function Filmes() {
  return <VideoCentralLayout title="Filmes Bíblicos" subtitle="Escolha um filme" videos={filmesVideos} />;
}
