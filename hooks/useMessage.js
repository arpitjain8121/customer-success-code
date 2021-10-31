import { useDispatch } from "react-redux";

import { addMessage } from "redux/util/action";

export default function useMessage() {
  const dispatch = useDispatch();

  return {
    success: (msg, modal, extra) =>
      dispatch(addMessage({ msg, type: "success", modal, extra })),
    error: (msg, modal, extra) =>
      dispatch(addMessage({ msg, type: "danger", modal, extra })),
    warn: (msg, modal, extra) =>
      dispatch(addMessage({ msg, type: "warning", modal, extra }))
  };
}
