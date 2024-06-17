import { cleanup, fireEvent, screen } from "@testing-library/react";
import React from "react";
import { render } from "../../../../../../tests/unitTests/testSetup";
import SpecialPreview from "./SpecialPreview";
import rootStore from "../../../../../../mobx/stores/rootStore";

const renderComponent = () =>
  render(
    <SpecialPreview
      title="$10 off"
      text="Come now and get $10 off any service"
      couponUrl="http://testurl.com/"
    />
  );

beforeEach(() => {
  renderComponent();
});

afterEach(cleanup);

describe("<SpecialPreview />", () => {
  it("Renders SpecialPreviewContainer", () => {
    const specialPreviewTitle = screen.getByTestId("specialPreviewTitle");
    const specialPreviewContent = screen.getByTestId("specialPreviewContent");
    const specialPreviewURL = screen.getByTestId("specialPreviewURL");

    expect(screen.getByTestId("specialPreviewContainer")).toBeInTheDocument();
    expect(specialPreviewTitle).toBeInTheDocument();
    expect(specialPreviewContent).toBeInTheDocument();
    expect(specialPreviewURL).toBeInTheDocument();

    expect(specialPreviewTitle).toHaveTextContent("$10 off");
    expect(specialPreviewContent).toHaveTextContent(
      "Come now and get $10 off any service"
    );
    expect(specialPreviewURL.href).toEqual("http://testurl.com/");
  });
});
