import { makeAutoObservable } from "mobx";
import i18n from "i18next";
import { mainComponents } from "../../helpers/utils/utils";
import * as utils from "../../helpers/utils/utils";
import sendErrorInfoToCPWeb from "../../helpers/sendErrorInfoToCPWeb";

class UiStateStore {
  mainActiveComponent = mainComponents.EmailBlastDashboard;

  selectedCategory = null;

  templatePreviewToShow = null;

  selectedEvent = null;

  isReviewRecipientsOpen = false;

  isEditRecipientFiltersOpen = false;

  showToSectionLoader = false;

  addSpecialOpen = false;

  shouldFocusEditor = false;

  isExpirationDateCheckboxTicked = false;

  showAddNewSpecialPreview = false;

  editContentAccordionState = false;

  dialogProps = null;

  snackbarProps = null;

  cpHeaderHeight = null;

  isEmbeddedInCp = false;

  isOnSmallerScreen = false;

  loadingScreenOffsetHeight = 0;

  forceBackBtnToDashboard = false;

  designEditValidationErrors = null;

  designEditValidationSectionRefs = {};

  designEditExpandAccordions = false;

  selectedSentEmailCampaign = null;

  sentCampaignsStartDate = utils.threeMonthsAgo;

  sentCampaignsEndDate = utils.today;

  pastSendDateError = false;

  numberOfActiveRequests = 0;

  selectedEmailCampaignDetails = null;

  campaignMetricsLoader = false;

  isCurrencyAdornerPositionInFront = utils.currencyInFront.some((s) => s === i18n.t("General.Locale"));

  showGlobalLoader = false;

  preventCampaignSave = false;

  constructor(rootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  //   constructor(rootStore) {
  //     makeAutoObservable(this);
  //     this.setRootStore(rootStore);
  // }

  get shouldGoBackToDashboard() {
    return this.forceBackBtnToDashboard || this.rootStore.commonStore.selectedEmailCampaign?.id;
  }

  setMainActiveComponent = (value) => {
    this.mainActiveComponent = value;
  };

  setSelectedCategory = (value) => {
    this.selectedCategory = value;
  };

  setTemplatePreviewToShow = (value) => {
    this.templatePreviewToShow = value;
  };

  setSelectedEvent = (value) => {
    this.selectedEvent = value;
  };

  setSelectedEventForCampaign = (campaign) => {
    const selectedEvent = this.rootStore.commonStore.allEvents?.find((event) => event.id === campaign?.eventId);

    this.setSelectedEvent(selectedEvent);
  };

  setErrorMessage = (value) => {
    this.errorMessage = value;
  };

  setIsReviewRecipientsOpen = (value) => {
    this.isReviewRecipientsOpen = value;
  };

  toggleEditRecipientFiltersPopup = () => {
    this.isEditRecipientFiltersOpen = !this.isEditRecipientFiltersOpen;
  };

  setShowToSectionLoader = (value) => {
    this.showToSectionLoader = value;
  };

  setAddSpecialOpen = (value) => {
    this.addSpecialOpen = value;
  };

  setShouldFocusEditor = (value) => {
    this.shouldFocusEditor = value;
  };

  setIsExpirationDateCheckboxTicked = (value) => {
    this.isExpirationDateCheckboxTicked = value;
  };

  setShowAddNewSpecialPreview = (value) => {
    this.showAddNewSpecialPreview = value;
  };

  setEditContentAccordionState = (value) => {
    this.editContentAccordionState = value;
  };

  openErrorDialog(errorMessage, error = null) {
    const message = this.rootStore.errorCodesStore.errors.filter((e) => e.code === error?.response?.data);

    this.dialogProps = {
      isOpen: true,
      subtitle: i18n.t("General.Error"),
      text: message.length > 0 ? `Error ${message[0].code}: ${message[0].message}` : errorMessage,
      cancelBtnText: i18n.t("General.Close"),
    };

    sendErrorInfoToCPWeb(error);
  }

  openDialogWithCancelAndConfirm(messageText, confirmBtnText, cancelBtnText, confirmAction, title, image, subtitle, customComponent, cancelAction) {
    this.dialogProps = {
      isOpen: true,
      text: messageText,
      confirmAction,
      confirmBtnText,
      cancelBtnText,
      title,
      image,
      subtitle,
      customComponent,
      cancelAction,
    };
  }

  openSnackbar(message, severity = "error", autoHideDuration = 10000) {
    this.snackbarProps = {
      isOpen: true,
      message,
      autoHideDuration,
      severity,
    };
  }

  closeSnackbar() {
    this.snackbarProps = null;
  }

  closeDialog() {
    this.dialogProps = null;
  }

  setCpHeaderHeight = (value) => {
    this.cpHeaderHeight = value;
  };

  setLoadingScreenOffsetHeight = (value) => {
    this.loadingScreenOffsetHeight = value;
  };

  setIsEmbeddedInCp = (value) => {
    this.isEmbeddedInCp = value;
  };

  setIsOnSmallerScreen = (value) => {
    this.isOnSmallerScreen = value;
  };

  setForceBackBtnToDashboard = (value) => {
    this.forceBackBtnToDashboard = value;
  };

  setDesignEditValidationErrors = (value) => {
    this.designEditValidationErrors = value;
  };

  setToSectionRef = (value) => {
    this.designEditValidationSectionRefs.selectLocation = value;
  };

  setFromSectionRef = (value) => {
    this.designEditValidationSectionRefs.fromName = value;
    this.designEditValidationSectionRefs.fromEmail = value;
    this.designEditValidationSectionRefs.fromEmailInvalid = value;
  };

  setSubjectSectionRef = (value) => {
    this.designEditValidationSectionRefs.subject = value;
  };

  setDesignEditExpandAccordions = (value) => {
    this.designEditExpandAccordions = value;
  };

  setSelectedSentEmailCampaign = (value) => {
    this.selectedSentEmailCampaign = value;
  };

  setSentCampaignsStartDate = (value) => {
    this.sentCampaignsStartDate = value;
  };

  setSentCampaignsEndDate = (value) => {
    this.sentCampaignsEndDate = value;
  };

  setPastSendDateError = (value) => {
    this.pastSendDateError = value;
  };

  setSelectedEmailCampaignDetails = (value) => {
    this.selectedEmailCampaignDetails = value;
  };

  setShowGlobalLoader = (value) => {
    this.showGlobalLoader = value;
  };

  setPreventCampaignSave = (value) => {
    this.preventCampaignSave = value;
  };

  incNumberOfActiveRequests = () => {
    this.numberOfActiveRequests += 1;
  };

  decNumberOfActiveRequests = () => {
    this.numberOfActiveRequests -= 1;
  };

  setCampaignMetricsLoader = (value) => {
    this.campaignMetricsLoader = value;
  };
}

export default UiStateStore;
