/* eslint-disable react/no-danger */
import DOMPurify from "dompurify";
import { observer } from "mobx-react-lite";
import React from "react";
import { useTranslation } from "react-i18next";

const SpecialPreview = observer((props) => {
  const { title, text, couponUrl } = props;
  const { t } = useTranslation();
  const allowedHtmlTags = ["b", "br", "ul", "li", "strong"];

  const trStyle = {
    margin: 0,
    border: 0,
    padding: 0,
    width: "100%;",
  };

  return (
    <div
      style={{
        backgroundColor: "#f0f0f0",
        padding: "8px 9px",
      }}
      data-special=""
    >
      <table
        border="0"
        cellSpacing="0"
        style={{
          margin: 0,
          padding: 0,
          width: "100%",
          border: "2px dashed #c0c0c0",
        }}
      >
        <tbody>
          <tr style={trStyle}>
            <td
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
                __html: DOMPurify.sanitize(text, {
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
                style={{
                  padding: "10px 25px",
                  margin: "5px",
                  backgroundColor: "#86c336",
                  color: "white",
                  textDecoration: "none",
                  fontFamily: "Arial",
                  fontSize: "14px",
                  fontWeight: 700,
                  lineHeight: "20px",
                }}
                href={couponUrl}
              >
                {t("SpecialPreview.MakeAnAppointment")}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default SpecialPreview;
