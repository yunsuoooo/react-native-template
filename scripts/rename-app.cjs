const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function validateBundleId(bundleId) {
  // 번들 ID 형식 검증 (예: com.company.app)
  const bundleIdRegex = /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)*$/i;

  if (!bundleIdRegex.test(bundleId)) {
    throw new Error('❌ 유효하지 않은 Bundle ID 형식입니다. (예: com.company.app)');
  }

  // 예약어 확인
  const reservedWords = ['com.android', 'com.google', 'com.apple', 'android', 'java', 'kotlin', 'com.reactnative'];
  const bundleParts = bundleId.toLowerCase().split('.');

  for (const part of bundleParts) {
    if (reservedWords.includes(part)) {
      throw new Error(`❌ Bundle ID에 예약어가 포함되어 있습니다: ${part}`);
    }
  }

  return true;
}

(async () => {
  const appName = await prompt('✅ 새 앱 이름을 입력하세요 (e.g. MyApp): ');
  let bundleId;
  let isValidBundleId = false;

  while (!isValidBundleId) {
    try {
      bundleId = await prompt('✅ 새 Bundle ID를 입력하세요 (e.g. com.company.myapp): ');
      validateBundleId(bundleId);
      isValidBundleId = true;
    } catch (error) {
      console.error(error.message);
      console.log('다시 입력해주세요.');
    }
  }

  rl.close();

  try {
    console.log('\n🚀 앱 이름 및 Bundle ID 변경 중...');
    execSync(`npx react-native-rename "${appName}" -b ${bundleId}`, { stdio: 'inherit' });

    console.log('\n📦 iOS Pods 재설치');
    execSync('pnpm pod-install', { stdio: 'inherit' });

    console.log('\n📱 Android Gradle 클린 빌드');
    execSync('pnpm android-clean', { stdio: 'inherit' });

    console.log('\n✅ 완료! 다음 항목을 수동으로 확인하세요:');

    console.log('\n[iOS]');
    console.log('⚠️ 중요: AppDelegate.swift 파일에서 모듈 이름을 반드시 변경해주세요!');
    console.log('  - withModuleName: "reactNativeTemplate" -> withModuleName: "' + appName + '"');
    console.log('- [ ] Xcode에서 Signing & Capabilities의 Team 설정');
    console.log('- [ ] 앱 아이콘 변경');
    console.log('  - [ ] AppIcon.appiconset 이미지 교체');
    console.log('  - [ ] LaunchScreen.storyboard 이미지 및 설정');
    console.log('- [ ] 필요한 권한 설정 추가 (Info.plist)');

    console.log('\n[Android]');
    console.log('- [ ] 앱 아이콘 변경');
    console.log('  - [ ] mipmap: 앱 아이콘 이미지');
    console.log('  - [ ] drawable: 스플래시 이미지');
    console.log('- [ ] 필요한 권한 추가 (AndroidManifest.xml)');

    console.log('\n🎉 모든 설정을 완료하셨다면 앱을 다시 빌드해보세요!');
  } catch (err) {
    console.error('❌ 에러 발생:', err.message);
  }
})();
