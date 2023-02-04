import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import companyApi from "../../../api/companyApi";

import Footer from "../Home/Footer/Footer";
import Spin from "../Spin/Spin";
import BannerCompany from "./BannerCompany/BannerCompany";
import Breadcrumb from "./Breadcrumb/Breadcrumb";
import ContentCompany from "./ContentCompany/ContentCompany";

export default function DetailCompany() {
  const { id } = useParams();
  const [data, setData] = useState();
  const getApi = async () => {
    return await companyApi.getOne(id).then((data) => {
      setData(data);
    });
  };
  useEffect(() => {
    getApi();
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      {data ? (
        <div>
          <Breadcrumb name={data.name} />
          <BannerCompany
            avatar={data.avatar}
            banner={data.banner}
            name={data.name}
            address={data.address}
          />
          <ContentCompany data={data} />
        </div>
      ) : (
        <Spin />
      )}
      <Footer />
    </div>
  );
}
