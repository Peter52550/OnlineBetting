import React from "react";

// components
import Loader from "react-loader-spinner";

export default function Loadng() {
  return (
    <div style={{ marginLeft: 560, marginTop: 190 }}>
      <Loader
        type="Puff"
        color="#00BFFF"
        height={300}
        width={300}
        timeout={3000} //3 secs
      />
    </div>
  );
}
