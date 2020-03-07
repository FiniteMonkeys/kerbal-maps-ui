import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import { CRS } from "leaflet"
import { Map as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet"
import { Sidebar, Tab } from "react-leaflet-sidebarv2"

class KMMap extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // map state
      lat: -0.1027,
      lon: -74.5754,
      zoom: 5,
      body: "kerbin",
      style: "sat",

      // sidebar state
      collapsed: true,
      selected: "sidebar-home",

      // user state
      currentUser: undefined,
    }
  }

  onOpen(id) {
    this.setState({
      collapsed: false,
      selected: id
    })
  }

  onClose() {
    this.setState({
      collapsed: true
    })
  }

  render() {
    const position = [this.state.lat, this.state.lon]

    return (
      <div>
        <Sidebar
          id="sidebar"
          position="left"
          collapsed={this.state.collapsed}
          selected={this.state.selected}
          closeIcon="fa fa-caret-left"
          onOpen={this.onOpen.bind(this)}
          onClose={this.onClose.bind(this)}
        >
          <Tab id="sidebar-home" header="Kerbal Maps 0.0.1" icon="fa fa-bars">
            <div className="container-fluid">
              <div className="row">
                <div className="col credits">
                  <h2>Kerbal Maps</h2>
                  <p>is made possible by</p>
                  <ul>
                    <li><a href="https://www.kerbalspaceprogram.com/">Kerbal Space Program</a> for the stock map data, as well as being the reason for doing this in the first place</li>
                    <li><a href="https://github.com/Sigma88/Sigma-Cartographer">Sigma-Cartographer</a> for a means of extracting the map data</li>
                    <li><a href="https://github.com/jrossignol/WaypointManager">Waypoint Manager</a> and KSP forum user <a href="https://forum.kerbalspaceprogram.com/index.php?/profile/133118-miles-teg/">Miles Teg</a> for the list of waypoints for anomalies currently baked in</li>
                    <li>
                      <a href="https://leafletjs.com">Leaflet.js</a> for a means to display the map images, with the help of
                      <ul>
                        <li><a href="https://github.com/Leaflet/Leaflet.Graticule">Leaflet.Graticule</a></li>
                        <li><a href="https://github.com/nickpeihl/leaflet-sidebar-v2">leaflet-sidebar-v2</a></li>
                        <li><a href="https://github.com/Leaflet/Leaflet.Icon.Glyph">Leaflet.Icon.Glyph</a></li>
                        <li><a href="https://github.com/consbio/Leaflet.HtmlLegend">Leaflet.HtmlLegend</a></li>
                      </ul>
                    </li>
                    <li><a href="https://getbootstrap.com">Bootstrap</a> for styling and layout</li>
                    <li><a href="https://fontawesome.com">Font Awesome</a> for graphics</li>
                    <li><a href="https://realfavicongenerator.net/">RealFaviconGenerator</a> for icons</li>
                    <li><a href="http://ksp.deringenieur.net">ksp.deringenieur.net</a> (and <a href="http://www.kerbalmaps.com">kerbalmaps.com</a> before it) for the original idea</li>
                    <li><a href="https://hexdocs.pm/distillery/">Distillery</a> for making it possible to package the app so it can be made public</li>
                    <li><a href="https://heroku.com/">Heroku</a> for hosting the app</li>
                    <li><a href="https://aws.amazon.com/">Amazon AWS</a> for hosting the map images</li>
                    <li><a href="https://github.com/WizardOfOgz">Andy Ogzewalla</a> for JS mentorship, wizardry, and general awesomeness</li>
                    <li><a href="https://forum.kerbalspaceprogram.com/index.php?/profile/202640-rowbear/">RowBear</a> for contributing CPU cycles and person-hours to extracting map tiles for the JNSQ planet pack</li>
                  </ul>
                  <p>kerbal maps is a <a href="http://finitemonkeys.org/">finitemonkeys</a> joint</p>
                  <p>Copyright © 2018-2020 Craig S. Cottingham and subject to <a href="http://www.apache.org/licenses/LICENSE-2.0">the Apache License, Version 2.0</a>, except where stated otherwise.</p>
                </div>
              </div>
            </div>
          </Tab>
          <Tab id="sidebar-profile" header={this.state.currentUser || "Profile"} icon="fas fa-user">
            {/*
              if currentUser do
                render user content
              else
            */}

            <div class="container-fluid">
              <div class="row">
                <div class="col">
                  <div class="accordion" id="accordionNoUser">

                    <div class="card">
                      <div class="card-header" id="headingNoUserLogin">
                        <h2 class="mb-0 align-middle">
                          <button class="btn btn-link align-middle" type="button" data-toggle="collapse" data-target="#collapseNoUserLogin" aria-expanded="true" aria-controls="collapseNoUserLogin">
                            Have a login?
                          </button>
                        </h2>
                      </div>
                      <div id="collapseNoUserLogin" class="collapse show" aria-labelledby="headingNoUserLogin" data-parent="#accordionNoUser">
                        <div class="card-body">
                          <form action="#" method="POST">
                            <div class="form-group">
                              <label for="sidebar-profile-no-user-email">Email</label>
                              <input class="form-control" id="sidebar-profile-no-user-email" name="user[email]" placeholder="gene.kerman@ksc.kerbin" type="text" />
                            </div>

                            <div class="form-group">
                              <label for="sidebar-profile-no-user-password">Password</label>
                              <input class="form-control" id="sidebar-profile-no-user-password" name="user[password]" placeholder="password" type="password" />
                            </div>

                            <div class="form-group float-right">
                              <button type="submit" class="btn btn-primary">Sign in</button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    <div class="card">
                      <div class="card-header" id="headingNoUserCreate">
                        <h2 class="mb-0 align-middle">
                          <button class="btn btn-link align-middle collapsed" type="button" data-toggle="collapse" data-target="#collapseNoUserCreate" aria-expanded="false" aria-controls="collapseNoUserCreate">
                            Want a login?
                          </button>
                        </h2>
                      </div>
                      <div id="collapseNoUserCreate" class="collapse" aria-labelledby="headingNoUserCreate" data-parent="#accordionNoUser">
                        <div class="card-body">
                          <del>Create one.</del>
                          <p>New account creation is disabled at this time.</p>
                        </div>
                      </div>
                    </div>

                    <div class="card">
                      <div class="card-header" id="headingNoUserReset">
                        <h2 class="mb-0 align-middle">
                          <button class="btn btn-link align-middle collapsed" type="button" data-toggle="collapse" data-target="#collapseNoUserReset" aria-expanded="false" aria-controls="collapseNoUserReset">
                            Forgot your password?
                          </button>
                        </h2>
                      </div>
                      <div id="collapseNoUserReset" class="collapse" aria-labelledby="headingNoUserReset" data-parent="#accordionNoUser">
                        <div class="card-body">
                          <del>Reset it.</del>
                          <p>Password reset is disabled at this time.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/*
            end if
          */}
          </Tab>
          <Tab id="sidebar-body-style" header="Body and Style" icon="fas fa-globe">
          </Tab>
          <Tab id="sidebar-search" header="Search" icon="fas fa-search-location">
          </Tab>
          <Tab id="sidebar-overlays" header="Overlays" icon="fas fa-layer-group">
          </Tab>
          <Tab id="sidebar-upload" header="Upload" icon="fas fa-upload">
          </Tab>
          <Tab id="sidebar-help" header="Help" icon="fas fa-question" anchor="bottom">
          </Tab>
        </Sidebar>
        <LeafletMap
          className="sidebar-map"
          center={position}
          zoom={this.state.zoom}
          zoomControl={true}
          preferCanvas={true}
          crs={CRS.EPSG4326}
        >
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
        </LeafletMap>
      </div>
    )
  }
}

// ========================================

ReactDOM.render(
  <KMMap id="main-map" />,
  document.getElementById("root")
)
