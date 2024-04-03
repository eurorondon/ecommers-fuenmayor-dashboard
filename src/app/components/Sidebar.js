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
        <Sidebar
          aria-label="Sidebar with multi-level dropdown example"
          className="w-full "
        >
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item href="#" icon={HiChartPie}>
                Dashboard
              </Sidebar.Item>
              <Sidebar.Collapse icon={HiShoppingBag} label="E-commerce">
                <Sidebar.Item href="#">Products</Sidebar.Item>
                <Sidebar.Item href="#">Sales</Sidebar.Item>
                <Sidebar.Item href="#">Refunds</Sidebar.Item>
                <Sidebar.Item href="#">Shipping</Sidebar.Item>
              </Sidebar.Collapse>
              <Sidebar.Item href="#" icon={HiInbox}>
                Inbox
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiUser}>
                Users
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiShoppingBag}>
                Products
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiArrowSmRight}>
                Sign In
              </Sidebar.Item>
              <Sidebar.Item href="#" icon={HiTable}>
                Sign Up
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>
    </>
  );
};

export default SidebarUi;
