import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import DayjsUtils from "@date-io/dayjs";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import { useRootStore } from "../../../../../mobx/bridge";
import styles from "./ExpirationDateDropdown.module.css";

const ExpirationDateDropdown = observer(() => {
  const { commonStore, uiStateStore } = useRootStore();
  const { t } = useTranslation();

  const now = new Date();
  const twoWeeksFromNow = new Date();
  twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

  let selectedDropdownInitialValue = "placeholder";
  if (commonStore.newSpecial?.expirationDate) {
    selectedDropdownInitialValue = 0;
  } else if (commonStore.newSpecial?.expirationDays) {
    selectedDropdownInitialValue = commonStore.newSpecial?.expirationDays;
  }

  const [selectedDropdownValue, setSelectedDropdownValue] = React.useState(selectedDropdownInitialValue);
  const [selectedDatePickerValue, setSelectedDatePickerValue] = React.useState(commonStore.newSpecial?.expirationDate || twoWeeksFromNow);

  const expirationDates = [
    { days: 2, text: `2 ${t("ExpirationDate.DaysFromView")}` },
    { days: 7, text: `1 ${t("ExpirationDate.WeekFromView")}` },
    { days: 14, text: `2 ${t("ExpirationDate.WeeksFromView")}` },
    { days: 28, text: `4 ${t("ExpirationDate.WeeksFromView")}` },
    { days: 42, text: `6 ${t("ExpirationDate.WeeksFromView")}` },
    { days: 90, text: `3 ${t("ExpirationDate.MonthsFromView")}` },
    { days: 120, text: `4 ${t("ExpirationDate.MonthsFromView")}` },
    { days: 180, text: `6 ${t("ExpirationDate.MonthsFromView")}` },
    { days: 0, text: `${t("ExpirationDate.CustomExpirationDate")}` },
  ];

  const onExpirationDateChange = (e) => {
    if (e.target.value === 0) {
      commonStore.setUpdateNewSpecial({
        ...commonStore.newSpecial,
        expirationDate: selectedDatePickerValue,
        expirationDays: null,
      });
    } else {
      commonStore.setUpdateNewSpecial({
        ...commonStore.newSpecial,
        expirationDate: null,
        expirationDays: e.target.value,
      });
    }

    setSelectedDropdownValue(e.target.value);
  };

  const onDateChange = (dateObj) => {
    setSelectedDatePickerValue(dateObj);

    commonStore.setUpdateNewSpecial({
      ...commonStore.newSpecial,
      expirationDate: dateObj.$d,
      expirationDays: null,
    });
  };

  return (
    <div className={styles.expirationDateDropdownContainer}>
      {uiStateStore.isExpirationDateCheckboxTicked ? (
        <div>
          <FormControl variant="outlined" size="small">
            <Select
              defaultValue="placeholder"
              value={selectedDropdownValue}
              onChange={onExpirationDateChange}
              SelectDisplayProps={{
                "data-testid": `expirationSelect`,
              }}
            >
              {expirationDates.map((m) => (
                <MenuItem key={m.days} value={m.days} data-testid={`expirationSelect-${m.days}`}>
                  {m.text}
                </MenuItem>
              ))}
              {selectedDropdownValue === "placeholder" ? (
                <MenuItem key="placeholder" value="placeholder" disabled>
                  {t("ExpirationDate.SelectPlaceholder")}
                </MenuItem>
              ) : null}
            </Select>
          </FormControl>
        </div>
      ) : null}
      {selectedDropdownValue === 0 && uiStateStore.isExpirationDateCheckboxTicked ? (
        <div className={styles.datePickerContainer}>
          <MuiPickersUtilsProvider utils={DayjsUtils}>
            <KeyboardDatePicker
              size="small"
              variant="inline"
              inputVariant="outlined"
              disableToolbar
              format="MM/DD/YYYY"
              value={selectedDatePickerValue}
              minDate={now}
              onChange={onDateChange}
              autoOk
              InputAdornmentProps={{
                "data-testid": `expirationDatepickerButton`,
              }}
              inputProps={{
                "data-testid": "expirationDatepickerInput",
              }}
            />
          </MuiPickersUtilsProvider>
        </div>
      ) : null}
    </div>
  );
});

export default ExpirationDateDropdown;
