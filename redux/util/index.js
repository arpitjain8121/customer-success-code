import CONSTANTS from "../../constants";

import {
  CHANGE_LOCALE,
  FETCH_COUNTRIES,
  ADD_MESSAGE,
  REMOVE_MESSAGE,
  SEARCH_MERCHANT,
  SEARCH_PARTNER,
  FETCH_SOURCES,
  FETCH_PRODUCTS,
  FETCH_PARTNERS,
  FETCH_BUSINESS_TYPES,
  FETCH_BANKS
} from "./types";

const { DEFAULT_LOCALE, LOCALE } = CONSTANTS;

const INITIAL_STATE = {
  locale: DEFAULT_LOCALE,
  messages: [],
  sources: undefined,
  products: undefined,
  partners: undefined,
  businessTypes: [],
  banks: []
};

const utils = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case FETCH_COUNTRIES: {
      return {
        ...state,
        countries: (payload || []).map(({ name, ...rest }) => ({
          label: name,
          value: rest
        }))
      };
    }
    case CHANGE_LOCALE: {
      localStorage.setItem(LOCALE, payload.locale);

      return { ...state, locale: payload.locale };
    }
    case ADD_MESSAGE: {
      return { ...state, messages: [...state.messages, payload] };
    }
    case REMOVE_MESSAGE: {
      const { messages } = state;
      const { id } = payload;

      if (id) {
        return {
          ...state,
          messages: messages.filter(message => message.id !== id)
        };
      }

      return { ...state, messages: messages.slice(0, messages.length - 1) };
    }
    case SEARCH_MERCHANT: {
      return { ...state, merchants: payload || [] };
    }
    case SEARCH_PARTNER: {
      return { ...state, partners: payload || [] };
    }
    case FETCH_PARTNERS: {
      return { ...state, partners: payload.data };
    }
    case FETCH_SOURCES: {
      return { ...state, sources: payload.data };
    }
    case FETCH_PRODUCTS: {
      return { ...state, products: payload.data };
    }
    case FETCH_BUSINESS_TYPES: {
      return { ...state, businessTypes: payload || [] };
    }
    case FETCH_BANKS: {
      return { ...state, banks: payload || [] };
    }

    default: {
      return { ...state };
    }
  }
};

export default utils;
