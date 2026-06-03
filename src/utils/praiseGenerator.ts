export interface PraiseContext {
  userName: string;
  minutes?: number;
  reflection?: 'good' | 'normal' | 'bad'; // 振り返り結果
  isFirstLaunch?: boolean;
}

export const generatePraise = (context: PraiseContext): { title: string; body: string } => {
  const hour = new Date().getHours();
  let timeGreeting = '今日も';
  if (hour >= 5 && hour < 10) timeGreeting = '朝から';
  else if (hour >= 18 && hour < 24) timeGreeting = '夜遅くまで';

  const { userName, minutes = 0, reflection, isFirstLaunch } = context;

  // 起動時の褒め言葉
  if (isFirstLaunch) {
    const launchMessages = [
      { title: '大・成・功！', body: `${timeGreeting}アプリを開いてくれてありがとう！開いた時点で今日の目標は半分達成だよ！🐰✨` },
      { title: 'えらいっ！', body: `${userName}ちゃん、${timeGreeting}来てくれたんだね！その行動力が一番の才能だよ！💪` },
      { title: '天才現る！', body: `「アプリを開く」という最大のハードルを越えた${userName}ちゃん、天才すぎる！🎉` }
    ];
    return launchMessages[Math.floor(Math.random() * launchMessages.length)];
  }

  // タイマー完了後の褒め言葉（振り返りあり）
  if (reflection) {
    if (reflection === 'good') {
      const goodMessages = [
        { title: '覚醒モード！？', body: `${minutes}分も集中できたなんて凄すぎる！完全にゾーンに入ってたね！この調子でいこう！🔥` },
        { title: '宇宙一の集中力！', body: `素晴らしい！${userName}ちゃんの「やればできる」が完全に証明されたね！誇っていいよ！🏆` }
      ];
      return goodMessages[Math.floor(Math.random() * goodMessages.length)];
    } else if (reflection === 'normal') {
      const normalMessages = [
        { title: '着実な一歩！', body: `まあまあでも大丈夫！${minutes}分やり切った事実が一番大切なんだよ。着実に進んでる！🌟` },
        { title: 'ナイス継続！', body: `自分のペースを守れて偉い！${userName}ちゃんのその安定感が未来を作るんだよ！🐢✨` }
      ];
      return normalMessages[Math.floor(Math.random() * normalMessages.length)];
    } else { // bad
      const badMessages = [
        { title: 'よく耐えた！', body: `しんどかったのに${minutes}分も逃げなかったの！？それはもう「大勝利」だよ！めちゃくちゃ強い！😭` },
        { title: '無理しないでね！', body: `疲れてる中、本当によく頑張ったね。今日はこれくらいにして、ゆっくり自分を労ってあげて！🍵💖` }
      ];
      return badMessages[Math.floor(Math.random() * badMessages.length)];
    }
  }

  // デフォルトの完了メッセージ
  const defaultMessages = [
    { title: 'あなたは本当に努力の天才！', body: `なんと今日、${minutes}分も自分の未来のために時間を使ったんだね！「やろう」と決めてやり切るその実行力、本気で尊敬するよ！😭✨` },
    { title: '尊すぎる第一歩！', body: `すごい、すごすぎる！${minutes}分勉強した${userName}ちゃんは昨日より確実にパワーアップしてるよ！🌟` }
  ];
  return defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
};
