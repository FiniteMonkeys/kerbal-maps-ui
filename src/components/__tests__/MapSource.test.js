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
    .toJSON();

  expect(tree).toMatchSnapshot();
});
