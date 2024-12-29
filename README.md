# Actor-recognition-website using AI

# General logique:

Loads the uploaded image, recognizes faces using face_recognition, compares them to known faces, and updates the database with new faces if necessary.

# server:

/api: Accepts POST requests with an image file containing a face. It uses the face_recognition library to recognize and encode faces, compares them to a list of known faces stored in a JSON file (learn.json), and returns the recognized person's name and face data if a match is found. If no match is found or multiple faces are detected, it returns appropriate error messages.

/names: Returns a list of names from the known faces in the learn.json file.

/add: Accepts POST requests to add new faces to the known faces list in learn.json.

# client:

Sends the uploaded image to the Flask server (/api) for facial recognition.

Handles responses from the server, such as displaying recognized person information or prompting to add a new face if no match is found.

