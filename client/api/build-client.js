import axios from "axios";

const buildClient = ({ req }) => {
  /** To find if we are on a server or a browser */
  if (typeof window == "undefined") {
    /** We are on server */
    /** Request should be made using ingress namespace url */
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    /** We are on the browser */
    /** Request should be made using base url of "" */
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClient;
