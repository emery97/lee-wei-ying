import React from "react";
import "../styles/LandingPage.css";
const LandingPage = () => {
  return (
    <div className="input-group">
      <div className="form-outline w-50 .h-50" data-mdb-input-init>
        <input type="search" id="form1" className="form-control" />
        <button type="button" className="btn btn-primary">
          <i className="fas fa-search"></i>
          <label className="form-label" form="form1">
            Search
          </label>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
