import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import { areaRadial } from "d3";

import RankingData from "./data.json"
const rData = RankingData;
//console.log(rData);

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

//日本地図を描くプログラム
const ChoroplethMap = ({ features }) => {
  const width = 1000;
  const height = 900;
  const projection = d3.geoMercator().scale(1600).center([139.69167, 35.68944]).translate([width/2, height/2]);
  const path = d3.geoPath().projection(projection);
  const color = d3
    .scaleLinear()
    .domain(d3.extent(features, (feature) => feature.properties.value))
    .range(["#ccc", "#0f0"]);
  
  //印
  const radius = 25;
  //米のみの場合で考えると？
  const rData = RankingData;
  const rice = rData.map((item) => {
    const obj = {
      都道府県:item.都道府県名,
      米:item.米,
      x:item.経度,
      y:item.緯度
    }
    return obj;
  });
  //降順にソート 
  const r = rice.sort((a,b) => (b.米) - (a.米));
  //console.log(r);
  //〜印

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
      
      {/*印の大きさについて*/}
        <g transform="translate(width/2,height)">
            <text x={width-250} y={height-500} fontSize="20">円の大きさ・色について</text>

            <circle cx={width-250} cy={height-450} r={radius-5} fill="red" opacity="0.5"/>
            <text x={width-250+radius} y={height-450} fontSize="20">1位</text>

            <circle cx={width-250} cy={height-400} r={radius-5} fill="blue" opacity="0.5"/>
            <text x={width-250+radius} y={height-400} fontSize="20">2位</text>

            <circle cx={width-250} cy={height-350} r={radius-5} fill="yellow" opacity="0.5"/>
            <text x={width-250+radius} y= {height-350}fontSize="20">3位</text>

            <circle cx={width-250} cy={height-300} r={radius-10} fill="black" opacity="0.5"/>
            <text x={width-250+radius-10} y={height-300} fontSize="20">3~10位</text>

            <circle cx={width-250} cy={height-250} r={radius-15} fill="black" opacity="0.5"/>
            <text x={width-250+radius-15} y={height-250} fontSize="20">10~20位</text>

            <circle cx={width-250} cy={height-200} r={radius-18} fill="black" opacity="0.5"/>
            <text x={width-250+radius-18} y={height-200} fontSize="20">20~30位</text>

            <circle cx={width-250} cy={height-150} r={radius-20} fill="black" opacity="0.5"/>
            <text x={width-250+radius-20} y={height-150} fontSize="20">30~40位</text>
        </g>
        {/*〜印の大きさについて*/}

        {/*印（米のみの場合）*/}
        <g>
          {rice.map((item,i) => {
            //x=経度 y=緯度
            const x = projection([rice[i].x, rice[i].y])[0];
            const y = projection([rice[i].x, rice[i].y])[1];
            //console.log(x,y);
            return <circle cx={x} cy={y} r={radius} fill="red" opacity="0.5"/>;
          })}
        </g>
        {/*〜印（米のみの場合）*/}
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
//〜日本地図を描くプログラム

//地域資源についてのプログラム
const AboutLocalResources = () => {
  const checkrist = ["火力","水力","風力","原子力","太陽光","地熱","米","牛乳","肉用牛","豚","鶏卵","プロイラー","トマト","乳牛","いちご"];
  const [val, setVal] = React.useState([]);
  const handleChange = e => {    //ONかOFFか
    if (val.includes(e.target.value)) { // すでに含まれていればOFFしたと判断し、イベント発行元を除いた配列をsetし直す (チェックなし)
      setVal(val.filter(item => item !== e.target.value));
    } else { // そうでなければONと判断し、イベント発行元を末尾に加えた配列をsetし直す (チェックあり)
      setVal([...val, e.target.value]); // stateは直接は編集できない( = val.push(e.target.value) はNG)
    }
  };
  console.log(val);

  {/*考え中！！
  let ranking = [];
  let r = [];
  r.push(rData.map((item) => {
    //console.log(item[e.target.value]);
    return item[e.target.value];
  }));
  console.log('チェックしたもののみ');
  console.log(r);
  
  ranking.push(r);
  console.log('チェックしたもを配列に');
  console.log(ranking);
  //考え中！！
  */}

  return ( 
    <div className="tile is-parent is-vertical">
      <article className="tile is-child notification is-grey has-text-centered">
        <div>
        <form onreset = "reset">
        {checkrist.map((item,i) => {
          if(i === 5){
            return (
              <label>
                <input type="checkbox" value={item} onChange={handleChange} checked={val.includes(item)}/>
                {item}
                <br />
              </label>
            );
          }else{
            return (
              <label>
                <input type="checkbox" value={item} onChange={handleChange} checked={val.includes(item)}/>
                {item}
              </label>
            );
          }
        })}
        <br/>
        <button type = "reset">描画</button>
        </form>
        </div>
        <ChoroplethMapPage /> 
      </article>
    </div>
  );
}

//認知度についてのプログラム
const AboutAwareness = () => {
  const ranking = [];
  const checkrist = ["Youtube登録者数","Youtube最高再生数","Twitterフォロワー数","Twitterツイート数","Twitter開始年月","全国国内線乗降客数","外国人訪問率","芸能人"];

  const [val, setVal] = React.useState([]);
  const handleChange = e => {    //ONかOFFか
    if (val.includes(e.target.value)) { // すでに含まれていればOFFしたと判断し、イベント発行元を除いた配列をsetし直す
      setVal(val.filter(item => item !== e.target.value));
    } else { // そうでなければONと判断し、イベント発行元を末尾に加えた配列をsetし直す (チェックあり)
      setVal([...val, e.target.value]); // stateは直接は編集できない( = val.push(e.target.value) はNG)

    }
  };
  console.log(val);

  return ( 
    <div className="tile is-parent is-vertical">
      <article className="tile is-child notification is-grey has-text-centered">
        <div>
        <form onreset = "reset">
        {checkrist.map((item,i) => {
          if(i === 4){
            return (
              <label>
                <input type="checkbox" value={item} onChange={handleChange} checked={val.includes(item)}/>
                {item}
                <br />
              </label>
            );
          }else{
            return (
              <label>
                <input type="checkbox" value={item} onChange={handleChange} checked={val.includes(item)}/>
                {item}
              </label>
            );
          }
        })}
        <br/>
        <button type = "reset">描画</button>
        </form>
        </div>
        <ChoroplethMapPage /> 
      </article>
    </div>
  );
}

//総合点についてのプログラム
const AboutTotal = () => {
  const data = []
  const checkrist = ["火力","水力","風力","原子力","太陽光","地熱","米","牛乳","肉用牛","豚","鶏卵","プロイラー","トマト","乳牛","いちご","Youtube登録者数","Youtube最高再生数","Twitterフォロワー数","Twitterツイート数","Twitter開始年月","全国国内線乗降客数","外国人訪問率","芸能人"];

  const [val, setVal] = React.useState([]);
  const handleChange = e => {    //ONかOFFか
    if (val.includes(e.target.value)) { // すでに含まれていればOFFしたと判断し、イベント発行元を除いた配列をsetし直す
      setVal(val.filter(item => item !== e.target.value));
    } else { // そうでなければONと判断し、イベント発行元を末尾に加えた配列をsetし直す (チェックあり)
      setVal([...val, e.target.value]); // stateは直接は編集できない( = val.push(e.target.value) はNG)
    }
  };
  console.log(val);

  return ( 
    <div className="tile is-parent is-vertical">
      <article className="tile is-child notification is-grey has-text-centered">
        <div>
        <form onreset = "reset">
        {checkrist.map((item,i) => {
          if(i === 5 || i === 14 || i === 19){
            return (
              <label>
                <input type="checkbox" value={item} onChange={handleChange} checked={val.includes(item)}/>
                {item}
                <br />
              </label>
            );
          }else{
            return (
              <label>
                <input type="checkbox" value={item} onChange={handleChange} checked={val.includes(item)}/>
                {item}
              </label>
            );
          }
        })}
        <br/>
        <button type = "reset">描画</button>
        </form>
        </div>
        <ChoroplethMapPage /> 
      </article>
    </div>
  );
}

const Button = (nowShowing) => {
  //console.log(nowShowing);
  if (nowShowing.value === 1) {
    return (<AboutTotal />);
  } else if (nowShowing.value === 2) {
    return (<AboutLocalResources />);
  } else {
    return (<AboutAwareness />);
  }
};

const App = () => {
  const [nowShowing, setNowShowing] = useState(1);
    return (
      <div>
        <Hero />
        <section className="section">
            <div className="buttons is-centered">
                <button className="button is-info is-large is-outlined" onClick={() => setNowShowing(1)}>総合点</button>
                <button className="button is-primary is-large is-outlined" onClick={() => setNowShowing(2)}>地域資源</button>
                <button className="button is-success is-large is-outlined" onClick={() => setNowShowing(3)}>認知度</button>
                <Button value={nowShowing} />
            </div>
        </section>
        <AboutData />
        <Footer />
      </div>
    );
};


/*(メモ用)
//全体のみの場合は？
const data = []
  data.push(rData.map((item) => {
    const obj = {
      都道府県名:item.都道府県名 
    }
    return obj;
  }))
  console.log(data);

//米のみの場合で考えると？
const rice = rData.map((item) => {
  const obj = {
    都道府県:item.都道府県名,
    米:item.米,
    x:item.経度,
    y:item.緯度
  }
  return obj;
});
//降順にソート 
const r = rice.sort((a,b) => (b.米) - (a.米));
*/
  
export default App;