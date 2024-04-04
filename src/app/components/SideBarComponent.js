import { Sidebar } from "flowbite-react";
import Link from "next/link";
import React from "react";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
} from "react-icons/hi";
import { MdOutlineMenu } from "react-icons/md";

function SideBarComponent({ toggleMenu }) {
  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      className="w-full "
    >
      <div className=" lg:hidden   flex justify-end">
        <button
          className="border bg-white border-l-2 rounded-md p-1 "
          onClick={toggleMenu}
        >
          <MdOutlineMenu size={30} />
        </button>
      </div>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link href={"/"} onClick={toggleMenu}>
            <Sidebar.Item icon={HiChartPie}>Dashboard</Sidebar.Item>
          </Link>
          <Link href={"/productos"} onClick={toggleMenu}>
            <Sidebar.Item icon={HiShoppingBag}>Productos</Sidebar.Item>
          </Link>
          <Link href="/add-product" onClick={toggleMenu}>
            <Sidebar.Item icon={HiUser}>Nuevo Producto</Sidebar.Item>
          </Link>
          <Link href="/categorias" onClick={toggleMenu}>
            <Sidebar.Item icon={HiShoppingBag}>Categorias</Sidebar.Item>
          </Link>

          <Link href="/categories" onClick={toggleMenu}>
            <Sidebar.Item icon={HiInbox}>Nueva Categoria</Sidebar.Item>
          </Link>

          {/* <Sidebar.Item href="#" icon={HiUser}>
            Nuevo Producto
          </Sidebar.Item> */}

          {/* <Sidebar.Item href="#" icon={HiArrowSmRight}>
            Sign In
          </Sidebar.Item> */}
          {/* <Sidebar.Item href="#" icon={HiTable}>
            Sign Up
          </Sidebar.Item> */}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default SideBarComponent;

{
  /* <Sidebar.Collapse icon={HiShoppingBag} label="Categorias">
            <Sidebar.Item href="#">Products</Sidebar.Item>
            <Sidebar.Item href="#">Sales</Sidebar.Item>
            <Sidebar.Item href="#">Refunds</Sidebar.Item>
            <Sidebar.Item href="#">Shipping</Sidebar.Item>
            <Sidebar.Item href="#">Products</Sidebar.Item>
            <Sidebar.Item href="#">Sales</Sidebar.Item>
            <Sidebar.Item href="#">Refunds</Sidebar.Item>
            <Sidebar.Item href="#">Shipping</Sidebar.Item>
            <Sidebar.Item href="#">Products</Sidebar.Item>
            <Sidebar.Item href="#">Sales</Sidebar.Item>
            <Sidebar.Item href="#">Refunds</Sidebar.Item>
            <Sidebar.Item href="#">Shipping</Sidebar.Item>
          </Sidebar.Collapse> */
}
