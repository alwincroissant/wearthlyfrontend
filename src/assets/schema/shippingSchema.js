import * as yup from "yup";

const contactNumber = () =>
  yup
    .string()
    .trim()
    .required("Mobile number is required")
    .matches(
      /^09\d{9}$/,
      "Enter a valid 11-digit mobile number (e.g. 09171234567)",
    );

const postalCode = () =>
  yup
    .string()
    .trim()
    .required("Postal code is required")
    .matches(/^\d{4}$/, "Postal code is required");

export const shippingAddressSchema = yup.object({
  label: yup.string().trim(),
  street: yup.string().trim().required("Street address is required"),
  region: yup.string().trim().required("Region is required"),
  province: yup.string().trim().required("Province is required"),
  barangay: yup.string().trim().required("Barangay is required"),
  city: yup.string().trim().required("City / Municipality is required"),
  postalCode: postalCode(),
  isDefault: yup.boolean().default(false),
});

export const buildShippingSchema = ({
  requireAddress = true,
} = {}) => {
  // When the customer is entering a brand-new address, that address lives in
  // its own form and is validated/saved separately. The hidden address fields
  // on the main form must not block the submit with "required" errors.
  const addressField = (message) =>
    requireAddress ? yup.string().trim().required(message) : yup.string().trim();

  return yup.object({
    recipientName: yup.string().trim().required("Full name is required"),
    contactNumber: contactNumber(),
    email: yup
      .string()
      .trim()
      .required("Email address is required")
      .email("Enter a valid email address"),
    fulfillmentMethod: yup.string().oneOf(["delivery"]).required(),
    partsFulfillmentMethod: yup.string().oneOf(["delivery"]).required(),
    address: addressField("Street address is required"),
    region: addressField("Region is required"),
    province: addressField("Province is required"),
    barangay: addressField("Barangay is required"),
    city: addressField("City / Municipality is required"),
    postalCode: requireAddress
      ? yup
          .string()
          .trim()
          .required("Postal code is required")
          .matches(/^\d{4}$/, "Postal code is required")
      : yup.string().trim(),
    deliveryNotes: yup.string().trim(),
  });
};
