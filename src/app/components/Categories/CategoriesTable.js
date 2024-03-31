import React, { useEffect } from "react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import amplifyconfig from "@/aws-exports";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
// import "bootstrap/dist/css/bootstrap.min.css";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { deleteCategory, getAllCategories } from "@/utils/graphqlFunctions";
import Link from "next/link";
import Image from "next/image";

Amplify.configure(amplifyconfig);

const CategoriesTable = ({ setEditID }) => {
  const { data } = useQuery("AllCategories", getAllCategories);
  const queryClient = useQueryClient();

  console.log(data);

  //DELETE PRODUCT WITH REACT QUERY
  const { mutate } = useMutation(deleteCategory, {
    onSuccess: () => {
      queryClient.invalidateQueries("AllCategories");
    },
  });

  const deletehandler = async (id) => {
    const filter = data.filter((item) => item.id === id);
    if (filter) {
      console.log(filter?.id);
      const publicId = filter[0].photo[0].publicId;
    }
    if (window.confirm("¿Eliminar Categoria?")) {
      try {
        console.log(filter[0].photo.publicId);
        const response = await fetch(`/api/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ publicId: [filter[0].photo[0].publicId] }),
        });

        console.log("Imagen Borrada", response);
      } catch (error) {
        console.error("Error de red al eliminar la imagen desde page", error);
      }
      mutate(id);
    }
  };

  const edithandler = (id) => {
    setEditID(id);
    // queryClient.invalidateQueries("GetCategory");
  };

  return (
    <div className="col-md-12 col-lg-8 " style={{ color: "black" }}>
      <table className="table ">
        <thead className="">
          <tr>
            <th></th>
            <th>Imagen</th>
            <th>Name</th>
            <th>Description</th>
            <th className="text-end">Action</th>
          </tr>
        </thead>
        {/* Table Data */}
        <tbody>
          {data?.map((category) => (
            <tr key={category.id}>
              <td>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                  />
                </div>
              </td>

              <td>
                <Image
                  src={
                    category &&
                    category.photo &&
                    category.photo[0] &&
                    category.photo[0].url
                      ? category.photo[0].url
                      : "https://img.freepik.com/vector-premium/vector-icono-imagen-predeterminado-pagina-imagen-faltante-diseno-sitio-web-o-aplicacion-movil-no-hay-foto-disponible_87543-11093.jpg"
                  }
                  alt="img"
                  width={120}
                  height={120}
                />
              </td>

              <td>
                <b>{category.categoryName}</b>
              </td>
              <td>{category.description}</td>
              <td className=" ">
                <div className="flex justify-content-end gap-2">
                  <div className=" ">
                    <button
                      onClick={() => deletehandler(category.id)}
                      className="btn btn-danger "
                    >
                      <MdDelete size={24} />
                    </button>
                  </div>
                  <div className="">
                    <button
                      onClick={() => edithandler(category.id)}
                      className="btn btn-success "
                    >
                      <FaEdit size={24} />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesTable;
