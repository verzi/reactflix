import React, { useState } from "react";

const initialContext = {
  user: false,
  incidents: false,
  loading: true,
  error: false
}
const AppContext = React.createContext([{}, () => { }]);

const AppProvider = props => {
  const [state, setState] = useState(initialContext);
  return <AppContext.Provider value={[state, setState]}>{props.children}</AppContext.Provider>;
};

export { AppContext, AppProvider, initialContext }