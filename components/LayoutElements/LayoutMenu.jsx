import { useState, useRef, useEffect } from "react";
import { ArrowDown, ArrowUp, Trash2, Copy, MoreVertical } from 'lucide-react';
function LayoutMenu({ layout, selectedElement, duplicateLayout, handleLayoutdelete, moveItemUp, moveItemDown, addColumn, removeColumn, swapColumns }) {
  const [showMenu, setShowMenu] = useState(false);
  const [positionAbove, setPositionAbove] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (showMenu) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const menuHeight = menuRef.current ? menuRef.current.offsetHeight : 200; 

      if (viewportHeight - buttonRect.bottom < menuHeight + 10) {
        setPositionAbove(true);
      } else {
        setPositionAbove(false);
      }
    }
  }, [showMenu]);

  return (
    <div className="absolute -right-10 top-0">
      <div className="relative">
        <button
          ref={buttonRef}
          aria-label="More options"
          className="bg-gray-100 p-2 rounded-full hover:scale-105 transition-all hover:shadow-md"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <MoreVertical className="h-4 w-4 text-gray-700" />
        </button>

        {showMenu && (
          <div
            ref={menuRef}
            className={`absolute w-40 max-h-[15rem] overflow-y-auto bg-white border shadow-md rounded-md p-2 flex flex-col gap-2 z-10 ${
              positionAbove ? "bottom-full mb-2" : "top-full mt-2"
            }`}
            style={{ minWidth: "10rem" }}
          >
            {/* menu items here */}
            <div
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => duplicateLayout(layout.id)}
            >
              <Copy className="h-4 w-4 text-blue-600" />
              <span>Duplicate</span>
            </div>
            <div
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => handleLayoutdelete(layout.id)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
              <span>Delete</span>
            </div>
            <div
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => moveItemUp(layout.id)}
            >
              <ArrowUp className="h-4 w-4" />
              <span>Move Up</span>
            </div>
            <div
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => moveItemDown(layout.id)}
            >
              <ArrowDown className="h-4 w-4" />
              <span>Move Down</span>
            </div>
            <div
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => addColumn(layout.id)}
            >
              ➕ <span>Add Column</span>
            </div>
            <div
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
              onClick={() => removeColumn(layout.id)}
            >
              ➖ <span>Remove Column</span>
            </div>

            {layout.numOfCol > 1 && (
              <div className="px-2">
                <div className="text-xs text-gray-500 mb-1">Swap With</div>
                <div className="flex flex-col gap-1 max-h-32 overflow-y-visible">
                  {Array.from({ length: layout.numOfCol }).map((_, i) => {
                    if (i === selectedElement?.index) return null;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                        onClick={() => {
                          swapColumns(layout.id, selectedElement?.index, i);
                          setShowMenu(false);
                        }}
                      >
                        🔁 <span>With Column {i + 1}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


export default LayoutMenu