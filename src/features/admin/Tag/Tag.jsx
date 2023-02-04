import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Pagination, Popconfirm, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useRouteMatch } from "react-router-dom";

import { removetag, tagData, updatetag } from "../../../app/Slice/tagSlice";
export default function Tag() {
  const columns = [
    {
      title: "Tên tag",
      dataIndex: "name",
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
  const tag = useSelector((state) => state.tags.tag.data);
  const loading = useSelector((state) => state.tags.loading);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    page: localStorage.getItem("pageTag") || 1,
  });
  const { page } = state;
  const actionResult = async (page) => {
    await dispatch(tagData(page));
  };
  useEffect(() => {
    localStorage.setItem("pageTag", page);
    actionResult({ page: page });
  }, [page]);
  const history = useHistory();
  const handleStatus = (e, id) => {
    if (e === 1) {
      dispatch(updatetag({ status: 0, id: id }));
    } else {
      dispatch(updatetag({ status: 1, id: id }));
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
    history.replace(`${match.url}/editTag/${id}`);
  };
  const hangdleDelete = (e) => {
    dispatch(removetag(e));
    setTimeout(() => {
      actionResult({ page: page });
    }, 500);
  };
  return (
    <div id="admin">
      <div className="heading">
        <div className="heading__title">
          <h3>Tag</h3>
        </div>
        <div className="heading__hr"></div>
      </div>
      <div className="content">
        <div className="add">
          <Link to={`${match.url}/addTag`}>
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
              dataSource={tag.rows.map((ok, index) => ({
                key: index + 1,
                name: ok.name,
                status: (
                  <div className="action">
                    {ok.status === 1 ? (
                      <Link
                        onClick={() => {
                          handleStatus(ok.status, ok.id);
                        }}
                        to="#"
                      >
                        <i className="far fa-thumbs-up "></i>
                      </Link>
                    ) : (
                      <Link
                        onClick={() => handleStatus(ok.status, ok.id)}
                        to="#"
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
              total={tag.count}
            />
          </div>
        )}
      </div>
    </div>
  );
}
