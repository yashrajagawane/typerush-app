const fs = require('fs');
let code = fs.readFileSync('src/data.ts', 'utf-8');

const newLessons = `
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
];`;

const insertionPoint = '  }'; // Wait, let's find the end of the LESSONS array.
// Instead of string manipulation, let's just do a regex replace.
code = code.replace(/  \}\n\];/, '  },' + newLessons);

fs.writeFileSync('src/data.ts', code);
console.log('Updated data.ts');
