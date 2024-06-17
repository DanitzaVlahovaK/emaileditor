import { observer } from "mobx-react-lite";
import React from "react";
import { useTranslation } from "react-i18next";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import styles from "./ExistingSpecials.module.css";
import { useRootStore } from "../../../../mobx/bridge";
import SpecialPreview from "../SpecialPreview/SpecialPreview";
import dragDropImg from "../../../../assets/images/drag-drop-btn.png";
import SpecialDetails from "../SpecialDetails/SpecialDetails";

const ExistingSpecials = observer(() => {
  const { t } = useTranslation();
  const { commonStore, uiStateStore } = useRootStore();

  const onSpecialChange = (event) => {
    const selectedSpecialId = event.target.value;
    const selectedSpecial = commonStore.specials.find((x) => x.id === selectedSpecialId);

    if (selectedSpecial) {
      commonStore.setSelectedSpecial(selectedSpecial);
    }
  };

  const onAddNewSpecialClicked = () => {
    uiStateStore.setAddSpecialOpen(true);
  };

  const onDragStart = (e) => {
    uiStateStore.setShouldFocusEditor(true);

    const special = document.querySelector('[data-special=""]').outerHTML;

    e.dataTransfer.setData("text/html", special);
  };

  const addSpecialBtn = {
    root: styles.btn,
  };

  let defaultAppointmentURL = commonStore.templateKeywordData?.tokens?.["[COMPANY_APPOINTMENT_URL_ZO]"];
  const absoluteURLPattern = /^https?:\/\//i;
  defaultAppointmentURL = absoluteURLPattern?.test(defaultAppointmentURL) ? defaultAppointmentURL : `${commonStore.templateKeywordData?.tokens?.["[COMPANY_URL]"]}${defaultAppointmentURL}`;
  const processedAppointmentURL = defaultAppointmentURL?.endsWith("=") ? `${defaultAppointmentURL}${commonStore.selectedSpecial?.id}` : defaultAppointmentURL;

  return (
    <div>
      <div className={styles.subTitle}>{t("SpecialOffersSection.ExistingSpecialsTitle")}</div>
      <div className={styles.formContainer}>
        <FormControl variant="outlined" size="small" className={styles.formControl}>
          <Select
            value={commonStore.selectedSpecial?.id || "placeholder"}
            onChange={onSpecialChange}
            SelectDisplayProps={{
              "data-testid": `specialsSelect`,
            }}
            autoWidth
          >
            {!commonStore.selectedSpecial ? (
              <MenuItem key="placeholder" value="placeholder" disabled data-testid="specialDefaultValue">
                {t("SpecialOffersSection.DropdownPlaceholder")}
              </MenuItem>
            ) : null}
            {commonStore.specials?.map((m, index) => (
              <MenuItem key={m.id} value={m.id} data-testid={`special-${index}`}>
                {m.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button color="primary" disableElevation data-testid="addSpecialBtn" classes={addSpecialBtn} onClick={onAddNewSpecialClicked} variant="contained">
          {t("SpecialOffersSection.NewSpecialButton")}
        </Button>
      </div>
      {commonStore.selectedSpecial ? (
        <div className={styles.specialContainer}>
          <span className={styles.specialPreviewTitle}>{t("SpecialOffersSection.SpecialPreview")}</span>
          <SpecialPreview title={commonStore.selectedSpecial.title} text={commonStore.selectedSpecial.text} couponUrl={processedAppointmentURL} isExpirationDateChecked />
          <div className={styles.detailsContainer}>
            <SpecialDetails
              expirationDays={commonStore.selectedSpecial.expirationDays}
              expirationDate={commonStore.selectedSpecial.expirationDate}
              published={commonStore.selectedSpecial.published}
              isExpirationDateChecked
            />
            <div className={styles.dragDropBtnContainer}>
              <img
                className={styles.dragDropBtn}
                src={dragDropImg}
                id="drag-drop-btn"
                data-testid="existingSpecialsDragDropButton"
                alt={t("FileUploader.DragAndDropBtn")}
                draggable
                onDragStart={onDragStart}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
});

export default ExistingSpecials;
