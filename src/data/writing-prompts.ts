import { WritingPrompt } from "@/types/writing";

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: "prompt-mod-g-1",
    title: "Banning Smartphones in High Schools",
    module: "Module G",
    level: "5 Points (Bagrut Standard)",
    taskType: "opinion",
    promptText:
      "Some educators believe that smartphones should be strictly prohibited in all secondary schools to enhance concentration and reduce cyberbullying. Others argue that phones are vital digital learning tools that prepare adolescents for the modern world. Write an opinion essay stating your position.",
    bulletPoints: [
      "Clearly state your opinion in the introductory paragraph.",
      "Provide at least two well-developed reasons supported by examples.",
      "Use appropriate connectors and paragraph division.",
      "Summarize your key perspective in the conclusion.",
    ],
    minWords: 120,
    maxWords: 140,
    tips: [
      "Avoid informal slang or contractions (use 'do not' instead of 'don't').",
      "Incorporate Band III connectors such as 'Consequently', 'Furthermore', or 'On the other hand'.",
      "Aim for 4 distinct paragraphs: Introduction, Reason 1, Reason 2, Conclusion.",
    ],
  },
  {
    id: "prompt-mod-g-2",
    title: "Artificial Intelligence in High School Learning",
    module: "Module G",
    level: "5 Points (Bagrut Standard)",
    taskType: "opinion",
    promptText:
      "The rapid emergence of AI tools like generative chat assistants has ignited controversy among educators. Some argue that AI undermines critical thinking, while others view it as an empowering personal tutor. Write an opinion essay expressing your view on the role of AI in students' education.",
    bulletPoints: [
      "State whether you view AI primarily as a benefit or a detriment to learning.",
      "Explain the impact of AI on study habits and independent thinking.",
      "Provide practical examples from school subjects or homework routines.",
      "Conclude with a balanced recommendation for schools.",
    ],
    minWords: 120,
    maxWords: 140,
    tips: [
      "Maintain a formal, objective tone throughout.",
      "Use rich academic vocabulary (e.g. 'diminish', 'essential', 'scrutinize').",
    ],
  },
  {
    id: "prompt-mod-c-1",
    title: "Mandatory Community Volunteering for Students",
    module: "Module C",
    level: "3-4 Points (Intermediate)",
    taskType: "opinion",
    promptText:
      "In many schools, students are required to complete sixty hours of community volunteer work (מעורבות חברתית) before graduation. Some pupils believe volunteering should be strictly voluntary, while others think it teaches invaluable life lessons. What is your opinion?",
    bulletPoints: [
      "State clearly whether you agree or disagree with mandatory volunteering.",
      "Give at least two reasons with examples from your own or peers' experience.",
      "Write in clear sentences with correct punctuation and spelling.",
    ],
    minWords: 70,
    maxWords: 90,
    tips: [
      "Check your word count: 70 to 90 words is the official target.",
      "Use connectors like 'First', 'In addition', 'Because', 'In conclusion'.",
      "Divide your writing into at least 2-3 clear paragraphs.",
    ],
  },
];

export const CONNECTOR_CATEGORIES = [
  {
    name: "Addition (הוספה)",
    connectors: ["Furthermore,", "In addition,", "Moreover,", "Additionally,"],
  },
  {
    name: "Contrast (ניגוד)",
    connectors: ["However,", "On the one hand,", "On the other hand,", "Despite this,"],
  },
  {
    name: "Cause & Effect (סיבה ותוצאה)",
    connectors: ["Consequently,", "Therefore,", "As a result,", "Due to this,"],
  },
  {
    name: "Conclusion (סיכום)",
    connectors: ["In conclusion,", "To sum up,", "Ultimately,", "All in all,"],
  },
];
