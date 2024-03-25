import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { deleteCategory } from "../../Redux/Actions/CategoryActions";
// import { listCategory } from "../../Redux/Actions/CategoryActions";

const CategoriesTable = ({ categories }) => {
  const dispatch = useDispatch();
  const categoryDelete = useSelector((state) => state.categoryDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = categoryDelete;

  const deletehandler = (id) => {
    if (window.confirm("Are you sure??")) {
      dispatch(deleteCategory(id));
    }
  };

  // useEffect(() => {
  //   if (successDelete) {
  //     dispatch(listCategory());
  //   }
  // }, [successDelete]);
  return (
    <div className="col-md-12 col-lg-8">
      <table className="table">
        <thead>
          <tr>
            <th>
              <div className="form-check">
                <input className="form-check-input" type="checkbox" value="" />
              </div>
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th className="text-end">Action</th>
          </tr>
        </thead>
        {/* Table Data */}
        <tbody>
          {categories?.map((category) => (
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
              <td>{category._id}</td>
              <td>
                <b>{category.categoria}</b>
              </td>
              <td>{category.description}</td>
              <td className="text-end">
                <div className="dropdown">
                  <Link
                    to="#"
                    data-bs-toggle="dropdown"
                    className="btn btn-light"
                  >
                    <i className="fas fa-ellipsis-h"></i>
                  </Link>
                  <div className="dropdown-menu">
                    <Link className="dropdown-item" to="#">
                      Edit info
                    </Link>
                    <Link
                      className="dropdown-item text-danger"
                      to="#"
                      onClick={() => deletehandler(category._id)}
                    >
                      Delete
                    </Link>
                    {/* <Link
                      to="#"
                      onClick={() => deletehandler(product._id)}
                      className="btn btn-sm btn-outline-danger p-2 pb-3 col-md-6"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </Link> */}
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
