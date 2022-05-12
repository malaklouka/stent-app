// import React, { useContext } from 'react';
// import { Route, Navigate , Routes} from 'react-router-dom';
// import { AuthContext } from '../Context/auth';

// function AuthRoute({ component: Component, ...rest }) {
//   const { user } = useContext(AuthContext);
  

//   return (
//     <Routes>
//     <Route
//       {...rest}
//       render={(props) => (user ? <Navigate to="/" /> : <Component {...props} />)}
//     />
//     </Routes>
//   )
// }

// export default AuthRoute;