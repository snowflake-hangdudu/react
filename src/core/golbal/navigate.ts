import Taro from '@tarojs/taro';
import Completer from '../tools/completer';


/**
 * 页面路由导航，带有promise导航功能
 */
export default class Navigate {
  private completerMap: Map<string, Completer<any>> = new Map();
  private backValueMap: Map<string, any> = new Map();

  /** 历史记录 */
  static get history() {
    return GlobalBasePageListener.history;
  }

  /**
   * Navigate.to
   * 进入一个页面，会同步创建一个promise
   * 在下一页返回时，promise会携带下一页传递的值
   * 
   * 例如：
   * 
   * // 页面A
   * let user = await Navigate.to('/pages/selectUser/index')
   * 
   * // selectUser页
   * Navigate.back({name:'用户名'})
   * 
   * 任何其他返回行为都会返回undefined值，请注意判断
   * 
   * @param url 目标路径
   * @returns 
   */
  static async to<T = void>(url: string) {
    if (url.indexOf('/') != 0) {
      throw '【错误】必须使用绝对路径作为url!';
    }
    await _taro.navigateTo({ url: url });
    var completer = new Completer<T | undefined>();
    const rawKey = url.split('?')[0];
    const finalKey = `${rawKey}#${this.history.length}`
    _pageNavigator.completerMap.set(finalKey, completer);
    return completer.promise;
  }

  /**
   * Navigate.back
   * 向后退一页，并传递值到上一页
   * @param data 需要传递的值
   */
  static back(data?: any): void {
    var key = GlobalBasePageListener.getTopPageKey()?.split('?')[0];
    _taro.navigateBack({ delta: 1 });
    if (!key) return;
    if (key.indexOf('/') != 0) key = `/${key}`;
    _pageNavigator.backValueMap.set(key, data);
  }

  /**
   * Navigate.backMutiPages
   * 向后退多页，不能携带任何值
   * 但是之前await的promise仍然会触发(会返回undefined)
   * @param delta 返回的页面数
   */
  static backMutiPages(delta?: number): void {
    _taro.navigateBack({ delta: delta ?? 1 });
  }


