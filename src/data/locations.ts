export type Language = 'en' | 'ru' | 'tg';

export interface WorldLocation {
  id: string;
  names: Record<Language, string>;
  kind: string;
  position: [number, number, number];
  color: string;
  size: [number, number, number];
}

export const locations: WorldLocation[] = [
  { id: 'school', names: { en: 'Sado Academy', ru: 'Академия Садо', tg: 'Академияи Садо' }, kind: 'education', position: [-10, 0, -7], color: '#b8a5ee', size: [5, 4.2, 4.4] },
  { id: 'market', names: { en: 'Old town market', ru: 'Старый рынок', tg: 'Бозори кӯҳна' }, kind: 'market', position: [8, 0, -7], color: '#f0a878', size: [5.5, 3.2, 4.5] },
  { id: 'home-west', names: { en: 'Courtyard homes', ru: 'Дворовые дома', tg: 'Ҳавлиҳои истиқоматӣ' }, kind: 'home', position: [-12, 0, 7], color: '#c79a79', size: [4, 3.4, 4] },
  { id: 'home-east', names: { en: 'Mountain homes', ru: 'Дома у гор', tg: 'Хонаҳои кӯҳӣ' }, kind: 'home', position: [12, 0, 7], color: '#d3b57d', size: [4.5, 3.8, 4] },
  { id: 'park', names: { en: 'Rudaki Park', ru: 'Парк Рудаки', tg: 'Боғи Рӯдакӣ' }, kind: 'park', position: [0, 0, 9], color: '#5d9b78', size: [7, 0.3, 5] },
];

export const labels: Record<Language, Record<string, string>> = {
  en: { world: 'Dushanbe, reimagined', subtitle: 'A living language-learning world', explore: 'Explore the world', locations: 'Places to visit', selected: 'Selected destination', command: 'Tell the world where to go…', send: 'Go', online: 'World online', offline: 'API offline', zoom: 'Drag to orbit · scroll to zoom', people: 'World population', phase: 'PHASE 01 · WORLD BUILDING', controls: 'WORLD CONTROLS', reset: 'Reset view', map: 'WORLD MAP', hint: 'Choose a destination on the map or give a text command.' },
  ru: { world: 'Душанбе, каким он может быть', subtitle: 'Живой мир для изучения языков', explore: 'Исследуйте мир', locations: 'Места для посещения', selected: 'Выбранное место', command: 'Укажите, куда отправиться…', send: 'Идти', online: 'Мир в сети', offline: 'API не в сети', zoom: 'Перетаскивайте · колесо — масштаб', people: 'Население мира', phase: 'ФАЗА 01 · СОЗДАНИЕ МИРА', controls: 'УПРАВЛЕНИЕ МИРОМ', reset: 'Сбросить вид', map: 'КАРТА МИРА', hint: 'Выберите место на карте или введите текстовую команду.' },
  tg: { world: 'Душанбе, аз нав тасаввуршуда', subtitle: 'Ҷаҳони зинда барои омӯзиши забон', explore: 'Ҷаҳонро кашф кунед', locations: 'Ҷойҳои диданӣ', selected: 'Самти интихобшуда', command: 'Ба ҷаҳон бигӯед, ки куҷо равад…', send: 'Рав', online: 'Ҷаҳон фаъол аст', offline: 'API дастнорас аст', zoom: 'Кашед · чархро гардонед барои наздиккунӣ', people: 'Аҳолии ҷаҳон', phase: 'МАРҲИЛАИ 01 · СОХТАНИ ҶАҲОН', controls: 'ИДОРАИ ҶАҲОН', reset: 'Бозсозии намо', map: 'ХАРИТАИ ҶАҲОН', hint: 'Дар харита ҷойро интихоб кунед ё фармони матнӣ диҳед.' },
};
