import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import CardsComp from "../../components/cards";

import { getCardDetails } from "../../redux/cards/action";

function Cards() {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const cardDetails = useSelector(state => state.cards.cardDetails);

  useEffect(() => {
    dispatch(getCardDetails()).then(() => {
      setLoading(false);
    });
  }, [dispatch]);

  return <CardsComp cardDetails={cardDetails} loading={loading} />;
}

export default Cards;
