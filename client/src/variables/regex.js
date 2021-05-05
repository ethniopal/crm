export const regex24hour = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

export const regexSlugUrl = /^[a-z0-9-]+$/

export const regexUrl = /^((https?|ftp|file):\/\/)?([\da-z.-]+).([a-z.]{2,6})([/\w .-]*)*\/?$/i

export const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export const regexPhone = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g

export const regexZipCanada = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/

export const regexZipUsa = /(^\d{5}$)|(^\d{9}$)|(^\d{5}-\d{4}$)/
