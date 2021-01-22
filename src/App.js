const Hero = () => {
    return (
        <section className = "hero is-fluid is-danger">
            <div className = "hero-body">
                <div className = "container has-text-centered s-divider">
                    <h1 className = "title">
                    
                        魅力度ランキング</h1>
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

const AboutMap = () => {
    return (
        <div class="tile is-parent is-vertical">
            <article class="tile is-child notification is-grey has-text-centered">
            <p>aaa</p>
            <ChoroplethMapPage />
            </article>
        </div>
    );
}

const AboutData = () => {
  return (
    <body>
            <section class="section">
                <div class="container has-text-centered">
                    <h1 class="title">データ元</h1>
                    <h2 class="subtitle">参考データは...</h2>
                </div>
            </section>
        </body>
  );
}

const Button = () => {
    return (
        <body>
            <section className="section">
                <div className="buttons is-centered">
                    <button className="button is-info is-large is-outlined" value="総合点">総合点</button>
                    <button className="button is-primary is-large is-outlined" value="地域資源">地域資源</button>
                    <button className="button is-success is-large is-outlined" value="認知度">認知度</button>
                </div>
            </section>
        </body>
    );
}

import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import { areaRadial } from "d3";
const ChoroplethMap = ({ features }) => {
  const width = 700;
  const height = 800;
  const projection = d3.geoMercator().scale(1600).center([139.69167, 35.68944]).translate([width/2, height/2]);
  const path = d3.geoPath().projection(projection);
  const color = d3
    .scaleLinear()
    .domain(d3.extent(features, (feature) => feature.properties.value))
    .range(["#ccc", "#0f0"]);
  return (
    <svg width={width} height={height}>
      <g>
        {features.map((feature, i) => (
          <path
            key={i}
            d={path(feature)}
            fill={color(feature.properties.value)}
            stroke="#7F7F7F"
          />
        ))}
      </g>
    </svg>
  );
};
export const ChoroplethMapPage = () => {
  const [features, setFeatures] = useState(null);
 useEffect(() => {
    (async() => {
      const res = await fetch(`${process.env.PUBLIC_URL}/data/japan.json`)
      const data = await res.json()
      const { features } = topojson.feature(data, data.objects.japan);
      setFeatures(features);
    })()
  },[])
  if (features == null) {
    return <p>loading</p>;
  }
  return <ChoroplethMap features={features} />;
};

const App = () => {
    return (
      <div>
        <Hero />
        <Button />
        <AboutMap />
        <AboutData />
        <Footer />
      </div>
    );
  };
  
export default App;