import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import { AboutColorSizeAndMap } from "./colorsizemap";

//日本地図を描くプログラム
const ChoroplethMap = ({ features }) => {
  const selections = ["米","牛乳","肉用牛","豚","鶏卵","ブロイラー","トマト","乳牛","いちご","火力","水力","風力","原子力","太陽光","地熱","Youtube登録者数","Youtube最高再生数","Twitterフォロワー数","Twitterツイート数","Twitter開始年月","国内線乗降客数","外国人訪問率","芸能人"];

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

  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const dataUrl = `${process.env.PUBLIC_URL}/data/normalized_data.json`;
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
          <div className="control has-text-centered">
            {selections.map((selection, i) => {
              if (i === 8 || i === 14 || i === 19) {
                return (
                  <label>
                    <input
                      type="checkbox"
                      value={selection}
                      onChange={(e) =>
                        setSelected((prev) => {
                          if (e.target.checked) {
                            return prev.concat(e.target.value);
                          } else {
                            return prev.filter(
                              (item) => item !== e.target.value
                            );
                          }
                        })
                      }
                    />
                    {selection}
                    <br />
                  </label>
                );
              } else {
                return (
                  <label>
                    <input
                      type="checkbox"
                      value={selection}
                      onChange={(e) =>
                        setSelected((prev) => {
                          if (e.target.checked) {
                            return prev.concat(e.target.value);
                          } else {
                            return prev.filter(
                              (item) => item !== e.target.value
                            );
                          }
                        })
                      }
                    />
                    {selection}
                  </label>
                );
              }
            })}
          </div>
        </div>
      </form>
      <svg width={width} height={height}>
        <g>
          {features.map((feature, i) => {
            if (feature.properties.id === 1){
                return <path key={i} d={path(feature)} fill="darkseagreen" stroke="#3C6754"/>
            }else if (feature.properties.id <= 7){
                return <path key={i} d={path(feature)} fill="seagreen" stroke="#3C6754"/>
            }else if (feature.properties.id <= 14){
                return <path key={i} d={path(feature)} fill="mediumseagreen" stroke="#3C6754"/>
            }else if (feature.properties.id <= 23){
                return <path key={i} d={path(feature)} fill="palegreen" stroke="#3C6754"/>
            }else if (feature.properties.id <= 30){
                return <path key={i} d={path(feature)} fill="yellowgreen" stroke="#3C6754"/>
            }else if (feature.properties.id <= 35){
                return <path key={i} d={path(feature)} fill="olivedrab" stroke="#3C6754"/>
            }else if (feature.properties.id <= 39){
                return <path key={i} d={path(feature)} fill="greenyellow" stroke="#3C6754"/>
            }else{
                return <path key={i} d={path(feature)} fill="forestgreen" stroke="#3C6754"/>
            }
          })}
        </g>

        <AboutColorSizeAndMap />

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
                color = "pink";
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

export const AboutTotal = () => {
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
