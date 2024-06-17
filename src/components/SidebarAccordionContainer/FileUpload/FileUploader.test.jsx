import { cleanup, fireEvent, screen, waitFor } from "@testing-library/react";
import React from "react";
import { render } from "../../../../../tests/unitTests/testSetup";
import FileUploader from "./FileUploader";
import rootStore from "../../../../../mobx/stores/rootStore";
import {
  mockRequestErrorRequest,
  mockUploadImage,
} from "../../../../../tests/requestMocks";

const renderComponent = () => render(<FileUploader />);

beforeEach(() => {
  rootStore.uiStateStore.closeDialog();
  rootStore.commonStore.emailTemplateEditorImage = null;
});

afterEach(cleanup);

describe("<FileUploader />", () => {
  it("Renders FileUploader", () => {
    renderComponent();

    const linkElement = screen.getByTestId("fileUploader");
    expect(linkElement).toBeInTheDocument();

    expect(screen.queryByTestId("drag-drop-thumbnail")).toBeNull();
    expect(screen.queryByTestId("drag-drop-button")).toBeNull();
  });

  it("Renders image thumbnail and drag-drop button when image has been uploaded", () => {
    rootStore.commonStore.emailTemplateEditorImage = "blah.jpg";

    renderComponent();

    expect(screen.getByTestId("drag-drop-thumbnail")).toBeInTheDocument();
    expect(screen.getByTestId("drag-drop-button")).toBeInTheDocument();
  });

  it("Change event called on upload file input", () => {
    renderComponent();
    mockUploadImage();
    const uploadFileElement = screen.getByTestId("upload-input-button");
    fireEvent.change(uploadFileElement, {
      target: { files: [new File([], "test.png", { type: "image/png" })] },
    });

    expect(uploadFileElement.files.length).toBeGreaterThan(0);
    expect(uploadFileElement.files[0].name).toBe("test.png");
    expect(uploadFileElement.files[0].type).toBe("image/png");
  });

  it("Change event called on upload file button", () => {
    renderComponent();

    const mockFn = jest.fn();
    const uploadButtonElement = screen.getByTestId("upload-button");
    uploadButtonElement.onclick = mockFn;
    fireEvent.click(uploadButtonElement);

    expect(mockFn).toHaveBeenCalled();
  });
  it("postImage is called with correct form data on file upload", async () => {
    const image = "data:image/jpeg;base64,/9j/4AAQSkZJ//20==";
    const file = new File([image], "test.png", { type: "image/png" });
    // eslint-disable-next-line func-names
    renderComponent();

    const uploadImageMock = mockUploadImage();

    const uploadFileElement = screen.getByTestId("upload-input-button");
    fireEvent.change(uploadFileElement, {
      target: { files: [file] },
    });

    const expectedFormData = new FormData();
    expectedFormData.set("file", file);

    await waitFor(() => {
      expect(uploadImageMock).toHaveBeenCalledWith(
        "https://dev-retentionapi.kukui.com/v1/image",
        expectedFormData,
        {
          headers: {
            Accept: "application/json",
            CpAuthKey: null,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      expect(rootStore.commonStore.emailTemplateEditorImage).toBe("testUrl");
    });
  });

  it("onImageChange - error dialog shown when validation failed", () => {
    const image = "data:image/jpeg;base64,/9j/4AAQSkZJ//20==";
    const file = new File([image], "test.png", { type: "image/png" });

    Object.defineProperty(file, "size", { value: 11 * 1024 * 1024 });

    // eslint-disable-next-line func-names
    renderComponent();

    const uploadImageMock = mockUploadImage();

    const uploadFileElement = screen.getByTestId("upload-input-button");
    fireEvent.change(uploadFileElement, {
      target: { files: [file] },
    });

    expect(uploadImageMock).not.toHaveBeenCalled();

    expect(rootStore.uiStateStore.dialogProps).not.toBeNull();
    expect(rootStore.uiStateStore.dialogProps?.text).toContain(
      "Uploaded file must be .jpg, .jpeg or .png and less than 10MB"
    );
  });

  it("onImageChange - error dialog shown when postImage failed", async () => {
    const image = "data:image/jpeg;base64,/9j/4AAQSkZJ//20==";
    const file = new File([image], "test.png", { type: "image/png" });

    // eslint-disable-next-line func-names
    renderComponent();

    mockRequestErrorRequest();

    const setEmailTemplateEditorImageMock = jest.spyOn(
      rootStore.commonStore,
      "setEmailTemplateEditorImage"
    );

    const uploadFileElement = screen.getByTestId("upload-input-button");
    fireEvent.change(uploadFileElement, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(rootStore.uiStateStore.dialogProps).not.toBeNull();
      expect(rootStore.uiStateStore.dialogProps?.text).toContain(
        "Failed to upload image, please try again later."
      );

      expect(setEmailTemplateEditorImageMock).not.toHaveBeenCalled();
    });
  });

  it("Change event called on upload file input without a file", () => {
    renderComponent();

    const uploadFileElement = screen.getByTestId("upload-input-button");
    fireEvent.change(uploadFileElement, {
      target: { files: [] },
    });

    expect(uploadFileElement.files.length).toEqual(0);
  });
});
