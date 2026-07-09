import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AI_WRITER_GROUPS } from '../utils/aiWriterTemplates';
import { DESIGN_TOOLS } from '../utils/designTools';
import { IMAGE_TOOLS } from '../utils/imageTools';
import {
  EMOJI_SUBFILTERS,
  FONT_SUBFILTERS,
  SYMBOL_SUBFILTERS,
} from '../utils/textToolContent';
import './ToolsCategoryMenu.css';

const TEXT_TOOLS = [
  { id: 'font-generator', label: 'Font Generator', icon: '🔤', hasSubmenu: true },
  { id: 'emojis', label: 'Emojis', icon: '😀', hasSubmenu: true },
  { id: 'symbols', label: 'Symbols', icon: '✦', hasSubmenu: true },
  { id: 'word-counter', label: 'Word Counter', icon: '🔢', hasSubmenu: false },
  { id: 'add-text-photo', label: 'Add Text to Photo', icon: '🖼️', hasSubmenu: false },
];

const TOOL_CATEGORIES = [
  { id: 'text', label: 'Text', icon: 'T', iconClass: 'tools-category-menu__tab-icon--text' },
  { id: 'ai-writer', label: 'AI Writer', icon: '✨', iconClass: 'tools-category-menu__tab-icon--ai' },
  { id: 'image', label: 'Image', icon: '🖼️', iconClass: 'tools-category-menu__tab-icon--image' },
  { id: 'design', label: 'Design', icon: '🎨', iconClass: 'tools-category-menu__tab-icon--design' },
  {
    id: 'other',
    label: 'Other',
    icon: '▦',
    iconClass: 'tools-category-menu__tab-icon--other',
    items: [
      { id: 'hashtag-generator', label: 'Hashtag Generator', icon: '#️⃣', to: '/hashtag-generator' },
      { id: 'video-downloader', label: 'Video Downloader', icon: '⬇️', to: '/' },
      { id: 'instagram-downloader', label: 'Instagram Downloader', icon: '📷', to: '/instagram-video-downloader' },
      { id: 'tiktok-downloader', label: 'TikTok Downloader', icon: '🎵', to: '/tiktok-video-downloader' },
      { id: 'youtube-downloader', label: 'YouTube Downloader', icon: '▶️', to: '/youtube-video-downloader' },
      { id: 'facebook-downloader', label: 'Facebook Downloader', icon: '👍', to: '/facebook-video-downloader' },
      { id: 'download-guide', label: 'Download Guide', icon: '📘', to: '/download-guide' },
    ],
  },
];

const PORTAL_DROPDOWN_WIDTHS = {
  text: 640,
  'ai-writer': 680,
  image: 720,
  design: 560,
  other: 760,
};

