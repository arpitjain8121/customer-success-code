import { useEffect } from "react";

const useOnOutsideClick = (ref, callback) => {
  useEffect(() => {
    document.addEventListener("click", clickHandler);

    return () => {
      document.removeEventListener("click", clickHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, callback]);

  function clickHandler(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      callback();
    }
  }

  return null;
};

export default useOnOutsideClick;
