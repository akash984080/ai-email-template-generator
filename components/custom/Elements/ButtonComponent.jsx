import React, { useState } from 'react';

const ButtonComponent = ({ style, content, url, outerStyle }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = (e) => {
    if (!url) return;

    e.preventDefault();
    setLoading(true);

    // Simulate an async action (e.g., network request)
    setTimeout(() => {
      setLoading(false);
      window.location.href = url;
    }, 2000); // adjust timing as needed
  };

  return (
    <div style={outerStyle}>
      <a
        href={url}
        className="inline-block"
        style={{ width: style?.width }}
        onClick={handleClick}
      >
        <button
          className="flex items-center justify-center gap-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          style={style}
          disabled={loading}
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? 'Loading...' : content}
        </button>
      </a>
    </div>
  );
};

export default ButtonComponent;
