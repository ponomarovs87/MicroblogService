export async function refresh(
  relocationInCaseOfError = "/"
) {
  await fetch("/api/user/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        localStorage.removeItem("accessToken");
        window.location.href = relocationInCaseOfError;
        return response.json().then((errorData) => {
          throw errorData;
        });
      }

      return response.json();
    })
    .then((data) => {
      localStorage.setItem("accessToken", data.accessToken);
      return data.accessToken;
    })
    .catch(() => {
      removeAllElementsWithClass(".error-message");
      addElement(
        "p",
        "error-message general-error",
        "An error occurred. Please try again later.",
        elementForm
      );
    });
}
