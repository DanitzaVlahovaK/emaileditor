import React from "react";
import { cleanup, screen, fireEvent, waitFor } from "@testing-library/react";
import { render } from "../../../../../../tests/unitTests/testSetup";
import AddNewSpecial from "./AddNewSpecial";
import App from "../../../../../App";
import {
  mockRequestCampaignsFetch,
  mockRequestCategoriesFetch,
  mockRequestFetchTemplate,
  mockRequestSingleLocationDataFetch,
  mockRequestSpecialsFetch,
  mockResponseSpecial,
} from "../../../../../../tests/requestMocks";
import {
  clickOnBlackFridayEventButton,
  clickOnCreateAnEmailBlastTemplateSelectDesign,
  clickOnCreateNewEmailBlastButton,
  clickOnHolidaysCategoryButton,
} from "../../../../../../tests/navigationEvents";
import i18n from "../../../../../../i18n";
import rootStore from "../../../../../../mobx/stores/rootStore";
import { mainComponents } from "../../../../../../helpers/utils/utils";

const renderComponent = () => render(<AddNewSpecial />);

beforeEach(() => {
  rootStore.uiStateStore.isExpirationDateCheckboxTicked = false;
  rootStore.commonStore.locationsData = [];
  rootStore.commonStore.setRecipients([]);
  rootStore.uiStateStore.mainActiveComponent =
    mainComponents.EmailBlastDashboard;
  rootStore.uiStateStore.showToSectionLoader = false;
  rootStore.commonStore.selectedTemplate = {
    images: [{ location: "/image.png", position: 0, credits: [] }],
  };
  rootStore.uiStateStore.addSpecialOpen = false;
  renderComponent();
});

afterEach(cleanup);

