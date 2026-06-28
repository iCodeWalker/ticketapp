import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log("The component data:", currentUser);
  return <h1>Landing page 2</h1>;
};

/** Next js is going to call this function while it is attempting to render our applcation on the server */

LandingPage.getInitialProps = async ({ req }) => {
  /** Any data that we return from here is going to be provided to our component as a prop */

  /** To find if we are on a server or a browser */
  if (typeof window == "undefined") {
    /** We are on server */
    /** Request should be made using ingress namespace url */
    const response = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        headers: req.headers,
      },
    );

    return response.data;
  } else {
    /** We are on the browser */
    /** Request should be made using base url of "" */
    const response = await axios.get("/api/users/currentuser");

    return response.data;
  }
};

export default LandingPage;
