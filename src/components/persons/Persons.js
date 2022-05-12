import React from 'react'

const Persons = () => {
  return (
<div className="container-fluid d-flex h-100 flex-column">
    <div style={{marginLeft:"300px"}}>
    <div className="row"><div className="col">
    <div className="header"><div className="header-body"><div className="row align-items-end">
        <div className="col"><h6 className="header-pretitle">Audience</h6>
        <h1 className="header-title">All Personas</h1></div><div className="col-auto">
            <button type="button" className="btn btn-primary" id="openModal">New persona</button>
            </div></div></div></div></div></div>
            <div id="finders-filter-wrapper" className="d-flex align-items-center">
                <div className="d-flex align-items-center flex-wrap">
                    <span id="filter-by-title">FILTER BY</span>
                    <div className="align-items-center d-flex mb-2"><div className="form-group mb-0 mr-3">
                        <input className="form-control filter-table filter-table-input" id="filter-table-name" placeholder="Enter a name"/></div></div></div>
                        <div className="form-group mr-3"><div className="d-flex align-items-center flex-wrap">
                            <span id="filter-by-title" className="mb-2">Status</span>
                            <div className="align-items-center d-flex mb-2">
                                <select className="form-control filter-table filter-table-select active" id="filter-table-status">
                                    <option value="">Choose a status:</option>
                                    <option value="ACTIVE" selected="selected">Active</option>
                                    <option value="STOP">Stop</option>
                                    <option value="ARCHIVE">Archive</option></select></div></div></div>
                                    <div className="align-items-center d-flex mb-2"><div className="form-group">
                                        <input type="button" value="Reset filters" className="form-control btn btn-outline-primary btn-sm" id="filter-reset" style={{fontSize: "12px", padding: "3px 10px", height: "29px"}}/></div></div></div><div className="d-flex h-100" id="finders-wrapper"><div className="stent-grid"><div className="row stent-grid-header no-gutters d-none" style={{paddingRight: "16px"}}><div className="col col-1">TYPE</div><div className="col col-7">NAME</div><div className="col col-2">OWNER</div><div className="col col-1 justify-content-center">Status</div><div className="col col-1 justify-content-end">Actions</div></div></div><div id="finders-grid-wrapper">
          <div className="alert alert-warning mt-3" role="alert">
            No persona found.
          </div>
          </div></div>
          </div>
          </div>  )
}

export default Persons