import { useEffect, useState } from 'react'

const TOUCH_QUERY = '(hover: none) and (pointer: coarse)'

export const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(TOUCH_QUERY)
    const update = () => setIsTouch(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return isTouch
}
