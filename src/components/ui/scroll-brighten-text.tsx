/**
 * Splits text into words that each brighten from dim to full color as they
 * scroll through the lower half of the viewport — the "grayish text turning
 * white as you read down the page" effect. Pure CSS (animation-timeline:
 * view()), no scroll listener. Server-renderable — no client JS involved.
 */
export function ScrollBrightenText({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");

  return (
    <p className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="brighten-word inline-block">
          {word}
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
