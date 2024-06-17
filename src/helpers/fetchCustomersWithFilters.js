import i18n from "i18next";
import { getCustomersWithAllFilters } from "../network/requests";
import rootStore from "../mobx/stores/rootStore";

const fetchCustomersWithFilters = async () => {
  const { uiStateStore } = rootStore;

  try {
    uiStateStore.setShowToSectionLoader(true);
    uiStateStore.incNumberOfActiveRequests();
    await getCustomersWithAllFilters();
  } catch (error) {
    uiStateStore.openErrorDialog(i18n.t("General.FailedToFetchRecipientsData"));
  } finally {
    uiStateStore.setShowToSectionLoader(false);
    uiStateStore.decNumberOfActiveRequests();
  }
};

export default fetchCustomersWithFilters;
