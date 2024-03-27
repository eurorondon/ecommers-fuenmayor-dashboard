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
    }
  }, [editID, data]);
  if (editItem) {
    console.log(editItem);
  }

  useEffect(() => {
    console.log(file);
  }, [setFile, file]);

  const client = generateClient();

  const queryClient = useQueryClient();
  React.useEffect(() => {
    if (editItem) {
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
      // console.log("esta es la data public_id", data.data.secure_url);
      // console.log("esta es la data public_id", data);
      responseImageUrl = data.data.secure_url;
      imagePublicId = data.data.public_id;
      if (data) {
        mutate({
          categoryName,
          imgUrl: data.data.secure_url,
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

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data) {
        try {
          const result = await client.graphql({
            query: updateCategories,
            variables: {
              input: {
                id: editItem.id,
                categoryName,
                imgUrl: data.data.secure_url,
                description,
              },
            },
          });
          console.log(result);

          // setName(""), setPrice(""), console.log(res);
          router.push("/productos");
        } catch (error) {
          console.log(error);
        }
      }
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
