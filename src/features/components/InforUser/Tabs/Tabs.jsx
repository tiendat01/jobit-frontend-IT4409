import React from 'react'
import { Tabs } from 'antd';
// import Jobs from "./Jobs/Jobs"
// import AddJob from './AddJob/AddJob';
import UserApply from './UserApply/UserApply';
import Infor from "./Infor/Infor"
import WorkSave from './WorkSave/WorkSave';
import ChangePassword from './ChangePassword/ChangePassword';
export default function Tab({ id }) {
    const { TabPane } = Tabs;
    return (
        <div className="container mt-2">
            <Tabs defaultActiveKey="1" tabPosition="left">
                {/* <TabPane tab="Các công việc đã tạo" key="1">
                    <Jobs />
                </TabPane> */}
                <TabPane tab="Công việc đã lưu" key="2">
                    <WorkSave id={id} />
                </TabPane>
                <TabPane tab="Công việc đã ứng tuyển" key="3">
                    <UserApply id={id} />
                </TabPane>
                <TabPane tab="Thông tin cá nhân" key="1">
                    <Infor id={id} />
                </TabPane>
                <TabPane tab="Đổi mật khẩu" key="5">
                    <ChangePassword id={id} />
                </TabPane>
            </Tabs>
        </div>
    )
}
