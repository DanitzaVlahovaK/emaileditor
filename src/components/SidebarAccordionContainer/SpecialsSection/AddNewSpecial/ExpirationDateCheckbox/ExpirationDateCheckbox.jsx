import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useRootStore } from "../../../../../mobx/bridge";
import styles from "./ExpirationDateCheckbox.module.css";

const ExpirationDateCheckbox = observer(() => {
  const { uiStateStore } = useRootStore();
  const { t } = useTranslation();

  const checkbox = {
    checked: styles.checkbox,
  };

  const checkboxLabel = {
    label: styles.checkboxLabel,
  };

  const onTick = () => {
    uiStateStore.setIsExpirationDateCheckboxTicked(!uiStateStore.isExpirationDateCheckboxTicked);
  };

  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={uiStateStore.isExpirationDateCheckboxTicked}
            onChange={onTick}
            value
            classes={checkbox}
            data-testid="expirationDateCheckBox"
            inputProps={{ "data-testid": "expirationDateCheckBoxInput" }}
          />
        }
        label={t("ExpirationDate.CheckBoxLabel")}
        classes={checkboxLabel}
      />
    </div>
  );
});

export default ExpirationDateCheckbox;
