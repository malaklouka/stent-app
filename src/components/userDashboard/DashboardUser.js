import React from 'react'
import Chart from "react-apexcharts";

const DashboardUser = () => {
  const options= {
    chart: {
      id: "Time",
      name: "all ambassadors",
      type: "line",
      background: '#24104f',


    },
    fill: {
      colors: ['#24104f', '', '']
    },

    colors1: ['#702eea','#e3e3e3'],
    markers: {
      size: 0,
      colors: undefined,
      strokeColors: '#545454',
      fillColor: '#e3e3e3',
      strokeColor: '#fff',
      strokeWidth: 2,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: "circle",
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      onClick: undefined,
      onDblClick: undefined,
      showNullDataPoints: true,
      hover: {
        size: undefined,
        sizeOffset: 3
      }},
    labels: {
      enabled: true,
    },
    grid: {
      borderColor: 'transparant',
      row: {
        colors: ['#24104f'], // takes an array which will be repeated on columns
      },
    },
 
    xaxis: {
      categories: ['09 Apr', '10 Apr', '11Apr', '12Apr', '13 Apr', '14 Apr', '15 Apr', '16 Apr', '17 Apr','18 Apr', '19 Apr', '20Apr', '21 Apr', '22 Apr', '23 Apr', '24 Apr', '25 Apr', '26 Apr','27 Apr', '28 Apr', '29 Apr', ' 30 Apr', '1 May', '2 May', '3 May', '4 May ', '5 May', '6 May', '7 May', '8 May'],
  

    },
    yaxis: {
      tickAmount: 10,

    
    },
 
  }
  const options1= {
 
    chart: {
      id: "Time",
      type: "area",
      background: 'white',


    },
    colors: ['#702eea','#FFFF00'],
    markers: {
      size: 0,
      colors: undefined,
      strokeColors: '#545454',
      fillColor: '#e3e3e3',
      strokeColor: '#fff',
      strokeWidth: 2,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: "circle",
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      onClick: undefined,
      onDblClick: undefined,
      showNullDataPoints: true,
      hover: {
        size: undefined,
        sizeOffset: 3
      }},
    dataLabels: {
      enabled: true,
    },
    grid: {
      borderColor: 'transparant',
      row: {
        colors: ['white'], // takes an array which will be repeated on columns
      },
    },
 
    xaxis: {
      categories: ['09 Apr', '10 Apr', '11Apr', '12Apr', '13 Apr', '14 Apr', '15 Apr', '16 Apr', '17 Apr','18 Apr', '19 Apr', '20Apr', '21 Apr', '22 Apr', '23 Apr', '24 Apr', '25 Apr', '26 Apr','27 Apr', '28 Apr', '29 Apr', ' 30 Apr', '1 May', '2 May', '3 May', '4 May ', '5 May', '6 May', '7 May', '8 May'],
    },
    yaxis: {
    
      min: 0,
      max: 30
    },
 
  }

  const options2= {
 
    chart: {
      id: "Clicks",
      type: "area",
      background: 'white',


    },
    colors: ['#702eea'],
    markers: {
      size: 0,
      colors: undefined,
      strokeColors: '#545454',
      fillColor: '#e3e3e3',
      strokeColor: '#fff',
      strokeWidth: 2,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: "circle",
      radius: 2,
      offsetX: 0,
      offsetY: 0,
      onClick: undefined,
      onDblClick: undefined,
      showNullDataPoints: true,
      hover: {
        size: undefined,
        sizeOffset: 3
      }},
    dataLabels: {
      enabled: true,
    },
    grid: {
      borderColor: 'transparant',
      row: {
        colors: ['white'], // takes an array which will be repeated on columns
      },
    },
 
    xaxis: {
      categories: ['09 Apr', '10 Apr', '11Apr', '12Apr', '13 Apr', '14 Apr', '15 Apr', '16 Apr', '17 Apr','18 Apr', '19 Apr', '20Apr', '21 Apr', '22 Apr', '23 Apr', '24 Apr', '25 Apr', '26 Apr','27 Apr', '28 Apr', '29 Apr', ' 30 Apr', '1 May', '2 May', '3 May', '4 May ', '5 May', '6 May', '7 May', '8 May'],
    },
    yaxis: {
    
      min: 0,
      max: 30
    },
 
  }


 const  series= [
  {
    name: "Task",
    data: [28, 28, 28, 28,28, 28,26, 32, 32, 32, 32,32, 32, 32, 32,32, 0],
    min: 0,
    max: 33
  }

]
const series1 =[{
  name: 'invite accepted',
  data: [0,0]
}, {
  name: 'invite sent',
  data: [0,0]
}]
const  series2= [
  {
    name: "clicks",
    data: [0, 0, 0, 0,0, 0,0, 0, 0, 0, 0,0, 0, 0, 0,0, 0],
    min: 0,
    max: 33
  }

]



  
  return (
<div className="main-content"><div className="header bg-dark pb-5">
  <div className="container-fluid"><div className="header-body">
    <div className="row align-items-end">
      <div className="col">
      <h6 className="header-pretitle text-secondary">Team</h6>
      <h1 className="header-title text-white">SSI Evolution</h1></div>
<div className="col-auto"><ul className="nav nav-tabs header-tabs ssiHeaderChartSwitcher">
  <li className="nav-item" data-chart-name="ssiEvolution">
    <a href="#" className="nav-link text-center active" data-toggle="tab">
      <h6 className="header-pretitle text-secondary" style={{textAlign: "left"}}>Filter</h6>
      <select id="filter-identities">
        <option value="">All ambassadors</option>
      <option value="ACoAAA-q4hMBLwO_XntcZyW5GXN9eSG5X6YGPkA">Cooper Philip</option>
      </select></a></li></ul></div></div></div>
      <div className="header-footer">
        <div className="chart">
          <div className="stent-widget" data-manual-load="" data-name="dashboard-header-chart" style={{height: "300px"}} data-widget-guid="7307bb86-1085-4f3d-9bf2-f822133d8d3a">
            <div className="chartjs-size-monitor">
              <div className="chartjs-size-monitor-expand">
                <div className=""></div></div>
                <div className="chartjs-size-monitor-shrink">
                  <div className=""></div></div></div> 
              
               

                <div style={{backgroundColor:"#24104f"}}>  <Chart
              options={options}
              series={series}
              type="area"
              height={300}
             
            />
            </div>
     



</div></div></div></div></div>
<div className="container-fluid mt-n6">
  <div className="row"><div className="col-12 col-xl-12">
    <div className="card"><div className="card-header">
      <div className="row align-items-center">
        <div className="col">
          <h4 className="card-header-title">Invites</h4>
          </div></div></div><div className="card-body">
            <div className="chart">
              <div className="stent-widget" data-manual-load="" data-name="dashboard-invite-chart" style={{height: "300px"}} data-widget-guid="fe9e65ae-f707-4350-b20f-90ca6aa6826d">
                <div className="chartjs-size-monitor">
                  <div className="chartjs-size-monitor-expand">
                    <div className=""></div></div>
                    <div className="chartjs-size-monitor-shrink">
                      <div className=""></div></div></div>
                      <div style={{backgroundColor:"white"}}>  <Chart
              options={options1}
              series={series1}
              type="area"
              height={350}
             
            />
            </div>

</div></div></div></div></div></div>
<div className="row">
  <div className="col">
  <div className="card">
    <div className="card-header">
      <h4 className="card-header-title">Clicks</h4></div>
      <div className="card-body">
        <div className="stent-widget" data-manual-load="" data-name="dashboard-click-chart" style={{height: "300px"}} data-widget-guid="4302a28f-d84f-4160-8133-b6969e9a2344">
          <div className="chartjs-size-monitor">
            <div className="chartjs-size-monitor-expand">
              <div className=""></div></div>
              <div className="chartjs-size-monitor-shrink">
                <div className=""></div></div></div>
          

                <div style={{backgroundColor:""}}>  <Chart
              options={options2}
              series={series2}
              type="area"
              height={300}
             
            />
            </div>
</div></div></div></div></div></div>
</div>  )
}

export default DashboardUser