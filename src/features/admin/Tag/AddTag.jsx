import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';

import { addtag, tagData, updatetag } from '../../../app/Slice/tagSlice';
import tagApi, { } from "../../../api/tagApi"
export default function AddTag() {
    const { id } = useParams();

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    useEffect(() => {
        async function asyncFunc() {
            if (id) {
                reset(await tagApi.getOne(id).then(data => {
                    return data
                }));
            }
        }
        
        asyncFunc();
    }, [])

    const dispatch = useDispatch();
    const history = useHistory();
    const actionResult = async (page) => { await dispatch(tagData(page)) }

    const onhandleSubmit = (data) => {
        if (id) {
            dispatch(updatetag({ name: data.name, id: data.id }));
        } else {
            const action = addtag({ name: data.name, status: 0 });
            dispatch(action);
        }
        setTimeout(() => {
            actionResult({ page: localStorage.getItem("pageTag") || 1 });
        }, 700);
        history.push("/admin/tag");
    }
    return (
        <div id="admin">
            <div className="heading">
                <div className="heading__title">
                    <h3>{id ? "Sửa Tag" : "Thêm Tag"}</h3>
                </div>
                <div className="heading__hr"></div>
            </div>
            <div className="content">
                <form onSubmit={handleSubmit(onhandleSubmit)}>
                    <div className="form-group">
                        <label htmlFor="">Tên tag</label>
                        <input  {...register("name", { required: true })} className="form-control w-50" placeholder="" aria-describedby="helpId" />
                        {errors.name && <span className="text-danger">Bạn không được để trống!</span>}
                    </div>
                    <div className="text-center mtb">{id ? <input type="submit" value="Sửa" /> : <input type="submit" value="Thêm mới" />}</div>
                </form>
            </div>
        </div>
    )
}
