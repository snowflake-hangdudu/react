import { View, Text, Button } from "@tarojs/components";

import "./index.scss";
import React, { Component } from "react";

class Index extends Component {
  componentDidMount() {
    console.log("componentDidMount");
  }

  render() {
    return (
      <View>
        <Text>hello react</Text>
      </View>
    );
  }
}

export default Index;
