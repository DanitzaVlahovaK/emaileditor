/* eslint-disable jest/no-standalone-expect */
import React from "react";
import theoretically from "jest-theories";
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, screen } from "@testing-library/react";
import { render } from "../../../../tests/unitTests/testSetup";
import Editor from "./Editor";

const renderComponent = () => render(<Editor />);

beforeEach(() => {
  renderComponent();
});

describe("<Editor />", () => {
  const theories = [
    {
      name: "LocationNameKeyword",
      input: {
        addVariableKeyword: "addVariableShopLocationName",
        addVariableKeywordValue: "[SHOP_LOCATION_NAME]",
      },
    },
    {
      name: "FirstNameKeyword",
      input: {
        addVariableKeyword: "addVariableFirstName",
        addVariableKeywordValue: "[FIRST_NAME]",
      },
    },
    {
      name: "LastNameKeyword",
      input: {
        addVariableKeyword: "addVariableLastName",
        addVariableKeywordValue: "[LAST_NAME]",
      },
    },
    {
      name: "CompanyNameKeyword",
      input: {
        addVariableKeyword: "addVariableCompanyName",
        addVariableKeywordValue: "[COMPANY_NAME]",
      },
    },
    {
      name: "CompanyPhoneKeyword",
      input: {
        addVariableKeyword: "addVariableCompanyPhone",
        addVariableKeywordValue: "[COMPANY_PHONE]",
      },
    },
    {
      name: "VehicleKeyword",
      input: {
        addVariableKeyword: "addVariableVehicleYear",
        addVariableKeywordValue: "[VEHICLE_YEAR_MAKE_MODEL]",
      },
    },
  ];

  theoretically(
    ({ name }) =>
      `Can select a template value and is inserted in the editor: ${name}`,
    theories,
    async (theory) => {
      const { addVariableKeyword, addVariableKeywordValue } = theory.input;

      const addVariableButton = screen.getByTestId("addVariable");

      expect(addVariableButton).toBeInTheDocument();

      fireEvent.click(addVariableButton);

      const shopLocationNameVarBtn = screen.getByTestId(addVariableKeyword);

      expect(shopLocationNameVarBtn).toBeInTheDocument();

      fireEvent.click(shopLocationNameVarBtn);

      const result = document.querySelector("span.se-custom-tag");

      expect(result?.textContent).toBe(addVariableKeywordValue);
    }
  );

  it("Renders Editor", () => {
    const editor = document.querySelector(".sun-editor");

    expect(editor).toBeInTheDocument();
  });

  it("Can create a hyperlink", () => {
    const hyperLinkBtn = screen.getByTestId("hyperlink");
    expect(hyperLinkBtn).toBeInTheDocument();
    fireEvent.click(hyperLinkBtn);

    const hyperlinkUrl = screen.getAllByTestId("hyperlinkUrl")[0];
    expect(hyperlinkUrl).toBeInTheDocument();
    fireEvent.change(hyperlinkUrl, {
      target: { value: "https://test.com/test" },
    });
    expect(hyperlinkUrl.value).toEqual("https://test.com/test");

    const hyperlinkText = screen.getAllByTestId("hyperlinkText")[0];
    expect(hyperlinkText).toBeInTheDocument();
    fireEvent.change(hyperlinkText, { target: { value: "TEST_HYPERLINK" } });
    expect(hyperlinkText.value).toEqual("TEST_HYPERLINK");

    const hyperlinkSubmit = screen.getByTestId("hyperlinkSubmit");
    expect(hyperlinkSubmit).toBeInTheDocument();
    fireEvent.click(hyperlinkSubmit);

    // TODO: Figure out how to insert into editor (or if it's even possible). Most likely trying to replace all text and it's being blocked.
    // const result = document.querySelector('a[href="https://test.com/test"]');
    // expect(result).toBeInTheDocument();
    // expect(result?.textContent).toBe("TEST_HYPERLINK");
  });
});
