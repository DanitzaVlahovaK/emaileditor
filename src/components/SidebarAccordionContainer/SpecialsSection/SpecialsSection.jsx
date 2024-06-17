import { observer } from "mobx-react-lite";
import React from "react";

import { useRootStore } from "../../../mobx/bridge";
import AddNewSpecial from "./AddNewSpecial/AddNewSpecial";
import ExistingSpecials from "./ExistingSpecials/ExistingSpecials";
import styles from "./SpecialsSection.module.css";

const SpecialsSection = observer(() => {
  const { uiStateStore } = useRootStore();

  return (
    <div className={styles.specialsSectionContainer} data-testid="specialsSectionContainer">
      {uiStateStore.addSpecialOpen ? <AddNewSpecial /> : <ExistingSpecials />}
    </div>
  );
});

export default SpecialsSection;
