import type { QuizQuestion } from "@/types";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "太阳系中最大的行星是哪一颗？",
    options: ["土星", "海王星", "木星", "天王星"],
    correctIndex: 2,
    relatedPlanet: "jupiter",
    explanation: "木星是太阳系中最大的行星，质量是其他所有行星总和的2.5倍。",
  },
  {
    id: 2,
    question: '哪颗行星被称为"红色星球"？',
    options: ["火星", "金星", "水星", "土星"],
    correctIndex: 0,
    relatedPlanet: "mars",
    explanation: '火星因其表面富含氧化铁（铁锈）而呈现红色，被称为"红色星球"。',
  },
  {
    id: 3,
    question: "土星最著名的特征是什么？",
    options: ["光环系统", "大红斑", "强烈风暴", "众多火山"],
    correctIndex: 0,
    relatedPlanet: "saturn",
    explanation: "土星以其壮观的光环系统而闻名，光环主要由冰粒和岩石碎片组成。",
  },
  {
    id: 4,
    question: "太阳系中最热的行星是哪一颗？",
    options: ["水星", "火星", "金星", "木星"],
    correctIndex: 2,
    relatedPlanet: "venus",
    explanation:
      "金星表面温度高达462°C，比距离太阳更近的水星还热，这是因为金星浓厚的二氧化碳大气层产生了强烈的温室效应。",
  },
  {
    id: 5,
    question: "地球自转轴倾斜多少度导致了四季变化？",
    options: ["45度", "0度", "23.5度", "90度"],
    correctIndex: 2,
    relatedPlanet: "earth",
    explanation:
      "地球的自转轴倾斜23.5度，这导致了阳光在不同季节照射地球的角度不同，形成了四季变化。",
  },
  {
    id: 6,
    question: '哪颗行星几乎是"躺着"自转的？',
    options: ["土星", "天王星", "海王星", "木星"],
    correctIndex: 1,
    relatedPlanet: "uranus",
    explanation:
      "天王星的自转轴倾斜97.8度，几乎是躺着自转的，这可能是早期一次巨大撞击造成的。",
  },
  {
    id: 7,
    question: "太阳系中距离太阳最近的行星是？",
    options: ["金星", "地球", "火星", "水星"],
    correctIndex: 3,
    relatedPlanet: "mercury",
    explanation: "水星是距离太阳最近的行星，平均距离约为5790万公里。",
  },
  {
    id: 8,
    question: "太阳系最外层的行星是哪一颗？",
    options: ["天王星", "海王星", "冥王星", "土星"],
    correctIndex: 1,
    relatedPlanet: "neptune",
    explanation:
      "海王星是太阳系最外层的行星，距离太阳约30天文单位。冥王星已被归类为矮行星。",
  },
];
