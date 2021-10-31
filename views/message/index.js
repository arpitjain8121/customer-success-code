import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { MessageBar } from "components/common";
import { removeMessage } from "redux/util/action";

export default function Message() {
  const dispatch = useDispatch();

  const messages = useSelector(state => state.utils.messages);

  const handleDismiss = () => {
    dispatch(removeMessage());
  };

  return (
    <>
      {messages.map(message => (
        <MessageBar {...message} onDismiss={handleDismiss} />
      ))}
    </>
  );
}
