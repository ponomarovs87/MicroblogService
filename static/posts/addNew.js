import "https://cdn.jsdelivr.net/simplemde/latest/simplemde.min.js";
import {
  removeAllElementsWithClass,
  addElement,
  handleFormErrors,
  addTag,
} from "../helpers/dom-element-helpers.js";
import { makeRequest } from "../helpers/makeRequest.js";
import { capitalizeWorld } from "../helpers/text-helpers.js";

document.addEventListener("DOMContentLoaded", function () {
  //todo надо ли переменная?
  new SimpleMDE({
    element: document.getElementById("markdownText"),
  });

  const tagsInput = document.getElementById("tags");
  const tagsContainer =
    document.getElementById("tags-input");
  const addNewPostForm = document.getElementById(
    "addNewPostForm"
  );
  const tagsBag = [];

  tagsInput.addEventListener("keydown", function (e) {
    if (
      e.key === "Enter" ||
      e.key === "," ||
      e.key === " "
    ) {
      e.preventDefault();
      addTag(tagsBag, tagsContainer, tagsInput);
    }
  });
  tagsInput.addEventListener("focusout", () => {
    addTag(tagsBag, tagsContainer, tagsInput);
  });

  addNewPostForm.addEventListener(
    "submit",
    async function (e) {
      e.preventDefault();

      const formData = new FormData(addNewPostForm);
      const formObject = {};

      formData.forEach((value, key) => {
        formObject[key] = value;
      });

      formObject.tags = tagsBag
        .map(capitalizeWorld)
        .join(",");

      await makeRequest("POST", "/api/post/add", formObject)
        .then((data) => {
          window.location.href = `/posts/${data.id}`;
        })
        .catch((error) => {
          removeAllElementsWithClass(".error-message");

          if (error.errors) {
            handleFormErrors(error, addNewPostForm);
          }

          if (error.message) {
            addElement(
              "p",
              "error-message general-error",
              error.message,
              addNewPostForm
            );
          } else {
            addElement(
              "p",
              "error-message general-error",
              "An error occurred. Please try again later.",
              addNewPostForm
            );
          }
        });
    }
  );
});
