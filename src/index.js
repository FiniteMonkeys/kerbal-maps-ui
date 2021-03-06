import React from "react"
import ReactDOM from "react-dom"

import { CRS } from "leaflet"
import { Map as LeafletMap, TileLayer, withLeaflet } from "react-leaflet"
import { Sidebar, Tab } from "react-leaflet-sidebarv2"

import { BoxZoomControl } from "react-leaflet-box-zoom"
import { ReactLeafletZoomIndicator } from "react-leaflet-zoom-indicator"

import Credits from "./components/Credits"
import MapSource from "./components/MapSource"

import "./index.css"

/********************************************************************
 ** begin react-leaflet-graticule
 ********************************************************************/

import { Layer } from "leaflet"
import { MapLayer } from "react-leaflet"

/********************************************************************
 ** end react-leaflet-graticule
 ********************************************************************/

const ZoomIndicator = withLeaflet(ReactLeafletZoomIndicator)

/********************************************************************
 ** begin react-leaflet-graticule
 ********************************************************************/

class ReactLeafletGraticule extends MapLayer {
  constructor(props, context) {
    super(props)

    this.updateVariables = this.updateVariables.bind(this)

    this.defaultOptions = {
      showLabel: true,
      opacity: 1,
      weight: 0.8,
      color: "#aaa",
      font: "12px Verdana",
      fontColor: "#aaa",
      dashArray: [3, 3],
      // lngLineCurved: 0,
      // latLineCurved: 0,
      zoomInterval: [
        {start: 0, end: 2, interval: 30},
        {start: 3, end: 3, interval: 20},
        {start: 4, end: 4, interval: 10},
        {start: 5, end: 5, interval:  5},
        {start: 6, end: 7, interval:  1}
      ]
    }

    this.updateVariables(props)

    this.map = null // context.map || props.leaflet.map
    this.canvas = null
    this.currZoom = null
    this.currLatInterval = null
    this.currLngInterval = null
  }

  updateVariables(props) {
    this.options = (props && props.options) || this.defaultOptions
  }

  createLeafletElement() {
    const _ = this;
    const GraticuleRenderer = Layer.extend({

      onAdd: function (map) {
        _.map = map

        if (!_.canvas) {
          _.initCanvas()
        }

        _.map._panes.overlayPane.appendChild(_.canvas)

        _.map.on("viewreset", _.reset, _)
        _.map.on("move", _.reset, _)
        _.map.on("moveend", _.reset, _)

        // if (_.map.options.zoomAnimation && L.Browser.any3d) {
        //   _.map.on("zoomanim", _.animateZoom, _)
        // }

        _.reset()
      },

      onRemove: function (map) {
        if (_.map === map) {
          if (_.canvas.parentNode) {
            _.canvas.parentNode.removeChild(_.canvas)
          }

          _.canvas = null

          _.map.off("viewreset", _.reset, _)
          _.map.off("move", _.reset, _)
          _.map.off("moveend", _.reset, _)

          // if (_.map.options.zoomAnimation) {
          //   _.map.off("zoomanim", _.animateZoom, _)
          // }

          _.map = null
        }
      },

      addTo: function (map) {
        map.addLayer(this)
        return this
      }
    })
    return new GraticuleRenderer(this.options)
  }

  updateLeafletElement(fromProps, toProps) {
    console.log("in ReactLeafletGraticule.updateLeafletElement")

    this.updateVariables(toProps)
    this.reset()
  }

  initCanvas() {
    const canvas = document.createElement("canvas")

    // if (this.map.options.zoomAnimation && L.Browser.any3d) {
    canvas.classList.add("leaflet-zoom-animated")
    // }
    // else {
    //   canvas.classList.add("leaflet-zoom-hide")
    // }

    // this.updateOpacity()

    canvas.onSelectStart = function() { return false }
    canvas.onMouseMove = function() { return false }
    canvas.onLoad = this.onCanvasLoad.bind(this)

    this.canvas = canvas
  }

  onCanvasLoad() {
    this.leafletElement.fire("load")
  }

  reset() {
    const size = this.map.getSize()
    const lt = this.map.containerPointToLayerPoint([0, 0])

    this.canvas._leaflet_pos = lt
    // if (Browser.any3d) {
      // setTransform(canvas, lt)
      this.canvas.style["transform"] = `translate3d(${lt.x}px,${lt.y}px,0)`
    // }
    // else {
      // this.canvas.style.left = lt.x + "px"
      // this.canvas.style.top = lt.y + "px"
    // }

    this.canvas.width = size.x
    this.canvas.height = size.y
    // this.canvas.style.width = size.x + "px"
    // this.canvas.style.height = size.y + "px"

    this.calcInterval()

    this.draw(true)
  }

