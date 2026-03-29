import { TEAM } from "@/lib/constants";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Team = () => {
  const ref = useScrollReveal();

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-[1400px] mx-auto">
        <p className="rv font-mono text-xs uppercase tracking-[0.2em] text-primary mb-2">L'équipe</p>
        <h2 className="rv font-clash text-3xl md:text-4xl font-bold text-foreground mb-10">
          Les cerveaux <span className="text-primary">derrière la machine.</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="rv rounded-xl border border-border bg-surface p-6 transition-all duration-500 hover:border-border-light hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <span className="font-clash font-bold text-primary text-lg">{member.initials}</span>
              </div>
              <h3 className="font-clash font-semibold text-foreground text-lg">{member.name}</h3>
              <p className="font-mono text-xs text-primary uppercase tracking-wider mt-1">{member.role}</p>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
