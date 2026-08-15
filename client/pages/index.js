import axios from "axios";
import buildClient from "../api/build-client";
import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  console.log("The component data:", currentUser);
  // return currentUser ? (
  //   <h1>Welcome !! You are signed in</h1>
  // ) : (
  //   <h1>You are not signed in</h1>
  // );

  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link
            className="nav-link"
            href={"/tickets/[ticketId]"}
            as={`/tickets/${ticket.id}`}
          >
            View
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

/** Next js is going to call this function while it is attempting to render our applcation on the server */

LandingPage.getInitialProps = async (context, client, currentUser) => {
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

  // const { data } = await buildClient(context).get("/api/users/currentuser");
  // return data;

  // return {};

  const { data } = await client.get("/api/tickets");

  return { tickets: data };
};

export default LandingPage;
