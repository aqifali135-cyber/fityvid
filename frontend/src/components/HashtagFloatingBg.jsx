import './HashtagFloatingBg.css';

const HASHTAG_SYMBOLS = [
  { top: '8%', left: '5%', size: 48, color: 'pink', delay: 0, duration: 9, blur: true },
  { top: '14%', right: '7%', size: 36, color: 'blue', delay: -2, duration: 11, blur: false },
  { top: '30%', left: '10%', size: 42, color: 'purple', delay: -4, duration: 10, blur: false },
  { top: '38%', right: '4%', size: 52, color: 'gray', delay: -1, duration: 12, blur: true },
  { top: '55%', left: '3%', size: 34, color: 'blue', delay: -3, duration: 8, blur: false },
  { top: '62%', right: '12%', size: 40, color: 'pink', delay: -5, duration: 10, blur: false },
  { top: '74%', left: '16%', size: 46, color: 'purple', delay: -2, duration: 11, blur: true, desktopOnly: true },
  { top: '80%', right: '5%', size: 32, color: 'gray', delay: -6, duration: 9, blur: false, desktopOnly: true },
];

const DECORATIONS = [
  { top: '22%', left: '28%', type: 'sparkle', desktopOnly: true },
  { top: '32%', right: '24%', type: 'dot', desktopOnly: true },
  { top: '58%', left: '32%', type: 'plus', desktopOnly: true },
  { top: '66%', right: '30%', type: 'sparkle' },
  { top: '26%', right: '32%', type: 'arc', desktopOnly: true },
  { top: '52%', left: '24%', type: 'arc' },
];

export default function HashtagFloatingBg() {
  return (
    <div className="hashtag-bg" aria-hidden="true">
      <div className="hashtag-bg__blobs">
        <span className="hashtag-bg__blob hashtag-bg__blob--purple" />
        <span className="hashtag-bg__blob hashtag-bg__blob--pink" />
        <span className="hashtag-bg__blob hashtag-bg__blob--blue" />
        <span className="hashtag-bg__blob hashtag-bg__blob--lavender" />
      </div>

      {HASHTAG_SYMBOLS.map((sym, i) => (
        <span
          key={`hash-${i}`}
          className={`hashtag-symbol hashtag-symbol--${sym.color} ${
            sym.blur ? 'hashtag-symbol--blur' : ''
          } ${sym.desktopOnly ? 'hashtag-float--desktop-only' : ''}`}
          style={{
            top: sym.top,
            left: sym.left,
            right: sym.right,
            fontSize: `${sym.size}px`,
            animationDuration: `${sym.duration}s`,
            animationDelay: `${sym.delay}s`,
          }}
        >
          #
        </span>
      ))}

      {DECORATIONS.map((item, i) => (
        <span
          key={`decor-${i}`}
          className={`hashtag-decor hashtag-decor--${item.type} ${
            item.desktopOnly ? 'hashtag-float--desktop-only' : ''
          }`}
          style={{ top: item.top, left: item.left, right: item.right }}
        />
      ))}
    </div>
  );
}
