import {
  addElement,
  removeAllElementsWithClass,
} from "./helpers/dom-element-helpers.js";

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const sectionElement = document.body;
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      fetch("/api/user/logout", {
        method: "GET",
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw errorData;
            });
          }
          localStorage.removeItem("accessToken");
          window.location.href = "/";
        })
        .catch((error) => {
          removeAllElementsWithClass(".error-message");

          if (error.message) {
            addElement(
              "p",
              "error-message general-error",
              error.message,
              sectionElement
            );
          }
        });
    });
  }
});
