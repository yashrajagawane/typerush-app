import { Lesson, Achievement, UserStats } from './types';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson-1',
    level: 1,
    title: 'Home Row',
    description: 'Master the home row keys. Keep your index fingers on F and J.',
    targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    exercises: [
      'a s d f j k l ;',
      'as df jk l;',
      'fad dad sad glad',
      'ask lass fall'
    ]
  },
  {
    id: 'lesson-2',
    level: 2,
    title: 'Top Row',
    description: 'Learn the top row keys while keeping your base on the home row.',
    targetKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    exercises: [
      'q w e r t y u i o p',
      'pot top row wet',
      'tree free quite',
      'type rope power'
    ]
  },
  {
    id: 'lesson-3',
    level: 3,
    title: 'Bottom Row',
    description: 'Reach down to the bottom row.',
    targetKeys: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    exercises: [
      'z x c v b n m',
      'box fox mix',
      'cave brave wave',
      'zoom zero maze'
    ]
  },
  {
    id: 'lesson-4',
    level: 4,
    title: 'Capital Letters',
    description: 'Use the Shift keys to type capital letters.',
    targetKeys: ['Shift'],
    exercises: [
      'A B C D E F G',
      'Hello World',
      'TypeRush is Fun',
      'Keep Practice Going'
    ]
  },
  {
    id: 'lesson-5',
    level: 5,
    title: 'Numbers',
    description: 'Reach up to the number row.',
    targetKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    exercises: [
      '1 2 3 4 5 6 7 8 9 0',
      '19 84 20 45 99',
      'Catch 22 is a book',
      'Year 2024 is now'
    ]
  },
  {
    id: 'lesson-6',
    level: 6,
    title: 'Symbols',
    description: 'Combine Shift with the number row for symbols.',
    targetKeys: ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
    exercises: [
      '! @ # $ % ^ & * ( )',
      'Wow! It costs $50.',
      '100% accurate & fast.',
      'Hello (world)!'
    ]
  },
  {
    id: 'lesson-7',
    level: 7,
    title: 'Words',
    description: 'Practice typing full words smoothly.',
    targetKeys: [],
    exercises: [
      'the quick brown fox',
      'jumps over the lazy dog',
      'practice makes perfect',
      'speed and accuracy'
    ]
  },
  {
    id: 'lesson-8',
    level: 8,
    title: 'Sentences',
    description: 'Type full sentences with punctuation.',
    targetKeys: [],
    exercises: [
      'The sun is shining brightly today.',
      'Can you type this sentence fast?',
      'Always remember to take a break.',
      'Coding and typing go hand in hand.'
    ]
  },
  {
    id: 'lesson-9',
    level: 9,
    title: 'Paragraphs',
    description: 'Build endurance with longer paragraphs.',
    targetKeys: [],
    exercises: [
      'Touch typing is a skill that takes time to master. Keep your hands relaxed, maintain good posture, and focus on accuracy before speed. Speed will naturally follow as muscle memory develops.',
      'The neon lights reflect off the wet pavement as you accelerate into the night. Speed is everything here, but precision is what keeps you alive. Focus on the next turn and never look back.'
    ]
  },
  {
    id: 'lesson-10',
    level: 10,
    title: 'Code Snippets',
    description: 'Practice typing common programming syntax.',
    targetKeys: ['{', '}', '[', ']', '<', '>', '=', '+', '-'],
    exercises: [
      'const maxSpeed = 100;',
      'function typeRush() { return true; }',
      'if (score >= 90) { win(); }',
      '<div>Hello World</div>'
    ]
  },
  {
    id: 'lesson-11',
    level: 11,
    title: 'Advanced Punctuation',
    description: 'Master complex punctuation and mixed casing commonly found in professional writing.',
    targetKeys: [';', ':', '"', "'", ',', '.', '?', '-', '_'],
    exercises: [
      'The meeting is at 10:30 AM; please be on time.',
      '"Wait," she said, "is that a semi-colon?"',
      'Contact us at: support@example.com (or call 555-1234).',
      'It\'s a well-known fact: cats don\'t like water, right?'
    ]
  },
  {
    id: 'lesson-12',
    level: 12,
    title: 'Programming Syntax',
    description: 'Advanced coding symbols, arrows, and complex brackets used in modern programming.',
    targetKeys: ['{', '}', '=>', '||', '&&', '`', '$', '\\', '/'],
    exercises: [
      'const add = (a, b) => a + b;',
      'return state || { loading: false };',
      'const template = `Hello ${user.name}!`;',
      'import { NextApiRequest, NextApiResponse } from "next";'
    ]
  },
  {
    id: 'lesson-13',
    level: 13,
    title: 'Expert Speed Drills',
    description: 'Push your limits with fast, repetitive letter combinations and tongue twisters.',
    targetKeys: [],
    exercises: [
      'She sells seashells by the seashore.',
      'How much wood would a woodchuck chuck if a woodchuck could chuck wood?',
      'Peter Piper picked a peck of pickled peppers.',
      'A big black bug bit a big black bear, made the big black bear bleed blood.'
    ]
  },
  {
    id: 'lesson-14',
    level: 14,
    title: 'Math & Operators',
    description: 'Master mathematical symbols and equations.',
    targetKeys: ['+', '-', '*', '/', '=', '%'],
    exercises: [
      'let x = (y + 10) * 5 / 2;',
      'const remainder = 100 % 3;',
      'a += 5; b -= 10; c *= 2;',
      'if (x === y && z !== 0)'
    ]
  },
  {
    id: 'lesson-15',
    level: 15,
    title: 'Data Formats: JSON',
    description: 'Practice typing common JSON structures.',
    targetKeys: ['{', '}', '[', ']', ':', '"', ','],
    exercises: [
      '{ "name": "John", "age": 30 }',
      '{ "users": [{ "id": 1, "role": "admin" }] }',
      '{ "status": "success", "data": null }',
      '[{ "x": 100, "y": 200 }, { "x": 0, "y": 0 }]'
    ]
  },
  {
    id: 'lesson-16',
    level: 16,
    title: 'Left Hand Focus',
    description: 'Drills focused heavily on the left side of the keyboard.',
    targetKeys: ['q', 'w', 'e', 'r', 't', 'a', 's', 'd', 'f', 'g', 'z', 'x', 'c', 'v', 'b'],
    exercises: [
      'sweater dresses',
      'secret stargazers',
      'watercress exacts',
      'abstract art'
    ]
  },
  {
    id: 'lesson-17',
    level: 17,
    title: 'Right Hand Focus',
    description: 'Drills focused heavily on the right side of the keyboard.',
    targetKeys: ['y', 'u', 'i', 'o', 'p', 'h', 'j', 'k', 'l', 'n', 'm'],
    exercises: [
      'minimum onion',
      'pompous phlox',
      'hymn polyphony',
      'monopoly jump'
    ]
  },
  {
    id: 'lesson-18',
    level: 18,
    title: 'Alternating Hands',
    description: 'Words that alternate perfectly between left and right hands.',
    targetKeys: [],
    exercises: [
      'authentic dismantle',
      'enchantment visual',
      'skepticism visible',
      'auditory elements'
    ]
  },
  {
    id: 'lesson-19',
    level: 19,
    title: 'Top Row Only',
    description: 'Words composed entirely of the top row keys.',
    targetKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    exercises: [
      'typewriter property',
      'repertoire priority',
      'territory require',
      'power quiet'
    ]
  },
  {
    id: 'lesson-20',
    level: 20,
    title: 'Double Letters',
    description: 'Words containing double letters to practice quick repeated strikes.',
    targetKeys: [],
    exercises: [
      'accommodate occurrence',
      'bookkeeper committee',
      'success embarrass',
      'assessment necessary'
    ]
  },
  {
    id: 'lesson-21',
    level: 21,
    title: 'Classic Literature',
    description: 'Type famous opening lines from classic books.',
    targetKeys: [],
    exercises: [
      'Call me Ishmael.',
      'It was the best of times, it was the worst of times.',
      'In a hole in the ground there lived a hobbit.',
      'All happy families are alike; each unhappy family is unhappy in its own way.'
    ]
  },
  {
    id: 'lesson-22',
    level: 22,
    title: 'Common Typos',
    description: 'Practice commonly misspelled words to build muscle memory.',
    targetKeys: [],
    exercises: [
      'definitely separate',
      'a lot receive',
      'weird rhythm',
      'pronunciation maintenance'
    ]
  },
  {
    id: 'lesson-23',
    level: 23,
    title: 'Long Words',
    description: 'Endurance words requiring sustained focus.',
    targetKeys: [],
    exercises: [
      'uncharacteristically disproportionate',
      'counterproductive institutionalization',
      'unconstitutionality incomprehensible',
      'interdisciplinary extraterrestrial'
    ]
  },
  {
    id: 'lesson-24',
    level: 24,
    title: 'Web Dev: HTML & CSS',
    description: 'Practice typing HTML tags and CSS properties.',
    targetKeys: ['<', '>', '/', '-', '#', ':'],
    exercises: [
      '<div class="container"></div>',
      '<a href="https://example.com">Link</a>',
      'margin: 0 auto; padding: 2rem;',
      'background-color: #f0f0f0;'
    ]
  },
  {
    id: 'lesson-25',
    level: 25,
    title: 'Database Queries',
    description: 'Type common SQL commands.',
    targetKeys: ['*', '=', '<', '>'],
    exercises: [
      'SELECT * FROM users WHERE age > 18;',
      'INSERT INTO posts (title, body) VALUES ("Hello", "World");',
      'UPDATE users SET status = "active" WHERE id = 1;',
      'DELETE FROM logs WHERE created_at < "2023-01-01";'
    ]
  },
  {
    id: 'lesson-26',
    level: 26,
    title: 'Scientific Terms',
    description: 'Type complex scientific and medical terms.',
    targetKeys: [],
    exercises: [
      'deoxyribonucleic acid photosynthesis',
      'mitochondria thermodynamics',
      'paleontology electromagnetism',
      'neurotransmitter cardiovascular'
    ]
  },
  {
    id: 'lesson-27',
    level: 27,
    title: 'Mixed Symbols & Numbers',
    description: 'A chaotic mix of numbers, symbols, and letters.',
    targetKeys: [],
    exercises: [
      'P@ssw0rd123! R3c0v3ry',
      'ID: 9X8-42Q-11A#',
      'Error Code: 0x80004005',
      'Token=eyJhbGciOiJIUzI1NiJ9'
    ]
  },
  {
    id: 'lesson-28',
    level: 28,
    title: 'Bash & Terminal',
    description: 'Common command line operations.',
    targetKeys: ['-', '.', '/', '|', '>'],
    exercises: [
      'ls -la | grep "test"',
      'chmod +x script.sh',
      'git commit -m "Initial commit"',
      'npm run build && npm start'
    ]
  },
  {
    id: 'lesson-29',
    level: 29,
    title: 'Foreign Loanwords',
    description: 'English words adopted from other languages.',
    targetKeys: [],
    exercises: [
      'rendezvous faux pas',
      'bourgeoisie schadenfreude',
      'entrepreneur zeitgeist',
      'cliche aficionado'
    ]
  },
  {
    id: 'lesson-30',
    level: 30,
    title: 'The Grand Finale',
    description: 'The ultimate test of typing mastery. Speed, symbols, and complex vocabulary.',
    targetKeys: [],
    exercises: [
      'The quick brown fox jumps over the lazy dog while 123,456 sheep watch! How curious.',
      'const ultimateAnswer = (42 * Math.PI).toFixed(2); // The secret of the universe.',
      '"To be, or not to be, that is the question: Whether \'tis nobler in the mind to suffer..."',
      'Congratulations! You have mastered the keyboard. Onward to new challenges! 🚀'
    ]
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', title: 'First Steps', description: 'Complete your first lesson.', icon: '🎯', condition: (s) => s.totalChars > 0 },
  { id: 'wpm-30', title: 'Getting Faster', description: 'Reach 30 WPM.', icon: '🏃', condition: (s) => s.bestWpm >= 30 },
  { id: 'wpm-50', title: 'Speed Demon', description: 'Reach 50 WPM.', icon: '🏎️', condition: (s) => s.bestWpm >= 50 },
  { id: 'wpm-75', title: 'Keyboard Master', description: 'Reach 75 WPM.', icon: '🔥', condition: (s) => s.bestWpm >= 75 },
  { id: 'wpm-100', title: 'Typing Legend', description: 'Reach 100 WPM.', icon: '⚡', condition: (s) => s.bestWpm >= 100 },
  { id: 'acc-95', title: 'Sharpshooter', description: 'Achieve 95% overall accuracy.', icon: '🎯', condition: (s) => s.accuracy >= 95 && s.totalChars > 500 },
  { id: 'streak-7', title: 'Dedicated', description: 'Reach a 7-day streak.', icon: '📅', condition: (s) => s.streak >= 7 },
  { id: 'words-1000', title: 'Wordsmith', description: 'Type 1000 words.', icon: '📚', condition: (s) => s.totalWords >= 1000 },
];

export const DAILY_CHALLENGES = [
  "The future belongs to those who prepare for it today.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Everything you've ever wanted is on the other side of fear.",
  "Hardships often prepare ordinary people for an extraordinary destiny."
];

export function getRank(level: number): string {
  if (level >= 50) return 'Typing Legend';
  if (level >= 30) return 'Keyboard Master';
  if (level >= 20) return 'Speed Demon';
  if (level >= 10) return 'Fast Fingers';
  if (level >= 5) return 'Keyboard Rookie';
  return 'Beginner';
}
