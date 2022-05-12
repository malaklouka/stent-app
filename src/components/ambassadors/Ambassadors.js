import React from 'react'
import '../dashboard/dashboard.css'

const Ambassadors = () => {
  return (
<div className="container-fluid">
  <div style={{marginLeft:"300px"}}>
  <div className="row"><div className="col"><div className="header">
    <div className="header-body"><div className="row align-items-end">
    <div className="col"><h6 className="header-pretitle">Team</h6>
    <h1 className="header-title">All ambassadors</h1></div><div className="col-auto"><div>
        <button type="button" className="btn btn-outline-secondary" data-toggle="modal" data-target="#membersPicker" disabled="disabled">Add an ambassador</button>
        <div id="tooltip-overlay" title="Your ambassadors quota is full. Please upgrade your plan to add new ambassadors" data-toggle="tooltip">
            </div></div></div></div></div></div></div></div>
            <div id="subscription-data" className=""><div id="subscription-data-logo-wrapper">
                <img src="https://stentstripe.s3.amazonaws.com/products/pay_as_you_go.png" alt="prod"/>

                </div>
                <div id="subscription-data-text-wrapper"><h3>Plan</h3><h1>Pay-As-You-Go</h1>
                <h4>1 active ambassador / 1 allowed</h4></div></div>
                <div id="members-filter-wrapper" className="d-flex align-items-center">
                    <span id="filter-by-title">FILTER BY</span><div className="form-group mb-0 mr-3">
                        <input className="form-control filter-table filter-table-input" id="filter-table-name" placeholder="Enter a name"/></div>
                        <div className="form-group mr-3"><select className="form-control filter-table filter-table-select" id="filter-table-status"><option value="" selected="selected">Is active</option><option value="active">Active: YES</option><option value="disabled">Active: NO</option></select></div><div className="form-group">
                            <input type="button" value="Reset filters" className="form-control btn btn-outline-primary btn-sm d-none" id="filter-reset" style={{fontSize: "12px", padding: "3px 10px", height: "29px"}}/></div></div><div className="row" style={{position: "relative", minHeight: "100px"}}><div className="col stent-table" id="members-wrapper">
      <table className="table table-hover table-vcenter mb-0 stent-table">
        <thead>
          <tr className="d-flex">
            <th className="col-6"><span>Ambassador</span></th>
            <th className="col-2 text-right pr-5" style={{paddingRight: "5px", textAlign:"right"}}><span>SSI</span></th>
            <th className="col-2 pl-5"><span>ACCOUNT TYPE</span></th>
            <th className="col-1 text-right"><span>ACTIVE</span></th>
            <th className="col-1 text-right"><span>ACTIONS</span></th>
          </tr>
        </thead>
        <tbody>
      <tr className="stent-member d-flex" data-item-id="ACoAAA-q4hMBLwO_XntcZyW5GXN9eSG5X6YGPkA">
        
        <td className="col-6">
          <div className="row align-items-center no-gutters" style={{flex: "1"}}>
            <div className="col-auto">
              <a href="./dashboard-user?id=ACoAAA-q4hMBLwO_XntcZyW5GXN9eSG5X6YGPkA">
                <img src="https://s3.amazonaws.com/stentavatars/ACoAAA-q4hMBLwO_XntcZyW5GXN9eSG5X6YGPkA" alt="amaz" className="avatar mr-3" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'"/>
                
              </a>
            </div>
            <div className="col">
              <h2>
                Philip Cooper<a data-toggle="tooltip" title="View the dashboard of Philip Cooper" href="./dashboard-user?id=ACoAAA-q4hMBLwO_XntcZyW5GXN9eSG5X6YGPkA"><span className="fe fe-trending-up ml-2 text-primary"></span></a>
              </h2>
              <p className="member-headline">Medical Marketing Associate &amp; Sales Representative at Candorvision</p>
            </div>
            
            

          </div>
        </td>
        
        <td className="col-2 pr-5 justify-content-end ssi-wrapper">

          <h3>
            23
          </h3>

          <small>
            .26
          </small>
          
          <div className="ssi-jauge-wrapper">
        <div className="battery-jauge battery-jauge_danger"></div>
        <div className="battery-jauge battery-jauge_danger"></div>
        <div className="battery-jauge battery-jauge"></div>
        <div className="battery-jauge battery-jauge"></div>
        <div className="battery-jauge"></div>
      </div>
          
        </td>

        <td className="col-2 pl-5">

            <div className="subscription-wrapper">
              <img className="subscription-icon" data-toggle="tooltip" title="LinkedIn standard" src="/assets/img/members/icon-linkedin.svg"/>
              
            </div>

        </td>

        <td className="col-1 justify-content-end">
          <div className="custom-control custom-switch">
            <input type="checkbox" className="custom-control-input switch-member-status" id="switch-member-status_ACoAAA-q4hMBLwO_XntcZyW5GXN9eSG5X6YGPkA" checked="checked"/>
            <label className="custom-control-label" for="switch-member-status_ACoAAA-q4hMBLwO_XntcZyW5GXN9eSG5X6YGPkA"></label>
          </div>
        </td>
        
        <td className="col-1 justify-content-end">
          
          <a href="#" className="flex-row align-items-center open-actions" role="button" data-toggle="dropdown">
            <img src="/assets/img/dots-dark.png"/>
          </a>
          <div className="dropdown-menu dropdown-menu-right">
              <a className="dropdown-item remove-member-to-tenant" id="ACoAAA-q4hMBLwO_XntcZyW5GXN9eSG5X6YGPkA" data-toggle="modal" data-target=".confirm-remove-member" href="#">
                <i className="fe fe-alert-octagon"></i> Remove
              </a>
            </div>
          

        </td>
      </tr>
    </tbody>
      </table>
      </div></div></div>  </div>)
}

export default Ambassadors