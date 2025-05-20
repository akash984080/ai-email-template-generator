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
      }}
    >
      {getFormattedContent().map((line, lineIndex) => (
        <p key={lineIndex} style={{ margin: 0 }}>
          {line.map(({ text, style, key }) => (
            <span key={key} style={style}>
              {text}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
};

export default TextComponent;
