import { useEffect, useMemo, useState } from 'react';
import SEO from '../components/SEO';
import ToolsCategoryMenu from '../components/ToolsCategoryMenu';
import AIWriterPanel from '../components/AIWriterPanel';
import ImageToolsPanel from '../components/ImageToolsPanel';
import DesignToolsPanel from '../components/DesignToolsPanel';
import CreditNotice from '../components/CreditNotice';
import { useAuth } from '../context/AuthContext';
import { CREDIT_COST, CREDIT_SPENT_MESSAGE } from '../constants/credits';
import { PAGE_SEO } from '../constants/seo';
import { getDesignTool } from '../utils/designTools';
import {
  FONT_STYLE_CATEGORIES,
  countVariantsByFilter,
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

const MAX_INPUT_LENGTH = 200;
const PAGE_SIZE = 10;

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
      <rect x="8" y="8" width="11" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M6 16V6a2 2 0 0 1 2-2h10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WandIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M4 20l9-9m3 3 5-5a2.8 2.8 0 0 0-4-4l-5 5m3 3L7 21"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15 5l1 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M12 20.5s-7-4.6-7-9.2a4.1 4.1 0 0 1 7.3-2.5A4.1 4.1 0 0 1 19 11.3c0 4.6-7 9.2-7 9.2z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function StylishTextGenerator() {
  const seo = PAGE_SEO.stylishTextGenerator;
  const { isAuthenticated, user, spendCredits } = useAuth();
  const [draftInput, setDraftInput] = useState('');
  const [generatedInput, setGeneratedInput] = useState('');
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
  const [activeToolTab, setActiveToolTab] = useState('text');
  const [generating, setGenerating] = useState(false);
  const [creditNotice, setCreditNotice] = useState(null);
  const [creditSuccess, setCreditSuccess] = useState('');
  const [generateError, setGenerateError] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState(() => new Set());

  const hasGenerated = Boolean(generatedInput);
  const variants = useMemo(() => generateStylishTextVariants(draftInput), [draftInput]);
  const filteredVariants = useMemo(
    () => filterStylishTextVariants(variants, activeFilter),
    [variants, activeFilter],
  );
  const sortedVariants = useMemo(() => {
    const list = [...filteredVariants];
    if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'favorites') {
      list.sort((a, b) => Number(favorites.has(b.id)) - Number(favorites.has(a.id)));
    }
    return list;
  }, [filteredVariants, sortBy, favorites]);

  const totalPages = Math.max(1, Math.ceil(sortedVariants.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedVariants = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return sortedVariants.slice(start, start + PAGE_SIZE);
  }, [sortedVariants, safePage]);

  const activeCategory = FONT_STYLE_CATEGORIES.find((cat) => cat.filter === activeFilter);
  const resultsTitle = activeCategory?.label || 'All Fonts';
  const rangeStart = sortedVariants.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, sortedVariants.length);

  useEffect(() => {
    setPage(1);
  }, [activeFilter, sortBy, draftInput]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);
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
    if (!hasGenerated) {
      setGenerateError('Click Generate Stylish Text to unlock copy (20 credits).');
      return;
    }
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
    setDraftInput('');
    setGeneratedInput('');
    setCopiedId('');
    setCreditNotice(null);
    setCreditSuccess('');
    setGenerateError('');
    setPage(1);
  }

  function handleInputChange(value) {
    setDraftInput(value.slice(0, MAX_INPUT_LENGTH));
  }

  function toggleFavorite(id) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function getPageNumbers() {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [1, 2, 3];
    if (totalPages > 6) pages.push('ellipsis', totalPages);
    return pages;
  }

  async function handleGenerate() {
    setGenerateError('');
    setCreditNotice(null);
    setCreditSuccess('');

    if (!draftInput.trim()) {
      setGenerateError('Please enter some text to generate.');
      return;
    }

    if (!isAuthenticated) {
      setCreditNotice('login');
      return;
    }

    if ((user?.creditBalance ?? 0) < CREDIT_COST) {
      setCreditNotice('insufficient');
      return;
    }

    setGenerating(true);
    try {
      await spendCredits('stylish_text', 'Generated stylish text');
      setGeneratedInput(draftInput.trim());
      setGenerateError('');
      setCreditSuccess(CREDIT_SPENT_MESSAGE);
      requestAnimationFrame(() => {
        document.getElementById('stylish-text-results-anchor')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    } catch (err) {
      if (err.data?.code === 'INSUFFICIENT_CREDITS') {
        setCreditNotice('insufficient');
      } else {
        setGenerateError(err.message || 'Unable to generate stylish text.');
      }
    } finally {
      setGenerating(false);
    }
  }

  function handleToolTabChange(tabId) {
    setActiveToolTab(tabId);
    if (tabId === 'text') {
      setPanel('fonts');
    }
  }

  function handleTextAction(action) {
    if (!action) return;

    if (action.type === 'font-filter') {
      setActiveToolTab('text');
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
        <div className="stylish-text-page__blobs" aria-hidden="true">
          <span className="stylish-text-page__blob stylish-text-page__blob--purple" />
          <span className="stylish-text-page__blob stylish-text-page__blob--pink" />
          <span className="stylish-text-page__blob stylish-text-page__blob--blue" />
        </div>

        <header className="stylish-text-hero">
          <div className="container stylish-text-hero__inner">
            <span className="stylish-text-hero__spark stylish-text-hero__spark--left" aria-hidden="true">
              ✦
            </span>
            <span className="stylish-text-hero__spark stylish-text-hero__spark--right" aria-hidden="true">
              ✨
            </span>
            <h1 className="stylish-text-hero__title">Stylish Text Generator</h1>
            <p className="stylish-text-hero__subtitle">
              Convert normal text into stylish, cool and unique fonts instantly.
            </p>
            <p className="stylish-text-hero__rating" aria-label="Rated 4.8 out of 5">
              <span className="stylish-text-hero__stars" aria-hidden="true">
                ★
              </span>
              <span className="stylish-text-hero__score">4.8</span>
              <span className="stylish-text-hero__rating-meta">(12.5K+ users love it)</span>
            </p>
          </div>
        </header>

        <section className="stylish-text-tool-section">
          <div className="container stylish-text-tool-section__inner">
            <ToolsCategoryMenu
              variant="premium"
              floatingDropdown
              activeTab={activeToolTab}
              onTabChange={handleToolTabChange}
              onTextAction={handleTextAction}
              onAiWriterSelect={handleAiWriterSelect}
              onImageToolSelect={handleImageToolSelect}
              onDesignToolSelect={handleDesignToolSelect}
            />

            <div className="stylish-text-input-wrap">
              <input
                id="stylish-text-input"
                type="text"
                className="stylish-text-input"
                placeholder="Make Your Text Awesome!"
                value={draftInput}
                onChange={(e) => handleInputChange(e.target.value)}
                maxLength={MAX_INPUT_LENGTH}
                spellCheck={false}
                autoComplete="off"
              />
              <div className="stylish-text-input__meta">
                <span className="stylish-text-input__counter">
                  {draftInput.length} / {MAX_INPUT_LENGTH}
                </span>
                {draftInput && (
                  <button
                    type="button"
                    className="stylish-text-input__clear"
                    onClick={handleClear}
                    aria-label="Clear text"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
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

            <div className="stylish-text-generate-wrap">
              <span className="stylish-text-generate-burst stylish-text-generate-burst--left" aria-hidden="true" />
              <span className="stylish-text-generate-burst stylish-text-generate-burst--right" aria-hidden="true" />
              <button
                type="button"
                className="stylish-text-generate-btn"
                onClick={handleGenerate}
                disabled={generating}
              >
                <WandIcon />
                <span>{generating ? 'Generating…' : 'Generate Stylish Text'}</span>
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p className="stylish-text-generate-note">Each generation costs 20 credits.</p>
            {generateError && <p className="stylish-text-generate-error">{generateError}</p>}
            <CreditNotice type={creditNotice} />
            <CreditNotice type={creditSuccess ? 'success' : null} message={creditSuccess} />
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
                <div className="stylish-text-sidebar__header">
                  <span className="stylish-text-sidebar__header-icon" aria-hidden="true">
                    ✨
                  </span>
                  <h2 className="stylish-text-sidebar__title">Select a font style</h2>
                </div>
                <div className="stylish-text-filters" role="group" aria-label="Filter font styles">
                  {FONT_STYLE_CATEGORIES.map((category) => {
                    const count = countVariantsByFilter(variants, category.filter);
                    const isActive = activeFilter === category.filter;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        className={`stylish-text-filter${isActive ? ' stylish-text-filter--active' : ''}`}
                        aria-pressed={isActive}
                        onClick={() => setActiveFilter(category.filter)}
                      >
                        <span className="stylish-text-filter__icon" aria-hidden="true">
                          {category.icon}
                        </span>
                        <span className="stylish-text-filter__label">{category.label}</span>
                        <span className="stylish-text-filter__count">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <div className="stylish-text-results-panel">
                <div className="stylish-text-results-panel__head">
                  <h2 className="stylish-text-results-panel__title">{resultsTitle}</h2>
                  <label className="stylish-text-sort">
                    <span className="stylish-text-sort__icon" aria-hidden="true">
                      🔥
                    </span>
                    <span className="stylish-text-sort__label">Sort by:</span>
                    <select
                      className="stylish-text-sort__select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      aria-label="Sort fonts"
                    >
                      <option value="popular">Popular</option>
                      <option value="name">Name</option>
                      <option value="favorites">Favorites</option>
                    </select>
                  </label>
                </div>

                {!hasGenerated && (
                  <p className="stylish-text-results-panel__hint">
                    Preview updates as you type. Click Generate Stylish Text to unlock copy (20 credits).
                  </p>
                )}

                <div className="stylish-text-results" aria-live="polite">
                  {paginatedVariants.map((variant) => {
                    const isFavorite = favorites.has(variant.id);
                    return (
                      <article
                        key={variant.id}
                        className={`stylish-text-row${!hasGenerated ? ' stylish-text-row--preview' : ''}`}
                      >
                        <button
                          type="button"
                          className={`stylish-text-row__favorite${isFavorite ? ' stylish-text-row__favorite--active' : ''}`}
                          onClick={() => toggleFavorite(variant.id)}
                          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                          aria-pressed={isFavorite}
                        >
                          <HeartIcon filled={isFavorite} />
                        </button>
                        <p className="stylish-text-row__output" lang="en">
                          {variant.text}
                        </p>
                        <button
                          type="button"
                          className="stylish-text-row__copy"
                          onClick={() => handleCopy(variant.id, variant.text)}
                          aria-label={`Copy ${variant.name} style`}
                          title={
                            hasGenerated
                              ? `Copy ${variant.name}`
                              : 'Generate stylish text first (20 credits)'
                          }
                        >
                          <CopyIcon />
                          <span>{copiedId === variant.id ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </article>
                    );
                  })}
                </div>

                <div className="stylish-text-results-panel__footer">
                  <p className="stylish-text-results-panel__range">
                    <span aria-hidden="true">✨</span>
                    Showing {rangeStart} to {rangeEnd} of {sortedVariants.length} fonts
                  </p>
                  <nav className="stylish-text-pagination" aria-label="Font results pagination">
                    <button
                      type="button"
                      className="stylish-text-pagination__btn"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={safePage <= 1}
                      aria-label="Previous page"
                    >
                      ‹
                    </button>
                    {getPageNumbers().map((item, index) =>
                      item === 'ellipsis' ? (
                        <span key={`ellipsis-${index}`} className="stylish-text-pagination__ellipsis">
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          className={`stylish-text-pagination__page${safePage === item ? ' stylish-text-pagination__page--active' : ''}`}
                          onClick={() => setPage(item)}
                          aria-current={safePage === item ? 'page' : undefined}
                        >
                          {item}
                        </button>
                      ),
                    )}
                    <button
                      type="button"
                      className="stylish-text-pagination__btn"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage >= totalPages}
                      aria-label="Next page"
                    >
                      ›
                    </button>
                  </nav>
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
