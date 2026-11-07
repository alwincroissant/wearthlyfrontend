import { useEffect, useState } from "react";
import {
  barangays,
  cities,
  provinces,
  regions,
} from "select-philippines-address";

const selectClass =
  "w-full px-3 py-2 text-xs bg-white border rounded-lg focus:outline-none focus:border-zinc-900";

export const PhilippineAddressSelector = ({
  register,
  setValue,
  watch,
  errors = {},
  streetField = "street",
  regionField = "region",
  provinceField = "province",
  cityField = "city",
  barangayField = "barangay",
}) => {
  const [regionOptions, setRegionOptions] = useState([]);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [barangayOptions, setBarangayOptions] = useState([]);
  const [regionCode, setRegionCode] = useState("");
  const [provinceCode, setProvinceCode] = useState("");
  const [cityCode, setCityCode] = useState("");

  const values = watch([
    regionField,
    provinceField,
    cityField,
    barangayField,
  ]);
  const [regionName, provinceName, cityName, barangayName] = values;

  useEffect(() => {
    regions()
      .then((items) => setRegionOptions(Array.isArray(items) ? items : []))
      .catch(() => setRegionOptions([]));
  }, []);

  useEffect(() => {
    if (!regionCode && regionName && regionOptions.length) {
      const match = regionOptions.find((item) => item.region_name === regionName);
      if (match) setRegionCode(match.region_code);
    }
  }, [regionCode, regionName, regionOptions]);

  useEffect(() => {
    if (!regionCode) {
      setProvinceOptions([]);
      return;
    }
    provinces(regionCode)
      .then((items) => setProvinceOptions(Array.isArray(items) ? items : []))
      .catch(() => setProvinceOptions([]));
  }, [regionCode]);

  useEffect(() => {
    if (!provinceCode && provinceName && provinceOptions.length) {
      const match = provinceOptions.find(
        (item) => item.province_name === provinceName,
      );
      if (match) setProvinceCode(match.province_code);
    }
  }, [provinceCode, provinceName, provinceOptions]);

  useEffect(() => {
    if (!provinceCode) {
      setCityOptions([]);
      return;
    }
    cities(provinceCode)
      .then((items) => setCityOptions(Array.isArray(items) ? items : []))
      .catch(() => setCityOptions([]));
  }, [provinceCode]);

  useEffect(() => {
    if (!cityCode && cityName && cityOptions.length) {
      const match = cityOptions.find((item) => item.city_name === cityName);
      if (match) setCityCode(match.city_code);
    }
  }, [cityCode, cityName, cityOptions]);

  useEffect(() => {
    if (!cityCode) {
      setBarangayOptions([]);
      return;
    }
    barangays(cityCode)
      .then((items) => setBarangayOptions(Array.isArray(items) ? items : []))
      .catch(() => setBarangayOptions([]));
  }, [cityCode]);

  const update = (field, value) =>
    setValue(field, value, { shouldDirty: true, shouldValidate: true });

  const select = (field, label, options, value, onChange, disabled) => (
    <div>
      <label className="block text-zinc-600 font-medium mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        {...register(field)}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className={`${selectClass} ${
          errors[field] ? "border-red-500" : "border-zinc-300"
        } disabled:bg-zinc-100 disabled:text-zinc-400`}
      >
        <option value="">Select {label}</option>
        {options.map((item) => {
          const optionValue =
            item.region_name || item.province_name || item.city_name || item.brgy_name;
          const optionCode =
            item.region_code || item.province_code || item.city_code || item.brgy_code;
          return (
            <option key={optionCode} value={optionValue}>
              {optionValue}
            </option>
          );
        })}
      </select>
      {errors[field] && (
        <p className="text-[11px] text-red-600 mt-1">{errors[field].message}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {select(
          regionField,
          "Region",
          regionOptions,
          regionName,
          (event) => {
            const option = regionOptions.find(
              (item) => item.region_name === event.target.value,
            );
            setRegionCode(option?.region_code || "");
            setProvinceCode("");
            setCityCode("");
            update(regionField, event.target.value);
            update(provinceField, "");
            update(cityField, "");
            update(barangayField, "");
          },
        )}
        {select(
          provinceField,
          "Province",
          provinceOptions,
          provinceName,
          (event) => {
            const option = provinceOptions.find(
              (item) => item.province_name === event.target.value,
            );
            setProvinceCode(option?.province_code || "");
            setCityCode("");
            update(provinceField, event.target.value);
            update(cityField, "");
            update(barangayField, "");
          },
          !regionCode,
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {select(
          cityField,
          "City / Municipality",
          cityOptions,
          cityName,
          (event) => {
            const option = cityOptions.find(
              (item) => item.city_name === event.target.value,
            );
            setCityCode(option?.city_code || "");
            update(cityField, event.target.value);
            update(barangayField, "");
          },
          !provinceCode,
        )}
        {select(
          barangayField,
          "Barangay",
          barangayOptions,
          barangayName,
          (event) => update(barangayField, event.target.value),
          !cityCode,
        )}
      </div>
      <div>
        <label className="block text-zinc-600 font-medium mb-1">
          House / Unit No., Street <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register(streetField)}
          className={`${selectClass} ${
            errors[streetField] ? "border-red-500" : "border-zinc-300"
          }`}
        />
        {errors[streetField] && (
          <p className="text-[11px] text-red-600 mt-1">
            {errors[streetField].message}
          </p>
        )}
      </div>
    </div>
  );
};
