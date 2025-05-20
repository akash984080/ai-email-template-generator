import React from 'react'

const LogoHeader = ({ style, outerStyle, imageUrl }) => {
   return (
        <div style={outerStyle}>
             <img src={imageUrl || null}  alt=""  style={style}/>
        </div>
    )
}

export default LogoHeader

