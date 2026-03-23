/**
 * 토스 앱인토스 광고 ID 설정
 * TODO: 실제 광고 ID를 발급받은 후 여기에 입력
 */
export const AD_IDS = {
  /** 배너 광고 - 구독 목록 하단 */
  BANNER_LIST_BOTTOM: 'ait.v2.live.0dadca63b30c4c43',

  /** 전면 광고 (인터스티셜) - 구독 등록 시 */
  INTERSTITIAL_REGISTER: 'ait.v2.live.13b2a120f636413b',

  /** 리워드 광고 - 월세 분석 확인 시 */
  REWARD_INSIGHT: 'ait.v2.live.cfd55a2618ce440c',
} as const;

export type AdId = (typeof AD_IDS)[keyof typeof AD_IDS];
