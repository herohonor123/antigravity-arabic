/**
 * Antigravity Arabic Enhancer (In-Browser Script)
 * Automatically detects Arabic content, sets RTL direction, isolates LTR tokens (code/English),
 * and enhances Arabic typography and input behavior.
 */

(function initAntigravityArabic() {
  if (window.__antigravityArabicInjected) {
    if (typeof window.__antigravityArabicScan === 'function') {
      window.__antigravityArabicScan();
    }
    return;
  }
  window.__antigravityArabicInjected = true;

  // 1. Inject Comprehensive Arabic CSS
  const styleId = 'antigravity-arabic-theme';
  let styleEl = document.getElementById(styleId);
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = `
      /* Arabic Font & Baseline Alignment */
      .antigravity-ar-block,
      [data-ar-active="true"] {
        font-family: "Segoe UI", "Cairo", -apple-system, BlinkMacSystemFont, "Tahoma", sans-serif !important;
        line-height: 1.8 !important;
        direction: rtl !important;
        text-align: right !important;
        unicode-bidi: plaintext !important;
      }

      /* Fix List Items alignment and bullet positions in RTL */
      ul.antigravity-ar-list,
      ol.antigravity-ar-list,
      li.antigravity-ar-block {
        direction: rtl !important;
        text-align: right !important;
      }
      ul.antigravity-ar-list {
        padding-right: 1.5rem !important;
        padding-left: 0 !important;
        list-style-position: inside !important;
      }

      /* BiDi Isolation for Code, English Terms, Links, and Badges inside Arabic Text */
      .antigravity-ar-block code,
      .antigravity-ar-block pre,
      .antigravity-ar-block a,
      .antigravity-ar-block kbd,
      .antigravity-ar-block .font-mono,
      .antigravity-ar-block [class*="code"],
      .antigravity-ar-block [class*="badge"] {
        direction: ltr !important;
        display: inline-block !important;
        unicode-bidi: isolate !important;
        text-align: left !important;
        margin: 0 3px !important;
        vertical-align: baseline !important;
      }

      /* Code blocks (fenced markdown) should always remain LTR */
      pre.antigravity-ar-block,
      .antigravity-ar-block pre {
        direction: ltr !important;
        text-align: left !important;
        unicode-bidi: normal !important;
      }

      /* Chat Input Field: Auto direction based on typed content */
      textarea,
      input[type="text"],
      [contenteditable="true"] {
        unicode-bidi: plaintext !important;
      }

      /* Conversation History Sidebar & Titles */
      .antigravity-ar-title {
        direction: rtl !important;
        text-align: right !important;
      }
    `;
    document.head.appendChild(styleEl);
  }

  // Regex matching Arabic Unicode block characters
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

  // Process a single DOM element
  function processElement(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return;

    // Handle chat input
    if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && el.type === 'text')) {
      if (el.getAttribute('dir') !== 'auto') {
        el.setAttribute('dir', 'auto');
      }
      return;
    }

    const text = el.textContent || '';
    if (!arabicRegex.test(text)) return;

    const tagName = el.tagName;

    // Block-level content containers
    if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'TH', 'TD'].includes(tagName)) {
      if (!el.classList.contains('antigravity-ar-block')) {
        el.classList.add('antigravity-ar-block');
        el.setAttribute('dir', 'auto');
        el.setAttribute('data-ar-active', 'true');
      }
      return;
    }

    // List item handling
    if (tagName === 'LI') {
      if (!el.classList.contains('antigravity-ar-block')) {
        el.classList.add('antigravity-ar-block');
        el.setAttribute('dir', 'auto');
        el.setAttribute('data-ar-active', 'true');
        if (el.parentElement && ['UL', 'OL'].includes(el.parentElement.tagName)) {
          el.parentElement.classList.add('antigravity-ar-list');
        }
      }
      return;
    }

    // Sidebar conversation titles
    if (tagName === 'SPAN' && el.classList.contains('truncate')) {
      el.classList.remove('text-left');
      el.classList.add('antigravity-ar-title');
      el.setAttribute('dir', 'auto');
      return;
    }

    // Recurse into children
    const children = el.children;
    for (let i = 0; i < children.length; i++) {
      processElement(children[i]);
    }
  }

  // Full DOM scan
  function scan() {
    const targets = document.querySelectorAll(
      'p, li, h1, h2, h3, h4, h5, h6, blockquote, th, td, textarea, input, span.truncate'
    );
    let count = 0;
    targets.forEach(node => {
      if (arabicRegex.test(node.textContent || '') || node.tagName === 'TEXTAREA') {
        processElement(node);
        count++;
      }
    });
    return count;
  }

  window.__antigravityArabicScan = scan;
  scan();

  // 2. Real-time Observer for streaming tokens and new messages
  let debounceTimeout = null;
  const observer = new MutationObserver((mutations) => {
    let shouldScan = false;
    for (const m of mutations) {
      if (m.type === 'childList') {
        for (const node of m.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            processElement(node);
          } else if (node.nodeType === Node.TEXT_NODE && arabicRegex.test(node.nodeValue)) {
            processElement(node.parentElement);
          }
        }
      } else if (m.type === 'characterData' && arabicRegex.test(m.target.nodeValue)) {
        shouldScan = true;
      }
    }

    if (shouldScan) {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(scan, 80);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  console.log('[Antigravity-Arabic] Observer and RTL styles successfully activated.');
})();
