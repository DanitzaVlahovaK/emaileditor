import React from "react";
import { observer } from "mobx-react-lite";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import { ColorButton } from "material-ui-color";
import { useRootStore } from "../../../../mobx/bridge";
import presetColors from "../../../../helpers/presetColors";
import styles from "./ColorPickerFixedColors.module.css";
import SetAsDefaultCheckbox from "../SetAsDefaultCheckbox/SetAsDefaultCheckbox";

const ColorPickerFixedColors = observer((props) => {
  const { title, updateFunction, colorValue, getLabelText, dataTestId, onSetAsDefault, setAsDefaultChecked } = props;
  const { commonStore } = useRootStore();
  const colorBoxRef = React.useRef(null);
  const [isOpen, setIsOpen] = React.useState(false);

  const onColorChange = (e) => {
    if (updateFunction) {
      commonStore.setTextReplaced(true);
      updateFunction(e.target.value);
    }
  };

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.colorPickerContainer} data-testid="colorPickerFixedColorsContainer">
      <span className={styles.colorPickerHeading} data-testid={`${dataTestId}Title`}>
        {title}
      </span>
      <div className={styles.selectContainer}>
        <FormControl>
          <Select
            ref={colorBoxRef}
            value={colorValue}
            displayEmpty
            inputProps={{
              "aria-label": "Without label",
            }}
            variant="outlined"
            open={isOpen}
            onChange={onColorChange}
            onOpen={onOpen}
            onClose={onClose}
            className={styles.colorPickerSelect}
            data-testid={`${dataTestId}Select`}
          >
            {!isOpen ? (
              <MenuItem value="" disabled>
                Select Color
              </MenuItem>
            ) : null}
            {presetColors.map((m, index) => (
              <MenuItem key={m.value} value={m.value} data-testid={`colorPickerFixedColorsOption-${index}`}>
                <ColorButton color={m.value} className={styles.menuItemColorBtn} />
                {m.text}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <ColorButton color={colorValue} className={colorValue ? styles.colorBtn : [styles.colorBtn, styles.strikethrough].join(" ")} />
      </div>
      <SetAsDefaultCheckbox getLabelText={getLabelText} onSetAsDefault={onSetAsDefault} dataTestId={dataTestId} checked={setAsDefaultChecked} />
    </div>
  );
});

export default ColorPickerFixedColors;
