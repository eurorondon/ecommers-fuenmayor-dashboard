"use client";

import React, { useEffect } from "react";
import CreateCategory from "./CreateCategory";
import CategoriesTable from "./CategoriesTable";
// import { useDispatch, useSelector } from "react-redux";
// import { listCategory } from "../../Redux/Actions/CategoryActions";
// import {
//   CATEGORY_CREATE_RESET,
//   CATEGORY_CREATE_SUCCESS,
// } from "../../Redux/Constants/CategoryConstants";

const MainCategories = () => {
  // const dispatch = useDispatch();

  // const categoriesList = useSelector((state) => state.categorylist);
  // const { categories, loading } = categoriesList;

  // useEffect(() => {
  //   dispatch(listCategory());
  // }, [dispatch]);

  return (
    <section className="content-main">
      <div className="content-header">
        <h2 className="content-title"></h2>
      </div>
      {/* {loading ? (
        <h1 className="text-danger">Cargando</h1>
      ) :  */}
      (
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row">
            {/* Create category */}
            <CreateCategory />
            {/* Categories table */}
            {/* <CategoriesTable categories={categories} /> */}
          </div>
          {/* <h1 className="text-danger">{loading}</h1> */}
        </div>
      </div>
      )
    </section>
  );
};

export default MainCategories;
