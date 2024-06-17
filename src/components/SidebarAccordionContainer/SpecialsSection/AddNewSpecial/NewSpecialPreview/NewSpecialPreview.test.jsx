import { cleanup, fireEvent, screen } from "@testing-library/react";
import React from "react";
import { render } from "../../../../../../../tests/unitTests/testSetup";
import rootStore from "../../../../../../../mobx/stores/rootStore";
import NewSpecialPreview from "./NewSpecialPreview";

const renderComponent = (title, text, published) =>
  render(
    <NewSpecialPreview title={title} text={text} published={!published} />
  );

afterEach(cleanup);

describe("<ExpirationDateDropdown />", () => {
  it("Render special preview", () => {
    renderComponent("title", "description", true);

    expect(screen.getByTestId("newSpecialPreviewSubheading")).toHaveTextContent(
      "Special Preview"
    );

    expect(
      screen.getByTestId("newSpecialPreviewWarningText")
    ).toHaveTextContent(
      "Please review your special carefully. Once the special is confirmed, it can only be edited in the Specials tab."
    );

    expect(screen.getByTestId("newSpecialPreviewEditBtn")).toBeInTheDocument();
    expect(
      screen.getByTestId("newSpecialPreviewConfirmBtn")
    ).toBeInTheDocument();
  });

  it("Click edit button must hide special preview", () => {
    renderComponent("title", "description", true);

    fireEvent.click(screen.getByTestId("newSpecialPreviewEditBtn"));

    expect(rootStore.uiStateStore.showAddNewSpecialPreview).toBe(false);
  });

  it("Click save button must clear state", () => {
    renderComponent("title", "description", true);

    fireEvent.click(screen.getByTestId("newSpecialPreviewConfirmBtn"));

    expect(rootStore.uiStateStore.isExpirationDateCheckboxTicked).toBe(false);
    expect(rootStore.commonStore.newSpecial).toBeNull();
  });
});
