import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import { AboutColorSizeAndMap } from "./colorsizemap";

const ChoroplethMap = ({ features }) => {
  const selections = ["米","牛乳","肉用牛","豚","鶏卵","ブロイラー","トマト","乳牛","いちご","火力","水力","風力","原子力","太陽光","地熱","Youtube登録者数","Youtube最高再生数","Twitterフォロワー数","Twitterツイート数","Twitter開始年月","国内線乗降客数","外国人訪問率","芸能人"];
  const ranking2020 = ["北海道","京都府","沖縄県","東京都","神奈川県","大阪府","奈良県","長野県","福岡県","石川県","長崎県","兵庫県","宮崎県","静岡県","青森県","愛知県","鹿児島県","広島県","熊本県","秋田県","千葉県","宮崎県","大分県","愛媛県","香川県","富山県","山梨県","新潟県","和歌山県","島根県","三重県","山口県","福島県","岡山県","岩手県","高知県","滋賀県","埼玉県","山形県","鳥取県","群馬県","岐阜県","茨城県","福井県","佐賀県","徳島県","栃木県"];

  const width = 900;
  const height = 900;
  const radius = 25;
  const projection = d3
    .geoMercator()
    .scale(1600)
    .center([139.69167, 35.68944])
    .translate([width / 2, height / 2]);
  const path = d3.geoPath().projection(projection);

  const [data, setData] = useState([]);
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

  //全データから総合点の計算
  const total = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  data.map((item,i) => {
    for(let j = 0; j < selections.length; j++){
      total[i] += data[i][selections[j]].normalizedValue;
    }
  })
  const result = data.map((item,i) => {
    const obj = {
      都道府県:item.都道府県名,
      total:total[i],
      x:item.経度,
      y:item.緯度,
    }
    return obj;
  });
  const issorted = result.sort((a,b) => (b.total)-(a.total));

  return (
    <div className="box">
      <table class="table">
        <thead>
          <tr>
          <th>順位</th>
          <th>都道府県名</th>
          <th>地域ブランド調査2020結果</th>
          <th>順位の変動</th>
          </tr>
        </thead>
        <tfoot>
          <tr>
          <th>順位</th>
          <th>都道府県名</th>
          <th>地域ブランド調査2020結果</th>
          <th>順位の変動</th>
          </tr>
        </tfoot>
        <tbody>
        {issorted.map((item,i) => {
          if(item["都道府県"] === ranking2020[i]){
            return(
              <tr>
              <th>{i+1}</th>
              <td>{item["都道府県"]}</td>
              <td>{ranking2020[i]}</td>
              <td>→</td>
              </tr>
            );
          }else{
            let memoi = 0;
            let memoj = 0;
            for(let j = i+1; j < ranking2020.length; j++){
              console.log(i,j,item["都道府県"],ranking2020[j]);
              if(item["都道府県"] === ranking2020[j]){
                memoi = i;
                memoj = j;
                console.log(memoi,memoj);
                break;
              }
            }
            if(memoi < memoj){
                return (
                  <tr>
                  <th>{i+1}</th>
                  <td>{item["都道府県"]}</td>
                  <td>{ranking2020[i]}</td>
                  <td><div style={{ color: 'red' }}>↑</div></td>
                  </tr>
                );
            }else{
                return (
                  <tr>
                  <th>{i+1}</th>
                  <td>{item["都道府県"]}</td>
                  <td>{ranking2020[i]}</td>
                  <td><div style={{ color: 'blue' }}>↓</div></td>
                  </tr>
                );
            }
          }
        })}
        </tbody>
      </table>

      <svg width={width} height={height}>
        <AboutColorSizeAndMap />
        <g>
          {issorted.map((item, index) => {
            const x = projection([
              issorted[index]["x"],
              issorted[index]["y"],
            ])[0];
            const y = projection([
              issorted[index]["x"],
              issorted[index]["y"],
            ])[1];

            let r = 0;
            let color = "#ff0000";
            if (index == 0) {
              r = radius - 5;
              color = "#ff0000";
            } else if (index == 1) {
              r = radius - 5;
              color = "#007fff";
            } else if (index == 2) {
              r = radius - 5;
              color = "#00ff00";
            } else if (index <= 10) {
              r = radius - 10;
              color = "#ffff00";
            } else if (index <= 20) {
              r = radius - 15;
              color = "#ff7f00";
            } else if (index <= 30) {
              r = radius - 18;
              color = "black";
            } else if (index <= 40) {
              r = radius - 20;
              color = "#7fff00";
            } else {
              r = radius - 20;
              color = "#7f00ff";
            }
            return (
              <circle cx={x} cy={y} r={r} fill={color} opacity="0.7" key={item["都道府県名"]}/>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export const AboutTotal = () => {
  return <ChoroplethMap />;
};