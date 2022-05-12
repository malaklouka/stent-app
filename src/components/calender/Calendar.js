import React from 'react'

const Calendar = () => {
    return (
        <div className="container-fluid">
            <div style={{ marginLeft: "300px" }}>
                <div className="row">
                    <div className="col">
                        <div className="header">
                            <div className="header-body">
                                <div className="row align-items-end">
                                    <div className="col"><h6 className="header-pretitle">Content</h6>
                                        <h1 className="header-title">Calendar</h1></div>
                                    <div className="col-auto">
                                        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#chooseModal">Schedule a post</button></div></div></div></div></div></div>
                <div className="row d-flex" style={{ position: "relative", minHeight: "100px" }}>
                    <div className="col h-100" id="planification">
                        <div className="stent-calendar fc fc-ltr fc-unthemed" id="planification-calendar">
                            <div className="fc-toolbar fc-header-toolbar">
                                <div className="fc-left"><div>
                                    <button type="button" className="fc-prev-button fc-button fc-button-primary" aria-label="prev">
                                        <span className="fc-icon fc-icon-chevron-left"></span></button><h2>May 2022</h2>
                                    <button type="button" className="fc-next-button fc-button fc-button-primary" aria-label="next">
                                        <span className="fc-icon fc-icon-chevron-right"></span></button></div></div>
                                <div className="fc-center"></div>
                                <div className="fc-right"><div className="fc-button-group">
                                    <button type="button" className="fc-listMonth-button fc-button fc-button-primary">list</button>
                                    <button type="button" className="fc-dayGridWeek-button fc-button fc-button-primary">week</button>
                                    <button type="button" className="fc-dayGridMonth-button fc-button fc-button-primary fc-button-active">month</button></div></div></div>
                            <div className="fc-view-container">
                                <div className="fc-view fc-dayGridMonth-view fc-dayGrid-view" >
                                    <table className=""><thead className="fc-head"><tr>
                                        <td className="fc-head-container fc-widget-header">
                                            <div className="fc-row fc-widget-header">
                                                <table className="">
                                                    <thead>
                                                        <tr>
                                                            <th className="fc-day-header fc-widget-header fc-sun">
                                                                <span>Sunday</span></th>
                                                            <th className="fc-day-header fc-widget-header fc-mon">
                                                                <span>Monday</span></th>
                                                            <th className="fc-day-header fc-widget-header fc-tue">
                                                                <span>Tuesday</span></th><th className="fc-day-header fc-widget-header fc-wed">
                                                                <span>Wednesday</span></th>
                                                            <th className="fc-day-header fc-widget-header fc-thu">
                                                                <span>Thursday</span></th><th className="fc-day-header fc-widget-header fc-fri">
                                                                <span>Friday</span></th><th className="fc-day-header fc-widget-header fc-sat">
                                                                <span>Saturday</span></th></tr></thead></table></div></td></tr></thead>
                                        <tbody className="fc-body">
                                            <tr>
                                                <td className="fc-widget-content">
                                                    <div className="fc-scroller fc-day-grid-container" style={{ overflow: "hidden", height: "738.344px" }}>
                                                        <div className="fc-day-grid"><div className="fc-row fc-week fc-widget-content fc-rigid" style={{ height: "147px" }}>
                                                            <div className="fc-bg"><table className="">
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="fc-day fc-widget-content fc-sun fc-past" data-date="2022-05-01"></td>
                                                                        <td className="fc-day fc-widget-content fc-mon fc-past" data-date="2022-05-02"></td>
                                                                        <td className="fc-day fc-widget-content fc-tue fc-past" data-date="2022-05-03"></td>
                                                                        <td className="fc-day fc-widget-content fc-wed fc-past" data-date="2022-05-04"></td>
                                                                        <td className="fc-day fc-widget-content fc-thu fc-past" data-date="2022-05-05"></td>
                                                                        <td className="fc-day fc-widget-content fc-fri fc-past" data-date="2022-05-06"></td>
                                                                        <td className="fc-day fc-widget-content fc-sat fc-today " data-date="2022-05-07"></td></tr>
                                                                </tbody></table></div><div className="fc-content-skeleton"><table>
                                                                    <thead>
                                                                        <tr>
                                                                            <td className="fc-day-top fc-sun fc-past" data-date="2022-05-01">
                                                                                <span className="fc-day-number">1</span></td>
                                                                            <td className="fc-day-top fc-mon fc-past" data-date="2022-05-02"><span className="fc-day-number">2</span></td>
                                                                            <td className="fc-day-top fc-tue fc-past" data-date="2022-05-03"><span className="fc-day-number">3</span></td>
                                                                            <td className="fc-day-top fc-wed fc-past" data-date="2022-05-04"><span className="fc-day-number">4</span></td>
                                                                            <td className="fc-day-top fc-thu fc-past" data-date="2022-05-05"><span className="fc-day-number">5</span></td>
                                                                            <td className="fc-day-top fc-fri fc-past" data-date="2022-05-06"><span className="fc-day-number">6</span></td>
                                                                            <td className="fc-day-top fc-sat fc-today " data-date="2022-05-07">
                                                                                <span className="fc-day-number">7</span></td></tr></thead>
                                                                    <tbody><tr><td></td><td></td><td></td>
                                                                        <td></td><td></td><td></td><td></td></tr></tbody></table></div></div>
                                                            <div className="fc-row fc-week fc-widget-content fc-rigid" style={{ height: "147px" }}>
                                                                <div className="fc-bg"><table className=""><tbody><tr><td className="fc-day fc-widget-content fc-sun fc-future" data-date="2022-05-08"></td>
                                                                    <td className="fc-day fc-widget-content fc-mon fc-future" data-date="2022-05-09"></td>
                                                                    <td className="fc-day fc-widget-content fc-tue fc-future" data-date="2022-05-10"></td>
                                                                    <td className="fc-day fc-widget-content fc-wed fc-future" data-date="2022-05-11"></td>
                                                                    <td className="fc-day fc-widget-content fc-thu fc-future" data-date="2022-05-12"></td>
                                                                    <td className="fc-day fc-widget-content fc-fri fc-future" data-date="2022-05-13"></td>
                                                                    <td className="fc-day fc-widget-content fc-sat fc-future" data-date="2022-05-14"></td>
                                                                </tr></tbody></table>
                                                                </div>
                                                                <div className="fc-content-skeleton"><table><thead><tr>
                                                                    <td className="fc-day-top fc-sun fc-future" data-date="2022-05-08">
                                                                        <span className="fc-day-number">8</span></td><td className="fc-day-top fc-mon fc-future" data-date="2022-05-09">
                                                                        <span className="fc-day-number">9</span></td><td className="fc-day-top fc-tue fc-future" data-date="2022-05-10">
                                                                        <span className="fc-day-number">10</span></td><td className="fc-day-top fc-wed fc-future" data-date="2022-05-11">
                                                                        <span className="fc-day-number">11</span></td><td className="fc-day-top fc-thu fc-future" data-date="2022-05-12">
                                                                        <span className="fc-day-number">12</span></td><td className="fc-day-top fc-fri fc-future" data-date="2022-05-13"><span className="fc-day-number">13</span></td>
                                                                    <td className="fc-day-top fc-sat fc-future" data-date="2022-05-14"><span className="fc-day-number">14</span>
                                                                    </td></tr></thead><tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                                                                    </tbody></table></div></div><div className="fc-row fc-week fc-widget-content fc-rigid" style={{ height: "147px" }}><div className="fc-bg"><table className=""><tbody><tr><td className="fc-day fc-widget-content fc-sun fc-future" data-date="2022-05-15"></td>
                                                                        <td className="fc-day fc-widget-content fc-mon fc-future" data-date="2022-05-16"></td>
                                                                        <td className="fc-day fc-widget-content fc-tue fc-future" data-date="2022-05-17"></td>
                                                                        <td className="fc-day fc-widget-content fc-wed fc-future" data-date="2022-05-18"></td>
                                                                        <td className="fc-day fc-widget-content fc-thu fc-future" data-date="2022-05-19"></td>
                                                                        <td className="fc-day fc-widget-content fc-fri fc-future" data-date="2022-05-20"></td>
                                                                        <td className="fc-day fc-widget-content fc-sat fc-future" data-date="2022-05-21"></td></tr></tbody></table>
                                                                    </div><div className="fc-content-skeleton"><table><thead><tr><td className="fc-day-top fc-sun fc-future" data-date="2022-05-15">
                                                                        <span className="fc-day-number">15</span></td>
                                                                        <td className="fc-day-top fc-mon fc-future" data-date="2022-05-16"><span className="fc-day-number">16</span>
                                                                        </td><td className="fc-day-top fc-tue fc-future" data-date="2022-05-17">
                                                                            <span className="fc-day-number">17</span></td>
                                                                        <td className="fc-day-top fc-wed fc-future" data-date="2022-05-18"><span className="fc-day-number">18</span>
                                                                        </td><td className="fc-day-top fc-thu fc-future" data-date="2022-05-19"><span className="fc-day-number">19</span>
                                                                        </td><td className="fc-day-top fc-fri fc-future" data-date="2022-05-20"><span className="fc-day-number">20</span>
                                                                        </td><td className="fc-day-top fc-sat fc-future" data-date="2022-05-21"><span className="fc-day-number">21</span>
                                                                        </td></tr></thead><tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                                                                        </tbody></table></div></div><div className="fc-row fc-week fc-widget-content fc-rigid" style={{ height: "147px" }}>
                                                                <div className="fc-bg"><table className=""><tbody><tr><td className="fc-day fc-widget-content fc-sun fc-future" data-date="2022-05-22"></td>
                                                                    <td className="fc-day fc-widget-content fc-mon fc-future" data-date="2022-05-23"></td>
                                                                    <td className="fc-day fc-widget-content fc-tue fc-future" data-date="2022-05-24"></td>
                                                                    <td className="fc-day fc-widget-content fc-wed fc-future" data-date="2022-05-25"></td>
                                                                    <td className="fc-day fc-widget-content fc-thu fc-future" data-date="2022-05-26"></td>
                                                                    <td className="fc-day fc-widget-content fc-fri fc-future" data-date="2022-05-27"></td>
                                                                    <td className="fc-day fc-widget-content fc-sat fc-future" data-date="2022-05-28"></td></tr>
                                                                </tbody></table></div><div className="fc-content-skeleton"><table><thead><tr><td className="fc-day-top fc-sun fc-future" data-date="2022-05-22">
                                                                    <span className="fc-day-number">22</span></td>
                                                                    <td className="fc-day-top fc-mon fc-future" data-date="2022-05-23"><span className="fc-day-number">23</span>
                                                                    </td><td className="fc-day-top fc-tue fc-future" data-date="2022-05-24"><span className="fc-day-number">24</span></td><td className="fc-day-top fc-wed fc-future" data-date="2022-05-25"><span className="fc-day-number">25</span></td><td className="fc-day-top fc-thu fc-future" data-date="2022-05-26"><span className="fc-day-number">26</span></td><td className="fc-day-top fc-fri fc-future" data-date="2022-05-27"><span className="fc-day-number">27</span></td><td className="fc-day-top fc-sat fc-future" data-date="2022-05-28"><span className="fc-day-number">28</span></td></tr></thead><tbody><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></div>
                                                            </div>
                                                            <div className="fc-row fc-week fc-widget-content fc-rigid" style={{ height: "150px" }}>
                                                                <div className="fc-bg"><table className=""><tbody><tr>
                                                                    <td className="fc-day fc-widget-content fc-sun fc-future" data-date="2022-05-29"></td>
                                                                    <td className="fc-day fc-widget-content fc-mon fc-future" data-date="2022-05-30"></td>
                                                                    <td className="fc-day fc-widget-content fc-tue fc-future" data-date="2022-05-31"></td>
                                                                    <td className="fc-day fc-widget-content fc-wed fc-other-month fc-future" data-date="2022-06-01"></td>
                                                                    <td className="fc-day fc-widget-content fc-thu fc-other-month fc-future" data-date="2022-06-02"></td>
                                                                    <td className="fc-day fc-widget-content fc-fri fc-other-month fc-future" data-date="2022-06-03"></td>
                                                                    <td className="fc-day fc-widget-content fc-sat fc-other-month fc-future" data-date="2022-06-04"></td>
                                                                </tr></tbody></table></div><div className="fc-content-skeleton"><table><thead><tr>
                                                                    <td className="fc-day-top fc-sun fc-future" data-date="2022-05-29">
                                                                        <span className="fc-day-number">29</span></td>
                                                                    <td className="fc-day-top fc-mon fc-future" data-date="2022-05-30">
                                                                        <span className="fc-day-number">30</span></td>
                                                                    <td className="fc-day-top fc-tue fc-future" data-date="2022-05-31">
                                                                        <span className="fc-day-number">31</span></td>
                                                                    <td className="fc-day-top fc-wed fc-other-month fc-future" data-date="2022-06-01">
                                                                        <span className="fc-day-number">1</span></td>
                                                                    <td className="fc-day-top fc-thu fc-other-month fc-future" data-date="2022-06-02">
                                                                        <span className="fc-day-number">2</span></td>
                                                                    <td className="fc-day-top fc-fri fc-other-month fc-future" data-date="2022-06-03">
                                                                        <span className="fc-day-number">3</span></td>
                                                                    <td className="fc-day-top fc-sat fc-other-month fc-future" data-date="2022-06-04">
                                                                        <span className="fc-day-number">4</span>
                                                                    </td>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                        </td>
                                                                        <td>

                                                                        </td>
                                                                    <td>
                                                                    </td><td></td><td></td><td></td><td></td></tr></tbody></table></div></div></div>
                                                    </div></td></tr></tbody>
                                                    </table>
                                                    </div>
                                                    </div>
                                                    </div>
                                                    </div>
                                                    </div>
                                                    </div>
        </div>
    )


}

export default Calendar