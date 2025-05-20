import React from 'react';

const ensureProtocol = (url) => {
  if (!url) return '';
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.href;
  } catch {
    return `https://${url.replace(/^\/+/, '')}`;
  }
};

const Socialicons = ({ socialIcons, style, outerStyle }) => {
  return (
    <div style={outerStyle}>
      {(socialIcons || []).map((img, index) => {
        if (!img?.icon || !img?.url) return null;
        return (
          <a
            key={index}
            href={ensureProtocol(img.url)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={img.icon}
              alt="icon"
              className="rounded-full border object-contain"
              width={24}
              height={24}
               style={{ width: '24px', height: '24px', display: 'block' }}
            />

          </a>
        );
      })}
    </div>
  );
};

export default Socialicons;

