import { TextInputValidator } from "../components/text-input";

export const numberValidator: TextInputValidator = (value: string): string => {
    if (!/^(([0-9]*)|(([0-9]*)\.([0-9]*)))$/.test(value)) {
        return "Value should be a number with . (dot) as a separator";
    }
    return "";
}

export const integerValidator: TextInputValidator = (value: string): string => {
    if (!/^\d+$/.test(value)) {
        return "Value should be a whole number";
    }
    return "";
}

export const hrefValidator: TextInputValidator = (value: string): string => {
    if (!/^https?:\/\//.test(value)) {
        return "Value should be a href link starting with http:// or https://"
    }
    return "";
}