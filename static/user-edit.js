import {
  removeAllElementsWithClass,
  addElement,
  handleFormErrors,
} from "./helpers/dom-element-helpers.js";

document.addEventListener("DOMContentLoaded", function () {
  const editForm = document.getElementById("editForm");
  const removeForm = document.getElementById("removeForm");

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(editForm);
    const formObject = {
      email: formData.get("oldEmail"),
      password: formData.get("oldPassword"),
      newUserData: {},
    };

    formObject.newUserData.email = formData.get("email");
    formObject.newUserData.password =
      formData.get("password");
    formObject.newUserData.surname =
      formData.get("surname");
    formObject.newUserData.name = formData.get("name");
    formObject.newUserData.birthDate =
      formData.get("birthDate");

    fetch("/api/user/edit", {
      method: "PUT",
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
            editForm
          );
        }

        if (error.errors) {
          handleFormErrors(error, editForm);
        } else {
          addElement(
            "p",
            "error-message general-error",
            "An error occurred. Please try again later.",
            editForm
          );
        }
      });
  });
  removeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(removeForm);
    const formObject = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    console.log(formObject);

    fetch("/api/user/delete", {
      method: "DELETE",
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
        localStorage.removeItem("accessToken")
        window.location.href = "/";
      })
      .catch((error) => {
        removeAllElementsWithClass(".error-message");

        if (error.message) {
          addElement(
            "p",
            "error-message general-error",
            error.message,
            removeForm
          );
        }

        if (error.errors) {
          handleFormErrors(error, removeForm);
        } else {
          addElement(
            "p",
            "error-message general-error",
            "An error occurred. Please try again later.",
            removeForm
          );
        }
      });
  });
});
