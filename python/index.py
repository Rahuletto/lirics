import syncedlyrics
from fastapi import FastAPI, Request
import re

def extract_lyric_info_array(array):
    result = []
    for string in array:
        # Regular expression pattern to match the timestamp and lyric
        pattern = r"\[(\d{2}):(\d{2})\.\d{2}\]\s(.*)"

        # Search for the pattern in the string
        match = re.search(pattern, string)

        if match:
            # Extract seconds, lyric
            seconds = int(match.group(1)) * 60 + int(match.group(2))
            lyric = match.group(3)
            result.append({"seconds": seconds, "lyrics": lyric})
    return result


app = FastAPI()

@app.get("/api/py/ping")
def ping():
    return {"message": "Pong"}  # Always return as Dictionary (JSON)


padding = [
          { "seconds": 9999, "lyrics": "..." },
      { "seconds": 9999, "lyrics": ".." },
      { "seconds": 9999, "lyrics": "." },
      { "seconds": 9999, "lyrics": " " }
]
@app.get("/api/py/lyrics")
def lyrics(query: str): 
    try:
        lrc = syncedlyrics.search(query, allow_plain_format=True)
        arr = [ x.strip() for x in lrc.split('\n') ]
        lra = extract_lyric_info_array(arr)

        lra = lra + padding
        return {"lyrics": lra }
    except:
        return {"lyrics": [] }
    