

// import React from 'react';

// const Imagecomponent = ({ style, outerstyle, imageUrl, alt }) => {
//   return (
//     <div
//       style={{
//         display: 'flex',
//         justifyContent: outerstyle?.justifyContent || 'center', // Horizontal alignment
//         alignItems: outerstyle?.alignItems || 'center', // Vertical alignment
//         ...outerstyle, // Spread any other custom outerstyle properties
//       }}
//     >
//       {imageUrl ? (
//         <img
//           style={style}
//           src={imageUrl || null}
//           alt={`Preview of ${alt}`}
//           // Ensure the image takes up its container space as needed
//           className="object-contain" // You can adjust this class for your specific needs
//         />
//       ) : null}
//     </div>
//   );
// };

// export default Imagecomponent;

// import React from 'react';

// const ImageComponent = ({ style, outerstyle, imageUrl, alt }) => {
//   return (
//     <div
//       style={{
//         display: 'flex',
//         justifyContent: outerstyle?.justifyContent || 'center', // Horizontal alignment
//         alignItems: outerstyle?.alignItems || 'center', // Vertical alignment
//         ...outerstyle, // Spread any other custom outerstyle properties
//       }}
//     >
//       {imageUrl ? (
//         <img
//           style={style}
//           src={imageUrl}  // Use the imageUrl, which should be a base64 string
//           alt={`Preview of ${alt}`}
//           className="object-contain" // Adjust the class as needed
//         />
//       ) : (
//         <div>No Image</div>  // Fallback if no imageUrl is passed
//       )}
//     </div>
//   );
// };

// export default ImageComponent;


import React from 'react';

const ImageComponent = ({ style, outerstyle, imageUrl, alt }) => {
 

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: outerstyle?.justifyContent || 'center', 
        alignItems: outerstyle?.alignItems || 'center', 
        ...outerstyle, 
      }}
    >
      {imageUrl ? (
        <img
          style={style}
          src={imageUrl}  
          alt={`Preview of ${alt}`}
          className="object-contain"
        />
      ) : (
        <div>No Image</div>  
      )}
    </div>
  );
};

export default ImageComponent;
