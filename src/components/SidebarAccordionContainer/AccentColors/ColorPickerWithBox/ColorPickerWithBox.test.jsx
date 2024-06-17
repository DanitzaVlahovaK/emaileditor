import React from "react";
import { cleanup, screen } from "@testing-library/react";
import { render } from "../../../../../../tests/unitTests/testSetup";
import ColorPickerWithBox from "./ColorPickerWithBox";
import rootStore from "../../../../../../mobx/stores/rootStore";

const renderComponent = (getLabelText, dataTestId) =>
  render(
    <ColorPickerWithBox
      colorValue="#bababa"
      getLabelText={getLabelText}
      dataTestId={dataTestId}
    />
  );

beforeEach(() => {
  rootStore.commonStore.setSelectedLocationId(3);
});

afterEach(cleanup);

describe("<ColorPickerWithBox />", () => {
  it("Renders ColorPickerWithBox", () => {
    renderComponent(jest.fn(), "test");

    const container = screen.getByTestId("colorPickerWithBoxContainer");

    expect(container).toBeInTheDocument();
  });

  it("Renders Checkbox with proper label", () => {
    const checkboxLabel = "Test label";
    const getLabelText = jest.fn(() => checkboxLabel);
    renderComponent(getLabelText, "themeColor");
    const themeColorContainer = screen.getByTestId("themeColorLabel");

    expect(themeColorContainer).toHaveTextContent(checkboxLabel);
  });
});
