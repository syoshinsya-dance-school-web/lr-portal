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

## 最新仕様・制作と納品

今後の仕様相談と実装は富田＋Codex、動画制作は制作AIが担当する。決定事項は [最新仕様](docs/portal-spec.md) に統合する。AI作業時は本READMEに続けて最新仕様と、対象に応じて [技術手順](docs/learning-phase1.md) を読む。元指示書は [履歴保管](docs/archive/2026-11-28-original-briefs/README.md) を参照し、最新指示として実行しない。

デスクトップの「Lrポータル改善案」は台本・動画・要点の納品場所。Codexが納品を確認し、新旧で共通の `videos/` に固定名で掲載する。最終配信はGitHub Pages。生徒向けの固定案内は講師用から分け、共有可能な同じMP4を参照する。公開用と非公開教材の範囲を区別する。

現在地と短い日報は共通スプレッドシート、富田向けの全体図はObsidian、確定コードと仕様はこのrepo。ローカル保存とGitHub反映を区別する。公開は指示された対象だけを反映する。
