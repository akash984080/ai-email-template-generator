const DividerComponent = ({ style }) => {
  return (
    <hr
      style={{
        border: 'none',  
        height: '2px',  
        backgroundColor: style?.color || '#000', 
        width: style?.width || '100%',  
        margin: style?.margin || '10px 0', 
        padding: 0, 
        style,
      }}
    />
  );
};




export default DividerComponent