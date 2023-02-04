import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Switch, useRouteMatch } from 'react-router-dom'

import { checkBar } from './features/utils/Functionjs'

import CheckMenu from './features/components/CheckMenu/CheckMenu'
import Login from './features/components/Login/Login'
import LoginAdmin from './features/components/Login/LoginAdmin'
import Register from './features/components/Register/Register'
import Home from './features/components/Home/Home'
import InforCompany from './features/components/InforCompany/InforCompany'
import InforUser from './features/components/InforUser/InforUser'
import Candidates from './features/components/Candidates/Candidates'
import DetailCandidate from './features/components/DetailCandidate/DetailCandidate'
import Company from './features/components/Companies/Companies'
import DetailCompany from './features/components/DetailCompany/DetailCompany'
import Jobs from './features/components/Jobs/Jobs'
import DetailJob from './features/components/DetailJob/DetailJob'

import Chat from './features/components/Chat/Chat'

// admin
import Admin from './features/admin/Admin'
import checkLoginApi from './api/checkLoginApi'

import Empty from './features/components/Empty/Empty'

import './App.scss'
import 'antd/dist/antd.css'
import VideoCall from './features/components/VideoCall/VideoCall'

function Ladmin() {
  let { path, url } = useRouteMatch();

  return <Admin path={path} url={url} />;
}

function App() {
  useEffect(() => {
    checkBar()
  }, [])

  const [isLoad, setIsLoad] = useState(true)

  const handleLogin = () => {
    setIsLoad(!isLoad)
  }

  const [checkAdmin, setCheckAdmin] = useState();
  useEffect(() => {
      checkLoginApi.checkLogin().then((ok) => {
          let user = ok.data.user.role;
          if (user === "admin" || user === "grant") {
              setCheckAdmin(
                  <Route path="/admin">
                      <Ladmin />
                  </Route>,
              );
          } else {
              setCheckAdmin(
                  <Route path="/admin">
                      <Empty />
                  </Route>,
              );
          }
      });
  }, [isLoad]);

  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route
            path={[
              '/admin',
              '/loginAdmin',
              '/checkAdmin',
              '/register',
              '/login',
              '/', // '/' always at last
            ]}
          >
            <CheckMenu />
          </Route>
        </Switch>

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>

          { checkAdmin }

          <Route exact path="/login">
            <Login onLogin={handleLogin} />
          </Route>
          <Route exact path="/loginAdmin">
            <LoginAdmin onLogin={handleLogin} />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>

          <Route exact path="/jobs">
            <Jobs />
          </Route>
          <Route exact path="/jobs/work/:id">
            <DetailJob />
          </Route>
          <Route exact path="/checkadmin/jobs/work/:id">
            <DetailJob isAdmin />
          </Route>

          <Route exact path="/inforCompany">
            <InforCompany />
          </Route>
          <Route exact path="/inforUser">
            <InforUser />
          </Route>

          <Route exact path="/candidates">
            <Candidates />
          </Route>
          <Route exact path="/candidates/:id">
            <DetailCandidate />
          </Route>

          <Route exact path="/companys">
            <Company />
          </Route>
          <Route exact path="/companys/:id">
            <DetailCompany />
          </Route>

          <Route exact path="/chat">
            <Chat />
          </Route>

          <Route exact path="/interview">
            <VideoCall />
          </Route>

          <Route exact path="/interview/:meetingId">
            <VideoCall />
          </Route>

          {/* unknown */}
          <Route path="*">
            <Empty />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App
