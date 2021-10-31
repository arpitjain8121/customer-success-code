import jwtDecode from "jwt-decode";
import constants from "./constants";

const { ACCESS_TOKEN } = constants;

export const isEmail = RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z][A-Z]{1,}$/i);
export const isLoginPassword = RegExp(/^[A-Z0-9._%+-@#?$!&]{8,20}$/i);
export const isPassword = RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@_#$%^&*])(?=.{8,})"
);
export const isText = RegExp(/^[A-Z0-9._%+-@ #?$!&]{2,}$/i);
export const isAddress = RegExp(/^[A-Z0-9._%+-@ #?$!&]{11,20}$/i);
export const isPhone = RegExp(/^[0-9.%+-@#?$!&]{10}$/i);
export const isNumeric = RegExp(/^[0-9]+$/i);
export const isCurrency = RegExp(/^\d{1,6}(\.\d{1,2})?$/i);
export const isAlphaNumeric = RegExp(/^[A-Z0-9 ]+$/i);
export const isAlphabet = RegExp(/^[A-Z ]+$/i);

export function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp < Date.now() / 1000;
  } catch (err) {
    return true;
  }
}

export function loggedIn() {
  const token = localStorage.getItem(ACCESS_TOKEN);

  return token && !isTokenExpired(token);
}

export function arrayToObject(arr, key) {
  const ob = {};

  arr.forEach((item, index) => {
    ob[key ? item[key] : index] = { ...item };
  });

  return ob;
}

export function getBase64(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => res(reader.result);
    reader.onerror = err => rej(err);
  });
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export const paddedNumber = (num, pad) => {
  return (
    Array(pad - String(num).length)
      .fill(0)
      .join("") + num
  );
};

//for api call yyyy-mm-dd or mm-dd-yyyy,
export function apiCallDate(inputDate, format) {
  const date = new Date(inputDate);
  if (format === "mm-dd-yyyy") {
    if (!isNaN(date.getTime())) {
      return (
        paddedNumber(date.getMonth() + 1, 2) +
        "-" +
        paddedNumber(date.getDate(), 2) +
        "-" +
        date.getFullYear()
      );
    }
  } else {
    if (!isNaN(date.getTime())) {
      return (
        date.getFullYear() +
        "-" +
        paddedNumber(date.getMonth() + 1, 2) +
        "-" +
        paddedNumber(date.getDate(), 2)
      );
    }
  }
}

//for showing on ui for format dd-mmm-yyyy
export function displayDate(inputDate) {
  return (
    inputDate.getDate() +
    "-" +
    monthNames[inputDate.getMonth()] +
    "-" +
    inputDate.getFullYear()
  );
}

export const mergeArrayObjects = (arr1, arr2) =>
  arr1.map((item, i) => Object.assign({}, item, arr2[i]));

export function getRoute(route, match) {
  if (match) {
    const regex = new RegExp(
      Object.keys(match)
        .map(param => `:${param}`)
        .join("|"),
      "gi"
    );

    return route.replace(regex, matched => match[matched.slice(1)]);
  }

  return route;
}

export function pick(obj = {}, keys) {
  const res = {};

  keys.forEach(key => {
    res[key] = obj[key];
  });

  return res;
}

export function pluck(data = {}, keys = []) {
  if (typeof data === "object") {
    const pluckedData = {};

    for (const key in data) {
      pluckedData[key] = pick(data[key], keys);
    }

    return pluckedData;
  }
  return data;
}

export const years = years => years * 366 * 24 * 60 * 60 * 1000;
