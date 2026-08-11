import React, { useState, useEffect } from 'react';
import { storage } from './lib/storage';
import {
  Search, Home as HomeIcon, List, Settings as SettingsIcon, Heart, ChevronRight,
  Volume2, VolumeX, RotateCcw, User, CreditCard, Smartphone, Banknote,
  Check, ArrowLeft, Sandwich, Utensils, Trash2, Type, Eye, ClipboardCheck, Plus,
} from 'lucide-react';

/* ---------------------------------------------------------------
   콘텐츠 데이터: content-pipeline/brands/*.json 의 내용을 그대로 옮긴 것.
   (실제 앱에서는 이 객체 대신 그 JSON 파일들을 서버에서 fetch 해서 채운다)
--------------------------------------------------------------- */
const CONTENT = {
  subway: {
    store: { name: '서브웨이 강남점', sub: '도보 3분 · 키오스크 주문', icon: Sandwich, iconBg: '#0F6E56' },
    device: {
      shape: 'freestanding_totem', orientation: 'portrait',
      theme: { bg: '#F7F3EA', card: '#FFFFFF', accent: '#0F6E56', text: '#232E28', mute: '#8A9089' },
    },
    dining_options: { step_id: 'dining', type: 'binary_choice', title: '매장에서 드실 건가요, 포장하시겠어요?', voice_text: '매장에서 드실지 포장하실지 선택해주세요.',
      options: [{ option_id: 'dine_in', label: '매장에서 식사', price: 0 }, { option_id: 'takeaway', label: '포장', price: 0 }] },
    menu: { menu_id: 'subway_default_v1', categories: [
      { category_id: 'sandwiches', label: '샌드위치', items: [
        { item_id: 'egg_mayo', label: '에그마요', base_price: 6900, visual: 'bread', customize_steps: [
          { step_id: 'bread', type: 'single_select', priceMode: 'delta', visual: 'bread', title: '빵 종류를 선택하세요', voice_text: '먼저 빵 종류를 골라주세요.',
            options: [{ option_id: 'white', label: '화이트빵', price: 0 }, { option_id: 'wheat', label: '위트빵', price: 0 }, { option_id: 'parmesan_oregano', label: '파마산오레가노', price: 0 }, { option_id: 'honey_oat', label: '허니오트빵', price: 0 }, { option_id: 'grain', label: '그레인빵', price: 0 }, { option_id: 'flatbread', label: '플랫브레드', price: 0 }] },
          { step_id: 'bread_length', type: 'binary_choice', priceMode: 'delta', title: '빵 길이를 선택하세요', voice_text: '15센티인지 30센티인지 선택해주세요.',
            options: [{ option_id: '15cm', label: '15cm', price: 0 }, { option_id: '30cm', label: '30cm', price: 4000 }] },
          { step_id: 'cheese', type: 'single_select', priceMode: 'delta', title: '치즈를 선택하세요', voice_text: '치즈를 추가할지 선택해주세요.',
            options: [{ option_id: 'none', label: '없음', price: 0 }, { option_id: 'american', label: '아메리칸 치즈', price: 0 }, { option_id: 'shredded', label: '슈레드 치즈', price: 0 }, { option_id: 'mozzarella', label: '모차렐라 치즈', price: 0 }] },
          { step_id: 'extra_toppings', type: 'multi_select', priceMode: 'delta', required: false, title: '추가 토핑을 선택하세요', voice_text: '추가하고 싶은 토핑이 있으면 골라주세요. 추가 요금이 있어요.',
            options: [{ option_id: 'extra_meat', label: '미트 추가', price: 1500 }, { option_id: 'egg_mayo_topping', label: '에그마요 추가', price: 1000 }, { option_id: 'omelette', label: '오믈렛 추가', price: 1500 }] },
          { step_id: 'toast', type: 'binary_choice', priceMode: 'delta', title: '빵을 데워드릴까요?', voice_text: '빵을 따뜻하게 데워드릴지 선택해주세요.',
            options: [{ option_id: 'yes', label: '네, 데워주세요', price: 0 }, { option_id: 'no', label: '아니요', price: 0 }] },
          { step_id: 'vegetables', type: 'multi_select', priceMode: 'delta', visual: 'vegetable', required: false, title: '야채를 선택하세요', voice_text: '원하는 야채를 모두 골라주세요.',
            options: [{ option_id: 'lettuce', label: '양상추', price: 0 }, { option_id: 'tomato', label: '토마토', price: 0 }, { option_id: 'cucumber', label: '오이', price: 0 }, { option_id: 'bell_pepper', label: '피망/파프리카', price: 0 }, { option_id: 'onion', label: '양파', price: 0 }, { option_id: 'pickle', label: '피클', price: 0 }, { option_id: 'olive', label: '올리브', price: 0 }, { option_id: 'jalapeno', label: '할라피뇨', price: 0 }, { option_id: 'avocado', label: '아보카도', price: 0 }] },
          { step_id: 'sauce', type: 'multi_select', priceMode: 'delta', max_selections: 3, required: false, title: '소스를 선택하세요 (최대 3개 무료)', voice_text: '원하는 소스를 최대 3개까지 골라주세요.',
            options: [{ option_id: 'sweet_onion', label: '스위트어니언', price: 0 }, { option_id: 'mayo', label: '마요네즈', price: 0 }, { option_id: 'mustard', label: '허니 머스타드', price: 0 }, { option_id: 'sweet_chili', label: '스위트칠리', price: 0 }, { option_id: 'ranch', label: '랜치', price: 0 }, { option_id: 'onion_mayo', label: '어니언마요', price: 0 }, { option_id: 'hot_chili', label: '핫칠리', price: 0 }, { option_id: 'plain_mustard', label: '플레인 머스타드', price: 0 }, { option_id: 'ketchup', label: '케찹', price: 0 }, { option_id: 'sw_chipotle', label: '사우스웨스트 치폴레', price: 0 }, { option_id: 'oil_vinegar', label: '오일&비네거', price: 0 }, { option_id: 'bbq', label: '바베큐', price: 0 }, { option_id: 'italian', label: '이탈리안', price: 0 }, { option_id: 'sriracha', label: '스리라차', price: 0 }, { option_id: 'garlic', label: '갈릭', price: 0 }] },
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '단품으로 드릴까요, 세트로 드릴까요?', voice_text: '단품인지 세트인지 선택해주세요.',
            options: [{ option_id: 'single', label: '단품', price: 0 }, { option_id: 'set', label: '세트', price: 0 }] },
          { step_id: 'included_side', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' }, title: '세트 사이드를 선택하세요', voice_text: '세트에 포함될 사이드를 선택해주세요.',
            options: [{ option_id: 'cookie_chip', label: '쿠키/칩', price: 2500 }, { option_id: 'wedge_potato', label: '웨지포테이토', price: 3100 }] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' }, title: '세트 음료를 선택하세요', voice_text: '세트에 포함될 음료를 선택해주세요.',
            options: [{ option_id: 'coke', label: '코카콜라', price: 0 }, { option_id: 'sprite', label: '스프라이트', price: 0 }, { option_id: 'ice_tea', label: '아이스티', price: 300 }] },
        ] },
        { item_id: 'tuna', label: '참치', base_price: 7900, visual: 'bread', customize_steps: [
          { step_id: 'bread', type: 'single_select', priceMode: 'delta', visual: 'bread', title: '빵 종류를 선택하세요', voice_text: '먼저 빵 종류를 골라주세요.',
            options: [{ option_id: 'white', label: '화이트빵', price: 0 }, { option_id: 'wheat', label: '위트빵', price: 0 }, { option_id: 'parmesan_oregano', label: '파마산오레가노', price: 0 }, { option_id: 'honey_oat', label: '허니오트빵', price: 0 }, { option_id: 'grain', label: '그레인빵', price: 0 }, { option_id: 'flatbread', label: '플랫브레드', price: 0 }] },
          { step_id: 'bread_length', type: 'binary_choice', priceMode: 'delta', title: '빵 길이를 선택하세요', voice_text: '15센티인지 30센티인지 선택해주세요.',
            options: [{ option_id: '15cm', label: '15cm', price: 0 }, { option_id: '30cm', label: '30cm', price: 4000 }] },
          { step_id: 'cheese', type: 'single_select', priceMode: 'delta', title: '치즈를 선택하세요', voice_text: '치즈를 추가할지 선택해주세요.',
            options: [{ option_id: 'none', label: '없음', price: 0 }, { option_id: 'american', label: '아메리칸 치즈', price: 0 }, { option_id: 'shredded', label: '슈레드 치즈', price: 0 }, { option_id: 'mozzarella', label: '모차렐라 치즈', price: 0 }] },
          { step_id: 'extra_toppings', type: 'multi_select', priceMode: 'delta', required: false, title: '추가 토핑을 선택하세요', voice_text: '추가하고 싶은 토핑이 있으면 골라주세요. 추가 요금이 있어요.',
            options: [{ option_id: 'extra_meat', label: '미트 추가', price: 1500 }, { option_id: 'egg_mayo_topping', label: '에그마요 추가', price: 1000 }, { option_id: 'omelette', label: '오믈렛 추가', price: 1500 }] },
          { step_id: 'toast', type: 'binary_choice', priceMode: 'delta', title: '빵을 데워드릴까요?', voice_text: '빵을 따뜻하게 데워드릴지 선택해주세요.',
            options: [{ option_id: 'yes', label: '네, 데워주세요', price: 0 }, { option_id: 'no', label: '아니요', price: 0 }] },
          { step_id: 'vegetables', type: 'multi_select', priceMode: 'delta', visual: 'vegetable', required: false, title: '야채를 선택하세요', voice_text: '원하는 야채를 모두 골라주세요.',
            options: [{ option_id: 'lettuce', label: '양상추', price: 0 }, { option_id: 'tomato', label: '토마토', price: 0 }, { option_id: 'cucumber', label: '오이', price: 0 }, { option_id: 'bell_pepper', label: '피망/파프리카', price: 0 }, { option_id: 'onion', label: '양파', price: 0 }, { option_id: 'pickle', label: '피클', price: 0 }, { option_id: 'olive', label: '올리브', price: 0 }, { option_id: 'jalapeno', label: '할라피뇨', price: 0 }, { option_id: 'avocado', label: '아보카도', price: 0 }] },
          { step_id: 'sauce', type: 'multi_select', priceMode: 'delta', max_selections: 3, required: false, title: '소스를 선택하세요 (최대 3개 무료)', voice_text: '원하는 소스를 최대 3개까지 골라주세요.',
            options: [{ option_id: 'sweet_onion', label: '스위트어니언', price: 0 }, { option_id: 'mayo', label: '마요네즈', price: 0 }, { option_id: 'mustard', label: '허니 머스타드', price: 0 }, { option_id: 'sweet_chili', label: '스위트칠리', price: 0 }, { option_id: 'ranch', label: '랜치', price: 0 }, { option_id: 'onion_mayo', label: '어니언마요', price: 0 }, { option_id: 'hot_chili', label: '핫칠리', price: 0 }, { option_id: 'plain_mustard', label: '플레인 머스타드', price: 0 }, { option_id: 'ketchup', label: '케찹', price: 0 }, { option_id: 'sw_chipotle', label: '사우스웨스트 치폴레', price: 0 }, { option_id: 'oil_vinegar', label: '오일&비네거', price: 0 }, { option_id: 'bbq', label: '바베큐', price: 0 }, { option_id: 'italian', label: '이탈리안', price: 0 }, { option_id: 'sriracha', label: '스리라차', price: 0 }, { option_id: 'garlic', label: '갈릭', price: 0 }] },
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '단품으로 드릴까요, 세트로 드릴까요?', voice_text: '단품인지 세트인지 선택해주세요.',
            options: [{ option_id: 'single', label: '단품', price: 0 }, { option_id: 'set', label: '세트', price: 0 }] },
          { step_id: 'included_side', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' }, title: '세트 사이드를 선택하세요', voice_text: '세트에 포함될 사이드를 선택해주세요.',
            options: [{ option_id: 'cookie_chip', label: '쿠키/칩', price: 2500 }, { option_id: 'wedge_potato', label: '웨지포테이토', price: 3100 }] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' }, title: '세트 음료를 선택하세요', voice_text: '세트에 포함될 음료를 선택해주세요.',
            options: [{ option_id: 'coke', label: '코카콜라', price: 0 }, { option_id: 'sprite', label: '스프라이트', price: 0 }, { option_id: 'ice_tea', label: '아이스티', price: 300 }] },
        ] },
        { item_id: 'meatball_marinara', label: '미트볼 마리나라', base_price: 7900, visual: 'bread', customize_steps: [
          { step_id: 'bread', type: 'single_select', priceMode: 'delta', visual: 'bread', title: '빵 종류를 선택하세요', voice_text: '먼저 빵 종류를 골라주세요.',
            options: [{ option_id: 'white', label: '화이트빵', price: 0 }, { option_id: 'wheat', label: '위트빵', price: 0 }, { option_id: 'parmesan_oregano', label: '파마산오레가노', price: 0 }, { option_id: 'honey_oat', label: '허니오트빵', price: 0 }, { option_id: 'grain', label: '그레인빵', price: 0 }, { option_id: 'flatbread', label: '플랫브레드', price: 0 }] },
          { step_id: 'bread_length', type: 'binary_choice', priceMode: 'delta', title: '빵 길이를 선택하세요', voice_text: '15센티인지 30센티인지 선택해주세요.',
            options: [{ option_id: '15cm', label: '15cm', price: 0 }, { option_id: '30cm', label: '30cm', price: 4000 }] },
          { step_id: 'cheese', type: 'single_select', priceMode: 'delta', title: '치즈를 선택하세요', voice_text: '치즈를 추가할지 선택해주세요.',
            options: [{ option_id: 'none', label: '없음', price: 0 }, { option_id: 'american', label: '아메리칸 치즈', price: 0 }, { option_id: 'shredded', label: '슈레드 치즈', price: 0 }, { option_id: 'mozzarella', label: '모차렐라 치즈', price: 0 }] },
          { step_id: 'extra_toppings', type: 'multi_select', priceMode: 'delta', required: false, title: '추가 토핑을 선택하세요', voice_text: '추가하고 싶은 토핑이 있으면 골라주세요. 추가 요금이 있어요.',
            options: [{ option_id: 'extra_meat', label: '미트 추가', price: 1500 }, { option_id: 'egg_mayo_topping', label: '에그마요 추가', price: 1000 }, { option_id: 'omelette', label: '오믈렛 추가', price: 1500 }] },
          { step_id: 'toast', type: 'binary_choice', priceMode: 'delta', title: '빵을 데워드릴까요?', voice_text: '빵을 따뜻하게 데워드릴지 선택해주세요.',
            options: [{ option_id: 'yes', label: '네, 데워주세요', price: 0 }, { option_id: 'no', label: '아니요', price: 0 }] },
          { step_id: 'vegetables', type: 'multi_select', priceMode: 'delta', visual: 'vegetable', required: false, title: '야채를 선택하세요', voice_text: '원하는 야채를 모두 골라주세요.',
            options: [{ option_id: 'lettuce', label: '양상추', price: 0 }, { option_id: 'tomato', label: '토마토', price: 0 }, { option_id: 'cucumber', label: '오이', price: 0 }, { option_id: 'bell_pepper', label: '피망/파프리카', price: 0 }, { option_id: 'onion', label: '양파', price: 0 }, { option_id: 'pickle', label: '피클', price: 0 }, { option_id: 'olive', label: '올리브', price: 0 }, { option_id: 'jalapeno', label: '할라피뇨', price: 0 }, { option_id: 'avocado', label: '아보카도', price: 0 }] },
          { step_id: 'sauce', type: 'multi_select', priceMode: 'delta', max_selections: 3, required: false, title: '소스를 선택하세요 (최대 3개 무료)', voice_text: '원하는 소스를 최대 3개까지 골라주세요.',
            options: [{ option_id: 'sweet_onion', label: '스위트어니언', price: 0 }, { option_id: 'mayo', label: '마요네즈', price: 0 }, { option_id: 'mustard', label: '허니 머스타드', price: 0 }, { option_id: 'sweet_chili', label: '스위트칠리', price: 0 }, { option_id: 'ranch', label: '랜치', price: 0 }, { option_id: 'onion_mayo', label: '어니언마요', price: 0 }, { option_id: 'hot_chili', label: '핫칠리', price: 0 }, { option_id: 'plain_mustard', label: '플레인 머스타드', price: 0 }, { option_id: 'ketchup', label: '케찹', price: 0 }, { option_id: 'sw_chipotle', label: '사우스웨스트 치폴레', price: 0 }, { option_id: 'oil_vinegar', label: '오일&비네거', price: 0 }, { option_id: 'bbq', label: '바베큐', price: 0 }, { option_id: 'italian', label: '이탈리안', price: 0 }, { option_id: 'sriracha', label: '스리라차', price: 0 }, { option_id: 'garlic', label: '갈릭', price: 0 }] },
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '단품으로 드릴까요, 세트로 드릴까요?', voice_text: '단품인지 세트인지 선택해주세요.',
            options: [{ option_id: 'single', label: '단품', price: 0 }, { option_id: 'set', label: '세트', price: 0 }] },
          { step_id: 'included_side', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' }, title: '세트 사이드를 선택하세요', voice_text: '세트에 포함될 사이드를 선택해주세요.',
            options: [{ option_id: 'cookie_chip', label: '쿠키/칩', price: 2500 }, { option_id: 'wedge_potato', label: '웨지포테이토', price: 3100 }] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' }, title: '세트 음료를 선택하세요', voice_text: '세트에 포함될 음료를 선택해주세요.',
            options: [{ option_id: 'coke', label: '코카콜라', price: 0 }, { option_id: 'sprite', label: '스프라이트', price: 0 }, { option_id: 'ice_tea', label: '아이스티', price: 300 }] },
        ] },
        { item_id: 'turkey_breast', label: '터키 브레스트', base_price: 7900, visual: 'bread', customize_steps: [
          { step_id: 'bread', type: 'single_select', priceMode: 'delta', visual: 'bread', title: '빵 종류를 선택하세요', voice_text: '먼저 빵 종류를 골라주세요.',
            options: [{ option_id: 'white', label: '화이트빵', price: 0 }, { option_id: 'wheat', label: '위트빵', price: 0 }, { option_id: 'parmesan_oregano', label: '파마산오레가노', price: 0 }, { option_id: 'honey_oat', label: '허니오트빵', price: 0 }, { option_id: 'grain', label: '그레인빵', price: 0 }, { option_id: 'flatbread', label: '플랫브레드', price: 0 }] },
          { step_id: 'bread_length', type: 'binary_choice', priceMode: 'delta', title: '빵 길이를 선택하세요', voice_text: '15센티인지 30센티인지 선택해주세요.',
            options: [{ option_id: '15cm', label: '15cm', price: 0 }, { option_id: '30cm', label: '30cm', price: 4000 }] },
          { step_id: 'cheese', type: 'single_select', priceMode: 'delta', title: '치즈를 선택하세요', voice_text: '치즈를 추가할지 선택해주세요.',
            options: [{ option_id: 'none', label: '없음', price: 0 }, { option_id: 'american', label: '아메리칸 치즈', price: 0 }, { option_id: 'shredded', label: '슈레드 치즈', price: 0 }, { option_id: 'mozzarella', label: '모차렐라 치즈', price: 0 }] },
          { step_id: 'extra_toppings', type: 'multi_select', priceMode: 'delta', required: false, title: '추가 토핑을 선택하세요', voice_text: '추가하고 싶은 토핑이 있으면 골라주세요. 추가 요금이 있어요.',
            options: [{ option_id: 'extra_meat', label: '미트 추가', price: 1500 }, { option_id: 'egg_mayo_topping', label: '에그마요 추가', price: 1000 }, { option_id: 'omelette', label: '오믈렛 추가', price: 1500 }] },
          { step_id: 'toast', type: 'binary_choice', priceMode: 'delta', title: '빵을 데워드릴까요?', voice_text: '빵을 따뜻하게 데워드릴지 선택해주세요.',
            options: [{ option_id: 'yes', label: '네, 데워주세요', price: 0 }, { option_id: 'no', label: '아니요', price: 0 }] },
          { step_id: 'vegetables', type: 'multi_select', priceMode: 'delta', visual: 'vegetable', required: false, title: '야채를 선택하세요', voice_text: '원하는 야채를 모두 골라주세요.',
            options: [{ option_id: 'lettuce', label: '양상추', price: 0 }, { option_id: 'tomato', label: '토마토', price: 0 }, { option_id: 'cucumber', label: '오이', price: 0 }, { option_id: 'bell_pepper', label: '피망/파프리카', price: 0 }, { option_id: 'onion', label: '양파', price: 0 }, { option_id: 'pickle', label: '피클', price: 0 }, { option_id: 'olive', label: '올리브', price: 0 }, { option_id: 'jalapeno', label: '할라피뇨', price: 0 }, { option_id: 'avocado', label: '아보카도', price: 0 }] },
          { step_id: 'sauce', type: 'multi_select', priceMode: 'delta', max_selections: 3, required: false, title: '소스를 선택하세요 (최대 3개 무료)', voice_text: '원하는 소스를 최대 3개까지 골라주세요.',
            options: [{ option_id: 'sweet_onion', label: '스위트어니언', price: 0 }, { option_id: 'mayo', label: '마요네즈', price: 0 }, { option_id: 'mustard', label: '허니 머스타드', price: 0 }, { option_id: 'sweet_chili', label: '스위트칠리', price: 0 }, { option_id: 'ranch', label: '랜치', price: 0 }, { option_id: 'onion_mayo', label: '어니언마요', price: 0 }, { option_id: 'hot_chili', label: '핫칠리', price: 0 }, { option_id: 'plain_mustard', label: '플레인 머스타드', price: 0 }, { option_id: 'ketchup', label: '케찹', price: 0 }, { option_id: 'sw_chipotle', label: '사우스웨스트 치폴레', price: 0 }, { option_id: 'oil_vinegar', label: '오일&비네거', price: 0 }, { option_id: 'bbq', label: '바베큐', price: 0 }, { option_id: 'italian', label: '이탈리안', price: 0 }, { option_id: 'sriracha', label: '스리라차', price: 0 }, { option_id: 'garlic', label: '갈릭', price: 0 }] },
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '단품으로 드릴까요, 세트로 드릴까요?', voice_text: '단품인지 세트인지 선택해주세요.',
            options: [{ option_id: 'single', label: '단품', price: 0 }, { option_id: 'set', label: '세트', price: 0 }] },
          { step_id: 'included_side', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' }, title: '세트 사이드를 선택하세요', voice_text: '세트에 포함될 사이드를 선택해주세요.',
            options: [{ option_id: 'cookie_chip', label: '쿠키/칩', price: 2500 }, { option_id: 'wedge_potato', label: '웨지포테이토', price: 3100 }] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' }, title: '세트 음료를 선택하세요', voice_text: '세트에 포함될 음료를 선택해주세요.',
            options: [{ option_id: 'coke', label: '코카콜라', price: 0 }, { option_id: 'sprite', label: '스프라이트', price: 0 }, { option_id: 'ice_tea', label: '아이스티', price: 300 }] },
        ] },
        { item_id: 'italian_bmt', label: '이탈리안 비엠티', base_price: 8900, visual: 'bread', customize_steps: [
          { step_id: 'bread', type: 'single_select', priceMode: 'delta', visual: 'bread', title: '빵 종류를 선택하세요', voice_text: '먼저 빵 종류를 골라주세요.',
            options: [{ option_id: 'white', label: '화이트빵', price: 0 }, { option_id: 'wheat', label: '위트빵', price: 0 }, { option_id: 'parmesan_oregano', label: '파마산오레가노', price: 0 }, { option_id: 'honey_oat', label: '허니오트빵', price: 0 }, { option_id: 'grain', label: '그레인빵', price: 0 }, { option_id: 'flatbread', label: '플랫브레드', price: 0 }] },
          { step_id: 'bread_length', type: 'binary_choice', priceMode: 'delta', title: '빵 길이를 선택하세요', voice_text: '15센티인지 30센티인지 선택해주세요.',
            options: [{ option_id: '15cm', label: '15cm', price: 0 }, { option_id: '30cm', label: '30cm', price: 4000 }] },
          { step_id: 'cheese', type: 'single_select', priceMode: 'delta', title: '치즈를 선택하세요', voice_text: '치즈를 추가할지 선택해주세요.',
            options: [{ option_id: 'none', label: '없음', price: 0 }, { option_id: 'american', label: '아메리칸 치즈', price: 0 }, { option_id: 'shredded', label: '슈레드 치즈', price: 0 }, { option_id: 'mozzarella', label: '모차렐라 치즈', price: 0 }] },
          { step_id: 'extra_toppings', type: 'multi_select', priceMode: 'delta', required: false, title: '추가 토핑을 선택하세요', voice_text: '추가하고 싶은 토핑이 있으면 골라주세요. 추가 요금이 있어요.',
            options: [{ option_id: 'extra_meat', label: '미트 추가', price: 1500 }, { option_id: 'egg_mayo_topping', label: '에그마요 추가', price: 1000 }, { option_id: 'omelette', label: '오믈렛 추가', price: 1500 }] },
          { step_id: 'toast', type: 'binary_choice', priceMode: 'delta', title: '빵을 데워드릴까요?', voice_text: '빵을 따뜻하게 데워드릴지 선택해주세요.',
            options: [{ option_id: 'yes', label: '네, 데워주세요', price: 0 }, { option_id: 'no', label: '아니요', price: 0 }] },
          { step_id: 'vegetables', type: 'multi_select', priceMode: 'delta', visual: 'vegetable', required: false, title: '야채를 선택하세요', voice_text: '원하는 야채를 모두 골라주세요.',
            options: [{ option_id: 'lettuce', label: '양상추', price: 0 }, { option_id: 'tomato', label: '토마토', price: 0 }, { option_id: 'cucumber', label: '오이', price: 0 }, { option_id: 'bell_pepper', label: '피망/파프리카', price: 0 }, { option_id: 'onion', label: '양파', price: 0 }, { option_id: 'pickle', label: '피클', price: 0 }, { option_id: 'olive', label: '올리브', price: 0 }, { option_id: 'jalapeno', label: '할라피뇨', price: 0 }, { option_id: 'avocado', label: '아보카도', price: 0 }] },
          { step_id: 'sauce', type: 'multi_select', priceMode: 'delta', max_selections: 3, required: false, title: '소스를 선택하세요 (최대 3개 무료)', voice_text: '원하는 소스를 최대 3개까지 골라주세요.',
            options: [{ option_id: 'sweet_onion', label: '스위트어니언', price: 0 }, { option_id: 'mayo', label: '마요네즈', price: 0 }, { option_id: 'mustard', label: '허니 머스타드', price: 0 }, { option_id: 'sweet_chili', label: '스위트칠리', price: 0 }, { option_id: 'ranch', label: '랜치', price: 0 }, { option_id: 'onion_mayo', label: '어니언마요', price: 0 }, { option_id: 'hot_chili', label: '핫칠리', price: 0 }, { option_id: 'plain_mustard', label: '플레인 머스타드', price: 0 }, { option_id: 'ketchup', label: '케찹', price: 0 }, { option_id: 'sw_chipotle', label: '사우스웨스트 치폴레', price: 0 }, { option_id: 'oil_vinegar', label: '오일&비네거', price: 0 }, { option_id: 'bbq', label: '바베큐', price: 0 }, { option_id: 'italian', label: '이탈리안', price: 0 }, { option_id: 'sriracha', label: '스리라차', price: 0 }, { option_id: 'garlic', label: '갈릭', price: 0 }] },
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '단품으로 드릴까요, 세트로 드릴까요?', voice_text: '단품인지 세트인지 선택해주세요.',
            options: [{ option_id: 'single', label: '단품', price: 0 }, { option_id: 'set', label: '세트', price: 0 }] },
          { step_id: 'included_side', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' }, title: '세트 사이드를 선택하세요', voice_text: '세트에 포함될 사이드를 선택해주세요.',
            options: [{ option_id: 'cookie_chip', label: '쿠키/칩', price: 2500 }, { option_id: 'wedge_potato', label: '웨지포테이토', price: 3100 }] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' }, title: '세트 음료를 선택하세요', voice_text: '세트에 포함될 음료를 선택해주세요.',
            options: [{ option_id: 'coke', label: '코카콜라', price: 0 }, { option_id: 'sprite', label: '스프라이트', price: 0 }, { option_id: 'ice_tea', label: '아이스티', price: 300 }] },
        ] },
        { item_id: 'subway_club', label: '서브웨이 클럽', base_price: 8900, visual: 'bread', customize_steps: [
          { step_id: 'bread', type: 'single_select', priceMode: 'delta', visual: 'bread', title: '빵 종류를 선택하세요', voice_text: '먼저 빵 종류를 골라주세요.',
            options: [{ option_id: 'white', label: '화이트빵', price: 0 }, { option_id: 'wheat', label: '위트빵', price: 0 }, { option_id: 'parmesan_oregano', label: '파마산오레가노', price: 0 }, { option_id: 'honey_oat', label: '허니오트빵', price: 0 }, { option_id: 'grain', label: '그레인빵', price: 0 }, { option_id: 'flatbread', label: '플랫브레드', price: 0 }] },
          { step_id: 'bread_length', type: 'binary_choice', priceMode: 'delta', title: '빵 길이를 선택하세요', voice_text: '15센티인지 30센티인지 선택해주세요.',
            options: [{ option_id: '15cm', label: '15cm', price: 0 }, { option_id: '30cm', label: '30cm', price: 4000 }] },
          { step_id: 'cheese', type: 'single_select', priceMode: 'delta', title: '치즈를 선택하세요', voice_text: '치즈를 추가할지 선택해주세요.',
            options: [{ option_id: 'none', label: '없음', price: 0 }, { option_id: 'american', label: '아메리칸 치즈', price: 0 }, { option_id: 'shredded', label: '슈레드 치즈', price: 0 }, { option_id: 'mozzarella', label: '모차렐라 치즈', price: 0 }] },
          { step_id: 'extra_toppings', type: 'multi_select', priceMode: 'delta', required: false, title: '추가 토핑을 선택하세요', voice_text: '추가하고 싶은 토핑이 있으면 골라주세요. 추가 요금이 있어요.',
            options: [{ option_id: 'extra_meat', label: '미트 추가', price: 1500 }, { option_id: 'egg_mayo_topping', label: '에그마요 추가', price: 1000 }, { option_id: 'omelette', label: '오믈렛 추가', price: 1500 }] },
          { step_id: 'toast', type: 'binary_choice', priceMode: 'delta', title: '빵을 데워드릴까요?', voice_text: '빵을 따뜻하게 데워드릴지 선택해주세요.',
            options: [{ option_id: 'yes', label: '네, 데워주세요', price: 0 }, { option_id: 'no', label: '아니요', price: 0 }] },
          { step_id: 'vegetables', type: 'multi_select', priceMode: 'delta', visual: 'vegetable', required: false, title: '야채를 선택하세요', voice_text: '원하는 야채를 모두 골라주세요.',
            options: [{ option_id: 'lettuce', label: '양상추', price: 0 }, { option_id: 'tomato', label: '토마토', price: 0 }, { option_id: 'cucumber', label: '오이', price: 0 }, { option_id: 'bell_pepper', label: '피망/파프리카', price: 0 }, { option_id: 'onion', label: '양파', price: 0 }, { option_id: 'pickle', label: '피클', price: 0 }, { option_id: 'olive', label: '올리브', price: 0 }, { option_id: 'jalapeno', label: '할라피뇨', price: 0 }, { option_id: 'avocado', label: '아보카도', price: 0 }] },
          { step_id: 'sauce', type: 'multi_select', priceMode: 'delta', max_selections: 3, required: false, title: '소스를 선택하세요 (최대 3개 무료)', voice_text: '원하는 소스를 최대 3개까지 골라주세요.',
            options: [{ option_id: 'sweet_onion', label: '스위트어니언', price: 0 }, { option_id: 'mayo', label: '마요네즈', price: 0 }, { option_id: 'mustard', label: '허니 머스타드', price: 0 }, { option_id: 'sweet_chili', label: '스위트칠리', price: 0 }, { option_id: 'ranch', label: '랜치', price: 0 }, { option_id: 'onion_mayo', label: '어니언마요', price: 0 }, { option_id: 'hot_chili', label: '핫칠리', price: 0 }, { option_id: 'plain_mustard', label: '플레인 머스타드', price: 0 }, { option_id: 'ketchup', label: '케찹', price: 0 }, { option_id: 'sw_chipotle', label: '사우스웨스트 치폴레', price: 0 }, { option_id: 'oil_vinegar', label: '오일&비네거', price: 0 }, { option_id: 'bbq', label: '바베큐', price: 0 }, { option_id: 'italian', label: '이탈리안', price: 0 }, { option_id: 'sriracha', label: '스리라차', price: 0 }, { option_id: 'garlic', label: '갈릭', price: 0 }] },
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '단품으로 드릴까요, 세트로 드릴까요?', voice_text: '단품인지 세트인지 선택해주세요.',
            options: [{ option_id: 'single', label: '단품', price: 0 }, { option_id: 'set', label: '세트', price: 0 }] },
          { step_id: 'included_side', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' }, title: '세트 사이드를 선택하세요', voice_text: '세트에 포함될 사이드를 선택해주세요.',
            options: [{ option_id: 'cookie_chip', label: '쿠키/칩', price: 2500 }, { option_id: 'wedge_potato', label: '웨지포테이토', price: 3100 }] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' }, title: '세트 음료를 선택하세요', voice_text: '세트에 포함될 음료를 선택해주세요.',
            options: [{ option_id: 'coke', label: '코카콜라', price: 0 }, { option_id: 'sprite', label: '스프라이트', price: 0 }, { option_id: 'ice_tea', label: '아이스티', price: 300 }] },
        ] },
      ] },
      { category_id: 'drinks', label: '음료', items: [
        { item_id: 'coke_standalone', label: '코카콜라', base_price: 2500, visual: 'drink', customize_steps: [] },
        { item_id: 'sprite_standalone', label: '스프라이트', base_price: 2500, visual: 'drink', customize_steps: [] },
        { item_id: 'ice_tea_standalone', label: '아이스티', base_price: 2800, visual: 'drink', customize_steps: [] },
      ] },
    ] },
    order_steps: [
      { step_id: 'confirm_order', type: 'confirm', title: '선택하신 내용을 확인해주세요', voice_text: '지금까지 고르신 내용이 맞는지 확인해주세요.' },
      { step_id: 'payment', type: 'payment_mock', title: '결제 방법을 선택하세요', voice_text: '결제 방법을 선택해주세요.',
        options: [{ option_id: 'card', label: '카드 삽입', icon: 'card' }, { option_id: 'phone', label: '휴대폰 태그', icon: 'phone' }, { option_id: 'cash', label: '현금', icon: 'cash' }] },
    ],
  },
  burgerking: {
    store: { name: '버거킹 홍대점', sub: '도보 5분 · 키오스크 주문', icon: Utensils, iconBg: '#C1502B' },
    device: {
      shape: 'countertop_tablet', orientation: 'landscape',
      theme: { bg: '#241B17', card: '#332822', accent: '#E4592D', text: '#FFFFFF', mute: '#B9ACA5' },
    },
    dining_options: { step_id: 'dining', type: 'binary_choice', title: '매장에서 드실 건가요, 포장하시겠어요?', voice_text: '매장에서 드실지 포장하실지 선택해주세요.',
      options: [{ option_id: 'dine_in', label: '매장에서 식사', price: 0 }, { option_id: 'takeaway', label: '포장', price: 0 }] },
    menu: { menu_id: 'burgerking_default_v1', categories: [
      { category_id: 'burgers', label: '버거', items: [
        { item_id: 'whopper', label: '와퍼', base_price: 7900, visual: 'burger', customize_steps: [
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '단품과 세트 중 골라주세요.',
            options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 2000 }, { option_id: 'single', label: '아니요, 단품으로', price: 0 }] },
          { step_id: 'included_side', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 사이드를 선택하세요', voice_text: '세트에 포함된 사이드를 골라주세요.',
            options: [
              { option_id: 'fries', label: '프렌치프라이', price: 0 },
              { option_id: 'cheese_sticks', label: '치즈스틱', price: 0 },
              { option_id: 'nugget_king_3', label: '너겟킹 3조각', price: 0 },
              { option_id: 'corn_salad', label: '콘샐러드', price: 0 },
              { option_id: 'coleslaw', label: '코울슬로', price: 0 },
              { option_id: 'onion_rings', label: '어니언링', price: 300 },
              { option_id: 'nugget_king_4', label: '너겟킹 4조각', price: 300 },
              { option_id: 'cheese_fries', label: '치즈프라이', price: 900 },
              { option_id: 'fries_large', label: '프렌치프라이(L)', price: 500 },
            ] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', visual: 'drink', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 음료를 선택하세요', voice_text: '세트에 포함된 음료를 골라주세요.',
            options: [
              { option_id: 'coke', label: '코카콜라', price: 0 },
              { option_id: 'americano', label: '아메리카노', price: 0 },
              { option_id: 'choco', label: '초코', price: 300 },
              { option_id: 'zero_toktok', label: '제로톡톡', price: 300 },
              { option_id: 'minute_maid', label: '미닛메이드', price: 900 },
            ] },
          { step_id: 'set_size', type: 'binary_choice', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 사이즈를 선택하세요', voice_text: '세트를 라지로 업그레이드하시겠어요?',
            options: [{ option_id: 'basic', label: '기본', price: 0 }, { option_id: 'large', label: '라지 업그레이드', price: 700 }] },
        ] },
        { item_id: 'cheese', label: '치즈버거', base_price: 6900, visual: 'burger', customize_steps: [
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '단품과 세트 중 골라주세요.',
            options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 2000 }, { option_id: 'single', label: '아니요, 단품으로', price: 0 }] },
          { step_id: 'included_side', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 사이드를 선택하세요', voice_text: '세트에 포함된 사이드를 골라주세요.',
            options: [
              { option_id: 'fries', label: '프렌치프라이', price: 0 },
              { option_id: 'cheese_sticks', label: '치즈스틱', price: 0 },
              { option_id: 'nugget_king_3', label: '너겟킹 3조각', price: 0 },
              { option_id: 'corn_salad', label: '콘샐러드', price: 0 },
              { option_id: 'coleslaw', label: '코울슬로', price: 0 },
              { option_id: 'onion_rings', label: '어니언링', price: 300 },
              { option_id: 'nugget_king_4', label: '너겟킹 4조각', price: 300 },
              { option_id: 'cheese_fries', label: '치즈프라이', price: 900 },
              { option_id: 'fries_large', label: '프렌치프라이(L)', price: 500 },
            ] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', visual: 'drink', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 음료를 선택하세요', voice_text: '세트에 포함된 음료를 골라주세요.',
            options: [
              { option_id: 'coke', label: '코카콜라', price: 0 },
              { option_id: 'americano', label: '아메리카노', price: 0 },
              { option_id: 'choco', label: '초코', price: 300 },
              { option_id: 'zero_toktok', label: '제로톡톡', price: 300 },
              { option_id: 'minute_maid', label: '미닛메이드', price: 900 },
            ] },
          { step_id: 'set_size', type: 'binary_choice', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 사이즈를 선택하세요', voice_text: '세트를 라지로 업그레이드하시겠어요?',
            options: [{ option_id: 'basic', label: '기본', price: 0 }, { option_id: 'large', label: '라지 업그레이드', price: 700 }] },
        ] },
        { item_id: 'chicken', label: '치킨버거', base_price: 7500, visual: 'burger', customize_steps: [
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '단품과 세트 중 골라주세요.',
            options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 2000 }, { option_id: 'single', label: '아니요, 단품으로', price: 0 }] },
          { step_id: 'included_side', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 사이드를 선택하세요', voice_text: '세트에 포함된 사이드를 골라주세요.',
            options: [
              { option_id: 'fries', label: '프렌치프라이', price: 0 },
              { option_id: 'cheese_sticks', label: '치즈스틱', price: 0 },
              { option_id: 'nugget_king_3', label: '너겟킹 3조각', price: 0 },
              { option_id: 'corn_salad', label: '콘샐러드', price: 0 },
              { option_id: 'coleslaw', label: '코울슬로', price: 0 },
              { option_id: 'onion_rings', label: '어니언링', price: 300 },
              { option_id: 'nugget_king_4', label: '너겟킹 4조각', price: 300 },
              { option_id: 'cheese_fries', label: '치즈프라이', price: 900 },
              { option_id: 'fries_large', label: '프렌치프라이(L)', price: 500 },
            ] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', visual: 'drink', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 음료를 선택하세요', voice_text: '세트에 포함된 음료를 골라주세요.',
            options: [
              { option_id: 'coke', label: '코카콜라', price: 0 },
              { option_id: 'americano', label: '아메리카노', price: 0 },
              { option_id: 'choco', label: '초코', price: 300 },
              { option_id: 'zero_toktok', label: '제로톡톡', price: 300 },
              { option_id: 'minute_maid', label: '미닛메이드', price: 900 },
            ] },
          { step_id: 'set_size', type: 'binary_choice', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 사이즈를 선택하세요', voice_text: '세트를 라지로 업그레이드하시겠어요?',
            options: [{ option_id: 'basic', label: '기본', price: 0 }, { option_id: 'large', label: '라지 업그레이드', price: 700 }] },
        ] },
        { item_id: 'shrimp_whopper', label: '통새우와퍼', base_price: 8900, visual: 'burger', customize_steps: [
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '단품과 세트 중 골라주세요.',
            options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 2000 }, { option_id: 'single', label: '아니요, 단품으로', price: 0 }] },
          { step_id: 'included_side', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 사이드를 선택하세요', voice_text: '세트에 포함된 사이드를 골라주세요.',
            options: [
              { option_id: 'fries', label: '프렌치프라이', price: 0 },
              { option_id: 'cheese_sticks', label: '치즈스틱', price: 0 },
              { option_id: 'nugget_king_3', label: '너겟킹 3조각', price: 0 },
              { option_id: 'corn_salad', label: '콘샐러드', price: 0 },
              { option_id: 'coleslaw', label: '코울슬로', price: 0 },
              { option_id: 'onion_rings', label: '어니언링', price: 300 },
              { option_id: 'nugget_king_4', label: '너겟킹 4조각', price: 300 },
              { option_id: 'cheese_fries', label: '치즈프라이', price: 900 },
              { option_id: 'fries_large', label: '프렌치프라이(L)', price: 500 },
            ] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', visual: 'drink', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 음료를 선택하세요', voice_text: '세트에 포함된 음료를 골라주세요.',
            options: [
              { option_id: 'coke', label: '코카콜라', price: 0 },
              { option_id: 'americano', label: '아메리카노', price: 0 },
              { option_id: 'choco', label: '초코', price: 300 },
              { option_id: 'zero_toktok', label: '제로톡톡', price: 300 },
              { option_id: 'minute_maid', label: '미닛메이드', price: 900 },
            ] },
          { step_id: 'set_size', type: 'binary_choice', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 사이즈를 선택하세요', voice_text: '세트를 라지로 업그레이드하시겠어요?',
            options: [{ option_id: 'basic', label: '기본', price: 0 }, { option_id: 'large', label: '라지 업그레이드', price: 700 }] },
        ] },
        { item_id: 'bulgogi_whopper', label: '불고기와퍼', base_price: 7200, visual: 'burger', customize_steps: [
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '단품과 세트 중 골라주세요.',
            options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 2000 }, { option_id: 'single', label: '아니요, 단품으로', price: 0 }] },
          { step_id: 'included_side', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 사이드를 선택하세요', voice_text: '세트에 포함된 사이드를 골라주세요.',
            options: [
              { option_id: 'fries', label: '프렌치프라이', price: 0 },
              { option_id: 'cheese_sticks', label: '치즈스틱', price: 0 },
              { option_id: 'nugget_king_3', label: '너겟킹 3조각', price: 0 },
              { option_id: 'corn_salad', label: '콘샐러드', price: 0 },
              { option_id: 'coleslaw', label: '코울슬로', price: 0 },
              { option_id: 'onion_rings', label: '어니언링', price: 300 },
              { option_id: 'nugget_king_4', label: '너겟킹 4조각', price: 300 },
              { option_id: 'cheese_fries', label: '치즈프라이', price: 900 },
              { option_id: 'fries_large', label: '프렌치프라이(L)', price: 500 },
            ] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', visual: 'drink', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 음료를 선택하세요', voice_text: '세트에 포함된 음료를 골라주세요.',
            options: [
              { option_id: 'coke', label: '코카콜라', price: 0 },
              { option_id: 'americano', label: '아메리카노', price: 0 },
              { option_id: 'choco', label: '초코', price: 300 },
              { option_id: 'zero_toktok', label: '제로톡톡', price: 300 },
              { option_id: 'minute_maid', label: '미닛메이드', price: 900 },
            ] },
          { step_id: 'set_size', type: 'binary_choice', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 사이즈를 선택하세요', voice_text: '세트를 라지로 업그레이드하시겠어요?',
            options: [{ option_id: 'basic', label: '기본', price: 0 }, { option_id: 'large', label: '라지 업그레이드', price: 700 }] },
        ] },
        { item_id: 'whopper_jr', label: '와퍼주니어', base_price: 5200, visual: 'burger', customize_steps: [
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '단품과 세트 중 골라주세요.',
            options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 2000 }, { option_id: 'single', label: '아니요, 단품으로', price: 0 }] },
          { step_id: 'included_side', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 사이드를 선택하세요', voice_text: '세트에 포함된 사이드를 골라주세요.',
            options: [
              { option_id: 'fries', label: '프렌치프라이', price: 0 },
              { option_id: 'cheese_sticks', label: '치즈스틱', price: 0 },
              { option_id: 'nugget_king_3', label: '너겟킹 3조각', price: 0 },
              { option_id: 'corn_salad', label: '콘샐러드', price: 0 },
              { option_id: 'coleslaw', label: '코울슬로', price: 0 },
              { option_id: 'onion_rings', label: '어니언링', price: 300 },
              { option_id: 'nugget_king_4', label: '너겟킹 4조각', price: 300 },
              { option_id: 'cheese_fries', label: '치즈프라이', price: 900 },
              { option_id: 'fries_large', label: '프렌치프라이(L)', price: 500 },
            ] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', visual: 'drink', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 음료를 선택하세요', voice_text: '세트에 포함된 음료를 골라주세요.',
            options: [
              { option_id: 'coke', label: '코카콜라', price: 0 },
              { option_id: 'americano', label: '아메리카노', price: 0 },
              { option_id: 'choco', label: '초코', price: 300 },
              { option_id: 'zero_toktok', label: '제로톡톡', price: 300 },
              { option_id: 'minute_maid', label: '미닛메이드', price: 900 },
            ] },
          { step_id: 'set_size', type: 'binary_choice', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 사이즈를 선택하세요', voice_text: '세트를 라지로 업그레이드하시겠어요?',
            options: [{ option_id: 'basic', label: '기본', price: 0 }, { option_id: 'large', label: '라지 업그레이드', price: 700 }] },
        ] },
      ] },
      { category_id: 'drinks', label: '음료', items: [
        { item_id: 'coke_standalone', label: '코카콜라', base_price: 2200, visual: 'drink', customize_steps: [
          { step_id: 'size', type: 'binary_choice', priceMode: 'delta', title: '사이즈를 선택하세요', voice_text: '음료 사이즈를 선택해주세요.',
            options: [{ option_id: 'r', label: 'R', price: 0 }, { option_id: 'l', label: 'L', price: 200 }] },
        ] },
        { item_id: 'sprite_standalone', label: '스프라이트', base_price: 2200, visual: 'drink', customize_steps: [
          { step_id: 'size', type: 'binary_choice', priceMode: 'delta', title: '사이즈를 선택하세요', voice_text: '음료 사이즈를 선택해주세요.',
            options: [{ option_id: 'r', label: 'R', price: 0 }, { option_id: 'l', label: 'L', price: 200 }] },
        ] },
        { item_id: 'ice_americano_standalone', label: '아이스 아메리카노', base_price: 2500, visual: 'drink', customize_steps: [] },
      ] },
    ] },
    order_steps: [
      { step_id: 'confirm_order', type: 'confirm', title: '선택하신 내용을 확인해주세요', voice_text: '지금까지 고르신 내용이 맞는지 확인해주세요.' },
      { step_id: 'payment', type: 'payment_mock', title: '결제 방법을 선택하세요', voice_text: '결제 방법을 선택해주세요.',
        options: [{ option_id: 'card', label: '카드 삽입', icon: 'card' }, { option_id: 'phone', label: '휴대폰 태그', icon: 'phone' }, { option_id: 'cash', label: '현금', icon: 'cash' }] },
    ],
  },
  mcdonalds: {
    store: { name: '맥도날드 종로점', sub: '도보 4분 · 키오스크 주문', icon: Utensils, iconBg: '#C62828' },
    device: {
      shape: 'freestanding_totem', orientation: 'portrait',
      theme: { bg: '#FFFBF2', card: '#FFFFFF', accent: '#C62828', text: '#2A211B', mute: '#9A8F84' },
    },
    dining_options: { step_id: 'dining', type: 'binary_choice', title: '매장에서 드실 건가요, 포장하시겠어요?', voice_text: '매장에서 드실지 포장하실지 선택해주세요.',
      options: [{ option_id: 'dine_in', label: '매장에서 식사', price: 0 }, { option_id: 'takeaway', label: '포장', price: 0 }] },
    menu: { menu_id: 'mcdonalds_default_v1', categories: [
      { category_id: 'burgers', label: '버거', items: [
        { item_id: 'bigmac', label: '빅맥', base_price: 5700, visual: 'burger', customize_steps: [
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '세트로 하시면 감자튀김과 음료가 같이 나와요.',
            options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 1900 }, { option_id: 'single', label: '아니요, 버거만 주세요', price: 0 }] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', visual: 'drink', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 음료를 선택하세요', voice_text: '세트에 포함된 음료를 골라주세요.',
            options: [{ option_id: 'coke', label: '코카콜라', price: 0 }, { option_id: 'sprite', label: '스프라이트', price: 0 }, { option_id: 'ice_americano', label: '아이스 아메리카노', price: 300 }] },
          { step_id: 'set_size', type: 'binary_choice', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 사이즈를 선택하세요', voice_text: '세트를 L사이즈로 업그레이드하시겠어요?',
            options: [{ option_id: 'basic', label: '기본', price: 0 }, { option_id: 'large', label: 'L사이즈 업그레이드', price: 900 }] },
        ] },
        { item_id: 'shanghai', label: '맥스파이시 상하이 버거', base_price: 5200, visual: 'burger', customize_steps: [
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '세트로 하시면 감자튀김과 음료가 같이 나와요.',
            options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 1900 }, { option_id: 'single', label: '아니요, 버거만 주세요', price: 0 }] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', visual: 'drink', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 음료를 선택하세요', voice_text: '세트에 포함된 음료를 골라주세요.',
            options: [{ option_id: 'coke', label: '코카콜라', price: 0 }, { option_id: 'sprite', label: '스프라이트', price: 0 }, { option_id: 'ice_americano', label: '아이스 아메리카노', price: 300 }] },
          { step_id: 'set_size', type: 'binary_choice', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 사이즈를 선택하세요', voice_text: '세트를 L사이즈로 업그레이드하시겠어요?',
            options: [{ option_id: 'basic', label: '기본', price: 0 }, { option_id: 'large', label: 'L사이즈 업그레이드', price: 900 }] },
        ] },
        { item_id: 'bulgogi', label: '불고기버거', base_price: 3800, visual: 'burger', customize_steps: [
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '세트로 하시면 감자튀김과 음료가 같이 나와요.',
            options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 1900 }, { option_id: 'single', label: '아니요, 버거만 주세요', price: 0 }] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', visual: 'drink', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 음료를 선택하세요', voice_text: '세트에 포함된 음료를 골라주세요.',
            options: [{ option_id: 'coke', label: '코카콜라', price: 0 }, { option_id: 'sprite', label: '스프라이트', price: 0 }, { option_id: 'ice_americano', label: '아이스 아메리카노', price: 300 }] },
          { step_id: 'set_size', type: 'binary_choice', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 사이즈를 선택하세요', voice_text: '세트를 L사이즈로 업그레이드하시겠어요?',
            options: [{ option_id: 'basic', label: '기본', price: 0 }, { option_id: 'large', label: 'L사이즈 업그레이드', price: 900 }] },
        ] },
      ] },
      { category_id: 'drinks', label: '음료', items: [
        { item_id: 'coke_standalone', label: '코카콜라', base_price: 2000, visual: 'drink', customize_steps: [
          { step_id: 'size', type: 'binary_choice', priceMode: 'delta', title: '사이즈를 선택하세요', voice_text: '음료 사이즈를 선택해주세요.',
            options: [{ option_id: 'm', label: 'M', price: 0 }, { option_id: 'l', label: 'L', price: 400 }] },
        ] },
        { item_id: 'sprite_standalone', label: '스프라이트', base_price: 2000, visual: 'drink', customize_steps: [
          { step_id: 'size', type: 'binary_choice', priceMode: 'delta', title: '사이즈를 선택하세요', voice_text: '음료 사이즈를 선택해주세요.',
            options: [{ option_id: 'm', label: 'M', price: 0 }, { option_id: 'l', label: 'L', price: 400 }] },
        ] },
        { item_id: 'ice_americano_standalone', label: '아이스 아메리카노', base_price: 2300, visual: 'drink', customize_steps: [
          { step_id: 'size', type: 'binary_choice', priceMode: 'delta', title: '사이즈를 선택하세요', voice_text: '음료 사이즈를 선택해주세요.',
            options: [{ option_id: 'm', label: 'M', price: 0 }, { option_id: 'l', label: 'L', price: 400 }] },
        ] },
      ] },
      { category_id: 'mcmorning', label: '맥모닝', items: [
        { item_id: 'sausage_egg_mcmuffin', label: '소시지에그맥머핀', base_price: 4200, visual: 'burger', customize_steps: [] },
        { item_id: 'big_breakfast', label: '빅브렉퍼스트', base_price: 6900, visual: 'burger', customize_steps: [] },
      ] },
      { category_id: 'sides_desserts', label: '사이드 & 디저트', items: [
        { item_id: 'mcnuggets_6', label: '맥너겟 6조각', base_price: 4300, visual: 'burger', customize_steps: [] },
        { item_id: 'hash_brown', label: '해쉬브라운', base_price: 1700, visual: 'burger', customize_steps: [] },
        { item_id: 'snack_wrap', label: '스낵랩', base_price: 3900, visual: 'burger', customize_steps: [] },
        { item_id: 'cheese_stick_mc', label: '치즈스틱', base_price: 2500, visual: 'burger', customize_steps: [] },
        { item_id: 'soft_serve_cone', label: '아이스크림 콘', base_price: 1000, visual: 'drink', customize_steps: [] },
        { item_id: 'mcflurry_oreo', label: '오레오 맥플러리', base_price: 3500, visual: 'drink', customize_steps: [] },
        { item_id: 'affogato', label: '아포가토', base_price: 3800, visual: 'drink', customize_steps: [] },
      ] },
      { category_id: 'mccafe', label: '맥카페', items: [
        { item_id: 'americano_mccafe', label: '아메리카노', base_price: 2500, visual: 'drink', customize_steps: [
          { step_id: 'size', type: 'binary_choice', priceMode: 'delta', title: '사이즈를 선택하세요', voice_text: '음료 사이즈를 선택해주세요.',
            options: [{ option_id: 'm', label: 'M', price: 0 }, { option_id: 'l', label: 'L', price: 400 }] },
        ] },
        { item_id: 'cafe_latte_mccafe', label: '카페라떼', base_price: 3200, visual: 'drink', customize_steps: [
          { step_id: 'size', type: 'binary_choice', priceMode: 'delta', title: '사이즈를 선택하세요', voice_text: '음료 사이즈를 선택해주세요.',
            options: [{ option_id: 'm', label: 'M', price: 0 }, { option_id: 'l', label: 'L', price: 400 }] },
        ] },
        { item_id: 'cappuccino_mccafe', label: '카푸치노', base_price: 3200, visual: 'drink', customize_steps: [
          { step_id: 'size', type: 'binary_choice', priceMode: 'delta', title: '사이즈를 선택하세요', voice_text: '음료 사이즈를 선택해주세요.',
            options: [{ option_id: 'm', label: 'M', price: 0 }, { option_id: 'l', label: 'L', price: 400 }] },
        ] },
      ] },
    ] },
    order_steps: [
      { step_id: 'confirm_order', type: 'confirm', title: '선택하신 내용을 확인해주세요', voice_text: '지금까지 고르신 내용이 맞는지 확인해주세요.' },
      { step_id: 'payment', type: 'payment_mock', title: '결제 방법을 선택하세요', voice_text: '결제 방법을 선택해주세요.',
        options: [{ option_id: 'card', label: '카드 삽입', icon: 'card' }, { option_id: 'phone', label: '휴대폰 태그', icon: 'phone' }, { option_id: 'cash', label: '현금', icon: 'cash' }] },
    ],
  },
  lotteria: {
    store: { name: '롯데리아 신촌점', sub: '도보 2분 · 키오스크 주문', icon: Utensils, iconBg: '#D84315' },
    device: {
      shape: 'countertop_tablet', orientation: 'landscape',
      theme: { bg: '#FBEFE4', card: '#FFFFFF', accent: '#D84315', text: '#2B211C', mute: '#B08D75' },
    },
    dining_options: { step_id: 'dining', type: 'binary_choice', title: '매장에서 드실 건가요, 포장하시겠어요?', voice_text: '매장에서 드실지 포장하실지 선택해주세요.',
      options: [{ option_id: 'dine_in', label: '매장에서 식사', price: 0 }, { option_id: 'takeaway', label: '포장', price: 0 }] },
    menu: { menu_id: 'lotteria_default_v1', categories: [
      { category_id: 'burgers', label: '버거', items: [
        { item_id: 'classic_cheese', label: '클래식치즈버거', base_price: 5700, visual: 'burger', customize_steps: [
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '세트로 하시면 감자튀김과 음료가 같이 나와요.',
            options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 2000 }, { option_id: 'single', label: '아니요, 버거만 주세요', price: 0 }] },
          { step_id: 'included_side', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 사이드를 선택하세요', voice_text: '세트에 포함된 사이드를 골라주세요.',
            options: [{ option_id: 'fries', label: '감자튀김', price: 0 }, { option_id: 'spicy_potato', label: '양념감자', price: 500 }, { option_id: 'ice_cream_swap', label: '아이스크림 교체', price: 800 }] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', visual: 'drink', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 음료를 선택하세요', voice_text: '세트에 포함된 음료를 골라주세요.',
            options: [{ option_id: 'coke', label: '코카콜라', price: 0 }, { option_id: 'sprite', label: '스프라이트', price: 0 }, { option_id: 'ice_tea', label: '아이스티', price: 300 }] },
        ] },
        { item_id: 'ria_bulgogi', label: '리아 불고기', base_price: 5100, visual: 'burger', customize_steps: [
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '세트로 하시면 감자튀김과 음료가 같이 나와요.',
            options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 2000 }, { option_id: 'single', label: '아니요, 버거만 주세요', price: 0 }] },
          { step_id: 'included_side', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 사이드를 선택하세요', voice_text: '세트에 포함된 사이드를 골라주세요.',
            options: [{ option_id: 'fries', label: '감자튀김', price: 0 }, { option_id: 'spicy_potato', label: '양념감자', price: 500 }, { option_id: 'ice_cream_swap', label: '아이스크림 교체', price: 800 }] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', visual: 'drink', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 음료를 선택하세요', voice_text: '세트에 포함된 음료를 골라주세요.',
            options: [{ option_id: 'coke', label: '코카콜라', price: 0 }, { option_id: 'sprite', label: '스프라이트', price: 0 }, { option_id: 'ice_tea', label: '아이스티', price: 300 }] },
        ] },
        { item_id: 'ria_shrimp', label: '리아 새우', base_price: 5100, visual: 'burger', customize_steps: [
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '세트로 하시면 감자튀김과 음료가 같이 나와요.',
            options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 2000 }, { option_id: 'single', label: '아니요, 버거만 주세요', price: 0 }] },
          { step_id: 'included_side', type: 'single_select', priceMode: 'delta', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 사이드를 선택하세요', voice_text: '세트에 포함된 사이드를 골라주세요.',
            options: [{ option_id: 'fries', label: '감자튀김', price: 0 }, { option_id: 'spicy_potato', label: '양념감자', price: 500 }, { option_id: 'ice_cream_swap', label: '아이스크림 교체', price: 800 }] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', visual: 'drink', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 음료를 선택하세요', voice_text: '세트에 포함된 음료를 골라주세요.',
            options: [{ option_id: 'coke', label: '코카콜라', price: 0 }, { option_id: 'sprite', label: '스프라이트', price: 0 }, { option_id: 'ice_tea', label: '아이스티', price: 300 }] },
        ] },
      ] },
      { category_id: 'chicken', label: '치킨', items: [
        { item_id: 'chicken_leg', label: '치킨다리', base_price: 3200, customize_steps: [] },
        { item_id: 'fire_wing', label: '화이어윙', base_price: 3200, customize_steps: [
          { step_id: 'piece_count', type: 'binary_choice', priceMode: 'delta', title: '조각수를 선택하세요', voice_text: '화이어윙 조각수를 선택해주세요.',
            options: [{ option_id: '2pcs', label: '2조각', price: 0 }, { option_id: '4pcs', label: '4조각', price: 2100 }] },
        ] },
        { item_id: 'chicken_fillet', label: '치킨휠레', base_price: 3200, customize_steps: [
          { step_id: 'piece_count', type: 'binary_choice', priceMode: 'delta', title: '조각수를 선택하세요', voice_text: '치킨휠레 조각수를 선택해주세요.',
            options: [{ option_id: '2pcs', label: '2조각', price: 0 }, { option_id: '4pcs', label: '4조각', price: 3000 }] },
          { step_id: 'sauce', type: 'single_select', priceMode: 'delta', title: '소스를 선택하세요', voice_text: '소스를 선택해주세요.',
            options: [{ option_id: 'honey_mustard', label: '허니머스터드', price: 0 }, { option_id: 'sweet_and_sour', label: '스위트앤사워', price: 0 }] },
        ] },
        { item_id: 'chicken_leg_half_pack_set', label: '치킨다리 하프팩 세트', base_price: 13900, customize_steps: [] },
        { item_id: 'boneless_chicken_full_pack', label: '순살치킨 풀팩(22조각)', base_price: 24900, customize_steps: [
          { step_id: 'sauce', type: 'multi_select', priceMode: 'delta', max_selections: 2, title: '소스를 2개 선택하세요', voice_text: '소스를 2개 선택해주세요.',
            options: [{ option_id: 'creamy_garlic', label: '크리미마늘', price: 0 }, { option_id: 'seasoned', label: '양념', price: 0 }, { option_id: 'teriyaki', label: '데리야끼', price: 0 }, { option_id: 'mustard', label: '머스터드', price: 0 }] },
        ] },
        { item_id: 'boneless_chicken_half_pack', label: '순살치킨 하프팩(11조각)', base_price: 13900, customize_steps: [
          { step_id: 'sauce', type: 'single_select', priceMode: 'delta', title: '소스를 선택하세요', voice_text: '소스를 선택해주세요.',
            options: [{ option_id: 'creamy_garlic', label: '크리미마늘', price: 0 }, { option_id: 'seasoned', label: '양념', price: 0 }, { option_id: 'teriyaki', label: '데리야끼', price: 0 }, { option_id: 'mustard', label: '머스터드', price: 0 }] },
        ] },
      ] },
      { category_id: 'drinks', label: '음료', items: [
        { item_id: 'coke_standalone', label: '코카콜라', base_price: 2000, visual: 'drink', customize_steps: [
          { step_id: 'size', type: 'binary_choice', priceMode: 'delta', title: '사이즈를 선택하세요', voice_text: '음료 사이즈를 선택해주세요.',
            options: [{ option_id: 'r', label: 'R', price: 0 }, { option_id: 'l', label: 'L', price: 200 }] },
        ] },
        { item_id: 'sprite_standalone', label: '스프라이트', base_price: 2000, visual: 'drink', customize_steps: [
          { step_id: 'size', type: 'binary_choice', priceMode: 'delta', title: '사이즈를 선택하세요', voice_text: '음료 사이즈를 선택해주세요.',
            options: [{ option_id: 'r', label: 'R', price: 0 }, { option_id: 'l', label: 'L', price: 200 }] },
        ] },
        { item_id: 'ice_tea_standalone', label: '아이스티', base_price: 2300, visual: 'drink', customize_steps: [
          { step_id: 'size', type: 'binary_choice', priceMode: 'delta', title: '사이즈를 선택하세요', voice_text: '음료 사이즈를 선택해주세요.',
            options: [{ option_id: 'r', label: 'R', price: 0 }, { option_id: 'l', label: 'L', price: 300 }] },
        ] },
      ] },
    ] },
    order_steps: [
      { step_id: 'confirm_order', type: 'confirm', title: '선택하신 내용을 확인해주세요', voice_text: '지금까지 고르신 내용이 맞는지 확인해주세요.' },
      { step_id: 'payment', type: 'payment_mock', title: '결제 방법을 선택하세요', voice_text: '결제 방법을 선택해주세요.',
        options: [{ option_id: 'card', label: '카드 삽입', icon: 'card' }, { option_id: 'phone', label: '휴대폰 태그', icon: 'phone' }, { option_id: 'cash', label: '현금', icon: 'cash' }] },
    ],
  },
  kfc: {
    store: { name: 'KFC 신림점', sub: '도보 6분 · 키오스크 주문', icon: Utensils, iconBg: '#E63946' },
    device: {
      shape: 'freestanding_totem', orientation: 'portrait',
      theme: { bg: '#241012', card: '#3A1518', accent: '#E63946', text: '#FFFFFF', mute: '#C9A9A9' },
    },
    dining_options: { step_id: 'dining', type: 'binary_choice', title: '매장에서 드실 건가요, 포장하시겠어요?', voice_text: '매장에서 드실지 포장하실지 선택해주세요.',
      options: [{ option_id: 'dine_in', label: '매장에서 식사', price: 0 }, { option_id: 'takeaway', label: '포장', price: 0 }] },
    menu: { menu_id: 'kfc_default_v1', categories: [
      { category_id: 'chicken', label: '치킨', items: [
        { item_id: 'chicken_bucket_9', label: '치킨 버킷 9조각', base_price: 17900, customize_steps: [
          { step_id: 'flavor_mix', type: 'multi_select', priceMode: 'delta', max_selections: 2, title: '맛을 선택하세요 (2개 선택 시 반반 구성)', voice_text: '원하는 치킨 맛을 골라주세요. 두 가지를 고르면 반반으로 구성됩니다.',
            options: [{ option_id: 'original', label: '오리지널', price: 0 }, { option_id: 'hot_crispy', label: '핫크리스피', price: 0 }, { option_id: 'seasoned', label: '양념', price: 0 }, { option_id: 'black_label', label: '블랙라벨', price: 1000 }] },
        ] },
        { item_id: 'chicken_bucket_16', label: '치킨 버킷 16조각', base_price: 31900, customize_steps: [
          { step_id: 'flavor_mix', type: 'multi_select', priceMode: 'delta', max_selections: 2, title: '맛을 선택하세요 (2개 선택 시 반반 구성)', voice_text: '원하는 치킨 맛을 골라주세요. 두 가지를 고르면 반반으로 구성됩니다.',
            options: [{ option_id: 'original', label: '오리지널', price: 0 }, { option_id: 'hot_crispy', label: '핫크리스피', price: 0 }, { option_id: 'seasoned', label: '양념', price: 0 }, { option_id: 'black_label', label: '블랙라벨', price: 1000 }] },
        ] },
      ] },
      { category_id: 'burgers', label: '버거', items: [
        { item_id: 'tower', label: '타워버거', base_price: 7900, visual: 'burger', customize_steps: [
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '세트로 하시면 사이드와 음료가 같이 나와요.',
            options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 2200 }, { option_id: 'single', label: '아니요, 버거만 주세요', price: 0 }] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', visual: 'drink', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 음료를 선택하세요', voice_text: '세트에 포함된 음료를 골라주세요.',
            options: [{ option_id: 'coke', label: '코카콜라', price: 0 }, { option_id: 'sprite', label: '스프라이트', price: 0 }, { option_id: 'ice_americano', label: '아이스 아메리카노', price: 300 }] },
        ] },
        { item_id: 'original_chicken', label: '오리지널 치킨버거', base_price: 4900, visual: 'burger', customize_steps: [
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '세트로 하시면 사이드와 음료가 같이 나와요.',
            options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 2200 }, { option_id: 'single', label: '아니요, 버거만 주세요', price: 0 }] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', visual: 'drink', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 음료를 선택하세요', voice_text: '세트에 포함된 음료를 골라주세요.',
            options: [{ option_id: 'coke', label: '코카콜라', price: 0 }, { option_id: 'sprite', label: '스프라이트', price: 0 }, { option_id: 'ice_americano', label: '아이스 아메리카노', price: 300 }] },
        ] },
        { item_id: 'zinger', label: '징거버거', base_price: 6700, visual: 'burger', customize_steps: [
          { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '세트로 하시면 사이드와 음료가 같이 나와요.',
            options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 2200 }, { option_id: 'single', label: '아니요, 버거만 주세요', price: 0 }] },
          { step_id: 'included_drink', type: 'single_select', priceMode: 'delta', visual: 'drink', condition: { step_id: 'set', option_id: 'set' },
            title: '세트 음료를 선택하세요', voice_text: '세트에 포함된 음료를 골라주세요.',
            options: [{ option_id: 'coke', label: '코카콜라', price: 0 }, { option_id: 'sprite', label: '스프라이트', price: 0 }, { option_id: 'ice_americano', label: '아이스 아메리카노', price: 300 }] },
        ] },
      ] },
      { category_id: 'drinks', label: '음료', items: [
        { item_id: 'coke_standalone', label: '코카콜라', base_price: 2000, visual: 'drink', customize_steps: [
          { step_id: 'size', type: 'binary_choice', priceMode: 'delta', title: '사이즈를 선택하세요', voice_text: '음료 사이즈를 선택해주세요.',
            options: [{ option_id: 'm', label: 'M', price: 0 }, { option_id: 'l', label: 'L', price: 400 }] },
        ] },
        { item_id: 'sprite_standalone', label: '스프라이트', base_price: 2000, visual: 'drink', customize_steps: [
          { step_id: 'size', type: 'binary_choice', priceMode: 'delta', title: '사이즈를 선택하세요', voice_text: '음료 사이즈를 선택해주세요.',
            options: [{ option_id: 'm', label: 'M', price: 0 }, { option_id: 'l', label: 'L', price: 400 }] },
        ] },
        { item_id: 'ice_americano_standalone', label: '아이스 아메리카노', base_price: 2300, visual: 'drink', customize_steps: [
          { step_id: 'size', type: 'binary_choice', priceMode: 'delta', title: '사이즈를 선택하세요', voice_text: '음료 사이즈를 선택해주세요.',
            options: [{ option_id: 'm', label: 'M', price: 0 }, { option_id: 'l', label: 'L', price: 400 }] },
        ] },
      ] },
    ] },
    order_steps: [
      { step_id: 'confirm_order', type: 'confirm', title: '선택하신 내용을 확인해주세요', voice_text: '지금까지 고르신 내용이 맞는지 확인해주세요.' },
      { step_id: 'payment', type: 'payment_mock', title: '결제 방법을 선택하세요', voice_text: '결제 방법을 선택해주세요.',
        options: [{ option_id: 'card', label: '카드 삽입', icon: 'card' }, { option_id: 'phone', label: '휴대폰 태그', icon: 'phone' }, { option_id: 'cash', label: '현금', icon: 'cash' }] },
    ],
  },
};