  calcInterval() {
    const zoom = this.map.getZoom()
    if (zoom !== this.currZoom) {
      this.currLngInterval = null
      this.currLatInterval = null
      this.currZoom = zoom
    }

    if (!this.currLngInterval) {
      try {
        for (let idx in this.options.zoomInterval) {
          const dict = this.options.zoomInterval[idx]
          if ((dict.start <= zoom) && (dict.end >= zoom)) {
            this.currLngInterval = dict.interval
            break
          }
        }
      }
      catch (e) {
        this.currLngInterval = 0
      }
    }

    if (!this.currLatInterval) {
      try {
        for (let idx in this.options.zoomInterval) {
          const dict = this.options.zoomInterval[idx]
          if ((dict.start <= zoom) && (dict.end >= zoom)) {
            this.currLatInterval = dict.interval
            break
          }
        }
      }
      catch (e) {
        this.currLatInterval = 0
      }
    }
  }

  draw(label) {
    if (!this.canvas || !this.map) {
      return
    }

    const ctx = this.canvas.getContext("2d")

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.lineWidth = this.options.weight
    ctx.strokeStyle = this.options.color
    ctx.fillStyle = this.options.fontColor
    ctx.setLineDash(this.options.dashArray)
    if (this.options.font) {
      ctx.font = this.options.font
    }

    // const txtWidth = ctx.measureText("0").width
    // const txtHeight = 12
    // try {
    //   let fontSize = ctx.font.trim().split(" ")[0]
    //   txtHeight = parsePxToInt(fontSize)
    // }
    // catch (e) {
    // }

    let lt = this.map.containerPointToLatLng({x: 0, y: 0})
    let rb = this.map.containerPointToLatLng({x: this.canvas.width, y: this.canvas.height})

    let pointPerLat = (lt.lat - rb.lat) / (this.canvas.height * 0.2)
    let pointPerLon = (rb.lng - lt.lng) / (this.canvas.width * 0.2)
    if (isNaN(pointPerLat) || isNaN(pointPerLon)) {
      return
    }

    if (pointPerLat < 1) {
      pointPerLat = 1
    }
    if (pointPerLon < 1) {
      pointPerLon = 1
    }

    if (rb.lat < -90) {
      rb.lat = -90
    }
    else {
      rb.lat = parseInt(rb.lat - pointPerLat, 10)
    }

    if (lt.lat > 90) {
      lt.lat = 90
    }
    else {
      lt.lat = parseInt(lt.lat + pointPerLat, 10)
    }

    if ((lt.lng > 0) && (rb.lng < 0)) {
      rb.lng += 360
    }
    rb.lng = parseInt(rb.lng + pointPerLon, 10)
    lt.lng = parseInt(lt.lng - pointPerLon, 10)

    if (this.currLatInterval) {
      for (let i = this.currLatInterval; i <= lt.lat; i += this.currLatInterval) {
        if (i >= rb.lat) {
          this.drawLatitudeLine(ctx, i, lt.lng, rb.lng, label)
        }
      }

      for (let i = 0; i >= rb.lat; i -= this.currLatInterval) {
        if (i <= lt.lat) {
          this.drawLatitudeLine(ctx, i, lt.lng, rb.lng, label)
        }
      }
    }

    if (this.currLngInterval) {
      for (let i = this.currLngInterval; i <= rb.lng; i += this.currLngInterval) {
        if (i >= lt.lng) {
          this.drawLongitudeLine(ctx, i, lt.lat, rb.lat, label)
        }
      }

      for (let i = 0; i >= lt.lng; i -= this.currLngInterval) {
        if (i <= rb.lng) {
          this.drawLongitudeLine(ctx, i, lt.lat, rb.lat, label)
        }
      }
    }
  }

