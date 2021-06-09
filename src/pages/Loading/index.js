import Loader from "react-loader-spinner";
import React from "react";
export default class Loadng extends React.Component {
  //other logic
  render() {
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
}
