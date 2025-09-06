import { IoSettingsOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import Store from "../components/Stores/Store";
import Overlay from "../components/general/Overlay";
import { RiListView } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { FaStore } from "react-icons/fa";
import { MdOutlineAnalytics } from "react-icons/md";
import { LuLogOut } from "react-icons/lu";
import { HiMenu } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useAppContext";

const subMenu = [
  {title: 'Overview', logo: RiListView},
  {title: 'Users', logo: FaUsers},
  {title: 'Stores', logo: FaStore},
  {title: 'Analytics', logo: MdOutlineAnalytics},
  {title: 'Settings', logo: IoSettingsOutline},
  {title: 'Logout', logo: LuLogOut},
  
]

const StoresPage = () => {
  const navigate = useNavigate()
  const { user } = useAppContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleButtonClick = (title: string) => {
    setIsOpen(false)
    if (title === 'Logout') {
      sessionStorage.clear();
      navigate(0);
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <div className="w-full text-black px-4 py-5">
      <button onClick={()=>setIsOpen(true)} className="w-full flex justify-between lg:hidden mb-5">
        <HiMenu className="text-2xl active:text-primary transition" />
        <h1 className="font-medium text-xl">Stores</h1>
      </button>
      <div className="w-full flex gap-2 lg:border-t border-vgrey-border ">
        <div className="hidden lg:flex flex-col w-[20%] h-full border-r border-vgrey-border lg:py-10 ">
          {
            subMenu.map((menu) => (
              <button onClick={() => handleButtonClick(menu.title)} key={menu.title}
                className={`w-full py-3 px-7 rounded-r-full flex items-center gap-6 submenu ${!user && menu.title === 'Logout' && 'hidden'}`}
              >
                <menu.logo className="text-2xl" />
                <p className="inline-block text-vgrey-text"> {menu.title} </p>
              </button>
            ))
          }
        </div>
        <div className="w-full lg:w-[80%] lg:py-10 space-y-10">
          <div className="h-22 w-full hidden lg:grid lg:grid-cols-2">
            <div className="h-full flex flex-col justify-between">
              <h1 className="text-4xl font-bold">My Stores</h1>
              <p className="text-sm text-vgrey-text">
                View and manage all your created shops and social media stores.
              </p>
            </div>
            <Link to={'/create-store'} className="grid place-content-center w-[210px] h-12 bg-primary btn-custom rounded-[8px] justify-self-end self-center text-white ">
              + Create New Store
            </Link>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 justify-center gap-5 lg:gap-y-10">
            <Store />
            <Store />
            <Store />
            <Store />
          </div>
        </div>
      </div>

      <Overlay
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(false)}
        from="left"
      >
        <div className="w-full space-y-9 py-8">
          {
            subMenu.map((menu) => (
              <button onClick={()=>handleButtonClick(menu.title)} key={menu.title} className={`w-full py-2 px-3 rounded-r-full flex items-center gap-5 submenu`} >
                <menu.logo className="text-2xl" />
                <p className="inline-block text-vgrey-text text-sm"> {menu.title} </p>
              </button>
            ))
          }
        </div>
      </Overlay>
    </div>
  )
}

export default StoresPage;