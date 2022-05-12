import React from 'react'

const SettingsApp = () => {
  return (
<div class="container-fluid" id="crm-list">
    <div style={{marginLeft:"300px"}}>
    <div class="row"><div class="col"><div class="header"><div class="header-body"><div class="row align-items-end"><div class="col"><h6 class="header-pretitle">Settings</h6><h1 class="header-title">Apps</h1></div></div></div></div></div></div><div class="row"><div class="col"><p>Connect your Apps to stent and export leads to your CRM.</p><div class="row" id="crm-wrapper">
          <div class="col-12 col-md-6 col-xl-3">
            <div class="card" data-crm-index="0" data-crm="14048331" data-crm-connection-type="personnalkey" data-crm-connected="false">

              <div class="card-img-top" style={{backgroundImage: "url('https://stentcdn.s3.amazonaws.com/crm/github.png')"}}></div>
            
              <div class="card-body">
                <h2 class="card-title ">github</h2>
                <p class="small text-muted mb-0 crm-description">
                  GitHub is where people build software. More than 50 million people use GitHub to discover, fork, and contribute to over 100 million projects. You will need the following permissions <b>public_repo,  read:user,  user:email</b>
                </p>

                
                
              </div>
            
              <div class="card-footer card-footer-boxed">
                <div class="row align-items-center justify-content-between ">
                  
                  <div class="col infos-connected">
                    <span style={{display:"flex", alignItems: "center"}}>
                      <img src="../assets/img/1.svg"/>Account linked
                    </span>
                    <span data-toggle="tooltip" title="Disconnect account">
                      <button class="btn btn-sm btn-outline-danger disconnect-crm"><span class="fe fe-log-in"></span></button>
                    </span>
                  </div>
                  
                  <div class="col infos-not-connected">
                    <button class="btn btn-sm btn-outline-primary btn-block connect-crm">Connect github</button>
                  </div>
              
                </div>
              </div>

              
                <div class="form-personnal-key-wrapper">
              
                  <button type="button" class="close close-personnal-key-form" aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>
                  <form class="form-api-key">
                    <div class="form-group">
                      <label>Personnal Key</label>
                      <input type="text" class="form-control personnal-key-input" placeholder="Enter Personnal Key"/>
                    </div>
                    <button type="submit" class="btn btn-sm btn-primary submit-personnal-key">Connect</button>
                  </form>
                </div>
                

            </div>
          </div>
        
          <div class="col-12 col-md-6 col-xl-3">
            <div class="card" data-crm-index="1" data-crm="242305674" data-crm-connection-type="apikey" data-crm-connected="false">

              <div class="card-img-top" style={{backgroundImage: "url('https://stentcdn.s3.amazonaws.com/crm/monday.png')"}}></div>
            
              <div class="card-body">
                <h2 class="card-title ">monday</h2>
                <p class="small text-muted mb-0 crm-description">
                  The Work OS that powers remote teamwork.
                </p>

                
                
              </div>
            
              <div class="card-footer card-footer-boxed">
                <div class="row align-items-center justify-content-between ">
                  
                  <div class="col infos-connected">
                    <span style={{display:"flex", alignItems: "center"}}>
                      <img src="../assets/img/1.svg"/>Account linked
                    </span>
                    <span data-toggle="tooltip" title="Disconnect account">
                      <button class="btn btn-sm btn-outline-danger disconnect-crm"><span class="fe fe-log-in"></span></button>
                    </span>
                  </div>
                  
                  <div class="col infos-not-connected">
                    <button class="btn btn-sm btn-outline-primary btn-block connect-crm">Connect monday</button>
                  </div>
              
                </div>
              </div>

              
                <div class="form-api-key-wrapper">
              
                  <button type="button" class="close close-api-key-form" aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>
                  <form class="form-api-key">
                    <div class="form-group">
                      <label>API Key</label>
                      <input type="text" class="form-control api-key-input" placeholder="Enter API Key"/>
                    </div>
                    <button type="submit" class="btn btn-sm btn-primary submit-api-key">Connect</button>
                  </form>
                </div>
                

            </div>
          </div>
        
          <div class="col-12 col-md-6 col-xl-3">
            <div class="card" data-crm-index="2" data-crm="749451420" data-crm-connection-type="apikey" data-crm-connected="false">

              <div class="card-img-top" style={{backgroundImage: "url('https://stentcdn.s3.amazonaws.com/crm/rhetorik.png')"}}></div>
            
              <div class="card-body">
                <h2 class="card-title ">rhetorik</h2>
                <p class="small text-muted mb-0 crm-description">
                  Drive your team's growth with clean and compliant B2B Data, Insights and Action.
                </p>

                
                
              </div>
            
              <div class="card-footer card-footer-boxed">
                <div class="row align-items-center justify-content-between ">
                  
                  <div class="col infos-connected">
                    <span style={{display:"flex", alignItems: "center"}}>
                      <img src="../assets/img/1.svg"/>Account linked
                    </span>
                    <span data-toggle="tooltip" title="Disconnect account">
                      <button class="btn btn-sm btn-outline-danger disconnect-crm"><span class="fe fe-log-in"></span></button>
                    </span>
                  </div>
                  
                  <div class="col infos-not-connected">
                    <button class="btn btn-sm btn-outline-primary btn-block connect-crm">Connect rhetorik</button>
                  </div>
              
                </div>
              </div>

              
                <div class="form-api-key-wrapper">
              
                  <button type="button" class="close close-api-key-form" aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>
                  <form class="form-api-key">
                    <div class="form-group">
                      <label>API Key</label>
                      <input type="text" class="form-control api-key-input" placeholder="Enter API Key"/>
                    </div>
                    <button type="submit" class="btn btn-sm btn-primary submit-api-key">Connect</button>
                  </form>
                </div>
                

            </div>
          </div>
        
          <div class="col-12 col-md-6 col-xl-3">
            <div class="card" data-crm-index="3" data-crm="182372787" data-crm-connection-type="oauth2" data-crm-connected="false">

              <div class="card-img-top" style={{backgroundImage: "url('https://stentcdn.s3.amazonaws.com/crm/hubspot.png')"}}></div>
            
              <div class="card-body">
                <h2 class="card-title ">hubspot</h2>
                <p class="small text-muted mb-0 crm-description">
                  There’s a better way to grow.
                </p>

                
                
              </div>
            
             <div class="card-footer card-footer-boxed">
                <div class="row align-items-center justify-content-between ">
                  
                  <div class="col infos-connected">
                    <span style={{display:"flex", alignItems: "center"}}>
                      <img src="../assets/img/1.svg"/>Account linked
                    </span>
                    <span data-toggle="tooltip" title="Disconnect account">
                      <button class="btn btn-sm btn-outline-danger disconnect-crm"><span class="fe fe-log-in"></span></button>
                    </span>
                  </div>
                  
                  <div class="col infos-not-connected">
                    <button class="btn btn-sm btn-outline-primary btn-block connect-crm">Connect hubspot</button>
                  </div>
              
                </div>
              </div>

              

            </div>
          </div>
        
          <div class="col-12 col-md-6 col-xl-3">
            <div class="card" data-crm-index="4" data-crm="182372726" data-crm-connection-type="oauth2" data-crm-connected="false">

              <div class="card-img-top" style={{backgroundImage:" url('https://stentcdn.s3.amazonaws.com/crm/zoho.png')"}}></div>
            
              <div class="card-body">
                <h2 class="card-title ">zoho</h2>
                <p class="small text-muted mb-0 crm-description">
                  Your Life’s Work, Powered By Our Life’s Work.
                </p>

                
                
              </div>
            
              <div class="card-footer card-footer-boxed">
                <div class="row align-items-center justify-content-between ">
                  
                  <div class="col infos-connected">
                    <span style={{display:"flex", alignItems: "center"}}>
                      <img src="../assets/img/1.svg"/>Account linked
                    </span>
                    <span data-toggle="tooltip" title="Disconnect account">
                      <button class="btn btn-sm btn-outline-danger disconnect-crm"><span class="fe fe-log-in"></span></button>
                    </span>
                  </div>
                  
                  <div class="col infos-not-connected">
                    <button class="btn btn-sm btn-outline-primary btn-block connect-crm">Connect zoho</button>
                  </div>
              
                </div>
              </div>

              

            </div>
          </div>
        
          <div class="col-12 col-md-6 col-xl-3">
            <div class="card" data-crm-index="5" data-crm="749451419" data-crm-connection-type="oauth2" data-crm-connected="false">

              <div class="card-img-top" style={{backgroundImage: "url('https://stentcdn.s3.amazonaws.com/email/gmail.png')"}}></div>
            
              <div class="card-body">
                <h2 class="card-title ">GSuite - Gmail</h2>
                <p class="small text-muted mb-0 crm-description">
                  Integrate email
                </p>

                
                
              </div>
            
              <div class="card-footer card-footer-boxed">
                <div class="row align-items-center justify-content-between ">
                  
                  <div class="col infos-connected">
                    <span style={{display:"flex", alignItems: "center"}}>
                      <img src="../assets/img/1.svg"/>Account linked
                    </span>
                    <span data-toggle="tooltip" title="Disconnect account">
                      <button class="btn btn-sm btn-outline-danger disconnect-crm"><span class="fe fe-log-in"></span></button>
                    </span>
                  </div>
                  
                  <div class="col infos-not-connected">
                    <button class="btn btn-sm btn-outline-primary btn-block connect-crm">Connect GSuite - Gmail</button>
                  </div>
              
                </div>
              </div>

              

            </div>
          </div>
        
          <div class="col-12 col-md-6 col-xl-3">
            <div class="card" data-crm-index="6" data-crm="749451412" data-crm-connection-type="oauth2" data-crm-connected="false">

              <div class="card-img-top" style={{backgroundImage: "url('https://stentcdn.s3.amazonaws.com/email/outlook.png')"}}></div>
            
              <div class="card-body">
                <h2 class="card-title ">Office 365 - Mailbox</h2>
                <p class="small text-muted mb-0 crm-description">
                  Integrate email
                </p>

                
                
              </div>
            
              <div class="card-footer card-footer-boxed">
                <div class="row align-items-center justify-content-between ">
                  
                  <div class="col infos-connected">
                    <span style={{display:"flex", alignItems: "center"}}>
                      <img src="../assets/img/1.svg"/>Account linked
                    </span>
                    <span data-toggle="tooltip" title="Disconnect account">
                      <button class="btn btn-sm btn-outline-danger disconnect-crm"><span class="fe fe-log-in"></span></button>
                    </span>
                  </div>
                  
                  <div class="col infos-not-connected">
                    <button class="btn btn-sm btn-outline-primary btn-block connect-crm">Connect Office 365 - Mailbox</button>
                  </div>
              
                </div>
              </div>

              

            </div>
          </div>
        
          <div class="col-12 col-md-6 col-xl-3">
            <div class="card" data-crm-index="7" data-crm="198212177" data-crm-connection-type="apikey" data-crm-connected="false">

              <div class="card-img-top" style={{backgroundImage: "url('https://stentcdn.s3.amazonaws.com/crm/sendinblue.png')"}}></div>
            
              <div class="card-body">
                <h2 class="card-title ">sendinblue</h2>
                <p class="small text-muted mb-0 crm-description">
                  Prepare for takeoff.
                </p>

                
                
              </div>
            
              <div class="card-footer card-footer-boxed">
                <div class="row align-items-center justify-content-between ">
                  
                  <div class="col infos-connected">
                    <span style={{display:"flex", alignItems: "center"}}>
                      <img src="../assets/img/1.svg"/>Account linked
                    </span>
                    <span data-toggle="tooltip" title="Disconnect account">
                      <button class="btn btn-sm btn-outline-danger disconnect-crm"><span class="fe fe-log-in"></span></button>
                    </span>
                  </div>
                  
                  <div class="col infos-not-connected">
                    <button class="btn btn-sm btn-outline-primary btn-block connect-crm">Connect sendinblue</button>
                  </div>
              
                </div>
              </div>

              
                <div class="form-api-key-wrapper">
              
                  <button type="button" class="close close-api-key-form" aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>
                  <form class="form-api-key">
                    <div class="form-group">
                      <label>API Key</label>
                      <input type="text" class="form-control api-key-input" placeholder="Enter API Key"/>
                    </div>
                    <button type="submit" class="btn btn-sm btn-primary submit-api-key">Connect</button>
                  </form>
                </div>
                

            </div>
          </div>
        
          <div class="col-12 col-md-6 col-xl-3">
            <div class="card" data-crm-index="8" data-crm="701160603" data-crm-connection-type="apikey" data-crm-connected="false">

              <div class="card-img-top" style={{backgroundImage: "url('https://stentcdn.s3.amazonaws.com/crm/pipedrive.png')"}}></div>
            
              <div class="card-body">
                <h2 class="card-title ">pipedrive</h2>
                <p class="small text-muted mb-0 crm-description">
                  Designed to keep you selling.<br/>When you need to stay laser-focused on the right deals, Pipedrive is here to support you.
                </p>

                
                
              </div>
            
              <div class="card-footer card-footer-boxed">
                <div class="row align-items-center justify-content-between ">
                  
                  <div class="col infos-connected">
                    <span style={{display:"flex", alignItems: "center"}}>
                      <img src="../assets/img/1.svg"/>Account linked
                    </span>
                    <span data-toggle="tooltip" title="Disconnect account">
                      <button class="btn btn-sm btn-outline-danger disconnect-crm"><span class="fe fe-log-in"></span></button>
                    </span>
                  </div>
                  
                  <div class="col infos-not-connected">
                    <button class="btn btn-sm btn-outline-primary btn-block connect-crm">Connect pipedrive</button>
                  </div>
              
                </div>
              </div>

              
                <div class="form-api-key-wrapper">
              
                  <button type="button" class="close close-api-key-form" aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>
                  <form class="form-api-key">
                    <div class="form-group">
                      <label>API Key</label>
                      <input type="text" class="form-control api-key-input" placeholder="Enter API Key"/>
                    </div>
                    <button type="submit" class="btn btn-sm btn-primary submit-api-key">Connect</button>
                  </form>
                </div>
                

            </div>
          </div>
        </div></div></div>
        </div>
        </div>  )
}

export default SettingsApp