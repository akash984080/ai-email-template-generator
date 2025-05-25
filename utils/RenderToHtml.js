function inlineStyle (styleObj = {}) {
  // Convert style object to email-safe inline styles
  const emailSafeStyles = {
    ...styleObj,
    // Ensure font-family is email-safe
    fontFamily: styleObj.fontFamily || 'Arial, Helvetica, sans-serif',
    // Ensure colors are hex codes
    color: styleObj.color || '#000000',
    backgroundColor: styleObj.backgroundColor || '#ffffff',
    // Ensure text alignment is supported
    textAlign: styleObj.textAlign || 'left',
    // Ensure padding is in pixels
    padding: styleObj.padding || '0px',
    // Ensure margin is in pixels
    margin: styleObj.margin || '0px',
    // Ensure border is email-safe
    border: styleObj.border || 'none',
    // Ensure width is in pixels or percentage
    width: styleObj.width || '100%',
    // Ensure height is in pixels or percentage
    height: styleObj.height || 'auto',
  }

  return Object.entries(emailSafeStyles)
    .map(([key, value]) => `${camelToKebab(key)}: ${value}`)
    .join('; ')
}

function camelToKebab (str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

function escapeHtml (text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function renderTemplateToHtml (template) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Email</title>
        <style>
          @media only screen and (max-width: 600px) {
            .container {
              width: 100% !important;
              min-width: 100% !important;
            }
            .stack-column {
              display: block !important;
              width: 100% !important;
              max-width: 100% !important;
            }
            .center-on-mobile {
              text-align: center !important;
              display: block !important;
              margin-left: auto !important;
              margin-right: auto !important;
              float: none !important;
            }
          }
        </style>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9f9f9;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0" class="container" style="background: #ffffff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                ${template.map(renderSection).join('')}
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function renderSection (section) {
  const columns = Object.keys(section).filter(
    key => !['icon', 'id', 'label', 'numOfCol', 'type'].includes(key)
  );
  const numOfCol = section.numOfCol || 1;

  return `
    <tr>
      ${columns
        .map(colKey => {
          const col = section[colKey];
          return `<td class="stack-column" style="width: ${100 / numOfCol}%; vertical-align: middle; padding: 6px 6px 6px 6px;">${renderComponent(col)}</td>`;
        })
        .join('')}
    </tr>
  `;
}

function renderComponent (component) {
  if (!component || typeof component !== 'object') return '';
  const style = component.style || {};
  switch (component.type) {
    case 'LogoHeader':
    case 'Image':
    case 'Logo': {
      const imageUrl = component.imageUrl || 'https://via.placeholder.com/150';
      const imgStyle = [
        `max-width: ${style.width || '120px'}`,
        `width: ${style.width || '120px'}`,
        `height: ${style.height || 'auto'}`,
        `border-radius: ${style.borderRadius || '0px'}`,
        `display: block`,
        `margin: 0 auto 10px auto`,
        `border-width: ${style.borderWidth || '0px'}`,
        `border-style: ${style.borderStyle || 'none'}`,
        `border-color: ${style.borderColor || 'transparent'}`,
        style.backgroundColor ? `background-color: ${style.backgroundColor}` : '',
        style.margin ? `margin: ${style.margin}` : '',
        style.padding ? `padding: ${style.padding}` : '',
      ].filter(Boolean).join('; ');
      return `<img src="${imageUrl}" alt="${component.alt || ''}" style="${imgStyle}" />`;
    }
    case 'Text': {
      // Support both string and array of segments
      const segments = Array.isArray(component.textarea)
        ? component.textarea
        : [{ text: component.textarea, style: style }];

      // Use table-based layout for better email client compatibility
      return `
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse: collapse;">
          <tr>
            <td style="
              color: ${style.color || '#000'};
              font-family: ${style.fontFamily || 'Arial, Helvetica, sans-serif'};
              font-size: ${style.fontSize || '16px'};
              font-weight: ${style.fontWeight || 'normal'};
              text-align: ${style.textAlign || 'left'};
              padding: ${style.padding || '8px'};
              margin: ${style.margin || '0'};
              line-height: ${style.lineHeight || '1.5'};
              background-color: ${style.backgroundColor || 'transparent'};
            ">
              ${segments.map(seg => {
                const segmentStyle = Object.entries(seg.style || {})
                  .filter(([key]) => !['textShadow', 'letterSpacing', 'textTransform'].includes(key)) // Remove unsupported properties
                  .map(([k, v]) => `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${v}`)
                  .join('; ');
                return `<span style="${segmentStyle}">${seg.text}</span>`;
              }).join('')}
            </td>
          </tr>
        </table>`;
    }
    case 'Button':
      return `
        <div style="text-align: center; margin: 8px 0;">
          <a href="${component.url || '#'}" style="background: ${component.style?.backgroundColor || '#007bff'}; color: ${component.style?.color || '#fff'}; padding: ${component.style?.padding || '10px 20px'}; text-decoration: none; border-radius: ${component.style?.borderRadius || '5px'}; font-weight: ${component.style?.fontWeight || 'bold'}; display: inline-block;">
            ${component.content || 'Button'}
          </a>
        </div>
      `;
    case 'Divider':
      return `<hr style="border: none; border-top: 1px solid #e0e0e0; margin: 16px 0;" />`;
    case 'SocialIcons': {
      const iconStyle = [
        `width: ${style.iconSize || '24px'}`,
        `height: ${style.iconSize || '24px'}`,
        `border-radius: ${style.borderRadius || '0px'}`,
        `border-width: ${style.borderWidth || '0px'}`,
        `border-style: ${style.borderStyle || 'none'}`,
        `border-color: ${style.borderColor || 'transparent'}`,
        style.backgroundColor ? `background-color: ${style.backgroundColor}` : '',
        style.margin ? `margin: ${style.margin}` : '',
        style.padding ? `padding: ${style.padding}` : '',
      ].filter(Boolean).join('; ');
      return `<div style="text-align: center; margin: 16px 0;">
        ${(component.socialIcons || [])
          .map(
            iconObj => `
              <a href="${iconObj.url || '#'}" target="_blank" style="display: inline-block; margin: 0 5px;">
                <img src="${iconObj.icon}" alt="" style="${iconStyle}" />
              </a>`
          )
          .join('')}
      </div>`;
    }
    default:
      return '';
  }
}

export default renderTemplateToHtml




// function renderTemplateToHtml (template) {
//   return `
//     <html>
//       <head>
//         <style>
//           @media (max-width: 600px) {
//             table {
//               width: 100% !important;
//             }
//             td {
//               width: 100% !important;
//               display: block;
//             }
//           }
//         </style>
//       </head>
//       <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
//         <table width="100%" cellpadding="0" cellspacing="0" border="0">
//           <tr>
//             <td align="center">
//               <table width="600" cellpadding="0" cellspacing="0" border="0" style="background: #ffffff; padding: 20px;">
//                 ${template.map(renderSection).join('')}
//               </table>
//             </td>
//           </tr>
//         </table>
//       </body>
//     </html>
//   `
// }

// function renderSection (section) {
//   const columns = Object.keys(section).filter(
//     key => !['icon', 'id', 'label', 'numOfCol', 'type'].includes(key)
//   )
//   const numOfCol = section.numOfCol || 1 // Default to 1 column if not provided

//   return `
//     <tr>
//       ${columns
//         .map(colKey => {
//           const col = section[colKey]
//           return `<td style="width: ${100 / numOfCol}%;">${renderComponent(
//             col
//           )}</td>`
//         })
//         .join('')}
//     </tr>
//   `
// }

// function renderComponent (component) {
//   switch (component.type) {
//     case 'LogoHeader':
//     case 'Image':
//       const imageUrl = component.imageUrl || 'default-image-url.jpg' // Fallback image URL
//       return `<img src="${imageUrl}" alt="${
//         component.alt || ''
//       }" style="max-width: 100%; border-radius: ${
//         component.style?.borderRadius || '0px'
//       };" />`

//     case 'Text':
//       return `<div style="color: ${
//         component.style?.color || '#000'
//       }; font-size: ${component.style?.fontSize?.[0] || '14px'}; text-align: ${
//         component.style?.textAlign?.[0] || 'left'
//       }; padding: ${component.style?.padding || '10px'};">${
//         component.textarea
//       }</div>`

//     case 'Button':
//       return `
//         <a href="${component.url || '#'}" style="background: ${
//         component.style?.backgroundColor?.[0] || '#007bff'
//       }; color: ${component.style?.color || '#fff'}; padding: ${
//         component.style?.padding || '10px 20px'
//       }; text-decoration: none; border-radius: ${
//         component.style?.borderRadius || '5px'
//       }; font-weight: ${
//         component.style?.fontWeight || 'bold'
//       }; display: inline-block;">
//           ${component.content || 'Button'}
//         </a>
//       `

//     default:
//       return ''
//   }
// }

// export default renderTemplateToHtml
