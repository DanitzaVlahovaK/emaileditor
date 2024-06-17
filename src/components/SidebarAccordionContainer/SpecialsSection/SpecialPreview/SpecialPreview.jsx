/* eslint-disable react/no-danger */
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import React from "react";
import DOMPurify from "dompurify";
import { useRootStore } from "../../../../mobx/bridge";
import parseTextToHtml from "../../../../helpers/plainTextToHtmlParser";

const SpecialPreview = observer((props) => {
  const { title, text, couponUrl } = props;
  const { commonStore } = useRootStore();
  const { t } = useTranslation();
  const allowedHtmlTags = ["b", "br", "ul", "li", "strong", "p"];

  const trStyle = {
    margin: 0,
    border: 0,
    padding: 0,
    width: "100%",
  };

  return (
    <table
      bgcolor="#f0f0f0"
      data-special=""
      data-testid="specialPreviewContainer"
      style={{
        background: "#f0f0f0",
        border: `8px solid #f0f0f0`,
        width: "100%",
      }}
    >
      <tr>
        <td>
          <table
            bgcolor="#f0f0f0"
            border="0"
            cellSpacing="0"
            style={{
              margin: 0,
              padding: 0,
              width: "100%",
              border: "2px dashed #c0c0c0",
              background: "#f0f0f0",
            }}
          >
            <tbody>
              <tr style={trStyle}>
                <td
                  data-testid="specialPreviewTitle"
                  style={{
                    margin: 0,
                    border: 0,
                    padding: "30px 15px",
                    width: "100%",
                    textAlign: "center",
                    fontFamily: "arial, sans-serif",
                    color: "#444444",
                    fontSize: "24px",
                    fontWeight: "bold",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(title, {
                      ALLOWED_TAGS: allowedHtmlTags,
                    }),
                  }}
                />
              </tr>
              <tr style={trStyle}>
                <td
                  data-testid="specialPreviewContent"
                  style={{
                    margin: 0,
                    border: 0,
                    padding: " 0 10px",
                    width: "100%",
                    textAlign: "center",
                    fontFamily: "arial, sans-serif",
                    color: "##575757",
                    fontSize: "14px",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(parseTextToHtml(text), {
                      ALLOWED_TAGS: allowedHtmlTags,
                    }),
                  }}
                />
              </tr>
              <tr style={trStyle}>
                <td
                  style={{
                    margin: 0,
                    border: 0,
                    padding: "30px 15px",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  <a
                    data-testid="specialPreviewURL"
                    bgcolor={commonStore.selectedThemeColor || "#86c336"}
                    style={{
                      border: `solid ${commonStore.selectedThemeColor || "#86c336"}`,
                      borderWidth: "10px 25px",
                      margin: "5px",
                      backgroundColor: commonStore.selectedThemeColor || "#86c336",
                      background: commonStore.selectedThemeColor || "#86c336",
                      color: "white",
                      textDecoration: "none",
                      fontFamily: "Arial",
                      fontSize: "14px",
                      fontWeight: 700,
                      lineHeight: "20px",
                    }}
                    href={couponUrl}
                    data-appointment=""
                    rel="noreferrer"
                    target="_blank"
                  >
                    {t("SpecialPreview.MakeAnAppointment")}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </table>
  );
});

export default SpecialPreview;
