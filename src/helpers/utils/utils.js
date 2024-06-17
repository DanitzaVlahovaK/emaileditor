import dayjs from "dayjs";
import trim from "lodash/trim";
import config from "../../config/config";

export const currencyInFront = ["en-US", "en-CA", "en-AU", "en-NZ"];
export const currencyAfter = ["fr-CA"];

export const mainComponents = {
  EmailBlastDashboard: "EmailBlastDashboard",
  CreateAnEmailBlast: "CreateAnEmailBlast",
  CreateAnEmailBlastSelectEvent: "CreateAnEmailBlastSelectEvent",
  CreateAnEmailBlastSelectTemplate: "CreateAnEmailBlastSelectTemplate",
  CreateAnEmailBlastDesignEdit: "CreateAnEmailBlastDesignEdit",
  PreviewCampaign: "PreviewCampaign",
};

export const urlKeywords = [
  "[COMPANY_APPOINTMENT_URL_ZO]",
  "[COMPANY_BLOG_URL_ZO]",
  "[COMPANY_UNSUBSCRIBE_URL_ZO]",
  "[COMPANY_WRITE_REVIEW_URL_ZO]",
  "[COMPANY_USED_CARS_URL_ZO]",
  "[COMPANY_REFERRAL_URL_ZO]",
  "[COMPANY_DIRECTIONS_URL_ZO]",
  "[COMPANY_SERVICES_URL_ZO]",
  "[COMPANY_COUPONS_URL_ZO]",
  "[COMPANY_OPT_IN_URL_ZO]",
];

export const generateGuid = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);

  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

export const EmailCampaignStatusEnum = {
  Draft: 0,
  Scheduled: 1,
  Sent: 2,
  InProgress: 3,
};

export const convertStringToHtml = (incHtmlString) => {
  const holder = document.createElement("div");
  holder.innerHTML = incHtmlString;
  return holder;
};

export const replaceAttributeValue = (
  value,
  incHtmlString,
  dataAttribute,
  propName,
  updateStyle = false
) => {
  const div = convertStringToHtml(incHtmlString);
  const elements = div.querySelectorAll(dataAttribute);

  if (elements?.length) {
    elements.forEach((el) => {
      if (updateStyle) {
        // eslint-disable-next-line no-param-reassign
        el.style[propName] = value;
      } else {
        // eslint-disable-next-line no-param-reassign
        el[propName] = value;
      }
    });
  }

  return div.innerHTML;
};

export const undoEditorContent = (core, node, force = false) => {
  if (
    !config.isInMockMode &&
    (force || (!node?.previousSibling && !node?.nextSibling))
  ) {
    const historyStack = core.history?.stack;
    const content = historyStack[historyStack?.length - 1]?.contents;

    if (content) {
      core.setContents(content);
    }
  }
};

export const safeInsertNodeInEditor = (core, node) => {
  try {
    core.insertNode(node);
    undoEditorContent(core, node);
  } catch {
    undoEditorContent(core, node, true);
  }
};

export const getFormattedDate = (date) => {
  const year = date.getFullYear();

  let month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : `0${month}`;

  let day = date.getDate().toString();
  day = day.length > 1 ? day : `0${day}`;

  return `${month}/${day}/${year}`;
};

export const getEmailCampaignStatusById = (statusId) =>
  Object.keys(EmailCampaignStatusEnum).find(
    (key) => EmailCampaignStatusEnum[key] === statusId
  );

export const uiFilterLastVisitMapping = config.months48max
  ? [0, 1, 2, 3, 6, 12, 18, 24, 30, 36, 42, 48]
  : [0, 1, 2, 3, 6, 9, 12, 18, 24];

export const defaultLastVisitStart =
  uiFilterLastVisitMapping[uiFilterLastVisitMapping.length - 1];

const showDateOnly = (date) => dayjs(date)?.format("YYYY-MM-DD");

export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) {
    return false;
  }

  return showDateOnly(date1) === showDateOnly(date2);
};

