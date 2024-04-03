"use client";
import { Navbar } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function FlowNavbar() {
  return (
    <div>
      <Navbar fluid rounded>
        <Navbar.Brand as={Link} href="/">
          <Image
            width={40}
            height={400}
            src="/images/logo.jpg"
            className=" rounded-full"
            alt="Fuenmayor"
          />
          <span className=" ms-5  font-bold self-center whitespace-nowrap text-xl  dark:text-white">
            Multi Tienda Rubio Fuenmayor
          </span>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Link href="#" active>
            Home
          </Navbar.Link>
          <Navbar.Link as={Link} href="#">
            About
          </Navbar.Link>
          <Navbar.Link href="#">Services</Navbar.Link>
          <Navbar.Link href="#">Pricing</Navbar.Link>
          <Navbar.Link href="#">Contact</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default FlowNavbar;
