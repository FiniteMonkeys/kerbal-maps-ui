import React from "react"
import MapSource from "../MapSource"
import renderer from "react-test-renderer"

it("renders correctly", () => {
  const packOptions = [
    {value: "a", label: "A"},
    {value: "b", label: "B"},
    {value: "c", label: "C"}
  ]

  const bodyOptions = [
    {value: "d", label: "D"},
    {value: "e", label: "E"},
    {value: "f", label: "F"}
  ]

  const styleOptions = [
    {value: "g", label: "G"},
    {value: "h", label: "H"},
    {value: "i", label: "I"}
  ]

  const tree = renderer
    .create(
      <MapSource packOptions={packOptions} bodyOptions={bodyOptions} styleOptions={styleOptions} />
    )
    .toJSON()

  expect(tree).toMatchSnapshot()
})

describe("setPackOptions", () => {
  it("also clears the selected pack", () => {
    const optionsBefore = [
      {value: "a", label: "A"},
      {value: "b", label: "B"},
      {value: "c", label: "C"}
    ]
    const optionsAfter = [
      {value: "d", label: "D"},
      {value: "e", label: "E"},
      {value: "f", label: "F"}
    ]
    const optionsPlaceholder = [
      {value: "g", label: "G"},
      {value: "h", label: "H"},
      {value: "i", label: "I"}
    ]

    const component = renderer.create(
      <MapSource packOptions={optionsBefore} pack="a" bodyOptions={optionsPlaceholder} styleOptions={optionsPlaceholder} />
    )
    const instance = component.getInstance()
    expect(instance.state.pack).toEqual("a")

    instance.setPackOptions(optionsAfter)
    expect(instance.state.pack).toBeUndefined()
  })
})

describe("setPack", () => {
  it("sets the selected pack", () => {
    const optionsPlaceholder = [
      {value: "a", label: "A"},
      {value: "b", label: "B"},
      {value: "c", label: "C"}
    ]

    const component = renderer.create(
      <MapSource packOptions={optionsPlaceholder} bodyOptions={optionsPlaceholder} styleOptions={optionsPlaceholder} />
    )
    const instance = component.getInstance()
    expect(instance.state.pack).toBeUndefined()

    instance.setPack("a")
    expect(instance.state.pack).toEqual("a")
  })
})

describe("setBodyOptions", () => {
  it("also clears the selected body", () => {
    const optionsBefore = [
      {value: "a", label: "A"},
      {value: "b", label: "B"},
      {value: "c", label: "C"}
    ]
    const optionsAfter = [
      {value: "d", label: "D"},
      {value: "e", label: "E"},
      {value: "f", label: "F"}
    ]
    const optionsPlaceholder = [
      {value: "g", label: "G"},
      {value: "h", label: "H"},
      {value: "i", label: "I"}
    ]

    const component = renderer.create(
      <MapSource packOptions={optionsPlaceholder} bodyOptions={optionsBefore} mapBody="b" styleOptions={optionsPlaceholder} />
    )
    const instance = component.getInstance()
    expect(instance.state.mapBody).toEqual("b")

    instance.setBodyOptions(optionsAfter)
    expect(instance.state.mapBody).toBeUndefined()
  })
})

describe("setMapBody", () => {
  it("sets the selected body", () => {
    const optionsPlaceholder = [
      {value: "a", label: "A"},
      {value: "b", label: "B"},
      {value: "c", label: "C"}
    ]

    const component = renderer.create(
      <MapSource packOptions={optionsPlaceholder} bodyOptions={optionsPlaceholder} styleOptions={optionsPlaceholder} />
    )
    const instance = component.getInstance()
    expect(instance.state.mapBody).toBeUndefined()

    instance.setMapBody("b")
    expect(instance.state.mapBody).toEqual("b")
  })
})

describe("setStyleOptions", () => {
  it("also clears the selected style", () => {
    const optionsBefore = [
      {value: "a", label: "A"},
      {value: "b", label: "B"},
      {value: "c", label: "C"}
    ]
    const optionsAfter = [
      {value: "d", label: "D"},
      {value: "e", label: "E"},
      {value: "f", label: "F"}
    ]
    const optionsPlaceholder = [
      {value: "g", label: "G"},
      {value: "h", label: "H"},
      {value: "i", label: "I"}
    ]

    const component = renderer.create(
      <MapSource packOptions={optionsPlaceholder} bodyOptions={optionsPlaceholder} styleOptions={optionsBefore} mapStyle="c" />
    )
    const instance = component.getInstance()
    expect(instance.state.mapStyle).toEqual("c")

    instance.setStyleOptions(optionsAfter)
    expect(instance.state.mapStyle).toBeUndefined()
  })
})

describe("setMapStyle", () => {
  it("sets the selected style", () => {
    const optionsPlaceholder = [
      {value: "a", label: "A"},
      {value: "b", label: "B"},
      {value: "c", label: "C"}
    ]

    const component = renderer.create(
      <MapSource packOptions={optionsPlaceholder} bodyOptions={optionsPlaceholder} styleOptions={optionsPlaceholder} />
    )
    const instance = component.getInstance()
    expect(instance.state.mapStyle).toBeUndefined()

    instance.setMapStyle("c")
    expect(instance.state.mapStyle).toEqual("c")
  })
})
