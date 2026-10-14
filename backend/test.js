const bcrypt = require("bcrypt");
async function main() {
       const h1 = await bcrypt.hash("john123", 10);
  const h2 = await bcrypt.hash("john123", 10);
  console.log(h1);
  console.log(h2);
  console.log(await bcrypt.compare("john123", h1));
  console.log(await bcrypt.compare("john123", h2));
  console.log(await bcrypt.compare("wrong", h1));
}

main();