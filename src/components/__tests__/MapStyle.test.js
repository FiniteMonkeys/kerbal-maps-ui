import React from "react"
import MapStyle from "../MapStyle"
import renderer from "react-test-renderer"

it("renders correctly", () => {
  const options = [
    {value: "a", label: "A"},
    {value: "b", label: "B"},
    {value: "c", label: "C"}
  ]

  const tree = renderer
    .create(
      <MapStyle options={options} selectedValue={"a"} />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
