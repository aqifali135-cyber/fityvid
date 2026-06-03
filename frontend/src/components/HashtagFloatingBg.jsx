import './HashtagFloatingBg.css';

/** Positions/sizes for floating # symbols — desktop shows all 12, mobile shows first 6 */
const HASHTAG_SYMBOLS = [
  { top: '6%', left: '4%', size: 52, color: 'pink', delay: 0, duration: 9, blur: true },
  { top: '12%', right: '8%', size: 38, color: 'blue', delay: -2, duration: 11, blur: false },
  { top: '28%', left: '12%', size: 44, color: 'purple', delay: -4, duration: 10, blur: false },
  { top: '35%', right: '5%', size: 56, color: 'gray', delay: -1, duration: 12, blur: true },
  { top: '52%', left: '2%', size: 36, color: 'blue', delay: -3, duration: 8, blur: false },
  { top: '58%', right: '14%', size: 42, color: 'pink', delay: -5, duration: 10, blur: false },
  { top: '72%', left: '18%', size: 48, color: 'purple', delay: -2, duration: 11, blur: true, desktopOnly: true },
  { top: '78%', right: '6%', size: 34, color: 'gray', delay: -6, duration: 9, blur: false, desktopOnly: true },
  { top: '18%', left: '42%', size: 30, color: 'pink', delay: -3, duration: 13, blur: true, desktopOnly: true },
  { top: '45%', right: '28%', size: 40, color: 'blue', delay: -7, duration: 10, blur: false, desktopOnly: true },
  { top: '65%', left: '38%', size: 28, color: 'purple', delay: -4, duration: 14, blur: true, desktopOnly: true },
  { top: '88%', right: '22%', size: 46, color: 'gray', delay: -1, duration: 9, blur: false, desktopOnly: true },
];

export default function HashtagFloatingBg() {
  return (
    <div className="hashtag-bg" aria-hidden="true">
      {HASHTAG_SYMBOLS.map((sym, i) => (
        <span
          key={i}
          className={`hashtag-symbol hashtag-symbol--${sym.color} ${
            sym.blur ? 'hashtag-symbol--blur' : ''
          } ${sym.desktopOnly ? 'hashtag-symbol--desktop-only' : ''}`}
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
    </div>
  );
}
