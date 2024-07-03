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
  //! еще не решил может и не надо
  // if (error.reqData) {
  //   for (const key in error.reqData) {
  //     const input = registrationForm.querySelector(
  //       `[name="${key}"]`
  //     );
  //     if (input) {
  //       input.value = error.reqData[key];
  //     }
  //   }
  // }

  if (error.errors) {
    for (const key in error.errors) {
      const errorMessage = error.errors[key].join(", ");
      const input = registrationForm.querySelector(
        `[name="${key}"]`
      );
      if (input) {
        const errorElement = document.createElement("p");
        errorElement.className = "errorMessage";
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

function createTag(label, tagsBag, tagsContainer) {
  const div = document.createElement("div");
  div.setAttribute("class", "tag");

  const span = document.createElement("span");
  span.innerHTML = label;

  const closeBtn = document.createElement("span");
  closeBtn.setAttribute("class", "remove-tag");
  closeBtn.innerHTML = "x";

  closeBtn.addEventListener("click", function () {
    const index = tagsBag.indexOf(label);
    if (index > -1) {
      tagsBag.splice(index, 1);
    }
    tagsContainer.removeChild(div);
  });

  div.appendChild(span);
  div.appendChild(closeBtn);
  return div;
}

export function addTag(tagsBag, tagsContainer, tagsInput) {
  const value = tagsInput.value
    .split(/[\s,]+/)
    .filter((tag) => tag.trim().length > 0);

  if (value.length > 0) {
    for (let i = 0; i < value.length; i++) {
      tagsBag.push(value[i]);
      const tag = createTag(
        value[i],
        tagsBag,
        tagsContainer
      );
      tagsContainer.insertBefore(tag, tagsInput);
    }
    tagsInput.value = "";
  }
}