const PHASES = ['매장선택', '메뉴선택', '주문확인', '결제하기', '결제완료'];
function phaseIndexForScreen(screen) {
  if (screen === 'diningOption') return 0;
  if (screen === 'category' || screen === 'itemCustomize') return 1;
  if (screen === 'cartReview') return 2;
  if (screen === 'payment') return 3;
  if (screen === 'complete') return 4;
  return 0;
}

function getCategories(brandId) {
  return CONTENT[brandId].menu.categories;
}
function getItem(brandId, categoryId, itemId) {
  const cat = getCategories(brandId).find((c) => c.category_id === categoryId);
  return cat.items.find((i) => i.item_id === itemId);
}
function itemStepVisible(step, itemSelections) {
  if (!step.condition) return true;
  const chosen = itemSelections[step.condition.step_id] || [];
  return chosen.includes(step.condition.option_id);
}
function visibleCustomizeSteps(item, itemSelections) {
  return item.customize_steps.filter((s) => itemStepVisible(s, itemSelections));
}
function isStepAtSelectionCap(step, currentSelection) {
  return step.max_selections !== undefined && currentSelection.length >= step.max_selections;
}
function computeItemUnitPrice(item, itemSelections) {
  let total = item.base_price || 0;
  visibleCustomizeSteps(item, itemSelections).forEach((s) => {
    (itemSelections[s.step_id] || []).forEach((oid) => {
      const opt = s.options.find((o) => o.option_id === oid);
      if (opt?.price) total += opt.price;
    });
  });
  return total;
}
function computeCartTotal(cart) {
  return cart.reduce((sum, line) => sum + line.lineTotal, 0);
}
function selectionsEqual(a, b) {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((k, i) => {
    if (bKeys[i] !== k) return false;
    const av = a[k] || [];
    const bv = b[k] || [];
    return av.length === bv.length && av.every((v, j) => v === bv[j]);
  });
}
function optionLabelsFor(item, itemSelections) {
  const labels = [];
  visibleCustomizeSteps(item, itemSelections).forEach((s) => {
    (itemSelections[s.step_id] || []).forEach((oid) => {
      const opt = s.options.find((o) => o.option_id === oid);
      if (opt) labels.push(opt.label);
    });
  });
  return labels;
}
function addCartLine(cart, brandId, { categoryId, itemId, customizeSelections }) {
  const item = getItem(brandId, categoryId, itemId);
  const unitPrice = computeItemUnitPrice(item, customizeSelections);
  const optionLabels = optionLabelsFor(item, customizeSelections);
  const existing = cart.find((l) => l.itemId === itemId && selectionsEqual(l.customizeSelections, customizeSelections));
  if (existing) {
    return cart.map((l) => (l === existing ? { ...l, qty: l.qty + 1, lineTotal: unitPrice * (l.qty + 1) } : l));
  }
  const cartItemId = `${itemId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  return [...cart, { cartItemId, categoryId, itemId, label: item.label, customizeSelections, optionLabels, unitPrice, qty: 1, lineTotal: unitPrice }];
}
function removeCartLine(cart, cartItemId) {
  return cart.filter((l) => l.cartItemId !== cartItemId);
}
function cartSummaryLine(cart) {
  return cart.map((l) => {
    const opts = l.optionLabels.length ? `(${l.optionLabels.join(', ')})` : '';
    const qty = l.qty > 1 ? ` x${l.qty}` : '';
    return `${l.label}${opts}${qty}`;
  }).join(' · ');
}
function priceLabel(step, price) {
  if (step.priceMode === 'absolute') return `${price.toLocaleString()}원`;
  return `+${price.toLocaleString()}원`;
}

const APP = {
  bg: '#F4F6F2', surface: '#FFFFFF', ink: '#232E28', inkSoft: '#5C6960', border: '#DFE5DC',
  practice: '#0F6E56', practiceSoft: '#E1F0EA', realtime: '#C1502B', realtimeSoft: '#FBEAE3', highlight: '#E8A33D',
};
const APP_HC = {
  bg: '#FFFFFF', surface: '#FFFFFF', ink: '#000000', inkSoft: '#3A3A3A', border: '#8A9089',
  practice: '#0B5A46', practiceSoft: '#CFEBDF', realtime: '#9E3A1C', realtimeSoft: '#F6D2C2', highlight: '#B9790A',
};

function PaymentIcon({ icon, style }) {
  if (icon === 'card') return <CreditCard style={style} />;
  if (icon === 'phone') return <Smartphone style={style} />;
  return <Banknote style={style} />;
}

function FoodIcon({ visual, style }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', style };
  if (visual === 'bread') {
    return (
      <svg {...common}>
        <path d="M3 15c0-5 4-9 9-9s9 4 9 9" />
        <path d="M3 15c0 2 1.3 3 3 3h12c1.7 0 3-1 3-3" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <circle cx="9" cy="9.5" r="0.6" fill="currentColor" stroke="none" />
        <circle cx="12" cy="7.5" r="0.6" fill="currentColor" stroke="none" />
        <circle cx="15" cy="9.5" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (visual === 'burger') {
    return (
      <svg {...common}>
        <path d="M4 10c0-4 3.6-7 8-7s8 3 8 7" />
        <line x1="3" y1="10.5" x2="21" y2="10.5" />
        <line x1="3" y1="13.5" x2="21" y2="13.5" />
        <path d="M3 16.5h18" />
        <path d="M3 16.5c0 2 1.3 3 3 3h12c1.7 0 3-1 3-3" />
      </svg>
    );
  }
  if (visual === 'drink') {
    return (
      <svg {...common}>
        <path d="M7 8h10l-1.1 11.5A2 2 0 0 1 13.9 21h-3.8a2 2 0 0 1-2-1.5L7 8Z" />
        <path d="M6 8h12" />
        <path d="M14 8V3" />
        <path d="M14 3h3" />
      </svg>
    );
  }
  if (visual === 'vegetable') {
    return (
      <svg {...common}>
        <path d="M5 19c-2-6 1-13 8-15 3 5 3 12-2 15-2 1-4 1-6 0Z" />
        <path d="M6 18c3-4 6-7 11-13" />
      </svg>
    );
  }
  return <Utensils style={style} />;
}

function Button({ children, onClick, variant = 'default', disabled, style, app }) {
  const base = {
    height: 48, borderRadius: 12, fontSize: 15, fontWeight: 500,
    border: '1px solid ' + app.border, background: app.surface, color: app.ink,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1,
  };
  const variants = {
    primary: { background: app.ink, color: '#fff', border: 'none' },
    realtime: { background: app.realtime, color: '#fff', border: 'none' },
    outlineRealtime: { color: app.realtime, border: '1px solid ' + app.realtime },
    ghost: { background: 'transparent', border: 'none', color: app.inkSoft },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...(variants[variant] || {}), ...style }}>
      {children}
    </button>
  );
}

function StepTracker({ theme, currentPhase }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '12px 12px 8px', overflowX: 'auto' }}>
      {PHASES.map((label, i) => {
        const state = i < currentPhase ? 'done' : i === currentPhase ? 'current' : 'upcoming';
        return (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
              <div style={{
                width: 15, height: 15, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 8, fontWeight: 700, flexShrink: 0,
                background: state === 'upcoming' ? theme.mute + '33' : theme.accent,
                color: state === 'upcoming' ? theme.mute : '#fff',
              }}>
                {state === 'done' ? <Check style={{ width: 9, height: 9 }} /> : i + 1}
              </div>
              <span style={{ fontSize: 9, color: state === 'current' ? theme.text : theme.mute, fontWeight: state === 'current' ? 700 : 400, whiteSpace: 'nowrap' }}>{label}</span>
            </div>
            {i < PHASES.length - 1 && <ChevronRight style={{ width: 10, height: 10, color: theme.mute, flexShrink: 0 }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function CartBar({ theme, app, cart, mode, onReview }) {
  if (cart.length === 0) return null;
  const total = computeCartTotal(cart);
  const barColors = mode === 'practice' ? { bg: theme.card, border: theme.mute + '33', text: theme.text, accent: theme.accent, mute: theme.mute } : { bg: app.surface, border: app.border, text: app.ink, accent: app.realtime, mute: app.inkSoft };
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: barColors.bg, borderTop: `1px solid ${barColors.border}`, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
      <div>
        <div style={{ fontSize: 11, color: barColors.mute }}>담긴 메뉴 {cart.reduce((n, l) => n + l.qty, 0)}개</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: barColors.text }}>{total.toLocaleString()}원</div>
      </div>
      <button onClick={onReview} style={{ height: 44, padding: '0 18px', borderRadius: 10, background: barColors.accent, color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
        장바구니 보기
      </button>
    </div>
  );
}

const STORAGE_SETTINGS_KEY = 'easyorder:settings';
const STORAGE_ORDERS_KEY = 'easyorder:saved_orders';

export default function App() {
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState('home');
  const [brandId, setBrandId] = useState('subway');
  const [mode, setMode] = useState('practice');
  const [diningOption, setDiningOption] = useState(null);
  const [cart, setCart] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);
  const [itemDraftSelections, setItemDraftSelections] = useState({});
  const [customizeStepIndex, setCustomizeStepIndex] = useState(0);
  const [calledStaff, setCalledStaff] = useState(false);
  const [nickname, setNickname] = useState('');
  const [savedThisRun, setSavedThisRun] = useState(false);
  const [savedOrders, setSavedOrders] = useState([]);
  const [settings, setSettings] = useState({ fontScale: 1, voiceOn: true, highContrast: false });

  useEffect(() => {
    (async () => {
      try {
        const s = await storage.get(STORAGE_SETTINGS_KEY, false);
        if (s?.value) setSettings(JSON.parse(s.value));
      } catch (e) {}
      try {
        const o = await storage.get(STORAGE_ORDERS_KEY, false);
        if (o?.value) setSavedOrders(JSON.parse(o.value));
      } catch (e) {}
      setReady(true);
    })();
  }, []);

  async function updateSettings(patch) {
    const next = { ...settings, ...patch };
    setSettings(next);
    try { await storage.set(STORAGE_SETTINGS_KEY, JSON.stringify(next), false); } catch (e) {}
  }
  async function persistOrders(next) {
    setSavedOrders(next);
    try { await storage.set(STORAGE_ORDERS_KEY, JSON.stringify(next), false); } catch (e) {}
  }
  async function saveCurrentOrder() {
    const brand = CONTENT[brandId];
    const entry = {
      id: `${brandId}_${Date.now()}`, brandId, storeName: brand.store.name,
      nickname: nickname.trim() || `${brand.store.name} 조합`, cart, createdAt: new Date().toISOString(),
    };
    await persistOrders([entry, ...savedOrders]);
    setSavedThisRun(true);
  }
  async function deleteOrder(id) { await persistOrders(savedOrders.filter((o) => o.id !== id)); }

  const app = settings.highContrast ? APP_HC : APP;
  const fs = (px) => Math.round(px * settings.fontScale);
  const brand = CONTENT[brandId];
  const device = brand.device;
  const theme = device.theme;
  const total = computeCartTotal(cart);

  const activeItem = activeCategoryId && activeItemId ? getItem(brandId, activeCategoryId, activeItemId) : null;
  const customizeSteps = activeItem ? visibleCustomizeSteps(activeItem, itemDraftSelections) : [];
  const customizeStep = customizeSteps[customizeStepIndex];
  const currentCustomizeSelection = customizeStep ? (itemDraftSelections[customizeStep.step_id] || []) : [];
  const isLastCustomizeStep = customizeStepIndex === customizeSteps.length - 1;
  const canProceedCustomize = customizeStep?.required === false || currentCustomizeSelection.length > 0;
  const itemUnitPricePreview = activeItem ? computeItemUnitPrice(activeItem, itemDraftSelections) : 0;

  const paymentStep = brand.order_steps.find((s) => s.type === 'payment_mock');
  const confirmStep = brand.order_steps.find((s) => s.type === 'confirm');

  useEffect(() => {
    if (customizeSteps.length > 0 && customizeStepIndex > customizeSteps.length - 1) {
      setCustomizeStepIndex(customizeSteps.length - 1);
    }
  }, [customizeSteps.length, customizeStepIndex]);

  function toggleCustomizeOption(optId) {
    setItemDraftSelections((prev) => {
      const cur = prev[customizeStep.step_id] || [];
      if (customizeStep.type === 'multi_select') {
        if (cur.includes(optId)) return { ...prev, [customizeStep.step_id]: cur.filter((o) => o !== optId) };
        if (isStepAtSelectionCap(customizeStep, cur)) return prev;
        return { ...prev, [customizeStep.step_id]: [...cur, optId] };
      }
      return { ...prev, [customizeStep.step_id]: [optId] };
    });
  }

  function pickMode(m) {
    setMode(m); setCart([]); setDiningOption(null); setCalledStaff(false); setSavedThisRun(false); setNickname('');
    setScreen('storePicker');
  }
  function pickStore(id) { setBrandId(id); setScreen('diningOption'); }
  function pickDiningOption(optionId) { setDiningOption(optionId); setScreen('category'); }

  function addItemToCart(categoryId, itemId, customizeSelections) {
    setCart((prev) => addCartLine(prev, brandId, { categoryId, itemId, customizeSelections }));
  }
  function openItem(categoryId, itemId) {
    const item = getItem(brandId, categoryId, itemId);
    if (!item.customize_steps || item.customize_steps.length === 0) {
      addItemToCart(categoryId, itemId, {});
      return;
    }
    setActiveCategoryId(categoryId); setActiveItemId(itemId);
    setItemDraftSelections({}); setCustomizeStepIndex(0);
    setScreen('itemCustomize');
  }
  function goNextCustomizeStep() {
    if (isLastCustomizeStep) {
      addItemToCart(activeCategoryId, activeItemId, itemDraftSelections);
      setActiveCategoryId(null); setActiveItemId(null); setItemDraftSelections({}); setCustomizeStepIndex(0);
      setScreen('category');
    } else {
      setCustomizeStepIndex((i) => i + 1);
    }
  }
  function exitItemCustomize() {
    setActiveCategoryId(null); setActiveItemId(null); setItemDraftSelections({}); setCustomizeStepIndex(0);
    setScreen('category');
  }
  function removeFromCart(cartItemId) { setCart((prev) => removeCartLine(prev, cartItemId)); }
  function goToCartReview() { setScreen('cartReview'); }
  function goToPayment() { setScreen('payment'); }
  function completeOrder() { setScreen('complete'); }

  function goBack() {
    if (screen === 'storePicker') { setScreen('home'); return; }
    if (screen === 'diningOption') { setScreen('storePicker'); return; }
    if (screen === 'category') { setScreen('diningOption'); return; }
    if (screen === 'itemCustomize') {
      if (customizeStepIndex === 0) { exitItemCustomize(); } else { setCustomizeStepIndex((i) => i - 1); }
      return;
    }
    if (screen === 'cartReview') { setScreen('category'); return; }
    if (screen === 'payment') { setScreen('cartReview'); return; }
  }

  const font = { fontFamily: "'Poppins','Pretendard',-apple-system,sans-serif" };
  const isImmersive = mode === 'practice' && ['diningOption', 'itemCustomize', 'cartReview', 'payment'].includes(screen);
  const showTabs = ['home', 'orders', 'settings'].includes(screen);

  if (!ready) {
    return (
      <div style={{ background: app.bg, minHeight: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', ...font }}>
        <span style={{ fontSize: 14, color: app.inkSoft }}>불러오는 중…</span>
      </div>
    );
  }

  return (
    <div style={{ background: app.bg, minHeight: 480, display: 'flex', justifyContent: 'center', padding: '24px 0', ...font }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600&display=swap');`}</style>
      <div style={{ width: 360, background: isImmersive ? theme.bg : app.surface, borderRadius: 28, border: '1px solid ' + app.border, overflow: 'hidden', minHeight: 640, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, position: 'relative' }}>

          {screen === 'home' && (
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: fs(20), fontWeight: 600, color: app.ink, marginBottom: 4 }}>안녕하세요</div>
              <div style={{ fontSize: fs(13), color: app.inkSoft, marginBottom: 28 }}>어떻게 도와드릴까요?</div>
              <div onClick={() => pickMode('practice')} style={{ background: app.practiceSoft, borderRadius: 18, padding: 20, marginBottom: 14, cursor: 'pointer' }}>
                <div style={{ fontSize: fs(16), fontWeight: 600, color: app.practice, marginBottom: 4 }}>연습하기</div>
                <div style={{ fontSize: fs(13), color: app.ink }}>화면이 매장 기계와 똑같이 바뀌어요</div>
              </div>
              <div onClick={() => pickMode('realtime')} style={{ background: app.realtimeSoft, borderRadius: 18, padding: 20, cursor: 'pointer' }}>
                <div style={{ fontSize: fs(16), fontWeight: 600, color: app.realtime, marginBottom: 4 }}>지금 매장이에요</div>
                <div style={{ fontSize: fs(13), color: app.ink }}>키오스크 앞에서 실시간으로 안내받아요</div>
              </div>
              {savedOrders.length > 0 && (
                <>
                  <div style={{ fontSize: fs(13), color: app.inkSoft, margin: '20px 0 8px' }}>저장된 내 주문</div>
                  <div onClick={() => setScreen('orders')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: app.bg, borderRadius: 12, padding: 14, cursor: 'pointer', border: settings.highContrast ? '1px solid ' + app.border : 'none' }}>
                    <Heart style={{ width: 18, height: 18, color: app.highlight }} />
                    <span style={{ fontSize: fs(14), color: app.ink }}>{savedOrders[0].nickname} 외 {Math.max(savedOrders.length - 1, 0)}개</span>
                  </div>
                </>
              )}
            </div>
          )}

          {screen === 'storePicker' && (
            <div style={{ padding: 20 }}>
              <ArrowLeft onClick={goBack} style={{ width: 20, height: 20, color: app.inkSoft, cursor: 'pointer', marginBottom: 20 }} />
              <div style={{ fontSize: fs(20), fontWeight: 600, color: app.ink, marginBottom: 16 }}>매장을 선택하세요</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: app.bg, borderRadius: 12, padding: '12px 14px', marginBottom: 20, border: settings.highContrast ? '1px solid ' + app.border : 'none' }}>
                <Search style={{ width: 18, height: 18, color: app.inkSoft }} />
                <span style={{ fontSize: fs(14), color: app.inkSoft }}>매장 이름으로 검색</span>
              </div>
              <div style={{ fontSize: fs(13), color: app.inkSoft, marginBottom: 8 }}>가까운 매장</div>
              {Object.entries(CONTENT).map(([id, b]) => {
                const Icon = b.store.icon;
                return (
                  <div key={id} onClick={() => pickStore(id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, background: app.bg, borderRadius: 16, padding: 16, marginBottom: 12, cursor: 'pointer', border: settings.highContrast ? '1px solid ' + app.border : 'none' }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: b.store.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon style={{ width: 24, height: 24, color: '#fff' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: fs(16), fontWeight: 600, color: app.ink }}>{b.store.name}</div>
                      <div style={{ fontSize: fs(12), color: app.inkSoft }}>{b.store.sub}</div>
                    </div>
                    <ChevronRight style={{ width: 18, height: 18, color: app.inkSoft }} />
                  </div>
                );
              })}
            </div>
          )}

          {screen === 'diningOption' && mode === 'practice' && (
            <div style={{ minHeight: 640, display: 'flex', flexDirection: 'column', background: theme.bg }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 8 }}>
                <ArrowLeft onClick={goBack} style={{ width: 18, height: 18, color: theme.mute, cursor: 'pointer', flexShrink: 0, marginLeft: 10 }} />
                <div style={{ flex: 1 }}><StepTracker theme={theme} currentPhase={phaseIndexForScreen(screen)} /></div>
              </div>
              <div style={{ padding: '4px 20px 20px', flex: 1 }}>
                <div style={{ fontSize: fs(19), fontWeight: 600, color: theme.text, marginBottom: 16 }}>{brand.dining_options.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {brand.dining_options.options.map((opt) => (
                    <div key={opt.option_id} onClick={() => pickDiningOption(opt.option_id)}
                      style={{ background: theme.card, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', border: `1px solid ${theme.mute}44` }}>
                      <span style={{ fontSize: fs(15), fontWeight: 500, color: theme.text }}>{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {settings.voiceOn && (
                <div style={{ margin: '0 16px 16px', background: 'rgba(0,0,0,0.62)', color: '#fff', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: fs(12) }}>
                  <Volume2 style={{ width: 15, height: 15, flexShrink: 0 }} />
                  {brand.dining_options.voice_text}
                </div>
              )}
            </div>
          )}

          {screen === 'diningOption' && mode === 'realtime' && (
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <ArrowLeft onClick={goBack} style={{ width: 18, height: 18, color: app.inkSoft, cursor: 'pointer' }} />
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 6, background: app.realtimeSoft, color: app.realtime }}>실시간 안내</span>
              </div>
              <div style={{ fontSize: fs(17), fontWeight: 600, color: app.ink, marginBottom: 16 }}>{brand.dining_options.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                {brand.dining_options.options.map((opt) => (
                  <div key={opt.option_id} onClick={() => pickDiningOption(opt.option_id)}
                    style={{ minHeight: 52, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 4px', fontSize: fs(14), fontWeight: 500, cursor: 'pointer',
                      background: app.bg, border: '1px solid ' + app.border, color: app.ink }}>
                    <span>{opt.label}</span>
                  </div>
                ))}
              </div>
              {settings.voiceOn && (
                <div style={{ background: app.bg, borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Volume2 style={{ width: 18, height: 18, color: app.realtime, flexShrink: 0 }} />
                  <div style={{ fontSize: fs(12), color: app.inkSoft }}>{brand.dining_options.voice_text}</div>
                </div>
              )}
            </div>
          )}

          {screen === 'category' && mode === 'practice' && (
            <div style={{ minHeight: 640, display: 'flex', flexDirection: 'column', background: theme.bg }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 8 }}>
                <ArrowLeft onClick={goBack} style={{ width: 18, height: 18, color: theme.mute, cursor: 'pointer', flexShrink: 0, marginLeft: 10 }} />
                <div style={{ flex: 1 }}><StepTracker theme={theme} currentPhase={phaseIndexForScreen(screen)} /></div>
              </div>
              <div style={{ padding: '4px 20px 100px', flex: 1 }}>
                <div style={{ fontSize: fs(19), fontWeight: 600, color: theme.text, marginBottom: 16 }}>{brand.store.name}</div>
                {getCategories(brandId).map((cat) => (
                  <div key={cat.category_id} style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: fs(14), fontWeight: 600, color: theme.text, marginBottom: 10 }}>{cat.label}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: device.orientation === 'landscape' ? '1fr 1fr 1fr' : '1fr 1fr', gap: 10 }}>
                      {cat.items.map((item) => (
                        <div key={item.item_id} onClick={() => openItem(cat.category_id, item.item_id)}
                          style={{ background: theme.card, borderRadius: 12, padding: 10, textAlign: 'center', cursor: 'pointer', border: `1px solid ${theme.mute}33` }}>
                          <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 8, marginBottom: 8, background: theme.mute + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FoodIcon visual={item.visual} style={{ width: 26, height: 26, color: theme.mute }} />
                          </div>
                          <div style={{ fontSize: fs(12), fontWeight: 600, color: theme.text }}>{item.label}</div>
                          <div style={{ fontSize: fs(10), color: theme.mute, marginTop: 2 }}>{item.base_price.toLocaleString()}원</div>
                          {item.customize_steps.length === 0 && (
                            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: theme.accent, fontSize: fs(10), fontWeight: 700 }}>
                              <Plus style={{ width: 11, height: 11 }} /> 담기
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <CartBar theme={theme} app={app} cart={cart} mode={mode} onReview={goToCartReview} />
            </div>
          )}

          {screen === 'category' && mode === 'realtime' && (
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <ArrowLeft onClick={goBack} style={{ width: 18, height: 18, color: app.inkSoft, cursor: 'pointer' }} />
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 6, background: app.realtimeSoft, color: app.realtime }}>실시간 안내</span>
              </div>
              <div style={{ fontSize: fs(17), fontWeight: 600, color: app.ink, marginBottom: 4 }}>{brand.store.name}</div>
              <div style={{ fontSize: fs(12), color: app.inkSoft, marginBottom: 16 }}>지금 눈앞의 기계에서 메뉴를 고르고, 여기서도 같이 담아주세요</div>
              {getCategories(brandId).map((cat) => (
                <div key={cat.category_id} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: fs(13), fontWeight: 600, color: app.ink, marginBottom: 8 }}>{cat.label}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {cat.items.map((item) => (
                      <div key={item.item_id} onClick={() => openItem(cat.category_id, item.item_id)}
                        style={{ minWidth: '47%', flex: 1, borderRadius: 12, padding: '10px 12px', background: app.bg, border: '1px solid ' + app.border, cursor: 'pointer' }}>
                        <div style={{ fontSize: fs(13), fontWeight: 500, color: app.ink }}>{item.label}</div>
                        <div style={{ fontSize: fs(11), color: app.inkSoft }}>{item.base_price.toLocaleString()}원</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ height: cart.length > 0 ? 70 : 0 }} />
              <CartBar theme={theme} app={app} cart={cart} mode={mode} onReview={goToCartReview} />
            </div>
          )}

          {screen === 'itemCustomize' && mode === 'practice' && activeItem && customizeStep && (
            <div style={{ minHeight: 640, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 8 }}>
                <ArrowLeft onClick={exitItemCustomize} style={{ width: 18, height: 18, color: theme.mute, cursor: 'pointer', flexShrink: 0, marginLeft: 10 }} />
                <div style={{ flex: 1 }}><StepTracker theme={theme} currentPhase={phaseIndexForScreen(screen)} /></div>
              </div>

              <div style={{ padding: '4px 20px 190px', flex: 1 }}>
                <div style={{ fontSize: fs(13), color: theme.mute, marginBottom: 4 }}>{activeItem.label}</div>
                <div style={{ fontSize: fs(19), fontWeight: 600, color: theme.text, marginBottom: 4 }}>{customizeStep.title}</div>
                {customizeStep.max_selections !== undefined && (
                  <div style={{ fontSize: fs(12), color: theme.mute, marginBottom: 12 }}>{currentCustomizeSelection.length}/{customizeStep.max_selections} 선택</div>
                )}

                {customizeStep.type === 'binary_choice' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {customizeStep.options.map((opt) => {
                      const selected = currentCustomizeSelection.includes(opt.option_id);
                      return (
                        <div key={opt.option_id} onClick={() => toggleCustomizeOption(opt.option_id)}
                          style={{ background: selected ? theme.accent : theme.card, borderRadius: 12, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: selected ? 'none' : `1px solid ${theme.mute}44` }}>
                          <span style={{ fontSize: fs(15), fontWeight: selected ? 600 : 500, color: selected ? '#fff' : theme.text }}>{opt.label}</span>
                          {opt.price > 0 && <span style={{ fontSize: fs(12), color: selected ? '#fff' : theme.mute }}>{priceLabel(customizeStep, opt.price)}</span>}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: device.orientation === 'landscape' ? '1fr 1fr 1fr' : (customizeStep.options.length > 3 ? '1fr 1fr' : '1fr 1fr 1fr'), gap: 10 }}>
                    {customizeStep.options.map((opt) => {
                      const selected = currentCustomizeSelection.includes(opt.option_id);
                      const disabledByCap = !selected && isStepAtSelectionCap(customizeStep, currentCustomizeSelection);
                      return (
                        <div key={opt.option_id} onClick={() => !disabledByCap && toggleCustomizeOption(opt.option_id)}
                          style={{ background: theme.card, borderRadius: 12, padding: 10, textAlign: 'center', cursor: disabledByCap ? 'not-allowed' : 'pointer', opacity: disabledByCap ? 0.4 : 1, border: selected ? `2px solid ${theme.accent}` : `1px solid ${theme.mute}33` }}>
                          <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 8, marginBottom: 8, background: selected ? theme.accent + '22' : theme.mute + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FoodIcon visual={customizeStep.visual} style={{ width: 26, height: 26, color: selected ? theme.accent : theme.mute }} />
                          </div>
                          <div style={{ fontSize: fs(12), fontWeight: selected ? 700 : 500, color: theme.text }}>{opt.label}</div>
                          <div style={{ fontSize: fs(10), color: selected ? theme.accent : theme.mute, marginTop: 2 }}>{priceLabel(customizeStep, opt.price || 0)}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {settings.voiceOn && (
                <div style={{ position: 'absolute', left: 16, right: 16, bottom: 118, background: 'rgba(0,0,0,0.62)', color: '#fff', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: fs(12) }}>
                  <Volume2 style={{ width: 15, height: 15, flexShrink: 0 }} />
                  {customizeStep.voice_text}
                </div>
              )}

              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                <div style={{ background: theme.card, borderTop: `1px solid ${theme.mute}33`, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: fs(11), color: theme.mute }}>이 메뉴 가격</span>
                  <span style={{ fontSize: fs(17), fontWeight: 700, color: theme.text }}>{itemUnitPricePreview.toLocaleString()}원</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <button onClick={() => { setCustomizeStepIndex(0); setItemDraftSelections({}); }}
                    style={{ flex: 1, height: 58, background: theme.mute + '22', color: theme.text, border: 'none', fontSize: fs(13), fontWeight: 600, cursor: 'pointer' }}>취소</button>
                  <button onClick={() => setCustomizeStepIndex((i) => Math.max(0, i - 1))} disabled={customizeStepIndex === 0}
                    style={{ flex: 1, height: 58, background: 'transparent', color: theme.text, border: 'none', borderLeft: `1px solid ${theme.mute}33`, fontSize: fs(13), fontWeight: 600, cursor: customizeStepIndex === 0 ? 'not-allowed' : 'pointer', opacity: customizeStepIndex === 0 ? 0.4 : 1 }}>이전</button>
                  <button onClick={goNextCustomizeStep} disabled={!canProceedCustomize}
                    style={{ flex: 2, height: 58, background: canProceedCustomize ? theme.accent : theme.mute, color: '#fff', border: 'none', fontSize: fs(16), fontWeight: 700, cursor: canProceedCustomize ? 'pointer' : 'not-allowed' }}>
                    {isLastCustomizeStep ? '장바구니에 담기' : '다음'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {screen === 'itemCustomize' && mode === 'realtime' && activeItem && customizeStep && (
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <ArrowLeft onClick={goBack} style={{ width: 18, height: 18, color: app.inkSoft, cursor: 'pointer' }} />
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 6, background: app.realtimeSoft, color: app.realtime }}>실시간 안내</span>
                <div style={{ flex: 1, height: 6, background: app.bg, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${((customizeStepIndex + 1) / customizeSteps.length) * 100}%`, height: '100%', background: app.realtime }} />
                </div>
                <span style={{ fontSize: 11, color: app.inkSoft }}>{customizeStepIndex + 1}/{customizeSteps.length}</span>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: fs(13), color: app.inkSoft, marginBottom: 2 }}>{activeItem.label}</div>
                <div style={{ fontSize: fs(17), fontWeight: 600, color: app.ink, marginBottom: 4 }}>{customizeStep.title}</div>
                <div style={{ fontSize: fs(12), color: app.inkSoft, margin: '4px 0 4px' }}>지금 눈앞의 기계 화면에서 골라주세요</div>
                {customizeStep.max_selections !== undefined && (
                  <div style={{ fontSize: fs(12), color: app.inkSoft, marginBottom: 10 }}>{currentCustomizeSelection.length}/{customizeStep.max_selections} 선택</div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: customizeStep.type === 'binary_choice' ? '1fr' : '1fr 1fr', gap: 10 }}>
                  {customizeStep.options.map((opt) => {
                    const selected = currentCustomizeSelection.includes(opt.option_id);
                    const disabledByCap = !selected && isStepAtSelectionCap(customizeStep, currentCustomizeSelection);
                    return (
                      <div key={opt.option_id} onClick={() => !disabledByCap && toggleCustomizeOption(opt.option_id)}
                        style={{ minHeight: 52, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 4px', fontSize: fs(14), fontWeight: 500, cursor: disabledByCap ? 'not-allowed' : 'pointer', opacity: disabledByCap ? 0.4 : 1,
                          background: selected ? app.realtimeSoft : app.bg, border: selected ? '2px solid ' + app.realtime : '1px solid ' + app.border,
                          color: selected ? app.realtime : app.ink }}>
                        <span>{opt.label}</span>
                        {(opt.price || 0) > 0 && <span style={{ fontSize: fs(10), opacity: 0.8 }}>{priceLabel(customizeStep, opt.price)}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {settings.voiceOn && (
                <div style={{ background: app.bg, borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Volume2 style={{ width: 18, height: 18, color: app.realtime, flexShrink: 0 }} />
                  <div style={{ fontSize: fs(12), color: app.inkSoft }}>{customizeStep.voice_text}</div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <Button app={app} variant="ghost" style={{ flex: 1, border: '1px solid ' + app.border }} onClick={() => {}}>
                  <RotateCcw style={{ width: 15, height: 15 }} /> 다시 설명해줘
                </Button>
                <Button app={app} variant="outlineRealtime" style={{ flex: 1 }} onClick={() => setCalledStaff(true)}>
                  <User style={{ width: 15, height: 15 }} /> 직원 호출
                </Button>
              </div>
              {calledStaff && (
                <div style={{ fontSize: fs(12), color: app.realtime, background: app.realtimeSoft, borderRadius: 8, padding: '8px 10px', marginBottom: 10 }}>
                  직원을 호출했어요. 잠시만 기다려주세요.
                </div>
              )}

              <Button app={app} variant="realtime" disabled={!canProceedCustomize} onClick={goNextCustomizeStep} style={{ width: '100%' }}>
                {isLastCustomizeStep ? '장바구니에 담기' : '다음'}
              </Button>
            </div>
          )}

          {screen === 'cartReview' && mode === 'practice' && (
            <div style={{ minHeight: 640, display: 'flex', flexDirection: 'column', background: theme.bg }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 8 }}>
                <ArrowLeft onClick={goBack} style={{ width: 18, height: 18, color: theme.mute, cursor: 'pointer', flexShrink: 0, marginLeft: 10 }} />
                <div style={{ flex: 1 }}><StepTracker theme={theme} currentPhase={phaseIndexForScreen(screen)} /></div>
              </div>
              <div style={{ padding: '4px 20px 190px', flex: 1 }}>
                <div style={{ fontSize: fs(19), fontWeight: 600, color: theme.text, marginBottom: 16 }}>{confirmStep.title}</div>
                {cart.length === 0 ? (
                  <div style={{ fontSize: fs(13), color: theme.mute, textAlign: 'center', padding: '40px 0' }}>담긴 메뉴가 없어요.</div>
                ) : (
                  <div style={{ background: theme.card, borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {cart.map((line) => (
                      <div key={line.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: fs(14), fontWeight: 600, color: theme.text }}>{line.label}{line.qty > 1 ? ` x${line.qty}` : ''}</div>
                          {line.optionLabels.length > 0 && <div style={{ fontSize: fs(12), color: theme.mute }}>{line.optionLabels.join(', ')}</div>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: fs(13), color: theme.text }}>{line.lineTotal.toLocaleString()}원</span>
                          <Trash2 onClick={() => removeFromCart(line.cartItemId)} style={{ width: 16, height: 16, color: theme.mute, cursor: 'pointer' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {settings.voiceOn && (
                <div style={{ position: 'absolute', left: 16, right: 16, bottom: 158, background: 'rgba(0,0,0,0.62)', color: '#fff', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: fs(12) }}>
                  <Volume2 style={{ width: 15, height: 15, flexShrink: 0 }} />
                  {confirmStep.voice_text}
                </div>
              )}
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                <div style={{ background: theme.card, borderTop: `1px solid ${theme.mute}33`, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: fs(11), color: theme.mute }}>주문 금액</span>
                  <span style={{ fontSize: fs(17), fontWeight: 700, color: theme.text }}>{total.toLocaleString()}원</span>
                </div>
                <div style={{ display: 'flex' }}>
                  <button onClick={() => setScreen('category')}
                    style={{ flex: 1, height: 58, background: theme.mute + '22', color: theme.text, border: 'none', fontSize: fs(13), fontWeight: 600, cursor: 'pointer' }}>메뉴 더 담기</button>
                  <button onClick={goToPayment} disabled={cart.length === 0}
                    style={{ flex: 2, height: 58, background: cart.length === 0 ? theme.mute : theme.accent, color: '#fff', border: 'none', fontSize: fs(16), fontWeight: 700, cursor: cart.length === 0 ? 'not-allowed' : 'pointer' }}>
                    결제하러 가기
                  </button>
                </div>
              </div>
            </div>
          )}

          {screen === 'cartReview' && mode === 'realtime' && (
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <ArrowLeft onClick={goBack} style={{ width: 18, height: 18, color: app.inkSoft, cursor: 'pointer' }} />
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 6, background: app.realtimeSoft, color: app.realtime }}>실시간 안내</span>
              </div>
              <div style={{ fontSize: fs(17), fontWeight: 600, color: app.ink, marginBottom: 12 }}>{confirmStep.title}</div>
              {cart.length === 0 ? (
                <div style={{ fontSize: fs(13), color: app.inkSoft, textAlign: 'center', padding: '30px 0' }}>담긴 메뉴가 없어요.</div>
              ) : (
                <div style={{ background: app.bg, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                  {cart.map((line) => (
                    <div key={line.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: fs(13), fontWeight: 500, color: app.ink }}>{line.label}{line.qty > 1 ? ` x${line.qty}` : ''}</div>
                        {line.optionLabels.length > 0 && <div style={{ fontSize: fs(11), color: app.inkSoft }}>{line.optionLabels.join(', ')}</div>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: fs(13), color: app.inkSoft }}>{line.lineTotal.toLocaleString()}원</span>
                        <Trash2 onClick={() => removeFromCart(line.cartItemId)} style={{ width: 15, height: 15, color: app.inkSoft, cursor: 'pointer' }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs(14), fontWeight: 700, borderTop: '1px solid ' + app.border, paddingTop: 8, marginTop: 2 }}>
                    <span style={{ color: app.ink }}>합계</span><span style={{ color: app.ink }}>{total.toLocaleString()}원</span>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <Button app={app} variant="ghost" style={{ flex: 1, border: '1px solid ' + app.border }} onClick={() => setScreen('category')}>
                  메뉴 더 담기
                </Button>
                <Button app={app} variant="realtime" disabled={cart.length === 0} style={{ flex: 2 }} onClick={goToPayment}>
                  결제하러 가기
                </Button>
              </div>
            </div>
          )}

          {screen === 'payment' && mode === 'practice' && paymentStep && (
            <div style={{ minHeight: 640, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 8 }}>
                <ArrowLeft onClick={goBack} style={{ width: 18, height: 18, color: theme.mute, cursor: 'pointer', flexShrink: 0, marginLeft: 10 }} />
                <div style={{ flex: 1 }}><StepTracker theme={theme} currentPhase={phaseIndexForScreen(screen)} /></div>
              </div>
              <div style={{ padding: '4px 20px 100px', flex: 1 }}>
                <div style={{ fontSize: fs(19), fontWeight: 600, color: theme.text, marginBottom: 16 }}>{paymentStep.title}</div>
                <div style={{ fontSize: fs(13), color: theme.mute, marginBottom: 14 }}>결제 금액 <b style={{ color: theme.text }}>{total.toLocaleString()}원</b></div>
                <div style={{ display: 'grid', gridTemplateColumns: device.orientation === 'landscape' ? '1fr 1fr' : '1fr', gap: 10 }}>
                  {paymentStep.options.map((opt) => (
                    <div key={opt.option_id} onClick={completeOrder}
                      style={{ background: theme.card, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', border: `1px solid ${theme.mute}44` }}>
                      <span style={{ color: theme.text }}><PaymentIcon icon={opt.icon} style={{ width: 20, height: 20 }} /></span>
                      <span style={{ fontSize: fs(15), fontWeight: 500, color: theme.text }}>{opt.label}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, fontSize: fs(11), color: theme.mute }}>연습 모드입니다. 실제 결제는 진행되지 않아요.</div>
              </div>
              {settings.voiceOn && (
                <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16, background: 'rgba(0,0,0,0.62)', color: '#fff', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: fs(12) }}>
                  <Volume2 style={{ width: 15, height: 15, flexShrink: 0 }} />
                  {paymentStep.voice_text}
                </div>
              )}
            </div>
          )}

          {screen === 'payment' && mode === 'realtime' && paymentStep && (
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <ArrowLeft onClick={goBack} style={{ width: 18, height: 18, color: app.inkSoft, cursor: 'pointer' }} />
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 6, background: app.realtimeSoft, color: app.realtime }}>실시간 안내</span>
              </div>
              <div style={{ fontSize: fs(17), fontWeight: 600, color: app.ink, marginBottom: 4 }}>{paymentStep.title}</div>
              <div style={{ fontSize: fs(12), color: app.inkSoft, margin: '4px 0 14px' }}>지금 눈앞의 기계에서 결제를 진행해주세요. 합계 {total.toLocaleString()}원</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                {paymentStep.options.map((opt) => (
                  <div key={opt.option_id} style={{ minHeight: 52, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, background: app.bg, border: '1px solid ' + app.border }}>
                    <PaymentIcon icon={opt.icon} style={{ width: 18, height: 18, color: app.ink }} />
                    <span style={{ fontSize: fs(13), color: app.ink }}>{opt.label}</span>
                  </div>
                ))}
              </div>
              {settings.voiceOn && (
                <div style={{ background: app.bg, borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Volume2 style={{ width: 18, height: 18, color: app.realtime, flexShrink: 0 }} />
                  <div style={{ fontSize: fs(12), color: app.inkSoft }}>{paymentStep.voice_text}</div>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <Button app={app} variant="ghost" style={{ flex: 1, border: '1px solid ' + app.border }} onClick={() => {}}>
                  <RotateCcw style={{ width: 15, height: 15 }} /> 다시 설명해줘
                </Button>
                <Button app={app} variant="outlineRealtime" style={{ flex: 1 }} onClick={() => setCalledStaff(true)}>
                  <User style={{ width: 15, height: 15 }} /> 직원 호출
                </Button>
              </div>
              {calledStaff && (
                <div style={{ fontSize: fs(12), color: app.realtime, background: app.realtimeSoft, borderRadius: 8, padding: '8px 10px', marginBottom: 10 }}>
                  직원을 호출했어요. 잠시만 기다려주세요.
                </div>
              )}
              <Button app={app} variant="realtime" onClick={completeOrder} style={{ width: '100%' }}>완료</Button>
            </div>
          )}

          {screen === 'complete' && (
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: 500, justifyContent: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: mode === 'practice' ? app.practiceSoft : app.realtimeSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Check style={{ width: 28, height: 28, color: mode === 'practice' ? app.practice : app.realtime }} />
              </div>
              <div style={{ fontSize: fs(18), fontWeight: 600, color: app.ink, marginBottom: 6 }}>
                {mode === 'practice' ? '연습을 완료했어요' : '주문을 완료했어요'}
              </div>
              <div style={{ fontSize: fs(13), color: app.inkSoft, marginBottom: 8, lineHeight: 1.6 }}>
                {cartSummaryLine(cart)}
              </div>
              <div style={{ fontSize: fs(15), color: app.ink, fontWeight: 700, marginBottom: 20 }}>총 {total.toLocaleString()}원</div>
              {!savedThisRun ? (
                <>
                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="이 조합 이름 (예: 내가 좋아하는 조합)"
                    style={{ width: '100%', height: 44, borderRadius: 10, border: '1px solid ' + app.border, padding: '0 12px', fontSize: fs(13), marginBottom: 10, boxSizing: 'border-box', color: app.ink, background: app.surface }}
                  />
                  <Button app={app} variant="primary" style={{ width: '100%', marginBottom: 10 }} onClick={saveCurrentOrder}>
                    <Heart style={{ width: 16, height: 16 }} /> 내 주문으로 저장
                  </Button>
                </>
              ) : (
                <div style={{ fontSize: fs(13), color: app.practice, marginBottom: 10 }}>저장했어요</div>
              )}
              <Button app={app} variant="ghost" style={{ width: '100%' }} onClick={() => setScreen('home')}>
                <HomeIcon style={{ width: 16, height: 16 }} /> 홈으로
              </Button>
            </div>
          )}

          {screen === 'orders' && (
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: fs(19), fontWeight: 600, color: app.ink, marginBottom: 16 }}>내 주문</div>
              {savedOrders.length === 0 && (
                <div style={{ fontSize: fs(13), color: app.inkSoft, textAlign: 'center', padding: '40px 0' }}>
                  아직 저장된 주문이 없어요.<br />연습을 완료하면 여기에 저장할 수 있어요.
                </div>
              )}
              {savedOrders.map((o) => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: app.bg, borderRadius: 12, padding: 14, marginBottom: 10, border: settings.highContrast ? '1px solid ' + app.border : 'none' }}>
                  <ClipboardCheck style={{ width: 18, height: 18, color: app.practice, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: fs(14), fontWeight: 600, color: app.ink }}>{o.nickname}</div>
                    <div style={{ fontSize: fs(11), color: app.inkSoft, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.storeName} · {cartSummaryLine(o.cart)}</div>
                  </div>
                  <Trash2 onClick={() => deleteOrder(o.id)} style={{ width: 17, height: 17, color: app.inkSoft, cursor: 'pointer', flexShrink: 0 }} />
                </div>
              ))}
            </div>
          )}

          {screen === 'settings' && (
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: fs(19), fontWeight: 600, color: app.ink, marginBottom: 20 }}>설정</div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Type style={{ width: 16, height: 16, color: app.inkSoft }} />
                  <span style={{ fontSize: fs(13), color: app.inkSoft }}>글씨 크기</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[{ label: '작게', v: 0.9 }, { label: '보통', v: 1 }, { label: '크게', v: 1.2 }].map((opt) => (
                    <div key={opt.label} onClick={() => updateSettings({ fontScale: opt.v })}
                      style={{ flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 10, cursor: 'pointer', fontSize: fs(13),
                        background: settings.fontScale === opt.v ? app.practiceSoft : app.bg,
                        color: settings.fontScale === opt.v ? app.practice : app.ink,
                        border: settings.fontScale === opt.v ? '1px solid ' + app.practice : '1px solid transparent' }}>
                      {opt.label}
                    </div>
                  ))}
                </div>
              </div>
              <div onClick={() => updateSettings({ voiceOn: !settings.voiceOn })}
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: app.bg, borderRadius: 12, padding: 14, marginBottom: 12, cursor: 'pointer' }}>
                {settings.voiceOn ? <Volume2 style={{ width: 18, height: 18, color: app.practice }} /> : <VolumeX style={{ width: 18, height: 18, color: app.inkSoft }} />}
                <span style={{ flex: 1, fontSize: fs(14), color: app.ink }}>음성 안내</span>
                <div style={{ width: 40, height: 24, borderRadius: 12, background: settings.voiceOn ? app.practice : app.border, position: 'relative' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: settings.voiceOn ? 19 : 3 }} />
                </div>
              </div>
              <div onClick={() => updateSettings({ highContrast: !settings.highContrast })}
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: app.bg, borderRadius: 12, padding: 14, cursor: 'pointer' }}>
                <Eye style={{ width: 18, height: 18, color: settings.highContrast ? app.practice : app.inkSoft }} />
                <span style={{ flex: 1, fontSize: fs(14), color: app.ink }}>고대비 모드</span>
                <div style={{ width: 40, height: 24, borderRadius: 12, background: settings.highContrast ? app.practice : app.border, position: 'relative' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: settings.highContrast ? 19 : 3 }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {showTabs && (
          <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid ' + app.border, padding: '10px 0' }}>
            {[
              { id: 'home', label: '홈', Icon: HomeIcon },
              { id: 'orders', label: '내 주문', Icon: List },
              { id: 'settings', label: '설정', Icon: SettingsIcon },
            ].map((t) => (
              <div key={t.id} onClick={() => setScreen(t.id)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: screen === t.id ? app.practice : app.inkSoft, cursor: 'pointer' }}>
                <t.Icon style={{ width: 20, height: 20 }} />
                <span style={{ fontSize: 10 }}>{t.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
