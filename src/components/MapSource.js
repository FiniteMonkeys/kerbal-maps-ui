import React from "react"

class MapSource extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      packOptions: this.convertOptions(this.props.packOptions, "pack"),
      pack: this.props.pack,
      onPackChange: this.props.onPackChange,
      bodyOptions: this.convertOptions(this.props.bodyOptions, "body"),
      mapBody: this.props.mapBody,
      onBodyChange: this.props.onBodyChange,
      styleOptions: this.convertOptions(this.props.styleOptions, "style"),
      mapStyle: this.props.mapStyle,
      onStyleChange: this.props.onStyleChange
    }
  }

  setPackOptions(newOptions) {
    this.setState({
      packOptions: this.convertOptions(newOptions, "pack"),
      pack: undefined
    })
  }

  setPack(newPack) {
    this.setState({
      pack: newPack
    })
  }

  setBodyOptions(newOptions) {
    this.setState({
      bodyOptions: this.convertOptions(newOptions, "body"),
      mapBody: undefined
    })
  }

  setMapBody(newBody) {
    this.setState({
      mapBody: newBody
    })
  }

  setStyleOptions(newOptions) {
    this.setState({
      styleOptions: this.convertOptions(newOptions, "style"),
      mapStyle: undefined
    })
  }

  setMapStyle(newStyle) {
    this.setState({
      mapStyle: newStyle
    })
  }

  convertOptions(options, prefix) {
    return options.map((option) =>
      <option key={`${prefix}_` + option.value} value={option.value} disabled={option.disabled ? true : false}>{option.label}</option>
    )
  }

  handleInputChange(event) {
    const target = event.target
    const name = target.name
    const value = target.value

    this.setState({
      [name]: value
    })

    switch (name) {
      case 'pack':
        if (this.state.onPackChange) {
          this.state.onPackChange(value)
        }
        break;

      case 'mapBody':
        if (this.state.onBodyChange) {
          this.state.onBodyChange(value)
        }
        break;

      case 'mapStyle':
        if (this.state.onStyleChange) {
          this.state.onStyleChange(value)
        }
        break;

      default:
        break;
    }
  }

  render() {
    return (
      <form>
        <div className="form-group">
          <label>
            Planet Pack
            <select name="pack" value={this.state.pack} className="form-control" onChange={this.handleInputChange.bind(this)}>
              {this.state.packOptions}
            </select>
          </label>
        </div>
        <div className="form-group">
          <label>
            Body
            <select name="mapBody" value={this.state.mapBody} className="form-control" onChange={this.handleInputChange.bind(this)}>
              {this.state.bodyOptions}
            </select>
          </label>
        </div>
        <div className="form-group">
          <label>
            Style
            <select name="mapStyle" value={this.state.mapStyle} className="form-control" onChange={this.handleInputChange.bind(this)}>
              {this.state.styleOptions}
            </select>
          </label>
        </div>
      </form>
    )
  }
}

export default MapSource
