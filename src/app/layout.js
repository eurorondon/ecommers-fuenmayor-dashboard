import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "./components/providers/ReactQueryProvider";
import Product from "./components/Product";
import SidebarUi from "./components/Sidebar";
import FlowNavbar from "./components/FlowNavbar";
import DrawerMenu from "./components/DrawerMenu";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        <ReactQueryProvider>
          <div className="lg:hidden sticky top-0 z-20">
            <DrawerMenu />
          </div>
          <div className="hidden lg:block sticky top-0 z-10">
            <FlowNavbar />
          </div>
          <div className=" lg:flex lg:flex-row ">
            <ToastContainer autoClose={2500} />
            {/* <div className="  "> */}
            {/* <div className="w-1/6"> */}
            <div className="lg:basis-2/12  ">
              <div className=" h-full hidden lg:block   ">
                <SidebarUi />
              </div>
            </div>

            <div className="basis-11/12">
              {/* Contenido del otro componente */}
              {children}
            </div>
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
