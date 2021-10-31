import {
  FETCH_CARDS,
  GET_CARDS,
  GET_CARD_DETAILS,
  RESET_CARDS,
  FETCH_CARDS_HISTORY,
  FETCH_CARDS_RECORD,
  FETCH_STATUS
} from "./types";

const INITIAL_STATE = {
  cards: undefined,
  cardDetails: undefined,
  orderNowCards: undefined,
  cardRecords: undefined,
  cardStatus: undefined
};

const card = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_CARD_DETAILS: {
      return { ...state, cardDetails: payload };
    }
    case GET_CARDS: {
      return { ...state, cards: payload };
    }
    case FETCH_CARDS: {
      return { ...state, orderNowCards: payload.wpsEmployeeItems || [] };
    }

    case RESET_CARDS: {
      return { ...INITIAL_STATE };
    }

    case FETCH_CARDS_HISTORY: {
      return { ...state, cardsHistory: payload || [] };
    }
    case FETCH_CARDS_RECORD: {
      return {
        ...state,
        cardRecords: (payload.items || []).map((item, index) => ({
          ...item,
          serialNumber: index + 1
        }))
      };
    }

    case FETCH_STATUS: {
      return { ...state, cardStatus: payload };
    }

    default: {
      return { ...state };
    }
  }
};

export default card;
