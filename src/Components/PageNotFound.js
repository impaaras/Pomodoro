import React, { useEffect, useState } from "react";
import "./PageNotFound.css";
import { auth } from "../Firebase";
const PageNotFound = () => {
  const [isAuthenticate, setIsAuthenticate] = useState(false);

  useEffect(() => {
    console.log("is", isAuthenticate);
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticate(true);
      } else {
        setIsAuthenticate(false);
      }
    });
  }, [isAuthenticate]);
  const homeLink = isAuthenticate ? "/" : "/login";

  return (
    <>
      <div class="four_zero_four_bg">
        <h1 class="text-center ">404</h1>
      </div>
      <section class="page_404">
        <div class="container">
          <div class="row">
            <div class="col-sm-12 ">
              <div class="col-sm-10 col-sm-offset-1  text-center">
                <div class="contant_box_404">
                  <h3 class="h2">Look like you're lost</h3>

                  <p>the page you are looking for not available!</p>

                  <a href={homeLink} class="link_404">
                    Go to Home
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PageNotFound;
