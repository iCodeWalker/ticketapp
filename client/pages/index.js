import axios from "axios";
import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  console.log("The component data:", currentUser);
  return currentUser ? (
    <h1>Welcome !! You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

/** Next js is going to call this function while it is attempting to render our applcation on the server */

LandingPage.getInitialProps = async (context) => {
  /** Any data that we return from here is going to be provided to our component as a prop */

  /** To find if we are on a server or a browser */
  //   if (typeof window == "undefined") {
  //     /** We are on server */
  //     /** Request should be made using ingress namespace url */
  //     const response = await axios.get(
  //       "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
  //       {
  //         headers: req.headers,
  //       },
  //     );

  //     return response.data;
  //   } else {
  //     /** We are on the browser */
  //     /** Request should be made using base url of "" */
  //     const response = await axios.get("/api/users/currentuser");

  //     return response.data;
  //   }

  const { data } = await buildClient(context).get("/api/users/currentuser");
  return data;
};

export default LandingPage;
