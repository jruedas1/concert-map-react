import json

def prepare_json_for_redis(source_file, destination_file):
    with open(source_file) as f:
        multiline_json = json.load(f)

    single_line_json = json.dumps(multiline_json, separators=(',', ':'))
    escaped = single_line_json.replace("'", r"\'")

    with open(destination_file, 'w') as f:
        f.write(escaped)

"""
This is the method used to prepare JSON for insertion to the Redis DB.
Note that it is intended for use with the nodeJS rbook tool, which
itself leverages the node-redis client library. 
A first attempt was made to use the python redis library and unify 
the entire process of loading the file and inserting to JSON, however
this application will be using node-redis and RedisJSON to retrieve data,
and initial attempts show that there are subtle but important 
differences in the way python and node reformat JSON for insertion,
which result in RedisJSON not working properly with python-formatted
JSON inserts. Rather than wrestling with this problem, the decision 
was made to work entirely with node-redis. This method therefore only
prepares the JSON for insertion and does not actually carry out the 
db insert.

The method takes care of two requirements for effective use of RedisJSON:
1) It flattens the JSON, eliminating spaces and newlines intended 
for human readability.
2) It escapes single quotes, essential for node-redis JSON. The actual
data that ends up in the db does not have escape characters before the single
quotes. This is because the actual Redis command to insert JSON requires
the JSON value to be between single quotes.
"""




