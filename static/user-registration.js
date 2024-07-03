import {
  removeAllElementsWithClass,
  addElement,
  handleFormErrors,
} from "./helpers/dom-element-helpers.js";

document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById(
    "registrationForm"
  );

  registrationForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(registrationForm);
    const formObject = {};

    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    fetch("/api/user/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw errorData;
          });
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem(
          "accessToken",
          data.accessToken
        );
        window.location.href = "/";
      })
      .catch((error) => {
        removeAllElementsWithClass(".error-message");

        if (error.message) {
          addElement(
            "p",
            "error-message general-error",
            error.message,
            registrationForm
          );
        }

        if (error.errors) {
          handleFormErrors(error, registrationForm);
        } else {
          addElement(
            "p",
            "error-message general-error",
            "An error occurred. Please try again later.",
            registrationForm
          );
        }
      });
  });
});
