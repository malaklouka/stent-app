import React from 'react'

const Invites = () => {
  return (
<div className="container-fluid">
    <div style={{marginLeft:"300px"}}>
    <div className="row"><div className="col">
        <div className="header">
            <div className="header-body">
                <div className="row align-items-end">
                    <div className="col">
                        <h6 className="header-pretitle">Campaigns</h6>
                        <h1 className="header-title">Invite campaigns</h1>
                        </div><div className="col-auto">
                            <button type="button" className="btn btn-primary" id="new-campaign-button">Create an invite campaign</button></div></div></div></div></div></div><div id="campaigns-filter-wrapper" className="d-flex align-items-center"><span id="filter-by-title">FILTER BY</span>
                            <div className="form-group mr-3">
                                <select className="form-control filter-table filter-table-select" id="filter-table-program">
                                    <option value="">Program</option>
                                    <option value="Salon Virtuel Vision 2020">Salon Virtuel Vision 2020</option>
                                    <option value="test">test</option></select></div>
                                    <div className="form-group mr-3">
                                        <select className="form-control filter-table filter-table-select" id="filter-table-name">
                                            <option value="">Name</option>
                                            <option value="Salon Virtuel Vision 2020">Salon Virtuel Vision 2020</option>
                                            <option value="test">test</option></select></div>
                                            <div className="form-group mr-3">
                                                <select className="form-control filter-table filter-table-select" id="filter-table-sender"><option value="">Ambassador</option><option value="ACoAAA-q4hMBLwO_XntcZyW5GXN9eSG5X6YGPkA">Philip Cooper</option></select></div><div className="form-group mb-0 mr-3">
                                                    <input className="form-control filter-table filter-table-input" id="filter-table-source" placeholder="Source"/></div>
                                                    <div className="form-group mr-3">
                                                        <select className="form-control filter-table filter-table-select active" id="filter-table-status"><option value="">Choose status</option>
                                                        <option value="active" selected="selected">Status: started</option>
                                                        <option value="stop">Status: stopped</option></select></div><div className="form-group">
                                                            <input type="button" value="Reset filters" className="form-control btn btn-outline-primary btn-sm" id="filter-reset" style={{fontSize: "12px", padding: "3px 10px", height: "29px"}}/></div>
                                                            <div className="form-group ml-3 pl-4 d-flex" style={{borderLeft: "1px solid #ddd2ec"}}><div className="custom-control custom-switch" style={{transform: "scale(0.75)", transformOrigin: "left"}}>
                                                                <input type="checkbox" className="custom-control-input changeParam" id="showArchived"/>
                                                                 <label className="custom-control-label" for="showArchived">Show archived</label></div></div></div>
                                                                 <div className="row" id="campaigns-result" style={{position: "relative", minHeight: "100px"}}>
        <div className="col">
          <div className="alert alert-warning mt-3" role="alert">
            No campaign found.
          </div>
        </div>
        </div></div> </div>
    )
}

export default Invites