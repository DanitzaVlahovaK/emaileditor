import { cleanup, fireEvent, screen } from "@testing-library/react";
import React from "react";
import { render } from "../../../../../../../tests/unitTests/testSetup";
import ExpirationDateCheckbox from "./ExpirationDateCheckbox";

const renderComponent = () => render(<ExpirationDateCheckbox />);

beforeEach(() => {
  renderComponent();
});

afterEach(cleanup);

describe("<ExpirationDateCheckbox />", () => {
  it("Renders ExpirationDateCheckbox", () => {
    expect(screen.getByTestId("expirationDateCheckBox")).toBeInTheDocument();
  });

  it("Renders ExpirationDateCheckbox and tick", () => {
    const expirationDateCheckBox = screen.getByTestId(
      "expirationDateCheckBoxInput"
    );
    expect(expirationDateCheckBox).toBeInTheDocument();

    fireEvent.click(expirationDateCheckBox);

    expect(expirationDateCheckBox).toBeChecked();
  });
});
