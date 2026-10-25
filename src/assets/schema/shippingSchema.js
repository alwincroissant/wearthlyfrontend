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
  barangay: yup.string().trim().required("Barangay is required"),
  city: yup.string().trim().required("City / Municipality is required"),
  postalCode: postalCode(),
  isDefault: yup.boolean().default(false),
});

export const buildShippingSchema = ({
  hasMotorcycles = false,
  requireAddress = false,
} = {}) => {
  const addressField = (message) =>
    yup
      .string()
      .trim()
      .when("partsFulfillmentMethod", {
        is: "delivery",
        then: (schema) => (requireAddress ? schema.required(message) : schema),
      });

  return yup.object({
    recipientName: yup.string().trim().required("Full name is required"),
    contactNumber: contactNumber(),
    email: yup
      .string()
      .trim()
      .required("Email address is required")
      .email("Enter a valid email address"),
    partsFulfillmentMethod: yup
      .string()
      .oneOf(["delivery", "pickup"])
      .required(),
    branch: yup
      .string()
      .trim()
      .when([], {
        is: () => hasMotorcycles,
        then: (schema) =>
          schema.required("Please select an authorized showroom"),
        otherwise: (schema) =>
          schema.when("partsFulfillmentMethod", {
            is: "pickup",
            then: (s) => s.required("Please select an authorized showroom"),
          }),
      }),
    address: addressField("Street address is required"),
    barangay: addressField("Barangay is required"),
    city: addressField("City / Municipality is required"),
    postalCode: yup
      .string()
      .trim()
      .matches(/^\d{4}$/, {
        message: "Postal code is required",
        excludeEmptyString: true,
      })
      .when("partsFulfillmentMethod", {
        is: "delivery",
        then: (schema) =>
          requireAddress ? schema.required("Postal code is required") : schema,
      }),
    deliveryNotes: yup.string().trim(),
  });
};
