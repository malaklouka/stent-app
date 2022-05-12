import React from 'react'

const Segments = () => {
  return (
<div className="container-fluid">
    <div style={{marginLeft:"300px"}}>
    <div className="row"><div className="col">
    <div className="header">
        <div className="header-body">
            <div className="row align-items-end">
                <div className="col">
                    <h6 className="header-pretitle">Audience</h6>
                    <h1 className="header-title">All segments</h1></div>
                    <div className="col-auto"><button type="button" className="btn btn-primary" id="new-segment-button">Create a segment</button></div></div></div></div></div></div>
                    <div className="row" id="segments-result" style={{position: "relative", minHeight: "100px"}}>
        <div className="col">
          <div className="alert alert-warning mt-3" role="alert">
            No segment found.
          </div>
        </div>
        </div>
        </div>
        </div>
    )
}

export default Segments