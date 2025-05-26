const TextComponent = ({ textarea, style }) => {
  // Ensure text content is always in the correct format
  const textContent = Array.isArray(textarea)
    ? textarea.map(item => typeof item === 'string' ? { text: item, style: {} } : item)
    : [{ text: String(textarea || ''), style: {} }];

  // Ensure base styles are always applied
  const baseStyle = {
    textAlign: style?.textAlign || 'left',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    display: 'block',
    position: 'relative',
    minHeight: '1em',
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    overflow: 'visible',
    zIndex: 1,
    backgroundColor: style?.backgroundColor || 'transparent',
    padding: style?.padding || '0.5em',
    margin: style?.margin || '0',
    fontSize: style?.fontSize || '16px',
    lineHeight: style?.lineHeight || '1.5',
    color: style?.color || 'inherit',
    fontFamily: style?.fontFamily || 'inherit',
    fontWeight: style?.fontWeight || 'normal',
    textTransform: style?.textTransform || 'none'
  };

  return (
    <div
      className="w-full text-component"
      style={baseStyle}
    >
      {textContent.map((segment, index) => {
        // Merge segment styles with base styles
        const segmentStyle = {
          ...baseStyle,
          ...segment.style,
          display: 'block',
          position: 'relative',
          width: '100%',
          minHeight: '1.5em',
          overflow: 'visible',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          padding: '0.25em 0',
          margin: '0',
          backgroundColor: segment.style?.backgroundColor || 'transparent'
        };
        return (
          <div
            key={index}
            style={segmentStyle}
            className="text-segment"
          >
            {segment.text}
          </div>
        );
      })}
    </div>
  );
};

export default TextComponent;