  /**
   * Navigate.backUntil
   * 向后退，直到到达指定页面
   * 历史路径将从上一页开始逐个传入checker函数
   * 通过checker函数判断路径，并返回true后，将会返回对应页数
   * @param checker 检查函数
   * 
   * 例子：
   * const success = Navigate.backUntil((path) => (path == '/pages/list' || path == '/pages/order'));
   * 将会回到最近的列表或订单页
   */
  static backUntil(checker?: (path: string) => boolean): boolean {
    let history = GlobalBasePageListener.history;
    history.reverse();
    for (let index = 0; index < history.length; index++) {
      if (index == 0) continue; // 0是本页
      const path = history[index];
      let isEnd = checker?.(path.replace(/#.+/g, ""));
      if (isEnd) {
        this.backMutiPages(index);
        return true;
      }
    }
    return false;
  }

  /**
   * Navigate.backToHome
   * 回到当前页面堆栈的首页
   * 区别于relaunch，只是单纯的back多层页面
   */
  static backToHome() {
    this.backMutiPages(GlobalBasePageListener.history.length - 1);
  }

  /**
   * Navigate.redirect
   * 重新进入一页
   * @param data 
   */
  static redirect(url: string): void {
    _taro.redirectTo({ url: url });
  }

  /**
   * Navigate.reLaunch
   * 重启App并重新进入
   * 如果不指定路径，默认会进入当前最底部的页面
   * @param data 
   */
  static reLaunch(url?: string): void {
    // _taro.reLaunch({ url: url ?? GlobalBasePageListener.rootPagePath });
    _taro.reLaunch({ url: url ?? '/pages/tabBar/index' });
  }

  /**
   * 显示全局的弹窗
   * @param config 弹窗配置
   * @param barrierDismissible 阻止点击蒙层隐藏弹窗
   * @param dialogKey 指定dialog的类型
   * @returns 
   */
  static showGlobalDialog<T = void, E = any>(config?: T, barrierDismissible?: boolean): Promise<E> {
    return this.showGlobalDialogWithKey({ config: config, dialogKey: undefined, barrierDismissible: barrierDismissible });
  }

  /**
   * 显示全局的弹窗(使用key，适用于多个全局弹窗)
   * @param config 弹窗配置
   * @param barrierDismissible 阻止点击蒙层隐藏弹窗
   * @param dialogKey 指定dialog的类型
   * @returns 
   */
  static showGlobalDialogWithKey<T = void, E = any>(args: { dialogKey?: string, config?: T, barrierDismissible?: boolean },): Promise<E> {
    return GlobalBasePageListener.findTopPageAndShowDialog<T>(args.config, args.dialogKey ?? '$defaultDialogKey', args.barrierDismissible);
  }

  /**
   * 设置被动返回时的返回值，应只在WebView页使用
   * WebView页同样需要嵌套BasePage
   * 只用于WebView中，在返回前传递postMessage的值到前一页
   * 在WebView中，应当只在返回时设置一次值，不应多次设置
   * @param config 
   * @returns 
   */
  static setBackNavigateValueForWebView(data?: any) {
    var key = GlobalBasePageListener.getTopPageKey()?.split('?')[0];
    if (!key) return;
    if (key.indexOf('/') != 0) key = `/${key}`;
    if (_pageNavigator.backValueMap.get(key) == undefined) {
      _pageNavigator.backValueMap.set(key, data);
    } else {
      let errText = '错误：不应多次设置返回值。';
      errText += '应当在wx.miniProgram.navgateBack前，'
      errText += '调用postMessage发送一个仅用于返回的数据，返回时在bindmessage中取出该数据调用本方法(仅可调用一次)。'
      _pageNavigator.backValueMap.set(key, { err: errText });
      throw errText;
    }
  }

  /**
   * 调用全部页面的刷新方法
   * 只要是通过root注册到BasePage的页面都会被刷新
   * 顺序：
   *  1. 调用这些页面的componentWillUnmount
   *  2. 调用这些页面的componentDidMount
   */
  static refreshAllPages() {
    GlobalBasePageListener.callAllRefreshListeners();
  }

  /** 移除掉completer(用于被动触发) */
  static removeCompleterOfKey(key: string) {
    if (key.indexOf('/') != 0) key = `/${key}`;
    setTimeout(() => {
      if (!key || !_pageNavigator.completerMap.get(key)) return;
      let value = _pageNavigator.backValueMap.get(key);
      _pageNavigator.completerMap.get(key)?.complete(value);
      _pageNavigator.completerMap.delete(key);
      _pageNavigator.backValueMap.delete(key);
    }, 10);
  }

  /** 
   * 跳转webview 
   * @param routerUrl 路由url
   * @param allowCreateNewWebview 是否允许创建新的webview（默认是false，默认在小程序的webview环境下，不允许开新的webview，若开启请指定该参数）
   */
  static toWebview(routerUrl: string, config?: {
    allowCreateNewWebview?: boolean
  }) {
    if (!config?.allowCreateNewWebview && Taro.getEnv() === 'WEB') {
      throw '\n错误: 当前环境为H5，已在webview中，所以无法使用Navigate.toWebView方法进行导航，请直接使用Navigate.to方法打开下一页。若要忽略此限制，请设置allowCreateNewWebview参数为true。';
    }
    return Navigate.to(`/pages/webview/index?src=${encodeURIComponent(routerUrl)}`)
  }
}

let _pageNavigator = new Navigate();

/**
 * 将taro的方法取出来
 */
let _taro = {
  navigateTo: Taro.navigateTo,
  navigateBack: Taro.navigateBack,
  redirectTo: Taro.redirectTo,
  reLaunch: Taro.reLaunch,
};

type DialogCaller = (config: any, dialogKey?: string, barrierDismissible?: boolean) => Promise<any>;

/**
 * 监听页面堆栈变化，获取最顶层的页面，在showDialog时，回调该页面的dialog
 */
export class GlobalBasePageListener {

  /** 刷新监听 */
  private refreshListener: Set<() => void> = new Set();

  /** 广播刷新 */
  static callAllRefreshListeners() {
    _globalBasePageListener.refreshListener.forEach(element => {
      element?.();
    });
  }

  static addRefreshListener(listener: () => void) {
    _globalBasePageListener.refreshListener.add(listener);
  }

  static removeRefreshListener(listener: () => void) {
    _globalBasePageListener.refreshListener.delete(listener);
  }

  /** 弹窗监听 */
  private dialogListener: Map<string, DialogCaller> = new Map();

  static requestBasePageKey(config: { rawKey: string, onDialogShow: DialogCaller }): string {
    if (!config.rawKey) return '';
    if (config.rawKey.indexOf('/') != 0) config.rawKey = `/${config.rawKey}`;
    const finalKey = `${config.rawKey}#${this.history.length}`
    _globalBasePageListener.dialogListener.set(finalKey, config.onDialogShow);
    return finalKey;
  }

  static removePageBind(key: string) {
    if (key.indexOf('/') != 0) key = `/${key}`;
    _globalBasePageListener.dialogListener.delete(key);
  }

  static getTopPageKey() {
    let list = Array.from(_globalBasePageListener.dialogListener.keys());
    if (list.length == 0) return undefined;
    return list[list.length - 1];
  }

  /** 显示全局的确认弹窗 */
  static findTopPageAndShowDialog<T>(config?: T, dialogKey?: string, barrierDismissible?: boolean) {
    let funcList: DialogCaller[] = Array.from(_globalBasePageListener.dialogListener.values());
    return funcList[funcList.length - 1]?.(config, dialogKey, barrierDismissible ?? true);
  }

  /** 能否回退到上一页，就是判断当前是否只有一页在堆栈内 */
  static get canNaivgateBack() {
    let list = Array.from(_globalBasePageListener.dialogListener.keys());
    return list.length > 1;
  }

  /** 历史记录 */
  static get history() {
    let list = Array.from(_globalBasePageListener.dialogListener.keys()).map(e => e.replace(/#.+/g, ""));
    return list;
  }

  /** 获取最底部的页面 */
  static get rootPagePath() {
    let list = Array.from(_globalBasePageListener.dialogListener.keys());
    return `${list[0]}`;
  }
}
/** 页面监听的缓存 */
let _globalBasePageListener = new GlobalBasePageListener();

// 清除自带的导航方法
Taro.navigateTo = async (_) => {
  throw '\n错误: 请不要使用Taro自带的navigateTo,\n请使用 Navigate.to 代替';
  return { errMsg: '' };
};
Taro.navigateBack = async (_) => {
  throw '\n错误: 请不要使用Taro自带的navigateBack,\n请使用 Navigate.back 代替';
  return { errMsg: '' };
};
Taro.redirectTo = async (_) => {
  throw '\n错误: 请不要使用Taro自带的redirectTo,\n请使用 Navigate.redirect 代替';
  return { errMsg: '' };
};
Taro.reLaunch = async (_) => {
  throw '\n错误: 请不要使用Taro自带的reLaunch,\n请使用 Navigate.reLaunch 代替';
  return { errMsg: '' };
};
let _getCurrentInstance = Taro.getCurrentInstance
Taro.getCurrentInstance = () => {
  return Object.assign({}, _getCurrentInstance())
}
