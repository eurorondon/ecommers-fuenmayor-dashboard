import { CircularProgress } from "@mui/material";
import React from "react";

export default function Loader() {
  return (
    <div style={styles.container}>
      <CircularProgress />
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "90vh",
    backgroundColor: "#fff",
  },
};
