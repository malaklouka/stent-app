import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ApolloProvider, ApolloClient, InMemoryCache,  createHttpLink, ApolloLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from "react-router-dom";
import { Auth0Provider } from '@auth0/auth0-react';
import Cookies from 'js-cookie'


const env = "dev";
const apiDomain = env === "prod" ? "stent.io" : (env === "staging" || env === "dev") ? "staging.stent.io" : "dev.stent.io:5010";
const protocol = (env === "prod" || env ==="staging" || env === "dev" )  ? "https://" : "http://";
const useFaker = false;

// if (Cookies.get('signedin')) {
//   navigate('/private-area')
// }

const httpLink = createHttpLink({
   uri:  (useFaker && env === "dev") ? "http://localhost:9002/graphql" : protocol + "api." + apiDomain,
   withCredentials: true

  });

// Middleware to set the headers
const middlewareAuthLink = new ApolloLink((operation, forward) => {
   var tokenDev = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hbGFrbmFrYWFAZ21haWwuY29tIiwiZXh0ZXJuYWxfaWQiOiJ1c2Vycy9mYTAyMDYwZTRhYTg0ZmU0YjZlODE2MWZkYzQwZmE2ZSIsIm5hbWUiOiJ1bmRlZmluZWQgdW5kZWZpbmVkIiwibmJmIjoxNjUyMjY2NDczLCJleHAiOjE2NTIyNjY4OTMsImlhdCI6MTY1MjI2NjQ3M30.wBHIuFf1DAjRAntLpB7GJSRYAMKJPtZMPZ8iB_epXCg";
   const token = Cookies.get('tokenDev')
   

  //  const token = localStorage.getItem('tokenDev');
  // const authorizationHeader = token ? `Bearer ${token}` : null
  operation.setContext({
    headers: {
      authorization: tokenDev ? `Bearer ${tokenDev}` : null ,
    },
  });

  return forward(operation);
 });

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);
const client = new ApolloClient({
  link: httpLinkWithAuthToken,
  cache: new InMemoryCache(),
  request: operation => {
    operation.setContext({
      fetchOptions: {
        credentials: "include"
      },
      
    });
  }
});




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <ApolloProvider client={client}>
  <Router>
  <App/>
 </Router>
 </ApolloProvider>
,

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
