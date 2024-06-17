import { cleanup, fireEvent, screen } from "@testing-library/react";
import React from "react";
import { render } from "../../../../../tests/unitTests/testSetup";
import SpecialsSection from "./SpecialsSection";
import rootStore from "../../../../../mobx/stores/rootStore";

const renderComponent = () => render(<SpecialsSection />);

beforeEach(() => {
  rootStore.commonStore.specials = [
    {
      id: 1,
      title: "$10 off",
    },
    {
      id: 2,
      title: "$20 off",
    },
  ];

  renderComponent();
});

afterEach(cleanup);

describe("<SpecialsSection />", () => {
  it("Renders SpecialsSection", () => {
    expect(screen.getByTestId("specialsSectionContainer")).toBeInTheDocument();
    expect(screen.getByTestId("addSpecialBtn")).toBeInTheDocument();
    expect(screen.queryByTestId("specialDefaultValue")).toBeNull();
  });

  it("Renders SpecialsSection and click on the drop down", () => {
    expect(screen.getByTestId("specialsSectionContainer")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("specialsSelect"));

    expect(screen.queryByTestId("specialDefaultValue")).toBeInTheDocument();
  });

  it("Renders SpecialsSection, click on the drop down and select special", () => {
    expect(screen.getByTestId("specialsSectionContainer")).toBeInTheDocument();

    const ddlSpecialsValue = screen.getByTestId("specialsSelect");
    fireEvent.mouseDown(ddlSpecialsValue);

    const specialToBeSelected = screen.queryByTestId("special-0");

    expect(specialToBeSelected).toBeInTheDocument();

    fireEvent.click(specialToBeSelected);

    expect(screen.queryByTestId("specialDefaultValue")).toBeNull();
    expect(ddlSpecialsValue.textContent).toBe("$10 off");
  });

  it("Renders hide special checkbox, after add new special button is clicked", () => {
    expect(screen.getByTestId("specialsSectionContainer")).toBeInTheDocument();

    const addNewSpecialButton = screen.queryByTestId("addSpecialBtn");
    fireEvent.click(addNewSpecialButton);
    expect(screen.getByTestId("hideSpecialCheckbox")).toBeInTheDocument();
  });
});
