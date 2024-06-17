import cloneDeep from "lodash/cloneDeep";
import omit from "lodash/omit";
import { mainComponents } from "./utils/utils";
import rootStore from "../mobx/stores/rootStore";
import { getUnsubscribedEmails } from "../network/requests";
import { getLocationsQueryString } from "./csvHelpers/csvHelpers";

const copySelectedCampaignById = async (id) => {
  const selectedCampaign = rootStore.commonStore.campaigns.find(
    (f) => f.id === id
  );

  if (selectedCampaign) {
    rootStore.uiStateStore.setForceBackBtnToDashboard(true);

    const copiedCampaignObject = cloneDeep(omit(selectedCampaign, ["id"]));

    if (copiedCampaignObject.status === 2) {
      copiedCampaignObject.sendDate = null;
    }

    if (
      !selectedCampaign.settings?.lastVisitStart &&
      !selectedCampaign.settings?.lastVisitEnd
    ) {
      const unsubscribedEmails =
        (
          await getUnsubscribedEmails(
            rootStore.commonStore.cpClientId,
            getLocationsQueryString(rootStore.commonStore.locationsData)
          )
        )?.data || [];

      copiedCampaignObject.recipients = selectedCampaign.recipients.filter(
        (r) => !unsubscribedEmails.includes(r.email)
      );
    }

    rootStore.commonStore.setSelectedEmailCampaign(copiedCampaignObject);

    rootStore.uiStateStore.setSelectedEventForCampaign(selectedCampaign);

    rootStore.uiStateStore.setMainActiveComponent(
      mainComponents.CreateAnEmailBlastDesignEdit
    );
  }
};

export default copySelectedCampaignById;
