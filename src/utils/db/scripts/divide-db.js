// This script takes the file url, divides
// the wordDescriptors array in smaller array groups
// and put them in different files
async function divideDatabase(fileUrl, GROUP_LENGTH, destinationFilesBasePath) {
  const { readFile, writeFile } = require("fs/promises");

  try {
    const fileString = await readFile(fileUrl, "utf8");
    const { wordDescriptors } = JSON.parse(fileString);

    // create array groups
    let dbGroups = [wordDescriptors.splice(0, 50)];
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

    // create a file with all the names of the files created
    const content = {
      fileNames: fileContents.map((content, index) => `db-${index + 1}.json`),
    };
    const contentString = JSON.stringify(content, null, 4);

    await writeFile(
      `${destinationFilesBasePath}/file-names.json`,
      contentString,
      "utf8"
    );

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
      console.info("All files have been created successfully");
    } catch (error) {
      console.error(`Error writting files - ${error}`);
    }
  } catch (error) {
    console.error(`Error divididing db file ${fileUrl} - ${error.message}`);
  }
}

const path = process.cwd();

const dbPath = path + "/src/utils/db/db.json";
const GROUP_LENGTH = 500;
const destinationFilesBasePath = path + "/src/utils/db/divided";

divideDatabase(dbPath, GROUP_LENGTH, destinationFilesBasePath);
