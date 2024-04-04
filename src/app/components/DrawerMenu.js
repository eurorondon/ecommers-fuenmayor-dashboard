"use client";
import { Sidebar } from "flowbite-react";
import React, { useState } from "react";
import {
  HiArrowSmRight,
  HiInbox,
  HiOutlineChartPie,
  HiOutlineShoppingBag,
  HiShoppingBag,
  HiTable,
  HiUser,
} from "react-icons/hi";
import { MdOutlineMenu } from "react-icons/md";
import SideBarComponent from "./SideBarComponent";

function DrawerMenu() {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const toggleMenu = () => {
    setMostrarMenu(!mostrarMenu);
  };

  return (
    <div className="sticky top-0 z-10 lg:hidden ">
      {/* <FlowNavbar /> */}
      <div className=" bg-white flex justify-between items-center py-2 px-3 my-0">
        <button
          className="border bg-white border-l-2 rounded-md p-1 "
          onClick={toggleMenu}
        >
          <MdOutlineMenu size={30} />
        </button>

        <h1>Adios </h1>

        <div
          className={` absolute
           top-0 left-0 ${
             mostrarMenu ? "translate-x-0" : "-translate-x-full"
           } transition-transform duration-300 z-10`}
        >
          <div className="h-screen z-50 ">
            <SideBarComponent toggleMenu={toggleMenu} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrawerMenu;
