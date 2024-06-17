/* eslint-disable react/no-danger */
import { observer } from "mobx-react-lite";
import React from "react";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import { useRootStore } from "../../../mobx/bridge";
import dragDropImg from "../../../assets/images/drag-drop-btn.png";
import styles from "./Buttons.module.css";

const Buttons = observer(() => {
  const { commonStore, uiStateStore } = useRootStore();
  const { t } = useTranslation();

  const [previewTemplate, setPreviewTemplate] = React.useState(commonStore.getDefaultButtonTemplate);

  const facebookImage = "https://kukui-retention.s3.us-west-1.amazonaws.com/emailCampaignSocialMedia/FB.png";
  const googleMyBusinessImage = "https://kukui-retention.s3.us-west-1.amazonaws.com/emailCampaignSocialMedia/GMB.png";
  const yelpImage = "https://kukui-retention.s3.us-west-1.amazonaws.com/emailCampaignSocialMedia/Yelp.png";

  const buttons = [
    {
      name: t("Buttons.AppointmentButton"),
      id: "btnAppointmentLink",
      src: previewTemplate
        .replace("[DEFAULT_BTN_FONT_SIZE]", "12px;")
        .replace("[DEFAULT_BTN_TEXT]", t("SpecialPreview.MakeAnAppointment"))
        .replace("[DEFAULT_BTN_URL]", "[COMPANY_APPOINTMENT_URL_ZO]"),
      transfer: previewTemplate
        .replace("[DEFAULT_BTN_FONT_SIZE]", "14px;")
        .replace("[DEFAULT_BTN_TEXT]", t("SpecialPreview.MakeAnAppointment"))
        .replace("[DEFAULT_BTN_URL]", "[COMPANY_APPOINTMENT_URL_ZO]"),
      url: commonStore.selectedLocationObject?.appointmentURL,
    },
    {
      name: t("Buttons.FacebookButton"),
      id: "btnFacebookLink",
      src: facebookImage,
      transfer: `<a data-default-btn-template="" href="[COMPANY_FACEBOOK]"><img src="${facebookImage}" alt="Facebook"/></a>`,
      url: commonStore.selectedLocationObject?.facebookURL,
    },
    {
      name: t("Buttons.GoogleButton"),
      id: "btnGMBLink",
      src: googleMyBusinessImage,
      transfer: `<a data-default-btn-template="" href="[COMPANY_GOOGLE]"><img src="${googleMyBusinessImage}" alt="Google"/></a>`,
      url: commonStore.selectedLocationObject?.googleURL,
    },
    {
      name: t("Buttons.YelpButton"),
      id: "btnYelpLink",
      src: yelpImage,
      transfer: `<a data-default-btn-template="" href="[COMPANY_YELP]"><img src="${yelpImage}" alt="Yelp" /></a>`,
      url: commonStore.selectedLocationObject?.yelpURL,
    },
    {
      name: t("Buttons.WebsiteButton"),
      id: "btnWebsiteLink",
      src: previewTemplate.replace("[DEFAULT_BTN_FONT_SIZE]", "12px;").replace("[DEFAULT_BTN_TEXT]", "VISIT OUR WEBSITE").replace("[DEFAULT_BTN_URL]", "[COMPANY_URL]"),
      transfer: previewTemplate.replace("[DEFAULT_BTN_FONT_SIZE]", "14px;").replace("[DEFAULT_BTN_TEXT]", "VISIT OUR WEBSITE").replace("[DEFAULT_BTN_URL]", "[COMPANY_URL]"),
      url: commonStore.selectedLocationObject?.websiteURL,
    },
  ];

  if (commonStore.getIsTextConnectEnabled) {
    buttons.push({
      name: t("Buttons.OptInButton"),
      id: "btnOptInLink",
      src: previewTemplate.replace("[DEFAULT_BTN_FONT_SIZE]", "12px;").replace("[DEFAULT_BTN_TEXT]", "OPT-IN TODAY!").replace("[DEFAULT_BTN_URL]", "[COMPANY_OPT_IN_URL_ZO]"),
      transfer: previewTemplate.replace("[DEFAULT_BTN_FONT_SIZE]", "14px;").replace("[DEFAULT_BTN_TEXT]", "OPT-IN TODAY!").replace("[DEFAULT_BTN_URL]", "[COMPANY_OPT_IN_URL_ZO]"),
      url: commonStore.templateKeywordData?.tokens?.["[COMPANY_OPT_IN_URL_ZO]"],
    });
  }

  const activeButtons = buttons.filter((f) => f.url);
  const [selectedButtonId, setSelectedButtonId] = React.useState(activeButtons?.length ? activeButtons[0].id : null);

  React.useEffect(() => {
    setSelectedButtonId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commonStore.selectedLocationObject]);

  const selectedButton = buttons.find((f) => f.id === selectedButtonId);

  React.useEffect(() => {
    const btnTemplate = commonStore.getDefaultButtonTemplate.replace("[DEFAULT_BTN_BACKGROUND_COLOR]", commonStore.selectedEmailCampaign?.settings?.themeColor);
    setPreviewTemplate(btnTemplate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commonStore.selectedEmailCampaign?.settings?.themeColor]);

  const onDragStart = (e) => {
    uiStateStore.setShouldFocusEditor(true);
    e.dataTransfer.setData("text/html", selectedButton?.transfer);
  };

  const onClick = (selectedId) => () => {
    setSelectedButtonId(selectedId);
  };

  return (
    <div className={styles.flexRowParent} data-testid="buttonsParent">
      {activeButtons?.length ? (
        <>
          <div className={styles.flexColumnButtons}>
            {activeButtons.map((x) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <div
                key={x.id}
                className={selectedButtonId === x.id ? [styles.button, styles.buttonSelected].join(" ") : styles.button}
                onClick={onClick(x.id)}
                role="button"
                tabIndex={0}
                data-testid={x.id}
              >
                {x.name}
              </div>
            ))}
          </div>

          <div className={selectedButtonId != null ? styles.flexColumnDraggable : [styles.flexColumnDraggable, styles.noBackground].join(" ")} data-testid={`btnPreview-${selectedButtonId}`}>
            {selectedButtonId != null ? (
              <>
                <div className={styles.draggableIcon}>
                  {selectedButtonId === "btnAppointmentLink" || selectedButtonId === "btnWebsiteLink" || selectedButtonId === "btnOptInLink" ? (
                    <div
                      draggable={false}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(selectedButton?.src),
                      }}
                    />
                  ) : (
                    <img data-testid="drag-drop-thumbnail" src={selectedButton?.src} alt={t("FileUploader.DragAndDropImg")} draggable={false} />
                  )}
                </div>
                <img
                  className={styles.dragDropBtn}
                  src={dragDropImg}
                  id="drag-drop-button-component"
                  data-testid="drag-drop-button-component"
                  alt={t("FileUploader.DragAndDropBtn")}
                  draggable
                  onDragStart={onDragStart}
                />
              </>
            ) : null}
          </div>
        </>
      ) : (
        <span>{t("Buttons.SelectLocation")}</span>
      )}
    </div>
  );
});

export default Buttons;
