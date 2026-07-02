import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <h1>Header {currentUser.email}</h1>
      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  /** Getting information or data that is common to all pages */
  const { data } = await buildClient(appContext.ctx).get(
    "/api/users/currentuser",
  );

  /** Logic to get some information or data for a very particular page */
  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return { ...data, pageProps };
};

export default AppComponent;
