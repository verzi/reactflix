import { useContext } from "react";

import { AppContext } from "../context";


const useUser = () => {
 
  const [state, setState] = useContext(AppContext); // Our values from Context
  
  const updateUser = data => {
    setState(prevState => ({
      ...prevState,
      user: data
    }));
  }; // Our methods to update the state


  // Now we return only the relevant part of the state for the component and the method to update it
  return {
    user: state.user,
    updateUser
  };
};

export default useUser;