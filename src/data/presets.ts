import type { BillingCycle, Currency } from '../types';

import chatgptLogo from '../assets/logos/chatgpt.png';
import claudeLogo from '../assets/logos/claude.png';
import geminiLogo from '../assets/logos/gemini.png';
import midjourneyLogo from '../assets/logos/midjourney.png';
import copilotLogo from '../assets/logos/copilot.png';
import cursorLogo from '../assets/logos/cursor.png';
import perplexityLogo from '../assets/logos/perplexity.png';
import notionLogo from '../assets/logos/notion.png';
import runwayLogo from '../assets/logos/runway.png';
import sunoLogo from '../assets/logos/suno.png';

export interface ServicePlan {
  id: string;
  name: string;
  price: number;
  currency: Currency;
  billingCycle: BillingCycle;
  highlight?: boolean;
  description?: string;
}

export interface PresetService {
  id: string;
  name: string;
  logoColor: string;
  logo: string;       // imported image path
  keywords: string[];
  plans: ServicePlan[];
}

export const PRESET_SERVICES: PresetService[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    logoColor: '#10A37F',
    logo: chatgptLogo,
    keywords: ['openai', 'gpt', 'chat', 'chatgpt'],
    plans: [
      { id: 'chatgpt-plus', name: 'Plus', price: 20, currency: 'USD', billingCycle: 'MONTHLY', highlight: true, description: 'GPT-4o 확장 접근, DALL-E, 고급 분석' },
      { id: 'chatgpt-team-m', name: 'Team (월간)', price: 30, currency: 'USD', billingCycle: 'MONTHLY', description: '팀 협업, 높은 사용량, 관리 콘솔' },
      { id: 'chatgpt-team-y', name: 'Team (연간)', price: 25, currency: 'USD', billingCycle: 'MONTHLY', description: '연간 결제 시 $25/월, 팀 협업' },
      { id: 'chatgpt-pro', name: 'Pro', price: 200, currency: 'USD', billingCycle: 'MONTHLY', description: 'o1 pro 모드 무제한, 최고 컴퓨팅' },
    ],
  },
  {
    id: 'claude',
    name: 'Claude',
    logoColor: '#D97757',
    logo: claudeLogo,
    keywords: ['anthropic', 'claude', 'sonnet', 'opus'],
    plans: [
      { id: 'claude-pro', name: 'Pro', price: 20, currency: 'USD', billingCycle: 'MONTHLY', highlight: true, description: '5배 사용량, 최신 모델 우선 접근' },
      { id: 'claude-team', name: 'Team', price: 25, currency: 'USD', billingCycle: 'MONTHLY', description: '팀 협업, 관리자 도구' },
      { id: 'claude-max-5x', name: 'Max 5x', price: 100, currency: 'USD', billingCycle: 'MONTHLY', description: 'Pro 대비 5배 사용량' },
      { id: 'claude-max-20x', name: 'Max 20x', price: 200, currency: 'USD', billingCycle: 'MONTHLY', description: 'Pro 대비 20배 사용량' },
    ],
  },
  {
    id: 'gemini',
    name: 'Google AI (Gemini)',
    logoColor: '#4285F4',
    logo: geminiLogo,
    keywords: ['google', 'gemini', 'bard', 'google one', 'google ai'],
    plans: [
      { id: 'google-ai-plus', name: 'AI Plus', price: 7.99, currency: 'USD', billingCycle: 'MONTHLY', description: '200 크레딧, Gemini Pro, 200GB 저장' },
      { id: 'google-ai-pro', name: 'AI Pro', price: 19.99, currency: 'USD', billingCycle: 'MONTHLY', highlight: true, description: '1,000 크레딧, 1M 토큰, 2TB, Workspace AI' },
      { id: 'google-ai-ultra', name: 'AI Ultra', price: 249.99, currency: 'USD', billingCycle: 'MONTHLY', description: '12,500 크레딧, Deep Think, Veo, 30TB' },
    ],
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    logoColor: '#000000',
    logo: midjourneyLogo,
    keywords: ['midjourney', 'image', 'art', 'mj'],
    plans: [
      { id: 'mj-basic-m', name: 'Basic', price: 10, currency: 'USD', billingCycle: 'MONTHLY', description: '약 200장/월, 제한적 GPU' },
      { id: 'mj-basic-y', name: 'Basic (연간)', price: 96, currency: 'USD', billingCycle: 'YEARLY', description: '연 $96 ($8/월)' },
      { id: 'mj-standard-m', name: 'Standard', price: 30, currency: 'USD', billingCycle: 'MONTHLY', highlight: true, description: '15h Fast + 무제한 Relax' },
      { id: 'mj-standard-y', name: 'Standard (연간)', price: 288, currency: 'USD', billingCycle: 'YEARLY', description: '연 $288 ($24/월)' },
      { id: 'mj-pro-m', name: 'Pro', price: 60, currency: 'USD', billingCycle: 'MONTHLY', description: '30h Fast + Stealth 모드' },
      { id: 'mj-pro-y', name: 'Pro (연간)', price: 576, currency: 'USD', billingCycle: 'YEARLY', description: '연 $576 ($48/월)' },
      { id: 'mj-mega-m', name: 'Mega', price: 120, currency: 'USD', billingCycle: 'MONTHLY', description: '60h Fast + Stealth 모드' },
      { id: 'mj-mega-y', name: 'Mega (연간)', price: 1152, currency: 'USD', billingCycle: 'YEARLY', description: '연 $1,152 ($96/월)' },
    ],
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    logoColor: '#24292E',
    logo: copilotLogo,
    keywords: ['github', 'copilot', 'code', 'coding'],
    plans: [
      { id: 'copilot-pro-m', name: 'Pro', price: 10, currency: 'USD', billingCycle: 'MONTHLY', highlight: true, description: '무제한 코드 완성, 채팅, CLI' },
      { id: 'copilot-pro-y', name: 'Pro (연간)', price: 100, currency: 'USD', billingCycle: 'YEARLY', description: '연 $100 ($8.33/월)' },
      { id: 'copilot-business', name: 'Business', price: 19, currency: 'USD', billingCycle: 'MONTHLY', description: '조직 관리, 정책 관리, IP 보호' },
      { id: 'copilot-enterprise', name: 'Enterprise', price: 39, currency: 'USD', billingCycle: 'MONTHLY', description: '코드베이스 맞춤화, SAML SSO' },
    ],
  },
  {
    id: 'cursor',
    name: 'Cursor',
    logoColor: '#7C3AED',
    logo: cursorLogo,
    keywords: ['cursor', 'code', 'editor', 'ide'],
    plans: [
      { id: 'cursor-pro-m', name: 'Pro', price: 20, currency: 'USD', billingCycle: 'MONTHLY', highlight: true, description: '월 500회 빠른 요청, 무제한 느린 요청' },
      { id: 'cursor-pro-y', name: 'Pro (연간)', price: 192, currency: 'USD', billingCycle: 'YEARLY', description: '연 $192 ($16/월)' },
      { id: 'cursor-business', name: 'Business', price: 40, currency: 'USD', billingCycle: 'MONTHLY', description: '중앙 관리, SAML SSO, 팀 기능' },
    ],
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    logoColor: '#20808D',
    logo: perplexityLogo,
    keywords: ['perplexity', 'search', 'ai search'],
    plans: [
      { id: 'perplexity-pro-m', name: 'Pro', price: 20, currency: 'USD', billingCycle: 'MONTHLY', highlight: true, description: '무제한 Pro Search, 파일 업로드' },
      { id: 'perplexity-pro-y', name: 'Pro (연간)', price: 200, currency: 'USD', billingCycle: 'YEARLY', description: '연 $200 ($16.67/월, 17% 할인)' },
    ],
  },
  {
    id: 'notion',
    name: 'Notion AI',
    logoColor: '#000000',
    logo: notionLogo,
    keywords: ['notion', 'note', 'writing', 'docs'],
    plans: [
      { id: 'notion-plus', name: 'Plus', price: 10, currency: 'USD', billingCycle: 'MONTHLY', description: '무제한 블록, 파일 업로드' },
      { id: 'notion-plus-y', name: 'Plus (연간)', price: 96, currency: 'USD', billingCycle: 'YEARLY', description: '연 $96 ($8/월)' },
      { id: 'notion-business', name: 'Business', price: 18, currency: 'USD', billingCycle: 'MONTHLY', highlight: true, description: 'SAML SSO, 고급 페이지 분석' },
      { id: 'notion-business-y', name: 'Business (연간)', price: 180, currency: 'USD', billingCycle: 'YEARLY', description: '연 $180 ($15/월)' },
      { id: 'notion-ai-addon', name: 'AI 애드온', price: 10, currency: 'USD', billingCycle: 'MONTHLY', description: 'AI 글쓰기, 요약, Q&A (인당 추가)' },
    ],
  },
  {
    id: 'runway',
    name: 'Runway',
    logoColor: '#6366F1',
    logo: runwayLogo,
    keywords: ['runway', 'video', 'gen'],
    plans: [
      { id: 'runway-standard-m', name: 'Standard', price: 12, currency: 'USD', billingCycle: 'MONTHLY', description: '월 625 크레딧, 비디오 생성' },
      { id: 'runway-standard-y', name: 'Standard (연간)', price: 144, currency: 'USD', billingCycle: 'YEARLY', description: '연 $144 ($12/월)' },
      { id: 'runway-pro-m', name: 'Pro', price: 28, currency: 'USD', billingCycle: 'MONTHLY', highlight: true, description: '월 2,250 크레딧, 워터마크 제거' },
      { id: 'runway-pro-y', name: 'Pro (연간)', price: 336, currency: 'USD', billingCycle: 'YEARLY', description: '연 $336 ($28/월)' },
      { id: 'runway-unlimited-m', name: 'Unlimited', price: 76, currency: 'USD', billingCycle: 'MONTHLY', description: '무제한 비디오 생성' },
      { id: 'runway-unlimited-y', name: 'Unlimited (연간)', price: 912, currency: 'USD', billingCycle: 'YEARLY', description: '연 $912 ($76/월)' },
    ],
  },
  {
    id: 'suno',
    name: 'Suno',
    logoColor: '#EF4444',
    logo: sunoLogo,
    keywords: ['suno', 'music', 'song'],
    plans: [
      { id: 'suno-pro-m', name: 'Pro', price: 10, currency: 'USD', billingCycle: 'MONTHLY', highlight: true, description: '월 2,500 크레딧, 상업적 사용 가능' },
      { id: 'suno-pro-y', name: 'Pro (연간)', price: 96, currency: 'USD', billingCycle: 'YEARLY', description: '연 $96 ($8/월)' },
      { id: 'suno-premier-m', name: 'Premier', price: 30, currency: 'USD', billingCycle: 'MONTHLY', description: '월 10,000 크레딧, 최우선 생성' },
      { id: 'suno-premier-y', name: 'Premier (연간)', price: 288, currency: 'USD', billingCycle: 'YEARLY', description: '연 $288 ($24/월)' },
    ],
  },
];

export const POPULAR_SERVICES = PRESET_SERVICES.slice(0, 4);

export function searchServices(query: string): PresetService[] {
  if (!query.trim()) return PRESET_SERVICES;
  const q = query.toLowerCase();
  return PRESET_SERVICES.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.keywords.some((k) => k.includes(q))
  );
}
