import React, { useEffect, useState } from "react";
import { Button, Image, Pagination, Popconfirm, Spin, Table } from "antd";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { removeformCV, formCVData, updateformCV } from "../Slice/formCVSlice";
export default function FormCv() {
  const columns = [
    {
      title: "avatar",
      dataIndex: "avatar",
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  const match = useRouteMatch();
  const formCV = useSelector((state) => state.formCVs.formCV.data);
  const loading = useSelector((state) => state.formCVs.loading);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    page: localStorage.getItem("pageFormCV") || 1,
  });
  const { page } = state;
  const actionResult = async (page) => {
    await dispatch(formCVData(page));
  };
  useEffect(() => {
    localStorage.setItem("pageFormCV", page);
    actionResult({ page: page });
  }, [page]);
  const history = useHistory();
  const handleStatus = (e, id) => {
    if (e === 1) {
      dispatch(updateformCV({ status: 0, id: id }));
    } else {
      dispatch(updateformCV({ status: 1, id: id }));
    }
    setTimeout(() => {
      actionResult({ page: page });
    }, 500);
  };
  const onChangePage = (page) => {
    setState({
      page: page,
      pageCurent: page,
    });
  };
  const hangdleEdit = (id) => {
    history.replace(`${match.url}/editFormCV/${id}`);
  };
  const hangdleDelete = (e) => {
    dispatch(removeformCV(e));
    setTimeout(() => {
      actionResult({ page: page });
    }, 500);
  };
  return (
    <div id="admin">
      <div className="heading">
        <div className="heading__title">
          <h3>Mẫu CV</h3>
        </div>
        <div className="heading__hr"></div>
      </div>
      <div className="content">
        <div className="add">
          <Link to={`${match.url}/addFormCV`}>
            <Button variant="outlined" color="secondary">
              <i className="fas fa-plus"></i>&nbsp;&nbsp; Thêm mới
            </Button>
          </Link>
        </div>
        {loading ? (
          <div className="spin">
            <Spin className="mt-5" />
          </div>
        ) : (
          <div>
            <Table
              columns={columns}
              pagination={false}
              dataSource={formCV.rows.map((ok, index) => ({
                key: index + 1,
                avatar: <Image src={ok.avatar} width="200px" />,
                status: (
                  <div className="action">
                    {ok.status === 1 ? (
                      <Link
                        to="#"
                        onClick={() => {
                          handleStatus(ok.status, ok.id);
                        }}
                      >
                        <i className="far fa-thumbs-up "></i>
                      </Link>
                    ) : (
                      <Link
                        to="#"
                        onClick={() => handleStatus(ok.status, ok.id)}
                      >
                        <i className="far fa-thumbs-down "></i>
                      </Link>
                    )}
                  </div>
                ),
                action: (
                  <div className="action">
                    <Popconfirm
                      title="Bạn có muốn sửa？"
                      onConfirm={() => {
                        hangdleEdit(ok.id);
                      }}
                      icon={
                        <QuestionCircleOutlined style={{ color: "green" }} />
                      }
                    >
                      <Link to="#">
                        <i className="far fa-edit mr-4"></i>
                      </Link>
                    </Popconfirm>
                    <Popconfirm
                      title="Bạn có muốn xoá？"
                      onConfirm={() => {
                        hangdleDelete(ok.id);
                      }}
                      icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                    >
                      <Link to="#">
                        <i className="far fa-trash-alt"></i>
                      </Link>
                    </Popconfirm>
                  </div>
                ),
              }))}
            />
            <Pagination
              defaultCurrent={page}
              onChange={onChangePage}
              total={formCV.count}
            />
          </div>
        )}
      </div>
    </div>
  );
}
