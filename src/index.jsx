import { Post } from "@models/Post";
import json from "./assets/json";
import "./style/style.css";
import webpackLogo from "./assets/webpack-logo.png";
import xml from "./assets/data.xml";
import csv from "./assets/data.csv";
import "./style/lessStyles.less";
import "./style/scssStyles.scss";
import React from "react";
import { render } from "react-dom";

import('lodash').then(_ => {
  console.log('Lodash', _.random(0, 42, true))
  console.log('lodash')
})

// let post = new Post("New post", webpackLogo);

// console.log(post.toString());

// console.log("JSON: ", json);

// console.log("XML: ", xml);

// console.log("CSV: ", csv);

export const App = () => (
  <div className="react">
    <div className="content">
      <h1>Webpack app</h1>
    </div>
    <div className="logo"></div>
    <div className="box">
      <h2>less</h2>
    </div>
    <div className="box-scss">
      <h2>scss</h2>
    </div>
  </div>
);

render(<App />, document.getElementById("app"));
