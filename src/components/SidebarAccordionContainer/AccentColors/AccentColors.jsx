import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import ColorPickerFixedColors from "./ColorPickerFixedColors/ColorPickerFixedColors";
import ColorPickerWithBox from "./ColorPickerWithBox/ColorPickerWithBox";
import { useRootStore } from "../../../mobx/bridge";

const AccentColors = observer(() => {
  const { commonStore, settingsStore } = useRootStore();
  const { t } = useTranslation();

  const getLabelText = (color, defaultColor) => () => color === defaultColor ? t("AccentColors.SetAsDefaultColor") : t("AccentColors.UpdateDefaultColor");

  const updateThemeColor = (value) => {
    commonStore.replaceThemeColor(value);
    settingsStore.setDefaultThemeColor(commonStore.selectedLocationId, value);
  };

  const updateLogoBackground = (value) => {
    commonStore.replaceLogoBackgroundColor(value);
    settingsStore.setDefaultLogoBackgroundColor(commonStore.selectedLocationId, value);
  };

  const updateMenuBackground = (value) => {
    commonStore.replaceBackgroundColor(value);
    settingsStore.setDefaultMenuBackgroundColor(commonStore.selectedLocationId, value);
  };

  const updateTextColor = (value) => {
    commonStore.replaceTextColor(value);
    settingsStore.setDefaultMenuTextColor(commonStore.selectedLocationId, value);
  };

  const updateFooterIcons = (value) => {
    commonStore.replaceFooterIconColor(value);
    settingsStore.setDefaultFooterIconsColor(commonStore.selectedLocationId, value);
  };

  return (
    <div data-testid="accentColorsContainer">
      <ColorPickerWithBox
        title={t("AccentColors.ThemeColor")}
        updateFunction={updateThemeColor}
        onSetAsDefault={settingsStore.toggleDefaultThemeColorChecked}
        colorValue={commonStore.selectedThemeColor}
        getLabelText={getLabelText(commonStore.selectedThemeColor, settingsStore.defaultColorSettings.themeColor)}
        dataTestId="themeColor"
        setAsDefaultChecked={settingsStore.defaultThemeColorChecked}
      />
      <ColorPickerWithBox
        title={t("AccentColors.LogoBackground")}
        updateFunction={updateLogoBackground}
        onSetAsDefault={settingsStore.toggleDefaultLogoBackgroundColorChecked}
        colorValue={commonStore.selectedLogoBackgroundColor || ""}
        getLabelText={getLabelText(commonStore.selectedLogoBackgroundColor, settingsStore.defaultColorSettings.logoBackground)}
        dataTestId="logoBackground"
        setAsDefaultChecked={settingsStore.defaultLogoBackgroundColorChecked}
      />
      <ColorPickerWithBox
        title={t("AccentColors.MenuBackground")}
        updateFunction={updateMenuBackground}
        onSetAsDefault={settingsStore.toggleDefaultMenuBackgroundColorChecked}
        colorValue={commonStore.selectedBackgroundColor}
        getLabelText={getLabelText(commonStore.selectedBackgroundColor, settingsStore.defaultColorSettings.menuBackground)}
        dataTestId="menuBackground"
        setAsDefaultChecked={settingsStore.defaultMenuBackgroundColorChecked}
      />
      <ColorPickerWithBox
        title={t("AccentColors.MenuText")}
        updateFunction={updateTextColor}
        onSetAsDefault={settingsStore.toggleDefaultMenuTextColorChecked}
        colorValue={commonStore.selectedTextColor}
        getLabelText={getLabelText(commonStore.selectedTextColor, settingsStore.defaultColorSettings.menuText)}
        dataTestId="menuText"
        setAsDefaultChecked={settingsStore.defaultMenuTextColorChecked}
      />
      <ColorPickerFixedColors
        title={t("AccentColors.FooterIcons")}
        updateFunction={updateFooterIcons}
        colorValue={commonStore.selectedFooterIconColor}
        dataTestId="footerIcons"
        onSetAsDefault={settingsStore.toggleDefaultFooterIconsColorChecked}
        getLabelText={getLabelText(commonStore.selectedFooterIconColor, settingsStore.defaultColorSettings.footerIconColor)}
        setAsDefaultChecked={settingsStore.defaultFooterIconsColorChecked}
      />
    </div>
  );
});

export default AccentColors;