function ChevronIcon({ open }) {
  return (
    <svg
      className={`tools-category-menu__chevron${open ? ' tools-category-menu__chevron--open' : ''}`}
      viewBox="0 0 20 20"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SideChevron() {
  return (
    <svg
      className="tools-category-menu__side-chevron"
      viewBox="0 0 20 20"
      width="14"
      height="14"
      aria-hidden="true"
    >
      <path
        d="M7.5 5L12.5 10L7.5 15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function getRightItems(toolId) {
  if (toolId === 'emojis') return EMOJI_SUBFILTERS;
  if (toolId === 'symbols') return SYMBOL_SUBFILTERS;
  return FONT_SUBFILTERS;
}

function getPortalDropdownWidth(categoryId) {
  const viewportWidth = window.innerWidth;
  if (viewportWidth < 768) {
    return Math.max(280, viewportWidth - 24);
  }
  const preferred = PORTAL_DROPDOWN_WIDTHS[categoryId] || 720;
  return Math.min(preferred, viewportWidth - 24);
}

export default function ToolsCategoryMenu({
  onTextAction,
  onAiWriterSelect,
  onImageToolSelect,
  onDesignToolSelect,
  onTabChange,
  variant = 'default',
  activeTab = null,
  floatingDropdown = false,
}) {
  const rootRef = useRef(null);
  const tabsRef = useRef(null);
  const portalDropdownRef = useRef(null);
  const [openCategory, setOpenCategory] = useState(null);
  const [textTool, setTextTool] = useState('font-generator');
  const [aiGroup, setAiGroup] = useState(AI_WRITER_GROUPS[0].id);
  const [toast, setToast] = useState('');
  const [portalStyle, setPortalStyle] = useState(null);

  const activeCategory = TOOL_CATEGORIES.find((category) => category.id === openCategory);
  const activeAiGroup =
    AI_WRITER_GROUPS.find((group) => group.id === aiGroup) || AI_WRITER_GROUPS[0];
  const usePortalDropdown = floatingDropdown && Boolean(openCategory);

  const updatePortalPosition = useCallback(() => {
    if (!floatingDropdown || !openCategory || !tabsRef.current) {
      setPortalStyle(null);
      return;
    }

    const anchorRect = tabsRef.current.getBoundingClientRect();
    const width = getPortalDropdownWidth(openCategory);
    const maxHeight = 420;
    const gap = 10;
    const viewportPadding = 12;
    const spaceBelow = window.innerHeight - anchorRect.bottom - gap - viewportPadding;

    let top;
    let left;

    if (spaceBelow >= 160) {
      top = anchorRect.bottom + gap;
      left = anchorRect.left + anchorRect.width / 2 - width / 2;
    } else {
      const modalHeight = Math.min(maxHeight, window.innerHeight - viewportPadding * 2);
      top = Math.max(viewportPadding, (window.innerHeight - modalHeight) / 2);
      left = (window.innerWidth - width) / 2;
    }

    left = Math.max(
      viewportPadding,
      Math.min(left, window.innerWidth - width - viewportPadding),
    );

    setPortalStyle({
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
      maxHeight: `${Math.min(maxHeight, Math.max(200, spaceBelow >= 160 ? maxHeight : window.innerHeight - viewportPadding * 2))}px`,
    });
  }, [floatingDropdown, openCategory]);

  useLayoutEffect(() => {
    if (!usePortalDropdown) {
      setPortalStyle(null);
      return undefined;
    }

    updatePortalPosition();

    const handleReposition = () => updatePortalPosition();
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [usePortalDropdown, updatePortalPosition]);

  useEffect(() => {
    function handlePointerDown(event) {
      const inRoot = rootRef.current?.contains(event.target);
      const inPortal = portalDropdownRef.current?.contains(event.target);
      if (!inRoot && !inPortal) {
        setOpenCategory(null);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setOpenCategory(null);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function handleTabClick(categoryId) {
    onTabChange?.(categoryId);
    toggleCategory(categoryId);
  }

  function toggleCategory(categoryId) {
    setOpenCategory((current) => {
      if (current === categoryId) return null;
      if (categoryId === 'text') setTextTool('font-generator');
      if (categoryId === 'ai-writer') setAiGroup(AI_WRITER_GROUPS[0].id);
      return categoryId;
    });
  }

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(''), 2800);
  }

  function handleNavigate() {
    setOpenCategory(null);
    setToast('');
  }

  function handleTextToolSelect(toolId) {
    setTextTool(toolId);

    if (toolId === 'word-counter') {
      onTextAction?.({ type: 'word-counter' });
      setOpenCategory(null);
      return;
    }

    if (toolId === 'add-text-photo') {
      showToast('Add Text to Photo tool is coming soon.');
    }
  }

  function handleFontSubfilter(sub) {
    onTextAction?.({ type: 'font-filter', filter: sub.filter });
    setOpenCategory(null);
  }

  function handleEmojiSubfilter(sub) {
    onTextAction?.({ type: 'emoji', category: sub.id });
    setOpenCategory(null);
  }

  function handleSymbolSubfilter(sub) {
    onTextAction?.({ type: 'symbol', category: sub.id });
    setOpenCategory(null);
  }

  function handleRightClick(sub) {
    if (textTool === 'font-generator') handleFontSubfilter(sub);
    else if (textTool === 'emojis') handleEmojiSubfilter(sub);
    else if (textTool === 'symbols') handleSymbolSubfilter(sub);
  }

  function handleAiToolSelect(tool) {
    onAiWriterSelect?.(tool.id);
    setOpenCategory(null);
  }

  function renderDropdownBody() {
    if (!activeCategory) return null;

    if (activeCategory.id === 'text') {
      return (
        <div className="tools-text-mega">
          <div className="tools-text-mega__left">
            {TEXT_TOOLS.map((tool) => {
              const isActive = textTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  className={`tools-text-mega__tool${isActive ? ' tools-text-mega__tool--active' : ''}`}
                  onMouseEnter={() => {
                    if (tool.hasSubmenu) setTextTool(tool.id);
                  }}
                  onFocus={() => {
                    if (tool.hasSubmenu) setTextTool(tool.id);
                  }}
                  onClick={() => handleTextToolSelect(tool.id)}
                >
                  <span className="tools-text-mega__tool-icon" aria-hidden="true">
                    {tool.icon}
                  </span>
                  <span className="tools-text-mega__tool-label">{tool.label}</span>
                  {tool.hasSubmenu && <SideChevron />}
                </button>
              );
            })}
          </div>

          {['font-generator', 'emojis', 'symbols'].includes(textTool) && (
            <div className="tools-text-mega__right">
              <p className="tools-text-mega__right-title">
                {TEXT_TOOLS.find((tool) => tool.id === textTool)?.label}
              </p>
              <div className="tools-text-mega__grid">
                {getRightItems(textTool).map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    className="tools-text-mega__sub"
                    onClick={() => handleRightClick(sub)}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeCategory.id === 'ai-writer') {
      return (
        <div className="tools-text-mega tools-ai-mega">
          <div className="tools-text-mega__left tools-ai-mega__left">
            {AI_WRITER_GROUPS.map((group) => {
              const isActive = aiGroup === group.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  className={`tools-text-mega__tool tools-ai-mega__tool${isActive ? ' tools-text-mega__tool--active tools-ai-mega__tool--active' : ''}`}
                  onMouseEnter={() => setAiGroup(group.id)}
                  onFocus={() => setAiGroup(group.id)}
                  onClick={() => setAiGroup(group.id)}
                >
                  <span className="tools-text-mega__tool-icon tools-ai-mega__icon" aria-hidden="true">
                    {group.icon}
                  </span>
                  <span className="tools-text-mega__tool-label">{group.label}</span>
                  <SideChevron />
                </button>
              );
            })}
          </div>

          <div className="tools-text-mega__right">
            <p className="tools-text-mega__right-title">{activeAiGroup.label}</p>
            <div className="tools-text-mega__grid">
              {activeAiGroup.tools.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  className="tools-text-mega__sub"
                  onClick={() => handleAiToolSelect(tool)}
                >
                  {tool.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeCategory.id === 'image') {
      return (
        <div className="tools-image-mega">
          {IMAGE_TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              className="tools-image-mega__item"
              onClick={() => {
                onImageToolSelect?.(tool.id);
                setOpenCategory(null);
              }}
            >
              <span className="tools-image-mega__icon" aria-hidden="true">
                {tool.icon}
              </span>
              <span className="tools-image-mega__label">{tool.label}</span>
            </button>
          ))}
        </div>
      );
    }

    if (activeCategory.id === 'design') {
      return (
        <div className="tools-design-mega">
          {DESIGN_TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              className="tools-design-mega__item"
              onClick={() => {
                onDesignToolSelect?.(tool.id);
                setOpenCategory(null);
              }}
            >
              <span className="tools-design-mega__icon" aria-hidden="true">
                {tool.icon}
              </span>
              <span className="tools-design-mega__label">{tool.label}</span>
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="tools-category-menu__dropdown-inner">
        {activeCategory.items?.map((item) => {
          const content = (
            <>
              <span className="tools-category-menu__item-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="tools-category-menu__item-label">{item.label}</span>
            </>
          );

          if (item.to) {
            return (
              <Link
                key={item.id}
                to={item.to}
                className="tools-category-menu__item"
                onClick={handleNavigate}
              >
                {content}
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              className="tools-category-menu__item"
              onClick={() => showToast('This tool is coming soon.')}
            >
              {content}
            </button>
          );
        })}
      </div>
    );
  }

  function renderDropdownShell(inPortal = false) {
    if (!activeCategory) return null;

    const dropdownClass = [
      'tools-category-menu__dropdown',
      `tools-category-menu__dropdown--${activeCategory.id === 'ai-writer' ? 'ai' : activeCategory.id}`,
      inPortal ? 'tools-category-menu__dropdown--portal' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const shell = (
      <div
        ref={inPortal ? portalDropdownRef : undefined}
        className={dropdownClass}
        style={inPortal ? portalStyle || undefined : undefined}
        role="menu"
        aria-label={`${activeCategory.label} tools`}
      >
        {renderDropdownBody()}
      </div>
    );

    if (inPortal && typeof document !== 'undefined') {
      return createPortal(shell, document.body);
    }

    return shell;
  }

  return (
    <>
      <div
        className={`tools-category-menu${variant === 'premium' ? ' tools-category-menu--premium' : ''}${floatingDropdown ? ' tools-category-menu--floating' : ''}`}
        ref={rootRef}
      >
        <nav className="tools-category-menu__nav" aria-label="Tool categories">
          <div className="tools-category-menu__tabs" ref={tabsRef}>
            {TOOL_CATEGORIES.map((category) => {
              const isOpen = openCategory === category.id;
              const isSelected = activeTab === category.id || isOpen;
              return (
                <button
                  key={category.id}
                  type="button"
                  className={`tools-category-menu__tab${isSelected ? ' tools-category-menu__tab--active tools-category-menu__tab--selected' : ''}`}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() => handleTabClick(category.id)}
                >
                  {variant === 'premium' && (
                    <span
                      className={`tools-category-menu__tab-icon ${category.iconClass || ''}`}
                      aria-hidden="true"
                    >
                      {category.icon}
                    </span>
                  )}
                  <span>{category.label}</span>
                  {variant !== 'premium' && <ChevronIcon open={isOpen} />}
                </button>
              );
            })}
          </div>
        </nav>

        {!floatingDropdown && renderDropdownShell(false)}

        {toast && !floatingDropdown && (
          <p className="tools-category-menu__toast" role="status">
            {toast}
          </p>
        )}
      </div>

      {usePortalDropdown && portalStyle && renderDropdownShell(true)}

      {toast && floatingDropdown && typeof document !== 'undefined' && createPortal(
        <p className="tools-category-menu__toast tools-category-menu__toast--portal" role="status">
          {toast}
        </p>,
        document.body,
      )}
    </>
  );
}
