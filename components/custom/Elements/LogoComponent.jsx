import { Image } from 'lucide-react'
import React from 'react'

const LogoComponent = ({ style, outerStyle, imageUrl }) => {

    
    return (
        <div style={outerStyle}>
             <img src={imageUrl || null}  alt=""  style={style}/>
        </div>
    )
}

export default LogoComponent