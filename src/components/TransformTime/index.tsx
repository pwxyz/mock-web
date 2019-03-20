
import dayjs from 'dayjs';
import React from 'react'

const TransformTime = ({ time, formatStr='YYYY-MM-DD HH:mm:ss' }) => {
  return (
    <div>{dayjs(time).format(formatStr)}</div>
  )
}

export default TransformTime;
