import React from "react";
import Footer from "../Home/Footer/Footer";
import Breadcrumb from "./Breadcrumb/Breadcrumb";
import ListCandidates from "./ListCandidates/ListCandidates";

export default function Candidates() {
  return (
    <div>
      <Breadcrumb />
      <ListCandidates />
      <Footer />
    </div>
  );
}
