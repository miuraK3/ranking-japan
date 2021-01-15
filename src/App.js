const Hero = () => {
    return (
        <section className = "hero is-fluid is-danger">
            <div className = "hero-body">
                <div className = "container has-text-centered">
                    <h1 className = "title">都道府県ランキング</h1>
                    <h2 className = "subtitle">テスト</h2>
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

const AboutThisPage = () => {
    return (
        <body>
            <section class="section">
                <div class="container has-text-centered">
                    <h1 class="title">このページについて</h1>
                    <h2 class="subtitle">テスト</h2>
                </div>
            </section>
        </body>
    );
}

const Visualization = () => {
    return (
        <body>
            <section className="section">
                <div className="buttons is-centered">
                    <button class="button is-info is-large is-outlined">総合点</button>
                    <button class="button is-primary is-large is-outlined">地域資源</button>
                    <button class="button is-success is-large is-outlined">地域資源</button>
                </div>
            </section>
        </body>
    );
}

const App = () => {
    return (
      <div>
        <Hero />
        <AboutThisPage />
        <Visualization />
        <Footer />
      </div>
    );
  };
  
  export default App;