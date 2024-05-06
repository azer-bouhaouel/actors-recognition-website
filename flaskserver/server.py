from flask import Flask , jsonify , request
from flask_cors import CORS
import face_recognition
import json
import numpy as np
import base64
from io import BytesIO

app = Flask(__name__)
CORS(app)

@app.route("/api",methods=['POST'])
def api():
    src = request.files['image']
    img = face_recognition.load_image_file(src)
    faces = face_recognition.face_encodings(img)
    if len(faces) != 1:
        return jsonify({'name':"face error",'face':'face error'})
    face = faces[0] 

    
    with open("learn.json","r") as f:
        data = json.load(f)
    person_name = ""
    for name , name_faces in data.items():
        result = face_recognition.compare_faces(np.array(name_faces),face)
        if True in result:
            person_name = name
            break
    if person_name == "":
            return jsonify({'name':"no match",'face':face.tolist()})
    with open("learn.json","w") as f:
        if face.tolist() not in data[person_name]:
            data[person_name].append(face.tolist())
            json.dump(data,f)
        else:
            json.dump(data,f)
        return jsonify({'name':person_name,'face':face.tolist()})

@app.route("/names",methods=["GET"])
def names():
    with open("learn.json","r") as f:
        data = json.load(f)
    return jsonify(res=list(data.keys()))



@app.route("/add",methods=["POST"])
def add():
    obj = request.get_json()
    with open("learn.json","r") as f:
        data1 = json.load(f)
    data1[obj['name']]=[obj['face']]
    with open("learn.json",'w') as f:
        json.dump(data1,f)
    return jsonify(res="done")



if(__name__=='__main__'):
    app.run(host='0.0.0.0',debug=True,port=8080)
