export default function Quote({ text, cite }) {
  return (
    <div className="quote-strip">
      <div className="wrap">
        <blockquote>{text}</blockquote>
        <cite>{cite}</cite>
      </div>
    </div>
  );
}