  drawLatitudeLine(ctx, tick, lngLeft, lngRight, label) {
    const leftEnd = this.latLngToCanvasPoint({lat: tick, lng: lngLeft})
    const str = this.formatLatitude(tick)
    const txtWidth = ctx.measureText(str).width
    const txtHeight = 12

    // if (curvedLat) {
    //   ...
    // }
    // else {
      const rightEnd = this.latLngToCanvasPoint({lat: tick, lng: lngRight})
      // if (curvedLon) {
      //   ...
      // }

      ctx.beginPath()
      ctx.moveTo(leftEnd.x + 1, leftEnd.y)
      ctx.lineTo(rightEnd.x - 1, rightEnd.y)
      ctx.stroke()

      if (this.options.showLabel && label) {
        const yBaseline = leftEnd.y + (txtHeight / 2) - 2
        ctx.fillText(str, 0, yBaseline)
        ctx.fillText(str, this.canvas.width - txtWidth, yBaseline)
      }
    // }
  }

  drawLongitudeLine(ctx, tick, latTop, latBottom, label) {
    const bottomEnd = this.latLngToCanvasPoint({lat: latBottom, lng: tick})
    const str = this.formatLongitude(tick)
    const txtWidth = ctx.measureText(str).width
    const txtHeight = 12

    // if (curvedLat) {
    //   ...
    // }
    // else {
      const topEnd = this.latLngToCanvasPoint({lat: latTop, lng: tick})
      // console.log(`topEnd = ${JSON.stringify(topEnd)}`)

      // if (curvedLon) {
      //   ...
      // }

      ctx.beginPath()
      ctx.moveTo(topEnd.x, topEnd.y + 1)
      ctx.lineTo(bottomEnd.x, bottomEnd.y - 1)
      ctx.stroke()

      if (this.options.showLabel && label) {
        ctx.fillText(str, topEnd.x - (txtWidth / 2), txtHeight + 1)
        ctx.fillText(str, bottomEnd.x - (txtWidth / 2), this.canvas.height - 3)
      }
    // }
  }

  latLngToCanvasPoint(latLng) {
    let projectedPoint = this.map.project(latLng)
    projectedPoint._subtract(this.map.getPixelOrigin())
    projectedPoint._add(this.map._getMapPanePos())
    return projectedPoint
  }

  formatLatitude(value) {
    // if (this.options.latFormatTickLabel) {
    //   return this.options.latFormatTickLabel(value)
    // }

    if (value < 0) {
      return `${value * -1}S`
    }
    else if (value > 0) {
      return `${value}N`
    }

    return `${value}`
  }

  formatLongitude(value) {
    // if (this.options.lngFormatTickLabel) {
    //   return this.options.lngFormatTickLabel(value)
    // }

    if (value < -180) {
      return `${value + 360}W`
    }
    else if (value === -180) {
      return "180"
    }
    else if ((value < 0) && (value > -180)) {
      return `${value * -1}W`
    }
    else if ((value > 0) && (value < 180)) {
      return `${value}E`
    }
    else if (value > 180) {
      return `${360 - value}W`
    }

    return `${value}`
  }
}

const Graticule = withLeaflet(ReactLeafletGraticule)

/********************************************************************
 ** end react-leaflet-graticule
 ********************************************************************/

