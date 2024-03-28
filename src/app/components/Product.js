"use client";
import Image from "next/image";
import Link from "next/link";

const Product = (props) => {
  const { product, handleDelete } = props;

  return (
    <>
      <div className=" flex flex-col justify-center items-center">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm h-80 relative overflow-hidden">
          <Link href={`/`}>
            <div className="img-wrap">
              {product &&
              product.photo &&
              product.photo[0] &&
              product.photo[0].url ? (
                <Image
                  src={product.photo[0].url}
                  alt="Product"
                  width={200}
                  height={200}
                  className="rounded-md "
                />
              ) : (
                // <span>.</span>
                // <h1>hola</h1>
                // <h1>{product.photo[0].url}</h1>
                // <h1>sin imagen</h1>
                <Image
                  src={
                    "https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg"
                  }
                  width={200}
                  height={200}
                  alt="Product"
                  className="rounded-md"
                />
              )}
            </div>
          </Link>
          <div className="info-wrap">
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
                onClick={() =>
                  handleDelete(product.id, product.photo[0].publicId)
                }
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 p-2 pb-3 col-span-6 md:col-span-3"
              >
                <i className="fas fa-trash-alt">Delete</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
