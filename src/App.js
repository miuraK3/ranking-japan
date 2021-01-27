import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { AboutAwareness } from "./Awareness";
import { AboutLocalResources } from "./Resouces";

const Hero = () => {
    return (
      <section className = "hero is-fluid is-danger">
          <div className = "hero-body">
              <div className = "container has-text-centered s-divider">
                  <h1 className = "title">魅力度ランキング</h1>
                  <h2 className = "subtitle">47都道府県比較サイト</h2>
              </div>
          </div>
      </section>
    );
};

const Footer = () => {
    return (
      <footer className = "footer">
        <div className = "content has-text-centered">
            <p>&copy; 2021 kouzuki miura</p>
        </div>
      </footer>
    );
}

const AboutData = () => {
    return (
      <section className="section">
        <div className="container has-text-centered">
          <h1 className="title">移動先</h1>
          <h2 className="subtitle"></h2>このページは未完成です。完成版は<a href="https://react-jpranking.netlify.app/">こちらのページ</a>になります！
        </div>
      </section>
    );
}

const App = () => {
  return (
    <Router>
      <Hero />
      <div className="notification is-primary">
        <div className="tile is-ancestor">
          <div className="tile is-vertical">
            <div className="tile is-parent">
              <article className="tile is-child box">
                <div className="content">
                  <section className="section">
                   <div className="buttons is-centered">
                    <Link to="/" style={{ textDecoration: "none" }}>
                      <button className="button is-link is-large is-outlined">
                        <p className="title is-1">1 総合点</p>
                      </button>
                    </Link>
                    <Link to="/local" style={{ textDecoration: "none" }}>
                      <button className="button is-primary is-large is-outlined">
                        <p className="title is-1">2 地域資源</p>
                      </button>
                    </Link>
                    <Link to="/awareness" style={{ textDecoration: "none" }}>
                      <button className="button is-danger is-large is-outlined">
                        <p className="title is-1">3 認知度</p>
                      </button>
                    </Link>
                   </div>
                    <Route path="/" exact>
                      {/*<AboutTotal />*/}
                    </Route>
                    <Route path="/local" exact>
                      <AboutLocalResources />
                    </Route>
                    <Route path="/awareness" exact>
                      <AboutAwareness />
                    </Route>
                  </section>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
      <AboutData />
      <Footer />
    </Router>
  )
};

export default App;