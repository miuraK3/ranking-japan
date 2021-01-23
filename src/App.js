import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import { areaRadial } from "d3";

import RankingData from "./data.json"
//onst rData = RankingData;
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
          <h1 className="title">データ元</h1>
          <h2 className="subtitle">参考データについて...</h2>
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
  //const rData = RankingData;

  const [val, setVal] = React.useState([]);
  const handleChange = e => {
    //ONかOFFか
    if (val.includes(e.target.value)) {
      // すでに含まれていればOFFしたと判断し、イベント発行元を除いた配列をsetし直す
      setVal(val.filter(item => item !== e.target.value));
    } else {
      // そうでなければONと判断し、イベント発行元を末尾に加えた配列をsetし直す
      setVal([...val, e.target.value]);
      // stateは直接は編集できない( = val.push(e.target.value) はNG)
    }
  };
  
  const drawGraph = (e) => {
    //日本地図を書くプログラム
  }
  return ( 
    <div className="tile is-parent is-vertical">
      <article className="tile is-child notification is-grey has-text-centered">
        <div>
        <form onreset = "reset">
        <label>
          <input type="checkbox" value="火力" onChange={handleChange} checked={val.includes('火力')}/>
          火力
        </label>
        <label>
          <input type="checkbox" value="水力" onChange={handleChange} checked={val.includes('水力')} />
          水力
        </label>
        <label>
          <input type="checkbox" value="風力" onChange={handleChange} checked={val.includes('風力')} />
          風力
        </label>
        <label>
          <input type="checkbox" value="原子力" onChange={handleChange} checked={val.includes('原子力')} />
          原子力
        </label>
        <label>
          <input type="checkbox" value="太陽光" onChange={handleChange} checked={val.includes('太陽光')} />
          太陽光
        </label>
        <label>
          <input type="checkbox" value="地熱" onChange={handleChange} checked={val.includes('地熱')} />
          地熱
        </label>
        <br/>
        <label>
          <input type="checkbox" value="米" onChange={handleChange} checked={val.includes('米')} />
          米
        </label>
        <label>
          <input type="checkbox" value="牛乳" onChange={handleChange} checked={val.includes('牛乳')} />
          牛乳
        </label>
        <label>
          <input type="checkbox" value="肉用牛" onChange={handleChange} checked={val.includes('肉用牛')} />
          肉用牛
        </label>
        <label>
          <input type="checkbox" value="豚" onChange={handleChange} checked={val.includes('豚')} />
          豚
        </label>
        <label>
          <input type="checkbox" value="鶏卵" onChange={handleChange} checked={val.includes('鶏卵')} />
          鶏卵
        </label>
        <label>
          <input type="checkbox" value="プロイラー" onChange={handleChange} checked={val.includes('プロイラー')} />
          プロイラー
        </label>
        <label>
          <input type="checkbox" value="トマト" onChange={handleChange} checked={val.includes('トマト')} />
          トマト
        </label>
        <label>
          <input type="checkbox" value="乳牛" onChange={handleChange} checked={val.includes('乳牛')} />
          乳牛
        </label>
        <label>
          <input type="checkbox" value="いちご" onChange={handleChange} checked={val.includes('いちご')} />
          いちご
        </label>
      <p>選択値：{val.join(', ')}</p>
        </form>
        </div>
        <ChoroplethMapPage /> 
      </article>
    </div>
  );
}

