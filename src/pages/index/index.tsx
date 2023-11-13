import { View, Text } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import Taro from "@tarojs/taro";
import "./index.scss";

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  const handleButtonClick = () => {
    Taro.navigateTo({
      url: "/pages/test1/index", // 目标页面的路径
    });
  };

  return (
    <View className="index">
      <Text>Hello world!</Text>
      <button onClick={handleButtonClick}>点我去别的页面</button>
    </View>
  );
}
