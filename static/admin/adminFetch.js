import { makeRequest } from "../helpers/makeRequest.js";

document.addEventListener("DOMContentLoaded", () => {
  const usersTable = document.getElementById("usersTable");
  usersTable
    .querySelectorAll(".delete-button")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        const userId = button.getAttribute("data-id");
        if (
          confirm(
            "Вы уверены, что хотите удалить этого юзера?"
          )
        ) {
          await makeRequest(
            "DELETE",
            `/api/admin/user/${userId}`
          )
            .then(() => {
              document
                .getElementById(`user_${userId}`)
                .remove();
            })
            .catch((error) => {
              removeAllElementsWithClass(".error-message");

              if (error.message) {
                addElement(
                  "p",
                  "error-message general-error",
                  error.message,
                  usersTable
                );
              } else {
                addElement(
                  "p",
                  "error-message general-error",
                  "An error occurred. Please try again later.",
                  usersTable
                );
              }
            });
        }
      });
    });
  usersTable
    .querySelectorAll(".edit-button")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        const userId = button.getAttribute("data-id");
        const roleElement = usersTable.querySelector(
          `#user_${userId}_role`
        );
        const role = roleElement.innerText;
        if (confirm("Изменить роль у Юзера?")) {
          const newRole =
            role === "Admin" ? "User" : "Admin";
          await makeRequest(
            "PUT",
            `/api/admin/userRole/${userId}`,
            { newRole }
          )
            .then((data) => {
              roleElement.innerText = data.role;
            })
            .catch((error) => {
              removeAllElementsWithClass(".error-message");

              if (error.message) {
                addElement(
                  "p",
                  "error-message general-error",
                  error.message,
                  usersTable
                );
              } else {
                addElement(
                  "p",
                  "error-message general-error",
                  "An error occurred. Please try again later.",
                  usersTable
                );
              }
            });
        }
      });
    });

    const postsTable = document.getElementById("postsTable")
    postsTable
    .querySelectorAll(".delete-button")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        const Id = button.getAttribute("data-id");
        if (
          confirm(
            "Вы уверены, что хотите удалить этот пост?"
          )
        ) {
          await makeRequest(
            "DELETE",
            `/api/admin/post/${Id}`
          )
            .then(() => {
              document
                .getElementById(`post_${Id}`)
                .remove();
            })
            .catch((error) => {
              removeAllElementsWithClass(".error-message");

              if (error.message) {
                addElement(
                  "p",
                  "error-message general-error",
                  error.message,
                  postsTable
                );
              } else {
                addElement(
                  "p",
                  "error-message general-error",
                  "An error occurred. Please try again later.",
                  postsTable
                );
              }
            });
        }
      });
    });

    const commentsTable = document.getElementById("commentsTable")
    commentsTable
    .querySelectorAll(".delete-button")
    .forEach((button) => {
      button.addEventListener("click", async () => {
        const Id = button.getAttribute("data-id");
        if (
          confirm(
            "Вы уверены, что хотите удалить этот комментарий?"
          )
        ) {
          await makeRequest(
            "DELETE",
            `/api/admin/comment/${Id}`
          )
            .then(() => {
              document
                .getElementById(`comment_${Id}`)
                .remove();
            })
            .catch((error) => {
              removeAllElementsWithClass(".error-message");

              if (error.message) {
                addElement(
                  "p",
                  "error-message general-error",
                  error.message,
                  commentsTable
                );
              } else {
                addElement(
                  "p",
                  "error-message general-error",
                  "An error occurred. Please try again later.",
                  commentsTable
                );
              }
            });
        }
      });
    });
});
