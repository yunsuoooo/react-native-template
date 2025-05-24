import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "reactNativeTemplate",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
  
  // 딥링크를 처리하기 위한 메서드
  func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    // URL 정보를 콘솔에 출력 (디버깅용)
    print("딥링크로 열림: \(url.absoluteString)")
    
    // JS 쪽으로 URL 이벤트 보내기
    NotificationCenter.default.post(
      name: NSNotification.Name("RCTOpenURLNotification"),
      object: nil,
      userInfo: ["url": url.absoluteString]
    )
    return true
  }
  
  // Universal Links를 처리하기 위한 메서드
  func application(
    _ application: UIApplication,
    continue userActivity: NSUserActivity,
    restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
      // Universal Link URL 정보 추출
      if userActivity.activityType == NSUserActivityTypeBrowsingWeb,
        let url = userActivity.webpageURL {
        print("Universal Link로 열림: \(url.absoluteString)")
        
        // JS 쪽으로 URL 이벤트 보내기
        NotificationCenter.default.post(
          name: NSNotification.Name("RCTOpenURLNotification"),
          object: nil,
          userInfo: ["url": url.absoluteString]
        )
        return true
      }
      return false
    }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}