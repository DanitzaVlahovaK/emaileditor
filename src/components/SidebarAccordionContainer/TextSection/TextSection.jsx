import React from "react";
import { observer } from "mobx-react-lite";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import FlipToFrontIcon from "@material-ui/icons/FlipToFront";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import { useRootStore } from "../../../mobx/bridge";
import styles from "./TextSection.module.css";

const allowedHtmlTags = ["b", "br", "ul", "li", "ol", "p", "img", "strong", "i", "a"];

const TextSection = observer(() => {
  const { t } = useTranslation();

  const { commonStore, uiStateStore } = useRootStore();

  const [disabled, setDisabled] = React.useState(false);

  const onContentChange = (event, item) => {
    commonStore.setSelectedStockContent({
      title: event.target.value,
      content: item.props.content,
    });
    setDisabled(false);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(commonStore.selectedStockContent?.content);

    setDisabled(true);
  };

  const isTextMarketingOptInTemplateSelected =
    commonStore.selectedTemplate?.id === commonStore.textMarketingOptInTemplateId || commonStore.selectedEmailCampaign?.templateId === commonStore.textMarketingOptInTemplateId;

  const eventStockContent =
    isTextMarketingOptInTemplateSelected && commonStore.getIsTextConnectEnabled
      ? uiStateStore.selectedEvent?.stockContent
      : uiStateStore.selectedEvent?.stockContent?.filter((sc) => sc.title !== commonStore.textMarketingOptInStockContentTitle);

  return (
    <div data-testid="textSectionContainer" className={styles.textSectionContainer}>
      <FormControl variant="outlined" size="small">
        <Select
          value={commonStore.selectedStockContent?.title || "placeholder"}
          onChange={onContentChange}
          SelectDisplayProps={{
            "data-testid": "stockContentSelect",
          }}
          autoWidth
          className={styles.selectStockContent}
        >
          {!commonStore.selectedStockContent ? (
            <MenuItem key="placeholder" value="placeholder" content="placeholder" disabled data-testid="stockContentDefault">
              {t("TextSection.DropdownPlaceholder")}
            </MenuItem>
          ) : null}
          {eventStockContent?.map((m, index) => (
            <MenuItem key={m.title} value={m.title} content={m.content} data-testid={`stockContent-${index}`}>
              {m.title}
            </MenuItem>
          ))}
        </Select>
        {commonStore.selectedStockContent ? (
          <>
            <div
              className={styles.stockContentPreview}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(commonStore.selectedStockContent?.content, {
                  ALLOWED_TAGS: allowedHtmlTags,
                }),
              }}
              data-testid="stockContentText"
            />
            <div className={styles.copyBtnWrapper}>
              <Button onClick={copy} disabled={disabled} startIcon={<FlipToFrontIcon />} data-testid="copyBtn" className={styles.copyBtn}>
                {disabled ? t("TextSection.CopiedBtn") : t("TextSection.CopyBtn")}
              </Button>
            </div>
          </>
        ) : null}
      </FormControl>
    </div>
  );
});

export default TextSection;
