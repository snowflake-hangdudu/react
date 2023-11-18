import { View, Text, Button } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import "./index.scss";
import React, { Component } from "react";

class Index extends Component {
  params = getCurrentInstance();
  componentDidMount() {
    console.log("componentDidMount");
    console.log(location.href, "我是location");
    console.log(this.params.router?.params, "我是params");
  }

  // 跳转到目的页面，打开新页面
  goNewPage(id: number) {
    console.log(id);
    Taro.navigateTo({
      url: `/pages/page1/index?id=${id}`,
    });
  }

  render() {
    return (
      <View>
        <Button onClick={() => this.goNewPage(2)}>跳转到新页面</Button>
      </View>
    );
  }
}

export default Index;
