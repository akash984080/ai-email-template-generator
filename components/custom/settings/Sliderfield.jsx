

import { Slider } from '@/components/ui/slider'
import React from 'react'

const Sliderfield = ({ label, value, onhandleStyleChange, type = "px" }) => {
  const formatValue = (val) => Number(val.toString().replace(type, ''))

  return (
    <div>
      <label>{label} ({value})</label>
      <Slider
        defaultValue={[formatValue(value)]}
        max={100}
        step={1}
        onValueChange={(v) => onhandleStyleChange(`${v[0]}${type}`)}
      />
    </div>
  )
}

export default Sliderfield
