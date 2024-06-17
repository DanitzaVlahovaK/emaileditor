import { useTranslation } from "react-i18next";
import { observer } from "mobx-react-lite";
import React from "react";
import { getFormattedDate } from "../../../../helpers/utils/utils";
import styles from "./SpecialDetails.module.css";

const SpecialDetails = observer((props) => {
  const { expirationDays, expirationDate, published, isExpirationDateChecked } = props;
  const { t } = useTranslation();

  const getExpiration = () => {
    let result = "";
    if (!isExpirationDateChecked || (!expirationDate && !expirationDays)) {
      result = t("SpecialDetails.NoExpirationDate");
    } else if (expirationDate) {
      const date = typeof expirationDate === "string" ? new Date(expirationDate.substring(0, expirationDate.length - 1)) : expirationDate;

      result = getFormattedDate(date);
    } else if (expirationDays < 7) {
      result = `${expirationDays} ${expirationDays > 1 ? t("SpecialDetails.DaysFromView") : t("SpecialDetails.DayFromView")} `;
    } else if (expirationDays < 60) {
      const weeks = Math.floor(expirationDays / 7);
      result = `${weeks} ${weeks > 1 ? t("SpecialDetails.WeeksFromView") : t("SpecialDetails.WeekFromView")}`;
    } else {
      const months = Math.floor(expirationDays / 30);
      result = `${months} ${t("SpecialDetails.MonthsFromView")}`;
    }

    return result;
  };

  return (
    <div className={styles.details} data-testid="specialDetails">
      <h5>{t("SpecialDetails.SpecialDetails")}</h5>
      <span data-testid="specialDetailsExpirationText">
        {t("SpecialDetails.ExpirationDate")} {getExpiration()}
      </span>
      <span data-testid="specialDetailsPublishedOnWebsite">{published ? t("SpecialDetails.VisibleOnWebsite") : t("SpecialDetails.HiddenFromWebsite")}</span>
    </div>
  );
});

export default SpecialDetails;
