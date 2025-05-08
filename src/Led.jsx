import React from 'react'

const Led = ({col,handleLedToggle,colIndex,rowIndex,frameIndex}) => {
  return (
    <div className={`w-[50px] h-[50px] shadow-inner rounded-full  ${col === 1 ? 'bg-red-500 hover:bg-red-400' : 'bg-gray-200 hover:bg-gray-300'}`} onClick={()=>handleLedToggle(rowIndex,colIndex,frameIndex)} >
        
    </div>
  )
}

export default Led