describe("<AddNewSpecial />", () => {
  it("Renders AddNewSpecial", () => {
    expect(screen.getByTestId("addNewSpecialContainer")).toBeInTheDocument();
  });

  it("Renders AddNewSpecial header section", () => {
    const addNewSpecialMainTitle = screen.getByTestId("addNewSpecialMainTitle");
    const addNewSpecialMainSubTitle = screen.getByTestId(
      "addNewSpecialMainSubTitle"
    );

    expect(addNewSpecialMainTitle).toBeInTheDocument();
    expect(addNewSpecialMainTitle).toHaveTextContent("Create New Special");

    expect(addNewSpecialMainSubTitle).toBeInTheDocument();
    expect(addNewSpecialMainSubTitle).toHaveTextContent(
      "Creating a new special will add it to your specials tab"
    );
  });

  it("Renders AddNewSpecial title section", () => {
    const addNewSpecialTitleHeading = screen.getByTestId(
      "addNewSpecialTitleHeading"
    );
    const specialTitleInput = screen.getByTestId("specialTitleInput");

    expect(addNewSpecialTitleHeading).toBeInTheDocument();
    expect(addNewSpecialTitleHeading).toHaveTextContent("Special Title");

    expect(specialTitleInput).toBeInTheDocument();
    expect(specialTitleInput.getAttribute("placeholder")).toBe(
      "Enter Special Title"
    );
  });

  it("Renders AddNewSpecial description section", () => {
    const addNewSpecialDescriptionHeading = screen.getByTestId(
      "addNewSpecialDescriptionHeading"
    );
    const specialDescriptionInput = screen.getByTestId(
      "specialDescriptionInput"
    );

    expect(addNewSpecialDescriptionHeading).toBeInTheDocument();
    expect(addNewSpecialDescriptionHeading).toHaveTextContent(
      "Special Description"
    );

    expect(specialDescriptionInput).toBeInTheDocument();
    expect(specialDescriptionInput.getAttribute("placeholder")).toBe(
      "Enter Special Description"
    );
  });

  it("Fires change event for title input", () => {
    const specialTitleInput = screen.getByTestId("specialTitleInput");

    const mockFn = jest.fn();

    specialTitleInput.onchange = mockFn;

    fireEvent.change(specialTitleInput);

    expect(mockFn).toHaveBeenCalled();
  });

  it("Sets value for title input", () => {
    const specialTitleInput = screen.getByTestId("specialTitleInput");

    fireEvent.change(specialTitleInput, {
      target: { value: "test title" },
    });

    expect(specialTitleInput.value).toBe("test title");
  });

  it("Fires change event for description input", () => {
    const specialDescriptionInput = screen.getByTestId(
      "specialDescriptionInput"
    );

    const mockFn = jest.fn();

    specialDescriptionInput.onchange = mockFn;

    fireEvent.change(specialDescriptionInput);

    expect(mockFn).toHaveBeenCalled();
  });

  it("Sets value for description input", () => {
    const specialDescriptionInput = screen.getByTestId(
      "specialDescriptionInput"
    );

    fireEvent.change(specialDescriptionInput, {
      target: { value: "test description" },
    });

    expect(specialDescriptionInput.value).toBe("test description");
  });

  it("Confirm dialog hides when no clicked, and add new special values are kept", async () => {
    cleanup();
    mockRequestSingleLocationDataFetch();
    mockRequestCategoriesFetch();
    mockRequestCampaignsFetch();
    mockRequestSpecialsFetch();

    render(<App />);

    mockRequestFetchTemplate();

    await clickOnCreateNewEmailBlastButton();
    await clickOnHolidaysCategoryButton();
    await clickOnBlackFridayEventButton();
    await clickOnCreateAnEmailBlastTemplateSelectDesign();

    const addSpecialBtn = screen.getByTestId("addSpecialBtn");
    fireEvent.click(addSpecialBtn);

    const specialTitleInput = screen.getByTestId("specialTitleInput");
    fireEvent.change(specialTitleInput, {
      target: { value: "test title" },
    });
    expect(specialTitleInput.value).toBe("test title");

    const specialDescriptionInput = screen.getByTestId(
      "specialDescriptionInput"
    );
    fireEvent.change(specialDescriptionInput, {
      target: { value: "test description" },
    });
    expect(specialDescriptionInput.value).toBe("test description");

    const expirationDateCheckBox = screen.getByTestId(
      "expirationDateCheckBoxInput"
    );
    expect(expirationDateCheckBox).toBeInTheDocument();
    fireEvent.click(expirationDateCheckBox);
    expect(expirationDateCheckBox).toBeChecked();

    const hideSpecialCheckbox = screen.getByTestId("hideSpecialCheckboxInput");
    expect(hideSpecialCheckbox).toBeInTheDocument();
    fireEvent.click(hideSpecialCheckbox);
    expect(hideSpecialCheckbox).toBeChecked();

    const cancelAddSpecialBtn = screen.getByTestId("cancelAddSpecialBtn");
    expect(cancelAddSpecialBtn).toBeInTheDocument();
    fireEvent.click(cancelAddSpecialBtn);

    const dialogText = screen.getByTestId("dialogText");
    await waitFor(() => expect(dialogText).toBeInTheDocument());
    await waitFor(() =>
      expect(dialogText.textContent).toEqual(
        i18n.t("AddNewSpecial.CancelDialogText")
      )
    );
    const dialogCancelBtn = screen.getByTestId("dialogCancelBtn");
    fireEvent.click(dialogCancelBtn);

    expect(screen.queryByTestId("dialogText")).toBeNull();
    expect(screen.queryByTestId("addSpecialBtn")).toBeNull();

    expect(specialTitleInput).toBeInTheDocument();
    expect(specialDescriptionInput).toBeInTheDocument();
    expect(expirationDateCheckBox).toBeInTheDocument();
    expect(hideSpecialCheckbox).toBeInTheDocument();

    expect(specialTitleInput.value).toBe("test title");
    expect(specialDescriptionInput.value).toBe("test description");
    expect(expirationDateCheckBox).toBeChecked();
    expect(hideSpecialCheckbox).toBeChecked();
  });

  it("Confirm dialog hides when no clicked, and add new special values are reset", async () => {
    cleanup();
    mockRequestSingleLocationDataFetch();
    mockRequestCategoriesFetch();
    mockRequestCampaignsFetch();
    mockRequestSpecialsFetch();

    render(<App />);

    mockRequestFetchTemplate();
    await clickOnCreateNewEmailBlastButton();
    await clickOnHolidaysCategoryButton();
    await clickOnBlackFridayEventButton();
    await clickOnCreateAnEmailBlastTemplateSelectDesign();

    let addSpecialBtn = screen.getByTestId("addSpecialBtn");
    await waitFor(() => expect(addSpecialBtn).toBeInTheDocument());
    fireEvent.click(addSpecialBtn);

    let specialTitleInput = screen.getByTestId("specialTitleInput");
    fireEvent.change(specialTitleInput, {
      target: { value: "test title" },
    });
    expect(specialTitleInput.value).toBe("test title");

    let specialDescriptionInput = screen.getByTestId("specialDescriptionInput");
    fireEvent.change(specialDescriptionInput, {
      target: { value: "test description" },
    });
    expect(specialDescriptionInput.value).toBe("test description");

    let expirationDateCheckBox = screen.getByTestId(
      "expirationDateCheckBoxInput"
    );
    expect(expirationDateCheckBox).toBeInTheDocument();
    fireEvent.click(expirationDateCheckBox);
    expect(expirationDateCheckBox).toBeChecked();

    let hideSpecialCheckbox = screen.getByTestId("hideSpecialCheckboxInput");
    expect(hideSpecialCheckbox).toBeInTheDocument();
    fireEvent.click(hideSpecialCheckbox);
    expect(hideSpecialCheckbox).toBeChecked();

    const cancelAddSpecialBtn = screen.getByTestId("cancelAddSpecialBtn");
    expect(cancelAddSpecialBtn).toBeInTheDocument();
    fireEvent.click(cancelAddSpecialBtn);

    const dialogText = screen.getByTestId("dialogText");
    await waitFor(() => expect(dialogText).toBeInTheDocument());
    await waitFor(() =>
      expect(dialogText.textContent).toEqual(
        i18n.t("AddNewSpecial.CancelDialogText")
      )
    );

    const dialogConfirmBtn = screen.getByTestId("dialogConfirmBtn");
    fireEvent.click(dialogConfirmBtn);

    expect(screen.queryByTestId("dialogText")).toBeNull();
    addSpecialBtn = screen.getByTestId("addSpecialBtn");
    await waitFor(() => expect(addSpecialBtn).toBeInTheDocument());

    fireEvent.click(addSpecialBtn);

    specialTitleInput = screen.getByTestId("specialTitleInput");
    specialDescriptionInput = screen.getByTestId("specialDescriptionInput");
    expirationDateCheckBox = screen.getByTestId("expirationDateCheckBoxInput");
    hideSpecialCheckbox = screen.getByTestId("hideSpecialCheckboxInput");

    expect(specialTitleInput.value).toBe("");
    expect(specialDescriptionInput.value).toBe("");
    expect(expirationDateCheckBox).not.toBeChecked();
    expect(hideSpecialCheckbox).not.toBeChecked();
  });

  it("Show new special preview on click", () => {
    const previewAddSpecialBtn = screen.getByTestId("previewAddSpecialBtn");

    fireEvent.change(screen.getByTestId("specialTitleInput"), {
      target: { value: "test title" },
    });

    fireEvent.change(screen.getByTestId("specialDescriptionInput"), {
      target: { value: "test description" },
    });

    fireEvent.click(previewAddSpecialBtn);

    expect(rootStore.uiStateStore.showAddNewSpecialPreview).toBe(true);
    expect(screen.getByTestId("newSpecialPreview")).toBeInTheDocument();
    expect(() => screen.getByTestId("addNewSpecialContainer")).toThrow();
  });

  it("Click edit button under special's preview", () => {
    rootStore.uiStateStore.setShowAddNewSpecialPreview(true);

    expect(rootStore.uiStateStore.showAddNewSpecialPreview).toBe(true);

    const newSpecialPreviewEditBtn = screen.getByTestId(
      "newSpecialPreviewEditBtn"
    );

    expect(newSpecialPreviewEditBtn).toBeInTheDocument();

    fireEvent.click(newSpecialPreviewEditBtn);

    expect(rootStore.uiStateStore.showAddNewSpecialPreview).toBe(false);
  });

  it("Confirm and add new special on click", () => {
    mockResponseSpecial();

    rootStore.uiStateStore.setShowAddNewSpecialPreview(true);

    expect(rootStore.uiStateStore.showAddNewSpecialPreview).toBe(true);

    const specialsCountOld = rootStore.commonStore.specials.length;

    expect(rootStore.commonStore.newSpecial).toBeNull();
    expect(rootStore.commonStore.selectedSpecial).toBeNull();

    const newSpecialPreviewConfirmBtn = screen.getByTestId(
      "newSpecialPreviewConfirmBtn"
    );

    expect(newSpecialPreviewConfirmBtn).toBeInTheDocument();

    fireEvent.click(newSpecialPreviewConfirmBtn, () => {
      expect(rootStore.commonStore.specials.length).toBe(specialsCountOld + 1);
      expect(rootStore.commonStore.selectedSpecial).not.toBeNull();
      expect(rootStore.commonStore.newSpecial).toBeNull();

      expect(rootStore.uiStateStore.showAddNewSpecialPreview).toBe(false);
      expect(rootStore.uiStateStore.isExpirationDateCheckboxTicked).toBe(false);
      expect(rootStore.uiStateStore.addSpecialOpen).toBe(false);
    });
  });
});
