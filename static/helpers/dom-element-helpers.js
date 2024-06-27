export function removeAllElementsWithClass(className) {
  return document
    .querySelectorAll(className)
    .forEach((el) => el.remove());
}

export function addElement(
  elementTag,
  elementClass,
  elementText,
  prependToElement
) {
  const generalElement = document.createElement(elementTag);
  generalElement.className = elementClass;
  generalElement.textContent = elementText;
  prependToElement.prepend(generalElement);
}

export function handleFormErrors(error, registrationForm) {
  if (error.reqData) {
    for (const key in error.reqData) {
      const input = registrationForm.querySelector(
        `[name="${key}"]`
      );
      if (input) {
        input.value = error.reqData[key];
      }
    }
  }

  if (error.errors) {
    for (const key in error.errors) {
      const errorMessage = error.errors[key].join(", ");
      const input = registrationForm.querySelector(
        `[name="${key}"]`
      );
      if (input) {
        const errorElement = document.createElement("p");
        errorElement.className = "error-message";
        errorElement.textContent = errorMessage;
        input.parentNode.appendChild(errorElement);
      } else {
        console.warn(
          `Element with name="${key}" not found in the form.`
        );
      }
    }
  }
}
