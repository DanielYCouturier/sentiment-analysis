import { spawn } from 'child_process';
import Content from '../mongo-db/content.js';
import Query from '../mongo-db/query.js';

const getDefault = (key) => {
    const defaults = {
        dateStart: "1111-11-11",
        dateEnd: "9999-09-09",
        source: "ALL",
        sentiment: "ALL",
        model: "LOCAL"
    };
    return defaults[key];

}

const getData = async (req, res) => {
    // Step 1: Interpret the post req parameters
    let { query, dateStart, dateEnd, source, sentiment } = req.body;
    console.log(`Received req from client: \n\tquery: ${query}\n\tdateStart: ${dateStart}\n\tdateEnd: ${dateEnd}\n\tsource: ${source}\n\tsentiment: ${sentiment}`)
    if (!query) {
        return res.json({});
    }
    dateStart = dateStart || getDefault("dateStart");
    dateEnd = dateEnd || getDefault("dateEnd");
    source = source || getDefault("source");
    sentiment = sentiment || getDefault("sentiment");
    
    
    const dateStartObject = new Date(dateStart)
    const dateEndObject = new Date(dateEnd)
    // Step 2: Check if parameters are in database, or a superset is.
    const cachedQuery = await Query.findOne({
        keyword: query,
        $or: [
            { source: source },
            { source: "ALL" }
        ],
        datestart: { $lte: dateStartObject },
        dateend: { $gte: dateEndObject },
    }).populate('contentid');
    // Step 3: If query is already in database, return results that match from superset
    if (cachedQuery) {
        const filteredContent = cachedQuery.contentid.filter(content =>
            (source === "ALL" || content.source === source) &&
            content.date >= dateStartObject &&
            content.date <= dateEndObject
        );
        console.log(`Found ${filteredContent.length} matching of ${cachedQuery.contentid.length} relavent results in database`)
        const content = filteredContent.map(content => ({
            title: content.title,
            username: content.username,
            content_body: content.content_body,
            date: content.date.toISOString(),
            source: content.source,
            source_url: content.source_url,
            explicit: "FALSE",
            sentiment: "NEUTRAL"
        }));
        console.log(`Response of ${content.length} results sent to client\n`)
        return res.json(content);
    }

    console.log("Failed to find results in database")
    //Step 4: Fallthrough; Spawn python process to scrape data
    const args = [query, dateStart, dateEnd, source, sentiment];
    const pythonProcess = spawn('python3', ['python/get_data.py', JSON.stringify(args)]);

    let pythonOutput = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (chunk) => {
        pythonOutput += chunk.toString();
    });

    pythonProcess.stderr.on('data', (chunk) => {
        errorData += chunk.toString();
    });

    pythonProcess.on('close', async (code) => {
        console.log(errorData.trim())
        if (code !== 0 || !pythonOutput) {
            console.log(`Error while executing python code: get_data.py with parameters "${args}"`)
            console.log(`System Time: ${new Date()}`)
            return res.status(500).send(`Server failed to gather data`);
        }
        try {
            const contentList = JSON.parse(pythonOutput.trim());

            // Step 5: Save content from python process in database
            const contentDocs = await Content.insertMany(contentList.map(item => ({
                title: item.title,
                username: item.username,
                content_body: item.content_body,
                date: new Date(item.date),
                source: source,
                source_url: item.source_url
            })));
            console.log(`Inserted ${contentList.length} new results to database`)
            const contentIds = contentDocs.map(doc => doc._id);
            // Step 6: If new data is a supeset of any queries, merge them all into 1 new query 
            const subsetQueries = await Query.find({
                keyword: query,
                datestart: { $gte: dateStartObject },
                dateend: { $lte: dateEndObject },
                ...(source !== "ALL" && { source: source }), // Add `source` condition only if it's not "ALL"
            });
            let mergedContentIds = new Set(contentIds);
            subsetQueries.forEach(subsetQuery => {
                subsetQuery.contentid.forEach(id => mergedContentIds.add(id.toString()));
            });
            const subsetQueryIds = subsetQueries.map(q => q._id);
            await Query.deleteMany({ _id: { $in: subsetQueryIds } });
            console.log(`Deleted ${subsetQueries.length} subset queries`)
            // Step 7: Save the new query in the database
            const newQuery = new Query({
                keyword: query,
                source: source,
                datestart: dateStartObject,
                dateend: dateEndObject,
                requestcount: 10,
                contentid: Array.from(mergedContentIds),
            });

            await newQuery.save();
            console.log(`Saved new query to database`)
            //Step 8: Return results to client
            console.log(`Response of ${contentList.length} results sent to client\n`)
            res.json(contentList);


        } catch (err) {
            console.error('Error saving content to DB:', err);
            res.status(500).send('Unknown Server Error');
        }
    });

}
export default getData;
