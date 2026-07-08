import { useMemo, useState } from 'react';
import SEO from '../components/SEO';
import ToolsCategoryMenu from '../components/ToolsCategoryMenu';
import AIWriterPanel from '../components/AIWriterPanel';
import ImageToolsPanel from '../components/ImageToolsPanel';
import DesignToolsPanel from '../components/DesignToolsPanel';
import { PAGE_SEO } from '../constants/seo';
import { getDesignTool } from '../utils/designTools';
import {
  STYLE_FILTERS,
  filterStylishTextVariants,
  generateStylishTextVariants,
} from '../utils/stylishTextGenerator';
import {
  EMOJI_CATEGORIES,
  SYMBOL_CATEGORIES,
  countWords,
  filterBySearch,
  getCategoryItems,
  isFlagItem,
} from '../utils/textToolContent';
import '../components/SeoProse.css';
import './StylishTextGenerator.css';

const FAQ_ITEMS = [
  {
    q: 'Is the stylish text generator free?',
    a: 'Yes. FityVid stylish text generator is free and works in your browser with no sign-up required.',
  },
  {
    q: 'Will stylish fonts work on Instagram and TikTok?',
    a: 'Most Unicode styles work in bios, captions, and usernames on major platforms. Some apps may limit certain characters.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No. Type your text, pick a style, and copy it. Everything runs locally in your browser.',
  },
  {
    q: 'Can I use stylish text for usernames?',
    a: 'Yes, where the platform allows Unicode characters. Always check if the style displays correctly before publishing.',
  },
];

