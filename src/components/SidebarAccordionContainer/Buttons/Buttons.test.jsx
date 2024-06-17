import React from "react";
import "../../../../../i18n";
import { screen, cleanup, fireEvent } from "@testing-library/react";
import { render, waitFor } from "../../../../../tests/unitTests/testSetup";
import Buttons from "./Buttons";
import Editor from "../../Editor/Editor";
import rootStore from "../../../../../mobx/stores/rootStore";

let elements = null;
const renderComponent = () => {
  render(<Buttons />);

  elements = {
    btnAppointmentLink: screen.getByTestId("btnAppointmentLink"),
    btnFacebookLink: screen.getByTestId("btnFacebookLink"),
    btnGMBLink: screen.queryByTestId("btnGMBLink"),
    btnYelpLink: screen.queryByTestId("btnYelpLink"),
    btnWebsiteLink: screen.queryByTestId("btnWebsiteLink"),
    btnOptInLink: screen.queryByTestId("btnOptInLink"),
    btnPreview0: screen.queryByTestId("btnPreview-btnAppointmentLink"),
  };
};

beforeEach(() => {
  rootStore.commonStore.locationsData = [
    {
      id: 34508,
      name: "Kukui Auto Repair - Roseville",
      yelpURL: "test",
      facebookURL: "test",
      googleURL: "test",
      websiteURL: "test",
      appointmentURL: "test",
      isTextConnectEnabled: true,
    },
  ];

  rootStore.commonStore.setSelectedLocationId(34508);

  rootStore.commonStore.setTemplateKeywordData({
    tokens: {
      "[COMPANY_OPT_IN_URL_ZO]": "http://test.com/opt-in",
    },
  });

  renderComponent();
});

afterEach(cleanup);

describe("<Buttons />", () => {
  it("Renders Buttons section", () => {
    expect(elements.btnAppointmentLink).toBeInTheDocument();
    expect(elements.btnFacebookLink).toBeInTheDocument();
    expect(elements.btnGMBLink).toBeInTheDocument();
    expect(elements.btnYelpLink).toBeInTheDocument();
    expect(elements.btnWebsiteLink).toBeInTheDocument();
    expect(elements.btnOptInLink).toBeInTheDocument();
    expect(elements.btnPreview0).toBeNull();
  });

  it("Clicking on a link produces a link preview with icon from selected option.", async () => {
    expect(elements.btnPreview0).toBeNull();

    fireEvent.click(elements.btnFacebookLink);

    const btnPreview1 = screen.getByTestId("btnPreview-btnFacebookLink");

    expect(btnPreview1).toBeInTheDocument();
  });

  it("Drag and drop button and replace with the keyword.", async () => {
    fireEvent.click(elements.btnAppointmentLink);

    render(<Editor />);
    const editor = document.querySelector(".sun-editor");
    expect(editor).toBeInTheDocument();

    const btnDragDrop = screen.queryByTestId("drag-drop-button-component");
    expect(btnDragDrop).toBeInTheDocument();

    const mockDataTransfer = { setData: jest.fn() };
    fireEvent.dragStart(btnDragDrop, { dataTransfer: mockDataTransfer });
    fireEvent.dragEnter(editor);
    fireEvent.dragOver(editor);
    fireEvent.drop(editor);

    expect(mockDataTransfer.setData).toHaveBeenCalledTimes(1);
  });
});
