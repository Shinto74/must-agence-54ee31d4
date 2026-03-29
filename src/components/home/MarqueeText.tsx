interface MarqueeTextProps {
  words: string[];
}

const MarqueeText = ({ words }: MarqueeTextProps) => {
  const content = words.join(" · ");
  return (
    <div className="overflow-hidden border-y border-border py-4 bg-surface">
      <div className="animate-mq whitespace-nowrap flex">
        {[0, 1, 2].map((i) => (
          <span key={i} className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mx-0 shrink-0">
            {content} ·{" "}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MarqueeText;
