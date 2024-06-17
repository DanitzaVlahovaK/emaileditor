import { observer } from "mobx-react-lite";
import React from "react";
import { useTranslation } from "react-i18next";
import Button from "@material-ui/core/Button";
import { useRootStore } from "../../../mobx/bridge";
import dragDropImg from "../../../assets/images/drag-drop-btn.png";
import styles from "./FileUploader.module.css";
import uploadImage from "../../../helpers/uploadImage";

const FileUploader = observer(() => {
  const { commonStore, uiStateStore } = useRootStore();
  const { t } = useTranslation();
  const allowedExtentions = ".jpg,.jpeg,.png";

  const setImage = (url) => {
    commonStore.setEmailTemplateEditorImage(url);
  };

  const onImageChange = (event) => {
    uploadImage(event.target.files?.[0], setImage);
  };

  const upload = () => {
    document.getElementById("upload-file").click();
  };

  const onDragStart = (e) => {
    uiStateStore.setShouldFocusEditor(true);

    e.dataTransfer.setData("text/html", `<img src="${commonStore.emailTemplateEditorImage}" alt="Image">`);
  };

  return (
    <div className={styles.uploaderBtnWrapper} data-testid="fileUploader">
      <input accept={allowedExtentions} style={{ display: "none" }} id="upload-file" data-testid="upload-input-button" type="file" onChange={onImageChange} />

      <Button className={styles.uploaderBtn} onClick={upload} data-testid="upload-button">
        {t("FileUploader.UploaderBtn")}
      </Button>

      {commonStore.emailTemplateEditorImage ? (
        <div className={styles.imageWrapper}>
          <img data-testid="drag-drop-thumbnail" className={styles.uploadedImg} src={commonStore.emailTemplateEditorImage} alt={t("FileUploader.DragAndDropImg")} draggable={false} />
          <img className={styles.dragDropBtn} src={dragDropImg} id="drag-drop-btn" data-testid="drag-drop-button" alt={t("FileUploader.DragAndDropBtn")} draggable onDragStart={onDragStart} />
        </div>
      ) : null}
    </div>
  );
});

export default FileUploader;
