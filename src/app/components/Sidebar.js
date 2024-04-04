"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
} from "react-icons/hi";
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

  // useEffect(() => {
  //   if (window.innerWidth <= 768) {
  //     // Cambia el tamaño de la pantalla según tus necesidades
  //     document.addEventListener("mousedown", handleClickOutside);

  //     return () => {
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     };
  //   }
  // }, []);

  return (
    <>
      <div className=" sticky top-12 text-white h-screen    ">
        <SideBarComponent />
      </div>
    </>
  );
};

export default SidebarUi;
