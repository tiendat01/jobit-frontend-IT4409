import React from "react";
import { useRouteMatch } from "react-router-dom";
import Menu from "../Home/Menu/Menu";

export default function CheckMenu() {
  const { path } = useRouteMatch();
  console.log(path)
  const HidenMenu = () => {
    return <div></div>;
  };
  return <div>{ path === "/" ? <Menu /> : <HidenMenu />}</div>;
}
