export const consoleLogCapture = `
  (function() {
    // 원래 콘솔 메서드 저장
    var originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug
    };
    
    // 콘솔 메서드 재정의
    console.log = function() { 
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'log', data: Array.from(arguments)}));
      originalConsole.log.apply(console, arguments);
    };
    console.warn = function() { 
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'warn', data: Array.from(arguments)}));
      originalConsole.warn.apply(console, arguments);
    };
    console.error = function() { 
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'error', data: Array.from(arguments)}));
      originalConsole.error.apply(console, arguments);
    };
    console.info = function() { 
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'info', data: Array.from(arguments)}));
      originalConsole.info.apply(console, arguments);
    };
    console.debug = function() { 
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'debug', data: Array.from(arguments)}));
      originalConsole.debug.apply(console, arguments);
    };
  })();
`;

export const getInjectedJavaScript = (additionalScript?: string) => `
  (function() {
    try {
      ${consoleLogCapture}
      ${additionalScript ? additionalScript : ''}
    } catch (e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'error',
        data: ['Injected script error:', e.message]
      }));
    }
  })();
  true;
`;
