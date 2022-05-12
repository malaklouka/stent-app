import React from 'react'

const Contact = () => {
  return (
<div className="container-fluid d-flex flex-column stent-two-cols" id="stent-contacts">
    <div style={{marginLeft:"300px"}}>
    <div className="row"><div className="col"><div className="header">
        <div className="header-body">
<div className="row align-items-end"><div className="col">
    <h6 className="header-pretitle">Audience</h6>
    <h1 className="header-title">All contacts</h1>
    </div></div></div></div></div></div>
    <div className="row"><div className="col">
        <div id="contacts-filter-wrapper" className="d-flex align-items-center">
            <span id="contacts-count" className="badge badge-success">308 results</span> 
            <span id="filter-by-title">FILTER BY</span>
            <div className="form-group mb-0 mr-3">
                <input className="form-control filter-table filter-table-input" id="filter-table-name" placeholder="Enter a name" style={{width: "100px"}}/>
                </div>
                <div className="form-group mr-3">
                    <select className="form-control filter-table filter-table-select" id="filter-table-owner" style={{width: "170px"}}>
                        <option value="tenant">Select an owner</option>
                        <option value="identities/ACoAAA-q4hMBLwO_XntcZyW5GXN9eSG5X6YGPkA">Philip Cooper</option></select></div>
                        <div className="form-group mr-3">
                            <select className="form-control filter-table filter-table-select" id="filter-table-segment" style={{width: "120px"}}>
                                <option value="">Segment</option>
                                <option value="segments/2a5c6576aeef4a99bd8c4a3da5d05c34">Invited</option>
                                <option value="segments/bda203c35dff4acea6d9c4cf33e26f8d">Connected</option>
                                <option value="segments/78a24b9a98c74a8ba1f5c1273bcfa35f">Replied</option>
                                <option value="segments/6483c564e0c042c788eaec2966a2d864">Clicked</option>
                                <option value="segments/7249376b373d4f15a173ecef7ae18e96">Nurtured</option>
                                <option value="segments/727671b18bbd4319ac9a30902b14ed2a">Welcomed</option>
                                <option value="segments/752a56c3bd0e45c892d772f46fd0716e">Connected (old)</option>
                                <option value="segments/eb23b96972e249ae9d9e8b0b1adb078b">Leads</option>
                                <option value="segments/752dfd5a96c844058779d58341185b82">Leads</option>
                                </select></div><div className="form-group">
                                    <input type="button" value="Reset filters" className="form-control btn btn-outline-primary btn-sm d-none" id="filter-reset" style={{fontSize: "12px", padding: "3px 10px", height: "29px"}}/></div></div></div></div>
                                    <div className="row d-none mt-3" id="no-contacts-error-wrapper">
                                        <div className="col">
                                            <div className="alert alert-warning" role="alert">No contact found. Try to change the filters.</div></div></div>
                                            <div className="row" style={{position: "relative", minHeight: "100px"}} id="contacts-table-wrapper"><div className="col stent-table"><table className="table table-vcenter"><thead><tr className="d-flex"><th className="col">Contact</th></tr></thead><tbody>
        <tr data-item-id="ACoAAA_chFgB2WccSOScZWTFHVsQSC1MQGsdjLE" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAA_chFgB2WccSOScZWTFHVsQSC1MQGsdjLE" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Erica Dupuis</h4>
                <p className="small mb-0">Learn, Love, Lead!</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAA-gZpUBWUljlK5DktjoxpnXE1NTJZxPpt8" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAA-gZpUBWUljlK5DktjoxpnXE1NTJZxPpt8" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>

              </div>
              <div className="col">
                <h4 className="mb-1 name">Mona Labrie</h4>
                <p className="small mb-0">optometrist  assistant at retired</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAA-Vke0BxSueZkXQy7M3VFTOYb9Gc5YRI9Y" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Véronique Gauthier</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAA0BrpoBvIju2-Xj7Zht-Kihi9IXtM6hcZI" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAA0BrpoBvIju2-Xj7Zht-Kihi9IXtM6hcZI" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Henry Szikman</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAA0MAPoBgYvg6BF59G8TtB8Uxm9Mfxjto7U" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Alexandra Fraser</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAA2NwV4BgDB0JmADgmb8Py9-fMfLsO7G_zA" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAA2NwV4BgDB0JmADgmb8Py9-fMfLsO7G_zA" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Alexandre Roy-Noël</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAA2wPSwBdTTol9iQrY3VTn8iLv51MGAcYIE" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Hoàng Vo</h4>
                <p className="small mb-0">optometrist at NK Newlook, Inc.</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAA47sVIBCBFJJd2MH-I6L1lz-J7KOwWxOqs" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Mohamad Malunetterie</h4>
                <p className="small mb-0">OPTICIAN</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAA4A4MsBo3zrHwkieozcsj7FX9nONnPIoa8" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAA4A4MsBo3zrHwkieozcsj7FX9nONnPIoa8" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Julien Guimond</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAA5mhg0Boa6Qe06VdNcPubFYjq2Bolmy4eY" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAA5mhg0Boa6Qe06VdNcPubFYjq2Bolmy4eY" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Feki Amine</h4>
                <p className="small mb-0">Newlook</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAA5safIByQIpizJcoablLCKasX42Wy0skJk" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAA5safIByQIpizJcoablLCKasX42Wy0skJk" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Sabrina Mercier Ood</h4>
                <p className="small mb-0">Représentante aux ventes Luxottica</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAA5Uw4UBgV7FVc_TC_4aB8pLf3be1SwdKO8" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAA5Uw4UBgV7FVc_TC_4aB8pLf3be1SwdKO8" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Daniel Wilkenfeld</h4>
                <p className="small mb-0">Optometrist at Private Practice</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAA6sJcYB9GrNry55D58XqshhPfigjxXviHs" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAA6sJcYB9GrNry55D58XqshhPfigjxXviHs" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Regina Bizzarro</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAA8kDdoBLi6BTCBTFFbiXVR_Mf4Kf1OwkkI" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAA8kDdoBLi6BTCBTFFbiXVR_Mf4Kf1OwkkI" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Julie Françoise Garand</h4>
                <p className="small mb-0">Optometry Specialist chez Visique Optometrists</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAA8SSQcBVlr5WmKt2dJydTP5EwpCmYAxqds" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAA8SSQcBVlr5WmKt2dJydTP5EwpCmYAxqds" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Michelle Asselin</h4>
                <p className="small mb-0">Optometrist at IRIS The Visual Group</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAA9f7IYBi3GLl-D6pWVpA2zDa8yhKIc-BA8" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAA9f7IYBi3GLl-D6pWVpA2zDa8yhKIc-BA8" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Tony Canuto</h4>
                <p className="small mb-0">Optométriste</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAA9W8UIBU25bLk8DrA-uEjOAHJYKhCTENgw" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAA9W8UIBU25bLk8DrA-uEjOAHJYKhCTENgw" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Nicole Palijan</h4>
                <p className="small mb-0">Sales Supervisor/ optician at Lenscrafters</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAaiqVEBRjCUZXYOBVQoK3DbH6LgZwupHaE" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Mohamed Rachadi</h4>
                <p className="small mb-0">optician at Lunetterie New Look</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAaU2VwBrfzhKv549X4uB1X5DR8asPF4xUk" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAaU2VwBrfzhKv549X4uB1X5DR8asPF4xUk" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Luigi Bilotto</h4>
                <p className="small mb-0">International Optometric Consultant</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAB0sDYBLqxRkjL6dDKmvC7DgZyqMaXU1qg" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Catherine Vallee</h4>
                <p className="small mb-0">Optician at U.S. Vision</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAblnfcBroMx7_I5UFqmAqMjnLOVXcta0OE" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAblnfcBroMx7_I5UFqmAqMjnLOVXcta0OE" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Pamela Giancola</h4>
                <p className="small mb-0">Optometrist at Opto C&amp;G - optometrists located next to LensCrafters</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAceJ-ABXjsZHCwXxRvDe39f-z2RBiGkDOA" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAceJ-ABXjsZHCwXxRvDe39f-z2RBiGkDOA" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Alex Diogène</h4>
                <p className="small mb-0">Optician</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAACmomEB5INPEBBxxV-pVqtva3_Q3RRNqco" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAACmomEB5INPEBBxxV-pVqtva3_Q3RRNqco" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Kathy Bourget</h4>
                <p className="small mb-0">Optometrist at Lunetterie Duncan</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAcq00wBBf05tqo3omRo7Ef9UP0qic5-NCQ" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAcq00wBBf05tqo3omRo7Ef9UP0qic5-NCQ" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Sami Harb</h4>
                <p className="small mb-0">optician at KW optique</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAdMwZ4BLoVRTkOKveA2uLH9ClZYTrvMrc0" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAdMwZ4BLoVRTkOKveA2uLH9ClZYTrvMrc0" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Mytien Pham</h4>
                <p className="small mb-0">Optometrist, Dt.P, B.Sc</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAADOi5UBSaOW6FhtD2fs1b4gOFnRJxnEu4E" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Pooya Hemami</h4>
                <p className="small mb-0">Equity Analyst / Supervisory Analyst</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAdTRh4BbnZGYzm7zL4RY6440-zPHa5GVF8" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAdTRh4BbnZGYzm7zL4RY6440-zPHa5GVF8" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Van Loc Tran</h4>
                <p className="small mb-0">optometrist at Lunetterie New Look</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAduTc4Bsk3-BhxCF4-Rm3XMs7HITUExf3Y" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAduTc4Bsk3-BhxCF4-Rm3XMs7HITUExf3Y" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Barbara Pelletier</h4>
                <p className="small mb-0">Owner, IRIS optometrists opticians</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAE-aGoBU3vAtiaP8IpnpdYhyKjpP4LXu24" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Bluteau Murielle</h4>
                <p className="small mb-0">OPTICIAN AND INVESTIGATOR(FOR NOW) at JOSEPH MARTZ AND GOVERNMENT</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAEjVbcBiyGBRZCByL6JafZg3Lo2YWbs1Xw" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAEjVbcBiyGBRZCByL6JafZg3Lo2YWbs1Xw" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Michael Toulch</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAEzLtMBNjDi1f6WwyU4XZuct7fA9QE83sA" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAEzLtMBNjDi1f6WwyU4XZuct7fA9QE83sA" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Thomas Noel</h4>
                <p className="small mb-0">Ottawa Eye Institute Optometrist - Associates at The Ottawa Hospital General Campus</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAFDhakBpAMnhPw1HLZwYoL-XM40FIPLtS4" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Yan Ling Liang</h4>
                <p className="small mb-0">Optometrist, Warden Optometry</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAfhutIBElzC5uIWz27kGlSQ6P_Gg4g8kM8" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAfhutIBElzC5uIWz27kGlSQ6P_Gg4g8kM8" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Nicolas Tea</h4>
                <p className="small mb-0">Optometrist </p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAFJLm4Bc2u1i9mmYEcCsgkH9oAvgjca0oo" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Paule Bélanger</h4>
                <p className="small mb-0">Student at Université de Montréal - HEC Montréal</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAfkdYYB6tB7fAD0blaF4mkJtNZxDDHFKWA" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Tina Hueftlein</h4>
                <p className="small mb-0">Optometrist at Chicco Optique</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAfKIfUBtCl0Cgf0IR316Tw1k0NslJB51yc" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAfKIfUBtCl0Cgf0IR316Tw1k0NslJB51yc" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Diana Miceli</h4>
                <p className="small mb-0">Optometrist at Harry Toulch Vision</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAFY7S4BRjSA5-T7pI8T1sbkG8DJ6LatuTg" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAFY7S4BRjSA5-T7pI8T1sbkG8DJ6LatuTg" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Ayda Shahidi</h4>
                <p className="small mb-0">Expert in innovative Ophthalmology research and making a positive impact on front-line patient care</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAGcv-oBrDH5KaLT14rfQy4sE1B75AW4khY" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAGcv-oBrDH5KaLT14rfQy4sE1B75AW4khY" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Reza Abbas Farishta</h4>
                <p className="small mb-0">Postdoctoral Researcher at McGill University</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAgftjQBnWVjMKiiEJ1ZZIZp_eFeoZkJUAw" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAgftjQBnWVjMKiiEJ1ZZIZp_eFeoZkJUAw" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Yves Cormier</h4>
                <p className="small mb-0">Optometrist at Lunetterie New Look</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAgZdbcB47eH1y0A-2OAcLxdtysWcyj58-I" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Lunetterie Vista</h4>
                <p className="small mb-0">Optician at Lunetterie Vista</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAhneSgBHt75NWsgD_-bJJv4P2CZoo--R6M" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Stefanie Parenteau</h4>
                <p className="small mb-0">Optometrist at Agence de la santé et des services sociaux des Laurentides</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAiFEscBjnpKLeQsgXduBel9eshwI-_4Ip4" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Kathy Ouimet</h4>
                <p className="small mb-0">Optometrist Assistant at Centre Visuel Optika</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAIIzgsB9lhJiOxYL08x_sFSyXO3dM6Bqow" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Shant Donabedian</h4>
                <p className="small mb-0">Optometrist at Vizualis</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAiybGwBLN92wQm0_xmihuzutQbTWv3Voeo" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAiybGwBLN92wQm0_xmihuzutQbTWv3Voeo" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">April Wootten</h4>
                <p className="small mb-0">Optometrist at Roland Laoun/Optique Town in Montreal, Quebec, Canada</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAjaH88BGlsQLBFapGaTQA8YGSz97X-vuqs" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAjaH88BGlsQLBFapGaTQA8YGSz97X-vuqs" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Fadi Alhoche</h4>
                <p className="small mb-0">Optician at Optique Laval</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAJlsecBaKkXJYf5Q5stDacHy_IrXP_8SqA" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Katarina Béchard</h4>
                <p className="small mb-0">Optometrist at lunetterie Duncan </p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAjyNwQBihS-iqKac83Gl0JJodZ_m9XDJko" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Stéfanie Parenteau</h4>
                <p className="small mb-0">Optometrist at MAB Mackay Rehabilitation centre</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAkA_O8BrWuJh19-YqYG4zFeTh64f_7OEGs" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAkA_O8BrWuJh19-YqYG4zFeTh64f_7OEGs" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Rinky Wadhwa</h4>
                <p className="small mb-0">Optometrist at Annik Optical Store - Cloverdale</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAkBhZwBMZh-irRMifWW_JYj4OhpYWWFReo" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAkBhZwBMZh-irRMifWW_JYj4OhpYWWFReo" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Angella De Medeiros</h4>
                <p className="small mb-0">Optometric Assistant/Frame stylist at Upper Thornhill Eye Clinic (Frame_your_face on Instagram) </p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAKch4oBuR2ah4Iz_-hVqcj6A0yolPZ-5q8" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAKch4oBuR2ah4Iz_-hVqcj6A0yolPZ-5q8" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Aaron Hesla</h4>
                <p className="small mb-0">Optometrist at Mayfair Eye Care</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAkE7VABhwCblio1wQZyQCEJO_BxHLrYeFk" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Trang Nguyen</h4>
                <p className="small mb-0">--</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAkPVikBw601z7Rz1ceie18w0xzghZA3mC4" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAkPVikBw601z7Rz1ceie18w0xzghZA3mC4" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Olga Savitska</h4>
                <p className="small mb-0">Optometrist at Bayview Vision </p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAkUujcBODu90EeFA2oPP9k9F9RUCJ0C4Oc" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAkUujcBODu90EeFA2oPP9k9F9RUCJ0C4Oc" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Lili-Anh Minh</h4>
                <p className="small mb-0">Optometrist at DOYLE optométristes &amp; opticiens</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAKy0YIB3lqiN9ExGEQcLuHfLq3hau1t0Hg" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Gilda Arama</h4>
                <p className="small mb-0">Licensed Optician</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAl-dZQBtI15zlClBAkMalb_p23fKBjdEyg" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Mary Ina Mccormick</h4>
                <p className="small mb-0">Optician at Clinique Optométrique de Drummondville</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAllRagBRURJfdKbnM0eXvzU4kY7ksJ_0kE" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAllRagBRURJfdKbnM0eXvzU4kY7ksJ_0kE" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">May Jarkas</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAALRs_QBAQ1CWU1R48nsd1g1lB2bqFSgkgQ" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAALRs_QBAQ1CWU1R48nsd1g1lB2bqFSgkgQ" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Daryan Angle</h4>
                <p className="small mb-0">Vice President Of Business Development at IRIS The Visual Group</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAM3jAcBfnc8b9QNGr5yukmLRWFCBLGEj8k" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Sophear Nou</h4>
                <p className="small mb-0">optician at Joseph Martz</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAmcNs0Bq98DjempsW227iRP5UgnCfwTNJ4" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAmcNs0Bq98DjempsW227iRP5UgnCfwTNJ4" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Benoit Tousignant</h4>
                <p className="small mb-0">Associate Professor (Professeur agrégé) at Université de Montréal - School of Public Health</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAMO5eMB6Xd6D5LazbTO3quK_SWQoQsDjNI" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAMO5eMB6Xd6D5LazbTO3quK_SWQoQsDjNI" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Aleksandra Nieckarz</h4>
                <p className="small mb-0">Licensed Opticien</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAnaAm4BioWpm7Mfnr1tuV98e4iBesHmMSw" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">María López</h4>
                <p className="small mb-0">Clinic Manager and licensed optician  at Fovea optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAnnTpgBwq4dROfNdPkjHWLWWkGZtJgB2N8" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Melanie Bouthot</h4>
                <p className="small mb-0">Opticien at Opto-Reseau</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAnYJ3wB0NLt80B-LbI8_aQs0S881utR81A" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAnYJ3wB0NLt80B-LbI8_aQs0S881utR81A" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Alfred Laham</h4>
                <p className="small mb-0">President @ Oasis Optique</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAoIg4YBjhg1XU98wpsjl3kZ1o6tQVx9PBo" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAoIg4YBjhg1XU98wpsjl3kZ1o6tQVx9PBo" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Dzovag Arakelian</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAOrw6YBFmLfDVx1tm21vyVg25xA9ft7M6c" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAOrw6YBFmLfDVx1tm21vyVg25xA9ft7M6c" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Annik Lucier</h4>
                <p className="small mb-0">Eyewear is a useful piece of jewelry that touches everyone
</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAp2RWQBn45l8HFE7vOk3uqAUne4-AzxiYE" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAp2RWQBn45l8HFE7vOk3uqAUne4-AzxiYE" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Michèle Anhoury</h4>
                <p className="small mb-0">Corporate Accounts at Canadian Wireless - Bell Mobility</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAp6h_kBZw0cdHtl8Ts_ZkTKfXRfjZGbvDY" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAp6h_kBZw0cdHtl8Ts_ZkTKfXRfjZGbvDY" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Shawn Donnelly</h4>
                <p className="small mb-0">owner of Donnelly Optical</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAp8-fEBnNyWeHpnToYUj625ZB3ayncjvrg" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAp8-fEBnNyWeHpnToYUj625ZB3ayncjvrg" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Kevin Messier</h4>
                <p className="small mb-0">Clinic Director at Université de Montréal</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAPGt3wB6RbD3VJ6qH1lBazRsZpWrubBGOM" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAPGt3wB6RbD3VJ6qH1lBazRsZpWrubBGOM" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Amber Mcintosh</h4>
                <p className="small mb-0">Bastien  Prizant  Optometry </p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAPIGloBWETxZphCZz7Y1VIqvRV4G-RjsUQ" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAPIGloBWETxZphCZz7Y1VIqvRV4G-RjsUQ" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Michelle Mckenzie</h4>
                <p className="small mb-0">Optometrist at Bolton Optometry Clinic</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAApRIXABQ3xF116k-vk-KgmueCiJbIxopNQ" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAApRIXABQ3xF116k-vk-KgmueCiJbIxopNQ" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Vithusha Illanganathan</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAQEFb0BbvswaJP4h_Ejny5TqxEBL1VC91Q" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAQEFb0BbvswaJP4h_Ejny5TqxEBL1VC91Q" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Mihaela Somogyi Mara</h4>
                <p className="small mb-0">Intervenante Opérations et Formation chez IRIS LE GROUPE VISUEL</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAsDaE8BiPkQE_dKsB6Xm33RoQHR3tkPb88" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAsDaE8BiPkQE_dKsB6Xm33RoQHR3tkPb88" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Victoria Cadman</h4>
                <p className="small mb-0">Optometrist at Ancaster Family Eyecare</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAsj96wB-oZDlduwPyxqnLhYyzlqRimRK9I" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Reine Lallouz</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAtMr78BwU3O5jp72x8UJEK74VjQJqlpq9A" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAtMr78BwU3O5jp72x8UJEK74VjQJqlpq9A" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Dr Johanne Quesnel</h4>
                <p className="small mb-0">Optometry</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAtPlJIBrSYxUr6NjKDIWZFsN8YTS2v5dNE" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Tien Do</h4>
                <p className="small mb-0">Optician at Nikon Optical Canada Inc.</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAtSlp0BZuCKHf144B7GXPLQxDezFZNfTeA" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAtSlp0BZuCKHf144B7GXPLQxDezFZNfTeA" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
          </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Julia Clow</h4>
                <p className="small mb-0">Optometric Assistant at Visique</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAttgTQBjV-S8mT_TE7KrTEuCcrJtIPI8HQ" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAttgTQBjV-S8mT_TE7KrTEuCcrJtIPI8HQ" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Agnès Bonnin</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAW-khABhRaEoLq2qe0SYPIT5k3vLpcB-oA" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAW-khABhRaEoLq2qe0SYPIT5k3vLpcB-oA" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Marie-Josée Coussard</h4>
                <p className="small mb-0">Secretary at Esther Béland, optician</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAWoMZcBXN9Pzmgiq9TJYgJoOP6eRNNADpA" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAWoMZcBXN9Pzmgiq9TJYgJoOP6eRNNADpA" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Mike Yang</h4>
                <p className="small mb-0">Optometrist and Researcher</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAwRpscBExBiQJliE3C6Tvwh80INdhztpVc" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle/"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Nicole Stephens</h4>
                <p className="small mb-0">assistant of optometrist at zeidel</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAwumFkByvWHvD20oOkQ_GxNl37Vm80tT6E" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAwumFkByvWHvD20oOkQ_GxNl37Vm80tT6E" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Thuy-Anh Duong</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAX0MjwB9HcTvqtr7LYeiz53EauB0ALKkf4" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Aviva Masella</h4>
                <p className="small mb-0">Optometrist at Optometry Clinic</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAXMSOwByJSPDm7pUD5tkd_nu4TY-bJy8js" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Lesbranchés Lunetterie</h4>
                <p className="small mb-0">Optician/Stylist at Les Branchés Lunetterie</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAxNvPMBayRKLn7HiQkKM61VTZ38wo2dllw" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAxNvPMBayRKLn7HiQkKM61VTZ38wo2dllw" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Adriana Cotovio</h4>
                <p className="small mb-0">Doctor of Optometry, OD</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAXXOIoBe0AC5EPaud24UF3_thYumY_94zE" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Rene Beland</h4>
                <p className="small mb-0">optician at Sherbrooke Bulldogs</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAXxoTkBE0fvlxXV6NSA_guHwGrZmRe-6Ag" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAXxoTkBE0fvlxXV6NSA_guHwGrZmRe-6Ag" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Amany Wissa</h4>
                <p className="small mb-0">Optometrist at Arc Eyecare</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAY9SwoB5tp5BIpshbGzjBPnSp7GWKvsSR8" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAY9SwoB5tp5BIpshbGzjBPnSp7GWKvsSR8" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Angela Issa</h4>
                <p className="small mb-0">Owner, CLINIQUE DE L'OEIL ROCKLAND</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAYDx9oB9mUPdbEdiE4vi84hz3fmtUH5U10" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAYDx9oB9mUPdbEdiE4vi84hz3fmtUH5U10" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Sharmin Habib</h4>
                <p className="small mb-0">co-founder, optometrist and wellness advocate</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAYIOpgBNDptQplg9_BwdewPsJqFpdT5KdU" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAYIOpgBNDptQplg9_BwdewPsJqFpdT5KdU" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Zena Skaff</h4>
                <p className="small mb-0">Optometrist | Digital Business Owner | I Help Busy Moms Build A Successful Online Business Using Simple Video Training</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAylsiEBsOR2tB6fnBqKFar4-fU5lvFZ9eI" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Betty Nguyen</h4>
                <p className="small mb-0">optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAYmnpsBxMbz1up9i9ZHmi5OuyW9n5CoYK4" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAYmnpsBxMbz1up9i9ZHmi5OuyW9n5CoYK4" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Patricia Sorya</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAYmtqkBmYu5g5sDP0MTL_W4ws1yLSAT6WQ" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Kim Dao</h4>
                <p className="small mb-0">Technical Advisor at Essilor Canada</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAyNaBYBzXwqcItVeC0Sai6hYa2ccRjPpG4" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Timothee Agenor</h4>
                <p className="small mb-0">Optician</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAz1fTABG3CiBXwYuBM9BQOKKe4QGhwwnbo" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Djavad Irankhah</h4>
                <p className="small mb-0">optician</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAzF_GQBO1Ghp9YteMUDZK6WNGHSgvD5i8g" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAAzF_GQBO1Ghp9YteMUDZK6WNGHSgvD5i8g" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Brian Goldberg</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAAzurfMB1luFZcgOzZYke3kBCnV-r5yMGmg" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Aya Ezzeddine</h4>
                <p className="small mb-0">OPTICIAN</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAB0lO-YBkr3EJP3Zbhl0CFEC6D04FC9rmQA" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAB0lO-YBkr3EJP3Zbhl0CFEC6D04FC9rmQA" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Jeoffrey Burtin</h4>
                <p className="small mb-0">Optician</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAB1hYhIB9QL1sZWVSWEK-fe3BGcoOkZDCxg" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAB1hYhIB9QL1sZWVSWEK-fe3BGcoOkZDCxg" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Guillaume Le Coq</h4>
                <p className="small mb-0">Head optician Bonlook Quebec</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAB1MSQUBBZn7eZ2uUtbj01N0Myo8SsHkRCA" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Mylene Giroux</h4>
                <p className="small mb-0">Optometrist at CISSOID</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAB28geoBB5On72CxM_Eg6aW4XuyA3XI0CaY" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAB28geoBB5On72CxM_Eg6aW4XuyA3XI0CaY" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Fatima Menhem</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAB2DsPABqFSHGOCXDBi6zDVT8f6pblz-xJg" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Mel Montplaisir</h4>
                <p className="small mb-0">Optometrist at Eye Of Riyadh</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAB2KyzAB-iA2he6_V9PpY1NOGXWi8lxGzNc" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Elior Sandroussy</h4>
                <p className="small mb-0">Optometrist at Self Employed</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAB2U8uYBbEo3TLVoP5QI3j3v22po47uncvs" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Yhuliet Cardona</h4>
                <p className="small mb-0">Optometric Assistant at Optoplus Rodrigues et associés</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAB2XgG0BMr0LEAFdCZkDbQEd76wg-SpJqqk" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Olivier Page</h4>
                <p className="small mb-0">optician at pageharvey</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAB4lc50BK8Y1Gizd47R4g7Jedc_hVVcEpYk" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAB4lc50BK8Y1Gizd47R4g7Jedc_hVVcEpYk" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Benjamin Amram</h4>
                <p className="small mb-0">Licensed Optician at Independant</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAB5BfAMBWpAWWttjDI8hf6R2ubhe9Bwt_ZM" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAB5BfAMBWpAWWttjDI8hf6R2ubhe9Bwt_ZM" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Christopher Serhan</h4>
                <p className="small mb-0">Optometrist at OPÉA Optométristes</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAB5BfAYBg5IcmgYeDFl89QGMoWloaNaKQg0" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Rita Ganni</h4>
                <p className="small mb-0">Optometrist/Owner at OPÉA Optométristes</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAB7lbwkBt_wxNTPlhrmwNQHXVeSflN2qd_w" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAAB7lbwkBt_wxNTPlhrmwNQHXVeSflN2qd_w" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Dominique Seguin</h4>
                <p className="small mb-0">Optometrist at Opto-Réseau</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAB7lJU0Bxew9j8K0hEP1DUrg07NQFC22yAY" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Philip Bolous</h4>
                <p className="small mb-0">Optometrist at Self</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAB7Y0rUB_zeVCs6MlRvgG50ctDGxVNb7cIQ" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Stephanie Leger</h4>
                <p className="small mb-0">Optometrist at Doyle</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAB7ZSxcBBQYijj6LYQ09ABhbIVOwjrPym68" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Dr Kimberly Dubois Od</h4>
                <p className="small mb-0">Doctor of Optometry</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAAB8vEJwBffp8UkNDFGIa5sI4hI2glJUOAL0" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Raphael Elalouf</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABa-xUgBih2imqRNm_1OQkh4_SFgFfe71Y0" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABa-xUgBih2imqRNm_1OQkh4_SFgFfe71Y0" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Tara Mahvelati</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABa2pOgBaWxRfo3ZFlJ5C-5hORgV9zLlsLw" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Mona Sara</h4>
                <p className="small mb-0">Mobile Optometry Clinic (MOC)</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABaQQwwBTkjtHqH2HLD_yOhBAAI_IELw0Sg" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Nagib Makaroon</h4>
                <p className="small mb-0">optician at abk</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABAQR2IB8W6z5V7g0odqFXhkZkvDHGZEnvY" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Luc Pétrin</h4>
                <p className="small mb-0">Opticien Lunetterie New Look</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABAvDQoBc0CMVfGd13YGRFq-bC4q_gZnM2s" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Campoli Franco</h4>
                <p className="small mb-0">optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABbecA0B4wlRg3BDepmOnR9HCKM4f-mwibY" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Elizabeth Murphy</h4>
                <p className="small mb-0">optician at Optique Georges Laoun Inc.</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABbr83gBYVmMuTH5nV0-DEyYLxgrI6eomHs" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABbr83gBYVmMuTH5nV0-DEyYLxgrI6eomHs" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Steven Aboulehaf</h4>
                <p className="small mb-0">Optician and owner of Clinique Visuelle Simple Vision</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABbsie8Bhr1es-Ugrj-csl2yfaMCrSn_vfE" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABbsie8Bhr1es-Ugrj-csl2yfaMCrSn_vfE" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Minh-Thi La</h4>
                <p className="small mb-0">Optometrist and business owner</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABBxO5UBRYsTu6utwY5eA9c3Htlfq6Xj2-A" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABBxO5UBRYsTu6utwY5eA9c3Htlfq6Xj2-A" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Elisa Ohanian</h4>
                <p className="small mb-0">Optican</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABbyxCsBSzz9RoaLxFxdN-yqSO920VpSlsE" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABbyxCsBSzz9RoaLxFxdN-yqSO920VpSlsE" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Jason Chau</h4>
                <p className="small mb-0">Optometrist at Waterloo Eye Care Centre</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABc3SRoBmGCgDrcqPFHE1O7Wdy1MdCnYuIA" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABc3SRoBmGCgDrcqPFHE1O7Wdy1MdCnYuIA" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Bechir Ibrahim</h4>
                <p className="small mb-0">Optician</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABcBzYUBbuvC0YgUjO3H5MbM3tm0iiWrPhI" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABcBzYUBbuvC0YgUjO3H5MbM3tm0iiWrPhI" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Diane Sayah</h4>
                <p className="small mb-0">Optometrist | PhD | FAAO</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABcjNssBr1zmBQr5NypH_k-Qe7XRwsjt8Ko" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABcjNssBr1zmBQr5NypH_k-Qe7XRwsjt8Ko" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Trevor Miranda</h4>
                <p className="small mb-0">Owner/Optometrist at Cowichan Eyecare</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABcMnGYBOqyYE17FC7oucm9D4px08Udz_Jo" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Mylène Bolduc</h4>
                <p className="small mb-0">optician at regards securite</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABcui4IBmDOunw1PycS7Ft5i0InLb69M6mg" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Dima Malas</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABD5avUBfORWfCjUs_vpeS4AQHp0zY0BaEA" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Loan Nguyen</h4>
                <p className="small mb-0">Optometrist at Centre Visuel Bélanger</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABd6IkUBqsgRuP7CHMBDyzJ-Kh1w1NkZIVA" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABd6IkUBqsgRuP7CHMBDyzJ-Kh1w1NkZIVA" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Maria Ranallo</h4>
                <p className="small mb-0">Optometric Assistant at NEWLOOK</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABDcDhQBuOpO8HYmXibUv8rFzt7QskGWfTg" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABDcDhQBuOpO8HYmXibUv8rFzt7QskGWfTg" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Cristina Ferreira Lameira</h4>
                <p className="small mb-0">Manager/Optician at IRIS The Visual Group</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABdKesMBi2LBC-1H5elpQNXjS1Ea2nawhpI" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABdKesMBi2LBC-1H5elpQNXjS1Ea2nawhpI" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Jessica Achkarian</h4>
                <p className="small mb-0">Optician</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABdn7j4BHX6kpnBZZYT4LSm2-4ZMFcG6th4" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABdn7j4BHX6kpnBZZYT4LSm2-4ZMFcG6th4" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Leon Eselson</h4>
                <p className="small mb-0">Optometrist at FYi Doctors</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABDzCbQBhGjf0IyHiTEai51AvDnf_cJCU2g" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Nida Khouri</h4>
                <p className="small mb-0">optician at Optique Georges Laoun Inc.</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABE9GXABdjJznrLQY2db0iqTx5aO7qwBenI" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABE9GXABdjJznrLQY2db0iqTx5aO7qwBenI" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Annie Truong</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABee_3IB7O6QcabM0EiJ8DoF6osN92WE08s" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABee_3IB7O6QcabM0EiJ8DoF6osN92WE08s" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Tina Cyr</h4>
                <p className="small mb-0">Licensed Optician</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABEgfBABatR1D3EMc-9M5eBF51t4tVuUjKI" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
 </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Centre Talon</h4>
                <p className="small mb-0">OPTICIAN at Centre Visuel Jean Talon</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABelX9EBjN7O88JlDGSBIWESt8_BewsZ2Vw" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABelX9EBjN7O88JlDGSBIWESt8_BewsZ2Vw" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Jessi Currie</h4>
                <p className="small mb-0">Optometric Assistant at Visique</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABf-CEkBzGmY-ICpVt1ElrV4_UGk3LeBKfE" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABf-CEkBzGmY-ICpVt1ElrV4_UGk3LeBKfE" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Maha Shoman</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABf-wyMBaG5cVxSVQTJfZjSLNJCVW2i5FNI" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABf-wyMBaG5cVxSVQTJfZjSLNJCVW2i5FNI" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Tanya Iannotti</h4>
                <p className="small mb-0">Teacher at SWL</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABF1ELQBYs78jRgsyrqUyzHZNOrTIe2BY0o" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABF1ELQBYs78jRgsyrqUyzHZNOrTIe2BY0o" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Gabriel Assaf</h4>
                <p className="small mb-0">Optician</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABfdpG8BZZpFpl_VmyN9Nxx79e2kHhoEvMY" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABfdpG8BZZpFpl_VmyN9Nxx79e2kHhoEvMY" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Jeremy Steinberg</h4>
                <p className="small mb-0">Optometrist</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABftc2IBFBzX3sXLfeJ0pc7eOlhM6nnIIGk" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABftc2IBFBzX3sXLfeJ0pc7eOlhM6nnIIGk" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Christin Daoud</h4>
                <p className="small mb-0">OD</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABfWDiwBWTsjUSIe2c5pJSPCYn5o-MPqUY0" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABfWDiwBWTsjUSIe2c5pJSPCYn5o-MPqUY0" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Josee Labrecque</h4>
                <p className="small mb-0">Optometrist at Groupe Marchand Giguere (FYI Doctors)</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABGfNssB9gquK88d30hOkH96jhxK46nWBIk" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABGfNssB9gquK88d30hOkH96jhxK46nWBIk" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Margaux Smith</h4>
                <p className="small mb-0">opticienne d'ordonnance</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABGfOtQBNP2XDI8cSCps71AYcXQ3QjMNEvo" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABGfOtQBNP2XDI8cSCps71AYcXQ3QjMNEvo" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Souchinda Soeung</h4>
                <p className="small mb-0">Software Trainer at WINK Software</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABGKETABWw-YY2X9WnALmWaA5sj3ral8jnk" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABGKETABWw-YY2X9WnALmWaA5sj3ral8jnk" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Linda Johnson</h4>
                <p className="small mb-0">Optometrist at Optical Express</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABgNI_EBf851jbL8t8g3WUYmGVsQ3_CwASA" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABgNI_EBf851jbL8t8g3WUYmGVsQ3_CwASA" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Youssouf Youssef</h4>
                <p className="small mb-0">Optometrist with a head full of projects</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABGq0TcB_j1Ez0lk-W5goCb6J90fc9Fwrtk" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="https://s3.amazonaws.com/stentavatars/ACoAABGq0TcB_j1Ez0lk-W5goCb6J90fc9Fwrtk" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Martin Spiro</h4>
                <p className="small mb-0">Optometrist at Optika Eye Care Center</p>
              </div>
            </div>
          </td>
        </tr>
      
        <tr data-item-id="ACoAABhS_F0BxPhR-OdeAyVPNqeoSomOQXVBFgw" className="a-contact">
          <td>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className="avatar">
                  <img src="/assets/img/avatars/profiles/default-avatar.gif" onerror="this.onerror=null;this.src='/assets/img/avatars/profiles/default-avatar.gif'" className="avatar-img rounded-circle"/>
                </span>
              </div>
              <div className="col">
                <h4 className="mb-1 name">Zyeu-Laval Optometristes</h4>
                <p className="small mb-0">Optometrist at Zyeu optométriste</p>
              </div>
            </div>
          </td>
        </tr>
      </tbody></table></div></div>
    
    
  
  </div>  </div>  )
}

export default Contact