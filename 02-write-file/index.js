const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Welcome! Type your text (If you want to quit and exit process, type "exit" or press "Ctrl+C"):');

// Handle user input
rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    farewellMessage();
  } else {
    writeStream.write(`${input}\n`);
  }
});

// Handle Ctrl+C event
process.on('SIGINT', farewellMessage);

// Display farewell message and close resources
function farewellMessage() {
  console.log('\nThank you! This is end!');
  rl.close();
  writeStream.end();
  process.exit();
}
