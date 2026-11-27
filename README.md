# Lrportal

講師向けの静的リンク集。既存Googleフォーム/資料/動画への導線を管理する。動画の受付・本人確認・承認・投稿処理は別Repo `lr-video-automation` の責務で、このRepoへ複製しない。

今回の役割はオーナー/最終決定＝富田、PMO/実装＝Codex。認証・権限・本番等の重要な境界は独立監査の対象とし、実装者の確認と区別する。横断規約はAGENTS.mdを参照。

## 埼玉・大阪・東京の動画提出入口

`portal-data.json` の `videoSubmission.saitamaEnabled` / `osakaEnabled` / `tokyoEnabled` は **true**。埼玉・大阪・東京の先生を既存の動画提出ページへ案内する。

有効な支部だけを「埼玉・大阪・東京のレッスン動画」（本番Worker `/teacher` を別タブで開く、Googleログイン不要）へ案内し、「その他の支部のレッスン動画」は元のGoogleフォームを使う。dev/ステージングのURLを講師へ出さない。queryやlocalStorageからの切替は設けない。

AIが必要な確認を行うコマンド:

- `node --test tests/video-submission.test.mjs`：支部別切替・元フォーム/他導線の維持・切戻し。
- `node scripts/preview.mjs`：localhostで配信用JSONの状態を表示。`--saitama` は配信JSONを書換えず埼玉を追加有効化し、大阪設定を保持する。

大阪の本番適用・切戻し・講師向け案内文は[大阪の動画提出リンク切替](docs/osaka-video-cutover.md)。埼玉の初回切替記録は[動画提出導線](docs/saitama-video-cutover.md)。

東京の案内・切戻しは[東京の動画提出リンク切替](docs/tokyo-video-cutover.md)。
