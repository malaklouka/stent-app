import React from 'react'

const Media = () => {
  return (
<div className="container-fluid d-flex h-100 flex-column">
    <div style={{marginLeft:'300px'}}>
    <div className="row">
      <div className="col">
        <div className="header">
        <div className="header-body">
          <div className="row align-items-end">
            <div className="col">
              <h6 className="header-pretitle">Content</h6>
            <h1 className="header-title">All media</h1></div>
            <div className="col-auto">
                <button type="button" className="btn btn-primary" id="new-media-button">Create a media</button>
                </div>
                </div>
                </div>
                </div>
                </div>
                </div>
                <div id="medias-filter-wrapper" className="d-flex align-items-center">
                  <span id="filter-by-title">FILTER BY</span><div className="form-group mr-3">
                    <select className="form-control filter-table filter-table-select" id="filter-table-type">
                      <option value="" selected="selected">Choose a type:</option>
                      <option value="ARTICLE">Article</option><option value="VIDEO">Video</option>
                      <option value="IMAGE">Image</option><option value="DOCUMENT">Document</option>
                      </select>
                      </div>
                      <div className="form-group">
                        <input type="button" value="Reset filters" className="form-control btn btn-outline-primary btn-sm d-none" id="filter-reset" style={{fontSize: "12px", padding: "3px 10px", height: "29px"}}/>
                        </div>
                        </div>
                        <div className="d-flex h-100" id="medias-wrapper">
                          <div className="stent-grid">
                            <div className="row stent-grid-header no-gutters d-none" style={{paddingRight: "16px"}}>
                              <div className="col col-2">PREVIEW</div>
                              <div className="col col-2">TYPE</div>
                              <div className="col col-7">MEDIA</div>
                              <div className="col col-1 justify-content-end">ACTIONS</div>
                              </div>
                              </div>
                              <div id="medias-grid-wrapper">
          <div className="alert alert-warning mt-3" role="alert">
            No medium found.
          </div>
          </div>
          </div>
          </div> 
          </div>  )
}

export default Media