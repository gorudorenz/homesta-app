export interface PraiseContext {
  userName: string;
  minutes?: number;
  reflection?: 'good' | 'normal' | 'bad'; // 振り返り結果
  isFirstLaunch?: boolean;
}

export const generatePraise = (context: PraiseContext): { title: string; body: string } => {
  const hour = new Date().getHours();
  let timeGreeting = '今日も';
  let shiftContext = '';

  if (hour >= 5 && hour < 10) {
    timeGreeting = '朝から';
    shiftContext = '出勤前の忙しい時間に';
  } else if (hour >= 21 || hour < 4) {
    timeGreeting = '夜遅くまで';
    shiftContext = '遅くまでのシフトで疲れてるのに';
  } else {
    shiftContext = '忙しいスケジュールの合間に';
  }

  const { userName, minutes = 0, reflection, isFirstLaunch } = context;

  // 起動時の褒め言葉
  if (isFirstLaunch) {
    const launchMessages = [
      { title: '大・成・功！', body: `${shiftContext}アプリを開いてくれてありがとう！開いた時点で今日の目標は半分達成だよ！無理しないでね🐰✨` },
      { title: 'えらいっ！', body: `${userName}、${timeGreeting}来てくれたんだね！店長のプレッシャーもある中、本当によくやってるよ！💪` },
      { title: '天才現る！', body: `「アプリを開く」という最大のハードルを越えた${userName}、天才すぎる！現場の疲れを癒やしながら進めよう🎉` }
    ];
    return launchMessages[Math.floor(Math.random() * launchMessages.length)];
  }

  // タイマー完了後の褒め言葉（振り返りあり）
  if (reflection) {
    if (reflection === 'good') {
      const goodMessages = [
        { title: '覚醒モード！？', body: `プレッシャーの中で${minutes}分も集中できたなんて凄すぎる！海外店舗の店長候補としても完璧な一歩だよ！🔥` },
        { title: '宇宙一の集中力！', body: `素晴らしい！現場で通じる英語力が確実に身についてるよ！誇っていいよ！🏆` }
      ];
      return goodMessages[Math.floor(Math.random() * goodMessages.length)];
    } else if (reflection === 'normal') {
      const normalMessages = [
        { title: '着実な一歩！', body: `シフトの疲れがある中でよくやった！この${minutes}分が、未来の接客で必ず活きるよ。着実に進んでる！🌟` },
        { title: 'ナイス継続！', body: `自分に厳しくしすぎないで！${userName}のその安定感が、海外店舗への道を切り拓くんだよ！🐢✨` }
      ];
      return normalMessages[Math.floor(Math.random() * normalMessages.length)];
    } else { // bad
      const badMessages = [
        { title: 'よく耐えた！', body: `しんどかったのに${minutes}分も逃げなかったの！？それはもう「大勝利」だよ！めちゃくちゃ強い！😭` },
        { title: '無理しないでね！', body: `疲れてる中、本当によく頑張ったね。自分への「厳しい監督官」はお休みして、今日はゆっくり自分を労ってあげて！🍵💖` }
      ];
      return badMessages[Math.floor(Math.random() * badMessages.length)];
    }
  }

  // デフォルトの完了メッセージ
  const defaultMessages = [
    { title: 'あなたは本当に努力の天才！', body: `なんと今日、${minutes}分も自分の未来のために時間を使ったんだね！シフトでクタクタなのに、やり切る実行力、本気で尊敬するよ！😭✨` },
    { title: '尊すぎる第一歩！', body: `すごい、すごすぎる！${minutes}分英語に触れた${userName}は昨日より確実にパワーアップしてるよ！海外への道が一歩近づいたね！🌟` }
  ];
  return defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
};
