import axios from "axios";
import axiosRetry from "axios-retry";
import Cookies from "js-cookie";
import config from "../config/config";
import rootStore from "../mobx/stores/rootStore";

const errorCodesToRetry = [400, 500, 503, 504];

axiosRetry(axios, {
  retries: 3,
  retryCondition: (error) => errorCodesToRetry.includes(error.response.status),
});

const getAuthTokenCookie = () =>
  (process.env.NODE_ENV === "development"
    ? Cookies.get("kukuiconnecttokendev")
    : Cookies.get("kukuiconnecttoken")) || null;

export const getAxiosConfig = () => ({
  headers: {
    Accept: "application/json",
    CpAuthKey: getAuthTokenCookie(),
    "Content-Type": "application/json",
  },
});

export const getCampaignTemplates = async (eventName, host = null) =>
  axios.get(
    `${host || config.backendMSOAPI}/v1/${encodeURIComponent(
      eventName
    )}/templates`,
    getAxiosConfig()
  );

export const getLocationsData = async (clientId, host = null) =>
  axios.get(
    `${host || config.backendMSOAPI}/v1/client/${clientId}/locations`,
    getAxiosConfig()
  );

export const getSpecialsData = async (clientId, host = null) =>
  axios.get(
    `${host || config.backendMSOAPI}/v1/client/${clientId}/specials`,
    getAxiosConfig()
  );

export const postSpecialData = async (clientId, postBody, host = null) =>
  axios.post(
    `${host || config.backendMSOAPI}/v1/client/${clientId}/special`,
    postBody,
    getAxiosConfig()
  );

export const getCampaigns = async (clientId, host = null) => {
  const { commonStore } = rootStore;

  const axiosConfig = {
    headers: {
      Accept: "application/json",
      CpAuthKey: getAuthTokenCookie(),
    },
    baseURL: host || config.backendMSOAPI,
    url: `/v1/client/${clientId}/campaigns`,
    params: {
      locationId: commonStore.getAvailableLocationIds(),
    },
  };

  return axios.get(`${axiosConfig.baseURL}${axiosConfig.url}`, axiosConfig);
};

export const postCampaign = async (postBody, host = null) =>
  axios.post(
    `${host || config.backendMSOAPI}/v1/campaign`,
    postBody,
    getAxiosConfig()
  );

export const putCampaign = async (campaign, host = null) =>
  axios.put(
    `${host || config.backendMSOAPI}/v1/campaign/${campaign?.id}`,
    campaign,
    getAxiosConfig()
  );

export const getCustomers = async (
  clientId,
  locationId,
  lastVisitStart = "",
  lastVisitEnd = "",
  minVisits = "",
  maxVisits = "",
  minSpent = "",
  maxSpent = "",
  unreadCampaignId = "",
  customerVehiclesMakes = [],
  excludeFleetAccounts = false,
  host = null
) => {
  const axiosConfig = {
    headers: {
      Accept: "application/json",
      CpAuthKey: getAuthTokenCookie(),
    },
    baseURL: host || config.backendMSOAPI,
    url: `/v1/client/${clientId}/location/${locationId}/customers`,
    params: {
      lastVisitStart,
      lastVisitEnd,
      minVisits,
      maxVisits,
      minSpent,
      maxSpent,
      unread: unreadCampaignId,
      customerVehiclesMakes,
      excludeFleetAccounts,
    },
  };

  return axios.get(`${axiosConfig.baseURL}${axiosConfig.url}`, axiosConfig);
};

export const getUnsubscribedEmails = async (clientId, locations, host = null) =>
  axios.get(
    `${
      host || config.backendMSOAPI
    }/v1/client/${clientId}/unsubscribedEmails?${locations}`,
    getAxiosConfig()
  );

export const getStockContent = async (eventId, host = null) =>
  axios.get(
    `${host || config.backendMSOAPI}/v1/event/${eventId}/stock-content`,
    getAxiosConfig()
  );

