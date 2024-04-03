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
    <>
      <DrawerMenu />
      <h1>hola</h1>
    </>
  );
};

export default MenuHamburguesa;
