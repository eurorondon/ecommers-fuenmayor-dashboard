"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  return (
    <div className="flex-row h-screen flex justify-center items-center">
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          console.log(data);
        }}
      >
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        <button className="bg-slate-100 text-black px-4 py-2">Send</button>
      </form>
    </div>
  );
}
