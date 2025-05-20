'use client'

import { useSelectedElement } from '@/app/provider'
import React, { useEffect, useState } from 'react'
import Inputfield from './settings/Inputfield'
import Colorpicker from './settings/Colorpicker'
import InputstyleField from './settings/InputstyleField'
import Sliderfield from './settings/Sliderfield'
import TextAreafield from './settings/TextAreafield'
import { AArrowUp, AlignCenter, AlignLeft, AlignRight, CaseLower, CaseUpper, Trash2 } from 'lucide-react'
import Togglegroup from './settings/Togglegroup'
import DropdownField from './settings/DropdownField'
import ImagePreview from './settings/ImagePreview'

const textAlignoptions = [
  { value: 'left', icon: AlignLeft },
  { value: 'center', icon: AlignCenter },
  { value: 'right', icon: AlignRight }
]

const textTransformOptions = [
  { value: 'uppercase', icon: CaseUpper },
  { value: 'lowercase', icon: CaseLower },
  { value: 'capitalize', icon: AArrowUp }
]

const Setting = () => {
  const { selectedElement, setSelectedElement } = useSelectedElement()
  const [element, setElement] = useState({})

  useEffect(() => {
    if (selectedElement && selectedElement.layout) {
      setElement(selectedElement.layout[selectedElement.index] || {})
    }
  }, [selectedElement])

  const onhandleInputChange = (fieldName, value) => {
    setSelectedElement(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        [prev.index]: {
          ...prev.layout[prev.index],
          [fieldName]: value
        }
      }
    }))
  }

  const onhandleStyleChange = (fieldName, value) => {
    const current = element?.style?.[fieldName]
    if (current !== value) {
      setSelectedElement(prev => ({
        ...prev,
        layout: {
          ...prev.layout,
          [prev.index]: {
            ...prev.layout[prev.index],
            style: {
              ...prev.layout[prev.index]?.style,
              [fieldName]: value
            }
          }
        }
      }))
    }
  }

  const onhandleouterStyleChange = (fieldName, value) => {
    const current = element?.outerStyle?.[fieldName]
    if (current !== value) {
      setSelectedElement(prev => ({
        ...prev,
        layout: {
          ...prev.layout,
          [prev.index]: {
            ...prev.layout[prev.index],
            outerStyle: {
              ...prev.layout[prev.index]?.outerStyle,
              [fieldName]: value
            }
          }
        }
      }))
    }
  }

  const getTextareaValue = (input) => {
    if (Array.isArray(input)) {
      return input.map((item) =>
        typeof item === 'string'
          ? item
          : typeof item === 'object' && item.text
            ? item.text
            : ''
      ).join(' ')
    }

    if (typeof input === 'object' && input !== null) {
      return input.text || ''
    }

    return String(input)
  }


  const hasKey = (key) => Object.prototype.hasOwnProperty.call(element, key)

  return (
    <div className="p-5 space-y-6 max-h-[calc(100vh-80px)] overflow-y-auto bg-gray-50 rounded-md">
      <h2 className="font-bold text-xl">Settings</h2>
     

      {hasKey('content') && (
        <Inputfield
          label="Content"
          value={element.content || ''}
          onhandleInputChange={(value) => onhandleInputChange('content', value)}
        />
      )}

      {hasKey('url') && (
        <Inputfield
          label="Link"
          value={element.url || ''}
          onhandleInputChange={(value) => onhandleInputChange('url', value)}
        />
      )}

      {hasKey('imageUrl') && (
        <ImagePreview
          label="Image Preview"
          value={element.imageUrl || ''}
          onhandleInputChange={(value) => onhandleInputChange('imageUrl', value)}
        />
      )}

      {element?.type === 'Text' && typeof element.textarea === 'string' && (
        <div className="mb-4">
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => {
              onhandleInputChange('textarea', [{ text: element.textarea, style: {} }]);
            }}
          >
            Enable advanced text editing
          </button>
        </div>
      )}

      {element?.type === 'Text' && Array.isArray(element.textarea) && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Text Segments</h3>
          {element.textarea.map((seg, idx) => (
            <div key={idx} className="mb-4 p-2 border rounded">
              <Inputfield
                label="Text"
                value={seg.text}
                onhandleInputChange={val => {
                  const updated = [...element.textarea];
                  updated[idx].text = val;
                  onhandleInputChange('textarea', updated);
                }}
              />
              <Colorpicker
                label="Color"
                value={seg.style?.color || '#000'}
                onhandleStyleChange={val => {
                  const updated = [...element.textarea];
                  updated[idx].style = { ...updated[idx].style, color: val };
                  onhandleInputChange('textarea', updated);
                }}
              />
              <DropdownField
                label="Font Weight"
                value={seg.style?.fontWeight || 'normal'}
                options={['normal', 'bold', 'bolder', 'lighter', '100', '200', '300', '400', '500', '600', '700', '800', '900']}
                onhandleStyleChange={val => {
                  const updated = [...element.textarea];
                  updated[idx].style = { ...updated[idx].style, fontWeight: val };
                  onhandleInputChange('textarea', updated);
                }}
              />
              <DropdownField
                label="Font Style"
                value={seg.style?.fontStyle || 'normal'}
                options={['normal', 'italic', 'oblique']}
                onhandleStyleChange={val => {
                  const updated = [...element.textarea];
                  updated[idx].style = { ...updated[idx].style, fontStyle: val };
                  onhandleInputChange('textarea', updated);
                }}
              />
              <DropdownField
                label="Text Decoration"
                value={seg.style?.textDecoration || 'none'}
                options={['none', 'underline', 'line-through', 'overline']}
                onhandleStyleChange={val => {
                  const updated = [...element.textarea];
                  updated[idx].style = { ...updated[idx].style, textDecoration: val };
                  onhandleInputChange('textarea', updated);
                }}
              />
              <InputstyleField
                label="Font Size"
                value={seg.style?.fontSize || '16px'}
                onhandleStyleChange={val => {
                  const updated = [...element.textarea];
                  updated[idx].style = { ...updated[idx].style, fontSize: val };
                  onhandleInputChange('textarea', updated);
                }}
                type="px"
              />
              <DropdownField
                label="Font Family"
                value={seg.style?.fontFamily || 'Arial, Helvetica, sans-serif'}
                options={[
                  'Arial, Helvetica, sans-serif',
                  'Times New Roman, Times, serif',
                  'Georgia, serif',
                  'Tahoma, Geneva, sans-serif',
                  'Verdana, Geneva, sans-serif',
                  'Courier New, Courier, monospace'
                ]}
                onhandleStyleChange={val => {
                  const updated = [...element.textarea];
                  updated[idx].style = { ...updated[idx].style, fontFamily: val };
                  onhandleInputChange('textarea', updated);
                }}
              />
              <Colorpicker
                label="Background Color"
                value={seg.style?.backgroundColor || '#ffffff'}
                onhandleStyleChange={val => {
                  const updated = [...element.textarea];
                  updated[idx].style = { ...updated[idx].style, backgroundColor: val };
                  onhandleInputChange('textarea', updated);
                }}
              />
              <InputstyleField
                label="Line Height"
                value={seg.style?.lineHeight || '1.5'}
                onhandleStyleChange={val => {
                  const updated = [...element.textarea];
                  updated[idx].style = { ...updated[idx].style, lineHeight: val };
                  onhandleInputChange('textarea', updated);
                }}
                type=""
              />
              <InputstyleField
                label="Letter Spacing"
                value={seg.style?.letterSpacing || 'normal'}
                onhandleStyleChange={val => {
                  const updated = [...element.textarea];
                  updated[idx].style = { ...updated[idx].style, letterSpacing: val };
                  onhandleInputChange('textarea', updated);
                }}
                type="px"
              />
              <DropdownField
                label="Text Transform"
                value={seg.style?.textTransform || 'none'}
                options={['none', 'uppercase', 'lowercase', 'capitalize']}
                onhandleStyleChange={val => {
                  const updated = [...element.textarea];
                  updated[idx].style = { ...updated[idx].style, textTransform: val };
                  onhandleInputChange('textarea', updated);
                }}
              />
              <Inputfield
                label="Text Shadow"
                value={seg.style?.textShadow || ''}
                onhandleInputChange={val => {
                  const updated = [...element.textarea];
                  updated[idx].style = { ...updated[idx].style, textShadow: val };
                  onhandleInputChange('textarea', updated);
                }}
              />
              <InputstyleField
                label="Margin"
                value={seg.style?.margin || '0'}
                onhandleStyleChange={val => {
                  const updated = [...element.textarea];
                  updated[idx].style = { ...updated[idx].style, margin: val };
                  onhandleInputChange('textarea', updated);
                }}
                type=""
              />
              <InputstyleField
                label="Padding"
                value={seg.style?.padding || '0'}
                onhandleStyleChange={val => {
                  const updated = [...element.textarea];
                  updated[idx].style = { ...updated[idx].style, padding: val };
                  onhandleInputChange('textarea', updated);
                }}
                type=""
              />
              <button
                className="mt-2 text-red-500"
                onClick={() => {
                  const updated = element.textarea.filter((_, i) => i !== idx);
                  onhandleInputChange('textarea', updated);
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => {
              const updated = [...element.textarea, { text: '', style: {} }];
              onhandleInputChange('textarea', updated);
            }}
          >
            + Add Segment
          </button>
        </div>
      )}

      {element?.style?.borderRadius && (
        <Sliderfield
          label="Border Radius"
          value={element.style.borderRadius || 0}
          type="px"
          onhandleStyleChange={(value) => onhandleStyleChange('borderRadius', value)}
        />
      )}

      {element?.style?.width && (
        <Sliderfield
          label="Width"
          value={element.style.width || 50}
          type="%"
          onhandleStyleChange={(value) => onhandleStyleChange('width', value)}
        />
      )}

      {/* {element?.style?.height && (
        <Sliderfield
          label="Height"
          value={element.style.height || 0}
          type="px"
          onhandleStyleChange={(value) => onhandleStyleChange('height', value)}
        />
      )} */}

      {element?.style?.textAlign && (
        <Togglegroup
          label="Text Align"
          value={element.style.textAlign || 'left'}
          options={textAlignoptions}
          onhandleStyleChange={(value) => onhandleStyleChange('textAlign', value)}
        />
      )}

      {element?.style?.textTransform && (
        <Togglegroup
          label="Text Transform"
          value={element.style.textTransform || 'uppercase'}
          options={textTransformOptions}
          onhandleStyleChange={(value) => onhandleStyleChange('textTransform', value)}
        />
      )}

      {element?.style?.backgroundColor && (
        <Colorpicker
          label="Background Color"
          value={element.style.backgroundColor || '#ffffff'}
          onhandleStyleChange={(value) => onhandleStyleChange('backgroundColor', value)}
        />
      )}

      {element?.style?.color && (
        <Colorpicker
          label="Text Color"
          value={element.style.color || '#000000'}
          onhandleStyleChange={(value) => onhandleStyleChange('color', value)}
        />
      )}

      {element?.style?.fontSize && (
        <InputstyleField
          label="Font Size"
          value={element.style.fontSize || 16}
          onhandleStyleChange={(value) => onhandleStyleChange('fontSize', value)}
        />
      )}

      {element?.style?.padding && (
        <InputstyleField
          label="Padding"
          value={element.style.padding || 0}
          onhandleStyleChange={(value) => onhandleStyleChange('padding', value)}
        />
      )}

      {element?.style?.margin && (
        <InputstyleField
          label="Margin"
          value={element.style.margin || 0}
          onhandleStyleChange={(value) => onhandleStyleChange('margin', value)}
        />
      )}

      {element?.style?.fontWeight && (
        <DropdownField
          label="Font Weight"
          value={element.style.fontWeight || 'normal'}
          options={['normal', 'bold']}
          onhandleStyleChange={(value) => onhandleStyleChange('fontWeight', value)}
        />
      )}

      {element?.outerStyle && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="font-bold mb-2 text-lg">Outer Style</h2>

          {/* {element?.outerStyle?.backgroundColor && (
            <Colorpicker
              label="Background Color"
              value={element.outerStyle.backgroundColor || '#ffffff'}
              onhandleStyleChange={(value) => onhandleouterStyleChange('backgroundColor', value)}
            />
          )} */}

          {element?.outerStyle?.justifyContent && (
            <Togglegroup
              label="Align"
              options={textAlignoptions}
              value={element.outerStyle.justifyContent || 'left'}
              onhandleStyleChange={(value) => onhandleouterStyleChange('justifyContent', value)}
            />
          )}
        </div>
      )}

      {element?.socialIcons && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="font-bold text-lg mb-4">Social Icons</h2>

          {element.socialIcons.map((item, idx) => (
            <div key={idx} className="flex flex-wrap items-center gap-4 mb-4 border-b pb-4">
              <img src={item.icon} alt="icon" className="w-6 h-6 rounded-full border object-contain" />

              <Inputfield
                label={`URL ${idx + 1}`}
                value={item.url || ''}
                onhandleInputChange={(value) => {
                  const updatedIcons = [...element.socialIcons]
                  updatedIcons[idx].url = value
                  onhandleInputChange('socialIcons', updatedIcons)
                }}
              />

              <ImagePreview
                label="Icon"
                value={item.icon}
                onhandleInputChange={(value) => {
                  const updatedIcons = [...element.socialIcons]
                  updatedIcons[idx].icon = value
                  onhandleInputChange('socialIcons', updatedIcons)
                }}
              />

              <button
                className="ml-auto text-red-500 hover:text-red-700 transition"
                onClick={() => {
                  const updatedIcons = element.socialIcons.filter((_, i) => i !== idx)
                  onhandleInputChange('socialIcons', updatedIcons)
                }}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}

          <button
            className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
            onClick={() => {
              const updatedIcons = [
                ...element.socialIcons,
                { icon: 'https://cdn-icons-png.flaticon.com/128/2111/2111463.png', url: '' }
              ]
              onhandleInputChange('socialIcons', updatedIcons)
            }}
          >
            + Add Icon
          </button>
        </div>
      )}

      {/* LogoHeader, Image, Logo advanced style controls */}
      {(element?.type === 'LogoHeader' || element?.type === 'Image' || element?.type === 'Logo') && (
        <>
          <InputstyleField
            label="Width"
            value={element.style?.width || '120px'}
            onhandleStyleChange={(value) => onhandleStyleChange('width', value)}
            type="px"
          />
          <InputstyleField
            label="Height"
            value={element.style?.height || 'auto'}
            onhandleStyleChange={(value) => onhandleStyleChange('height', value)}
            type="px"
          />
          <Sliderfield
            label="Border Radius"
            value={element.style?.borderRadius || 0}
            type="px"
            onhandleStyleChange={(value) => onhandleStyleChange('borderRadius', value)}
          />
          <InputstyleField
            label="Border Width"
            value={element.style?.borderWidth || '0px'}
            onhandleStyleChange={(value) => onhandleStyleChange('borderWidth', value)}
            type="px"
          />
          <DropdownField
            label="Border Style"
            value={element.style?.borderStyle || 'solid'}
            options={['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset']}
            onhandleStyleChange={(value) => onhandleStyleChange('borderStyle', value)}
          />
          <Colorpicker
            label="Border Color"
            value={element.style?.borderColor || '#000000'}
            onhandleStyleChange={(value) => onhandleStyleChange('borderColor', value)}
          />
          <InputstyleField
            label="Margin"
            value={element.style?.margin || '0'}
            onhandleStyleChange={(value) => onhandleStyleChange('margin', value)}
            type=""
          />
          <InputstyleField
            label="Padding"
            value={element.style?.padding || '0'}
            onhandleStyleChange={(value) => onhandleStyleChange('padding', value)}
            type=""
          />
          <Colorpicker
            label="Background Color"
            value={element.style?.backgroundColor || '#ffffff'}
            onhandleStyleChange={(value) => onhandleStyleChange('backgroundColor', value)}
          />
          <Inputfield
            label="Alt Text"
            value={element.alt || ''}
            onhandleInputChange={(value) => onhandleInputChange('alt', value)}
          />
        </>
      )}

      {/* SocialIcons advanced style controls */}
      {element?.type === 'SocialIcons' && (
        <>
          <InputstyleField
            label="Icon Size (px)"
            value={element.style?.iconSize || '24px'}
            onhandleStyleChange={(value) => onhandleStyleChange('iconSize', value)}
            type="px"
          />
          <Sliderfield
            label="Border Radius"
            value={element.style?.borderRadius || 0}
            type="px"
            onhandleStyleChange={(value) => onhandleStyleChange('borderRadius', value)}
          />
          <InputstyleField
            label="Border Width"
            value={element.style?.borderWidth || '0px'}
            onhandleStyleChange={(value) => onhandleStyleChange('borderWidth', value)}
            type="px"
          />
          <DropdownField
            label="Border Style"
            value={element.style?.borderStyle || 'solid'}
            options={['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset']}
            onhandleStyleChange={(value) => onhandleStyleChange('borderStyle', value)}
          />
          <Colorpicker
            label="Border Color"
            value={element.style?.borderColor || '#000000'}
            onhandleStyleChange={(value) => onhandleStyleChange('borderColor', value)}
          />
          <InputstyleField
            label="Margin"
            value={element.style?.margin || '0'}
            onhandleStyleChange={(value) => onhandleStyleChange('margin', value)}
            type=""
          />
          <InputstyleField
            label="Padding"
            value={element.style?.padding || '0'}
            onhandleStyleChange={(value) => onhandleStyleChange('padding', value)}
            type=""
          />
          <Colorpicker
            label="Background Color"
            value={element.style?.backgroundColor || '#ffffff'}
            onhandleStyleChange={(value) => onhandleStyleChange('backgroundColor', value)}
          />
        </>
      )}
    </div>
  )
}

export default Setting
