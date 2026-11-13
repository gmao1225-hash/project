// 샘플 데이터입니다. 실제 식당 정보로 교체해서 사용하세요.
// price: 1인 평균 가격(원), rating: 5점 만점, tags: 자유 태그
const RESTAURANTS = [
  { id: 1,  name: "할매손칼국수",   category: "한식", area: "종로", price: 8000,  rating: 4.6, reviews: 312, emoji: "🍜", tags: ["가성비", "혼밥", "웨이팅"], desc: "직접 뽑은 면과 진한 멸치 육수. 김치 리필 무한.", hours: "10:30 - 20:00", value: true },
  { id: 2,  name: "숯불연탄구이",   category: "한식", area: "을지로", price: 18000, rating: 4.7, reviews: 528, emoji: "🥩", tags: ["맛집", "회식", "노포"], desc: "연탄불에 굽는 돼지갈비. 저녁엔 줄이 깁니다.", hours: "16:00 - 24:00", value: false },
  { id: 3,  name: "백반의정석",     category: "한식", area: "마포", price: 7000,  rating: 4.4, reviews: 190, emoji: "🍚", tags: ["가성비", "혼밥", "반찬맛집"], desc: "매일 바뀌는 반찬 8가지에 찌개까지 7천원.", hours: "11:00 - 15:00", value: true },
  { id: 4,  name: "스시하루",       category: "일식", area: "강남", price: 35000, rating: 4.8, reviews: 402, emoji: "🍣", tags: ["맛집", "데이트", "예약필수"], desc: "점심 오마카세가 합리적인 가격. 셰프 추천 코스.", hours: "12:00 - 22:00", value: false },
  { id: 5,  name: "돈카츠공방",     category: "일식", area: "홍대", price: 11000, rating: 4.5, reviews: 276, emoji: "🍱", tags: ["가성비", "혼밥"], desc: "두툼한 등심카츠, 밥과 양배추 무한 리필.", hours: "11:30 - 21:00", value: true },
  { id: 6,  name: "라멘야마",       category: "일식", area: "합정", price: 10000, rating: 4.3, reviews: 158, emoji: "🍥", tags: ["혼밥", "웨이팅"], desc: "돈코츠 베이스의 진한 국물. 면 추가 무료.", hours: "11:00 - 21:30", value: true },
  { id: 7,  name: "홍콩반점가",     category: "중식", area: "신촌", price: 7500,  rating: 4.2, reviews: 341, emoji: "🥟", tags: ["가성비", "배달"], desc: "짜장면 5천원대, 탕수육 소자도 저렴해요.", hours: "11:00 - 22:00", value: true },
  { id: 8,  name: "마라천국",       category: "중식", area: "건대", price: 14000, rating: 4.5, reviews: 489, emoji: "🌶️", tags: ["맛집", "매운맛"], desc: "재료를 골라 담는 마라탕과 꿔바로우 맛집.", hours: "11:00 - 23:00", value: false },
  { id: 9,  name: "파스타리아",     category: "양식", area: "성수", price: 19000, rating: 4.6, reviews: 233, emoji: "🍝", tags: ["맛집", "데이트", "분위기"], desc: "생면 파스타와 화덕 피자. 와인 페어링 추천.", hours: "11:30 - 22:00", value: false },
  { id: 10, name: "버거스탠드",     category: "양식", area: "이태원", price: 12000, rating: 4.4, reviews: 367, emoji: "🍔", tags: ["맛집", "혼밥"], desc: "스매시 패티에 수제 번. 감자튀김이 별미.", hours: "11:00 - 22:00", value: true },
  { id: 11, name: "김밥천사",       category: "분식", area: "노원", price: 5000,  rating: 4.1, reviews: 122, emoji: "🍙", tags: ["가성비", "혼밥", "포장"], desc: "속이 꽉 찬 김밥 3천원, 떡볶이와 세트 추천.", hours: "07:00 - 21:00", value: true },
  { id: 12, name: "국물떡볶이집",   category: "분식", area: "신림", price: 6000,  rating: 4.5, reviews: 298, emoji: "🍢", tags: ["가성비", "노포", "매운맛"], desc: "30년 된 국물떡볶이, 튀김을 국물에 찍어 드세요.", hours: "12:00 - 21:00", value: true },
  { id: 13, name: "쌀국수포",       category: "아시안", area: "용산", price: 9500,  rating: 4.3, reviews: 177, emoji: "🍲", tags: ["가성비", "혼밥"], desc: "푸짐한 양지 쌀국수, 숙주와 고수 셀프.", hours: "10:30 - 21:00", value: true },
  { id: 14, name: "방콕키친",       category: "아시안", area: "연남", price: 16000, rating: 4.6, reviews: 214, emoji: "🍛", tags: ["맛집", "데이트"], desc: "현지 셰프가 만드는 팟타이와 그린커리.", hours: "11:30 - 21:30", value: false },
  { id: 15, name: "동네빵집 온기",  category: "카페", area: "망원", price: 6500,  rating: 4.7, reviews: 386, emoji: "🥐", tags: ["맛집", "디저트", "웨이팅"], desc: "아침마다 굽는 소금빵이 오전에 품절돼요.", hours: "08:00 - 19:00", value: true },
  { id: 16, name: "순대국명가",     category: "한식", area: "영등포", price: 9000,  rating: 4.5, reviews: 445, emoji: "🥘", tags: ["가성비", "해장", "24시"], desc: "잡내 없는 진한 국물, 머릿고기 푸짐.", hours: "24시간", value: true },
];