export default function StylishTextGenerator() {
  const seo = PAGE_SEO.stylishTextGenerator;
  const [input, setInput] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [copiedId, setCopiedId] = useState('');
  const [panel, setPanel] = useState('fonts');
  const [emojiCategory, setEmojiCategory] = useState('All');
  const [symbolCategory, setSymbolCategory] = useState('All');
  const [pickerSearch, setPickerSearch] = useState('');
  const [wordCounterText, setWordCounterText] = useState('');
  const [charCopied, setCharCopied] = useState('');
  const [aiWriterToolId, setAiWriterToolId] = useState('');
  const [imageToolId, setImageToolId] = useState('');
  const [designToolId, setDesignToolId] = useState('');

  const variants = useMemo(() => generateStylishTextVariants(input), [input]);
  const filteredVariants = useMemo(
    () => filterStylishTextVariants(variants, activeFilter),
    [variants, activeFilter],
  );
  const wordStats = useMemo(() => countWords(wordCounterText), [wordCounterText]);

  const activePickerCategory = panel === 'emojis' ? emojiCategory : symbolCategory;
  const pickerCategories = panel === 'emojis' ? EMOJI_CATEGORIES : SYMBOL_CATEGORIES;
  const pickerItems = useMemo(() => {
    const source =
      panel === 'emojis'
        ? getCategoryItems(EMOJI_CATEGORIES, emojiCategory)
        : getCategoryItems(SYMBOL_CATEGORIES, symbolCategory);
    return filterBySearch(source, pickerSearch);
  }, [panel, emojiCategory, symbolCategory, pickerSearch]);

  async function handleCopy(id, text) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(''), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  async function handleCharCopy(value) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCharCopied(value);
      setTimeout(() => setCharCopied(''), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  function handleClear() {
    setInput('');
    setCopiedId('');
  }

  function handleTextAction(action) {
    if (!action) return;

    if (action.type === 'font-filter') {
      setPanel('fonts');
      setActiveFilter(action.filter || 'All');
      requestAnimationFrame(() => {
        document.getElementById('stylish-text-results-anchor')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
      return;
    }

    if (action.type === 'emoji') {
      setPanel('emojis');
      setEmojiCategory(action.category || 'All');
      setPickerSearch('');
      requestAnimationFrame(() => {
        document.getElementById('stylish-text-picker-anchor')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
      return;
    }

    if (action.type === 'symbol') {
      setPanel('symbols');
      setSymbolCategory(action.category || 'All');
      setPickerSearch('');
      requestAnimationFrame(() => {
        document.getElementById('stylish-text-picker-anchor')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
      return;
    }

    if (action.type === 'word-counter') {
      setPanel('word-counter');
      requestAnimationFrame(() => {
        document.getElementById('stylish-text-word-counter')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    }
  }

  function handleAiWriterSelect(toolId) {
    if (!toolId) return;
    setImageToolId('');
    setDesignToolId('');
    setAiWriterToolId(toolId);
    requestAnimationFrame(() => {
      document.getElementById('ai-writer-panel')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  function handleImageToolSelect(toolId) {
    if (!toolId) return;
    setAiWriterToolId('');
    setDesignToolId('');
    setImageToolId(toolId);
    requestAnimationFrame(() => {
      document.getElementById('image-tools-panel')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  function handleDesignToolSelect(toolId) {
    if (!toolId) return;
    const designTool = getDesignTool(toolId);
    setAiWriterToolId('');

    if (designTool?.reuseImageTool) {
      setDesignToolId('');
      setImageToolId(designTool.reuseImageTool);
      requestAnimationFrame(() => {
        document.getElementById('image-tools-panel')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
      return;
    }

    setImageToolId('');
    setDesignToolId(toolId);
    requestAnimationFrame(() => {
      document.getElementById('design-tools-panel')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  return (
    <>
      <SEO title={seo.title} description={seo.description} path={seo.path} />

      <div className="stylish-text-page">
        <header className="stylish-text-hero">
          <div className="container stylish-text-hero__inner">
            <h1 className="stylish-text-hero__title">Stylish Text Generator</h1>
            <p className="stylish-text-hero__subtitle">
              Create stylish fonts for Instagram bio, captions, TikTok, Facebook, YouTube and more.
            </p>
            <p className="stylish-text-hero__rating" aria-label="Rated 4.8 out of 5">
              <span className="stylish-text-hero__stars" aria-hidden="true">
                ★★★★★
              </span>
              <span className="stylish-text-hero__score">4.8</span>
            </p>
            <ToolsCategoryMenu
              onTextAction={handleTextAction}
              onAiWriterSelect={handleAiWriterSelect}
              onImageToolSelect={handleImageToolSelect}
              onDesignToolSelect={handleDesignToolSelect}
            />
          </div>
        </header>

        <section className="stylish-text-input-section">
          <div className="container">
            <div className="stylish-text-input-wrap">
              <input
                id="stylish-text-input"
                type="text"
                className="stylish-text-input"
                placeholder="Type your text here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck={false}
                autoComplete="off"
              />
              {input && (
                <button
                  type="button"
                  className="stylish-text-input__clear"
                  onClick={handleClear}
                  aria-label="Clear text"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </section>

        {aiWriterToolId && (
          <AIWriterPanel
            toolId={aiWriterToolId}
            onClose={() => setAiWriterToolId('')}
          />
        )}

        {imageToolId && (
          <ImageToolsPanel
            toolId={imageToolId}
            onClose={() => setImageToolId('')}
          />
        )}

        {designToolId && (
          <DesignToolsPanel
            toolId={designToolId}
            onClose={() => setDesignToolId('')}
          />
        )}

        {panel === 'fonts' && (
          <section id="stylish-text-results-anchor" className="stylish-text-workspace">
            <div className="container stylish-text-workspace__grid">
              <aside className="stylish-text-sidebar" aria-label="Font style filters">
                <h2 className="stylish-text-sidebar__title">Select a font style</h2>
                <div className="stylish-text-filters" role="group" aria-label="Filter font styles">
                  {STYLE_FILTERS.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      className={`stylish-text-filter${activeFilter === filter ? ' stylish-text-filter--active' : ''}`}
                      aria-pressed={activeFilter === filter}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </aside>

              <div className="stylish-text-results-panel">
                <div className="stylish-text-results-panel__head">
                  <h2 className="stylish-text-results-panel__title">
                    {activeFilter === 'All' ? 'All Fonts' : activeFilter}
                  </h2>
                  <span className="stylish-text-results-panel__count">
                    {filteredVariants.length} styles
                  </span>
                </div>

                <div className="stylish-text-results" aria-live="polite">
                  {filteredVariants.map((variant) => (
                    <article key={variant.id} className="stylish-text-row">
                      <div className="stylish-text-row__content">
                        <p className="stylish-text-row__output" lang="en">
                          {variant.text}
                        </p>
                        <div className="stylish-text-row__meta">
                          <span className="stylish-text-row__category">{variant.category}</span>
                          <span className="stylish-text-row__name">{variant.name}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="stylish-text-row__copy"
                        onClick={() => handleCopy(variant.id, variant.text)}
                        aria-label={`Copy ${variant.name} style`}
                      >
                        {copiedId === variant.id ? 'Copied!' : 'Copy'}
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {(panel === 'emojis' || panel === 'symbols') && (
          <section id="stylish-text-picker-anchor" className="stylish-text-picker-section">
            <div className="container">
              <div className="stylish-text-picker card">
                <div className="stylish-text-picker__head">
                  <div>
                    <h2 className="stylish-text-picker__title">
                      {panel === 'emojis' ? 'Emojis' : 'Symbols'}
                    </h2>
                    <p className="stylish-text-picker__subtitle">
                      Click any item to copy it to your clipboard.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary stylish-text-picker__back"
                    onClick={() => setPanel('fonts')}
                  >
                    Back to Fonts
                  </button>
                </div>

                <div className="stylish-text-picker__layout">
                  <aside className="stylish-text-picker__sidebar" aria-label="Categories">
                    <p className="stylish-text-picker__sidebar-title">Categories</p>
                    <div className="stylish-text-picker__cats" role="radiogroup">
                      {Object.keys(pickerCategories).map((category) => {
                        const isActive = activePickerCategory === category;
                        return (
                          <label
                            key={category}
                            className={`stylish-text-picker__cat${isActive ? ' stylish-text-picker__cat--active' : ''}`}
                          >
                            <input
                              type="radio"
                              name="picker-category"
                              checked={isActive}
                              onChange={() => {
                                if (panel === 'emojis') setEmojiCategory(category);
                                else setSymbolCategory(category);
                              }}
                            />
                            <span className="stylish-text-picker__radio" aria-hidden="true" />
                            <span>{category}</span>
                          </label>
                        );
                      })}
                    </div>
                  </aside>

                  <div className="stylish-text-picker__main">
                    <div className="stylish-text-picker__main-head">
                      <h3 className="stylish-text-picker__main-title">{activePickerCategory}</h3>
                      <span className="stylish-text-picker__count">{pickerItems.length} items</span>
                    </div>

                    <div className="stylish-text-picker__search-wrap">
                      <input
                        type="search"
                        className="stylish-text-picker__search"
                        placeholder={
                          panel === 'emojis' ? 'Search emojis...' : 'Search symbols...'
                        }
                        value={pickerSearch}
                        onChange={(e) => setPickerSearch(e.target.value)}
                        autoComplete="off"
                      />
                    </div>

                    <div
                      className={`stylish-text-picker__grid${
                        panel === 'emojis' && emojiCategory === 'Flags'
                          ? ' stylish-text-picker__grid--flags'
                          : ''
                      }`}
                      aria-live="polite"
                    >
                      {pickerItems.map((item, index) => {
                        if (isFlagItem(item)) {
                          const copied = charCopied === item.copyValue;
                          return (
                            <button
                              key={item.code}
                              type="button"
                              className={`stylish-text-picker__item stylish-text-picker__item--flag${copied ? ' stylish-text-picker__item--copied' : ''}`}
                              onClick={() => handleCharCopy(item.copyValue)}
                              title={copied ? 'Copied!' : `Copy ${item.label}`}
                              aria-label={`Copy ${item.label} flag`}
                            >
                              <img
                                className="stylish-text-picker__flag-img"
                                src={item.image}
                                alt={`${item.label} flag`}
                                width={60}
                                height={40}
                                loading="lazy"
                                decoding="async"
                              />
                              <span className="stylish-text-picker__flag-label">
                                {item.label}
                              </span>
                              <span className="stylish-text-picker__flag-code">{item.code}</span>
                              <span className="stylish-text-picker__hint">
                                {copied ? 'Copied!' : 'Copy'}
                              </span>
                            </button>
                          );
                        }

                        const char = item;
                        const copied = charCopied === char;
                        return (
                          <button
                            key={`${char}-${index}`}
                            type="button"
                            className={`stylish-text-picker__item${copied ? ' stylish-text-picker__item--copied' : ''}`}
                            onClick={() => handleCharCopy(char)}
                            title={copied ? 'Copied!' : 'Copy'}
                            aria-label={`Copy ${char}`}
                          >
                            <span className="stylish-text-picker__char">{char}</span>
                            <span className="stylish-text-picker__hint">
                              {copied ? 'Copied!' : 'Copy'}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {pickerItems.length === 0 && (
                      <p className="stylish-text-picker__empty">No matches found.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {panel === 'word-counter' && (
          <section id="stylish-text-word-counter" className="stylish-text-word-section">
            <div className="container">
              <div className="stylish-text-word card">
                <div className="stylish-text-picker__head">
                  <div>
                    <h2 className="stylish-text-picker__title">Word Counter</h2>
                    <p className="stylish-text-picker__subtitle">
                      Type or paste your text to count words, characters, sentences, and paragraphs.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary stylish-text-picker__back"
                    onClick={() => setPanel('fonts')}
                  >
                    Back to Fonts
                  </button>
                </div>

                <textarea
                  className="textarea stylish-text-word__input"
                  placeholder="Type or paste your text here..."
                  value={wordCounterText}
                  onChange={(e) => setWordCounterText(e.target.value)}
                  rows={8}
                />

                <div className="stylish-text-word__stats">
                  <div className="stylish-text-word__stat">
                    <span className="stylish-text-word__value">{wordStats.words}</span>
                    <span className="stylish-text-word__label">Words</span>
                  </div>
                  <div className="stylish-text-word__stat">
                    <span className="stylish-text-word__value">{wordStats.characters}</span>
                    <span className="stylish-text-word__label">Characters</span>
                  </div>
                  <div className="stylish-text-word__stat">
                    <span className="stylish-text-word__value">{wordStats.charactersNoSpaces}</span>
                    <span className="stylish-text-word__label">No spaces</span>
                  </div>
                  <div className="stylish-text-word__stat">
                    <span className="stylish-text-word__value">{wordStats.sentences}</span>
                    <span className="stylish-text-word__label">Sentences</span>
                  </div>
                  <div className="stylish-text-word__stat">
                    <span className="stylish-text-word__value">{wordStats.paragraphs}</span>
                    <span className="stylish-text-word__label">Paragraphs</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="section stylish-text-seo-section">
          <div className="container seo-content card stylish-text-seo">
            <h2>What is a Stylish Text Generator?</h2>
            <p>
              A stylish text generator converts normal letters into fancy Unicode fonts you can paste into
              social media bios, captions, comments, and usernames. FityVid runs entirely in your browser, so
              your text stays private and updates instantly as you type.
            </p>

            <h2>How to use Stylish Text Generator?</h2>
            <ol>
              <li>Type or paste your text in the input box at the top.</li>
              <li>Browse font styles in the list or filter by category on the left.</li>
              <li>Click Copy on any row and paste it into Instagram, TikTok, Facebook, or YouTube.</li>
            </ol>

            <h2>Where can you use stylish text?</h2>
            <ul>
              <li>Instagram bio, name, and captions</li>
              <li>TikTok profile, comments, and video descriptions</li>
              <li>Facebook posts and page about sections</li>
              <li>YouTube channel description and community posts</li>
              <li>Usernames, display names, and short messages</li>
            </ul>

            <h2>FAQs</h2>
            <div className="stylish-text-faq">
              {FAQ_ITEMS.map((item) => (
                <details key={item.q} className="stylish-text-faq__item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
