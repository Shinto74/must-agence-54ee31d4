import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  intro?: string;
  children: ReactNode;
}

export default function LegalLayout({ title, intro, children }: Props) {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground/50 hover:text-primary transition-colors mb-10">
          <ArrowLeft size={14} /> Retour à l'accueil
        </Link>
        <h1 className="font-clash font-black text-foreground text-4xl md:text-5xl mb-6 leading-tight">
          {title}
        </h1>
        {intro && (
          <p className="text-foreground/70 text-base leading-relaxed mb-10 border-l-2 border-primary/40 pl-4 italic">
            {intro}
          </p>
        )}
        <div className="space-y-8 text-foreground/80 text-[15px] leading-relaxed font-outfit [&_h2]:font-clash [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-3 [&_h3]:font-clash [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1 [&_a]:text-primary [&_a]:underline">
          {children}
        </div>
        <p className="mt-16 text-xs font-mono text-foreground/40 uppercase tracking-wider">
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long" })}
        </p>
      </div>
    </div>
  );
}