export const getCustomersWithAllFilters = async () => {
  const { commonStore, filtersStore } = rootStore;

  if (filtersStore.getCheckErrorsInFilterInputs) {
    return;
  }

  const recipientsData = await getCustomers(
    commonStore.cpClientId,
    commonStore.selectedLocationId,
    filtersStore.lastVisitStart,
    filtersStore.lastVisitEnd,
    filtersStore.minVisits,
    filtersStore.maxVisits,
    filtersStore.minSpent,
    filtersStore.maxSpent,
    filtersStore.unreadCampaignId,
    filtersStore.customerVehiclesMakes,
    filtersStore.excludeFleetAccounts
  );

  commonStore.setRecipients(recipientsData?.data);
};

export const getTemplateKeywordData = (clientId, locationId, host = null) =>
  axios.get(
    `${
      host || config.backendMSOAPI
    }/v1/client/${clientId}/location/${locationId}/tokens`,
    getAxiosConfig()
  );

export const getCategories = (host = null) =>
  axios.get(`${host || config.backendMSOAPI}/v1/categories`, getAxiosConfig());

export const deleteEmailCampaign = (campaignId, host = null) =>
  axios.delete(
    `${host || config.backendMSOAPI}/v1/campaign/${campaignId}`,
    getAxiosConfig()
  );

export const getEmailCampaignById = (campaignId, host = null) => {
  const { commonStore } = rootStore;

  const axiosConfig = {
    headers: {
      Accept: "application/json",
      CpAuthKey: getAuthTokenCookie(),
    },
    baseURL: host || config.backendMSOAPI,
    url: `/v1/campaign/${campaignId}`,
    params: {
      locationId: commonStore.getAvailableLocationIds(),
    },
  };

  return axios.get(`${axiosConfig.baseURL}${axiosConfig.url}`, axiosConfig);
};

export const sendEmail = (postBody, host = null) =>
  axios.post(
    `${host || config.backendMSOAPI}/v1/email/send`,
    postBody,
    getAxiosConfig()
  );

export const postImage = (formData, host = null) =>
  axios.post(`${host || config.backendMSOAPI}/v1/image`, formData, {
    headers: {
      CpAuthKey: getAuthTokenCookie(),
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });

export const getCampaignLogs = (
  clientId,
  campaignId,
  startDate,
  endDate,
  host = null
) => {
  const axiosConfig = {
    headers: {
      Accept: "application/json",
      CpAuthKey: getAuthTokenCookie(),
    },
    baseURL: host || config.backendMSOAPI,
    url: `/v1/client/${clientId}/campaign/${campaignId}`,
    params: {
      startDate,
      endDate,
    },
  };

  return axios.get(`${axiosConfig.baseURL}${axiosConfig.url}`, axiosConfig);
};

export const getCampaignsMetrics = (
  clientId,
  startDate,
  endDate,
  host = null
) => {
  const axiosConfig = {
    headers: {
      Accept: "application/json",
      CpAuthKey: getAuthTokenCookie(),
    },
    baseURL: host || config.backendMSOAPI,
    url: `/v1/client/${clientId}/metrics/email`,
    params: {
      startDate,
      endDate,
    },
  };

  return axios.get(`${axiosConfig.baseURL}${axiosConfig.url}`, axiosConfig);
};

export const getLocationSettings = (locationId, host = null) => {
  const axiosConfig = {
    headers: {
      Accept: "application/json",
      CpAuthKey: getAuthTokenCookie(),
    },
    baseURL: host || config.backendMSOAPI,
    url: `/v1/location/${locationId}/settings`,
  };

  return axios.get(`${axiosConfig.baseURL}${axiosConfig.url}`, axiosConfig);
};

export const updateLocationSettings = (
  locationId,
  defaultAccentColors,
  host = null
) =>
  axios.post(
    `${
      host || config.backendMSOAPI
    }/v1/location/${locationId}/settings/accent-colors`,
    defaultAccentColors,
    getAxiosConfig()
  );

export const getLocationCustomers = (clientId, locationId, host = null) => {
  const axiosConfig = {
    headers: {
      Accept: "application/json",
      CpAuthKey: getAuthTokenCookie(),
    },
    baseURL: host || config.backendMSOAPI,
    url: `/v1/client/${clientId}/location/${locationId}/customers/export`,
  };

  return axios.get(`${axiosConfig.baseURL}${axiosConfig.url}`, axiosConfig);
};
