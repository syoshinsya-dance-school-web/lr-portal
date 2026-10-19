export const SAITAMA_VIDEO_URL = 'https://lr-video-automation-prod.lr-video-automation-worker.workers.dev/teacher';

/** Only the repository setting can switch the entry. URLs/query/storage never enable it. */
export function videoSubmissionItems(items, settings) {
  if (settings?.saitamaEnabled !== true) return items;
  return items.flatMap(item => item.id !== 't-2' ? [item] : [
    {id:'t-2-saitama',title:'【提出】埼玉のレッスン動画',desc:'登録したGoogleアカウントで提出・履歴確認',type:'link',url:SAITAMA_VIDEO_URL},
    {...item,title:'【提出】埼玉以外のレッスン動画',desc:'これまでの動画提出フォームを使う'},
  ]);
}
