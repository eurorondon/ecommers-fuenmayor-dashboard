"use client";

import React, { useEffect } from "react";
import CreateCategory from "./CreateCategory";
import CategoriesTable from "./CategoriesTable";

const MainCategories = () => {
  const [editID, setEditID] = React.useState("");
  console.log(editID);
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
            <CreateCategory editID={editID} setEditID={setEditID} />

            <CategoriesTable setEditID={setEditID} />
          </div>
          {/* <h1 className="text-danger">{loading}</h1> */}
        </div>
      </div>
      )
    </section>
  );
};

export default MainCategories;
