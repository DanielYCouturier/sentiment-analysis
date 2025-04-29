from flask import request, jsonify
from datetime import datetime
from schemas.content_schema import Content
from schemas.query_schema import Query
from scraping.scrape_data import scrape_data
def get_default(key):
    current_year = datetime.now().year
    defaults = {
        "dateStart": f"{current_year}-01-01",
        "dateEnd": "9999-09-09",
        "source": "ALL",
        "sentiment": "ALL",
        "model": "LOCAL"
    }
    return defaults.get(key)

def get_data():
    data = request.get_json()
    
    query = data.get("query")
    if not query:
        return jsonify([])
    date_start = datetime.strptime(data.get("dateStart") or get_default("dateStart"), "%Y-%m-%d")
    date_end = datetime.strptime(data.get("dateEnd") or get_default("dateEnd"), "%Y-%m-%d")
    source = data.get("source", get_default("source"))
    sentiment = data.get("sentiment", get_default("sentiment"))
    print("\nReceived Request with Parameters:")
    print("\tQuery:",query)
    print("\tDate Start:",date_start)
    print("\tDate End:",date_end)
    print("\tSource:",source)
    print("\tSentiment:",sentiment)

    
    
    # Step 2: Check if query is in database
    cached_query = Query.objects(
        keyword=query,
        source__in=[source, "ALL"],
        datestart__lte=date_start,
        dateend__gte=date_end,
    ).first()
    
    if cached_query:
        filtered_content = [c for c in cached_query.contentid
                            if (source == "ALL" or c.source == source) and
                            date_start <= c.date <= date_end]
        print(f"Found {len(filtered_content)} matching of {len(cached_query.contentid)} relavent results in database")
        return jsonify([{
            "title": c.title,
            "username": c.username,
            "content_body": c.content_body,
            "date": c.date.strftime("%Y-%m-%d"),
            "source": c.source,
            "source_url": c.source_url,
        } for c in filtered_content])

    # Step 3: Fallthrough; Call data collection function
    print(f"No results in database, Starting data collection at {datetime.now()}")
    content_list = scrape_data(query, date_start, date_end, source, sentiment)
    print(f"Data collection finished at {datetime.now()}")

    # Step 4: Save new content to database
    print(f"Saving results to database...")
    content_docs = [Content(**item).save() for item in content_list]
    content_ids = [c.id for c in content_docs]
    
    # Step 5: Merge subset queries
    subset_queries = Query.objects(
        keyword=query,
        datestart__gte=date_start,
        dateend__lte=date_end,
        **({"source": source} if source != "ALL" else {})
    )
    print(f"Found {len(subset_queries)} related queries. Merging...")
    merged_content_ids = set(content_ids)
    for subset in subset_queries:
        merged_content_ids.update(subset.contentid)
    
    subset_queries.delete()
    
    # Step 6: Save new query
    new_query = Query(
        keyword=query,
        source=source,
        datestart=date_start,
        dateend=date_end,
        requestcount=10,
        contentid=list(merged_content_ids)
    )
    new_query.save()
    print(f"Finished saving results.")

    return jsonify(content_list)