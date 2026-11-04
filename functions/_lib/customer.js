import { HttpError } from "./http.js";

function clean(value, maxLength) {
  return String(value ?? "").trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export function validateCustomer(input = {}) {
  if (!input || typeof input !== "object") {
    throw new HttpError(400, "Please add your delivery details.");
  }

  const firstName = clean(input.firstName, 60);
  const lastName = clean(input.lastName, 60);
  const name = clean(input.name || `${firstName} ${lastName}`.trim(), 120);
  const email = clean(input.email, 160).toLowerCase();
  let phone = clean(input.phone, 24).replace(/\D/g, "");
  const address = clean(input.address, 220);
  const city = clean(input.city, 80);
  const state = clean(input.state, 80);
  const postalCode = clean(input.postalCode, 6).replace(/\D/g, "");

  if (phone.length === 12 && phone.startsWith("91")) phone = phone.slice(2);
  if (phone.length === 11 && phone.startsWith("0")) phone = phone.slice(1);

  if (name.length < 2) {
    throw new HttpError(400, "Please add your full name.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) {
    throw new HttpError(400, "Please add a valid email address.");
  }
  if (!/^[6-9]\d{9}$/.test(phone)) {
    throw new HttpError(400, "Please add a valid 10-digit Indian mobile number.");
  }
  if (address.length < 5) {
    throw new HttpError(400, "Please add your delivery address.");
  }
  if (city.length < 2) {
    throw new HttpError(400, "Please add your city.");
  }
  if (state.length < 2) {
    throw new HttpError(400, "Please add your state.");
  }
  if (!/^[1-9]\d{5}$/.test(postalCode)) {
    throw new HttpError(400, "Please add a valid 6-digit PIN code.");
  }

  return {
    name,
    firstName,
    lastName,
    email,
    phone,
    address,
    city,
    state,
    postalCode,
    country: "India",
    fullAddress: `${address}, ${city}, ${state} ${postalCode}, India`,
  };
}
