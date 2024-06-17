import { cleanup, screen } from "@testing-library/react";
import React from "react";
import { render } from "../../../../../../tests/unitTests/testSetup";
import SpecialDetails from "./SpecialDetails";

const renderComponent = (
  expirationDays,
  expirationDate,
  published,
  isExpirationDateChecked
) => {
  render(
    <SpecialDetails
      expirationDays={expirationDays}
      expirationDate={expirationDate}
      published={published}
      isExpirationDateChecked={isExpirationDateChecked}
    />
  );
};

afterEach(cleanup);

describe("<SpecialDetails />", () => {
  it("Renders SpecialDetails - No expiration date", () => {
    renderComponent(1, null, false, false);

    expect(screen.getByTestId("specialDetails")).toBeInTheDocument();

    expect(
      screen.getByTestId("specialDetailsExpirationText")
    ).toHaveTextContent("No expiration date");
  });

  it("Renders SpecialDetails - Hidden from Website / One Day from view", () => {
    renderComponent(1, null, false, true);

    expect(screen.getByTestId("specialDetails")).toBeInTheDocument();
    expect(
      screen.getByTestId("specialDetailsPublishedOnWebsite")
    ).toHaveTextContent("Special not visible on website");

    expect(
      screen.getByTestId("specialDetailsExpirationText")
    ).toHaveTextContent("Special Expiration: 1 day from view");
  });

  it("Renders SpecialDetails - Visible on Website / 6 Days from view", () => {
    renderComponent(6, null, true, true);
    expect(
      screen.getByTestId("specialDetailsPublishedOnWebsite")
    ).toHaveTextContent("Special visible on website");
    expect(
      screen.getByTestId("specialDetailsExpirationText")
    ).toHaveTextContent("6 days from view");
  });

  it("Renders SpecialDetails - Week", () => {
    renderComponent(7, null, true, true);
    expect(
      screen.getByTestId("specialDetailsExpirationText")
    ).toHaveTextContent("1 week from view");
  });

  it("Renders SpecialDetails - 2 Weeks", () => {
    renderComponent(14, null, true, true);
    expect(
      screen.getByTestId("specialDetailsExpirationText")
    ).toHaveTextContent("2 weeks from view");
  });

  it("Renders SpecialDetails - Month", () => {
    renderComponent(42, null, true, true);
    expect(
      screen.getByTestId("specialDetailsExpirationText")
    ).toHaveTextContent("6 weeks from view");
  });

  it("Renders SpecialDetails - 2 Months", () => {
    renderComponent(60, null, true, true);
    expect(
      screen.getByTestId("specialDetailsExpirationText")
    ).toHaveTextContent("2 months from view");
  });

  it("Renders SpecialDetails - Custom Date", () => {
    renderComponent(null, "2021-06-08T10:10:10.000Z", true, true);
    expect(
      screen.getByTestId("specialDetailsExpirationText")
    ).toHaveTextContent("06/08/2021");
  });

  it("Renders SpecialDetails new Special - Custom Date", () => {
    renderComponent(null, new Date(2021, 9, 1), true, true);
    expect(
      screen.getByTestId("specialDetailsExpirationText")
    ).toHaveTextContent("10/01/2021");
  });
});
