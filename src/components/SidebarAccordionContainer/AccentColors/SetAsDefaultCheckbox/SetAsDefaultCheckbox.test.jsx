import React from "react";
import { cleanup, screen, fireEvent, waitFor } from "@testing-library/react";
import { render } from "../../../../../../tests/unitTests/testSetup";
import SetAsDefaultCheckbox from "./SetAsDefaultCheckbox";
import rootStore from "../../../../../../mobx/stores/rootStore";

beforeEach(() => {
  rootStore.commonStore.setSelectedLocationId(3);
});

const renderComponent = (
  dataTestId = "checboxTest",
  onSetAsDefault,
  getLabelText
) =>
  render(
    <SetAsDefaultCheckbox
      dataTestId={dataTestId}
      onSetAsDefault={onSetAsDefault}
      getLabelText={getLabelText}
    />
  );

afterEach(cleanup);

describe("<SetAsDefaultCheckbox />", () => {
  it("Renders SetAsDefaultCheckbox", () => {
    renderComponent("checboxTest", jest.fn(), jest.fn());

    const container = screen.getByTestId("checboxTestContainer");

    expect(container).toBeInTheDocument();
  });

  it("Renders correct label text", () => {
    const labelText = "test label text";

    const getLabelText = jest.fn(() => labelText);
    renderComponent("checboxTest", jest.fn(), getLabelText);

    const label = screen.getByTestId("checboxTestLabel");

    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent("test label text");
  });

  it("Checks checkbox", () => {
    const onSetAsDefault = jest.fn();
    renderComponent("checboxTest", jest.fn(), jest.fn());

    const checkbox = screen.getByTestId("checboxTestCheckbox");

    checkbox.onchange = onSetAsDefault;

    fireEvent.change(checkbox);

    expect(onSetAsDefault).toHaveBeenCalled();
  });

  it("Does not render if no location is selected", async () => {
    rootStore.commonStore.setSelectedLocationId(null);

    renderComponent("checboxTest", jest.fn(), jest.fn());

    const checkbox = screen.queryByTestId("checboxTestCheckbox");

    await waitFor(() => {
      expect(checkbox).not.toBeInTheDocument();
    });
  });
});
