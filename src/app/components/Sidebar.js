"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "flowbite-react";

import SideBarComponent from "./SideBarComponent";

const SidebarUi = () => {
  const pathname = usePathname();
  const [mostrarMenu, setMostrarMenu] = useState(true);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMostrarMenu(!mostrarMenu);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMostrarMenu(false);
    }
  };

  return (
    <>
      <div className=" sticky top-12 text-white h-screen    ">
        <SideBarComponent toggleMenu={toggleMenu} />
      </div>
    </>
  );
};

export default SidebarUi;
