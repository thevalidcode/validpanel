import type { FC, ReactNode } from "react"
import { HiX } from "react-icons/hi"

interface Props{
  isOpen: boolean,
  setIsOpen: (val: boolean) => void,
  children: ReactNode,
  from: 'left' | 'right';
}
const Overlay: FC<Props> = ({isOpen, setIsOpen, children, from}) => {
  return (
    <>
      {/* Overlay + Mobile Menu */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-[#00000030] z-40 backdrop-blur-[3px] transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />

          {/* Side Drawer Menu */}
          <div className={`${from === 'right'? 'top-0 right-0 animate-slideIn p-6':'top-16 left-0 animate-slideOut'} fixed h-full w-[40vw] max-w-[300px] bg-white z-50 shadow-lg transition-transform duration-300 transform`} >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-2xl text-[var(--primary)] mb-4 pointer"
              type="button"
            >
              <HiX />
            </button>

            {/* Mobile Menu */}
            {children}
          </div>
        </>
      )}
    </>
  )
}

export default Overlay