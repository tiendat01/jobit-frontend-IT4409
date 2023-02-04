import React from 'react'
import { Link } from 'react-router-dom';
import "../../../scss/Breadcrumb.scss"
export default function Breadcrumbs({ name }) {

    return (
        <div className="breadcrumb">
            <div className="container">
                <Link to="/">Trang chủ</Link>
                <span className="fa fa-angle-double-right"></span>
                <Link to="/companys">Công ty</Link>
                <span className="fa fa-angle-double-right"></span>
                <span className="active">{name}</span>
            </div>
        </div>
    )
}
