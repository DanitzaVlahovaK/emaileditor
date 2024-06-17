import { observer } from "mobx-react-lite";
import React from "react";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";
import styles from "./NewSpecialPreview.module.css";
import SpecialDetails from "../../SpecialDetails/SpecialDetails";
import SpecialPreview from "../../SpecialPreview/SpecialPreview";
import { postSpecialData } from "../../../../../network/requests";
import { useRootStore } from "../../../../../mobx/bridge";
import parseTextToHtml from "../../../../../helpers/plainTextToHtmlParser";

const NewSpecialPreview = observer((props) => {
  const { title, text, published } = props;

  const { commonStore, uiStateStore } = useRootStore();

  const { t } = useTranslation();

  const editPreview = () => {
    uiStateStore.setShowAddNewSpecialPreview(false);
  };

  const confirmPreviewAddSpecialBtn = async () => {
    try {
      const addNewSpecial = await postSpecialData(commonStore.cpClientId, {
        ...commonStore.newSpecial,
        title,
        text: parseTextToHtml(text),
        published,
      });

      commonStore.setUpdateNewSpecial(addNewSpecial?.data);
      commonStore.specials.push(commonStore.newSpecial);
      commonStore.setSelectedSpecial(commonStore.newSpecial);
      commonStore.setUpdateNewSpecial(null);

      uiStateStore.setShowAddNewSpecialPreview(false);
      uiStateStore.setIsExpirationDateCheckboxTicked(false);
      uiStateStore.setAddSpecialOpen(false);
    } catch (error) {
      uiStateStore.openErrorDialog(t("General.FailedToSaveSpecial"));
    }
  };

  return (
    <div data-testid="newSpecialPreview">
      <h3 className={styles.subHeading} data-testid="newSpecialPreviewSubheading">
        {t("NewSpecialPreview.SpecialPreview")}
      </h3>
      <p className={styles.warningText} data-testid="newSpecialPreviewWarningText">
        {t("NewSpecialPreview.WarningMessage")}
      </p>
      <SpecialPreview title={title} text={text} />
      <div className={styles.specialDetails}>
        <SpecialDetails
          expirationDays={commonStore.newSpecial?.expirationDays}
          expirationDate={commonStore.newSpecial?.expirationDate}
          published={published}
          isExpirationDateChecked={uiStateStore.isExpirationDateCheckboxTicked}
        />
      </div>
      <div className={styles.buttonsContainer}>
        <Button variant="text" className={styles.editButton} onClick={editPreview} data-testid="newSpecialPreviewEditBtn">
          {t("AddNewSpecial.Edit")}
        </Button>
        <Button variant="text" className={styles.previewBtn} onClick={confirmPreviewAddSpecialBtn} data-testid="newSpecialPreviewConfirmBtn">
          {t("AddNewSpecial.ConfirmAndAddSpecial")}
        </Button>
      </div>
    </div>
  );
});

export default NewSpecialPreview;