class KMMap extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // map state
      mapPack: "tiles",
      attribution: "Map data: crowdsourced | Imagery: © 2011-2020 Take-Two Interactive, Inc.",
      mapBody: "kerbin",
      mapStyle: "sat",
      zoom: 5,
      lat:   0.0000,
      lon: -90.0000,

      // sidebar state
      collapsed: true,
      selected: "sidebar-home",

      // user state
      currentUser: undefined
    }
  }

  componentDidMount() {
    this.setMapPack("tiles")
    this.setMapBody("kerbin")
    this.setMapStyle("sat")
  }

  packOptions() {
    return [
      {value: "tiles", label: "(stock)"},
      {value: "jnsq/tiles", label: "JNSQ"}
    ]
  }

  bodyOptions() {
    switch (this.state.mapPack) {
      case "jnsq/tiles":
        return [
          {value: "moho", label: "Moho"},
          {value: "eve", label: "Eve"},
          {value: "gilly", label: "Gilly"},
          {value: "kerbin", label: "Kerbin"},
          {value: "mun", label: "Mun"},
          {value: "minmus", label: "Minmus"},
          {value: "duna", label: "Duna"},
          {value: "ike", label: "Ike"},
          {value: "edna", label: "Edna"},
          {value: "dak", label: "Dak"},
          {value: "dres", label: "Dres"},
          {value: "jool", label: "Jool", disabled: true},
          {value: "laythe", label: "Laythe"},
          {value: "vall", label: "Vall"},
          {value: "tylo", label: "Tylo"},
          {value: "bop", label: "Bop"},
          {value: "pol", label: "Pol"},
          {value: "lindor", label: "Lindor", disabled: true},
          {value: "krel", label: "Krel"},
          {value: "aden", label: "Aden"},
          {value: "huygen", label: "Huygen"},
          {value: "riga", label: "Riga"},
          {value: "talos", label: "Talos"},
          {value: "eeloo", label: "Eeloo"},
          {value: "celes", label: "Celes"},
          {value: "tam", label: "Tam"},
          {value: "hamek", label: "Hamek"},
          {value: "nara", label: "Nara"},
          {value: "amos", label: "Amos"},
          {value: "enon", label: "Enon"},
          {value: "prax", label: "Prax"}
        ]

      default:
        return [
          {value: "moho", label: "Moho"},
          {value: "eve", label: "Eve"},
          {value: "gilly", label: "Gilly"},
          {value: "kerbin", label: "Kerbin"},
          {value: "mun", label: "Mun"},
          {value: "minmus", label: "Minmus"},
          {value: "duna", label: "Duna"},
          {value: "ike", label: "Ike"},
          {value: "dres", label: "Dres"},
          {value: "jool", label: "Jool", disabled: true},
          {value: "laythe", label: "Laythe"},
          {value: "vall", label: "Vall"},
          {value: "tylo", label: "Tylo"},
          {value: "bop", label: "Bop"},
          {value: "pol", label: "Pol"},
          {value: "eeloo", label: "Eeloo"}
        ]
    }
  }

  styleOptions() {
    return [
      {value: "biome", label: "Biome"},
      {value: "sat", label: "Satellite"},
      {value: "slope", label: "Slope"}
    ]
  }

  setMapPack(value) {
    let attribution = undefined
    let initialBody = undefined

    switch (value) {
      case "jnsq/tiles":
        attribution = "Map data: crowdsourced | Imagery: JNSQ, licenced by CC BY-NC-ND 3.0"
        initialBody = "kerbin"
        break

      default:
        attribution = "Map data: crowdsourced | Imagery: © 2011-2020 Take-Two Interactive, Inc."
        initialBody = "kerbin"
        break
    }

    this.setState({
      mapPack: value,
      attribution: attribution
    })

    this.setMapBody(initialBody, value)

    // alert(`pack changing to ${value}`)

    // let bodyOptions = loadBodiesForPack(value)
    // hideAllOverlays()
    // window.overlays = {} // clear out overlays for previous body
    // updateTileLayer(window)
  }

  setMapBody(value, packValue) {
    let initialLat = undefined
    let initialLon = undefined
    let initialStyle = undefined

    switch (packValue || this.state.mapPack) {
      case "jnsq/tiles":
        switch (value) {
          case "kerbin":
            initialLat =   0.0000
            initialLon = -91.8000
            initialStyle = "sat"
            break

          default:
            initialLat =   0.0000
            initialLon = -90.0000
            initialStyle = "sat"
            break
        }
        break

      default:
        switch (value) {
          case "kerbin":
            initialLat =  -0.1027
            initialLon = -74.5754
            initialStyle = "sat"
            break

          default:
            initialLat =   0.0000
            initialLon = -90.0000
            initialStyle = "sat"
            break
        }
        break
    }

    this.setState({
      mapBody: value,
      lat: initialLat,
      lon: initialLon
    })

    this.setMapStyle(initialStyle)

    // alert(`body changing to ${value}`)

    // hideAllOverlays()
    // window.overlays = {} // clear out overlays for previous body
    // updateTileLayer(window)
    // if (window.mapStyle == "biome") {
    //   loadBiomesForBody(channel, window.legendControl, window.mapBody)
    // }
  }

  setMapStyle(value) {
    this.setState({
      mapStyle: value
    })

    // alert(`style changing to ${value}`)

    // updateTileLayer(window)
    // if (window.mapStyle == "biome") {
    //   window.legendControl.addTo(window.map)
    //   loadBiomesForBody(channel, window.legendControl, window.mapBody)
    // }
    // else {
    //   window.legendControl.remove()
    // }
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

  onPackChange(value) {
    this.setMapPack(value)
  }

  onBodyChange(value) {
    this.setMapBody(value)
  }

  onStyleChange(value) {
    this.setMapStyle(value)
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
          <Tab id="sidebar-home" header="Kerbal Maps 0.5.3" icon="fa fa-bars">
            <Credits />
          </Tab>
          <Tab id="sidebar-profile" header={this.state.currentUser || "Profile"} icon="fas fa-user">
            {/*
              if currentUser do
                render user content
              else
            */}

            <div className="container-fluid">
              <div className="row">
                <div className="col">
                  <div className="accordion" id="accordionNoUser">

                    <div className="card">
                      <div className="card-header" id="headingNoUserLogin">
                        <h2 className="mb-0 align-middle">
                          <button className="btn btn-link align-middle" type="button" data-toggle="collapse" data-target="#collapseNoUserLogin" aria-expanded="true" aria-controls="collapseNoUserLogin">
                            Have a login?
                          </button>
                        </h2>
                      </div>
                      <div id="collapseNoUserLogin" className="collapse show" aria-labelledby="headingNoUserLogin" data-parent="#accordionNoUser">
                        <div className="card-body">
                          <form action="#" method="POST">
                            <div className="form-group">
                              <label htmlFor="sidebar-profile-no-user-email">Email</label>
                              <input className="form-control" id="sidebar-profile-no-user-email" name="user[email]" placeholder="gene.kerman@ksc.kerbin" type="text" />
                            </div>

                            <div className="form-group">
                              <label htmlFor="sidebar-profile-no-user-password">Password</label>
                              <input className="form-control" id="sidebar-profile-no-user-password" name="user[password]" placeholder="password" type="password" />
                            </div>

                            <div className="form-group float-right">
                              <button type="submit" className="btn btn-primary">Sign in</button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-header" id="headingNoUserCreate">
                        <h2 className="mb-0 align-middle">
                          <button className="btn btn-link align-middle collapsed" type="button" data-toggle="collapse" data-target="#collapseNoUserCreate" aria-expanded="false" aria-controls="collapseNoUserCreate">
                            Want a login?
                          </button>
                        </h2>
                      </div>
                      <div id="collapseNoUserCreate" className="collapse" aria-labelledby="headingNoUserCreate" data-parent="#accordionNoUser">
                        <div className="card-body">
                          <del>Create one.</del>
                          <p>New account creation is disabled at this time.</p>
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-header" id="headingNoUserReset">
                        <h2 className="mb-0 align-middle">
                          <button className="btn btn-link align-middle collapsed" type="button" data-toggle="collapse" data-target="#collapseNoUserReset" aria-expanded="false" aria-controls="collapseNoUserReset">
                            Forgot your password?
                          </button>
                        </h2>
                      </div>
                      <div id="collapseNoUserReset" className="collapse" aria-labelledby="headingNoUserReset" data-parent="#accordionNoUser">
                        <div className="card-body">
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
          <Tab id="sidebar-source" header="Map Source" icon="fas fa-globe">
            <div className="container-fluid">
              <div className="row">
                <div className="col">
                  <MapSource
                    key={`${this.state.mapPack}`}
                    packOptions={this.packOptions()}
                    pack={this.state.mapPack}
                    onPackChange={this.onPackChange.bind(this)}
                    bodyOptions={this.bodyOptions()}
                    mapBody={this.state.mapBody}
                    onBodyChange={this.onBodyChange.bind(this)}
                    styleOptions={this.styleOptions()}
                    mapStyle={this.state.mapStyle}
                    onStyleChange={this.onStyleChange.bind(this)}
                  />
                </div>
              </div>
            </div>
          </Tab>
          <Tab id="sidebar-search" header="Search" icon="fas fa-search-location">
            <div className="container-fluid">
              <div className="row">
                <div className="col">
                  <form action="#" method="POST">
                    <div className="form-group">
                      <input className="form-control" id="sidebar-search-query" name="query" placeholder="Coordinate or waypoint" type="text" aria-describedby="sidebar-search-query-help" />
                      <small id="sidebar-search-query-help" className="form-text text-muted">
                        Examples:
                        <ul>
                          <li>-0.1027,-74.5754</li>
                          <li>N 0.1027, W 74.5754</li>
                          <li>0.1027 N, 74.5754 W</li>
                        </ul>
                      </small>
                    </div>

                    <div className="form-group float-right">
                      <button type="submit" className="btn btn-primary">Search</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Tab>
          <Tab id="sidebar-overlays" header="Overlays" icon="fas fa-layer-group">
            <div className="container-fluid">
              <div className="row">
                <div className="col">
                  <form id="overlay-list" action="#">
                  </form>
                </div>
              </div>
            </div>
          </Tab>
          <Tab id="sidebar-upload" header="Upload" icon="fas fa-upload">
            <div className="container-fluid">
              <div className="row">
                <div className="col">
                  <form id="upload-list" action="#">
                  </form>
                </div>
              </div>
            </div>
          </Tab>
          <Tab id="sidebar-help" header="Help" icon="fas fa-question" anchor="bottom">
            <div className="container-fluid">
              <div className="row">
                <div className="col">
                  <div className="accordion" id="accordionHelp">

                    <div className="card">
                      <div className="card-header" id="headingHelpOverview">
                        <h2 className="mb-0">
                          <button className="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseHelpOverview" aria-expanded="true" aria-controls="collapseHelpOverview">
                            Overview
                          </button>
                        </h2>
                      </div>
                      <div id="collapseHelpOverview" className="collapse show" aria-labelledby="headingHelpOverview" data-parent="#accordionHelp">
                        <div className="card-body">
                          <p>Kerbal Maps is like <a href="https://maps.google.com/">Google Maps</a> for <a href="https://www.kerbalspaceprogram.com">Kerbal Space Program</a>. As you'd expect, it behaves a lot like Google Maps (or any other map webapp).</p>
                          <ul>
                            <li>Click and drag to pan the map.</li>
                            <li>Use the <i className="far fa-plus-square"></i> and <i className="far fa-minus-square"></i> buttons in the top-left corner of the map to zoom in and out.</li>
                            <li>Single click on the map to get the latitude and longitude at that point.</li>
                          </ul>
                          <p>Something that Kerbal Maps has that other map webapps don't is <em>overlays</em>. Open the Overlays sidebar pane (by clicking on the <i className="fas fa-layer-group"></i> icon) and select one or more checkboxes. Markers will be added to the map as a group belonging to that overlay. For example, the "Anomalies" overlay shows the locations of all anomalies (<a href="https://wiki.kerbalspaceprogram.com/wiki/List_of_easter_eggs">Easter eggs</a>) on Kerbin.</p>
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-header" id="headingHelpSidebar">
                        <h2 className="mb-0">
                          <button className="btn btn-link collapsed" type="button" data-toggle="collapse" data-target="#collapseHelpSidebar" aria-expanded="false" aria-controls="collapseHelpSidebar">
                            Sidebar
                          </button>
                        </h2>
                      </div>
                      <div id="collapseHelpSidebar" className="collapse" aria-labelledby="headingHelpSidebar" data-parent="#accordionHelp">
                        <div className="card-body">
                          <h3><i className="fa fa-bars"></i>&nbsp;:&nbsp;Credits</h3>
                          <p>An incomplete list of everyone and everything who helped make this possible.</p>
                          <br/>
                          <h3><i className="fas fa-user"></i>/<i className="fas fa-user-check"></i>&nbsp;:&nbsp;Profile</h3>
                          <p>If you have a username and password, you can log in here.</p>
                          <p>New account creation is disabled at this time.</p>
                          <br/>
                          <h3><i className="fas fa-globe"></i>&nbsp;:&nbsp;Body and Style</h3>
                          <p>Selecting celestial body and map style is disabled at this time.</p>
                          <br/>
                          <h3><i className="fas fa-search-location"></i>&nbsp;:&nbsp;Search</h3>
                          <p>Search is disabled at this time.</p>
                          <br/>
                          <h3><i className="fas fa-layer-group"></i>&nbsp;:&nbsp;Overlays</h3>
                          <p>Turn overlays on and off.</p>
                          <br/>
                          <h3><i className="fas fa-upload"></i>&nbsp;:&nbsp;Upload</h3>
                          <p>Upload is disabled at this time.</p>
                          <br/>
                          <h3><i className="fas fa-question"></i>&nbsp;:&nbsp;Help</h3>
                          <p>You’re reading it right now.</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

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
            key={`${this.state.mapPack},${this.state.mapBody},${this.state.mapStyle}`}
            url="https://d3kmnwgldcmvsd.cloudfront.net/{pack}/{body}/{style}/{z}/{x}/{y}.png"
            attribution={this.state.attribution}
            pack={this.state.mapPack}
            body={this.state.mapBody}
            style={this.state.mapStyle}
            maxZoom={7}
            minZoom={0}
            tms={true}
            maxNativeZoom={7}
            minNativeZoom={0}
            noWrap={true}
          />
          <BoxZoomControl position="topleft" sticky={false} />
          <ZoomIndicator head="zoom:" position="topleft" />
          <Graticule />
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
