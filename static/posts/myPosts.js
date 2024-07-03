import { makeRequest } from "../helpers/makeRequest.js";


document.addEventListener("DOMContentLoaded", () => {
    const mainTable = document.getElementById("mainTable")
  document
    .querySelectorAll(".delete-button")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        const postId = button.getAttribute("data-id");
        if (
          confirm(
            "Вы уверены, что хотите удалить этот пост?"
          )
        ) {
          await makeRequest("DELETE", `/api/post/${postId}`)
            .then(() => {
              window.location.href = `/posts/myPosts`;
            })
            .catch((error) => {
              removeAllElementsWithClass(".error-message");

              if (error.message) {
                addElement(
                  "p",
                  "error-message general-error",
                  error.message,
                  mainTable
                );
              } else {
                addElement(
                  "p",
                  "error-message general-error",
                  "An error occurred. Please try again later.",
                  mainTable
                );
              }
            });
        }
      });
    });
});
