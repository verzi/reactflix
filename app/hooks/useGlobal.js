import { useContext } from "react";

import { AppContext } from "../context";


const useGlobal = () => {
  const [state, setState] = useContext(AppContext);

  function setError(msg) {
    setState(state => ({ ...state, error: { status: true, msg } }));
  }

  function setLoading(status) {
    setState(state => ({ ...state, loading: status }));
  }





  return {
    error: state.error,
    loading: state.loading,
    setError,
    setLoading
  };
};

export default useGlobal;