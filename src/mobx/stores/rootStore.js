import { configure } from "mobx";
import UiStateStore from "./uiStateStore";
import CommonStore from "./commonStore";
import FiltersStore from "./filtersStore";
import ErrorCodesStore from "./errorCodesStore";
import SettingsStore from "./settingsStore";
import { BrowserDetect } from "../../helpers/browserDetect";

export class RootStore {
  constructor() {
    // configure mobx
    configure({
      enforceActions: process.env.REACT_APP_IN_MOCK_MODE ? "never" : "always",
      useProxies:
        !BrowserDetect.browser || BrowserDetect.browser === "Explorer"
          ? "never"
          : "always",
      safeDescriptors: false,
    });

    this.uiStateStore = new UiStateStore(this);
    this.commonStore = new CommonStore(this);
    this.filtersStore = new FiltersStore(this);
    this.errorCodesStore = new ErrorCodesStore(this);
    this.settingsStore = new SettingsStore(this);
  }
}

const rootStore = new RootStore();

export default rootStore;
