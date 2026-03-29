import { useScrollReveal } from "@/hooks/useScrollReveal";

interface CustomOfferProps {
  text: string;
  button: string;
}

const CustomOffer = ({ text, button }: CustomOfferProps) => {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="py-12 px-6">
      <div className="rv max-w-[900px] mx-auto text-center">
        <p className="text-muted-foreground mb-6 leading-relaxed">{text}</p>
        <a
          href="#devis"
          className="inline-block px-8 py-3.5 rounded-pill border border-primary text-primary font-mono text-sm uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
          {button}
        </a>
      </div>
    </section>
  );
};

export default CustomOffer;
