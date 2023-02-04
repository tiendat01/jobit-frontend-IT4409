import React from 'react'
import PropTypes from 'prop-types'
import { useState } from 'react'

import '../../../scss/SearchJobs/SearchJobs.scss'
import axiosClient from '../../../../api/axiosClient'
function Search({ onchange, nameSearch, addressSearch }) {
  const [state, setState] = useState({
    name: nameSearch,
    address: addressSearch,
  })
  const { name, address } = state
  const [isShow, setIsShow] = useState(false)
  const [lsResult, setLsResult] = useState(null)

  const livesearch = async (value) => {
    try {
      const res = await axiosClient.get(`/livesearch?keyword=${value}`)
      setLsResult(res)
    } catch (error) {
      console.error(error)
    }
  }

  const hangdelOnchange = (e) => {
    let keyword = encodeURIComponent(e.target.value)
    if (e.target.value !== '') {
      livesearch(keyword)
    }
    else {
      setLsResult(null)
    }
    setState({
      ...state,
      [e.target.name]: e.target.value,
    })
  }
  const hangdelOnFocus = () => {
    setIsShow(true)
  }
  const onok = (e) => {
    e.preventDefault()
    onchange({ name, address })
  }
  const handleOnClick = (item) => {
    setState({
      ...state,
      name: item
    })
    onchange({ name: item, address })
    setIsShow(false)
  }
  
  return (
    <div className="searchJobs">
      <div className="container">
        <form onSubmit={onok}>
          <div className="row">
            <div className={`col-md-6 ${isShow ? 'show' : 'hidden'}`}>
              <div className="key">
                <div className="key__title">Từ khoá</div>
                <input
                  name="name"
                  value={name}
                  type="text"
                  onChange={hangdelOnchange}
                  onFocus={hangdelOnFocus}
                  placeholder="Việc làm, công ty, kỹ năng, nghành nghề, ..."
                />
                <i className="fas fa-search text-silver"></i>
              </div>

              <div className="col-md-12 livesearch-container">
                <nav>
                  {lsResult?.keywords.length > 0 ||
                  lsResult?.companies.length > 0 ? (
                    <ul>
                      {lsResult?.keywords.length > 0 ? (
                        <>
                          <p className="title">Tiêu đề, Kỹ năng</p>
                          {lsResult?.keywords.map((item, index) => (
                            <li className='li' key={index} onClick={() =>  handleOnClick(item)} value={item}>{item}</li>
                          ))}
                        </>
                      ) : (
                        ''
                      )}
                      {lsResult?.companies.length > 0 ? (
                        <>
                          <p className="title">Công ty</p>
                          {lsResult?.companies.map((item) => (
                            <a key={item?.id} href={`/companys/${item?.id}`}>
                              <li className='li' key={item?.id}>{item?.name}</li>
                            </a>
                          ))}
                        </>
                      ) : (
                        ''
                      )}
                    </ul>
                  ) : (
                    ''
                  )}
                </nav>
              </div>
            </div>
            <div className="col-md-3">
              <div className="address">
                <div className="address__title">Địa điểm</div>
                <input
                  type="text"
                  name="address"
                  value={address}
                  onChange={hangdelOnchange}
                  placeholder="Địa điểm"
                />
                <i className="fas fa-map-marker-alt text-silver"></i>
              </div>
            </div>
            <div className="col-md-3">
              <div className="btn">
                <button type="submit">Tìm việc làm</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

Search.propTypes = {
  name: PropTypes.string,
  address: PropTypes.string,
  onchange: PropTypes.func.isRequired,
}
Search.defaultProps = {
  name: '',
  address: '',
}
export default Search
