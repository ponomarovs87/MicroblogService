import { addElement, removeAllElementsWithClass } from "./helpers/dom-element-helpers.js";

document.addEventListener("DOMContentLoaded", function () {
  const elementForm =
    document.getElementById("loginForm");

  elementForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(elementForm);
    const formObject = {};

    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    fetch("/api/user/login", {
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
            elementForm
          );
        }

        if (error.errors) {
          handleFormErrors(error, elementForm);
        } else {
          addElement(
            "p",
            "error-message general-error",
            "An error occurred. Please try again later.",
            elementForm
          );
        }
      });
  });
});
