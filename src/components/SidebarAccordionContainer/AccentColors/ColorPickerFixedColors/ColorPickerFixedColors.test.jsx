import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen, cleanup, fireEvent } from "@testing-library/react";
import { render } from "../../../../../../tests/unitTests/testSetup";
import ColorPickerFixedColors from "./ColorPickerFixedColors";
import rootStore from "../../../../../../mobx/stores/rootStore";

const renderComponent = (mockFn, getLabelText = jest.fn()) =>
  render(
    <ColorPickerFixedColors
      updateFunction={mockFn}
      dataTestId="themeColor"
      getLabelText={getLabelText}
    />
  );

beforeEach(() => {
  rootStore.commonStore.setSelectedLocationId(3);
});

afterEach(cleanup);

describe("<ColorPickerFixedColors />", () => {
  it("Renders ColorPickerFixedColors", () => {
    renderComponent();

    const container = screen.getByTestId("colorPickerFixedColorsContainer");

    expect(container).toBeInTheDocument();
  });

  it("Opens select popup and selects first option", () => {
    const mockStoreUpdateFn = jest.fn();

    renderComponent(mockStoreUpdateFn);

    const select = screen.getByTestId("themeColorSelect").childNodes[0];

    expect(select).toBeInTheDocument();

    fireEvent.mouseDown(select.childNodes[0]);

    const firstOption = screen.getByTestId("colorPickerFixedColorsOption-0");

    expect(firstOption).toBeInTheDocument();

    fireEvent.click(firstOption);

    expect(mockStoreUpdateFn).toHaveBeenCalled();
  });

  it("Opens select popup and skips update, because there's no update function", () => {
    renderComponent();

    const select = screen.getByTestId("themeColorSelect").childNodes[0];

    expect(select).toBeInTheDocument();

    fireEvent.mouseDown(select.childNodes[0]);

    const firstOption = screen.getByTestId("colorPickerFixedColorsOption-0");

    expect(firstOption).toBeInTheDocument();

    fireEvent.click(firstOption);
  });

  it("Renders Checkbox with proper label", () => {
    const checkboxLabel = "Test label";
    const getLabelText = jest.fn(() => checkboxLabel);
    renderComponent(jest.fn(), getLabelText);
    const themeColorLabel = screen.getByTestId("themeColorLabel");

    expect(themeColorLabel).toHaveTextContent(checkboxLabel);
  });
});
