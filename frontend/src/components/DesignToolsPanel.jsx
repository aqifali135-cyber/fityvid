import { useEffect, useMemo, useRef, useState } from 'react';
import {
  generatePaletteFromBase,
  generateRandomPalette,
  getDesignTool,
  getMonthName,
  getWeekdayLabels,
  buildCalendarMatrix,
  renderAdToCanvas,
  renderCalendarToCanvas,
} from '../utils/designTools';
import { canvasToBlob, downloadBlob, loadImageFromFile } from '../utils/imageTools';
import './DesignToolsPanel.css';

const PALETTE_TYPES = ['Monochromatic', 'Analogous', 'Complementary', 'Triadic', 'Pastel'];

export default function DesignToolsPanel({ toolId, onClose }) {
  const tool = getDesignTool(toolId);
  const previewRef = useRef(null);

  // Calendar state
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [calendarTitle, setCalendarTitle] = useState('');
  const [themeColor, setThemeColor] = useState('#7C3AED');
  const [weekStartsOn, setWeekStartsOn] = useState('sunday');
  const [highlightDays, setHighlightDays] = useState('');
  const [calendarUrl, setCalendarUrl] = useState('');

  // Palette state
  const [paletteMode, setPaletteMode] = useState('manual');
  const [baseColor, setBaseColor] = useState('#8B5CF6');
  const [paletteType, setPaletteType] = useState('Monochromatic');
  const [palette, setPalette] = useState(() => generatePaletteFromBase('#8B5CF6', 'Monochromatic'));
  const [copiedHex, setCopiedHex] = useState('');

  // Admaker state
  const [bgFile, setBgFile] = useState(null);
  const [bgImage, setBgImage] = useState(null);
  const [headline, setHeadline] = useState('Grow Faster With FityVid');
  const [subheadline, setSubheadline] = useState('Create stylish posts, ads, and content tools in minutes.');
  const [cta, setCta] = useState('Get Started');
  const [brand, setBrand] = useState('FityVid');
  const [price, setPrice] = useState('');
  const [adTheme, setAdTheme] = useState('#7C3AED');
  const [textColor, setTextColor] = useState('#ffffff');
  const [layout, setLayout] = useState('square');
  const [adStyle, setAdStyle] = useState('minimal');
  const [adUrl, setAdUrl] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setStatus('');
    setError('');
    setCopiedHex('');
    if (toolId === 'calendar-maker') {
      generateCalendar();
    }
    if (toolId === 'color-palette') {
      setPalette(generatePaletteFromBase(baseColor, paletteType));
    }
    if (toolId === 'admaker') {
      generateAd();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolId]);

  useEffect(() => {
    return () => {
      if (calendarUrl) URL.revokeObjectURL(calendarUrl);
      if (adUrl) URL.revokeObjectURL(adUrl);
    };
  }, [calendarUrl, adUrl]);

  const weekdays = useMemo(() => getWeekdayLabels(weekStartsOn), [weekStartsOn]);
  const weeks = useMemo(
    () => buildCalendarMatrix(Number(year), Number(month), weekStartsOn),
    [year, month, weekStartsOn],
  );

  async function generateCalendar() {
    try {
      setError('');
      const canvas = renderCalendarToCanvas({
        year: Number(year),
        month: Number(month),
        title: calendarTitle,
        themeColor,
        weekStartsOn,
        highlightDays,
      });
      const blob = await canvasToBlob(canvas, 'image/png');
      if (calendarUrl) URL.revokeObjectURL(calendarUrl);
      setCalendarUrl(URL.createObjectURL(blob));
      setStatus('Calendar ready to download.');
    } catch {
      setError('Unable to generate calendar.');
    }
  }

  async function downloadCalendar() {
    await generateCalendar();
    const canvas = renderCalendarToCanvas({
      year: Number(year),
      month: Number(month),
      title: calendarTitle,
      themeColor,
      weekStartsOn,
      highlightDays,
    });
    const blob = await canvasToBlob(canvas, 'image/png');
    downloadBlob(blob, `calendar-${year}-${Number(month) + 1}.png`);
  }

  function handleGeneratePalette() {
    if (paletteMode === 'random') {
      setPalette(generateRandomPalette());
    } else {
      setPalette(generatePaletteFromBase(baseColor, paletteType));
    }
    setStatus('Palette updated.');
  }

  async function copyHex(hex) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(''), 1500);
    } catch {
      /* ignore */
    }
  }

  async function handleBgUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const image = await loadImageFromFile(file);
      setBgFile(file);
      setBgImage(image);
      setError('');
    } catch {
      setError('Unable to load background image.');
    }
  }

  async function generateAd() {
    try {
      setError('');
      const canvas = renderAdToCanvas({
        backgroundImage: bgImage,
        headline,
        subheadline,
        cta,
        brand,
        price,
        themeColor: adTheme,
        textColor,
        layout,
        style: adStyle,
      });
      const blob = await canvasToBlob(canvas, 'image/png');
      if (adUrl) URL.revokeObjectURL(adUrl);
      setAdUrl(URL.createObjectURL(blob));
      setStatus('Ad preview ready.');
    } catch {
      setError('Unable to generate ad.');
    }
  }

  async function downloadAd() {
    const canvas = renderAdToCanvas({
      backgroundImage: bgImage,
      headline,
      subheadline,
      cta,
      brand,
      price,
      themeColor: adTheme,
      textColor,
      layout,
      style: adStyle,
    });
    const blob = await canvasToBlob(canvas, 'image/png');
    downloadBlob(blob, `admaker-${layout}.png`);
  }

  function clearAd() {
    setBgFile(null);
    setBgImage(null);
    setHeadline('Grow Faster With FityVid');
    setSubheadline('Create stylish posts, ads, and content tools in minutes.');
    setCta('Get Started');
    setBrand('FityVid');
    setPrice('');
    setAdTheme('#7C3AED');
    setTextColor('#ffffff');
    setLayout('square');
    setAdStyle('minimal');
    if (adUrl) URL.revokeObjectURL(adUrl);
    setAdUrl('');
    setStatus('');
  }

  if (!tool) return null;

  return (
    <section id="design-tools-panel" className="design-tools-panel-section">
      <div className="container">
        <div className="design-tools-panel card">
          <div className="design-tools-panel__head">
            <div>
              <p className="design-tools-panel__eyebrow">Design Tools</p>
              <h2 className="design-tools-panel__title">{tool.title}</h2>
              <p className="design-tools-panel__subtitle">
                Create designs instantly in your browser. No account and no backend required.
              </p>
            </div>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close Tool
            </button>
          </div>

          {toolId === 'calendar-maker' && (
            <>
              <div className="design-tools-panel__grid">
                <label>
                  Month
                  <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>
                        {getMonthName(i)}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Year
                  <input
                    type="number"
                    min="1970"
                    max="2100"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                  />
                </label>
                <label className="design-tools-panel__span2">
                  Title (optional)
                  <input
                    type="text"
                    value={calendarTitle}
                    onChange={(e) => setCalendarTitle(e.target.value)}
                    placeholder={`${getMonthName(month)} ${year}`}
                  />
                </label>
                <label>
                  Theme color
                  <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} />
                </label>
                <label>
                  Week starts on
                  <select value={weekStartsOn} onChange={(e) => setWeekStartsOn(e.target.value)}>
                    <option value="sunday">Sunday</option>
                    <option value="monday">Monday</option>
                  </select>
                </label>
                <label className="design-tools-panel__span2">
                  Highlight days (comma separated)
                  <input
                    type="text"
                    value={highlightDays}
                    onChange={(e) => setHighlightDays(e.target.value)}
                    placeholder="1, 15, 25"
                  />
                </label>
              </div>

              <div className="design-tools-panel__actions">
                <button type="button" className="btn btn-primary" onClick={generateCalendar}>
                  Generate
                </button>
                <button type="button" className="btn btn-outline" onClick={downloadCalendar}>
                  Download PNG
                </button>
              </div>

              <div className="design-calendar-live" ref={previewRef}>
                <div className="design-calendar-live__header" style={{ background: themeColor }}>
                  <strong>{calendarTitle || `${getMonthName(month)} ${year}`}</strong>
                  <span>FityVid Calendar Maker</span>
                </div>
                <div className="design-calendar-live__weekdays">
                  {weekdays.map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                <div className="design-calendar-live__grid">
                  {weeks.flat().map((day, index) => {
                    const highlighted = String(highlightDays)
                      .split(',')
                      .map((v) => Number(v.trim()))
                      .includes(day);
                    return (
                      <div
                        key={`${day || 'e'}-${index}`}
                        className={`design-calendar-live__cell${highlighted ? ' is-highlight' : ''}${!day ? ' is-empty' : ''}`}
                        style={highlighted ? { background: `${themeColor}22`, color: themeColor } : undefined}
                      >
                        {day || ''}
                      </div>
                    );
                  })}
                </div>
              </div>
              {calendarUrl && (
                <p className="design-tools-panel__status">PNG export preview is ready for download.</p>
              )}
            </>
          )}

          {toolId === 'color-palette' && (
            <>
              <div className="design-tools-panel__tabs">
                <button
                  type="button"
                  className={`design-tools-panel__tab${paletteMode === 'manual' ? ' is-active' : ''}`}
                  onClick={() => setPaletteMode('manual')}
                >
                  Manual palette
                </button>
                <button
                  type="button"
                  className={`design-tools-panel__tab${paletteMode === 'random' ? ' is-active' : ''}`}
                  onClick={() => setPaletteMode('random')}
                >
                  Random palette
                </button>
              </div>

              {paletteMode === 'manual' ? (
                <div className="design-tools-panel__grid">
                  <label>
                    Base color
                    <input type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} />
                  </label>
                  <label>
                    Palette type
                    <select value={paletteType} onChange={(e) => setPaletteType(e.target.value)}>
                      {PALETTE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ) : (
                <p className="design-tools-panel__note">Generate a fresh 5-color palette with one click.</p>
              )}

              <div className="design-tools-panel__actions">
                <button type="button" className="btn btn-primary" onClick={handleGeneratePalette}>
                  {paletteMode === 'random' ? 'Generate New Palette' : 'Generate Palette'}
                </button>
              </div>

              <div className="design-palette">
                {palette.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    className={`design-palette__swatch${copiedHex === hex ? ' is-copied' : ''}`}
                    onClick={() => copyHex(hex)}
                  >
                    <span className="design-palette__color" style={{ background: hex }} />
                    <span className="design-palette__hex">{copiedHex === hex ? 'Copied!' : hex}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {toolId === 'admaker' && (
            <>
              <div className="design-tools-panel__grid">
                <label className="design-tools-panel__span2">
                  Background image (optional)
                  <input type="file" accept="image/*" onChange={handleBgUpload} />
                  {bgFile && <span className="design-tools-panel__file">{bgFile.name}</span>}
                </label>
                <label>
                  Brand name
                  <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
                </label>
                <label>
                  CTA text
                  <input type="text" value={cta} onChange={(e) => setCta(e.target.value)} />
                </label>
                <label className="design-tools-panel__span2">
                  Headline
                  <input type="text" value={headline} onChange={(e) => setHeadline(e.target.value)} />
                </label>
                <label className="design-tools-panel__span2">
                  Subheadline
                  <input type="text" value={subheadline} onChange={(e) => setSubheadline(e.target.value)} />
                </label>
                <label>
                  Price text (optional)
                  <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="$19.99" />
                </label>
                <label>
                  Layout preset
                  <select value={layout} onChange={(e) => setLayout(e.target.value)}>
                    <option value="square">Square Post</option>
                    <option value="story">Story</option>
                    <option value="banner">Banner</option>
                  </select>
                </label>
                <label>
                  Template style
                  <select value={adStyle} onChange={(e) => setAdStyle(e.target.value)}>
                    <option value="minimal">Minimal</option>
                    <option value="sale">Sale Promo</option>
                    <option value="product">Product Highlight</option>
                    <option value="service">Service Ad</option>
                  </select>
                </label>
                <label>
                  Theme color
                  <input type="color" value={adTheme} onChange={(e) => setAdTheme(e.target.value)} />
                </label>
                <label>
                  Text color
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
                </label>
              </div>

              <div className="design-tools-panel__actions">
                <button type="button" className="btn btn-primary" onClick={generateAd}>
                  Generate
                </button>
                <button type="button" className="btn btn-outline" onClick={downloadAd}>
                  Download PNG
                </button>
                <button type="button" className="btn btn-secondary" onClick={clearAd}>
                  Clear
                </button>
              </div>

              <div className="design-ad-preview">
                {adUrl ? (
                  <img src={adUrl} alt="Admaker preview" />
                ) : (
                  <p className="design-tools-panel__empty">Ad preview will appear here.</p>
                )}
              </div>
            </>
          )}

          {error && <p className="error-text">{error}</p>}
          {status && <p className="design-tools-panel__status" role="status">{status}</p>}
        </div>
      </div>
    </section>
  );
}
