import { makeAutoObservable, runInAction } from "mobx";
import Cookies from "js-cookie";
import { findIana } from "windows-iana";
import dayjs from "dayjs";
import i18n from "i18next";
import {
  addClientDomainIfRelative,
  convertStringToHtml,
  defaultLastVisitStart,
  EmailCampaignStatusEnum,
  emailRegex,
  generateGuid,
  replaceAttributeValue,
  urlKeywords,
} from "../../helpers/utils/utils";
import presetColors from "../../helpers/presetColors";
import applyPreviousRecipientsIgnore from "../../helpers/applyPreviousRecipientsIgnore";
import {
  sortCategories,
  sortGeneralShop,
  sortMarketingHolidays,
} from "../../helpers/sortingHelper";

class CommonStore {
  cpClientId = null;

  locationsData = [];

  get fromSectionName() {
    return this.selectedEmailCampaign?.displayName;
  }

  get fromSectionEmail() {
    return this.selectedEmailCampaign?.emailFrom;
  }

  get subjectSectionSubject() {
    return this.selectedEmailCampaign?.emailSubject;
  }

  subjectSectionPreviewText = null;

  get recipients() {
    return this.selectedEmailCampaign?.recipients || [];
  }

  get recipientsToInclude() {
    return this.recipients?.filter((x) => !x.ignore) || [];
  }

  get selectedLocationId() {
    return this.selectedEmailCampaign?.locationId;
  }

  getAvailableLocationIds() {
    return this.locationsData?.map((m) => m.id) || [];
  }

  get emailCampaignSendDate() {
    return this.selectedEmailCampaign?.sendDate &&
      this.selectedEmailCampaign?.sendDate !== "ASAP"
      ? dayjs
          .utc(this.selectedEmailCampaign.sendDate)
          .tz(this.selectedLocationIanaTimeZone)
      : null;
  }

  emailTemplateEditorText = null;

  emailTemplateEditorImage = null;

  selectedTemplate = null;

  campaigns = [];

  selectedSpecial = null;

  specials = [];

  selectedStockContent = null;

  textReplaced = false;

  recentlySelectedColors = [];

  templateKeywordData = null;

  templateKeywordDataIsValid = true;

  campaignMetrics = null;

  selectedDashboardLocation = "placeholder";

  textMarketingOptInTemplateId = "b5e3a0fd-859e-42a3-bc86-a2cf8e94746d";

  businessAnnouncementsEventTitle = "Business Announcements";

  textMarketingOptInStockContentTitle = "Text Marketing Opt-In";

  generalShopCategoryTitle = "General Shop";

  inEditMode = false;

  get hasSelectedDashboardLocation() {
    return this.selectedDashboardLocation !== "placeholder";
  }

  get selectedThemeColor() {
    return this.selectedEmailCampaign?.settings?.themeColor;
  }

  get selectedFooterIconColor() {
    return this.selectedEmailCampaign?.settings?.footerIconColor;
  }

  get selectedLogoBackgroundColor() {
    return this.selectedEmailCampaign?.settings?.logoBackground;
  }

  get selectedBackgroundColor() {
    return this.selectedEmailCampaign?.settings?.menuBackground;
  }

  get selectedTextColor() {
    return this.selectedEmailCampaign?.settings?.menuText;
  }

  get allEvents() {
    return this.emailBlastCategories?.flatMap(({ events }) => events);
  }

  newSpecial = null;

  emailBlastCategories = null;

  getEmptyEmailCampaign = () => ({
    campaignName:
      this.rootStore?.uiStateStore?.selectedEvent?.name &&
      this.selectedTemplate?.id
        ? `${this.rootStore.uiStateStore.selectedEvent.name} ${this.selectedTemplate.id}`
        : null,
    clientId: this.cpClientId,
    locationId:
      this.locationsData?.length !== 1
        ? null
        : this.selectedEmailCampaign?.locationId,
    templateId: this.selectedTemplate?.id,
    body: null,
    sendDate: null,
    status: EmailCampaignStatusEnum.Draft,
    emailFrom: null,
    emailSubject: null,
    displayName: null,
    recipients: [],
    settings: {
      lastVisitStart: defaultLastVisitStart,
      lastVisitEnd: 0,
      minVisits: "",
      maxVisits: "",
      minSpent: "",
      maxSpent: "",
      unreadCampaignId: "",
      customerVehiclesMakes: [],
      excludeFleetAccounts: false,
      themeColor: "#86C336",
      logoBackground: null,
      menuBackground: "#444444",
      menuText: "#ffffff",
      footerIconColor: "#86C336",
    },
    draftSendDateReminder: null,
    totalRecipients: 0,
  });

  selectedEmailCampaign = this.getEmptyEmailCampaign();

  initialEmailCampaignSendDate = null;

  formatPhoneForTelLink = (telephone) => {
    if (!telephone || telephone.trim().length === 0) {
      return "";
    }

    const re = /[^\d]/g;
    const rawNumber = telephone.replace(re, "");
    if (rawNumber.length === 10) {
      return `+1${rawNumber}`;
    }
    if (rawNumber.length === 11 && rawNumber.startsWith("1")) {
      return `+${rawNumber}`;
    }
    return telephone;
  };

  generateCompanyPhoneHtml = (telephone) => {
    const formattedPhone = this.formatPhoneForTelLink(telephone);

    if (!formattedPhone || formattedPhone.trim().length === 0) {
      return "";
    }

    return `<a href="tel:${formattedPhone}">${telephone}</a>`;
  };

