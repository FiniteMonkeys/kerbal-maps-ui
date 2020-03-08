import React from "react"

class MapBody extends React.Component {
  constructor(props) {
    super(props)
    this.changeValue = this.changeValue.bind(this)
    this.options = this.props.options
  }

  changeValue(event) {
    this.props.onValueChange(event.target.value)
  }

  render() {
    const selectedValue = this.props.selectedValue
    const options = this.options.map((option) => <option key={"body_" + option.value} value={option.value} disabled={option.disabled ? true : false}>{option.label}</option>)

    return (
      <div className="form-group">
        <label htmlFor="select-map-body">Body</label>
        <select id="select-map-body" name="select-map-body" value={selectedValue} className="form-control" onChange={this.changeValue}>
          {options}
        </select>
      </div>
    )
  }
}

export default MapBody
