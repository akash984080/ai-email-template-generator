


// import React, { useState } from 'react';
// import ButtonComponent from '../custom/Elements/ButtonComponent';
// import TextComponent from '../custom/Elements/TextComponent';
// import Imagecomponent from '../custom/Elements/Imagecomponent';
// import LogoComponent from '../custom/Elements/LogoComponent';
// import DividerComponent from '../custom/Elements/DividerComponent';
// import LogoHeaderComponent from '../custom/Elements/LogoHeaderComponent';
// import Socialicons from '../custom/Elements/Socialicons';
// import { useDragDrop, useEmailTemplate, useSelectedElement } from '@/app/provider';
// import { ArrowDown, ArrowUp, Trash2, Copy , MoreVertical } from 'lucide-react';
// const Columnlayout = ({ layout }) => {
//     const [dragOver, setDragover] = useState(null);
//     const { emailTemplate, setEmailTemplate } = useEmailTemplate();
//     const { dragElement, setDragElement } = useDragDrop();
//     const { selectedElement, setSelectedElement } = useSelectedElement();
//     const [showMenu, setShowMenu] = useState(false);

//     // Function to handle drag-over
//     const onDragOverHandle = (e, index) => {
//         e.preventDefault();
//         setDragover({
//             index,
//             columnId: layout?.id,
//         });
//     };

//     // Function to handle drop event
//     const onDropHandle = () => {
//         const index = dragOver?.index;

//         if (index !== undefined && layout?.id && dragElement?.dragElement) {
//             setEmailTemplate((prev) =>
//                 prev.map((col) =>
//                     col.id === layout.id
//                         ? { ...col, [index]: dragElement.dragElement }
//                         : col
//                 )
//             );
//         }
//         setDragover(null);
//     };

//     // Function to get the appropriate component
//     const getElementComponent = (element) => {
//         switch (element?.type) {
//             case 'Button':
//                 return <ButtonComponent {...element} />;
//             case 'Text':
//                 // console.log(JSON.stringify(element));

//                 return <TextComponent {...element} />;
//             case 'Image':
//                 return <Imagecomponent {...element} />;
//             case 'Logo':
//                 return <LogoComponent {...element} />;
//             case 'Divider':
//                 return <DividerComponent {...element} />;
//             case 'LogoHeader':
//                 return <LogoHeaderComponent {...element} />;
//             case 'SocialIcons':
//                 return <Socialicons {...element} />;
//             default:
//                 return <span>Invalid Element Type</span>;
//         }
//     };

//     const handleLayoutdelete = (layoutId) => {
//         const updatedLayout = emailTemplate?.filter(item => item.id !== layoutId);
//         setEmailTemplate(updatedLayout);
//         setSelectedElement(null);
//     };

//     const moveItemUp = (layoutId) => {
//         const index = emailTemplate.findIndex((item) => item.id === layoutId);

//         if (index > 0) {
//             setEmailTemplate((prev) => {
//                 const updatedItems = [...prev];
//                 [updatedItems[index], updatedItems[index - 1]] = [
//                     updatedItems[index - 1],
//                     updatedItems[index],
//                 ];
//                 return updatedItems;
//             });
//         }
//     };

//     const moveItemDown = (layoutId) => {
//         const index = emailTemplate.findIndex((item) => item.id === layoutId);

//         if (index < emailTemplate.length - 1) {
//             setEmailTemplate((prev) => {
//                 const updatedItems = [...prev];
//                 [updatedItems[index], updatedItems[index + 1]] = [
//                     updatedItems[index + 1],
//                     updatedItems[index],
//                 ];
//                 return updatedItems;
//             });
//         }
//     };

//     const duplicateLayout = (layoutId) => {
//         const index = emailTemplate.findIndex((item) => item.id === layoutId);
//         if (index !== -1) {
//             const original = emailTemplate[index];
//             const clone = {
//                 ...original,
//                 id: Date.now().toString(), 
//             };
//             const updated = [
//                 ...emailTemplate.slice(0, index + 1),
//                 clone,
//                 ...emailTemplate.slice(index + 1),
//             ];
//             setEmailTemplate(updated);
//         }
//     };

//     const handleLayoutClick = (index) => {
//         setSelectedElement({ layout, index });
//         setShowMenu(false); 
//     };

