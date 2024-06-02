// "use client";
// import { Navbar } from "flowbite-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// import React from "react";
// import { useQueryClient } from "react-query";

// function FlowNavbar() {
//   const queryClient = useQueryClient();
//   const [searchInput, setSearchInput] = React.useState("");
//   const router = useRouter();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     router.push(`/keyword?search=${searchInput}`);
//     setSearchInput("");
//   };
//   return (
//     <div className=" bg-white  ">
//       <div className="flex flex-row items-center">
//         <div className=" basis-3/12 ps-5 flex items-center p-2">
//           <Image
//             src={"/images/logo.jpg"}
//             width={50}
//             height={50}
//             alt="Multitienda"
//             className="rounded-full"
//           />
//           <span className="text-center ms-5 font-bold">
//             Multitienda Rubio <br /> Fuenmayor
//           </span>
//         </div>

//         <div className="bg-blue-300 basis-7/12 ">
//           <form className="input-group " onSubmit={(e) => handleSubmit(e)}>
//             <input
//               type="search"
//               value={searchInput}
//               className="form-control rounded-left search w-11/12 "
//               placeholder="Buscar..."
//               onChange={(e) => setSearchInput(e.target.value)}
//             />
//             <button type="submit" className="search-button w-1/12">
//               search
//             </button>
//           </form>
//         </div>
//         <div className="basis-2/12 bg-green-400"></div>
//       </div>
//     </div>
//   );
// }

// export default FlowNavbar;

import React from "react";

const FlowNavbar = () => {
  return <div>FlowNavbar</div>;
};

export default FlowNavbar;
