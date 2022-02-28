import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    loading: true,
  }

  const [ state, dispatch ] = useReducer(githubReducer, initialState)

  const fetchUsers = async () => {
    const res = await fetch("https://api.github.com/users", {
      headers: {
        Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`
      }
    });
    const data = await res.json();

    dispatch({
      type: "GET_USERS",
      payload: data
    })
  };

  const setLoading = () => {
    dispatch({
      type: "SET_LOADING"
    })
  }

  return <GithubContext.Provider value={{ users: state.users, loading: state.loading, fetchUsers }}>
      { children }
  </GithubContext.Provider>
};

export default GithubContext
