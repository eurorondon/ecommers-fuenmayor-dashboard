"use client";
import { Sidebar } from "flowbite-react";
import React, { useState } from "react";
import {
  HiChartPie,
  HiShoppingBag,
  HiInbox,
  HiUser,
  HiArrowSmRight,
  HiTable,
} from "react-icons/hi";
import FlowNavbar from "./components/FlowNavbar";
import { MdOutlineMenu } from "react-icons/md";
import DrawerMenu from "./components/DrawerMenu";

const MenuHamburguesa = () => {
  return (
    <div
      className="bg-white flex justify-center items-center"
      style={{ height: "90vh" }}
    >
      <h1 className="text-4xl font-extrabold">Bienvenido</h1>
    </div>
  );
};

export default MenuHamburguesa;
