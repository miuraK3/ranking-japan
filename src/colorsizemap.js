import React, { useEffect, useState } from "react";

const ColorSizeAndMap = ({ features }) => {
  const width = 900;
  const height = 900;
  const radius = 25;

  return (
    <svg width={width} height={height}>
      {/*印の大きさについて*/}
      <g transform="translate(width/2,height)">
          <text x={width - 250} y={height - 500} fontSize="20">円の大きさ・色について</text>

          <circle cx={width - 200} cy={height - 450} r={radius - 5} fill="red" opacity="0.5"/>
          <text x={width - 200 + radius} y={height - 443} fontSize="20">1位</text>

          <circle cx={width - 200} cy={height - 400} r={radius - 5} fill="blue" opacity="0.5"/>
          <text x={width - 200 + radius} y={height - 393} fontSize="20">2位</text>

          <circle cx={width - 200} cy={height - 350} r={radius - 5} fill="yellow" opacity="0.5"/>
          <text x={width - 200 + radius} y={height - 343} fontSize="20">3位</text>

          <circle cx={width - 200} cy={height - 300} r={radius - 10} fill="pink" opacity="0.5"/>
          <text x={width - 195 + radius - 10} y={height - 294} fontSize="20">4~10位</text>

          <circle cx={width - 200} cy={height - 250} r={radius - 15} fill="orange" opacity="0.5"/>
          <text x={width - 195 + radius - 15} y={height - 243} fontSize="20">11~20位</text>

          <circle cx={width - 200} cy={height - 200} r={radius - 18} fill="black" opacity="0.5"/>
          <text x={width - 195 + radius - 18} y={height - 193} fontSize="20">21~30位</text>

          <circle cx={width - 200} cy={height - 150} r={radius - 20} fill="black" opacity="0.5"/>
          <text x={width - 195 + radius - 20} y={height - 143} fontSize="20">31~40位</text>

          <circle cx={width - 200} cy={height - 100} r={radius - 22} fill="black" opacity="0.5"/>
          <text x={width - 195 + radius - 22} y={height - 93} fontSize="20">41~47位</text>
        </g>
        {/*〜印の大きさについて*/}
    </svg>
  );
};

export const AboutColorSizeAndMap = () => {
    return <ColorSizeAndMap />;
  };

