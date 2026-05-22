import { useState, useEffect, useCallback } from 'react';

const useTOC = (contentRef) => {
  const [headings, setHeadings] = useState([]);

  const extractHeadings = useCallback(() => {
    if (!contentRef.current) return;
    const elements = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const items = Array.from(elements).map((el, index) => {
      const id = `heading-${index}`;
      el.id = id;
      return {
        id,
        text: el.textContent,
        level: parseInt(el.tagName[1]),
      };
    });
    setHeadings(items);
  }, [contentRef]);

  useEffect(() => {
    const timer = setTimeout(extractHeadings, 300);
    return () => clearTimeout(timer);
  }, [extractHeadings]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return { headings, scrollTo };
};

export default useTOC;
