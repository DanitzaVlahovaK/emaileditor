const hostedLocally =
  typeof window !== "undefined" &&
  window.location.href === "http://localhost:3000/";

exports.isHostedLocally = hostedLocally;
exports.isDevelopmentEnv = process.env.NODE_ENV === "development";
exports.isE2E = process.env.REACT_APP_ENV === "e2e";

exports.months48max = true;

if (hostedLocally) {
  exports.backendRetentionAPI = "http://localhost:5000";
  exports.backendMSOAPI = "http://localhost:5010";
} else if (exports.isE2E) {
  exports.backendRetentionAPI = "http://retentionapi:5000";
} else {
  exports.backendRetentionAPI = "https://dev-retentionapi.kukui.com";
}
