import i18n from "i18next";
import styles from "./Editor.module.css";
import { safeInsertNodeInEditor } from "../../helpers/utils/utils";

const customButton = `
    <span className="txt" data-testid="addVariable">${i18n.t("Editor.AddVariable")}</span>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.73 8.67">
      <g>
        <path
          d="M18.79,7.52a.8.8,0,0,1,.56-.23.82.82,0,0,1,.79.79.8.8,0,0,1-.23.56l-7.07,7.07a.79.79,0,0,1-.57.25.77.77,0,0,1-.57-.25h0L4.64,8.65a.8.8,0,0,1-.23-.57.82.82,0,0,1,.79-.79.8.8,0,0,1,.56.23L12.28,14l3.26-3.26,3.25-3.26Z"
          transform="translate(-4.41 -7.29)"
        />
      </g>
    </svg>`;

const templateWord = {
  name: "template_word",
  display: "submenu",
  title: i18n.t("Editor.AddVariable"),
  innerHTML: customButton,
  buttonClass: ["se-btn-select", styles.customBtn].join(" "),
  add(core, targetElement) {
    const listDiv = this.setSubmenu.call(core);

    const self = this;
    listDiv.querySelectorAll(".se-btn-list").forEach((btn) => {
      btn.addEventListener("click", self.onClick.bind(core));
    });

    core.initMenuTarget(this.name, targetElement, listDiv);
  },

  setSubmenu() {
    const listDiv = this.util.createElement("DIV");
    listDiv.className = "se-submenu se-list-layer";
    listDiv.innerHTML =
      '<div class="se-list-inner se-list-font-size">' +
      '<ul class="se-list-basic">' +
      '<li><button type="button" class="se-btn-list" value="[FIRST_NAME]" data-testid="addVariableFirstName">[FIRST_NAME]</button></li>' +
      '<li><button type="button" class="se-btn-list" value="[LAST_NAME]" data-testid="addVariableLastName">[LAST_NAME]</button></li>' +
      '<li><button type="button" class="se-btn-list" value="[SHOP_LOCATION_NAME]" data-testid="addVariableShopLocationName">[SHOP_LOCATION_NAME]</button></li>' +
      '<li><button type="button" class="se-btn-list" value="[COMPANY_NAME]" data-testid="addVariableCompanyName">[COMPANY_NAME]</button></li>' +
      '<li><button type="button" class="se-btn-list" value="[COMPANY_PHONE]" data-testid="addVariableCompanyPhone">[COMPANY_PHONE]</button></li>' +
      '<li><button type="button" class="se-btn-list" value="[VEHICLE_YEAR_MAKE_MODEL]" data-testid="addVariableVehicleYear">[VEHICLE_YEAR_MAKE_MODEL]</button></li>' +
      "</ul>" +
      "</div>";

    return listDiv;
  },
  onClick(e) {
    const { value } = e.target;
    const node = this.util.createElement("span");
    this.util.addClass(node, "se-custom-tag");
    node.textContent = value;

    safeInsertNodeInEditor(this, node);

    this.submenuOff();
  },
};

export default templateWord;
