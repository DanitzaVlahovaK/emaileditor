import { makeAutoObservable } from "mobx";

export default class SettingsStore {
  defaultColorSettings = {
    themeColor: "#86C336",
    logoBackground: null,
    menuBackground: "#444444",
    menuText: "#ffffff",
    footerIconColor: "#86C336",
  };

  defaultColorSettingsByLocation = [];

  defaultThemeColorChecked = false;

  defaultLogoBackgroundColorChecked = false;

  defaultMenuBackgroundColorChecked = false;

  defaultMenuTextColorChecked = false;

  defaultFooterIconsColorChecked = false;

  constructor(rootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  get IsAnyDefaultColorsChecked() {
    return (
      this.defaultThemeColorChecked ||
      this.defaultLogoBackgroundColorChecked ||
      this.defaultMenuBackgroundColorChecked ||
      this.defaultMenuTextColorChecked ||
      this.defaultFooterIconsColorChecked
    );
  }

  setDefaultThemeColor = (locationId, value) => {
    const locationSettings = this.defaultColorSettingsByLocation.find(
      (s) => s.locationId === locationId
    );

    if (locationSettings) {
      locationSettings.defaultThemeColor = value;
    }
  };

  setDefaultLogoBackgroundColor = (locationId, value) => {
    const locationSettings = this.defaultColorSettingsByLocation.find(
      (s) => s.locationId === locationId
    );

    if (locationSettings) {
      locationSettings.defaultLogoBackgroundColor = value;
    }
  };

  setDefaultMenuBackgroundColor = (locationId, value) => {
    const locationSettings = this.defaultColorSettingsByLocation.find(
      (s) => s.locationId === locationId
    );

    if (locationSettings) {
      locationSettings.defaultMenuBackgroundColor = value;
    }
  };

  setDefaultMenuTextColor = (locationId, value) => {
    const locationSettings = this.defaultColorSettingsByLocation.find(
      (s) => s.locationId === locationId
    );

    if (locationSettings) {
      locationSettings.defaultMenuTextColor = value;
    }
  };

  setDefaultFooterIconsColor = (locationId, value) => {
    const locationSettings = this.defaultColorSettingsByLocation.find(
      (s) => s.locationId === locationId
    );

    if (locationSettings) {
      locationSettings.defaultFooterIconsColor = value;
    }
  };

  setUpdatedDefaultColorsObject = (valueObj) => {
    const { locationId } = valueObj;
    const locationSettings = this.defaultColorSettingsByLocation.find(
      (s) => s.locationId === locationId
    );

    if (locationSettings) {
      this.defaultColorSettingsByLocation =
        this.defaultColorSettingsByLocation.map((s) =>
          s.locationId === locationId ? valueObj : s
        );
    } else {
      this.defaultColorSettingsByLocation.push(valueObj);
    }
  };

  toggleDefaultThemeColorChecked = () => {
    this.defaultThemeColorChecked = !this.defaultThemeColorChecked;
  };

  toggleDefaultLogoBackgroundColorChecked = () => {
    this.defaultLogoBackgroundColorChecked =
      !this.defaultLogoBackgroundColorChecked;
  };

  toggleDefaultMenuBackgroundColorChecked = () => {
    this.defaultMenuBackgroundColorChecked =
      !this.defaultMenuBackgroundColorChecked;
  };

  toggleDefaultMenuTextColorChecked = () => {
    this.defaultMenuTextColorChecked = !this.defaultMenuTextColorChecked;
  };

  toggleDefaultFooterIconsColorChecked = () => {
    this.defaultFooterIconsColorChecked = !this.defaultFooterIconsColorChecked;
  };

  resetAllDefaultColorsChecks = () => {
    this.defaultThemeColorChecked = false;
    this.defaultLogoBackgroundColorChecked = false;
    this.defaultMenuBackgroundColorChecked = false;
    this.defaultMenuTextColorChecked = false;
    this.defaultFooterIconsColorChecked = false;
  };
}
