import * as yup from "yup";

export const profileInfoSchema = yup.object({
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  contactNumber: yup
    .string()
    .trim()
    .required("Contact number is required")
    .matches(/^09\d{9}$/, "11-digit contact number is required"),
});

export const profileAddressSchema = yup.object({
  label: yup.string().trim(),
  street: yup.string().trim().required("Street is required"),
  region: yup.string().trim().required("Region is required"),
  province: yup.string().trim().required("Province is required"),
  barangay: yup.string().trim().required("Barangay is required"),
  city: yup.string().trim().required("City is required"),
  postalCode: yup
    .string()
    .trim()
    .required("Postal code is required")
    .matches(/^\d{4}$/, "Postal code is required"),
});

export default profileInfoSchema;
