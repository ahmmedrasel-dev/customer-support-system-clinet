import Cookies from "js-cookie";

export const setCookie = (name: string, value: any) => {
  Cookies.set(name, typeof value === "string" ? value : JSON.stringify(value), {
    expires: 7, // 7 days
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export const getCookie = (name: string) => {
  const value = Cookies.get(name);
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

export const removeCookie = (name: string) => {
  Cookies.remove(name, { path: "/" });
};