  getReplacedKeywords = (
    templateKeywordDataIn,
    locationObjectIn,
    templateImages
  ) => {
    let tokenKeywordsOut = {
      "[FIRST_NAME]": "John",
      "[LAST_NAME]": "Doe",
      "[PHOTOCREDITS]": null,
      "[VEHICLE_YEAR_MAKE_MODEL]": "2020 Toyota Prius",
    };

    if (locationObjectIn) {
      const { tokens } = templateKeywordDataIn;

      tokenKeywordsOut = { ...tokenKeywordsOut, ...tokens };

      tokenKeywordsOut["[SHOP_LOCATION_NAME]"] = locationObjectIn.name;
      tokenKeywordsOut["[PHOTOCREDITS]"] =
        templateImages?.map((i) =>
          i.credits.map(
            (c) =>
              `<a style="color: #B8B8B8" target="_blank" href="${c.photoUrl}">${c.photoName}</a> by  
             <a style="color: #B8B8B8" target="_blank" href="${c.ownerUrl}">${c.ownerName}</a> / 
             <a style="color: #B8B8B8" target="_blank" href="${c.licenseUrl}">${c.licenseName}</a> website - 
             <a style="color: #B8B8B8" target="_blank" href="${c.websiteUrl}">${c.websiteName}</a>
            <br/>`
          )
        ) || "";

      tokenKeywordsOut["[COMPANY_LOGO]"] = tokens?.["[COMPANY_LOGO]"]
        ? `<img src="${tokens?.["[COMPANY_LOGO]"]}" alt="${tokens?.["[COMPANY_NAME]"]} Logo" id="companyLogo" style="margin: 0; border:0; padding:0;" />`
        : `<h3 style="margin: 0; border:0; padding:0;font:18px Verdana,Sans-serif;color:#333333;">${tokens?.["[COMPANY_NAME]"]}</h3>`;

      tokenKeywordsOut["[COMPANY_URL]"] = tokens?.["[COMPANY_ORIGINAL_URL]"]
        ? tokens?.["[COMPANY_ORIGINAL_URL]"]
        : tokens?.["[COMPANY_URL]"];

      tokenKeywordsOut["[COMPANY_PHONE]"] = this.generateCompanyPhoneHtml(
        tokens?.["[COMPANY_PHONE]"]
      );

      tokenKeywordsOut["[COMPANY_YELP]"] = locationObjectIn?.yelpURL;
      tokenKeywordsOut["[COMPANY_FACEBOOK]"] = locationObjectIn?.facebookURL;
      tokenKeywordsOut["[COMPANY_GOOGLE]"] = locationObjectIn?.googleURL;

      urlKeywords.forEach((key) => {
        const currentUrl = tokenKeywordsOut[key];
        if (currentUrl) {
          tokenKeywordsOut[key] = addClientDomainIfRelative(
            tokenKeywordsOut["[COMPANY_URL]"],
            tokenKeywordsOut[key]
          );
        }
      });
    }

    return tokenKeywordsOut;
  };

