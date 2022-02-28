import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

const GithubContext = createContext();

export const GithubProvider = ({ children }) => {
  const initialState = {
    users: [],
    user: {},
    loading: true,
  }

  const [ state, dispatch ] = useReducer(githubReducer, initialState)

  // const fetchUsers = async () => {
  //   const res = await fetch("https://api.github.com/users", {
  //     headers: {
  //       Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`
  //     }
  //   });
  //   const data = await res.json();

  //   dispatch({
  //     type: "GET_USERS",
  //     payload: data
  //   })
  // };

  const searchUsers = async (text) => {

    const params = new URLSearchParams({
      q: text
    })  
    const res = await fetch(`https://api.github.com/search/users?${params}`, {
      headers: {
        Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`
      }
    }
    );


    
    const { items } = await res.json();

    dispatch({
      type: "GET_USERS",
      payload: items
    })
  }

  // Get single user
  const getUser = async (login) => {  
    const res = await fetch(`https://api.github.com/users/${login}`, {
      headers: {
        Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`
      }
    }
    );

    if (res.status === 404) {
      window.location = "/notfound";
    } else {
      const data = await res.json();

      dispatch({
        type: "GET_USER",
        payload: data
      })
    }


  }

  const clearUsers = () => {
    dispatch({
      type: "CLEAR_USERS"
    })
  }

  const setLoading = () => {
    dispatch({
      type: "SET_LOADING"
    })
  }

  return <GithubContext.Provider value={{ users: state.users, loading: state.loading, user: state.user, searchUsers, getUser, clearUsers }}>
      { children }
  </GithubContext.Provider>
};

export default GithubContext
