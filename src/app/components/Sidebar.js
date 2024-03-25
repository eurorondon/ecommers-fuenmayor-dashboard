"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="">
      <aside className="navbar-aside " id="offcanvas_aside">
        <div className="aside-top ">
          {/* <Link href={"/"} className="brand-wrap">
            <Image
              src="/images/logo.png"
              style={{ height: "46" }}
              className="logo"
              alt="Ecommerce dashboard template"
            />
          </Link> */}
          <div>
            <button className="btn btn-icon btn-aside-minimize">
              <i className="text-muted fas fa-stream"></i>
            </button>
          </div>
        </div>

        <nav>
          <ul className="menu-aside">
            <li className="menu-item">
              <Link
                className={pathname === "/" ? "active menu-link" : "menu-link"}
                href={"/"}
                exact="true"
              >
                <i className="icon fas fa-home"></i>
                <span className="text">Panel Admin</span>
              </Link>
            </li>

            <li className="menu-item">
              <Link
                className={
                  pathname === "/productos" ? "active menu-link" : "menu-link"
                }
                href="/productos"
              >
                <i className="icon fas fa-cart-plus"></i>
                <span className="text">Productos</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                className={
                  pathname === "/add-product" ? "active menu-link" : "menu-link"
                }
                href="/add-product"
              >
                <i className="icon fas fa-cart-plus"></i>
                <span className="text">Nuevo producto</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link
                className={
                  pathname === "/categorias" ? "active menu-link" : "menu-link"
                }
                href={"/categories"}
              >
                <i className="icon fas fa-list"></i>
                <span className="text">Categories</span>
              </Link>
            </li>

            <li className="menu-item">
              <Link className="menu-link" href={"/"}>
                <i className="icon fas fa-bags-shopping"></i>
                <span className="text">Ordenes</span>
              </Link>
            </li>
            <li className="menu-item">
              <Link className="menu-link " href={"/"}>
                <i className="icon fas fa-user"></i>
                <span className="text">Clientes</span>
              </Link>
            </li>
            {/* <li className="menu-item">
              <NavLink
                activeClassName="active"
                className="menu-link disabled"
                to="/sellers"
              >
                <i className="icon fas fa-store-alt"></i>
                <span className="text">Sellers</span>
              </NavLink>
            </li> */}

            {/* <li className="menu-item">
              <NavLink
                activeClassName="active"
                className="menu-link disabled"
                to="/transaction"
              >
                <i className="icon fas fa-usd-circle"></i>
                <span className="text">Transactions</span>
              </NavLink>
            </li> */}
          </ul>
          <br />
          <br />
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
