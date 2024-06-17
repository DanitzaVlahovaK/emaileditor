import { observer } from "mobx-react-lite";
import React, { useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import styles from "./EditContentSection.module.css";
import Editor from "./Editor/Editor";
import FileUploader from "./SidebarAccordionContainer/FileUpload/FileUploader";
import SidebarAccordionContainer from "./SidebarAccordionContainer/SidebarAccordionContainer";
import TextSection from "./SidebarAccordionContainer/TextSection/TextSection";
import SpecialsSection from "./SidebarAccordionContainer/SpecialsSection/SpecialsSection";
import AccentColors from "./SidebarAccordionContainer/AccentColors/AccentColors";
import Buttons from "./SidebarAccordionContainer/Buttons/Buttons";

const EditContentSection = observer(() => {
  const { t } = useTranslation();

  const [sideBarStyles, setSideBarStyles] = React.useState(styles.sideBar);
  const ref = useRef();

  const handleScroll = useCallback(() => {
    const div = ref.current;

    const cpElement = document.querySelectorAll("[data-retweb]")[0];

    if (div) {
      if (div?.getBoundingClientRect().top <= 103 && cpElement) {
        setSideBarStyles(`${styles.sideBar} ${styles.topOffset}`);
      } else if (div?.getBoundingClientRect().top > 103) {
        setSideBarStyles(styles.sideBar);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  });

  return (
    <div
      className={styles.editContentSectionContainer}
      data-testid="editContentSectionContainer"
    >
      <div className={sideBarStyles} ref={ref}>
        <SidebarAccordionContainer
          title={t("EditContentSection.AccentColorsHeading")}
          subtitle={t("EditContentSection.AccentColorsSubText")}
          pnlId="pnlAccentColors"
          testId="sidebarAccentColors"
          pendoClass="pendoAccentColors"
        >
          <AccentColors />
        </SidebarAccordionContainer>

        <SidebarAccordionContainer
          title={t("EditContentSection.ImagesHeading")}
          subtitle={t("EditContentSection.ImagesSubText")}
          pnlId="pnlSidebarImages"
          testId="sidebarImages"
          pendoClass="pendoImages"
        >
          <FileUploader />
        </SidebarAccordionContainer>

        <SidebarAccordionContainer
          title={t("EditContentSection.TextHeading")}
          subtitle={t("EditContentSection.TextSubText")}
          pnlId="pnlSidebarText"
          testId="sidebarText"
          pendoClass="pendoText"
        >
          <TextSection />
        </SidebarAccordionContainer>

        <SidebarAccordionContainer
          title={t("EditContentSection.SpecialOffersHeading")}
          subtitle={t("EditContentSection.SpecialOffersSubText")}
          pnlId="pnlSidebarSpecials"
          testId="sidebarSpecials"
          pendoClass="pendoSpecials"
        >
          <SpecialsSection />
        </SidebarAccordionContainer>

        <SidebarAccordionContainer
          title={t("EditContentSection.ButtonsHeading")}
          subtitle={t("EditContentSection.ButtonsSubText")}
          pnlId="pnlSidebarButtons"
          testId="sidebarButtons"
          pendoClass="pendoButtons"
        >
          <Buttons />
        </SidebarAccordionContainer>
      </div>
      <div className={styles.editorContainer}>
        <Editor />
      </div>
    </div>
  );
});

export default EditContentSection;
