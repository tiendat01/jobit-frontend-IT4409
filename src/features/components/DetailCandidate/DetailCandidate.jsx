import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import userApi from "../../../api/userApi";
import Breadcrumb from "./Breadcrumb/Breadcrumb";
import Footer from "../Home/Footer/Footer";
import BannerCandidate from "./BannerCandidate/BannerCandidate";
import CandidateContent from "./CandidateContent/CandidateContent";
import SpinLoad from "../Spin/Spin";

export default function DetailCandidate() {
  const { id } = useParams();
  const [data, setData] = useState();
  const getApi = async () => {
    return await userApi.getOne(id).then((data) => {
      setData(data);
    });
  };
  useEffect(() => {
    getApi();
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      {/* <Menu /> */}
      {data ? (
        <div>
          <Breadcrumb name={data.name} />
          <BannerCandidate
            avatar={data.avatar}
            banner={data.banner}
            name={data.name}
            address={data.address}
          />
          <CandidateContent data={data} />
        </div>
      ) : (
        <SpinLoad />
      )}
      <Footer />
    </div>
  );
}
