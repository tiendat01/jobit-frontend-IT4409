import React from "react";
import Footer from "../Home/Footer/Footer";
import Breadcrumb from "./Breadcrumb/Breadcrumb";
import Companys from "./Companys/Companys";

export default function Company() {
  return (
    <div>
      <Breadcrumb />
      <Companys />
      <Footer />
    </div>
  );
}
