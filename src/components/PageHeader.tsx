/** Espaçamento do menu superior global; o menu é renderizado uma única vez no App. */
interface PageHeaderProps { title?: string; subtitle?: string; icon?: string; }
export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return <><div aria-hidden="true" className="h-[62px] sm:h-[78px] w-full shrink-0" /><h1 className="sr-only">{title || "Lemos a Palavra"}{subtitle ? ` — ${subtitle}` : ""}</h1></>;
}
