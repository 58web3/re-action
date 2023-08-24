const createTables = require('./create_tables');
const loadDataToDb = require('./load_data_to_db');

const main = async () => {
    console.log("Load data start");
    await createTables.createAllTables();

    await loadDataToDb.loadInitData();

    console.log("Load data end");
}

main();