  constructor(rootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  get sortedLocationsData() {
    return this.locationsData?.slice().sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }

  get recipientsCount() {
    return (
      this.recipients?.filter((f) => !f.ignore).length ||
      this.selectedEmailCampaign?.totalRecipients
    );
  }

  get selectedLocationObject() {
    return this.locationsData?.find(
      (location) => location.id === this.selectedLocationId
    );
  }

  get selectedLocationIanaTimeZone() {
    return this.selectedLocationObject?.timeZone?.name
      ? findIana(this.selectedLocationObject.timeZone.name)[0]
      : dayjs.tz.guess();
  }

  get sentCampaigns() {
    return this.campaigns.filter(
      (campaign) => campaign.status === EmailCampaignStatusEnum.Sent
    );
  }

  get sentMappedCampaigns() {
    let campaigns = this.sentCampaigns;

    if (this.hasSelectedDashboardLocation) {
      campaigns = this.sentCampaigns.filter(
        (campaign) => campaign.locationId === this.selectedDashboardLocation
      );
    }

    return campaigns.map((campaign) => {
      const metrics = this.campaignMetrics?.find(
        (m) => m.campaignId === campaign.id
      );

      return {
        id: campaign.id,
        campaignName: campaign.campaignName,
        locationName: this.locationsData.find(
          (x) => x.id === campaign.locationId
        )?.name,
        sendDate: campaign.sendDate,
        sent: metrics?.sent || 0,
        read: metrics?.read || 0,
        converted: metrics?.converted || 0,
        unsubscribed: metrics?.unsubscribed || 0,
        status: campaign.status,
      };
    });
  }

  get previousCampaignFilterCampaigns() {
    const threeMonthsAgo = dayjs()
      .tz(this.selectedLocationIanaTimeZone)
      .subtract(3, "month");

    return this.sentCampaigns?.filter(
      (c) =>
        c.id === this.rootStore.filtersStore.unreadCampaignId ||
        (c.locationId === this.selectedLocationId &&
          c.sendDate > threeMonthsAgo)
    );
  }

  get inProgressCampaigns() {
    return this.campaigns.filter(
      (campaign) => campaign.status !== EmailCampaignStatusEnum.Sent
    );
  }

  get inProgressMappedCampaigns() {
    let campaigns = this.inProgressCampaigns;

    if (this.hasSelectedDashboardLocation) {
      campaigns = this.inProgressCampaigns.filter(
        (campaign) => campaign.locationId === this.selectedDashboardLocation
      );
    }

    return campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.campaignName,
      location: this.locationsData.find((x) => x.id === campaign.locationId)
        ?.name,
      sendDate: campaign.sendDate,
      status: campaign.status,
      previewImage: campaign.previewImage,
    }));
  }

  get hasMultipleLocations() {
    return this.locationsData?.length > 1;
  }

  get getDefaultTemplate() {
    if (this.selectedEmailCampaign?.body) {
      const div = convertStringToHtml(this.selectedEmailCampaign.body);
      const element = div.querySelector('[data-emailbody=""]');

      return element?.innerHTML;
    }

    let defaultTemplate = this.defaultTemplate.replace(
      "[HEADER]",
      this.selectedTemplate?.images[0].location
    );

    defaultTemplate = this.setApplyAllReplacements(defaultTemplate);

    return defaultTemplate;
  }

  get getDefaultButtonTemplate() {
    return this.defaultButtonTemplate;
  }

  get unreadCampaignName() {
    return this.rootStore.filtersStore?.unreadCampaignId
      ? this.sentCampaigns.find(
          (f) => f.id === this.rootStore.filtersStore.unreadCampaignId
        )?.campaignName
      : null;
  }

  get getEmailBodyAndPreheader() {
    const preHeader = this.subjectSectionPreviewText
      ? "<span data-preheader='' style='display:none !important; visibility:hidden; " +
        "mso-hide:all; font-size:1px; color:#ffffff; line-height:1px; " +
        "max-height:0px; max-width:0px; opacity:0; overflow:hidden;'>" +
        `${this.subjectSectionPreviewText}` +
        "</span>"
      : "";

    const replacedEditorText = this.emailTemplateEditorText
      ? this.emailTemplateEditorText
          ?.replace(
            /href="([\w://.-])+\[COMPANY_YELP\]"/gi,
            'href="[COMPANY_YELP]"'
          )
          ?.replace(
            /href="([\w://.-])+\[COMPANY_FACEBOOK\]"/gi,
            'href="[COMPANY_FACEBOOK]"'
          )
          ?.replace(
            /href="([\w://.-])+\[COMPANY_GOOGLE\]"/gi,
            'href="[COMPANY_GOOGLE]"'
          )
          ?.replace(
            /href="([\w://.-])+\[COMPANY_APPOINTMENT_URL_ZO\]"/gi,
            'href="[COMPANY_APPOINTMENT_URL_ZO]"'
          )
          ?.replace(
            /href="([\w://.-])+\[COMPANY_URL\]"/gi,
            'href="[COMPANY_URL]"'
          )
      : "";

    return `<html lang="en"><body>${preHeader}<div data-emailbody="">${replacedEditorText}</div></body></html>`;
  }

  get getIsTextConnectEnabled() {
    return this?.locationsData?.some((l) => l.isTextConnectEnabled);
  }

  setCPDataFromCookies = () => {
    if (process.env.NODE_ENV === "development") {
      if (process.env.REACT_APP_DEV_CP_AUTH_KEY) {
        Cookies.set(
          "kukuiconnecttokendev",
          process.env.REACT_APP_DEV_CP_AUTH_KEY,
          {
            sameSite: "strict",
          }
        );
      }

      if (process.env.REACT_APP_DEV_CLIENT_ID && !Cookies.get("e2eTest")) {
        Cookies.set("CpClientId", process.env.REACT_APP_DEV_CLIENT_ID, {
          sameSite: "strict",
        });
      }

      this.cpClientId = Cookies.get("CpClientId");
    } else {
      this.cpClientId = Cookies.get("CpClientId");
    }
  };

  setLocationsData = (value) => {
    this.locationsData = value;

    if (this.locationsData?.length === 1) {
      this.setSelectedLocationId(this.locationsData[0].id);
    }
  };

  setFromSectionName = (value, dontSkipValidation = true) => {
    this.selectedEmailCampaign.displayName = value;

    if (dontSkipValidation) {
      this.rootStore.uiStateStore.setDesignEditValidationErrors({
        ...this.rootStore.uiStateStore.designEditValidationErrors,
        fromName: !this.fromSectionName?.trim(),
      });
    }
  };

  setFromSectionEmail = (value, dontSkipValidation = true) => {
    this.selectedEmailCampaign.emailFrom = value;

    if (dontSkipValidation) {
      this.rootStore.uiStateStore.setDesignEditValidationErrors({
        ...this.rootStore.uiStateStore.designEditValidationErrors,
        fromEmail: !this.fromSectionEmail?.trim(),
        fromEmailInvalid: !emailRegex.test(this.fromSectionEmail),
      });
    }
  };

  setSubjectSectionSubject = (value) => {
    this.selectedEmailCampaign.emailSubject = value;

    this.rootStore.uiStateStore.setDesignEditValidationErrors({
      ...this.rootStore.uiStateStore.designEditValidationErrors,
      subject: !this.subjectSectionSubject?.trim(),
    });
  };

  setSubjectSectionPreviewText = (value) => {
    this.subjectSectionPreviewText = value;
  };

  setRecipients = (value) => {
    if (value?.length > 30000) {
      this.rootStore.uiStateStore.setPreventCampaignSave(true);
      this.rootStore.uiStateStore.openErrorDialog(
        i18n.t("General.RecipientCountError")
      );
    } else {
      this.rootStore.uiStateStore.setPreventCampaignSave(false);
    }

    this.selectedEmailCampaign.recipients = applyPreviousRecipientsIgnore(
      this.selectedEmailCampaign.recipients,
      value
    );
  };

  setSelectedEmailCampaignBody = (value) => {
    this.selectedEmailCampaign.body = value;
  };

  setRecipientsSelection = (newRecipientsSelection, incRecipients) => {
    // remove all recipients
    if (newRecipientsSelection.length === 0) {
      incRecipients.forEach((f) => {
        // eslint-disable-next-line no-param-reassign
        f.ignore = true;
      });

      this.checkMaxRecipientsLimit();
      return;
    }

    // add all recipients
    if (newRecipientsSelection.length === this.recipients?.length) {
      incRecipients.forEach((f) => {
        // eslint-disable-next-line no-param-reassign
        f.ignore = false;
      });

      this.checkMaxRecipientsLimit();
      return;
    }

    const newRecipientsSelectionSet = new Set(newRecipientsSelection);
    // remove recipient
    const recipientsToIgnore = incRecipients.filter(
      (f) => !newRecipientsSelectionSet.has(f.id) && !f.ignore
    );
    recipientsToIgnore.forEach((f) => {
      this.recipients[
        this.recipients?.findIndex((el) => el.id === f.id)
      ].ignore = true;
    });

    // add recipient
    const recipientsToAdd = incRecipients.filter(
      (f) => newRecipientsSelectionSet.has(f.id) && f.ignore
    );
    recipientsToAdd.forEach((f) => {
      this.recipients[
        this.recipients?.findIndex((el) => el.id === f.id)
      ].ignore = false;
    });

    this.checkMaxRecipientsLimit();
  };

  setSelectedLocationId = (value) => {
    this.selectedEmailCampaign.locationId = value;
    this.rootStore.uiStateStore.setDesignEditValidationErrors({
      ...this.rootStore.uiStateStore.designEditValidationErrors,
      selectLocation: !this.selectedLocationId,
    });
  };

  setEmailTemplateEditorText = (value) => {
    this.emailTemplateEditorText = value;
  };

  setAddClientLogoInEditor = (value) => {
    let content = value || this.emailTemplateEditorText;

    if (!content?.includes("[COMPANY_LOGO]")) {
      content = this.setRemoveClientLogoInEditor(content);
    }

    content = content.replace(
      "[COMPANY_LOGO]",
      `<img src="${this.templateKeywordData?.tokens?.["[COMPANY_LOGO]"]}" alt="PREVIEW IMAGE"\
        style="width: auto; margin: 0 auto; border:0; padding:0;" data-preview-image="logo" />`
    );

    return content;
  };

  setRemoveClientLogoInEditor = (value) => {
    const content = value || this.emailTemplateEditorText;

    const div = convertStringToHtml(content);
    const elements = div.querySelectorAll('[data-preview-image="logo"]');

    if (elements?.length) {
      elements.forEach((el) => {
        // eslint-disable-next-line no-param-reassign
        el.parentElement.innerHTML = "[COMPANY_LOGO]";
      });
    }

    return div.innerHTML;
  };

  setUpdateLogoForEditor = (value) => {
    const content = value || this.emailTemplateEditorText;

    const div = convertStringToHtml(content);
    const elements = div.querySelectorAll("[data-preview-image]");

    if (elements?.length) {
      elements.forEach((el) => {
        /* eslint-disable */
        el.parentElement.style.marginLeft = "auto";
        el.parentElement.style.marginRight = "auto";
        /* eslint-enable */
      });
    }

    return div.innerHTML;
  };

  setRemoveBrTagFromLogoForEditor = (value) => {
    const content = value || this.emailTemplateEditorText;

    const div = convertStringToHtml(content);
    const elements = div.querySelectorAll("[data-logo-background-color]");

    if (elements?.length) {
      elements.forEach((el) => {
        el.childNodes?.forEach((child) => {
          if (!child.classList?.contains("se-image-container")) {
            el.removeChild(child);
          }
        });
      });
    }

    return div.innerHTML;
  };

  setEmailTemplateEditorImage = (value) => {
    this.emailTemplateEditorImage = value;
  };

  setSelectedTemplate = (template) => {
    this.selectedTemplate = template;
  };

  setLocationTimeZoneDate = (campaignObj) => {
    const locationTimeZoneName = this.locationsData?.find(
      (location) => location.id === campaignObj.locationId
    )?.timeZone?.name;

    if (locationTimeZoneName && campaignObj.sendDate) {
      const locationIanaTimeZone = findIana(locationTimeZoneName)[0];

      // eslint-disable-next-line no-param-reassign
      campaignObj.sendDate = dayjs
        .utc(campaignObj.sendDate)
        .tz(locationIanaTimeZone);
    }

    return campaignObj;
  };

  convertFromCPTimezoneToLocationTimezone = (locationName, date) => {
    const locationTimeZoneName = this.locationsData?.find(
      (location) => location.name === locationName
    )?.timeZone?.name;

    if (locationTimeZoneName) {
      const locationIanaTimeZone = findIana(locationTimeZoneName)[0];
      const cpIanaTimezone = findIana("Pacific Standard Time")[0];
      // eslint-disable-next-line no-param-reassign
      date = dayjs.tz(date, cpIanaTimezone).tz(locationIanaTimeZone);
    }

    return dayjs(date).format("MM/DD/YYYY - hh:mm A");
  };

  setCampaigns = (campaigns) => {
    this.campaigns = campaigns.map((m) => this.setLocationTimeZoneDate(m));
  };

  setCampaignMetrics = (metrics) => {
    const filteredMetrics = metrics?.filter(
      (f) =>
        f.sent !== 0 ||
        f.read !== 0 ||
        f.converted !== 0 ||
        f.unsubscribed !== 0
    );

    if (!this.campaignMetrics) {
      this.campaignMetrics = [];
    }

    filteredMetrics?.forEach((f) => {
      const existingCampaign = this.campaignMetrics?.find(
        (s) => s.campaignId === f.campaignId
      );

      if (existingCampaign) {
        existingCampaign.sent += f.sent;
        existingCampaign.read += f.read;
        existingCampaign.converted += f.converted;
        existingCampaign.unsubscribed += f.unsubscribed;
      } else {
        this.campaignMetrics.push(f);
      }
    });
  };

  setClearCampaignMetrics = () => {
    this.campaignMetrics = [];
  };

  setTextReplaced = (value) => {
    this.textReplaced = value;
  };

  setEmailBlastCategories = (incomingCategories) => {
    const eventsCategoryId = "67f805ac-5f61-42db-acec-2bd9755520c4";

    try {
      const sortedCategories = sortCategories(incomingCategories);

      const marketingHolidays = sortedCategories.find(
        (x) => x.name === "Marketing Holidays"
      );

      const generalShop = sortedCategories.find(
        (x) => x.name === this.generalShopCategoryTitle
      );

      sortMarketingHolidays(marketingHolidays?.events);
      sortGeneralShop(generalShop?.events);

      this.emailBlastCategories = sortedCategories?.filter(
        (c) => c.id !== eventsCategoryId
      );
    } catch {
      this.emailBlastCategories = incomingCategories?.filter(
        (c) => c.id !== eventsCategoryId
      );
    }
  };

  replaceFooterItems = (htmlString, value) => {
    let processedHtml = htmlString;
    const iconFolderName = presetColors.find(
      (f) => f.value === value
    )?.iconFolderName;

    // replace footer phone icon
    processedHtml = replaceAttributeValue(
      `https://cp01.kukui.com/Files/images/campaigns/CampaignDesigner/Icons/${iconFolderName}/phone-icon.png`,
      processedHtml,
      "[data-image-phone-icon]",
      "src"
    );

    // replace footer address icon
    processedHtml = replaceAttributeValue(
      `https://cp01.kukui.com/Files/images/campaigns/CampaignDesigner/Icons/${iconFolderName}/address-icon.png`,
      processedHtml,
      "[data-image-address-icon]",
      "src"
    );

    // replace footer link icon
    processedHtml = replaceAttributeValue(
      `https://cp01.kukui.com/Files/images/campaigns/CampaignDesigner/Icons/${iconFolderName}/link-icon.png`,
      processedHtml,
      "[data-image-link-icon]",
      "src"
    );

    return processedHtml;
  };

  replaceThemeColor = (value, defaultTemplate = null) => {
    let htmlString = replaceAttributeValue(
      value,
      defaultTemplate || this.emailTemplateEditorText,
      "[data-appointment]",
      "backgroundColor",
      true
    );

    htmlString = replaceAttributeValue(
      value,
      htmlString,
      "[data-default-btn]",
      "backgroundColor",
      true
    );

    if (!defaultTemplate && htmlString) {
      this.emailTemplateEditorText = htmlString;
    }

    runInAction(() => {
      this.setSelectedThemeColor(value);
    });

    return htmlString;
  };

  replaceFooterIconColor = (value, defaultTemplate = null) => {
    const htmlString = this.replaceFooterItems(
      defaultTemplate || this.emailTemplateEditorText,
      value
    );

    if (!defaultTemplate && htmlString) {
      this.emailTemplateEditorText = htmlString;
    }

    runInAction(() => {
      this.setSelectedFooterIconColor(value);
    });

    return htmlString;
  };

  replaceLogoBackgroundColor = (value, defaultTemplate = null) => {
    const htmlString = replaceAttributeValue(
      value,
      defaultTemplate || this.emailTemplateEditorText,
      "[data-logo-background-color]",
      "backgroundColor",
      true
    );

    if (!defaultTemplate && htmlString) {
      this.emailTemplateEditorText = htmlString;
    }

    this.setSelectedLogoBackgroundColor(value);

    return htmlString;
  };

  replaceBackgroundColor = (value, defaultTemplate = null) => {
    const htmlString = replaceAttributeValue(
      value,
      defaultTemplate || this.emailTemplateEditorText,
      "[data-background-color]",
      "backgroundColor",
      true
    );

    if (!defaultTemplate && htmlString) {
      this.emailTemplateEditorText = htmlString;
    }

    runInAction(() => {
      this.setSelectedBackgroundColor(value);
    });

    return htmlString;
  };

  replaceTextColor = (value, defaultTemplate = null) => {
    const htmlString = replaceAttributeValue(
      value,
      defaultTemplate || this.emailTemplateEditorText,
      "[data-color]",
      "color",
      true
    );

    if (!defaultTemplate && htmlString) {
      this.emailTemplateEditorText = htmlString;
    }

    runInAction(() => {
      this.setSelectedTextColor(value);
    });

    return htmlString;
  };

  replaceKeywords = (
    emailBody,
    tempatesKeywordDataIn,
    selectedLocationObjectIn,
    templateImages
  ) => {
    let replacedBody = emailBody;

    const replacedKeywords = this.getReplacedKeywords(
      tempatesKeywordDataIn,
      selectedLocationObjectIn,
      templateImages
    );

    Object.keys(replacedKeywords).forEach((key) => {
      if (replacedKeywords[key] || replacedKeywords[key] === "") {
        let searchKey;
        if (key.startsWith("//[")) {
          searchKey = new RegExp(`\\/\\/\\${key.substr(2)}`, "g");
        } else {
          searchKey = new RegExp(`\\${key}`, "g");
        }
        replacedBody = replacedBody?.replace(searchKey, replacedKeywords[key]);
      }
    });

    return replacedBody;
  };

  setRecentlySelectedColors = (value) => {
    if (
      value?.hex &&
      !this.recentlySelectedColors.some((s) => s.hex === value.hex)
    ) {
      this.recentlySelectedColors.push(value);
      this.recentlySelectedColors = this.recentlySelectedColors.slice(-7);
    }
  };

  defaultTemplate =
    '<div style="margin:20px auto 0; border: 0; padding:0; width:600px;">\n' +
    '    <table border="0" cellspacing="0" style="margin:0; border:0; padding:0; width: 600px; background: #ffffff; font-family: Verdana;">\n' +
    '        <tr style="margin:0; border:0; padding:0; width: 100%;">\n' +
    '            <td style="margin:0; border:0; padding:20px 0; width: 100%; text-align: center;" data-logo-background-color>\n' +
    "                [COMPANY_LOGO]\n" +
    "            </td>\n" +
    "        </tr>\n" +
    '        <tr style="margin:0; border:0; padding:0; width: 100%;">\n' +
    '            <td align="center" style="margin:0; border:0; padding:0; width: 100%;">\n' +
    '                <img style="vertical-align: middle;" src="[HEADER]" alt="Header" id="headerImage" />\n' +
    "            </td>\n" +
    "        </tr>\n" +
    '        <tr style="margin:0; border:0; padding:0; width: 100%;">\n' +
    '            <td style="margin:0; border:0; padding:0; width: 100%;">\n' +
    '                <table border="0" cellspacing="0" style="margin:0; border:0; padding:0; width: 100%;">\n' +
    '                    <tr style="margin:0; border:0; padding:0; width: 100%;">\n' +
    '                        <td style="margin:0; padding:0; width: 150px; height: 60px; text-align: center; border-right: 1px solid #303745" data-background-color>\n' +
    '                            <a href="[COMPANY_URL]/" target="_blank" style="padding: 20px 15px; display: block; font-family: Arial; font-size: 14px; line-height: 20px; font-weight: 700; text-decoration: none;" data-color>WEBSITE</a>\n' +
    "                        </td>\n" +
    '                        <td style="margin:0; padding:0; width: 150px; height: 60px; text-align: center; border-right: 1px solid #303745; text-decoration: none" data-background-color>\n' +
    '                            <a href="[COMPANY_SERVICES_URL_ZO]" target="_blank" style="padding: 20px 15px; display: block; font-family: Arial; font-size: 14px; font-weight: 700; line-height: 20px; text-decoration: none" data-color>SERVICES</a>\n' +
    "                        </td>\n" +
    '                        <td style="margin:0; padding:0; width: 150px; height: 60px; text-align: center;" data-background-color>\n' +
    '                            <a href="[COMPANY_DIRECTIONS_URL_ZO]" target="_blank" style="padding: 20px 15px; display: block; font-family: Arial; font-weight: 700; font-size: 14px; line-height: 20px; text-decoration: none" data-color>DIRECTIONS</a>\n' +
    "                        </td>\n" +
    '                        <td style="margin:0; padding:0; width: 150px; height: 60px; text-align: center;" data-appointment>\n' +
    '                            <a href="[COMPANY_APPOINTMENT_URL_ZO]" target="_blank" style="padding: 20px 15px; display: block; color: #fff; font-family: Arial; font-size: 14px; font-weight: 700;  line-height: 20px; text-decoration: none">APPOINTMENTS</a>\n' +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                </table>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    '        <tr style="margin:0; border:0; padding:0; width: 100%;">\n' +
    '            <td style="margin:0; border:0; padding: 35px 20px 0; width: 100%; color: #575757; font-family: Arial; font-size: 14px; line-height: 1.4;">\n' +
    '                <div id="mainContent">' +
    "                Hi [FIRST_NAME],\n" +
    "                <br /><br />\n" +
    "                INSERT YOUR CUSTOM TEXT HERE.\n" +
    "                <br /><br />\n" +
    "                Sincerely,\n" +
    "                </div>" +
    "            </td>\n" +
    "        </tr>\n" +
    '        <tr style="margin:0; border:0; padding:0; width: 100%; [SPECIALS_EXIST]">\n' +
    '            <td style="margin:0; border:0; padding: 0; width: 100%;">\n' +
    "            </td>\n" +
    "        </tr>\n" +
    '        <tr style="margin:0; border:0; width: 100%;">\n' +
    '            <td style="margin:0; border:0; padding:25px; width: 100%; font-family: Arial, Sans-Serif; font-size: 14px;" data-background-color data-color>\n' +
    "                <b>[COMPANY_NAME]</b>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    '        <tr style="margin:0; border:0; padding:0; width: 100%;">\n' +
    '            <td style="margin:0; border:0; padding: 20px; width: 100%;">\n' +
    '                <table border="0" cellspacing="0" style="margin:0; border:0; padding:0; width:100%;">\n' +
    '                    <tr style="margin:0; border:0; padding:0; width: 100%;">\n' +
    '                        <td style="margin:0; border:0; padding: 0; width: 24px; display: block;">\n' +
    '                          <img align="left" src="https://cp01.kukui.com/Files/images/campaigns/CampaignDesigner/Icons/94c83d-green/phone-icon.png" data-image-phone-icon />\n' +
    "                        </td>\n" +
    '                        <td style="margin:0; border:0; padding: 0 0 0 10px; width: 100%; font-family: Arial; font-size: 14px; color: #767676;" data-company-phone>\n' +
    "                            [COMPANY_PHONE]\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    '                    <tr style="margin:0; border:0; padding:0; width: 100%;">\n' +
    '                        <td style="margin:0; border:0; padding: 10px 0 0; width: 24px; display: block;">\n' +
    '                          <img align="left" src="https://cp01.kukui.com/Files/images/campaigns/CampaignDesigner/Icons/94c83d-green/address-icon.png" data-image-address-icon />\n' +
    "                        </td>\n" +
    '                        <td style="margin:0; border:0; padding: 10px 0 0 10px; width: 100%; font-family: Arial; font-size: 14px; color: #767676;" data-company-address>\n' +
    "                            [COMPANY_STREET], [COMPANY_ADDRESS]\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    '                    <tr style="margin:0; border:0; padding:0; width: 100%;">\n' +
    '                        <td style="margin:0; border:0; padding: 10px 0 0; width: 24px; display: block;">\n' +
    '                          <img align="left" src="https://cp01.kukui.com/Files/images/campaigns/CampaignDesigner/Icons/94c83d-green/link-icon.png" data-image-link-icon />\n' +
    "                        </td>\n" +
    '                        <td style="margin:0; border:0; padding: 10px 0 0 10px; width: 100%; font-family: Arial; font-size: 14px; color: #00a0c9;" data-company-url>\n' +
    '                           <a href="[COMPANY_URL]">[COMPANY_URL]</a>\n' +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                </table>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    '        <tr style="margin:0; border:0; padding:0; width: 100%;">\n' +
    '            <td style="margin:0; border:0; padding: 10px 20px; width: 100%; background-color: #f0f0f0;">\n' +
    '                <table border="0" cellspacing="0" style="margin:0; border:0; padding:0; width:100%; background-color: #f0f0f0;">\n' +
    '                    <tr style="margin:0; border:0; padding:0; width: 100%;">\n' +
    '                        <td style="margin:0; border:0; padding:0; width: 100%; font-size: 10px; font-family: Arial; color: #b8b8b8;">\n' +
    '                            Not interested in getting these emails? <a style="color: #b8b8b8;" href="[COMPANY_UNSUBSCRIBE_URL_ZO]" target="_blank">Click Here</a> to unsubscribe.\n' +
    "                        </td>\n" +
    "                    </tr>\n" +
    '                    <tr style="margin:0; border:0; padding:0; width: 100%;">\n' +
    '                        <td style="margin:0; border:0; padding:0; width: 100%; font-size: 10px; font-family: Arial; color: #b8b8b8;">\n' +
    "                            [PHOTOCREDITS]\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                </table>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "</div>";

  // noinspection CssInvalidPropertyValue
  defaultButtonTemplate =
    '<div data-default-btn-template="" style="margin: 0px; border: 0px; padding: 30px 15px; width: 100%; text-align: center;"><a href="[DEFAULT_BTN_URL]" data-default-btn="" rel="noreferrer" target="_blank" style="padding: 10px 25px; margin: 5px; background-color:[DEFAULT_BTN_BACKGROUND_COLOR]; color: white; text-decoration: none; font-family: Arial; font-size: [DEFAULT_BTN_FONT_SIZE]; font-weight: 700; line-height: 20px; white-space: nowrap;">[DEFAULT_BTN_TEXT]</a></div>';

  setSpecials = (specials) => {
    this.specials = specials;
  };

  setSelectedSpecial = (selectedSpecial) => {
    this.selectedSpecial = selectedSpecial;
  };

  setTemplateKeywordData = (templateKeywordData) => {
    this.templateKeywordData = templateKeywordData;
    this.templateKeywordDataIsValid = true;
    this.checkTokenDictForValueForKey(
      "[COMPANY_APPOINTMENT_URL_ZO]",
      templateKeywordData
    ); // [APPOINTMENT_URL]
    this.checkTokenDictForValueForKey(
      "[COMPANY_DIRECTIONS_URL_ZO]",
      templateKeywordData
    ); // [DIRECTIONS_URL]
    this.checkTokenDictForValueForKey(
      "[COMPANY_SERVICES_URL_ZO]",
      templateKeywordData
    ); // [SERVICES_URL]
    this.checkTokenDictForValueForKey("[COMPANY_LOGO]", templateKeywordData); // [COMPANY_LOGO]
  };

  checkTokenDictForValueForKey = (key, templateKeywordData) => {
    const value = templateKeywordData?.tokens?.[key];
    if (!value || value.length === 0) {
      this.templateKeywordDataIsValid = false;
    }
  };

  setSelectedStockContent = (selectedStockContent) => {
    this.selectedStockContent = selectedStockContent;
  };

  setApplyAllReplacements = (templateString) => {
    let processedTemplate = templateString;
    processedTemplate = this.replaceThemeColor(
      this.selectedThemeColor || "#86C336",
      processedTemplate
    );

    processedTemplate = this.replaceBackgroundColor(
      this.selectedBackgroundColor || "#444444",
      processedTemplate
    );

    processedTemplate = this.replaceTextColor(
      this.selectedTextColor || "#ffffff",
      processedTemplate
    );

    return processedTemplate;
  };

  setDesignEditBackResetStore = () => {
    this.initializeSelectedCampaign();

    this.setEmailTemplateEditorImage(null);
    this.setSelectedSpecial(null);
    this.setSelectedStockContent(null);
    this.setTemplateKeywordData(null);
    this.newSpecial = null;

    this.subjectSectionPreviewText = null;

    this.rootStore.uiStateStore.setForceBackBtnToDashboard(false);
    this.rootStore.uiStateStore.setIsExpirationDateCheckboxTicked(false);
    this.rootStore.uiStateStore.setAddSpecialOpen(false);

    this.rootStore.uiStateStore.setDesignEditValidationErrors(null);
    this.rootStore.uiStateStore.setPreventCampaignSave(false);
  };

  setUpdateNewSpecial = (value) => {
    this.newSpecial = value;
  };

  initializeSelectedCampaign = () => {
    this.selectedEmailCampaign = this.getEmptyEmailCampaign();
  };

  setSelectedThemeColor = (value) => {
    if (this.selectedEmailCampaign?.settings) {
      this.selectedEmailCampaign.settings.themeColor = value;
    }
  };

  setSelectedFooterIconColor = (value) => {
    if (this.selectedEmailCampaign?.settings) {
      this.selectedEmailCampaign.settings.footerIconColor = value;
    }
  };

  setSelectedLogoBackgroundColor = (value) => {
    if (this.selectedEmailCampaign?.settings) {
      this.selectedEmailCampaign.settings.logoBackground = value;
    }
  };

  setSelectedBackgroundColor = (value) => {
    if (this.selectedEmailCampaign?.settings) {
      this.selectedEmailCampaign.settings.menuBackground = value;
    }
  };

  setSelectedTextColor = (value) => {
    if (this.selectedEmailCampaign?.settings) {
      this.selectedEmailCampaign.settings.menuText = value;
    }
  };

  setSelectedEmailCampaign = (value) => {
    // eslint-disable-next-line no-param-reassign
    value = this.setLocationTimeZoneDate(value);

    this.initialEmailCampaignSendDate = value.sendDate;

    if (value?.recipients?.some((s) => !s.id)) {
      // eslint-disable-next-line no-param-reassign
      value.recipients = value.recipients.map((m) => ({
        id: generateGuid(),
        firstName: m.firstName,
        lastName: m.lastName,
        email: m.email,
        vehicle: m.vehicle,
        ignore: !!m.ignore,
      }));
    }

    this.selectedEmailCampaign = value;
  };

  setAddEmailCampaign = (value) => {
    this.campaigns.push(value);
  };

  setRemoveEmailCampaign = (id) => {
    this.campaigns = this.campaigns.filter((f) => f.id !== id);
  };

  setReplaceCampaign = (value) => {
    this.campaigns.splice(
      this.campaigns.findIndex((c) => c.id === value.id),
      1,
      value
    );
  };

  setSelectedEmailCampaignSendDate = (dateTime) => {
    // eslint-disable-next-line no-param-reassign
    this.selectedEmailCampaign.sendDate?.$d?.setSeconds(0, 0);
    dateTime?.$d?.setSeconds(0, 0);

    if (
      this.selectedEmailCampaign.draftSendDateReminder &&
      this.selectedEmailCampaign.sendDate !== null &&
      dateTime !== null &&
      this.selectedEmailCampaign.sendDate?.$d.getTime() !==
        dateTime?.$d?.getTime()
    ) {
      this.selectedEmailCampaign.draftSendDateReminder = null;
    }

    this.selectedEmailCampaign.sendDate = dateTime;
  };

  setSelectedDashboardLocation = (id) => {
    this.selectedDashboardLocation = id;
  };

  setInEditMode = (value) => {
    this.inEditMode = value;
  };

  clientsWithAllowedCodeView = [
    4432, 5157, 5348, 4251, 4510, 4730, 4503, 5377, 4574, 4234, 4599, 5062,
    4339, 4727, 4350, 4989, 4258, 6385, 4294, 4504, 4267, 3014, 5111, 4302,
    3084, 4249, 4598, 4277, 5382, 4428, 5554, 5569, 4326, 4728, 4271, 5265,
    4272, 4359, 4455, 4252, 5449, 3015, 4714, 4729, 4732, 5400, 4378, 3079,
    4308, 5628, 4370, 6719, 4236, 4235, 4751, 5768, 2124, 4273, 5205, 4401,
    5784, 4960, 4241, 5537, 4726, 5211, 4250, 4731, 4521, 3039, 52, 7446, 8036,
    8420,
  ];

  checkMaxRecipientsLimit = () => {
    if (this.recipientsToInclude?.length > 30000) {
      this.rootStore.uiStateStore.setPreventCampaignSave(true);
      if (!this.rootStore.uiStateStore?.dialogProps) {
        this.rootStore.uiStateStore.openErrorDialog(
          i18n.t("General.RecipientCountError")
        );
      }
    } else {
      this.rootStore.uiStateStore.setPreventCampaignSave(false);
      this.rootStore.uiStateStore.closeDialog();
    }
  };
}

export default CommonStore;