//     return (
//         <div className='relative '>
//             <div
//                 style={{
//                     display: 'grid',
//                     gridTemplateColumns: `repeat(${layout?.numOfCol}, 1fr)`,
//                     gap: '0px',
//                 }}
//             >
//                 {Array.from({ length: layout?.numOfCol }).map((_, index) => (
//                     <div
//                         key={index}
//                         className={`p-0 flex items-center justify-center h-full w-full bg-white cursor-pointer ${!layout?.[index]?.type &&
//                             'bg-gray-100 border-2 border-dashed'
//                             } ${index === dragOver?.index &&
//                             dragOver?.columnId &&
//                             'bg-green-200'
//                             } ${selectedElement?.layout?.id === layout?.id &&
//                             selectedElement?.index === index &&
//                             'border-blue-500 border-4'
//                             }`}
//                         onDragOver={(e) => onDragOverHandle(e, index)}
//                         onDrop={onDropHandle}
//                         onClick={() => handleLayoutClick(index)} // Pass index here
//                     >
//                         {layout?.[index]
//                             ? getElementComponent(layout[index])
//                             : 'Drag Element Here'}
//                     </div>
//                 ))}

//                 {selectedElement?.layout?.id === layout?.id && (
//                     <div className="absolute -right-10 top-0">
//                         <div className="relative">
//                             <button
//                                 className="bg-gray-100 p-2 rounded-full hover:scale-105 transition-all hover:shadow-md"
//                                 onClick={() => setShowMenu((prev) => !prev)}
//                             >
//                                 <MoreVertical className="h-4 w-4 text-gray-700" />
//                             </button>

//                             {showMenu && (
//                                 <div className="absolute top-10 right-0 bg-white border shadow-md rounded-md w-40 z-10">
//                                     <div
//                                         className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                         onClick={() => duplicateLayout(layout.id)}
//                                     >
//                                         <Copy className="h-4 w-4 text-blue-600" />
//                                         <span>Duplicate</span>
//                                     </div>
//                                     <div
//                                         className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                         onClick={() => handleLayoutdelete(layout.id)}
//                                     >
//                                         <Trash2 className="h-4 w-4 text-red-600" />
//                                         <span>Delete</span>
//                                     </div>
//                                     <div
//                                         className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                         onClick={() => moveItemUp(layout.id)}
//                                     >
//                                         <ArrowUp className="h-4 w-4" />
//                                         <span>Move Up</span>
//                                     </div>
//                                     <div
//                                         className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
//                                         onClick={() => moveItemDown(layout.id)}
//                                     >
//                                         <ArrowDown className="h-4 w-4" />
//                                         <span>Move Down</span>
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };


// export default Columnlayout;


import React, { useState, useRef, useEffect } from 'react';
import ButtonComponent from '../custom/Elements/ButtonComponent';
import TextComponent from '../custom/Elements/TextComponent';
import Imagecomponent from '../custom/Elements/Imagecomponent';
import LogoComponent from '../custom/Elements/LogoComponent';
import DividerComponent from '../custom/Elements/DividerComponent';
import Socialicons from '../custom/Elements/Socialicons';
import LogoHeader from '../custom/Elements/Logoheader';
import { useDragDrop, useEmailTemplate, useSelectedElement } from '@/app/provider';

