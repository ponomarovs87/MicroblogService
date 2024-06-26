document.addEventListener("DOMContentLoaded", function () {
    const registrationForm = document.getElementById("registrationForm");
  
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

          localStorage.setItem("accessToken", data.accessToken);
          window.location.href = "/";
        })
        .catch((error) => {  

          document.querySelectorAll(".error-message").forEach((el) => el.remove());
  
          if (error.message) {
            const generalErrorElement = document.createElement("p");
            generalErrorElement.className = "error-message general-error";
            generalErrorElement.textContent = error.message;
            registrationForm.prepend(generalErrorElement);
          }
  
          if (error.errors) {
            if (error.reqData) {
              for (const key in error.reqData) {
                const input = registrationForm.querySelector(`[name="${key}"]`);
                if (input) {
                  input.value = error.reqData[key];
                }
              }
            }
  
            for (const key in error.errors) {
              const errorMessage = error.errors[key].join(", ");
              const input = registrationForm.querySelector(`[name="${key}"]`);
              if (input) {
                const errorElement = document.createElement("p");
                errorElement.className = "error-message";
                errorElement.textContent = errorMessage;
                input.parentNode.appendChild(errorElement);
              } else {
                console.warn(`Element with name="${key}" not found in the form.`);
              }
            }
          } else {
            const generalErrorElement = document.createElement("p");
            generalErrorElement.className = "error-message general-error";
            generalErrorElement.textContent = "An error occurred. Please try again later.";
            registrationForm.prepend(generalErrorElement);
          }
        });
    });
  });
  