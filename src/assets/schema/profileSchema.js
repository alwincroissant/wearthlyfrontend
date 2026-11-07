import * as yup from "yup";
import registerSchema from "./registerSchema";

export const profileInfoSchema = registerSchema.pick([
  "firstName",
  "lastName",
  "contactNumber",
]);

export const profileAddressSchema = registerSchema
  .pick(["street", "region", "province", "barangay", "city", "postalCode"])
  .shape({
    label: yup.string().trim(),
  });

export default profileInfoSchema;
