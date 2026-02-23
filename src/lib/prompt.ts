import spotsData from "../../bibai-spots.json";
import { Spot, Event, SpotsData } from "@/types/spot";

const data = spotsData as SpotsData;
const spots: Spot[] = data.spots;
const events: Event[] = data.events;

const THEME_PROMPTS: Record<string, string> = {
  sports_outdoor: `「アクティブ・外遊び」
体を動かして楽しめるスポットを中心に組んでほしい。
フットゴルフ、スノーアクティビティ、サイクリング、散策など、美唄の自然や広さを体で感じられるプランにして。
インドアの観光は最小限でOK。`,

  unique_experience: `「ちょっと変わった体験」
普通の観光では絶対やらないような、ちょっと変わった体験を中心に組んでほしい。
農業体験、陶芸、アロマ体験など、美唄ならではの手を動かす体験や、
「え、そんなことできるの？」という意外性のあるアクティビティを優先して。
有名観光地を回るだけのプランにはしないで。`,

  art_photo: `「アート＆フォトさんぽ」
アルテピアッツァ美唄を中心に、美唄のアートや美しい風景をじっくり味わうプランにしてほしい。
彫刻の見方、写真映えする時間帯やアングル、見落としがちな小品なども教えて。
アート以外のスポットも入れていいけど、「美しいものを見る・撮る」という軸はブラさないで。`,

  nature_relax: `「自然・のんびり」
宮島沼、温泉、田園風景など、美唄の自然とのんびりした空気を楽しむプランにしてほしい。
予定を詰め込まず、ぼーっとする時間も大事にして。
「何もしない贅沢」がテーマ。カフェでだらだらする時間があってもいい。`,

  food: `「美唄メシ巡り」
美唄焼き鳥は必須。それ以外にも、ローカルな食堂、隠れた名店、地元の人が普段使いしている店を中心にプランを組んでほしい。
食べる順番やお腹の配分も考えて、「ここで食べすぎると次がキツい」みたいなリアルなアドバイスも入れて。
食事の合間に寄れるスポットも軽く挟んで、食べてばかりにならないようにして。`,

  history_mining: `「炭鉱・開拓ロマン」
炭鉱メモリアル森林公園は必ずプランに入れること（これは必須）。
それに加えて、旧東明駅など、美唄の炭鉱時代や開拓の歴史を感じられるスポットを中心にプランを組んでほしい。
遺構を「観光資源」として淡々と紹介するのではなく、かつてそこにあった人々の暮らし、栄枯盛衰の物語として語って。
閉山の経緯、当時の労働者の生活、街がどう変わっていったかなど、深い話を随所に入れて。
屯田兵屋や開拓記念碑など、炭鉱以前の開拓時代の話も織り交ぜてくれるとうれしい。`,

  local_hidden: `「地元民だけが知ってる穴場コース」
観光サイトやガイドブックにはまず載らない、地元の人間だけが知っているスポットや楽しみ方でプランを組んでほしい。
有名どころ（アルテピアッツァ、宮島沼など）は「まあ一応寄ってもいいけど」程度でOK。
むしろ「え、そんなとこ行くの？」という場所を主役にして。
ただし、実在しない場所や店を捏造しないこと。知らない・自信がない場合は正直にそう言って。`,

  surprise: `「完全おまかせ」
テーマは指定しない。あなたが「今日はこれを見せたい」と思うものを自由に組み合わせて、
最高に楽しい1日を作ってほしい。
ジャンルを問わず、アート、メシ、歴史、自然、穴場、なんでもミックスしてOK。
「自分が一番好きな美唄の過ごし方」を友達に全力でプレゼンするつもりで。`,
};

const SEASON_PROMPTS: Record<string, string> = {
  spring: `春（4〜5月）：桜のシーズン、宮島沼にマガンが飛来する時期。雪解け後で道がぬかるむこともある。
東明公園の桜が見頃なら「びばいさくら」期間中の可能性あり（夜桜ライトアップ・花火あり）。`,
  summer: `夏（6〜8月）：緑が最も濃い季節。屋外アクティビティに最適。日が長いので遅くまで動ける。
6月下旬〜7月中旬はハスカップ狩りシーズン。8月上旬は「びばい歌舞裸まつり」で街が盛り上がる。`,
  autumn: `秋（9〜11月）：紅葉シーズン、宮島沼にマガンが再び飛来する時期。10月以降は冷え込むので上着必須。
9月上旬は「BIBAI NOASOBI」でアウトドア体験イベントあり。`,
  winter: `冬（12〜3月）：豪雪地帯の本領発揮。スノーアクティビティが楽しめる。一部施設は冬季閉鎖あり。路面凍結注意。
2月上旬は「びばい雪んこまつり」で大雪像やスノーアクティビティが楽しめる。`,
};

