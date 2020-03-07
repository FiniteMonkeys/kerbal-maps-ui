import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import { CRS } from "leaflet"
import { Map as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet"

class MainMap extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      lat: -0.1027,
      lon: -74.5754,
      zoom: 5,
      body: "kerbin",
      style: "sat"
    }
  }

  render() {
    const position = [this.state.lat, this.state.lon]

    return (
      <LeafletMap center={position} zoom={this.state.zoom} preferCanvas={true} crs={CRS.EPSG4326}>
        <TileLayer
          attribution="Map data: crowdsourced | Imagery: © 2011-2020 Take-Two Interactive, Inc."
          url="https://d3kmnwgldcmvsd.cloudfront.net/tiles/{body}/{style}/{z}/{x}/{y}.png"
          body={this.state.body}
          style={this.state.style}
          maxZoom={7}
          tms={true}
          maxNativeZoom={7}
          minNativeZoom={0}
          noWrap={true}
        />
        <Sidebar />
      </LeafletMap>
    )
  }
}

class Sidebar extends React.Component {
  render() {
    return (
      <div id="sidebar" className="leaflet-sidebar collapsed">
        <div className="leaflet-sidebar-tabs">
          <ul role="tablist">
            <li><a href="#sidebar-home" role="tab" title="Credits"><i className="fa fa-bars"></i></a></li>
            <li><a href="#sidebar-profile" role="tab" title="Profile"><i className="fas fa-user"></i></a></li>
            <li><a href="#sidebar-body-style" role="tab" title="Body and Style"><i className="fas fa-globe"></i></a></li>
            <li><a href="#sidebar-search" role="tab" title="Search"><i className="fas fa-search-location"></i></a></li>
            <li><a href="#sidebar-overlays" role="tab" title="Overlays"><i className="fas fa-layer-group"></i></a></li>
            <li className="disabled"><a href="#sidebar-upload" role="tab" title="Upload"><i className="fas fa-upload"></i></a></li>
          </ul>

          <ul role="tablist">
            <li><a href="#sidebar-help" role="tab" title="Help"><i className="fas fa-question"></i></a></li>
          </ul>
        </div>

        <div className="leaflet-sidebar-content">
          <SidebarHomePane />
          <SidebarProfilePane />
          <SidebarBodyStylePane />
          <SidebarSearchPane />
          <SidebarOverlaysPane />
          <SidebarUploadPane />
          <SidebarHelpPane />
        </div>
      </div>
    )
  }
}

class SidebarBodyStylePane extends React.Component {
  render() {
    return (
      <div></div>
    )
  }
}

class SidebarHelpPane extends React.Component {
  render() {
    return (
      <div></div>
    )
  }
}

class SidebarHomePane extends React.Component {
  render() {
    return (
      <div id="sidebar-home" className="leaflet-sidebar-pane">
        <h1 className="leaflet-sidebar-header">
          Kerbal Maps 0.0.1
          <span className="leaflet-sidebar-close"><i className="fa fa-caret-left"></i></span>
        </h1>

        <div className="container-fluid">
          <div className="row">
            <div className="col credits">
              <h2>Kerbal Maps</h2>
              <p>is made possible by</p>
              <ul>
                <li>
                  <a href="https://www.kerbalspaceprogram.com/">Kerbal Space Program</a>
                  for map data, as well as being the reason for doing this in the first place
                </li>
                <li>
                  <a href="https://github.com/Sigma88/Sigma-Cartographer">Sigma-Cartographer</a>
                  for a means of extracting the map data
                </li>
                <li>
                  <a href="https://github.com/jrossignol/WaypointManager">Waypoint Manager</a>
                  and KSP forum user
                  <a href="https://forum.kerbalspaceprogram.com/index.php?/profile/133118-miles-teg/">Miles Teg</a>
                  for the list of waypoints for anomalies currently baked in
                </li>
                <li>
                  <a href="https://leafletjs.com">Leaflet.js</a>
                  for a means to display the map images, with the help of
                  <ul>
                    <li><a href="https://github.com/Leaflet/Leaflet.Graticule">Leaflet.Graticule</a></li>
                    <li><a href="https://github.com/nickpeihl/leaflet-sidebar-v2">leaflet-sidebar-v2</a></li>
                    <li><a href="https://github.com/Leaflet/Leaflet.Icon.Glyph">Leaflet.Icon.Glyph</a></li>
                    <li><a href="https://github.com/consbio/Leaflet.HtmlLegend">Leaflet.HtmlLegend</a></li>
                  </ul>
                </li>
                <li>
                  <a href="https://getbootstrap.com">Bootstrap</a>
                  for styling and layout
                </li>
                <li>
                  <a href="https://fontawesome.com">Font Awesome</a>
                  for graphics
                </li>
                <li>
                  <a href="https://realfavicongenerator.net/">RealFaviconGenerator</a>
                  for icons
                </li>
                <li>
                  <a href="http://ksp.deringenieur.net">ksp.deringenieur.net</a>
                  (and <a href="http://www.kerbalmaps.com">kerbalmaps.com</a> before it) for the original idea
                </li>
                <li>
                  <a href="https://hexdocs.pm/distillery/">Distillery</a>
                  for making it possible to package the app so it can be made public
                </li>
                <li>
                  <a href="https://heroku.com/">Heroku</a>
                  for hosting the app
                </li>
                <li>
                  <a href="https://aws.amazon.com/">Amazon AWS</a>
                  for hosting the map images
                </li>
                <li>
                  <a href="https://github.com/WizardOfOgz">Andy Ogzewalla</a>
                  for JS mentorship, wizardry, and general awesomeness
                </li>
                <li>
                  <a href="https://forum.kerbalspaceprogram.com/index.php?/profile/202640-rowbear/">RowBear</a>
                  for contributing CPU cycles and person-hours to extracting map tiles for the JNSQ planet pack
                </li>
              </ul>
              <p>kerbal maps is a <a href="http://finitemonkeys.org/">finitemonkeys</a> joint</p>
              <p>
                Copyright © 2018-2020 Craig S. Cottingham and subject to
                <a href="http://www.apache.org/licenses/LICENSE-2.0">the Apache License, Version 2.0</a>,
                except where stated otherwise.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class SidebarOverlaysPane extends React.Component {
  render() {
    return (
      <div></div>
    )
  }
}

class SidebarProfilePane extends React.Component {
  render() {
    return (
      <div></div>
    )
  }
}

class SidebarSearchPane extends React.Component {
  render() {
    return (
      <div></div>
    )
  }
}

class SidebarUploadPane extends React.Component {
  render() {
    return (
      <div></div>
    )
  }
}

// ========================================

ReactDOM.render(
  <MainMap id="main-map" />,
  document.getElementById("root")
)
