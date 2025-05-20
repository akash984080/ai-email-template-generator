import React from 'react'

const Colorpicker = ({ label, value, onhandleStyleChange }) => {
    return (
        <div className='grid'>
            <div><label>{label}</label></div>

            <input type="color" value={value} onChange={(e) => onhandleStyleChange(e.target.value)} />
        </div>
    )
}

export default Colorpicker