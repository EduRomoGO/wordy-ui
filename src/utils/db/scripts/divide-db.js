// This script takes the file url, divides
// the wordDescriptors array in smaller array groups
// and put them in different files
async function divideDatabase(fileUrl, GROUP_LENGTH, destinationFilesBasePath) {
  const { readFile, writeFile } = require("fs/promises");

  try {
    const fileString = await readFile(fileUrl, "utf8");
    const { wordDescriptors } = JSON.parse(fileString);

    // create array groups
    let dbGroups = [];
    while (wordDescriptors.length > 0) {
      dbGroups.push(wordDescriptors.splice(0, GROUP_LENGTH));
    }

    // create file content for each group
    const fileContents = dbGroups.map((group) => {
      return JSON.stringify(
        {
          wordDescriptors: group,
        },
        null,
        4
      );
    });

    //create a file for each file content group
    const writeFileContentsPromises = fileContents.map((content, index) => {
      return writeFile(
        `${destinationFilesBasePath}/db-${index + 1}.json`,
        content,
        "utf8"
      );
    });

    try {
      await Promise.all(writeFileContentsPromises);
      console.log("All files have been created successfully");
    } catch (error) {
      console.log(`Error writting files - ${error}`);
    }
  } catch (error) {
    console.log(`Error divididing db file ${fileUrl} - ${error.message}`);
  }
}

const path = process.cwd();

const dbPath = path + "/src/utils/db/db.json";
const GROUP_LENGTH = 1000;
const destinationFilesBasePath = path + "/src/utils/db/divided";

divideDatabase(dbPath, GROUP_LENGTH, destinationFilesBasePath);
