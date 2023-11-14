import { View, Text, Button } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import Taro from "@tarojs/taro";
import "./index.scss";

export default function Index() {
  useLoad(() => {
    console.log("Page loaded.");
  });

  const handleButtonClick = () => {
    Taro.switchTab({
      url: "/pages/test1/index", // 目标页面的路径
    });
  };

  const goForm = () => {
    Taro.navigateTo({
      url: "/pages/form/index", // 目标页面的路径
    });
  };

  return (
    <View className="index">
      <Text>Hello world!</Text>
      <Text>Hello world!</Text>
      <Button onClick={handleButtonClick}>点我去别的页面</Button>
      <Button onClick={goForm}>点我去表单页</Button>
    </View>
  );
}
