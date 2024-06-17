import { makeAutoObservable } from "mobx";
import {
  defaultLastVisitStart,
  uiFilterLastVisitMapping,
} from "../../helpers/utils/utils";

class FiltersStore {
  get dateRangeFilterUiValues() {
    return this.lastVisitStart !== null && this.lastVisitEnd !== null
      ? [
          uiFilterLastVisitMapping.indexOf(this.lastVisitStart),
          uiFilterLastVisitMapping.indexOf(this.lastVisitEnd),
        ]
      : [0, uiFilterLastVisitMapping.length - 1];
  }

  get lastVisitStart() {
    return this.rootStore?.commonStore?.selectedEmailCampaign?.settings
      ?.lastVisitStart;
  }

  get lastVisitEnd() {
    return this.rootStore?.commonStore?.selectedEmailCampaign?.settings
      ?.lastVisitEnd;
  }

  lastVisitStartRevert = defaultLastVisitStart;

  lastVisitEndRevert = 0;

  get minSpent() {
    return this.rootStore?.commonStore?.selectedEmailCampaign?.settings
      ?.minSpent;
  }

  get maxSpent() {
    return this.rootStore?.commonStore?.selectedEmailCampaign?.settings
      ?.maxSpent;
  }

  minSpentRevert = "";

  maxSpentRevert = "";

  get minVisits() {
    return this.rootStore?.commonStore?.selectedEmailCampaign?.settings
      ?.minVisits;
  }

  get maxVisits() {
    return this.rootStore?.commonStore?.selectedEmailCampaign?.settings
      ?.maxVisits;
  }

  minVisitsRevert = "";

  maxVisitsRevert = "";

  get unreadCampaignId() {
    return this.rootStore?.commonStore?.selectedEmailCampaign?.settings
      ?.unreadCampaignId;
  }

  get customerVehiclesMakes() {
    return (
      this.rootStore?.commonStore?.selectedEmailCampaign?.settings
        ?.customerVehiclesMakes || []
    );
  }

  unreadCampaignIdRevert = "";

  constructor(rootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  get getIsTotalAmountSpentMinGreaterThanMax() {
    return (
      this.minSpent &&
      this.maxSpent &&
      parseFloat(this.minSpent) > parseFloat(this.maxSpent)
    );
  }

  get getIsNumberOfVisitsMinGreaterThanMax() {
    return (
      this.minVisits &&
      this.maxVisits &&
      parseInt(this.minVisits, 10) > parseInt(this.maxVisits, 10)
    );
  }

  get excludeFleetAccounts() {
    return (
      this.rootStore?.commonStore?.selectedEmailCampaign?.settings
        ?.excludeFleetAccounts || false
    );
  }

  get getCheckErrorsInFilterInputs() {
    return (
      this.getIsTotalAmountSpentMinGreaterThanMax ||
      this.getIsNumberOfVisitsMinGreaterThanMax
    );
  }

  setLastVisitStart = (value) => {
    this.rootStore.commonStore.selectedEmailCampaign.settings.lastVisitStart =
      value;
  };

  setLastVisitEnd = (value) => {
    this.rootStore.commonStore.selectedEmailCampaign.settings.lastVisitEnd =
      value;
  };

  setLastVisitStartRevert = (value) => {
    this.lastVisitStartRevert = value;
  };

  setLastVisitEndRevert = (value) => {
    this.lastVisitEndRevert = value;
  };

  setMinSpent = (value) => {
    this.rootStore.commonStore.selectedEmailCampaign.settings.minSpent = value;
  };

  setMaxSpent = (value) => {
    this.rootStore.commonStore.selectedEmailCampaign.settings.maxSpent = value;
  };

  setMinSpentRevert = (value) => {
    this.minSpentRevert = value;
  };

  setMaxSpentRevert = (value) => {
    this.maxSpentRevert = value;
  };

  setMinVisits = (value) => {
    this.rootStore.commonStore.selectedEmailCampaign.settings.minVisits = value;
  };

  setMaxVisits = (value) => {
    this.rootStore.commonStore.selectedEmailCampaign.settings.maxVisits = value;
  };

  setMinVisitsRevert = (value) => {
    this.minVisitsRevert = value;
  };

  setMaxVisitsRevert = (value) => {
    this.maxVisitsRevert = value;
  };

  setUnreadCampaignId = (value) => {
    this.rootStore.commonStore.selectedEmailCampaign.settings.unreadCampaignId =
      value;
  };

  setUnreadCampaignIdRevert = (value) => {
    this.unreadCampaignIdRevert = value;
  };

  setCustomerVehiclesMakes = (value) => {
    this.rootStore.commonStore.selectedEmailCampaign.settings.customerVehiclesMakes =
      value;
  };

  setCustomerVehiclesMakesRevert = (value) => {
    this.customerVehiclesMakesRevert = value;
  };

  setExcludeFleetAccounts = (value) => {
    this.rootStore.commonStore.selectedEmailCampaign.settings.excludeFleetAccounts =
      value;
  };

  setExcludeFleetAccountsRevert = (value) => {
    this.excludeFleetAccountsRevert = value;
  };

  resetAllFilters = (setNull = false) => {
    this.setLastVisitStart(!setNull ? defaultLastVisitStart : null);
    this.setLastVisitEnd(!setNull ? 0 : null);

    this.lastVisitStartRevert = defaultLastVisitStart;
    this.lastVisitEndRevert = 0;

    this.setMinSpent("");
    this.setMaxSpent("");

    this.minSpentRevert = "";
    this.maxSpentRevert = "";

    this.setMinVisits("");
    this.setMaxVisits("");

    this.minVisitsRevert = "";
    this.maxVisitsRevert = "";

    this.setUnreadCampaignId("");
    this.unreadCampaignIdRevert = "";

    this.setCustomerVehiclesMakes("");
    this.customerVehiclesMakesRevert = [];

    this.setExcludeFleetAccounts(false);
    this.excludeFleetAccountsRevert = false;
  };
}

export default FiltersStore;
