"use client";
import Image from "next/image";
import Link from "next/link";
import { MdDelete, MdEdit } from "react-icons/md";

const Product = (props) => {
  const { product, url, handleDelete, id } = props;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      {/* <div className=" flex flex-col justify-center items-center z-0"> */}
      <div
        className="  flex justify-center items-center relative  "
        style={{ padding: "5px" }}
      >
        {/* <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-80 relative overflow-hidden"> */}
        <div className="bg-white">
          <Link href={`/product/${id}/edit`}>
            <div className="w-full">
              {url ? (
                <img
                  src={url}
                  alt="Product"
                  width={"100%"}
                  // height={"180px"}
                  className="rounded-t-md "
                  style={{
                    width: "100%",
                    // height: "150px",
                    objectFit: "scale-down",
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                  }}
                />
              ) : (
                // <span>.</span>
                // <h1>hola</h1>
                // <h1>{product.photo[0].url}</h1>
                // <h1>sin imagen</h1>
                <img
                  src={
                    "https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg"
                  }
                  // width={200}
                  // height={200}
                  alt="Product"
                  className="rounded-md"
                />
              )}
            </div>
          </Link>

          {/* <div className="info-wrap">
            <Link href="#" className="title text-truncate">
              {product?.name}
            </Link>
            <div className="price mb-2">${product?.price}</div>
            <div className="absolute bottom-2">
              <Link
                href={`/product/${product?.id}/edit`}
                className="bg-green-500 mr-2 text-white px-4 py-2 rounded-md hover:bg-green-600 p-2 pb-3 col-span-6 md:col-span-3"
              >
                <i className="fas fa-pen">Edit</i>
              </Link>
              <button
                onClick={() => handleDelete(product.id, product.photo)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 p-2 pb-3 col-span-6 md:col-span-3"
              >
                <i className="fas fa-trash-alt">Delete</i>
              </button>
            </div>
          </div> */}
          <div className="p-2" style={{ backgroundColor: "" }}>
            <h5
              className="name"
              style={{ fontWeight: "bold", color: "#00789D" }}
            >
              {props.name}
            </h5>
            <div
              className=""
              // style={
              //   window.innerWidth > 767 ? { height: "50px" } : { height: "40px" }
              // }
            >
              {props.description ? (
                <p className="description">
                  {props.description.length > MAX_DESCRIPTION_LENGTH
                    ? props.description.substring(0, MAX_DESCRIPTION_LENGTH) +
                      "..."
                    : props.description}
                </p>
              ) : (
                <p className="description"> Sin Descripcion</p>
              )}
            </div>

            {props.offer ? (
              <div className="price d-flex gap-4 " style={{}}>
                <p style={{ color: "#3b83bd", fontWeight: "bold" }}>
                  {props.price - props.price * (props.discountPercentage / 100)}{" "}
                  USD{" "}
                </p>
                <p
                  style={{
                    textDecoration: "line-through",
                    fontSize: "16px",
                    color: "gray",
                  }}
                >
                  {" "}
                  {props.price} USD
                </p>
              </div>
            ) : (
              <p
                className="price"
                style={{ color: "#3b83bd", fontWeight: "bold" }}
              >
                {props.price} $
              </p>
            )}
            <div className="absolute top-2 right-3 flex justify-end ">
              <Link
                href={`/product/${id}/edit`}
                className="bg-green-500 mr-2 text-white  flex items-center justify-center px-3 py-3 lg:px-3 lg:py-2 rounded-md hover:bg-green-600 p-2 pb-3 col-span-6 md:col-span-3"
              >
                <MdEdit className="size-4 " />
              </Link>
              <button
                onClick={() => handleDelete(product.id, product.photo)}
                className="bg-red-400 text-white  px-3 py-3 lg:px-3 lg:py-2 rounded-md hover:bg-red-600 p-2 pb-3 col-span-6 md:col-span-3"
              >
                <MdDelete className="size-4 " />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
