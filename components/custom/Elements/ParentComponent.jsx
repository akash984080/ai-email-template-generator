import { useState } from 'react';
import TextComponent from './TextComponent'; // Importing TextComponent

const ParentComponent = () => {
  const [selectedComponent, setSelectedComponent] = useState(null);

  // Handle click event to select or deselect a component
  const handleSelect = (id) => {
    setSelectedComponent((prevSelected) => (prevSelected === id ? null : id));
  };

  return (
    <div>
      <TextComponent
        id="component-1"
        selected={selectedComponent === 'component-1'}
        onSelect={handleSelect}
        textarea="This is the first text component."
      />
      <TextComponent
        id="component-2"
        selected={selectedComponent === 'component-2'}
        onSelect={handleSelect}
        textarea="This is the second text component."
      />
    </div>
  );
};

export default ParentComponent;
