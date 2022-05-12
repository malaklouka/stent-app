import React from 'react'
import Sidebar from '../sidebar/Sidebar'
import './dashboard.css'

const Dashboard = () => {
  return (
    <div>
    <div className="main__content">
    <div class="header bg-dark pb-5"><div class="container-fluid"><div class="header-body"><div class="row align-items-end"><div class="col"><h6 class="header-pretitle text-secondary">DASHBOARD</h6><h1 class="header-title text-white">Ambassador of the week</h1></div></div></div><div class="header-footer"><div class="stent-widget" data-manual-load="" data-name="top-ambassador-of-the-week" data-widget-guid="5816cd7b-eadd-4fef-af4b-4ed05bbb55e2"><div class="row align-items-center ambassador-of-the-week">
        <div class="col d-flex">
          <div class="ambassador-of-the-week_avatar" 
          style={{backgroundImage:"url('https://s3.amazonaws.com/stentavatars/ACoAAA-q4hMBLwO_XntcZyW5GXN9eSG5X6YGPkA'), url('/assets/img/avatars/profiles/default-avatar.gif')"}}></div>
          <div class="ambassador-of-the-week_description-wrapper d-flex flex-column justify-content-center">
            <div class="ambassador-of-the-week_ssi"><span>23</span><small>.26</small></div>
            <div class="ambassador-of-the-week_first-name">Philip</div>
            <div class="ambassador-of-the-week_last-name">Cooper</div>
            <div class="ambassador-of-the-week_stars">★</div>
          </div>
        </div>

        <div class="col align-self-start text-center ambassador-of-the-week_kpi">
          <div style={{backgroundImage:"url('/assets/img/dashboard/acceptance.svg')", backgroundSize: "100%"}}></div>
          <p>28<small>%</small></p>
          <span>Acceptance ratio</span>
        </div>
        <div class="col align-self-start text-center ambassador-of-the-week_kpi">
          <div style={{backgroundImage:"url('/assets/img/dashboard/views.svg')", backgroundSize:"100%"}}></div>
          <p>-</p>
          <span>Views on shared articles</span>
        </div>
        <div class="col align-self-start text-center ambassador-of-the-week_kpi">
          <div style={{backgroundImage:"url('/assets/img/dashboard/clicks.svg')", backgroundSize: "86%" }}></div>
          <p>-</p>
          <span>Clicks in stream and emails</span>
        </div>
        <div class="col align-self-start text-center ambassador-of-the-week_kpi">
          <div style={{backgroundImage: "url('/assets/img/dashboard/comments.svg')", backgroundSize: "82%"}}></div>
          <p>-</p>
          <span>Comments in stream</span>
        </div>
        <div class="col align-self-start text-center ambassador-of-the-week_kpi">
          <div 
          style={{backgroundImage: "url('/assets/img/dashboard/replies.svg')", backgroundSize: "100% 100%"}}></div>
          <p>
            8
            <b class="up" data-toggle="tooltip" title="" data-original-title="70%"></b>
          </p>
          <span>Replies in messages</span>
        </div>
      </div>

    </div></div></div></div>

      {/* <div className="main__title">
 
        <div className="header" >
          <h6 className="header-pretitle text-secondary" style={{marginLeft:"25px", color: "#7e6ea3"}}>
            DASHBOARD
          </h6>

          <h1 className="header-title text-white" style={{marginLeft:"25px", color:"#fff"
}}>
            Ambassador of the week
          </h1>
        </div>
        <div className='footer'>
            <div className='ambrassade'>
                <div style={{dispaly:"flex"}}>

                </div>
                <div style={{dispaly:"flex"}}></div>
                <div style={{dispaly:"flex"}}></div>
                <div style={{dispaly:"flex"}}></div>
                <div ></div>
                <div></div>
            </div>
        </div>
     
    
     
      </div> */}

{/* 
      <div classNameName="card dashboard-table">
        <div classNameName="card-header">
       <h4 classNameName='card-header-title'>
       Top Ambassadors Ranking

       </h4>
        </div>
<div classNameName='card-body'>
    <div classNameName='table-responsive'>
        <table classNameName='table table-vcenter'>
            <thead>
                <tr classNameName='d-flex'>
                    <th classNameName='col-4'>AMBASSADOR</th>
                    <th classNameName='col-2 text-right pr-3'>
                        <span>SSI</span>
                        <span></span>
                    </th>
                    <th classNameName='fe fe-chevron-down sort-button sort-button_active'>
                        <span>ACCEPTANCE RATIO</span>
                    </th>
                    <th classNameName='col-1 text-right'> <span>VIEWS</span></th>
<th classNameName='col-1 text-right'><span>CLICKS</span></th>
<th classNameName='col-1 text-right'><span>COMMENTS</span></th>
<th classNameName='col-1 text-right'><span>REPLIES</span></th>
                </tr>
            </thead>
            <tbody>
                <tr classNameName='d-flex'>
                <td classNameName='col-4'>
                    <span style={{display: "inlineBlock", width: "2em", marginRight: "0.5em", textAlign: "right"}}>1st</span>
               <div classNameName='avatar avatar-xs mr-2'>
               <img src="https://s3.amazonaws.com/stentavatars/ACoAAA-q4hMBLwO_XntcZyW5GXN9eSG5X6YGPkA" className="avatar-img rounded-circle" style={{width: "26px", height: "26px"}} onerror="this.src='/assets/img/avatars/profiles/default-avatar.gif'" alt="avatar"/>
               </div>

              Philip Cooper
              <span classNameName='stars'></span>
                </td>
                <td classNameName='col-2 align-right no-gutters'>
                <span style={{fontSize: "1.15em"}}>23</span>
                <small className="mr-2">.26</small>
                <div className="top-ambassador-ssi-evolution-wrapper"><span className="fe fe-arrow-down-right" style={{color:"#e63757"}}></span><span className="top-ambassador-ssi-evolution-value">-2.04%</span></div>
                
                </td>
              
                <td className="col-2 align-right">
              <div className="row align-items-center no-gutters">
                <div className="col-auto mr-3">
                    <span>28%</span>
                </div>
                <div className="col" style={{fontSize: 0}}>
                  
          <div className="battery-jauge battery-jauge_danger"></div>
          <div className="battery-jauge battery-jauge_danger"></div>
          <div className="battery-jauge battery-jauge"></div>
          <div className="battery-jauge battery-jauge"></div>
          <div className="battery-jauge"></div>
        
                </div>
              </div>
            </td>
            <td className="col-1 align-right">-</td>
               
            <td className="col-1 align-right">-</td>
            <td className="col-1 align-right">
              -
              <img className="ml-2" src="/assets/img/magic.png" width="18" alt="magic"/>
            </td>
            <td className="col-1 align-right">
              8
              <img data-toggle="tooltip" title="70%" className="ml-2" src="/assets/img/dashboard/sentiment-up.svg" width="18" alt="sent"/>
            </td>                </tr>
             
            </tbody>
        </table>
    </div>
</div>
      </div> */}
   
   <div className="container-fluid mt-n6"><div className="row"><div className="col-12 col-xl-12"><div className="stent-widget" data-manual-load="" data-name="top-ambassadors-ranking" data-widget-guid="1de6b913-3d60-4a5e-abce-d241b994b864"><div className="card dashboard-table">
  <div className="card-header">
    <h4 className="card-header-title">
      Top Ambassadors Ranking
    </h4>
  </div>
  <div className="card-body p-0">
    <div className="table-responsive">
      <table className="table table-vcenter mb-0">
        <thead>
          <tr className="d-flex">
            <th className="col-4">AMBASSADOR</th>
            <th className="col-2 text-right pr-3">
              <span>SSI</span> <span className="fe fe-chevron-down sort-button sort-button_active"></span>
            </th>
            <th className="col-2 text-right">
              <span>ACCEPTANCE RATIO</span>
            </th>
            <th className="col-1 text-right">
              <span>VIEWS</span>
            </th>
            <th className="col-1 text-right">
              <span>CLICKS</span>
            </th>
            <th className="col-1 text-right">
              <span>COMMENTS</span>
            </th>
            <th className="col-1 text-right">
              <span>REPLIES</span>
            </th>
          
          </tr>
        </thead>
        <tbody>
        <tr className="d-flex">

            <td className="col-4">
              <span style={{display:"inlineBlock", width: "2em",marginRight: "0.5em", textAlign:"right"}}>1st</span>

              <div className="avatar avatar-xs mr-2">
                <img src="https://s3.amazonaws.com/stentavatars/ACoAAA-q4hMBLwO_XntcZyW5GXN9eSG5X6YGPkA" className="avatar-img rounded-circle" style={{width:"26px", height:"26px",}} onerror="this.src='/assets/img/avatars/profiles/default-avatar.gif'" alt="avatar"/>
              </div>
              Philip Cooper<span className="stars"></span>

            </td>

            <td className="col-2 align-right no-gutters"><span style={{fontSize: "1.15em"}}>23</span><small className="mr-2">.26</small>
              <div className="top-ambassador-ssi-evolution-wrapper"><span className="fe fe-arrow-down-right" style={{color:"#e63757"}}></span><span className="top-ambassador-ssi-evolution-value">-2.04%</span></div>
            </td>

            <td className="col-2 align-right">
              <div className="row align-items-center no-gutters">
                <div className="col-auto mr-3">
                    <span>28%</span>
                </div>
                <div className="col" style={{fontSize: "0"}}>
                  
          <div className="battery-jauge battery-jauge_danger"></div>
          <div className="battery-jauge battery-jauge_danger"></div>
          <div className="battery-jauge battery-jauge"></div>
          <div className="battery-jauge battery-jauge"></div>
          <div className="battery-jauge"></div>
        
                </div>
              </div>
            </td>

            <td className="col-1 align-right">-</td>

            <td className="col-1 align-right">-</td>

            <td className="col-1 align-right">
              -
              <img className="ml-2" src="/assets/img/magic.png" width="18" alt="magic"/>
            </td>

            <td className="col-1 align-right">
              8
              <img data-toggle="tooltip" title="70%" className="ml-2" src="/assets/img/dashboard/sentiment-up.svg" width="18" alt="sent"/>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  </div>

    </div>


</div><div className="stent-widget" data-manual-load="" data-name="top-network-growth" data-widget-guid="4c065624-7691-4884-a536-95984fbd094a"><div className="card dashboard-table">
  <div className="card-header">
    <h4 className="card-header-title">
      Top Network growth
    </h4>
  </div>
  <div className="card-body p-0">
    <div className="table-responsive">
      <table className="table table-vcenter mb-0">
        <thead>
          <tr className="d-flex">
            <th className="col-2">AMBASSADOR</th>
            <th className="col-5">SOURCE</th>
            <th className="col-1">STATUS</th>
            <th className="col-1 text-right">
              <span data-toggle="tooltip" title="INVITES SENT">SENT</span>
            </th>
            <th className="col-1 text-right">
              <span data-toggle="tooltip" title="ACCEPTED CONNECTIONS">ACCEPTED</span>
              <span className="fe fe-chevron-down sort-button sort-button_active"></span>
            </th>
            <th className="col-2 text-right">
              <span data-toggle="tooltip" title="ACCEPTANCE RATIO">RATIO</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="d-flex">
            <td className="col-2">
              <div className="avatar avatar-xs mr-2">
                <img src="https://s3.amazonaws.com/stentavatars/ACoAAA-q4hMBLwO_XntcZyW5GXN9eSG5X6YGPkA" className="avatar-img rounded-circle" style={{width: "26px",height: "26px"}} onerror="this.src='/assets/img/avatars/profiles/default-avatar.gif'" alt='prof'/>
              </div>
              Philip Cooper
            </td>

            <td className="col-5 text-break">
              Salon Vision 2020 Leads
              <a href="finder-form?id=5c069de5a0cdffddc76f7681fcc40fc4" className="ui-link">
                <i className="fe fe-link ml-2"></i>
              </a>
            </td>

            <td className="col-1">
                <span className="badge badge-danger">Stopped</span>
                <a href="campaigns-form?id=e7ffbe4a446f473a8d2c54cdb3259f2a&amp;flow=nurture-linkedin-cohort" className="ui-link">
                  <i className="fe fe-send ml-2"></i>
                </a>
            </td>

            <td className="col-1 align-right">
              236
            </td>

            <td className="col-1 align-right">
              59
            </td>

            <td className="col-2 align-right">
              25%
              <div className="ml-2" style={{fontSize: 0}}>
                
          <div className="battery-jauge battery-jauge_danger"></div>
          <div className="battery-jauge battery-jauge_danger"></div>
          <div className="battery-jauge battery-jauge"></div>
          <div className="battery-jauge battery-jauge"></div>
          <div className="battery-jauge"></div>
        
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

    </div>


</div><div className="stent-widget" data-manual-load="" data-name="top-campaigns" data-widget-guid="00c8ecfc-3874-4f87-8f38-f86076fdda47"><div className="card dashboard-table">
  <div className="card-header">
    <h4 className="card-header-title">
      Top Campaigns
    </h4>
  </div>
  <div className="card-body p-0">
    <div className="table-responsive">
      <table className="table table-vcenter mb-0">
        <thead>
          <tr className="d-flex">
            <th className="col-2">PROGRAM<span className="fe fe-chevron-down sort-button"></span></th>
            <th className="col-2">CAMPAIGN<span className="fe fe-chevron-down sort-button sort-button_active"></span></th>
            <th className="col-2">SENDER<span className="fe fe-chevron-down sort-button sort-button_active"></span></th>
            <th className="col-2 text-right">
              <span>REMAINING</span>
            </th>
            <th className="col-2 text-right">
              <span>SENT</span>
            </th>
            <th className="col-1 text-right">
              <span>CLICKS</span>
            </th>
            <th className="col-1 text-right">
              <span>REPLIES</span>
            </th>
          </tr>
        </thead>
        <tbody>
        <tr className="d-flex">
          <td className="col">
            <div className="alert alert-light" role="alert" style={{width: "100%", margin: 0}}>
              There is not enough data to display this chart. Please retry later.
            </div>
          </td>
        </tr>
      </tbody>
      </table>
    </div>
  </div>

    </div>


</div><div className="stent-widget" data-manual-load="" data-name="top-awareness" data-widget-guid="844d794d-bcc9-47f5-9b8e-c6e6d07fd9e6"><div className="card dashboard-table">
  <div className="card-header">
    <h4 className="card-header-title">
      Top Awareness
    </h4>
  </div>
  <div className="card-body p-0">
    <div className="table-responsive">
      <table className="table table-vcenter mb-0">
        <thead>
          <tr className="d-flex">
            <th className="col-7"><span>MEDIA</span></th>
            <th className="col-1 text-right"><span>VIEWS</span></th>
            <th className="col-1 text-right"><span>LIKES</span></th>
            <th className="col-1 text-right"><span>COMMENTS</span></th>
            <th className="col-1 text-right">
              <span>CLICKS</span><span className="fe fe-chevron-down sort-button sort-button_active"></span>
            </th>
            <th className="col-1 text-right"><span>REPLIES</span></th>
          </tr>
        </thead>
        <tbody>
        <tr className="d-flex">
          <td className="col">
            <div className="alert alert-light" role="alert" style={{width: "100%", margin: 0}}>
              There is not enough data to display this chart. Please retry later.
            </div>
          </td>
        </tr>
      </tbody>
      </table>
    </div>
  </div>

    </div>


</div></div></div></div>
    </div>
  </div> 
   )
}

export default Dashboard