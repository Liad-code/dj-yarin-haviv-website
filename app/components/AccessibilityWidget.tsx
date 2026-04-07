'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [headers, setHeaders] = useState<{ tag: string; text: string; element: HTMLElement }[]>([]);
  const [settings, setSettings] = useState({
    largerText: false,
    lineSpacing: false,
    textAlignment: 'default',
    readableFont: false,
    contrast: false,
    grayscale: false,
    hideImages: false,
    pauseAnimations: false,
    highlightLinks: false,
    readingMask: false,
    focusMode: false,
    pageMode: false,
  });

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;

    // Text adjustments
    if (settings.largerText) {
      root.style.fontSize = '120%';
    } else {
      root.style.fontSize = '';
    }

    // Line spacing
    if (settings.lineSpacing) {
      root.style.setProperty('--line-spacing', '2');
      document.body.style.lineHeight = '2';
    } else {
      root.style.setProperty('--line-spacing', '1.5');
      document.body.style.lineHeight = '';
    }

    // Text alignment
    if (settings.textAlignment === 'center') {
      document.body.style.textAlign = 'center';
    } else if (settings.textAlignment === 'left') {
      document.body.style.textAlign = 'left';
      document.body.style.direction = 'ltr';
    } else if (settings.textAlignment === 'right') {
      document.body.style.textAlign = 'right';
      document.body.style.direction = 'rtl';
    } else {
      document.body.style.textAlign = '';
      document.body.style.direction = '';
    }

    // Readable font
    if (settings.readableFont) {
      document.body.style.fontFamily = 'Arial, sans-serif';
    } else {
      document.body.style.fontFamily = '';
    }

    // Contrast
    if (settings.contrast) {
      root.style.filter = 'contrast(1.5)';
    } else if (settings.grayscale) {
      root.style.filter = 'grayscale(100%)';
    } else {
      root.style.filter = '';
    }

    // Hide images
    if (settings.hideImages) {
      const style = document.getElementById('hide-images-style') || document.createElement('style');
      style.id = 'hide-images-style';
      style.innerHTML = 'img { opacity: 0 !important; }';
      if (!document.getElementById('hide-images-style')) {
        document.head.appendChild(style);
      }
    } else {
      const style = document.getElementById('hide-images-style');
      if (style) style.remove();
    }

    // Pause animations
    if (settings.pauseAnimations) {
      const style = document.getElementById('pause-animations-style') || document.createElement('style');
      style.id = 'pause-animations-style';
      style.innerHTML = '*, *::before, *::after { animation-play-state: paused !important; transition: none !important; }';
      if (!document.getElementById('pause-animations-style')) {
        document.head.appendChild(style);
      }
    } else {
      const style = document.getElementById('pause-animations-style');
      if (style) style.remove();
    }

    // Highlight links
    if (settings.highlightLinks) {
      const style = document.getElementById('highlight-links-style') || document.createElement('style');
      style.id = 'highlight-links-style';
      style.innerHTML = 'a { background-color: yellow !important; color: black !important; text-decoration: underline !important; }';
      if (!document.getElementById('highlight-links-style')) {
        document.head.appendChild(style);
      }
    } else {
      const style = document.getElementById('highlight-links-style');
      if (style) style.remove();
    }

    // Reading mask
    if (settings.readingMask) {
      document.body.style.cursor = 'none';
      const mask = document.getElementById('reading-mask') || document.createElement('div');
      mask.id = 'reading-mask';
      mask.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        pointer-events: none;
        z-index: 9998;
        clip-path: polygon(0 0, 100% 0, 100% 40%, 0 40%, 0 0, 0 60%, 100% 60%, 100% 100%, 0 100%);
      `;
      if (!document.getElementById('reading-mask')) {
        document.body.appendChild(mask);
      }

      const handleMouseMove = (e: MouseEvent) => {
        const maskElement = document.getElementById('reading-mask');
        if (maskElement) {
          const y = e.clientY;
          const lineHeight = 100;
          const topY = Math.max(0, (y - lineHeight / 2) / window.innerHeight * 100);
          const bottomY = Math.min(100, (y + lineHeight / 2) / window.innerHeight * 100);
          maskElement.style.clipPath = `polygon(
            0 0, 100% 0, 100% ${topY}%, 0 ${topY}%,
            0 0, 0 ${bottomY}%, 100% ${bottomY}%, 100% 100%, 0 100%
          )`;
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        const mask = document.getElementById('reading-mask');
        if (mask) mask.remove();
        document.body.style.cursor = '';
      };
    } else {
      const mask = document.getElementById('reading-mask');
      if (mask) mask.remove();
      document.body.style.cursor = '';
    }

    // Focus Mode
    if (settings.focusMode) {
      const style = document.getElementById('focus-mode-style') || document.createElement('style');
      style.id = 'focus-mode-style';
      style.innerHTML = `
        body *:not(script):not(style):not(link) { opacity: 0.3; transition: opacity 0.2s; }
        body *:not(script):not(style):not(link):hover,
        body *:not(script):not(style):not(link):hover *,
        body *:not(script):not(style):not(link):has(:hover) { opacity: 1 !important; }
      `;
      if (!document.getElementById('focus-mode-style')) {
        document.head.appendChild(style);
      }
    } else {
      const style = document.getElementById('focus-mode-style');
      if (style) style.remove();
    }

    // Page Structure Mode
    if (settings.pageMode && isOpen) {
      const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')) as HTMLElement[];
      setHeaders(elements.map(el => ({
        tag: el.tagName,
        text: el.innerText,
        element: el
      })));
    }
  }, [settings, isOpen]);

  const toggleSetting = (key: keyof typeof settings) => {
    if (key === 'textAlignment') {
      setSettings((prev) => {
        const current = prev.textAlignment;
        let next = 'default';
        if (current === 'default') next = 'right';
        else if (current === 'right') next = 'left';
        else next = 'default';
        return { ...prev, textAlignment: next };
      });
      return;
    }

    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const resetAll = () => {
    setSettings({
      largerText: false,
      lineSpacing: false,
      textAlignment: 'default',
      readableFont: false,
      contrast: false,
      grayscale: false,
      hideImages: false,
      pauseAnimations: false,
      highlightLinks: false,
      readingMask: false,
      focusMode: false,
      pageMode: false,
    });
  };

  const scrollToHeader = (element: HTMLElement) => {
    const offset = 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 end-6 z-[9999] w-14 h-14 rounded-full',
          'bg-blue-600 hover:bg-blue-700 text-white shadow-lg',
          'flex items-center justify-center transition-all',
          'focus:outline-none focus:ring-4 focus:ring-blue-300'
        )}
        aria-label="נגישות"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 7a1 1 0 0 0-1 1v3a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zm10 0a1 1 0 0 0-1 1v3a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1zM9 11a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0v-8a1 1 0 0 0-1-1zm6 0a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0v-8a1 1 0 0 0-1-1zm-3-2a2 2 0 0 0-2 2v9a2 2 0 0 0 4 0v-9a2 2 0 0 0-2-2z" />
        </svg>
      </button>

      {/* Widget Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-[9998]"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className={cn(
            'fixed bottom-24 end-6 z-[9999] w-[400px] max-w-[90vw]',
            'bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl shadow-2xl',
            'overflow-hidden text-white flex flex-col',
            settings.pageMode ? 'max-h-[80vh]' : ''
          )}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
              <h2 className="text-xl font-bold">
                {settings.pageMode ? 'מבנה עמוד' : 'נגישות'}
              </h2>
              <div className="flex gap-2">
                {!settings.pageMode && (
                  <button
                    onClick={resetAll}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"
                    title="איפוס"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
                {settings.pageMode ? (
                  <button
                    onClick={() => toggleSetting('pageMode')}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"
                    title="חזרה"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"
                    title="סגור"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto custom-scrollbar" style={{ maxHeight: '70vh' }}>
              {settings.pageMode ? (
                // Structure View
                <div className="space-y-2">
                  {headers.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToHeader(h.element)}
                      className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5 group"
                    >
                      <span className="badge bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md min-w-[35px] text-center shadow-sm group-hover:bg-blue-500">
                        {h.tag}
                      </span>
                      <span className="text-sm text-end flex-1 me-3 line-clamp-2" dir="auto">
                        {h.text}
                      </span>
                    </button>
                  ))}
                  {headers.length === 0 && (
                    <div className="text-center py-8 opacity-50">
                      <p>לא נמצאו כותרות בעמוד זה</p>
                    </div>
                  )}
                </div>
              ) : (
                // Settings View
                <div className="space-y-4">
                  {/* Text Section */}
                  <section>
                    <h3 className="text-sm font-semibold mb-3 text-end opacity-70">טקסט</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <AccessibilityButton
                        active={settings.largerText}
                        onClick={() => toggleSetting('largerText')}
                        icon="T+"
                      >
                        טקסט גדול יותר
                      </AccessibilityButton>
                      <AccessibilityButton
                        active={settings.lineSpacing}
                        onClick={() => toggleSetting('lineSpacing')}
                        icon="≡"
                      >
                        מרווח שורה
                      </AccessibilityButton>
                      <AccessibilityButton
                        active={settings.textAlignment !== 'default'}
                        onClick={() => toggleSetting('textAlignment' as any)}
                        icon="⫴"
                      >
                        {settings.textAlignment === 'right' ? 'יישור לימין' : 
                         settings.textAlignment === 'left' ? 'יישור לשמאל' : 
                         'יישור טקסט'}
                      </AccessibilityButton>
                      <AccessibilityButton
                        active={settings.readableFont}
                        onClick={() => toggleSetting('readableFont')}
                        icon="Aa"
                      >
                        גופן קריא
                      </AccessibilityButton>
                    </div>
                  </section>

                  {/* Visual Section */}
                  <section>
                    <h3 className="text-sm font-semibold mb-3 text-end opacity-70">ויזואלי</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <AccessibilityButton
                        active={settings.contrast}
                        onClick={() => toggleSetting('contrast')}
                        icon="◐"
                      >
                        ניגודיות
                      </AccessibilityButton>
                      <AccessibilityButton
                        active={settings.grayscale}
                        onClick={() => toggleSetting('grayscale')}
                        icon="○"
                      >
                        גווני אפור
                      </AccessibilityButton>
                      <AccessibilityButton
                        active={settings.hideImages}
                        onClick={() => toggleSetting('hideImages')}
                        icon="🖼"
                      >
                        הסתר תמונות
                      </AccessibilityButton>
                      <AccessibilityButton
                        active={settings.pauseAnimations}
                        onClick={() => toggleSetting('pauseAnimations')}
                        icon="⏸"
                      >
                        השהה אנימציות
                      </AccessibilityButton>
                    </div>
                  </section>

                  {/* Orientation Section */}
                  <section>
                    <h3 className="text-sm font-semibold mb-3 text-end opacity-70">אוריינטציה</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <AccessibilityButton
                        active={settings.highlightLinks}
                        onClick={() => toggleSetting('highlightLinks')}
                        icon="🔗"
                      >
                        הדגשת קישורים
                      </AccessibilityButton>
                      <AccessibilityButton
                        active={settings.readingMask}
                        onClick={() => toggleSetting('readingMask')}
                        icon="▬"
                      >
                        מסכת קריאה
                      </AccessibilityButton>
                      <AccessibilityButton
                        active={settings.focusMode}
                        onClick={() => toggleSetting('focusMode')}
                        icon="⊕"
                      >
                        מצב מיקוד
                      </AccessibilityButton>
                      <AccessibilityButton
                        active={settings.pageMode}
                        onClick={() => toggleSetting('pageMode')}
                        icon="⊞"
                      >
                        מבנה עמוד
                      </AccessibilityButton>
                    </div>
                  </section>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-blue-950/50 text-center text-xs border-t border-white/10 shrink-0">
              <span className="opacity-60">Ally by</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function AccessibilityButton({
  children,
  active,
  onClick,
  icon,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  icon: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'p-3 rounded-xl transition-all text-end',
        'flex items-center justify-between gap-2',
        'hover:bg-white/10 border border-transparent',
        active ? 'bg-white/20 border-white/30 shadow-inner' : 'bg-white/5',
        'group'
      )}
    >
      <div className="text-xl opacity-80 group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-xs font-medium">{children}</span>
    </button>
  );
}
