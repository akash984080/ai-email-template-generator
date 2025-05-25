const TextComponent = ({ textarea, style }) => {
  const textArray = Array.isArray(textarea)
    ? textarea.map((item) =>
        typeof item === 'string' ? { text: item, style: {} } : item
      )
    : String(textarea)
        .split(/(\s+|\n)/)
        .map((word) => ({ text: word, style: {} }));

  const getFormattedContent = () => {
    const lines = [];
    let currentLine = [];

    textArray.forEach((wordObj, index) => {
      const isNewline = wordObj.text === '\n';
      if (isNewline) {
        if (currentLine.length) lines.push(currentLine);
        currentLine = [];
      } else {
        currentLine.push({ ...wordObj, key: `${index}-${currentLine.length}` });
      }
    });

    if (currentLine.length) lines.push(currentLine);

    return lines;
  };

  return (
    <div
      className="w-full"
      style={{
        ...style,
        textAlign: style.textAlign || 'left',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
        display: 'block',
        position: 'relative',
        overflow: 'visible',
        height: 'auto'
      }}
    >
      {getFormattedContent().map((line, lineIndex) => (
        <p 
          key={lineIndex} 
          style={{ 
            margin: 0,
            padding: '0.25em 0',
            display: 'block',
            width: '100%',
            textAlign: 'inherit',
            position: 'relative',
            lineHeight: '1.5',
            overflow: 'visible',
            height: 'auto'
          }}
        >
          {line.map(({ text, style, key }) => (
            <span 
              key={key} 
              style={{
                ...style,
                display: 'inline',
                position: 'relative'
              }}
            >
              {text}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
};

export default TextComponent;
