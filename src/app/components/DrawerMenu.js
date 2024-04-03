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

function DrawerMenu() {
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const toggleMenu = () => {
    setMostrarMenu(!mostrarMenu);
  };

  return (
    <div className="sticky top-0 z-10 lg:hidden ">
      {/* <FlowNavbar /> */}
      <div className=" bg-slate-200 flex justify-between items-center py-2 px-3 my-0">
        <button
          className="border bg-white border-l-2 rounded-md p-1 "
          onClick={toggleMenu}
        >
          <MdOutlineMenu size={30} />
        </button>

        <h1>Adios </h1>

        <div
          className={` absolute
           top-12 left-0 ${
             mostrarMenu ? "translate-x-0" : "-translate-x-full"
           } transition-transform duration-300 z-10`}
        >
          <div className="h-screen z-50 ">
            <Sidebar aria-label="Sidebar with multi-level dropdown example">
              <Sidebar.Items>
                <Sidebar.ItemGroup>
                  <Sidebar.Item href="#" icon={HiOutlineChartPie}>
                    Dashboard
                  </Sidebar.Item>
                  <Sidebar.Collapse
                    icon={HiOutlineShoppingBag}
                    label="E-commerce"
                  >
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
        </div>
      </div>
    </div>
  );
}

export default DrawerMenu;
