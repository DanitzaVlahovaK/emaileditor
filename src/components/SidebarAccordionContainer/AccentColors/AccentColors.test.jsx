import React from "react";
import { cleanup, screen } from "@testing-library/react";
import { render } from "../../../../../tests/unitTests/testSetup";
import AccentColors from "./AccentColors";

const renderComponent = () => render(<AccentColors />);

afterEach(cleanup);

describe("<AccentColors />", () => {
  it("Renders AccentColors", () => {
    renderComponent();

    const container = screen.getByTestId("accentColorsContainer");

    expect(container).toBeInTheDocument();
  });
});
