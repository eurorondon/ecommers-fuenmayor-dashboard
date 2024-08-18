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
import Productos from "./productos/page";

const MenuHamburguesa = () => {
  return <Productos />;
};

export default MenuHamburguesa;
