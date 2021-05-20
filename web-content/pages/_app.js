import '../styles/globals.css';
import Router from "next/router";
import  Layout from '../src/components/Layout';
import ProgressBar from "@badrap/bar-of-progress";

const progress = new ProgressBar({
  size: 2,
  color: "#FF8E1C",
  className: "bar-of-progress",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);


function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />  
    </Layout>
)
}

export default MyApp