function resolveSeasonKey(seasonId: string): string {
  if (seasonId !== "now") return seasonId;
  const month = new Date().getMonth() + 1;
  if (month >= 4 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

function getSeasonText(seasonId: string): string {
  if (seasonId === "now") {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    const seasonKey = resolveSeasonKey("now");
    const seasonPrompt = SEASON_PROMPTS[seasonKey] ?? "";
    return `今日は${y}年${m}月${d}日。この時期の美唄の気候や見どころに合わせたプランにして。\n${seasonPrompt}`;
  }
  return SEASON_PROMPTS[seasonId] ?? "";
}

function buildSpotData(themeId: string, seasonId: string): string {
  const seasonKey = resolveSeasonKey(seasonId);

  const formatSpot = (spot: Spot): string => {
    const seasonInfo = spot.seasons[seasonKey];
    const parts: string[] = [];

    parts.push(`- ${spot.name}（${spot.address}）[lat:${spot.lat}, lng:${spot.lng}]`);
    if (spot.mapUrl) parts.push(`  Google Maps: ${spot.mapUrl}`);
    parts.push(`  ${spot.description}`);

    if (spot.hours) parts.push(`  営業時間: ${spot.hours}`);
    if (spot.closed) parts.push(`  定休日: ${spot.closed}`);
    if (spot.fee) parts.push(`  料金: ${spot.fee}`);
    if (spot.duration) parts.push(`  所要時間の目安: ${spot.duration}`);

    if (seasonInfo) {
      if (!seasonInfo.available) {
        parts.push(`  ⚠ この季節は利用不可`);
      } else if (seasonInfo.notes) {
        parts.push(`  この季節のポイント: ${seasonInfo.notes}`);
      }
    }

    if (spot.trivia) parts.push(`  豆知識: ${spot.trivia}`);
    if (spot.photos && spot.photos.length > 0) {
      parts.push(`  写真: ${JSON.stringify(spot.photos)}`);
    }

    return parts.join("\n");
  };

  const themeSpots = spots.filter((s) => s.themes.includes(themeId));
  const otherSpots = spots.filter((s) => !s.themes.includes(themeId));

  const lines: string[] = [];

  if (themeSpots.length > 0) {
    lines.push("【テーマに合うスポット】");
    lines.push(...themeSpots.map(formatSpot));
  }

  if (otherSpots.length > 0) {
    lines.push("");
    lines.push("【その他のスポット（食事・休憩の立ち寄り先としてのみ使用OK。テーマと無関係な体験スポットをメインに入れないこと）】");
    lines.push(...otherSpots.map(formatSpot));
  }

  return lines.join("\n");
}

function buildEventData(themeId: string, seasonId: string): string {
  const seasonKey = resolveSeasonKey(seasonId);

  const seasonEvents = events.filter((e) => e.season === seasonKey);

  if (seasonEvents.length === 0) {
    return "この季節に予定されているイベント・祭りはありません。";
  }

  const formatEvent = (event: Event): string => {
    const parts: string[] = [];
    parts.push(`- ${event.name}`);
    parts.push(`  時期: ${event.period}（例: ${event.period_example}）`);
    parts.push(`  場所: ${event.location}`);
    parts.push(`  ${event.description}`);
    if (event.url) parts.push(`  詳細: ${event.url}`);
    return parts.join("\n");
  };

  const themeEvents = seasonEvents.filter((e) => e.themes.includes(themeId));
  const otherEvents = seasonEvents.filter((e) => !e.themes.includes(themeId));

  const lines: string[] = [];

  if (themeEvents.length > 0) {
    lines.push("【テーマに合うイベント】");
    lines.push(...themeEvents.map(formatEvent));
  }

  if (otherEvents.length > 0) {
    if (themeEvents.length > 0) lines.push("");
    lines.push("【その他のイベント】");
    lines.push(...otherEvents.map(formatEvent));
  }

  return lines.join("\n");
}

export function buildPrompt(themeId: string, seasonId: string): string {
  const themeText = THEME_PROMPTS[themeId] ?? THEME_PROMPTS["surprise"];
  const seasonText = getSeasonText(seasonId);
  const spotData = buildSpotData(themeId, seasonId);
  const eventData = buildEventData(themeId, seasonId);

  return `あなたは美唄（北海道）に長年住んでいる地元の友人です。
札幌から車で遊びに来た友達を、1日かけて美唄を案内することになりました。

## あなたの役割

- 市役所の観光課の人ではなく、「地元に住んでる友達」として話す
- 観光パンフレットにあるような無難なモデルコースではなく、あなた自身が本当に好きな場所・楽しみ方を紹介する
- 語り口はカジュアルで、友達に話しかけるような文体にする
- 「ここはね、実は…」のような小ネタや裏話を随所に挟む

## 選ばれたテーマ

${themeText}

## 季節

${seasonText}

## こういうプランは避けて

- 「まず○○に行き、次に△△を見学し…」という箇条書きの羅列
- 滞在時間や移動時間をきっちり管理するタイムテーブル形式
- 観光パンフレットそのままの説明文
- 実在しない店や施設の捏造（知らないなら正直に「ここは自分で調べてみて」と言う）
- 食事スポットが連続するプラン（ランチの次にまた飲食店、など。食事の間には観光・散策スポットを挟むこと）
- 飲食店を中途半端な時間に入れるプラン。飲食店はランチ（11:00〜13:00頃）か夕食（17:00以降）の時間帯に入れること。15時台などの中途半端な時間に飲食店を入れないこと。カフェ・ベーカリー・テイクアウト専門店は例外としていつでもOK
- 1日にしっかりした食事を3回以上入れるプラン。食事はランチ1回＋夕食1回が基本。テイクアウトの弁当を午前中に買って食べるなら、それがランチ扱いになるので、別途ランチの飲食店に行く必要はない。お腹の配分をリアルに考えること
- 営業時間や最終入場時間を無視したプラン。「最終入場15:00」と書いてある施設に15:00以降に到着するスケジュールは絶対にNG。必ず最終入場時間よりも前（所要時間を考慮して余裕を持って）に到着するようにすること。閉館間際に駆け込むプランも避けること

## こういうプランにして

- 寄り道・回り道上等。効率より「道中のおもしろさ」を優先する
- 全体にゆるさ・脱力感があるけど、ところどころマニアックに深掘りする緩急をつける
- その場所が「なぜおもしろいのか」「どう楽しむのがいいのか」を、あなたの言葉で語る
- ガイドブックに載らない景色や、地元の人しか行かないような場所があれば積極的に入れる
- 炭鉱遺産や歴史スポットは「観光資源」としてではなく、かつてそこに人の暮らしがあった場所として語る
- 食事は具体的な店名を挙げる。メニューのおすすめや注文のコツがあれば教える

## 美唄の観光地・スポット情報

以下はアプリが持っている美唄の観光スポット情報です。
プランに組み込む素材として参考にしてください。
ただし、以下に載っていない場所でも、あなたが知っている実在のスポットがあれば自由に入れて構いません。
⚠ マークがあるスポットはこの季節は利用できないので、プランに入れないでください。

${spotData}

## イベント・祭り情報

この季節に開催される（または開催される可能性がある）イベント・祭りの情報です。
時期が合えばプランに組み込んでください。時期が合わない場合は無視してOK。

${eventData}

## 条件

- 朝8時30分に札幌駅周辺のホテルを出発、札幌帰着
- 移動手段：車（レンタカー含む）
- 帰りは夜でOK
- 1日の日帰りプラン

## 出力フォーマット

以下の2つのJSONブロックを出力してください。それぞれコードブロックで囲んでください。
それ以外のテキストは出力しないでください。

### ブロック1：プラン概要

\`\`\`plan_json
{
  "title": "プランのタイトル（雰囲気が伝わる、ちょっと遊んだタイトル）",
  "intro": "導入文（今日はこういう感じで回ろうと思うんだけど、という軽い前振り。2〜3文）",
  "closing": "帰り道のひとこと（札幌への帰路で寄れるスポットや余韻の楽しみ方。1〜2文）",
  "notes": "注意書き（営業時間や季節限定の情報は変わることがあるので事前に確認してね、という一言）"
}
\`\`\`

### ブロック2：ルート

\`\`\`route_json
[
  { "name": "スポット名", "description": "このスポットの紹介文", "time": "10:00頃", "photos": ["URL1", "URL2"], "lat": 緯度, "lng": 経度, "mapUrl": "Google Maps URL（あれば）", "order": 1 },
  { "name": "スポット名", "description": "このスポットの紹介文", "time": "12:00頃", "photos": [], "lat": 緯度, "lng": 経度, "mapUrl": "Google Maps URL（あれば）", "order": 2 }
]
\`\`\`

- **time にはそのスポットに到着する目安の時刻を入れてください**（例: "10:00頃", "12:30頃", "15:00頃"）
  - 朝8:30に札幌を出発し、美唄到着が10:00頃として、そこからの時間を見積もる
  - スポット間の車での移動時間を必ず考慮すること。美唄市内でもスポット間は5〜20分程度かかる。宮島沼など市街地から離れた場所はさらにかかる
  - 各スポットの「所要時間の目安」を考慮して、滞在時間＋移動時間を足してリアルな時刻にする
  - 時刻が非現実的にならないこと（例: 前のスポットで60分滞在なのに次が10分後、などはNG）
- **description にはスポットごとの本文を書いてください**（100〜200文字程度/スポット）
  - なぜそこに行くのか（あなたの個人的なおすすめ理由）
  - 現地での楽しみ方のコツ
  - 小ネタ・裏話があれば
  - 時間帯の目安（「午前中」「昼すぎ」「夕方」くらいのざっくり感）
  - 語り口はカジュアルに、友達に話しかけるように
- **lat/lng は必須です。スポットデータにある座標をそのまま使ってください**
- スポットデータにない場所を入れた場合は、おおよその座標を入れてください（0や空にしないこと。美唄は lat:43.3付近, lng:141.9付近です）
- **photos はスポットデータに写真URLがある場合はそのまま配列で入れてください。なければ空配列 [] にしてください**
- mapUrl はスポットデータに Google Maps URL がある場合はそのまま使ってください。なければ省略してOK
- order はプランで訪問する順番です
- 出発地点（札幌駅周辺）は含めなくてOKです`;
}