import LayoutMenu  from './LayoutMenu'
const Columnlayout = ({ layout, locked = false }) => {
  const [dragOver, setDragover] = useState(null);
  const { emailTemplate, setEmailTemplate } = useEmailTemplate();
  const { dragElement } = useDragDrop();
  const { selectedElement, setSelectedElement } = useSelectedElement();
  const containerRef = useRef(null);

  // Column width state (in %)
  const initialWidths = layout?.columnWidths || Array(layout?.numOfCol).fill(100 / layout.numOfCol);
  const [colWidths, setColWidths] = useState(initialWidths);

  const resizing = useRef({ isResizing: false, colIndex: null, startX: 0, startWidths: [] });




  // Handle drag-over
  const onDragOverHandle = (e, index) => {
    e.preventDefault();
    if (!locked) {
      setDragover({ index, columnId: layout?.id });
    }
  };

  // Handle drop
  const onDropHandle = () => {
    if (locked) return;

    const index = dragOver?.index;
    if (index !== undefined && layout?.id && dragElement?.dragElement) {
      setEmailTemplate((prev) =>
        prev.map((col) =>
          col.id === layout.id
            ? { ...col, [index]: dragElement.dragElement }
            : col
        )
      );
    }
    setDragover(null);
  };

  // Get element renderer
  const getElementComponent = (element) => {
    switch (element?.type) {
      case 'Button': return <ButtonComponent {...element} />;
      case 'Text': return <TextComponent {...element} />;
      case 'Image': return <Imagecomponent {...element} />;
      case 'Logo': return <LogoComponent {...element} />;
      case 'Divider': return <DividerComponent {...element} />;
      case 'LogoHeader': return <LogoHeader {...element} />;
      case 'SocialIcons': return <Socialicons {...element} />;
      default: return <span>Invalid Element Type</span>;
    }
  };

  // Layout actions
  const handleLayoutdelete = (layoutId) => {
    if (locked) return;
    setEmailTemplate(emailTemplate.filter(item => item.id !== layoutId));
    setSelectedElement(null);
  };

  const moveItemUp = (layoutId) => {
    if (locked) return;
    const index = emailTemplate.findIndex((item) => item.id === layoutId);
    if (index > 0) {
      setEmailTemplate((prev) => {
        const updated = [...prev];
        [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
        return updated;
      });
    }
  };

  const moveItemDown = (layoutId) => {
    if (locked) return;
    const index = emailTemplate.findIndex((item) => item.id === layoutId);
    if (index < emailTemplate.length - 1) {
      setEmailTemplate((prev) => {
        const updated = [...prev];
        [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
        return updated;
      });
    }
  };

  const duplicateLayout = (layoutId) => {
    if (locked) return;
    const index = emailTemplate.findIndex((item) => item.id === layoutId);
    if (index !== -1) {
      const original = emailTemplate[index];
      const clone = {
        ...original,
        id: Date.now().toString(),
      };
      const updated = [
        ...emailTemplate.slice(0, index + 1),
        clone,
        ...emailTemplate.slice(index + 1),
      ];
      setEmailTemplate(updated);
    }
  };

  const addColumn = (layoutId) => {
    if (locked) return;
    setEmailTemplate((prev) =>
      prev.map((item) => {
        if (item.id === layoutId) {
          const currentWidths = item.columnWidths || Array(item.numOfCol).fill(100 / item.numOfCol);
          const newNum = item.numOfCol + 1;
          // redistribute widths proportionally and add a new column width
          const newWidths = [...currentWidths.map(w => (w * item.numOfCol) / newNum), 100 / newNum];
          const updatedLayout = { ...item, numOfCol: newNum, columnWidths: newWidths };
          updatedLayout[newNum - 1] = null; // Add empty column slot
          return updatedLayout;
        }
        return item;
      })
    );
  };

  const removeColumn = (layoutId) => {
    if (locked) return;
    setEmailTemplate((prev) =>
      prev.map((item) => {
        if (item.id === layoutId && item.numOfCol > 1) {
          const newNum = item.numOfCol - 1;
          const currentWidths = item.columnWidths || Array(item.numOfCol).fill(100 / item.numOfCol);
          const newWidths = currentWidths.slice(0, newNum);
          const updatedLayout = { ...item, numOfCol: newNum, columnWidths: newWidths };
          delete updatedLayout[newNum]; // Remove last column's content
          return updatedLayout;
        }
        return item;
      })
    );
  };
  const swapColumns = (layoutId, index1, index2) => {
    if (locked || index1 === index2) return;

    setEmailTemplate((prev) =>
      prev.map((item) => {
        if (item.id === layoutId) {
          const updatedLayout = { ...item };

          // Swap content
          const temp = updatedLayout[index1];
          updatedLayout[index1] = updatedLayout[index2];
          updatedLayout[index2] = temp;

          // Swap widths
          if (updatedLayout.columnWidths) {
            const tempWidth = updatedLayout.columnWidths[index1];
            updatedLayout.columnWidths[index1] = updatedLayout.columnWidths[index2];
            updatedLayout.columnWidths[index2] = tempWidth;
          }

          return updatedLayout;
        }
        return item;
      })
    );
  };


  const handleLayoutClick = (index) => {
    if (locked) return;
    setSelectedElement({ layout, index });

  };

  // Resize handlers
  const onMouseDown = (e, index) => {
    if (locked) return;
    resizing.current = {
      isResizing: true,
      colIndex: index,
      startX: e.clientX,
      startWidths: [...colWidths],
    };
    e.preventDefault();
  };

  const onMouseMove = (e) => {
    if (!resizing.current.isResizing) return;

    const { colIndex, startX, startWidths } = resizing.current;
    const delta = e.clientX - startX;
    const containerWidth = containerRef.current.offsetWidth;
    let deltaPercent = (delta / containerWidth) * 100;

    let newWidths = [...startWidths];

    if (colIndex === layout.numOfCol - 1) {
      // resizing last column only - adjust last column width, keep others fixed
      const lastWidth = Math.max(5, startWidths[colIndex] + deltaPercent);
      // Optionally clamp lastWidth so total doesn't exceed 100%
      // Calculate total of other columns:
      const otherTotal = startWidths.slice(0, colIndex).reduce((sum, w) => sum + w, 0);
      // Max lastWidth is 100 - otherTotal
      const maxLastWidth = 100 - otherTotal;
      newWidths[colIndex] = Math.min(lastWidth, maxLastWidth);
    } else {
      // resize colIndex and colIndex + 1 to keep total 100%
      const colWidth = Math.max(5, startWidths[colIndex] + deltaPercent);
      const nextColWidth = Math.max(5, startWidths[colIndex + 1] - deltaPercent);

      newWidths[colIndex] = colWidth;
      newWidths[colIndex + 1] = nextColWidth;
    }

    // Normalize to total 100%
    const total = newWidths.reduce((sum, w) => sum + w, 0);
    newWidths = newWidths.map((w) => (w / total) * 100);

    setColWidths(newWidths);
  };
  const getColumnClass = (index) => {
    return [
      'relative p-0 flex items-center justify-center bg-white cursor-pointer',
      !layout?.[index]?.type && 'bg-gray-100 border-2 border-dashed',
      index === dragOver?.index && dragOver?.columnId && 'bg-green-200',
      selectedElement?.layout?.id === layout?.id &&
      selectedElement?.index === index &&
      'border-blue-500 border-4',
    ]
      .filter(Boolean)
      .join(' ');
  };

  const onMouseUp = () => {
    if (resizing.current.isResizing) {
      resizing.current.isResizing = false;

      // Save the new widths back to emailTemplate state
      setEmailTemplate((prev) =>
        prev.map((item) =>
          item.id === layout.id ? { ...item, columnWidths: colWidths } : item
        )
      );
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [colWidths]);

  useEffect(() => {
    if (layout?.columnWidths?.length === layout?.numOfCol) {
      setColWidths(layout.columnWidths);
    }
  }, [layout]);

  return (
    <div className="relative" ref={containerRef}>
  
      <div className="flex w-full">
        {Array.from({ length: layout?.numOfCol }).map((_, index) => (
          <React.Fragment key={index}>
            <div
              className={getColumnClass(index)}
              style={{ width: `${colWidths[index]}%`, transition: 'width 0.1s ease' }}
              onDragOver={(e) => onDragOverHandle(e, index)}
              onDrop={onDropHandle}
              onClick={() => handleLayoutClick(index)}
            >
              {layout?.[index]
                ? getElementComponent(layout[index])
                : 'Drag Element Here'}

              {!locked && (
                <div
                  onMouseDown={(e) => onMouseDown(e, index)}
                  className="absolute right-0 top-0 h-full w-1 bg-gray-400 cursor-col-resize z-10 hover:w-2 transition-all"
                />
              )}
            </div>
          </React.Fragment>
        ))}

        {selectedElement?.layout?.id === layout?.id && !locked && (
          <LayoutMenu layout={layout} selectedElement={selectedElement} duplicateLayout={duplicateLayout} handleLayoutdelete={handleLayoutdelete} moveItemUp={moveItemUp} moveItemDown={moveItemDown} addColumn={addColumn} removeColumn={removeColumn} swapColumns={swapColumns} />
        )}
      </div>
    </div>
  );

};

export default Columnlayout;
