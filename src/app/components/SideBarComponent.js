import { Sidebar } from "flowbite-react";
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
          <Sidebar.Item href="/" icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="/productos" icon={HiShoppingBag}>
            Productos
          </Sidebar.Item>
          <Sidebar.Item href="/add-product" icon={HiUser}>
            Nuevo Producto
          </Sidebar.Item>
          <Sidebar.Collapse icon={HiShoppingBag} label="Categorias">
            <Sidebar.Item href="#">Products</Sidebar.Item>
            <Sidebar.Item href="#">Sales</Sidebar.Item>
            <Sidebar.Item href="#">Refunds</Sidebar.Item>
            <Sidebar.Item href="#">Shipping</Sidebar.Item>
          </Sidebar.Collapse>
          <Sidebar.Item href="/categories" icon={HiInbox}>
            Nueva Categoria
          </Sidebar.Item>
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
