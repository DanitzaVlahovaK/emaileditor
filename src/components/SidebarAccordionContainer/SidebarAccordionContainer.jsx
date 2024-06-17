import React from "react";
import { observer } from "mobx-react-lite";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import styles from "./SidebarAccordionContainer.module.css";
import { useRootStore } from "../../mobx/bridge";

const SidebarAccordionContainer = observer((props) => {
  const { uiStateStore } = useRootStore();
  const { title, subtitle, children, pnlId, testId, pendoClass } = props;

  const summary = {
    root: styles.summary,
  };

  const accordion = {
    root: styles.accordion,
  };

  const handleChange = (event, newExpanded) => {
    uiStateStore.setEditContentAccordionState(newExpanded ? pnlId : false);
  };

  return (
    <div className={[styles.accordionContainer, pendoClass].join(" ")}>
      <Accordion classes={accordion} square={false} expanded={uiStateStore.editContentAccordionState === pnlId} onChange={handleChange} elevation={0} data-testid={testId}>
        <AccordionSummary classes={summary} expandIcon={<DoubleArrowIcon className={styles.doubleArrow} />} IconButtonProps={{ edge: "end" }}>
          <Typography className={styles.heading}>{title}</Typography>
          <Typography className={styles.secondaryHeading}>{subtitle}</Typography>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </div>
  );
});

export default SidebarAccordionContainer;
