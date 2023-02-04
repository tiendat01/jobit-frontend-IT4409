import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { addformCV, formCVData, updateformCV } from "../Slice/formCVSlice";
import formCVApi from "./../../../api/formCVApi";
import { tagData } from "../Slice/tagSlice";
import { Select, Spin } from "antd";
import { Option } from "antd/lib/mentions";
import { storage } from "../../../firebase";
import JoditEditor from "jodit-react";
import { checkArrayEquar } from "../../container/Functionjs";
import tagFormCVApi from "../../../api/tagFormCVApi";
export default function AddFormCV() {
  const { id } = useParams();
  const [content, setContent] = useState("");

  const [state, setState] = useState({
    load: false,
    linkImg: "",
    tenanh: "",
    img: "",
    anh: "",
    tagId: "",
    tag1: "",
  });
  const { linkImg, tenanh, img, anh, tagId, tag1 } = state;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const actiontag = async () => {
    await dispatch(tagData({ status: 1 }));
  };
  const getApi = async () => {
    return await formCVApi.getOne(id).then((data) => {
      return data;
    });
  };
  console.log();
  useEffect(async () => {
    actiontag();
    if (id) {
      Promise.all([getApi()]).then(function (data) {
        setContent(data[0].content);
        reset(data[0]);
        setState({
          ...state,
          anh: data[0].avatar,
          tagId: getTag(data[0].Tags),
          tag1: getTag(data[0].Tags),
        });
      });
    }
  }, []);
  const getTag = (e) => {
    let tag = [];
    for (let i = 0; i < e.length; i++) {
      tag.push(`${e[i].id}`);
    }
    return tag;
  };
  const onChangeTag = (e) => {
    setState({
      ...state,
      tagId: e,
    });
  };
  const tags = useSelector((state) => state.tags.tag.data);
  const loadingTag = useSelector((state) => state.tags.loading);
  const dispatch = useDispatch();
  const history = useHistory();
  const actionResult = async (page) => {
    await dispatch(formCVData(page));
  };

  const onhandleSubmit = async (data) => {
    const { tagId } = state;
    setState({
      ...state,
      load: true,
    });
    if (id) {
      if (img !== "") {
        await storage.ref(`imagesFormCV/${img.name}`).put(img);
        const anh = await storage
          .ref("imagesFormCV")
          .child(img.name)
          .getDownloadURL();
        if (tag1 === tagId) {
          dispatch(updateformCV({ avatar: anh, content: content, id: id }));
        } else {
          await tagFormCVApi.deletetagFormCV(id);
          var data = [];
          for (let i = 0; i < tagId.length; i++) {
            let tag = tagId[i];
            data.push({ formCVId: id, tagId: tag });
          }
          await tagFormCVApi.posttagFormCV(data);
          await dispatch(
            updateformCV({ avatar: anh, content: content, id: id }),
          );
        }
      } else {
        if (checkArrayEquar(tagId, tag1)) {
          dispatch(updateformCV({ content: content, id: id }));
        } else {
          await tagFormCVApi.deletetagFormCV(id);
          var data = [];
          for (let i = 0; i < tagId.length; i++) {
            let tag = tagId[i];
            data.push({ formCVId: id, tagId: tag });
          }
          console.log(data);
          await tagFormCVApi.posttagFormCV(data);
          await dispatch(updateformCV({ content: content, id: id }));
        }
      }
    } else {
      await storage.ref(`imagesFormCV/${img.name}`).put(img);
      const anh = await storage
        .ref("imagesFormCV")
        .child(img.name)
        .getDownloadURL();
      var tagFormCV = [];
      for (let i = 0; i < tagId.length; i++) {
        tagFormCV.push({ tagId: tagId[i] });
      }
      dispatch(
        addformCV({
          content: content,
          avatar: anh,
          status: 0,
          tagform: tagFormCV,
        }),
      );
    }
    setTimeout(() => {
      actionResult({ page: localStorage.getItem("pageFormCV") || 1 });
    }, 700);
    history.push("/admin/formCV");
  };
  const hangdelimage = (e) => {
    setState({
      ...state,
      linkImg: URL.createObjectURL(e.target.files[0]),
      tenanh: e.target.files[0].name,
      img: e.target.files[0],
    });
  };
  const data = [];

  if (!loadingTag) {
    tags.rows.map((ok) => {
      data.push(<Option key={ok.id}>{ok.name}</Option>);
    });
  }
  return (
    <div id="admin">
      <div className="heading">
        <div className="heading__title">
          <h3>{id ? "Sửa Form CV" : "Thêm Form CV"}</h3>
        </div>
        <div className="heading__hr"></div>
      </div>
      <div className="content">
        <form onSubmit={handleSubmit(onhandleSubmit)}>
          <div className="mt-3">
            <label htmlFor="">Ảnh đại diện</label>
            <label htmlFor="img">
              <div className="btn_camera">
                <i className="fas fa-camera-retro"></i>
              </div>
            </label>
            <input
              type="file"
              hidden
              name=""
              id="img"
              onChange={hangdelimage}
            />
            {linkImg ? (
              <img
                src={linkImg}
                className="ml-3"
                height="150px"
                width="250px"
                alt=""
              />
            ) : anh ? (
              <img
                src={anh}
                className="ml-5"
                height="150px"
                width="250px"
                alt=""
              />
            ) : (
              ""
            )}
            <br />
            {tenanh ? (
              <span>
                <span className="text-danger">Tên ảnh</span>: {tenanh}
              </span>
            ) : (
              ""
            )}
          </div>
          <div className="form-group">
            <label htmlFor="">Tags liên quan</label>
            <br />
            {loadingTag ? (
              <div className="spin">
                <Spin className="mt-5" />
              </div>
            ) : (
              <Select
                value={tagId ? tagId : []}
                mode="tags"
                onChange={onChangeTag}
                className="w-50 ml-4"
                placeholder="Tags Mode"
              >
                {data}
              </Select>
            )}
          </div>
          <div className="mt-3">
            <label htmlFor="">Nội dung</label>
            <JoditEditor
              value={content}
              tabIndex={1}
              onChange={(e) => setContent(e)}
            />
          </div>
          <div className="text-center mtb">
            {id ? (
              <input type="submit" value="Sửa" />
            ) : (
              <input type="submit" value="Thêm mới" />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
