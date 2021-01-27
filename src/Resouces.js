import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";

//日本地図を描くプログラム
const ChoroplethMap = ({ features }) => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);

  const dataUrl = `${process.env.PUBLIC_URL}/data/normalized_data.json`;

  const selections = ["米","牛乳","肉用牛","豚","鶏卵","ブロイラー","トマト","乳牛","いちご","火力","水力","風力","原子力","太陽光","地熱"];

  const width = 900;
  const height = 900;
  const radius = 25;
  
  const projection = d3
    .geoMercator()
    .scale(1600)
    .center([139.69167, 35.68944])
    .translate([width / 2, height / 2]);
  const path = d3.geoPath().projection(projection);
  const color = d3
    .scaleLinear()
    .domain(d3.extent(features, (feature) => feature.properties.value))
    .range(["#ccc", "#0f0"]);

  
  useEffect(() => {
    async function fetchData(dataUrl) {
      const res = await fetch(dataUrl);
      const json = await res.json();
      const data = json.data;

      setData(data);
    }

    fetchData(dataUrl);
  }, []);

  useEffect(() => {
    setData((prev) => [
      ...prev.sort((a, b) => {
        return (
          selected.reduce((acc, cur) => acc + b[cur].normalizedValue, 0) -
          selected.reduce((acc, cur) => acc + a[cur].normalizedValue, 0)
        );
      }),
    ]);
  }, [selected]);
  
  return (
    <div className="box">
      <form>
        <div className="field">
          <div className="control">
            {selections.map((selection) => {
              return (
                <label className="label" key={selection}>
                  <input
                    type="checkbox"
                    value={selection}
                    onChange={(e) =>
                      setSelected((prev) => {
                        if (e.target.checked) {
                          return prev.concat(e.target.value);
                        } else {
                          return prev.filter((item) => item !== e.target.value);
                        }
                      })
                    }
                  />
                  {selection}
                </label>
              );
            })}
          </div>
        </div>
      </form>

      <svg width={width} height={height}>
        <g>
          {features.map((feature, i) => (
            <path
              key={i}
              d={path(feature)}
              fill="limegreen"
              stroke="mediumseagreen"
            />
          ))}
        </g>

        {/*印の大きさについて*/}
        <g transform="translate(width/2,height)">
          <text x={width - 250} y={height - 500} fontSize="20">
            円の大きさ・色について
          </text>

          <circle
            cx={width - 200}
            cy={height - 450}
            r={radius - 5}
            fill="red"
            opacity="0.5"
          />
          <text x={width - 200 + radius} y={height - 443} fontSize="20">
            1位
          </text>

          <circle
            cx={width - 200}
            cy={height - 400}
            r={radius - 5}
            fill="blue"
            opacity="0.5"
          />
          <text x={width - 200 + radius} y={height - 393} fontSize="20">
            2位
          </text>

          <circle
            cx={width - 200}
            cy={height - 350}
            r={radius - 5}
            fill="yellow"
            opacity="0.5"
          />
          <text x={width - 200 + radius} y={height - 343} fontSize="20">
            3位
          </text>

          <circle
            cx={width - 200}
            cy={height - 300}
            r={radius - 10}
            fill="black"
            opacity="0.5"
          />
          <text x={width - 195 + radius - 10} y={height - 294} fontSize="20">
            3~10位
          </text>

          <circle
            cx={width - 200}
            cy={height - 250}
            r={radius - 15}
            fill="black"
            opacity="0.5"
          />
          <text x={width - 195 + radius - 15} y={height - 243} fontSize="20">
            10~20位
          </text>

          <circle
            cx={width - 200}
            cy={height - 200}
            r={radius - 18}
            fill="black"
            opacity="0.5"
          />
          <text x={width - 195 + radius - 18} y={height - 193} fontSize="20">
            20~30位
          </text>

          <circle
            cx={width - 200}
            cy={height - 150}
            r={radius - 20}
            fill="black"
            opacity="0.5"
          />
          <text x={width - 195 + radius - 20} y={height - 143} fontSize="20">
            30~40位
          </text>
        </g>
        {/*〜印の大きさについて*/}
        <g>
          {selected.length !== 0 &&
            data.map((item, index) => {
              const x = projection([
                data[index]["経度"],
                data[index]["緯度"],
              ])[0];
              const y = projection([
                data[index]["経度"],
                data[index]["緯度"],
              ])[1];

              let r = 0;
              let color = "red";

              if (index == 0) {
                r = radius - 5;
                color = "red";
              } else if (index == 1) {
                r = radius - 5;
                color = "blue";
              } else if (index == 2) {
                r = radius - 5;
                color = "yellow";
              } else if (index <= 10) {
                r = radius - 10;
                color = "black";
              } else if (index <= 20) {
                r = radius - 15;
                color = "black";
              } else if (index <= 30) {
                r = radius - 18;
                color = "black";
              } else if (index <= 40) {
                r = radius - 20;
                color = "black";
              } else {
                r = radius - 22;
                color = "black";
              }
              return (
                <circle
                  cx={x}
                  cy={y}
                  r={r}
                  fill={color}
                  opacity="0.5"
                  key={item["都道府県名"]}
                />
              );
            })}
        </g>
      </svg>
    </div>
  );
};

export const AboutLocalResources = () => {
  const [features, setFeatures] = useState(null);
  useEffect(() => {
    (async () => {
      const res = await fetch(`${process.env.PUBLIC_URL}/data/japan.json`);
      const data = await res.json();
      const { features } = topojson.feature(data, data.objects.japan);
      setFeatures(features);
    })();
  }, []);
  if (features == null) {
    return <p>loading</p>;
  }
  return <ChoroplethMap features={features} />;
};