import React, { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import amplifyconfig from "@/aws-exports";
import { generateClient } from "aws-amplify/api";
import { createCategories, updateCategories } from "@/graphql/mutations";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  getCategoria,
  getAllCategories,
  newCategory,
} from "@/utils/graphqlFunctions";
// import { createCategory } from "../../Redux/Actions/CategoryActions";
// import { useDispatch, useSelector } from "react-redux";
// import { CATEGORY_CREATE_RESET } from "../../Redux/Constants/CategoryConstants";
// import { toast } from "react-toastify";
// import Loading from "../LoadingError/Loading";
// import { listCategory } from "../../Redux/Actions/CategoryActions";

// const ToastObjects = {
//   pauseOnFocusLoss: false,
//   draggable: false,
//   pauseOnHover: false,
//   autoClose: 2000,
// };

const CreateCategory = ({ editID, setEditID }) => {
  // const dispatch = useDispatch();
  Amplify.configure(amplifyconfig);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [editItem, setEditItem] = useState("");
  const inputFileRef = React.useRef(null);

  const { data } = useQuery("AllCategories", getAllCategories);

  React.useEffect(() => {
    if (data) {
      const resFilter = data?.filter((item) => item.id === editID);

      setEditItem(resFilter[0]);
      console.log("Filtrado", resFilter);
    }
  }, [editID, data]);
  // if (editItem) {
  //   console.log(editItem);
  // }

  useEffect(() => {
    console.log(file);
  }, [setFile, file]);

  const client = generateClient();

  const queryClient = useQueryClient();
  React.useEffect(() => {
    if (editItem) {
      console.log(editItem);
      setCategoryName(editItem.categoryName);
      setDescription(editItem.description);
    }
  }, [editItem]);

  // New category React Query
  const {
    mutate,
    data: dataMutation,
    status: statusMutation,
  } = useMutation(newCategory, {
    onSuccess: () => {
      // router.push("/productos");

      queryClient.invalidateQueries("AllCategories");
    },
  });

  // const { data, status, error } = useQuery(
  //   [`GetCategory-${editID}`],
  //   () => getCategoria(editID),
  //   {
  //     enabled: !!editID,
  //     onSuccess: (data) => {
  //       console.log(data);
  //       setCategoryName(data.categoryName);
  //       setDescription(data.description);
  //       // setEditID("");
  //     },
  //   }
  // );

  const submitHandler = async (e) => {
    e.preventDefault();
    let photo = [];
    let responseImageUrl;
    let imagePublicId;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      photo.push({
        url: data.data.url,
        publicId: data.data.public_id,
      });
      // console.log("esta es la data public_id", data.data.secure_url);
      // console.log("esta es la data public_id", data);
      responseImageUrl = data.data.secure_url;
      imagePublicId = data.data.public_id;
      if (data) {
        mutate({
          categoryName,
          photo,
          description,
        });
      } else {
        console.log("no existe data");
      }
    }
    setFile(null);
    inputFileRef.current.value = "";

    setDescription(""), setCategoryName("");
  };

  const handleCategoryNameChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleDescripcionChange = (e) => {
    setDescription(e.target.value);
  };

  // const categoryCreate = useSelector((state) => state.categoryCreate);
  const categoryCreate = "hola";

  // useEffect(() => {
  //   if (categoryCreate.success) {
  //     toast.success("Category Added", ToastObjects);
  //     dispatch({ type: CATEGORY_CREATE_RESET }, listCategory());
  //     setCategoryName("");
  //     setDescripcion("");
  //     dispatch(listCategory());
  //   }
  // }, [categoryCreate.success, dispatch]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    let photo = [];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      photo.push({
        url: data.data.url,
        publicId: data.data.public_id,
      });

      try {
        const result = await client.graphql({
          query: updateCategories,
          variables: {
            input: {
              id: editItem.id,
              categoryName,
              photo,
              description,
            },
          },
        });

        //  let id =  (editItem.photo[0].publicId);
        try {
          const response = await fetch(`/api/delete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ publicId: [editItem.photo[0].publicId] }),
          });

          console.log("Imagen Borrada", response);
        } catch (error) {
          console.error("Error de red al eliminar la imagen desde page", error);
        }
      } catch (error) {
        console.log(error);
      }

      // if (data) {
      //   console.log("a ver que trae data", data.photo.publicId);
      //   try {
      //     const result = await client.graphql({
      //       query: updateCategories,
      //       variables: {
      //         input: {
      //           id: editItem.id,
      //           categoryName,
      //           photo,
      //           description,
      //         },
      //       },
      //     });
      // try {
      //   console.log("a ver que trae data", data.photo.publicId);
      //   // const response = await fetch(`/api/delete`, {
      //   //   method: "POST",
      //   //   headers: {
      //   //     "Content-Type": "application/json",
      //   //   },
      //   //   body: JSON.stringify({ publicId: [data.photo.publicId] }),
      //   // });
      // } catch (error) {
      //   console.error(
      //     "Error de red al eliminar la imagen desde page",
      //     error
      //   );
      // }
      //     // console.log(result);

      //     // setName(""), setPrice(""), console.log(res);
      //     // router.push("/productos");
      //   } catch (error) {
      //     console.log(error);
      //   }
      // }
    }

    const result = await client.graphql({
      query: updateCategories,
      variables: {
        input: {
          id: editID,
          categoryName,
          description,
        },
      },
    });
    console.log(result);

    queryClient.invalidateQueries("AllCategories");
    setCategoryName("");
    setDescription(" ");
    setEditID("");
    setFile(null);
    inputFileRef.current.value = "";
  };

  return (
    <div className="col-md-12 col-lg-4">
      <form onSubmit={editID ? handleUpdate : submitHandler}>
        <div className="mb-4">
          <label htmlFor="product_name" className="form-label">
            Name
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="form-control py-3"
            id="product_name"
            value={categoryName}
            onChange={handleCategoryNameChange}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Description</label>
          <textarea
            placeholder="Type here"
            className="form-control"
            rows="4"
            value={description}
            onChange={handleDescripcionChange}
          ></textarea>
        </div>
        <div className="mb-4">
          <input
            ref={inputFileRef}
            className=" bg-amber-300 rounded-md"
            multiple
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
        </div>

        <div className="d-grid">
          <button className="btn btn-primary py-3 ">
            {editItem ? "Update category" : "Create Category"}
          </button>
          {editItem && (
            <div className="mt-3 text-primary" style={{ textAlign: "center" }}>
              <button
                onClick={() => {
                  setEditID(null);
                }}
              >
                New Category
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateCategory;
