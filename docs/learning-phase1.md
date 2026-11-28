# ポータルの技術手順

表示・配置・運用の確定仕様は [portal-spec.md](portal-spec.md) を正本とする。元指示書・統合前の作業メモは [archive](archive/2026-11-28-original-briefs/README.md) に履歴保管している。

## ファイル構成

- `portal-data.json`：旧のカテゴリ/カード/支部切替設定。新側の実行先も再利用。
- `content/learning-catalog.json`：新3カテゴリ・納品済みテーマ・予告。
- `content/*-body.html`：確認済みの動画詳細本文。
- `scripts/build-learning.mjs`：静的HTML生成、パンくず・詳細型・基本システム共通プレイヤー部品。
- `new/`：新ポータルの入口・実行一覧・外部先への案内。
- `basics/`：Lrの基本・カテゴリ・動画詳細。
- `videos/`：固定名MP4。新旧から共通参照。
- `assets/`：CSS・再生/日報案内JS・動画ポスター。

## Codexが行うローカル確認

`node scripts/build-learning.mjs` でHTMLを生成し、`node --test tests/*.test.mjs` と `git diff --check` を実行する。`node scripts/preview.mjs` で `http://127.0.0.1:8794/lr-portal/` を開く。新トップは `/new/index.html`。

プレビューはGET/HEADとMP4 Rangeに対応し、サイトの必要な拡張子/パスだけを配信する。`.git` や `docs/` 等を配信しない。プレビュー停止時はCodexが起動し直す。localhostの待受けにネットワーク権限が必要な環境では必要範囲を申請する。

現行の9テストはカテゴリ地図/予告、生成ページのローカル素材・リンク解決、旧の廃止カード/並び順と残るカード、MP4範囲要求と非公開ファイル拒否、既存の支部別提出と切戻しを確認する。表示はスマホ幅でも確認する。

動画差し替えはファイル名とパスを維持し、実再生・所要時間・要点・料金や旧記載との一致を確認する。ポスターが変わる場合は同じパスへ更新。基本システムはクリックでdialog表示/再生、closeで停止する。日報の固定LIFFや署名entryを直接公開しない。

## 公開の境界

最終配信はGitHub Pages。公開ファイルの選別と現行mainとの差分確認を行い、承認された対象だけ反映する。新旧両方のローカルコードを一括pushすることを、旧だけの公開承認と同一視しない。Pagesの本番トップは `index.html`。

認証・動画受付・本人確認・承認・投稿は別repoの責務であり、この配備に含めない。公開画面の確認は無送信で行う。

## 旧だけを公開する配備

最新origin/mainを基点に別worktreeを作り、`node scripts/prepare-legacy-release.mjs <worktree>` で旧のindex/data、共有素材、3つの動画詳細、確定仕様/技術資料をコピーする。詳細の戻る/パンくずは旧トップにそろえる。新の `new/` とカテゴリ一覧/カテゴリページは配備対象外。ローカル新旧での共有素材は変えない。東京支部を含む最新の提出設定・コード・検査を保持する。

新ポータルは別のローカル試作として継続し、本番トップへの切替は別途判断する。公開前にはorigin/mainの進行、コピー対象、テスト、リンクと動画の範囲要求を確認する。
