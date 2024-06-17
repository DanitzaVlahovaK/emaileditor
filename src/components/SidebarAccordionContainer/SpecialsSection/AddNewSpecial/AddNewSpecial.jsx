import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { observer } from "mobx-react-lite";
import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import NewSpecialPreview from "./NewSpecialPreview/NewSpecialPreview";
import styles from "./AddNewSpecial.module.css";
import ExpirationDateCheckbox from "./ExpirationDateCheckbox/ExpirationDateCheckbox";
import ExpirationDateDropdown from "./ExpirationDateDropdown/ExpirationDateDropdown";
import { useRootStore } from "../../../../mobx/bridge";

const AddNewSpecial = observer(() => {
  const { commonStore, uiStateStore } = useRootStore();

  const { t } = useTranslation();

  const [hideSpecial, setHideSpecial] = React.useState(false);
  const [specialTitle, setSpecialTitle] = React.useState("");
  const [specialDescription, setSpecialDescription] = React.useState("");
  const [previewActive, setPreviewActive] = React.useState(false);

  React.useEffect(() => {
    if (specialTitle?.trim() && specialDescription?.trim()) {
      setPreviewActive(true);
    } else {
      setPreviewActive(false);
    }
  }, [specialTitle, specialDescription]);

  const onHideSpecialChange = (event) => {
    setHideSpecial(event.target.checked);
  };

  const checkbox = {
    checked: styles.checkbox,
  };

  const checkboxLabel = {
    label: styles.checkboxLabel,
  };

  const mainTitle = {
    root: styles.createNewSpecialTitle,
  };

  const mainSubTitle = {
    root: styles.createNewSpecialMainSubTitle,
  };

  const specialSectionHeading = {
    root: styles.specialSectionHeading,
  };

  const specialSectionInput = {
    root: styles.specialTitleInput,
  };

  const cancelButton = {
    text: styles.cancelButton,
  };

  const onTitleChange = (e) => {
    setSpecialTitle(e.target.value);
  };

  const onDescriptionChange = (e) => {
    setSpecialDescription(e.target.value);
  };

  const onCancel = () => {
    uiStateStore.setIsExpirationDateCheckboxTicked(false);
    commonStore.setUpdateNewSpecial(null);
    uiStateStore.setAddSpecialOpen(false);
  };

  const showCancelDialog = () => {
    uiStateStore.openDialogWithCancelAndConfirm(i18n.t("AddNewSpecial.CancelDialogText"), i18n.t("AddNewSpecial.Yes"), i18n.t("AddNewSpecial.No"), onCancel);
  };

  const showSpecialPreview = () => {
    uiStateStore.setShowAddNewSpecialPreview(true);
  };

  return uiStateStore.showAddNewSpecialPreview ? (
    <NewSpecialPreview title={specialTitle} text={specialDescription} published={!hideSpecial} />
  ) : (
    <div data-testid="addNewSpecialContainer">
      <div>
        <div>
          <Typography classes={mainTitle} gutterBottom data-testid="addNewSpecialMainTitle">
            {t("AddNewSpecial.CreateNewSpecialTitle")}
          </Typography>
          <Typography classes={mainSubTitle} gutterBottom data-testid="addNewSpecialMainSubTitle">
            {t("AddNewSpecial.CreateNewSpecialSubtitle")}
          </Typography>
        </div>

        <div>
          <Typography classes={specialSectionHeading} gutterBottom data-testid="addNewSpecialTitleHeading">
            {t("AddNewSpecial.SpecialTitle")}
          </Typography>

          <TextField
            variant="outlined"
            size="small"
            placeholder={t("AddNewSpecial.EnterSpecialTitle")}
            inputProps={{
              "data-testid": "specialTitleInput",
            }}
            value={specialTitle}
            onChange={onTitleChange}
            classes={specialSectionInput}
          />
        </div>

        <div>
          <Typography classes={specialSectionHeading} gutterBottom data-testid="addNewSpecialDescriptionHeading">
            {t("AddNewSpecial.SpecialDescription")}
          </Typography>

          <TextField
            variant="outlined"
            size="small"
            placeholder={t("AddNewSpecial.EnterSpecialDescription")}
            fullWidth
            inputProps={{
              "data-testid": "specialDescriptionInput",
            }}
            value={specialDescription}
            onChange={onDescriptionChange}
            multiline
            rows={6}
          />
        </div>
      </div>

      <div className={styles.specialDataContainer}>
        <div className={styles.flexContainer}>
          <ExpirationDateCheckbox />

          <FormControlLabel
            control={
              <Checkbox
                checked={hideSpecial}
                onChange={onHideSpecialChange}
                name="hideSpecial"
                value
                classes={checkbox}
                data-testid="hideSpecialCheckbox"
                inputProps={{ "data-testid": "hideSpecialCheckboxInput" }}
              />
            }
            label={t("SpecialOffersSection.HideSpecialFromWebsite")}
            classes={checkboxLabel}
          />
        </div>
        <div className={styles.row}>
          <div className={styles.flexColumn}>
            <ExpirationDateDropdown />
          </div>
          <div className={styles.buttonsContainer}>
            <Button variant="text" classes={cancelButton} onClick={showCancelDialog} data-testid="cancelAddSpecialBtn">
              {t("AddNewSpecial.Cancel")}
            </Button>
            <Button
              variant="text"
              className={`${styles.previewBtn} ${previewActive ? styles.previewBtnActive : styles.previewBtnInactive}`}
              onClick={showSpecialPreview}
              data-testid="previewAddSpecialBtn"
              disabled={!previewActive}
            >
              {t("AddNewSpecial.PreviewSpecial")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AddNewSpecial;
