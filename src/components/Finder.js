import React from 'react'

const Finder = () => {
  return (
    <div className="container-fluid d-flex h-100 flex-column">
    <div style={{ marginLeft: "300px" }}>
      <div className="row">
        <div className="col">
          <div className="header">
            <div className="header-body">
              <div className="row align-items-end">
                <div className="col">
                  <h6 className="header-pretitle">Audience</h6>
                  <h1 className="header-title">All finders</h1>
                </div>
                <div className="col-auto">
                  <button
                    type="button"
                    className="btn btn-primary"
                    id="new-finder-button"
                  >
                    Create a finder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="finders-filter-wrapper" className="d-flex align-items-center">
        <span id="filter-by-title">FILTER BY</span>
        <div className="form-group mb-0 mr-3">
          <input
            className="form-control filter-table filter-table-input"
            id="filter-table-name"
            placeholder="Enter a name"
          />
        </div>
        <div className="form-group mr-3">
          <select
            className="form-control filter-table filter-table-select"
            id="filter-table-source"
          >
            <option value="">Choose a source:</option>
            <option value="excel">Excel spreadsheet</option>
            <option value="google-news">Google news</option>
            <option value="github">Github</option>
            <option value="rhetorik">Rhetorik</option>
            <option value="linkedin-network-connections">
              LinkedIn network connections
            </option>
            <option value="linkedin-suggested-contacts">
              LinkedIn suggested contacts
            </option>
            <option value="linkedin-recruiter-saved-search">
              LinkedIn Recruiter search
            </option>
            <option value="linkedin-recruiter-inbox">
              LinkedIn Recruiter inbox
            </option>
            <option value="linkedin-sales-navigator-saved-search">
              LinkedIn Sales Navigator
            </option>
          </select>
        </div>
        <div className="form-group mr-3">
          <select
            className="form-control filter-table filter-table-select"
            id="filter-table-output"
          >
            <option value="">Choose an output:</option>
            <option value="contact">Contacts</option>
            <option value="company">Companies</option>
          </select>
        </div>
        <div className="form-group mr-3">
          <select
            className="form-control filter-table filter-table-select"
            id="filter-table-member"
          >
            <option value="">Choose an owner:</option>
            <option value="ACoAAA-q4hMBLwO_XntcZyW5GXN9eSG5X6YGPkA">
              Philip Cooper
            </option>
          </select>
        </div>
        <div className="form-group mr-3">
          <select
            className="form-control filter-table filter-table-select"
            id="filter-table-state"
          >
            <option value="" selected="selected">
              Choose a state:
            </option>
            <option value="STOPPED">Stopped</option>
            <option value="ERROR">Error</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="FETCHING">Fetching</option>
            <option value="SYNCING">Syncing</option>
            <option value="PROCESSED">Processed</option>
            <option value="IDLE">Idle</option>
          </select>
        </div>
        <div className="form-group mr-3">
          <select
            className="form-control filter-table filter-table-select active"
            id="filter-table-status"
          >
            <option value="">Choose a status:</option>
            <option value="ACTIVE" selected="selected">
              Active
            </option>
            <option value="STOP">Stop</option>
            <option value="ARCHIVE">Archive</option>
          </select>
        </div>
        <div className="form-group">
          <input
            type="button"
            value="Reset filters"
            className="form-control btn btn-outline-primary btn-sm"
            id="filter-reset"
            style={{ fontSize: "12px", padding: "3px 10px", height: "29px" }}
          />
        </div>
      </div>
      <div className="d-flex h-100" id="finders-wrapper">
        <div className="stent-grid">
          <div
            className="row stent-grid-header no-gutters"
            style={{ paddingRight: "16px" }}
          >
            <div className="col col-4">
              <span
                data-sort-key="NAME"
                className="pl-2 change-sort-from-table-header is-sorted is-sorted-ASC"
              >
                Source / Ouput / Name
              </span>
            </div>
            <div className="col col-2">
              <span
                data-sort-key="OWNER"
                className="change-sort-from-table-header"
              >
                Owner
              </span>
            </div>

            <div className="col col-3 pl-4">
              <span
                data-sort-key="STATE"
                className="change-sort-from-table-header"
              >
                State
              </span>
            </div>
            <div className="col col-1">Progress</div>
            <div className="col col-1 justify-content-center">Status</div>
            <div className="col col-1 justify-content-end">Actions</div>
          </div>
        </div>
        <div id="finders-grid-wrapper">
          <div className="col stent-grid" id="finders-result">
            <div
              className="row stent-grid-tr"
              data-finder-id="5c069de5a0cdffddc76f7681fcc40fc4"
              data-owner-id="1f3051b5f73dd987c6d5038f30db0bd8"
              style={{ position: "relative" }}
              data-version="null"
            >
              <div
                className="col col-4 d-flex"
                style={{ wordBreak: "break-all", alignItems: "center" }}
              >
                <span
                  style={{ display: "flex" }}
                  data-toggle="tooltip"
                  data-delay="100"
                  data-html="true"
                >
                  {/* <div style={{ fontSize: "11px" }}>
                    Target: <strong>other</strong>
                    <br />
                    Source: <strong>LinkedIn Sales Navigator</strong>
                    <br />
                    Output: <strong>Contacts</strong>
                  </div> */}

                  <b className="target-icon target-icon-other">O</b>
                  <img
                    src="/assets/img/finders/sales-navigator-saved-search.svg"
                    className="finder-icon"
                    style={{ marginLeft: "-7px" }}
                    alt=""
                  />
                  <img
                    src="/assets/img/finders/contacts.svg"
                    className="mr-2 finder-icon"
                    style={{ marginLeft: "-7px" }}
                    alt=""
                  />
                </span>
                <div style={{ flex: "1" }} className="pr-3">
                  <a
                    href="finder-form?id=5c069de5a0cdffddc76f7681fcc40fc4"
                    className="ui-link"
                    title=""
                    data-toggle="tooltip"
                    data-original-title="Edit finder"
                  >
                    Salon Vision 2020 Leads
                  </a>
                </div>
                <textarea
                  id="finder-data-5c069de5a0cdffddc76f7681fcc40fc4"
                  style={{
                    width: "0px",
                    height: "0px",
                    outline: "none",
                    resize: "none",
                    overflow: "auto",
                    opacity: "0",
                  }}
                >
                  Finder ID: 5c069de5a0cdffddc76f7681fcc40fc4 Finder job ID:
                  null
                </textarea>
              </div>

              <div className="col col-2">
                <div className="d-flex align-items-center">
                  <img
                    src="https://s3.amazonaws.com/stentavatars/ACoAAA-q4hMBLwO_XntcZyW5GXN9eSG5X6YGPkA"
                    onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'"
                    className="mr-2"
                    style={{
                      height: "30px",
                      width: "30px",
                      borderRadius: "100%",
                    }}
                    alt=""
                  />
                  <span style={{ display: "block" }} className="mr-2">
                    Philip Cooper
                  </span>
                </div>
              </div>

              <div className="col col-3 pl-4">
                <img
                  src="/assets/img/idle.svg"
                  className="status-icon refresh-finder"
                  data-toggle="tooltip"
                  title="Refresh" alt="idle"
                />
                <div style={{ lineHeight: "120%" }} className="ml-3">
                  <span>Idle</span>
                  <br />
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "normal",
                      opacity: "0.5",
                    }}
                  >
                    0 / 0
                  </span>
                </div>
              </div>

              <div
                className="col col-1"
                style={{ position: "relative" }}
              ></div>

              <div className="col col-1 justify-content-center pl-4">
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input contacts-finder-status"
                    id="5c069de5a0cdffddc76f7681fcc40fc4"
                    data-identity-key="1f3051b5f73dd987c6d5038f30db0bd8"
                    checked="checked"
                  />
                  <label
                    className="custom-control-label"
                    for="5c069de5a0cdffddc76f7681fcc40fc4"
                  ></label>
                </div>
              </div>

              <div className="col col-1 justify-content-end">
                <div className="btn-group">
                  <a
                    href="#"
                    className="flex-row align-items-center open-actions mr-2"
                    role="button"
                    data-toggle="dropdown"
                  >
                    <img src="/assets/img/dots-dark.png" />
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    <a
                      href="finder-form?id=5c069de5a0cdffddc76f7681fcc40fc4"
                      className="dropdown-item ui-link"
                    >
                      <i className="fe fe-edit"></i> Edit
                    </a>
                    <a
                      className="dropdown-item execute-now"
                      data-id="5c069de5a0cdffddc76f7681fcc40fc4"
                      href="#"
                    >
                      <i className="fe fe-play-circle"></i> Execute now
                    </a>
                    <a
                      className="dropdown-item"
                      data-id="5c069de5a0cdffddc76f7681fcc40fc4"
                      href="finder-form?action=duplicate&amp;id=5c069de5a0cdffddc76f7681fcc40fc4"
                    >
                      <i className="fe fe-copy"></i> Duplicate
                    </a>
                    <a
                      className="dropdown-item finder-archive"
                      data-id="5c069de5a0cdffddc76f7681fcc40fc4"
                      data-toggle="modal"
                      data-target=".confirm-archive-finder"
                      href="#"
                    >
                      <i className="fe fe-package"></i> Archive
                    </a>
                    <div className="dropdown-divider"></div>
                    <a
                      className="dropdown-item reset-finder"
                      data-id="5c069de5a0cdffddc76f7681fcc40fc4"
                      href="#"
                    >
                      <i className="fe fe-loader"></i> Reset
                    </a>
                    <div className="dropdown-divider"></div>
                    <a
                      className="dropdown-item finder-copy-data-to-clipboard"
                      href="#"
                    >
                      <i className="fe fe-zap"></i> Copy IDs to clipboard
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="row stent-grid-tr"
              data-finder-id="e46e1a683320eb726c4d839f8595bae2"
              data-owner-id="1f3051b5f73dd987c6d5038f30db0bd8"
              style={{ position: "relative" }}
              data-version="null"
            >
              <div
                className="col col-4 d-flex"
                style={{ wordBreak: "break-all", alignItems: "center" }}
              >
                <span
                  style={{ display: "flex" }}
                  data-toggle="tooltip"
                  data-delay="100"
                  data-html="true"
                  data-placement="top"
                  title="<div style='font-size: 11px;'>Target: <strong>other</strong><br />Source: <strong>LinkedIn Sales Navigator</strong><br />Output: <strong>Contacts</strong></div>"
                >
                  <b className="target-icon target-icon-other">O</b>
                  <img
                    src="/assets/img/finders/sales-navigator-saved-search.svg"
                    className="finder-icon"
                    style={{ marginLeft: "-7px" }}
                    alt=""
                  />
                  <img
                    src="/assets/img/finders/contacts.svg"
                    className="mr-2 finder-icon"
                    style={{ marginLeft: "-7px" }}
                    alt=""
                  />
                </span>
                <div style={{ flex: "1" }} className="pr-3">
                  <a
                    href="finder-form?id=e46e1a683320eb726c4d839f8595bae2"
                    className="ui-link"
                    title="Edit finder"
                    data-toggle="tooltip"
                  >
                    Test
                  </a>
                </div>
                <textarea
                  id="finder-data-e46e1a683320eb726c4d839f8595bae2"
                  style={{
                    width: "0px",
                    height: "0px",
                    outline: "none",
                    resize: "none",
                    overflow: "auto",
                    opacity: "0",
                  }}
                >
                  Finder ID: e46e1a683320eb726c4d839f8595bae2 Finder job ID:
                  null
                </textarea>
              </div>

              <div className="col col-2">
                <div className="d-flex align-items-center">
                  <img
                    src="https://s3.amazonaws.com/stentavatars/ACoAAA-q4hMBLwO_XntcZyW5GXN9eSG5X6YGPkA"
                    onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'"
                    className="mr-2"
                    style={{
                      height: "30px",
                      width: "30px",
                      borderRadius: " 100%",
                    }}
                    alt=""
                  />
                  <span style={{ display: "block" }} className="mr-2">
                    Philip Cooper
                  </span>
                </div>
              </div>

              <div className="col col-3 pl-4">
                <img
                  src="/assets/img/idle.svg"
                  className="status-icon refresh-finder"
                  data-toggle="tooltip"
                  title="Refresh"
                />
                <div style={{ lineHeight: "120%" }} className="ml-3">
                  <span>Idle</span>
                  <br />
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "normal",
                      opacity: "0.5",
                    }}
                  >
                    0 / 0
                  </span>
                </div>
              </div>

              <div
                className="col col-1"
                style={{ position: "relative" }}
              ></div>

              <div className="col col-1 justify-content-center pl-4">
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input contacts-finder-status"
                    id="e46e1a683320eb726c4d839f8595bae2"
                    data-identity-key="1f3051b5f73dd987c6d5038f30db0bd8"
                    checked="checked"
                  />
                  <label
                    className="custom-control-label"
                    for="e46e1a683320eb726c4d839f8595bae2"
                  ></label>
                </div>
              </div>

              <div className="col col-1 justify-content-end">
                <div className="btn-group">
                  <a
                    href="#"
                    className="flex-row align-items-center open-actions mr-2"
                    role="button"
                    data-toggle="dropdown"
                  >
                    <img src="/assets/img/dots-dark.png" />
                  </a>
                  <div className="dropdown-menu dropdown-menu-right">
                    <a
                      href="finder-form?id=e46e1a683320eb726c4d839f8595bae2"
                      className="dropdown-item ui-link"
                    >
                      <i className="fe fe-edit"></i> Edit
                    </a>
                    <a
                      className="dropdown-item execute-now"
                      data-id="e46e1a683320eb726c4d839f8595bae2"
                      href="#"
                    >
                      <i className="fe fe-play-circle"></i> Execute now
                    </a>
                    <a
                      className="dropdown-item"
                      data-id="e46e1a683320eb726c4d839f8595bae2"
                      href="finder-form?action=duplicate&amp;id=e46e1a683320eb726c4d839f8595bae2"
                    >
                      <i className="fe fe-copy"></i> Duplicate
                    </a>
                    <a
                      className="dropdown-item finder-archive"
                      data-id="e46e1a683320eb726c4d839f8595bae2"
                      data-toggle="modal"
                      data-target=".confirm-archive-finder"
                      href="#"
                    >
                      <i className="fe fe-package"></i> Archive
                    </a>
                    <div className="dropdown-divider"></div>
                    <a
                      className="dropdown-item reset-finder"
                      data-id="e46e1a683320eb726c4d839f8595bae2"
                      href="#"
                    >
                      <i className="fe fe-loader"></i> Reset
                    </a>
                    <div className="dropdown-divider"></div>
                    <a
                      className="dropdown-item finder-copy-data-to-clipboard"
                      href="#"
                    >
                      <i className="fe fe-zap"></i> Copy IDs to clipboard
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="finders-footer">
            <div
              className="spinner-grow spinner-grow-sm d-none"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
            <strong>2 records</strong>
          </div>
        </div>
      </div>
    </div>
  </div>  )
}

export default Finder