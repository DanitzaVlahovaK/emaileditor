import i18n from "i18next";
import { postImage } from "../network/requests";
import rootStore from "../mobx/stores/rootStore";

const allowedImageTypes = "image/jpeg,image/png";

const uploadImage = (file, stateAction, sunEditorUploadHandler = null) => {
  const { uiStateStore } = rootStore;

  if (!file) {
    sunEditorUploadHandler?.();
    return;
  }

  const fileSize = file.size / 1024 / 1024;
  const fileType = file.type;

  if (fileSize > 10 || !allowedImageTypes.includes(fileType)) {
    sunEditorUploadHandler?.();
    uiStateStore.openErrorDialog(i18n.t("FileUploader.ValidationError"));
    return;
  }

  const formData = new FormData();
  formData.set("file", file);

  postImage(formData)
    .then((result) => {
      sunEditorUploadHandler?.({
        result: [{ url: result?.data?.url }],
      });

      stateAction(result?.data?.url);
    })
    .catch(() => {
      sunEditorUploadHandler?.();
      uiStateStore.openErrorDialog(i18n.t("FileUploader.ImageUploadFailed"));
    });
};

export default uploadImage;
