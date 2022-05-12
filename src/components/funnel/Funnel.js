import React from 'react'

const Funnel = () => {
  return (
<div class="container-fluid d-flex h-100 flex-column">
    <div style={{marginLeft:"300px"}}>
<div class="row"><div class="col">
<div class="header"><div class="header-body">
<div class="row align-items-end"><div class="col">
<h6 class="header-pretitle">Audience</h6>
<h1 class="header-title">Funnel</h1>
</div>
</div>
</div> 
</div>
</div>
</div>
<div class="row" id="funnel-filter-wrapper">
<div class="col">
<div class="d-flex align-items-center mb-2">
<span id="filter-by-title">FILTER BY</span>
<div class="form-group mr-3">
<select class="form-control filter-table filter-table-select" id="filter-table-campaign-program">
<option value="">Program</option>
<option value="Salon Virtuel Vision 2020">Salon Virtuel Vision 2020</option>
<option value="test">test</option>
</select>
</div> 
<div class="form-group mr-3">
<select class="form-control filter-table filter-table-select" id="filter-table-campaign-name">
<option value="">Campaign</option>
<option value="Salon Virtuel Vision 2020">Salon Virtuel Vision 2020</option>
<option value="test">test</option></select></div>
<div class="form-group mr-3">
    <select class="form-control filter-table filter-table-select" id="filter-table-member">
        <option value="">Ambassador</option>
        <option value="ACoAAA-q4hMBLwO_XntcZyW5GXN9eSG5X6YGPkA">Philip Cooper</option>
        </select></div><div class="form-group mr-3"><div class="d-inline-flex">
            <div class="form-control filter-table filter-table-select" id="dateFilter" data-start="1651434177228" data-end="1651952577234"><span id="dateFilter-input">Last 7 Days</span> <i class="fe fe-chevron-down"></i></div></div></div><div class="form-group">
                <input type="button" value="Reset filters" class="form-control btn btn-outline-primary btn-sm d-none" id="filter-reset" style={{fontSize: "12px", padding:"3px 10px" ,height: "29px"}}/></div>
                <div class="form-group" style={{marginLeft: "auto"}}>
                    <div class="dropdown"><a class="btn btn-sm btn-outline-primary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{fontSize: "12px"}}>Export</a><div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink" x-placement="bottom-end" id="export-actions"><a class="dropdown-item" href="#" data-url="lane=invited">All people who've been invited</a> <a class="dropdown-item" href="#" data-url="lane=connected">All people who accepted the invite</a> <a class="dropdown-item" href="#" data-url="lane=engaged">All people who engaged</a> <a class="dropdown-item" href="#" data-url="lane=replied">All people who replied</a> <a class="dropdown-item" href="#" data-url="lane=clicked">All people who clicked on a link</a> <a class="dropdown-item" href="#" data-url="lane=nurtured">All people who received a message</a> <a class="dropdown-item" href="#" data-url="lane=messaged">All people who received a nurture message</a> <a class="dropdown-item" href="#" data-url="lane=welcomed">All people who received a welcome message</a> <a class="dropdown-item" href="#" data-url="lane=leads">All people who've been marked as leads</a></div></div></div></div></div></div><div class="row d-flex" id="funnel-wrapper"><div class="col slot-col" id="slot-invited" style={{}}><div class="slot-header"><div class="slot-header-title">Invited</div><div class="slot-header-icon"><i class="fe fe-user-plus"></i></div></div><div class="card"><div class="card-body contacts" style={{height: "167.406px"}}>
    </div>
    <div class="card-footer"><h2>Pending invites</h2>
    <strong data-value="0">0</strong></div>
    </div></div><div class="col slot-col" id="slot-connected"><div class="slot-header"><div class="slot-header-title">Connected</div><div class="slot-header-icon slot-header-icon-secondary"><i class="fe fe-users"></i></div></div><div class="card"><div class="card-body contacts" style={{height: "167.406px"}}>
    </div><div class="card-footer"><h2>Not nurtured yet</h2><strong data-value="0">0</strong></div></div><div class="funnel-ratio-wrapper"><h4>0%</h4><div class="funnel-ratio-data-wrapper"><div class="funnel-ratio-in"><img src="/assets/img/funnel/down-in.svg"/><div class="number"><span>0</span></div></div><div class="funnel-ratio-center"><div class="funnel-ratio-jauge d-flex justify-content-center"><div class="battery-jauge battery-jauge_danger"></div><div class="battery-jauge"></div><div class="battery-jauge"></div><div class="battery-jauge"></div><div class="battery-jauge"></div></div></div><div class="funnel-ratio-out"><img src="/assets/img/funnel/down-out.svg"/><div class="number"><span>0</span></div></div></div></div></div><div class="col slot-col" id="slot-nurtured"><div class="slot-header"><div class="slot-header-title">Nurtured</div><div class="slot-header-icon"><i class="fe fe-mail"></i></div></div><div class="card"><div class="card-body contacts" style={{height: "167.406px"}}>
    </div><div class="card-footer"><h2>Not engaged yet</h2><strong data-value="0">0</strong></div></div><div class="funnel-ratio-wrapper"><h4>0%</h4><div class="funnel-ratio-data-wrapper"><div class="funnel-ratio-in"><img src="/assets/img/funnel/down-in.svg"/><div class="number"><span>0</span></div></div><div class="funnel-ratio-center"><div class="funnel-ratio-jauge d-flex justify-content-center"><div class="battery-jauge battery-jauge_danger"></div><div class="battery-jauge"></div><div class="battery-jauge"></div><div class="battery-jauge"></div><div class="battery-jauge"></div></div></div><div class="funnel-ratio-out"><img src="/assets/img/funnel/down-out.svg"/><div class="number"><span>0</span></div></div></div></div></div><div class="col slot-col" id="slot-engaged"><div class="slot-header"><div class="slot-header-title">Engaged</div><div class="slot-header-icon slot-header-icon-secondary"><i class="fe fe-edit"></i></div></div><div class="card"><div class="card-body contacts" style={{height: "167.406px"}}>
    </div><div class="card-footer"><h2>Potential leads</h2><strong data-value="0">0</strong></div></div><div class="funnel-ratio-wrapper"><h4>0%</h4><div class="funnel-ratio-data-wrapper"><div class="funnel-ratio-in"><img src="/assets/img/funnel/down-in.svg"/><div class="number"><span>0</span></div></div><div class="funnel-ratio-center"><div class="funnel-ratio-jauge d-flex justify-content-center"><div class="battery-jauge battery-jauge_danger"></div><div class="battery-jauge"></div><div class="battery-jauge"></div><div class="battery-jauge"></div><div class="battery-jauge"></div></div></div><div class="funnel-ratio-out"><img src="/assets/img/funnel/down-out.svg"/><div class="number"><span>0</span></div></div></div></div></div><div class="col slot-col" id="slot-leads"><div class="slot-header"><div class="slot-header-title">Leads</div><div class="slot-header-icon"><i class="fe fe-star"></i></div></div><div class="card"><div class="card-body contacts" style={{height: "167.406px"}}>
    </div><div class="card-footer"><h2>Hot leads</h2><strong data-value="0">0</strong></div></div><div class="funnel-ratio-wrapper"><h4>0%</h4><div class="funnel-ratio-data-wrapper"><div class="funnel-ratio-in"><img src="/assets/img/funnel/down-in.svg"/><div class="number"><span>0</span></div></div><div class="funnel-ratio-center"><div class="funnel-ratio-jauge d-flex justify-content-center"><div class="battery-jauge battery-jauge_danger"></div><div class="battery-jauge"></div><div class="battery-jauge"></div><div class="battery-jauge"></div><div class="battery-jauge"></div></div></div><div class="funnel-ratio-out"><img src="/assets/img/funnel/down-out.svg"/><div class="number"><span>0</span></div></div></div></div></div></div></div></div>
    )
}

export default Funnel