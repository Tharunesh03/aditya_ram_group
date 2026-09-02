"""
Adityaram Group — celebration-aware landing site.

Frontend-only marketing website (no business/backend logic, no database).
Flask is used purely as a static web server to serve the page. All festival
detection + celebration poster logic runs in the browser (static/js/festival.js)
so the site stays content-only on the server side.

Run:
    .venv/bin/python app.py
    # then open http://127.0.0.1:5000  (or the live preview URL)
"""

from flask import Flask, render_template

app = Flask(__name__)

# Landing page — serves the single-page marketing site.
@app.route("/")
def index():
    return render_template("index.html")


# Static assets (js/css/images) should not be cached by the browser, otherwise
# a stale festival.js keeps showing buttons we've since removed. Cache-busting
# ?v= params on the tags plus these headers guarantee the latest files load.
@app.after_request
def no_cache(response):
    if response.content_type.startswith("text/css") or response.content_type.startswith("text/javascript"):
        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response


if __name__ == "__main__":
    # 0.0.0.0 so the sandbox live preview can reach it; debug off for a clean demo.
    app.run(host="0.0.0.0", port=5000, debug=False)
