import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import React from "react";
import { render } from "../../../../../tests/unitTests/testSetup";
import TextSection from "./TextSection";
import rootStore from "../../../../../mobx/stores/rootStore";

let elements = null;
const renderComponent = () => {
  render(<TextSection />);

  elements = {
    textSectionContainer: screen.getByTestId("textSectionContainer"),
    stockContentSelect: screen.getByTestId("stockContentSelect"),
    stockContentDefaultQuery: screen.queryByTestId("stockContentDefault"),
    stockContentTextQuery: screen.queryByTestId("stockContentText"),
    copyBtnQuery: screen.queryByTestId("copyBtn"),
  };
};

beforeEach(() => {
  rootStore.commonStore.emailBlastCategories = [
    {
      id: 1,
      name: "Holidays",
      image:
        "https://kukui-retention.s3.us-west-1.amazonaws.com/emailCampaignCategoryImages/holidays.png",
      events: [
        {
          id: 1,
          name: "Black Friday",
          stockContent: [
            {
              title: "Event Title 1",
              content: "actual stock content 1",
            },
            {
              title: "Event Title 2",
              content: "actual stock content 2",
            },
          ],
          categoryId: 1,
          image:
            "https://kukui-retention.s3.us-west-1.amazonaws.com/emailCampaignEventImages/BlackFriday-min.jpg",
        },
      ],
    },
    {
      id: 2,
      name: "General Shop",
      image:
        "https://kukui-retention.s3.us-west-1.amazonaws.com/emailCampaignCategoryImages/GeneralShop.png",
      events: [
        {
          id: 1,
          name: "Business Announcements",
          stockContent: [
            {
              title: "Text Marketing Opt-In",
              content: "Test stock content here",
            },
          ],
          categoryId: 2,
          image:
            "https://kukui-retention.s3.us-west-1.amazonaws.com/emailCampaignEventImages/BusinessAnnouncements-min.jpg",
        },
      ],
    },
  ];

  rootStore.uiStateStore.selectedEvent =
    rootStore.commonStore.emailBlastCategories[0].events[0];
});

afterEach(cleanup);

describe("<TextSection />", () => {
  it("Renders TextSection", () => {
    renderComponent();

    expect(elements.textSectionContainer).toBeInTheDocument();
    expect(elements.copyBtnQuery).toBeNull();
    expect(elements.stockContentDefaultQuery).toBeNull();
    expect(elements.stockContentTextQuery).toBeNull();
  });

  it("Mock click on 'View Stock Content'.", () => {
    renderComponent();

    const mockFn = jest.fn();
    const { stockContentSelect } = elements;
    stockContentSelect.onclick = mockFn;
    fireEvent.click(stockContentSelect);

    expect(mockFn).toHaveBeenCalled();
  });

  it("Click on 'View Stock Content'.", () => {
    renderComponent();

    fireEvent.mouseDown(elements.stockContentSelect);

    expect(screen.getByTestId("stockContentDefault")).toBeInTheDocument();
    expect(screen.getByTestId("stockContent-0")).toBeInTheDocument();
    expect(screen.getByTestId("stockContent-1")).toBeInTheDocument();
    expect(screen.getByTestId("stockContent-0").textContent).toBe(
      rootStore.uiStateStore.selectedEvent.stockContent[0].title
    );
    expect(screen.getByTestId("stockContent-1").textContent).toBe(
      rootStore.uiStateStore.selectedEvent.stockContent[1].title
    );
  });

  it("Select stock content template.", () => {
    renderComponent();

    fireEvent.mouseDown(elements.stockContentSelect);

    const stockContentToBeSelected = screen.queryByTestId("stockContent-0");

    expect(stockContentToBeSelected).toBeInTheDocument();

    fireEvent.click(stockContentToBeSelected);

    expect(elements.stockContentDefaultQuery).toBeNull();
    expect(elements.stockContentSelect.textContent).toBe(
      rootStore.commonStore.selectedStockContent.title
    );
    expect(screen.queryByTestId("stockContentText")).toBeInTheDocument();
    expect(screen.queryByTestId("stockContentText").textContent).toBe(
      rootStore.commonStore.selectedStockContent.content
    );
  });

  it("Copy content to clipboard.", async () => {
    renderComponent();

    fireEvent.mouseDown(elements.stockContentSelect);
    fireEvent.click(screen.queryByTestId("stockContent-0"));

    expect(elements.copyBtnQuery).toBeInTheDocument();
    expect(elements.copyBtnQuery.textContent).toBe("Copy");

    const mockFn = jest.fn();
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: mockFn,
      },
    });

    fireEvent.click(elements.copyBtnQuery);
    await waitFor(() => {
      expect(elements.copyBtnQuery.textContent).toBe("Copied");
    });

    expect(mockFn).toHaveBeenCalled();
  });

  it("Text Marketing stock content is visible when text connect is enabled", () => {
    rootStore.commonStore.setSelectedStockContent(null);

    rootStore.commonStore.locationsData = [
      {
        id: 34508,
        name: "Kukui Auto Repair - Roseville",
        isTextConnectEnabled: true,
      },
    ];

    rootStore.commonStore.setSelectedTemplate({
      id: "b5e3a0fd-859e-42a3-bc86-a2cf8e94746d",
    });

    rootStore.uiStateStore.setSelectedEvent(
      rootStore.commonStore.emailBlastCategories[1].events[0]
    );

    renderComponent();

    fireEvent.mouseDown(elements.stockContentSelect);

    expect(screen.getByTestId("stockContentDefault")).toBeInTheDocument();
    expect(screen.getByTestId("stockContent-0")).toBeInTheDocument();
  });
});
