const bcrypt = require('bcrypt');

async function generateHash() {
          const password = 'artak123'; // Քո գաղտնաբառը
          const saltRounds = 10;
          const hash = await bcrypt.hash(password, saltRounds);
          console.log("Ահա քո ճիշտ հեշը. Պատճենիր սա՝", hash);
}

generateHash();