import React from "react";
import { observer } from "mobx-react-lite";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useRootStore } from "../../../../mobx/bridge";
import styles from "./SetAsDefaultCheckbox.module.css";

const SetAsDefaultCheckbox = observer((props) => {
  const { commonStore } = useRootStore();
  const { getLabelText, onSetAsDefault, dataTestId, checked } = props;

  const checkbox = {
    checked: styles.checkbox,
  };
  const checkboxLabel = {
    label: styles.checkboxLabel,
  };

  return commonStore.selectedLocationId ? (
    <div data-testid={`${dataTestId}Container`}>
      <FormControlLabel
        classes={checkboxLabel}
        control={
          <Checkbox checked={checked || false} onChange={onSetAsDefault} classes={checkbox} data-testid={`${dataTestId}CheckboxLabel`} inputProps={{ "data-testid": `${dataTestId}Checkbox` }} />
        }
        label={getLabelText()}
        data-testid={`${dataTestId}Label`}
      />
    </div>
  ) : null;
});

export default SetAsDefaultCheckbox;