//認知度についてのプログラム
const AboutAwareness = () => {
  const data = []
  var flag = [0, 0, 0, 0, 0, 0, 0, 0]
  const add = (event) => {
    if(flag[event.target.value - 1] === 0){
      //data変数にデータを代入（初期化？）

    }else{
      data.map((item, i) => {
        //チェックした内容と一致するデータのみを取得
      })
    }
    //flag[event.target.value - 1] = 1
  }
  const drawGraph = (e) => {
    //日本地図を書くプログラム
  }
  return (
    <div className="tile is-parent is-vertical">
      <article className="tile is-child notification is-grey has-text-centered">
        <div>
        <form onreset = "reset">
              <input type = "checkbox" value = "1" id="Youtube登録者数" onClick = {add} />
              Youtube登録者数
              <input type = "checkbox" value = "2" id="Youtube最高再生数" onClick = {add} />
              Youtube最高再生数
              <br/>
              <input type = "checkbox" value = "3" id="Twitterフォロワー数" onClick = {add} />
              Twitterフォロワー数
              <input type = "checkbox" value = "4" id="Twitterツイート数" onClick = {add} />
              Twitterツイート数
              <input type = "checkbox" value = "5" id="Twitter開始年月" onClick = {add} />
              Twitter開始年月
              <br/>
              <input type = "checkbox" value = "6" id="全国国内線乗降客数" onClick = {add} />
              全国国内線乗降客数
              <input type = "checkbox" value = "7" id="外国人訪問率" onClick = {add} />
              外国人訪問率
              <input type = "checkbox" value = "8" id="芸能人" onClick = {add} />
              芸能人
              <br/>
            <button type = "reset">描画</button>
            {/*onClick = {drawGraph} を追加*/}
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
  var flag = [0, 0, 0, 0, 0, 0, 0, 0]
  const add = (event) => {
    if(flag[event.target.value - 1] === 0){
      //data変数にデータを代入（初期化？）

    }else{
      data.map((item, i) => {
        //チェックした内容と一致するデータのみを取得
      })
    }
    //flag[event.target.value - 1] = 1
  }
  const drawGraph = (e) => {
    //日本地図を書くプログラム
  }
  return (
      <div className="tile is-parent is-vertical">
        <article className="tile is-child notification is-grey has-text-centered">
          <div>
          <form onreset = "reset">
              <input type = "checkbox" value = "1" id="Youtube登録者数" onClick = {add} />
              Youtube登録者数
              <input type = "checkbox" value = "2" id="Youtube最高再生数" onClick = {add} />
              Youtube最高再生数
              <br/>
              <input type = "checkbox" value = "3" id="Twitterフォロワー数" onClick = {add} />
              Twitterフォロワー数
              <input type = "checkbox" value = "4" id="Twitterツイート数" onClick = {add} />
              Twitterツイート数
              <input type = "checkbox" value = "5" id="Twitter開始年月" onClick = {add} />
              Twitter開始年月
              <br/>
              <input type = "checkbox" value = "6" id="全国国内線乗降客数" onClick = {add} />
              全国国内線乗降客数
              <input type = "checkbox" value = "7" id="外国人訪問率" onClick = {add} />
              外国人訪問率
              <input type = "checkbox" value = "8" id="芸能人" onClick = {add} />
              芸能人など
              <br/>
            <button type = "reset">描画</button>
            {/*onClick = {drawGraph} を追加*/}
          </form>
          </div>
          <ChoroplethMapPage /> 
        </article>
      </div>  
  );
}

const BeforePressingButton = () => {
  return (
    <div className="tile is-parent is-vertical">
        <article className="tile is-child notification is-grey has-text-centered">
          <h1 className="title">ボタンを押してください。</h1>
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
  } else if (nowShowing.value === 3) {
    return (<AboutAwareness />);
  }else{
    return (<BeforePressingButton />);
  }
};

const App = () => {
  const [nowShowing, setNowShowing] = useState(0);
    return (
      <div>
        <body>
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
        </body>
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


<input type = "checkbox" value = "1" onChange = {handleChange} checked={val.includes('1')} />
火力
<input type = "checkbox" value = "2" onChange = {handleChange} checked={val.includes('1')} />
水力
<input type = "checkbox" value = "3" onChange = {handleChange} checked={val.includes('1')} />
風力
<input type = "checkbox" value = "4" onChange = {handleChange} checked={val.includes('1')} />
原子力
<input type = "checkbox" value = "5" onChange = {handleChange} checked={val.includes('1')} />
太陽光
<input type = "checkbox" value = "6" onChange = {handleChange} checked={val.includes('1')} />
地熱
<br/>
<input type = "checkbox" value = "7" onChange = {handleChange} checked={val.includes('1')} />
米
<input type = "checkbox" value = "8" onChange = {handleChange} checked={val.includes('1')} />
牛乳
<input type = "checkbox" value = "9" onChange = {handleChange} checked={val.includes('1')} />
肉用牛
<input type = "checkbox" value = "10" onChange = {handleChange} checked={val.includes('1')} />
豚
<input type = "checkbox" value = "11" onChange = {handleChange} checked={val.includes('1')}/>
鶏卵
<input type = "checkbox" value = "12" onChange = {handleChange} checked={val.includes('1')} />
プロイラー
<input type = "checkbox" value = "13" onChange = {handleChange} checked={val.includes('1')} />
トマト
<input type = "checkbox" value = "14" onChange = {handleChange} checked={val.includes('1')} />
乳牛
<input type = "checkbox" value = "15" onChange = {handleChange} checked={val.includes('1')} />
いちご
<br/>
<button type = "reset">描画</button> //onClick = {drawGraph} を追加する？
*/
  
export default App;