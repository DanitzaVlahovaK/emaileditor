import { cleanup, fireEvent, screen } from "@testing-library/react";
import React from "react";
import { getFormattedDate } from "../../../../../../../helpers/utils/utils";
import { render } from "../../../../../../../tests/unitTests/testSetup";
import ExpirationDateDropdown from "./ExpirationDateDropdown";
import rootStore from "../../../../../../../mobx/stores/rootStore";

const renderComponent = () => render(<ExpirationDateDropdown />);

beforeEach(() => {
  rootStore.uiStateStore.isExpirationDateCheckboxTicked = true;

  renderComponent();
});

afterEach(cleanup);

describe("<ExpirationDateDropdown />", () => {
  it("Does not render ExpirationDateDropdown", () => {
    rootStore.uiStateStore.isExpirationDateCheckboxTicked = false;
    expect(() => screen.getByTestId("expirationSelect")).toThrow();
  });

  it("Renders ExpirationDateDropdown", () => {
    expect(screen.getByTestId("expirationSelect")).toBeInTheDocument();
  });

  it("Select option from ExpirationDateDropdown", () => {
    const expirationSelect = screen.getByTestId("expirationSelect");

    fireEvent.mouseDown(expirationSelect);

    const expirationSelectOption = screen.getByTestId("expirationSelect-14");
    expect(expirationSelectOption).toBeVisible();

    fireEvent.click(expirationSelectOption);

    expect(expirationSelect).toHaveTextContent("2 weeks from view");
  });

  it("Select Custom option from ExpirationDateDropdown", () => {
    const expirationSelect = screen.getByTestId("expirationSelect");

    fireEvent.mouseDown(expirationSelect);

    const expirationSelectOption = screen.getByTestId("expirationSelect-0");
    expect(expirationSelectOption).toBeVisible();

    fireEvent.click(expirationSelectOption);

    expect(expirationSelect).toHaveTextContent("Custom Expiration Date");

    const expirationDatepickerButton = screen.getByTestId(
      "expirationDatepickerButton"
    );
    expect(expirationDatepickerButton).toBeVisible();
    fireEvent.mouseDown(expirationDatepickerButton);
    const expirationDatepickerInput = screen.getByTestId(
      "expirationDatepickerInput"
    );
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 15);
    const dateFormatted = getFormattedDate(twoWeeksFromNow);
    fireEvent.change(expirationDatepickerInput, {
      target: { value: dateFormatted },
    });

    expect(expirationDatepickerInput).toHaveValue(dateFormatted);
  });
});
