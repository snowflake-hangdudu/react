import { PropsWithChildren } from "react";
import { useLaunch } from "@tarojs/taro";
import "./app.scss";

function App({ children }: PropsWithChildren<any>) {
  console.log(children, "我是chilren");

  useLaunch(() => {
    console.log("我将会渲染首页");
  });

  // children 是将要会渲染的页面
  return children;
}

export default App;
