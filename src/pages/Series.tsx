import VideoCentralLayout from "@/components/VideoCentralLayout";
import { seriesVideos } from "@/data/bibleVideos";

export default function Series() {
  return <VideoCentralLayout title="Séries Bíblicas" subtitle="Escolha um vídeo" videos={seriesVideos} />;
}
