import { refresh } from "./refresh.js";

export async function makeRequest(
  method,
  http,
  formObject = {}
) {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(http, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formObject),
  });

  if (response.status === 401) {
    await refresh("/login");
    return makeRequest(http, method, formObject);
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw errorData;
  }

  return response.json();
}
