import { useEffect } from "react";
import Router from "next/router";
import useRequest from "../../hooks/useRequest";

const SignOut = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div>
      <h1>Signing Out....</h1>
    </div>
  );
};

export default SignOut;
