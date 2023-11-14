import { View, Text, Input, Button } from "@tarojs/components";
import React, { Component } from "react";
import "./index.scss";

export default class Form extends Component {
  constructor(props) {
    super(props);
  }

  getInfo() {
    console.log("我是个方法");
  }

  render() {
    return <View className="formPage"></View>;
  }
}
