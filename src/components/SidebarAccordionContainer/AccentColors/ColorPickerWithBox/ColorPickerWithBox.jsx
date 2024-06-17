import React from "react";
import { observer } from "mobx-react-lite";
import Popover from "@material-ui/core/Popover";
import PropTypes from "prop-types";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import debounce from "lodash/debounce";
import { ColorButton, ColorBox } from "material-ui-color";
import { useRootStore } from "../../../../mobx/bridge";
import styles from "./ColorPickerWithBox.module.css";
import SetAsDefaultCheckbox from "../SetAsDefaultCheckbox/SetAsDefaultCheckbox";

const ColorPickerWithBox = observer((props) => {
  const { commonStore } = useRootStore();
  const { title, updateFunction, colorValue, getLabelText, onSetAsDefault, dataTestId, setAsDefaultChecked } = props;
  const colorBoxRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [color, setColor] = React.useState(colorValue || "");
  const preventColorChange = React.useRef(false);

  React.useEffect(() => {
    let timeout;

    if (open) {
      preventColorChange.current = true;

      // prevent bug with color picker that changes color, if the popover opens and the mouse is over the gradient
      timeout = setTimeout(() => {
        preventColorChange.current = false;
      }, 250);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [open]);

  const onColorChange = debounce((value) => {
    setColor(value);

    if (!preventColorChange.current && updateFunction && !value.error) {
      commonStore.setTextReplaced(true);
      if (value?.hex) {
        updateFunction(`#${value.hex}`);
        commonStore.setRecentlySelectedColors(value);
      } else {
        updateFunction(null);
      }
    }
  }, 150);

  const showPopup = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const popOver = (
    <Popover
      open={open}
      anchorEl={colorBoxRef.current}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <ColorBox value={color} onChange={onColorChange} />

      <div className={styles.recentColorsContainer}>
        {commonStore.recentlySelectedColors.map((m) => (
          <ColorButton key={m.hex} color={m} onClick={() => onColorChange(m)} />
        ))}
        <div className={styles.noColor}>
          <div role="button" tabIndex={0} className={styles.noColorBtn} onClick={() => onColorChange("Select Color")} onKeyPress={() => {}}>
            <ColorButton key="empty" color="none" className={styles.strikethrough} />
            <span className={styles.noColorText}>No Color</span>
          </div>
        </div>
      </div>
    </Popover>
  );

  let selectedValue = "Select Color";
  if (color?.hex) {
    selectedValue = `#${color?.hex}`;
  } else if (color) {
    selectedValue = color;
  }

  return (
    <div data-testid="colorPickerWithBoxContainer" className={styles.colorPickerContainer}>
      <span className={styles.colorPickerHeading} data-testid={`${dataTestId}Title`}>
        {title}
      </span>
      <div className={styles.selectContainer}>
        <FormControl>
          <Select
            ref={colorBoxRef}
            value={color}
            displayEmpty
            inputProps={{ "aria-label": "Without label" }}
            open={false}
            variant="outlined"
            onOpen={showPopup}
            className={styles.colorPickerSelect}
            data-testid={`${dataTestId}Select`}
          >
            <MenuItem value={color} disabled>
              {selectedValue}
            </MenuItem>
          </Select>
        </FormControl>

        <ColorButton color={color} className={color ? styles.colorBtn : [styles.colorBtn, styles.strikethrough].join(" ")} />
        {open ? popOver : null}
      </div>
      <SetAsDefaultCheckbox getLabelText={getLabelText} onSetAsDefault={onSetAsDefault} dataTestId={dataTestId} checked={setAsDefaultChecked} />
    </div>
  );
});

ColorPickerWithBox.propTypes = {
  title: PropTypes.string.isRequired,
  updateFunction: PropTypes.func.isRequired,
  colorValue: PropTypes.string,
  getLabelText: PropTypes.func.isRequired,
  onSetAsDefault: PropTypes.func.isRequired,
  dataTestId: PropTypes.string,
  setAsDefaultChecked: PropTypes.bool.isRequired,
};

export default ColorPickerWithBox;
