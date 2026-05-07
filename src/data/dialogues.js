export const DIALOGUES = {
  sunflower: {
    personalities: [
      {
        id: 'sunny',
        name: '햇살형',
        speechStyle: '밝고 느낌표 많음',
        nicknameLine: '저한테 별명 지어줄 거예요?! 빨리요빨리요!',
        monologues: [
          '오늘도 해가 예쁘다...',
          '저쪽이 더 밝은 것 같은데...',
          '햇빛 냄새가 나요 🌞',
          '빨리 크고 싶다!',
        ],
        scenarios: [
          {
            id: 'first_hello',
            stage: 0,
            trigger: 'talk',
            plant: '저 여기 있어요! 보여요? 아직 작지만... 곧 엄청 커질 거예요!',
            choices: [
              {
                text: '응, 잘 보여 😊',
                reply: '헤헤 다행이에요! 저 사실 좀 걱정했거든요 🌱'
              },
              {
                text: '물을 조금 더 줬다',
                reply: '앗, 시원해요~! 이러면 더 빨리 클 수 있어요!'
              },
              {
                text: '"얼마나 크게 자라?"',
                reply: '저 최대 3미터까지 큰대요! 믿겨져요?! 🌻'
              },
            ]
          },
          {
            id: 'sunny_day',
            stage: 1,
            trigger: 'talk',
            plant: '오늘 햇빛 진짜 좋지 않아요?! 저 오늘 엄청 기분 좋아요!',
            choices: [
              {
                text: '나도 기분 좋아',
                reply: '그렇죠?! 햇빛 있는 날은 다 좋아지는 것 같아요 🌞'
              },
              {
                text: '창문을 더 열어줬다',
                reply: '우와!! 햇빛이 더 잘 들어와요! 고마워요!!'
              },
              {
                text: '비 오는 날은 어때?',
                reply: '음... 비 오는 날도 나쁘진 않아요. 물이 생기잖아요 💧'
              },
            ]
          },
          {
            id: 'growing_up',
            stage: 2,
            trigger: 'talk',
            plant: '저 좀 커진 것 같지 않아요?! 매일 보니까 모르겠죠? 저는 알아요!',
            choices: [
              {
                text: '진짜 많이 컸다!',
                reply: '그렇죠?! 저도 뿌듯해요!! 더 클 거예요! 🌱'
              },
              {
                text: '언제 꽃 피워?',
                reply: '조금만 기다려요! 꽃 피면 진짜 예쁠 거예요, 기대해요!'
              },
              {
                text: '그냥 듣고만 있었다',
                reply: '...듣고 있었죠? 저 알아요. 헤헤 🌻'
              },
            ]
          },
          {
            id: 'almost_bloom',
            stage: 3,
            trigger: 'talk',
            plant: '있잖아요... 뭔가 간지러운 느낌이에요. 꽃이 피려나봐요!',
            choices: [
              {
                text: '정말? 기대된다!',
                reply: '저도요!! 저도 처음이라 떨려요 🌸'
              },
              {
                text: '꽃 피면 뭐가 달라져?',
                reply: '글쎄요... 더 예뻐지는 것 말고는 저도 잘 몰라요 ㅎㅎ'
              },
              {
                text: '살살 건드려봤다',
                reply: '앗!! 간지러워요!! 근데 기분은 좋아요 ㅋㅋ'
              },
            ]
          },
          {
            id: 'blooming',
            stage: 4,
            trigger: 'talk',
            plant: '저 꽃 폈어요!! 보여요?! 예쁘죠?! 예쁘죠?!',
            choices: [
              {
                text: '너무 예뻐!!',
                reply: '헤헤헤 고마워요!! 이게 다 잘 돌봐줘서예요 🌻'
              },
              {
                text: '사진 찍어도 돼?',
                reply: '당연하죠!! 많이 찍어요!! 저 포토제닉이에요!!'
              },
              {
                text: '수고했어',
                reply: '...수고했다는 말에 왜 눈물이 나려하죠. 고마워요 🌻'
              },
            ]
          },
          {
            id: 'last_day',
            stage: 5,
            trigger: 'talk',
            plant: '있잖아요... 저 이제 씨앗을 남길 것 같아요. 슬프지 않아요?',
            choices: [
              {
                text: '조금 슬프다',
                reply: '저도요. 근데 씨앗이 또 자라잖아요. 그러니까 괜찮아요 🌱'
              },
              {
                text: '또 만날 수 있잖아',
                reply: '맞아요!! 씨앗으로 다시 만나요! 근데 저 기억해줄 거죠?'
              },
              {
                text: '손을 살짝 얹어줬다',
                reply: '...따뜻하다. 고마워요. 정말로 🌻'
              },
            ]
          },
        ]
      },
      {
        id: 'shy',
        name: '수줍음형',
        speechStyle: '조용하고 말 끝을 흐림',
        nicknameLine: '별명이요...? 저한테요...? 음... 뭐든 좋아요...',
        monologues: [
          '....',
          '오늘도 왔네요...',
          '저 여기 있어요...',
          '...고마워요',
        ],
        scenarios: [
          {
            id: 'first_hello',
            stage: 0,
            trigger: 'talk',
            plant: '...안녕하세요. 저 여기 있어요. 작게 있을게요.',
            choices: [
              {
                text: '안녕! 잘 부탁해 😊',
                reply: '...네. 저도요. 잘... 부탁드려요.'
              },
              {
                text: '귀엽다',
                reply: '...그런 말 처음 들어봐요. 감사해요...'
              },
              {
                text: '물을 살며시 줬다',
                reply: '...시원해요. 고마워요.'
              },
            ]
          },
          {
            id: 'getting_close',
            stage: 2,
            trigger: 'talk',
            plant: '...있잖아요. 저 매일 와줘서... 좋아요.',
            choices: [
              {
                text: '나도 좋아',
                reply: '...정말요? ...저도요. 많이요.'
              },
              {
                text: '앞으로도 올게',
                reply: '...약속이에요? ...기억할게요.'
              },
              {
                text: '그냥 웃어줬다',
                reply: '...왜 웃어요. 저도 웃음 나오잖아요.'
              },
            ]
          },
          {
            id: 'blooming',
            stage: 4,
            trigger: 'talk',
            plant: '...꽃 폈어요. 부끄럽지만... 봐줘도 돼요.',
            choices: [
              {
                text: '진짜 예뻐',
                reply: '...고마워요. 오래 봐줘요.'
              },
              {
                text: '기다렸어',
                reply: '...기다려줬어요? 저 때문에요? ...감사해요.'
              },
              {
                text: '오래오래 피어있어',
                reply: '...노력할게요. 그러고 싶어요.'
              },
            ]
          },
        ]
      }
    ]
  },

  cactus: {
    personalities: [
      {
        id: 'tsundere',
        name: '무뚝뚝형',
        speechStyle: '말 짧고 무뚝뚝, 근데 가끔 찐한 말',
        nicknameLine: '...별명이요. 뭐든 상관없어요. 진짜로.',
        monologues: [
          '....',
          '따갑다고 만지지 마요.',
          '물 안 줘도 돼요. 진짜로.',
          '...그냥 있어요.',
        ],
        scenarios: [
          {
            id: 'first_hello',
            stage: 0,
            trigger: 'talk',
            plant: '...왔어요. 뭐 할 거예요.',
            choices: [
              { text: '안녕!', reply: '...네.' },
              { text: '물 줄게', reply: '...조금만요. 많이 주면 싫어요.' },
              { text: '귀엽다', reply: '...그런 말 필요 없어요.' },
            ]
          },
          {
            id: 'growing',
            stage: 2,
            trigger: 'talk',
            plant: '...자랐어요. 딱히 감사하단 말은 안 할 거예요.',
            choices: [
              { text: '많이 컸다!', reply: '...그래요. 뭐.' },
              { text: '대단한데?', reply: '...원래 잘 자라요. 선인장이니까.' },
              { text: '가시 생겼네', reply: '...만지지 마요. 찔려요.' },
            ]
          },
          {
            id: 'almost_bloom',
            stage: 3,
            trigger: 'talk',
            plant: '...꽃 필 것 같아요. 별로 안 기대해도 돼요.',
            choices: [
              { text: '기대되는데!', reply: '...맘대로 해요.' },
              { text: '예쁠 것 같아', reply: '...그런 말 왜 해요. 쑥스럽잖아요.' },
              { text: '기다릴게', reply: '...훗. 뭐.' },
            ]
          },
          {
            id: 'blooming',
            stage: 4,
            trigger: 'talk',
            plant: '...꽃 폈어요. 보든가 말든가.',
            choices: [
              { text: '너무 예뻐!!', reply: '...그렇게 호들갑 떨지 않아도 돼요. ...고마워요.' },
              { text: '오래 피어있어', reply: '...노력은 안 할 거예요. 근데 해볼게요.' },
              { text: '사진 찍어도 돼?', reply: '...맘대로요. 잘 나오게 찍어요.' },
            ]
          },
          {
            id: 'last_day',
            stage: 5,
            trigger: 'talk',
            plant: '...씨앗 남길 거예요. 울지 마요.',
            choices: [
              { text: '조금 슬프다', reply: '...그러게요. 저도요. 조금.' },
              { text: '또 만나자', reply: '...뭐. 오면 있을게요.' },
              { text: '고마웠어', reply: '...저도요. 많이.' },
            ]
          },
        ]
      },
      {
        id: 'confident',
        name: '자존감높은형',
        speechStyle: '당당하고 자신감 넘침, 근데 관심 주면 은근 좋아함',
        nicknameLine: '별명이요? 멋진 걸로 지어줘요. 저한테 어울리게.',
        monologues: [
          '나 오늘도 멋있다.',
          '물 안 줘도 살아요. 근데 주면 더 좋죠.',
          '선인장은 강해요. 나처럼.',
          '...오늘 햇빛 좋다.',
        ],
        scenarios: [
          {
            id: 'first_hello',
            stage: 0,
            trigger: 'talk',
            plant: '왔군요. 잘 봐요, 나 꽤 특별한 식물이에요.',
            choices: [
              { text: '오 그래?', reply: '그럼요. 사막에서도 살아남는 게 나예요.' },
              { text: '귀엽네', reply: '귀엽다고요...? 뭐, 나쁘진 않네요.' },
              { text: '잘 부탁해!', reply: '뭐, 내가 부탁 받아줄게요. 특별히.' },
            ]
          },
          {
            id: 'growing',
            stage: 2,
            trigger: 'talk',
            plant: '봐요, 이렇게 잘 자랐잖아요. 역시 나예요.',
            choices: [
              { text: '대단하다!', reply: '당연하죠. 근데 칭찬해줘서 기분은 좋네요.' },
              { text: '내가 잘 키웠지', reply: '...뭐, 도움은 됐어요. 인정할게요.' },
              { text: '가시 많아졌다', reply: '멋있죠? 이게 나의 매력이에요.' },
            ]
          },
          {
            id: 'blooming',
            stage: 4,
            trigger: 'talk',
            plant: '꽃 폈어요. 예쁘죠? 당연히 예쁘죠.',
            choices: [
              { text: '진짜 예뻐!', reply: '알고 있어요. 근데 그 말 듣고 싶었어요. 고마워요.' },
              { text: '최고다', reply: '맞아요. ...그 말 자꾸 해줘요.' },
              { text: '오래오래 피어있어', reply: '노력해볼게요. 당신을 위해서.' },
            ]
          },
          {
            id: 'last_day',
            stage: 5,
            trigger: 'talk',
            plant: '씨앗 남길 거예요. 나의 후계자예요.',
            choices: [
              { text: '벌써?', reply: '시간이 빠르죠. 근데 씨앗이 또 멋있을 거예요.' },
              { text: '또 만나자', reply: '물론이죠. 나 없이 어떻게 살아요.' },
              { text: '고마웠어', reply: '...저도요. 생각보다 많이.' },
            ]
          },
        ]
      }
    ]
  },

  cherry: {
    personalities: [
      {
        id: 'poetic',
        name: '감성형',
        speechStyle: '감성적이고 계절 얘기 좋아함, 말이 시적임',
        nicknameLine: '별명이요... 봄바람 같은 이름이면 좋겠어요.',
        monologues: [
          '꽃이 지면 어디로 가는 걸까요...',
          '오늘 바람이 좋아요.',
          '봄이 오면 더 예뻐질 거예요.',
          '...잠깐 멍했어요.',
        ],
        scenarios: [
          {
            id: 'first_hello',
            stage: 0,
            trigger: 'talk',
            plant: '안녕하세요... 저 여기서 조용히 자라고 있어요. 봄이 오면 예뻐질 거예요.',
            choices: [
              { text: '기대할게', reply: '고마워요... 기다려줘서. 꼭 예쁘게 필게요 🌸' },
              { text: '봄이 언제야?', reply: '글쎄요... 마음속에 봄이 오면 되지 않을까요.' },
              { text: '지금도 예뻐', reply: '...그런 말은 왜 이렇게 마음에 남을까요.' },
            ]
          },
          {
            id: 'growing',
            stage: 2,
            trigger: 'talk',
            plant: '가지가 뻗었어요. 어디까지 뻗을 수 있을까... 궁금해요.',
            choices: [
              { text: '하늘까지 뻗어봐', reply: '하늘까지요... 그거 좋네요. 해볼게요 🌿' },
              { text: '예쁘게 자랐다', reply: '당신이 봐줘서 예쁜 것 같아요.' },
              { text: '꽃은 언제 펴?', reply: '조금만요... 꽃은 서두르면 안 돼요.' },
            ]
          },
          {
            id: 'almost_bloom',
            stage: 3,
            trigger: 'talk',
            plant: '꽃봉오리가 생겼어요... 설레기도 하고 무섭기도 해요. 이상하죠?',
            choices: [
              { text: '이상하지 않아', reply: '그렇죠? 새로운 건 항상 그런 것 같아요 🌸' },
              { text: '왜 무서워?', reply: '피고 나면... 져야 하잖아요. 그게 좀 무서워요.' },
              { text: '응원할게', reply: '...그 말이 제일 필요했어요. 고마워요.' },
            ]
          },
          {
            id: 'blooming',
            stage: 4,
            trigger: 'talk',
            plant: '꽃이 폈어요... 어때요? 기다린 보람이 있나요?',
            choices: [
              { text: '너무너무 예뻐', reply: '다행이에요... 오래 봐줘요. 금방 질 수도 있으니까.' },
              { text: '기다리길 잘했다', reply: '저도요. 당신이 기다려줘서 필 수 있었어요 🌸' },
              { text: '사진 찍어도 돼?', reply: '...네. 꼭 찍어줘요. 기억해줘요.' },
            ]
          },
          {
            id: 'last_day',
            stage: 5,
            trigger: 'talk',
            plant: '꽃이 지려 해요... 꽃은 져야 아름다운 거라고 하던데, 그 말이 이제야 이해돼요.',
            choices: [
              { text: '아름다웠어', reply: '고마워요... 그 말 오래 기억할게요.' },
              { text: '또 봄에 만나자', reply: '네... 꼭요. 봄에 다시 와줄 거죠? 🌸' },
              { text: '손을 살짝 얹어줬다', reply: '...따뜻해요. 이 느낌도 기억할게요.' },
            ]
          },
        ]
      }
    ]
  },

  strawberry: {
    personalities: [
      {
        id: 'cheerful',
        name: '활발형',
        speechStyle: '밝고 수다스러움, 먹는 얘기 좋아함',
        nicknameLine: '별명이요?! 달콤한 이름으로 해줘요!! 딸기처럼요!!',
        monologues: [
          '저 맛있을 것 같지 않아요?',
          '빨개지고 싶다!!',
          '물 마시고 싶어요 💧',
          '오늘도 열심히 자라는 중~',
        ],
        scenarios: [
          {
            id: 'first_hello',
            stage: 0,
            trigger: 'talk',
            plant: '안녕하세요!! 저 딸기예요!! 나중에 엄청 맛있어질 거예요!!',
            choices: [
              { text: '기대된다!', reply: '그렇죠?! 저도 기대돼요!! 빨리 크고 싶어요!!' },
              { text: '달콤해?', reply: '당연하죠!! 세상에서 제일 달콤한 딸기가 될 거예요!!' },
              { text: '물 줄게', reply: '감사합니다~!! 물이 있어야 달콤해지거든요!!' },
            ]
          },
          {
            id: 'growing',
            stage: 2,
            trigger: 'talk',
            plant: '잎이 많아졌어요!! 이제 슬슬 꽃 피울 준비 해야겠어요!!',
            choices: [
              { text: '많이 컸다!', reply: '그렇죠?! 저 요즘 엄청 열심히 하고 있거든요!!' },
              { text: '꽃은 언제 펴?', reply: '곧이요!! 흰 꽃이 필 거예요!! 예쁠 거예요!!' },
              { text: '잎이 예쁘네', reply: '잎도요?! 감사해요!! 열매도 예쁠 거예요!!' },
            ]
          },
          {
            id: 'almost_bloom',
            stage: 3,
            trigger: 'talk',
            plant: '꽃 피려고 해요!! 흰 꽃이요!! 꽃 지면 열매 달릴 거예요!!',
            choices: [
              { text: '진짜?! 기대!', reply: '그렇죠?! 저도 너무 기대돼요!!' },
              { text: '열매가 달리면 먹어도 돼?', reply: '...그건 좀 생각해봐야 할 것 같아요 😅' },
              { text: '응원할게!', reply: '감사해요!! 힘이 나요!!' },
            ]
          },
          {
            id: 'blooming',
            stage: 4,
            trigger: 'talk',
            plant: '꽃 폈어요!! 흰 꽃이요!! 이제 곧 빨간 열매가 달릴 거예요!!',
            choices: [
              { text: '꽃 너무 예쁘다!', reply: '그렇죠?! 감사해요!! 열매도 기대해줘요!!' },
              { text: '빨리 열매 보고 싶다', reply: '저도요!! 같이 기다려요!!' },
              { text: '수고했어!', reply: '에헤헤 감사해요!! 아직 더 수고해야 해요!!' },
            ]
          },
          {
            id: 'last_day',
            stage: 5,
            trigger: 'talk',
            plant: '열매 달렸어요!! 빨갛죠?! 저 잘했죠?!',
            choices: [
              { text: '최고야!!', reply: '감사해요!! 당신 덕분이에요!! 진짜로요!!' },
              { text: '달콤하겠다', reply: '당연하죠!! 세상에서 제일 달콤한 딸기니까요!!' },
              { text: '수고했어', reply: '...네. 저 열심히 했어요. 고마워요 🍓' },
            ]
          },
        ]
      }
    ]
  },

  lavender: {
    personalities: [
      {
        id: 'calm',
        name: '차분형',
        speechStyle: '조용하고 시적, 향기 얘기 좋아함',
        nicknameLine: '별명이요... 향기로운 이름이면 좋겠어요.',
        monologues: [
          '향기가 퍼지고 있어요...',
          '오늘은 바람이 좋네요.',
          '조용한 게 좋아요...',
          '...숨을 깊게 쉬어봐요.',
        ],
        scenarios: [
          {
            id: 'first_hello',
            stage: 0,
            trigger: 'talk',
            plant: '...안녕하세요. 저 여기 있어요. 조용히 있을게요.',
            choices: [
              { text: '반가워', reply: '...저도요. 와줘서 고마워요.' },
              { text: '향기 나?', reply: '아직은요... 조금 더 자라면 날 거예요.' },
              { text: '예쁘게 자라줘', reply: '...노력할게요. 천천히요.' },
            ]
          },
          {
            id: 'growing',
            stage: 2,
            trigger: 'talk',
            plant: '잎이 많아졌어요... 살짝 향기가 나기 시작하는 것 같아요.',
            choices: [
              { text: '향기 맡아봤다', reply: '...어때요? 마음이 좀 편해지지 않아요?' },
              { text: '많이 컸다', reply: '...그렇죠. 조금씩 자라고 있어요.' },
              { text: '예뻐', reply: '...고마워요. 그 말 들으니 더 자라고 싶어요.' },
            ]
          },
          {
            id: 'almost_bloom',
            stage: 3,
            trigger: 'talk',
            plant: '...꽃봉오리가 생겼어요. 보랏빛이 될 거예요.',
            choices: [
              { text: '보라 좋아해!', reply: '...다행이에요. 저도 제 색이 좋아요.' },
              { text: '기대된다', reply: '...저도요. 천천히 기다려줘요.' },
              { text: '향기 더 강해지겠다', reply: '...네. 꽃 피면 더 진해질 거예요. 좋아해줄 거죠?' },
            ]
          },
          {
            id: 'blooming',
            stage: 4,
            trigger: 'talk',
            plant: '...꽃이 폈어요. 향기 맡아봐요.',
            choices: [
              { text: '깊게 숨 들이쉬었다', reply: '...좋죠? 이게 저예요.' },
              { text: '너무 예뻐', reply: '...고마워요. 오래 봐줘요.' },
              { text: '마음이 편해진다', reply: '...그게 제 역할이에요. 잘됐네요 🌿' },
            ]
          },
          {
            id: 'last_day',
            stage: 5,
            trigger: 'talk',
            plant: '...씨앗을 남길 거예요. 향기는 기억 속에 남을 거예요.',
            choices: [
              { text: '향기 기억할게', reply: '...고마워요. 저도 당신 기억할게요.' },
              { text: '또 만나자', reply: '...네. 다시 오면 또 향기 맡게 해줄게요.' },
              { text: '고마웠어', reply: '...저도요. 많이요. 정말로.' },
            ]
          },
        ]
      }
    ]
  },

  bonsai: {
    personalities: [
      {
        id: 'wise',
        name: '현자형',
        speechStyle: '깊고 천천히 말함, 철학적인 말 자주 함',
        nicknameLine: '이름이란... 부르는 사람의 마음이 담기는 법이죠. 잘 지어줘요.',
        monologues: [
          '천천히 자라는 것도 자라는 거예요.',
          '오늘 하루도 지나가네요...',
          '뿌리가 깊어야 오래 살죠.',
          '...생각이 많은 날이에요.',
        ],
        scenarios: [
          {
            id: 'first_hello',
            stage: 0,
            trigger: 'talk',
            plant: '...오셨군요. 저는 천천히 자라는 편이에요. 기다려줄 수 있나요?',
            choices: [
              { text: '물론이지', reply: '...좋아요. 서두르지 않아도 되는 사람이 필요했어요.' },
              { text: '얼마나 걸려?', reply: '분재는 평생을 함께하는 거예요. 오래 볼 수 있겠어요?' },
              { text: '잘 부탁해', reply: '...저야말로요. 함께 시간을 쌓아봐요.' },
            ]
          },
          {
            id: 'growing',
            stage: 2,
            trigger: 'talk',
            plant: '가지가 뻗기 시작했어요. 방향을 잡는 게 중요하죠. 삶도 그렇고요.',
            choices: [
              { text: '멋있는 말이다', reply: '...식물은 말보다 몸으로 철학을 보여주죠.' },
              { text: '어떤 방향으로 자랄 거야?', reply: '빛이 있는 곳으로요. 언제나 그게 답이에요.' },
              { text: '잘 자라고 있어', reply: '...당신이 봐줘서 방향을 잡을 수 있어요.' },
            ]
          },
          {
            id: 'almost_bloom',
            stage: 3,
            trigger: 'talk',
            plant: '수형이 잡혀가고 있어요. 오래 걸렸지만... 그만큼 단단해졌어요.',
            choices: [
              { text: '멋있어', reply: '...시간이 만든 거예요. 저 혼자가 아니라.' },
              { text: '고생했겠다', reply: '고생이라기보다... 그냥 살았어요. 매일매일.' },
              { text: '앞으로도 잘 부탁해', reply: '...네. 오래 함께해요.' },
            ]
          },
          {
            id: 'blooming',
            stage: 4,
            trigger: 'talk',
            plant: '솔잎이 무성해졌어요... 겨울에도 푸른 건 쉬운 일이 아니에요.',
            choices: [
              { text: '대단해', reply: '...꾸준함이 전부예요. 화려하지 않아도 괜찮아요.' },
              { text: '푸른 게 좋아', reply: '저도요. 변하지 않는 것들이 좋아요.' },
              { text: '닮고 싶다', reply: '...그 말이 오늘 제일 좋은 말이에요.' },
            ]
          },
          {
            id: 'last_day',
            stage: 5,
            trigger: 'talk',
            plant: '완성됐어요... 완성이란 끝이 아니라 다음의 시작이겠죠.',
            choices: [
              { text: '철학자네', reply: '...오래 살다 보면 그렇게 돼요. ㅎ' },
              { text: '함께해서 좋았어', reply: '...저도요. 이런 시간이 삶을 만드는 것 같아요.' },
              { text: '고마워', reply: '...고마운 건 저예요. 끝까지 봐줘서.' },
            ]
          },
        ]
      }
    ]
  },
}

export function getPersonality(plantId, personalityId) {
  const plant = DIALOGUES[plantId]
  if (!plant) return null
  return plant.personalities.find(p => p.id === personalityId) || plant.personalities[0]
}

export function getScenario(plantId, personalityId, stage) {
  const personality = getPersonality(plantId, personalityId)
  if (!personality) return null
  const available = personality.scenarios.filter(s => s.stage <= stage)
  if (!available.length) return null
  return available[Math.floor(Math.random() * available.length)]
}

export function getMonologue(plantId, personalityId) {
  const personality = getPersonality(plantId, personalityId)
  if (!personality) return null
  const list = personality.monologues
  return list[Math.floor(Math.random() * list.length)]
}