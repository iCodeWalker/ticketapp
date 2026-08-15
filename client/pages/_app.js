import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  /** Getting information or data that is common to all pages */
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  /** Logic to get some information or data for a very particular page */
  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser,
    );
  }

  return { ...data, pageProps };
};

export default AppComponent;
