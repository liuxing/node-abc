const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('你叫什么名字？', (answer) => {
  // 对答案进行处理
  console.log(`早上好，${answer}`);

  rl.close();
});