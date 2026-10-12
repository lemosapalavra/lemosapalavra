import BrincandoBiblia from "@/components/BrincandoBiblia";

/** Página APRENDA: somente as 16 novas atividades bíblicas interativas. */
export default function Atividades() {
  return <BrincandoBiblia onBack={() => { window.location.href = "/"; }} />;
}
