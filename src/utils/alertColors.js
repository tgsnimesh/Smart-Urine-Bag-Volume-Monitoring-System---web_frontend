export const getAlertColor = (type) => {
  switch (type) {
    case "High Flow":
      return "danger";
    case "Low Flow":
      return "warning";
    default:
      return "info";
  }
};
