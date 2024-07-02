import {
  addElement,
  handleFormErrors,
  removeAllElementsWithClass,
} from "../helpers/dom-element-helpers.js";
import { makeRequest } from "../helpers/makeRequest.js";

document.addEventListener("DOMContentLoaded", function () {
  const newCommentForm = document.getElementById(
    "newCommentForm"
  );
  const postId = newCommentForm.getAttribute("data-id");

  newCommentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(newCommentForm);
    const formObject = {};

    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    await makeRequest(
      "POST",
      `/api/comment/${postId}`,
      formObject
    )
      .then((data) => {
        window.location.href = `/posts/${data.postId} `;
      })
      .catch((error) => {
        removeAllElementsWithClass(".error-message");

        if (error.errors) {
          handleFormErrors(error, newCommentForm);
        }

        if (error.message) {
          addElement(
            "p",
            "error-message general-error",
            error.message,
            newCommentForm
          );
        } else {
          addElement(
            "p",
            "error-message general-error",
            "An error occurred. Please try again later.",
            newCommentForm
          );
        }
      });
  });

  document
    .querySelectorAll("#editComment")
    .forEach((button) => {
      const commentId = button.getAttribute("data-id");
      const commentDiv = document.getElementById(
        `comment${commentId}`
      );
      const h3Element = commentDiv.querySelector("h3");
      const inputElement = document.createElement("input");
      const lastContextButton = button.textContent;

      function editComment() {
        inputElement.type = "text";
        inputElement.name = "context";
        inputElement.value = h3Element.textContent;
        commentDiv.replaceChild(inputElement, h3Element);
        button.textContent = "сохранить изменения";
        button.addEventListener("click", saveComment, {
          once: true,
        });
      }
      async function saveComment() {
        if (h3Element.textContent !== inputElement.value) {
          await makeRequest(
            "PUT",
            `/api/comment/${postId}`,
            {
              commentId: +commentId,
              context: inputElement.value,
            }
          )
            .then((data) => {
              button.textContent = lastContextButton;
              h3Element.textContent = data.context;
              commentDiv.replaceChild(
                h3Element,
                inputElement
              );
              button.addEventListener(
                "click",
                editComment,
                {
                  once: true,
                }
              );
            })
            .catch((error) => {
              removeAllElementsWithClass(".error-message");
              if (error.errors) {
                handleFormErrors(error, commentDiv);
              }
            });
        } else {
          button.textContent = lastContextButton;
          commentDiv.replaceChild(h3Element, inputElement);
          button.addEventListener("click", editComment, {
            once: true,
          });
        }
      }
      button.addEventListener("click", editComment, {
        once: true,
      });
    });

  document
    .querySelectorAll("#removeComment")
    .forEach((button) => {
      const commentId = button.getAttribute("data-id");
      const commentDiv = document.getElementById(
        `comment${commentId}`
      );
      button.addEventListener("click", () => {
        makeRequest("DELETE", `/api/comment/${postId}`, {
          commentId: +commentId,
        })
          .then(() => {
            commentDiv.remove();
          })
          .catch((error) => {
            removeAllElementsWithClass(".error-message");
            if (error.message) {
              addElement(
                "p",
                "error-message general-error",
                error.message,
                commentDiv
              );
            }
          });
      });
    });
});
