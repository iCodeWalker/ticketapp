import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/useRequest";
import { Router } from "next/router";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: "/api/payment",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const milliSecLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(milliSecLeft / 1000));
    };
    /** To call start the countdown as soon as the component is rendered
     *
     * otherwise it will wait 1 second to show the timer
     */
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    /** To clear up the timer when we navigate away from the component */
    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Time left to complete your payment : {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51MY9l6SACxMz86BrLU93L0syLV18hIToeedG5Dna7suTv1noplee829aWHYgM401SvjtoX3EyWXGJWx5j6tZoGyg005Wg8aNCH"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = useContext.query;

  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
