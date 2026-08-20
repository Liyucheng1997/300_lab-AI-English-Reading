// 演示模式内置样卷（未配置 API Key 时使用），初中水平示例。

export const SAMPLE_PAPER = {
  title: '英语阅读练习卷（演示样卷 · 初中水平）',
  sections: [
    {
      type: 'reading',
      name: '阅读理解',
      instruction: '阅读短文，选择最佳答案。',
      passage:
        "Last summer, Li Hua joined a volunteer group in his city. Every Saturday morning, the group visited an old people's home near the river. At first, Li Hua felt nervous because he didn't know what to say to the old people. But soon he found that they loved listening to stories about school life. He began to read newspapers for them and play chess with Grandpa Wang, who used to be a math teacher. Grandpa Wang taught him some clever chess moves, and Li Hua helped him learn to use a smartphone to video-call his granddaughter in Canada. By the end of the summer, Li Hua understood that volunteering is not just about giving help — it is also about making friends and learning from others.",
      questions: [
        {
          question: 'How often did the volunteer group visit the old people\'s home?',
          options: ['Every day', 'Once a week', 'Twice a month', 'Only in winter'],
          answer: 1,
          explanation: '文中说 "Every Saturday morning"，即每周六上午去一次，故选 Once a week。',
        },
        {
          question: 'Why did Li Hua feel nervous at first?',
          options: [
            'He was afraid of the river.',
            'He lost a chess game.',
            "He didn't know what to talk about.",
            'He forgot to bring newspapers.',
          ],
          answer: 2,
          explanation: '原文 "he didn\'t know what to say to the old people"，对应选项 C。',
        },
        {
          question: 'What did Li Hua help Grandpa Wang do?',
          options: [
            'Teach math at school',
            'Write letters to Canada',
            'Play basketball',
            'Video-call his granddaughter',
          ],
          answer: 3,
          explanation: '原文提到 Li Hua 帮王爷爷学会用智能手机与在加拿大的孙女视频通话。',
        },
        {
          question: 'What is the best title for the passage?',
          options: [
            'More Than Giving Help',
            'How to Play Chess Well',
            'A Trip to Canada',
            'The History of Volunteering',
          ],
          answer: 0,
          explanation: '末句点明主旨：志愿服务不只是给予帮助，也是交朋友、向他人学习，故 A 最贴切。',
        },
      ],
    },
    {
      type: 'cloze',
      name: '完形填空',
      instruction: '阅读短文，为每个空选择最佳答案。',
      passage:
        'Bicycles are becoming popular again in many cities. People ride them to work because they are cheap and good for [1]. Riding a bike also helps reduce air [2] in busy cities. Some cities have built special roads [3] for bikes, so riding is much safer than before. If more people choose bikes [4] cars, our cities will become cleaner and quieter.',
      questions: [
        {
          question: '第 1 空',
          options: ['health', 'money', 'time', 'work'],
          answer: 0,
          explanation: '骑车便宜且"有益健康"，good for health 为固定搭配且符合语境。',
        },
        {
          question: '第 2 空',
          options: ['traffic', 'pollution', 'travel', 'weather'],
          answer: 1,
          explanation: 'reduce air pollution 减少空气污染，符合上下文环保主题。',
        },
        {
          question: '第 3 空',
          options: ['only', 'ever', 'never', 'hardly'],
          answer: 0,
          explanation: 'roads only for bikes 意为"自行车专用道"。',
        },
        {
          question: '第 4 空',
          options: ['instead of', 'because of', 'in front of', 'out of'],
          answer: 0,
          explanation: 'choose bikes instead of cars："选择自行车而不是汽车"。',
        },
      ],
    },
    {
      type: 'true_false',
      name: '阅读判断',
      instruction: '根据短文内容，判断下列句子正误。',
      passage:
        'The Amazon rainforest is the largest rainforest in the world. It produces about 20 percent of the oxygen on Earth, so people call it "the lungs of the planet". Millions of kinds of plants, birds and animals live there. However, large areas of the forest are cut down every year, and many animals are losing their homes.',
      questions: [
        {
          question: 'The Amazon rainforest is the biggest rainforest on Earth.',
          options: ['True', 'False'],
          answer: 0,
          explanation: '首句明确说明它是世界上最大的雨林。',
        },
        {
          question: 'People call the Amazon "the heart of the planet".',
          options: ['True', 'False'],
          answer: 1,
          explanation: '原文称其为 "the lungs of the planet"（地球之肺），不是 heart。',
        },
        {
          question: 'Some animals are losing their homes because trees are cut down.',
          options: ['True', 'False'],
          answer: 0,
          explanation: '末句指出每年大片森林被砍伐，许多动物正失去家园。',
        },
      ],
    },
    {
      type: 'vocab',
      name: '词汇与语法',
      instruction: '选择最佳答案完成句子。',
      questions: [
        {
          question: 'You should ______ smoking. It is bad for your health.',
          options: ['give up', 'pick up', 'look up', 'put up'],
          answer: 0,
          explanation: 'give up smoking 戒烟；pick up 捡起，look up 查阅，put up 张贴，均不合语境。',
        },
        {
          question: 'This math problem is too ______ for me. I can\'t work it out.',
          options: ['easy', 'difficult', 'interesting', 'cheap'],
          answer: 1,
          explanation: '后句说"我做不出来"，说明题目太难，选 difficult。',
        },
        {
          question: 'She ______ to the library every weekend to borrow books.',
          options: ['go', 'goes', 'going', 'gone'],
          answer: 1,
          explanation: '主语 She 为第三人称单数，every weekend 表示经常性动作，用一般现在时 goes。',
        },
      ],
    },
  ],
}
