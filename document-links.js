(() => {
  const initial = new URL(location.href);
  const fileToOpen = initial.searchParams.get('openDocument');
  const scrollX = Number(initial.searchParams.get('documentX')) || 0;
  const scrollY = Number(initial.searchParams.get('documentY')) || 0;

  function restoreDocumentPosition() {
    const position = history.state?.documentReturn;
    if (!position) return;
    window.scrollTo(position.x, position.y);
    requestAnimationFrame(() => window.scrollTo(position.x, position.y));
    document.fonts.ready.then(() => window.scrollTo(position.x, position.y));
  }
  window.addEventListener('pageshow', restoreDocumentPosition);

  if (fileToOpen) {
    const file = new URL(fileToOpen, location.href);
    const sameSite = file.protocol === location.protocol && file.host === location.host;
    if (sameSite && file.pathname.toLowerCase().endsWith('.pdf')) {
      initial.searchParams.delete('openDocument');
      initial.searchParams.delete('documentX');
      initial.searchParams.delete('documentY');
      history.replaceState({ ...history.state, documentReturn: { x: scrollX, y: scrollY } }, '', initial.href);
      // This real website visit remains in the new tab's history behind the PDF.
      const open = () => {
        window.scrollTo(scrollX, scrollY);
        window.location.assign(file.href);
      };
      // Let the initial visit finish so Chrome retains it as a history entry.
      const scheduleOpen = () => setTimeout(open, 200);
      if (document.readyState === 'complete') scheduleOpen();
      else window.addEventListener('load', scheduleOpen, { once: true });
    }
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link) return;
    const file = new URL(link.href, location.href);
    if (file.protocol !== location.protocol || file.host !== location.host || !file.pathname.toLowerCase().endsWith('.pdf')) return;
    const isResume = file.pathname.endsWith('/Shobit_Verma_Resume.pdf');
    if (isResume) {
      // Let the visitor's actual click perform the download. A synthetic second
      // click can be blocked when the same gesture also opens a new tab.
      link.download = 'Shobit_Verma Resume file.pdf';
    } else {
      event.preventDefault();
    }

    const destination = new URL(location.href);
    destination.searchParams.set('openDocument', file.href);
    destination.searchParams.set('documentX', String(window.scrollX));
    destination.searchParams.set('documentY', String(window.scrollY));
    const tab = window.open(destination.href, '_blank');
    if (tab) {
      tab.opener = null;
      tab.focus();
    }
  });
})();
