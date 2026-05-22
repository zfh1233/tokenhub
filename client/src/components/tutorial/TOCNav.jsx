import { useState, useEffect } from 'react';

const TOCNav = ({ headings }) => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-24">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">目录</h4>
        <ul className="space-y-1">
          {headings.map(({ id, text, level }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`block text-xs leading-relaxed transition-colors ${
                  activeId === id ? 'text-primary-500 font-medium' : 'text-gray-400 hover:text-gray-600'
                }`}
                style={{ paddingLeft: `${(level - 1) * 12}px` }}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default TOCNav;
