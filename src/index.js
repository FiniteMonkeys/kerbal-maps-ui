import React from "react"
import ReactDOM from "react-dom"
import "./index.css"

class MainMap extends React.Component {
  render() {
    return (
      <div id="main-map" className="leaflet-sidebar-map"></div>
    )
  }
}

// ========================================

ReactDOM.render(
  <MainMap />,
  document.getElementById("root")
)
