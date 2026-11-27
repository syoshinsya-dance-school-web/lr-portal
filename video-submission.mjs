export const SAITAMA_VIDEO_URL = 'https://lr-video-automation-prod.lr-video-automation-worker.workers.dev/teacher';

/** Only the repository setting can switch the entry. URLs/query/storage never enable it. */
export function videoSubmissionItems(items, settings) {
  const branches = [settings?.saitamaEnabled === true && '埼玉', settings?.osakaEnabled === true && '大阪', settings?.tokyoEnabled === true && '東京'].filter(Boolean);
  if (!branches.length) return items;
  const names = branches.join('・');
  return items.flatMap(item => item.id !== 't-2' ? [item] : [
    {id:'t-2-saitama',title:`【提出】${names}のレッスン動画`,desc:'Googleログイン不要。支部・講師・担当クラスを選んで提出',type:'link',url:SAITAMA_VIDEO_URL},
    {...item,title:'【提出】その他の支部のレッスン動画',desc:`${names}以外は、これまでの動画提出フォームへ`},
  ]);
}