export const getTimeRange = (selectedDate, ampm, now) => {
  let startHours = 0;
  let startMinutes = 0;

  if (
    isSameDay(selectedDate, now) &&
    ((now.hour() >= 12 && ampm === 12) || (now.hour() < 12 && ampm === 0))
  ) {
    startHours = now.hour();

    if (startHours >= 12) {
      startHours -= 12;
    }

    if (now.minute() < 30) {
      startMinutes = 30;
    } else {
      startHours += 1;
    }
  }

  const timeRange = [];
  const startDate = new Date();
  const minutesStep = 30;
  startDate.setHours(startHours, startMinutes, 0, 0);

  while (startDate.getHours() < 12) {
    let hours = startDate.getHours();
    const minutes = startDate.getMinutes();

    if (hours === 0) {
      hours = 12;
    }

    timeRange.push([hours, String(minutes).padStart(2, "0")].join(":"));
    startDate.setMinutes(startDate.getMinutes() + minutesStep);
  }

  return timeRange;
};

export const getQueryParameter = (param) => {
  const { search } = window.location;
  const params = new URLSearchParams(search);

  return params.get(param);
};

export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const encodeToBase64 = (value) =>
  Buffer.from(value, "utf8").toString("base64");

export const decodeFromBase64 = (value) => Buffer.from(value).toString("utf8");

export const today = dayjs().hour(23).minute(59).second(59);

export const threeMonthsAgo = today
  .subtract(3, "month")
  .hour(0)
  .minute(0)
  .second(0);

export const setImgsWidthAttr = (body) => {
  const content = convertStringToHtml(body);
  const images = content.querySelectorAll("img");

  for (let i = 0; i < images.length; i += 1) {
    const currentImage = images[i];
    const predefineWidth = currentImage?.style.width;
    const figure =
      currentImage?.parentElement.tagName === "FIGURE"
        ? currentImage?.parentElement
        : currentImage?.parentElement?.parentElement;
    const imageParent = figure?.parentElement;
    const parentClasses = imageParent?.className;

    if (predefineWidth && predefineWidth.endsWith("px")) {
      currentImage.width = predefineWidth.replace("px", "");
    } else if (predefineWidth && predefineWidth.endsWith("%")) {
      currentImage.width =
        (predefineWidth.replace("%", "") / 100) * currentImage.naturalWidth;
    }

    currentImage.style.display = "";
    currentImage.style.float = "none";
    currentImage.style.margin = "";
    imageParent.style.margin = "";
    figure.style.margin = "auto";
    figure.style.float = "none";

    if (imageParent) {
      if (parentClasses.includes("__se__float-center")) {
        currentImage.style.display = "block";
        currentImage.style.margin = "auto";
        imageParent.style.margin = "auto";
        imageParent.style.textAlign = "center";
      } else if (parentClasses.includes("__se__float-right")) {
        currentImage.style.float = "right";
        figure.style.margin = "";
        figure.style.float = "right";
      } else if (parentClasses.includes("__se__float-left")) {
        currentImage.style.float = "left";
        figure.style.float = "left";
      }
    }
  }

  return content.innerHTML;
};

const trimSlashes = (incString) => trim(incString, "/");

export const addClientDomainIfRelative = (clientUrl, possibleRelativeLink) => {
  const pattern = /^((http|https):\/\/)/;

  if (pattern.test(possibleRelativeLink)) {
    return possibleRelativeLink;
  }

  return `${trimSlashes(clientUrl)}/${trimSlashes(possibleRelativeLink)}`;
};

export const buildMonths = (start, end) => {
  const timePeriods = [];
  let current = start;
  let firstIteration = true;

  while (current < end) {
    const startDate = firstIteration ? current : current.add(1, "second");
    current = startDate.add(1, "month").subtract(1, "second");
    const endDate = current > end ? end : current;
    firstIteration = false;

    timePeriods.push({ startDate, endDate });
  }

  return timePeriods;
};
