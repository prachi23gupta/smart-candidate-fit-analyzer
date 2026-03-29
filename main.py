from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Simple resource database
resources_db = {
    "Math": [
        "https://www.khanacademy.org/math",
        "https://ocw.mit.edu/courses/mathematics/"
    ],
    "Physics": [
        "https://www.physicsclassroom.com/",
        "https://ocw.mit.edu/courses/physics/"
    ],
    "CS": [
        "https://www.geeksforgeeks.org/",
        "https://www.w3schools.com/"
    ],
    "default": [
        "https://www.wikipedia.org/",
        "https://www.youtube.com/"
    ]
}

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/resources", methods=["POST"])
def get_resources():
    data = request.json
    subject = data.get("subject")

    res = resources_db.get(subject, resources_db["default"])
    return jsonify({"resources": res})

if __name__ == "__main__":
    app.run(debug=True)