# Lrportal

講師向けの静的リンク集。既存Googleフォーム/資料/動画への導線を管理する。動画の受付・本人確認・承認・投稿処理は別Repo `lr-video-automation` の責務で、このRepoへ複製しない。

今回の役割はオーナー/最終決定＝富田、PMO/実装＝Codex。認証・権限・本番等の重要な境界は独立監査の対象とし、実装者の確認と区別する。横断規約はAGENTS.mdを参照。

## 埼玉の動画提出入口

`portal-data.json` の `videoSubmission.saitamaEnabled` は **false**。既存の「レッスン後の動画送信」1件をそのまま表示する。PR作成/pushで本番を有効化しない。

trueにすると、その1件だけを「埼玉のレッスン動画」（新しい本番Worker `/teacher` を別タブで開く）と「埼玉以外のレッスン動画」（元のGoogleフォーム）へ分ける。dev/ステージングのURLを講師へ出さない。queryやlocalStorageからの切替は設けない。

AIが必要な確認を行うコマンド:

- `node --test tests/video-submission.test.mjs`：切替・元フォーム/他導線の維持・切戻し。
- `node scripts/preview.mjs --saitama`：localhostだけで切替後を表示。配信用JSONはfalseのまま。

本番適用・停止・切戻しの操作範囲は[動画提出導線](docs/saitama-video-cutover.md)。
