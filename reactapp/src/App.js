import "./App.css";
import { useState } from "react";

const Spinner = () => {
  return (
    <div className="spinner">
      <div className="cercle"></div>
    </div>
  );
};

const AddPerson = ({ closeAdd, obj }) => {
  const [name, setName] = useState("");
  const add = () => {
    if (name === "") return;
    document.querySelector(".spinner").style.display = "flex";
    fetch("http://127.0.0.1:8080/names")
      .then(async (res) => {
        const data = await res.json();
        document.querySelector(".spinner").style.display = "none";
        return data;
      })
      .then((data) => {
        const names = data["res"];
        console.log(names);
        if (names.includes(name)) {
          alert("this name exists");
          return;
        }
        obj["name"] = name;
        fetch("http://127.0.0.1:8080/add", {
          method: "POST",
          body: JSON.stringify(obj),
          headers: { "Content-Type": "application/json" },
        });
        closeAdd();
      });
  };
  return (
    <div className="add-person">
      <div className="wrapper">
        <input
          placeholder="Who's this ?"
          id="person-name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></input>
        <button onClick={add}>add</button>
      </div>
    </div>
  );
};

const ShowPerson = ({ closeShow, obj, image }) => {
  const back = () => {
    closeShow();
  };
  return (
    <div className="show-person">
      <div className="res-card">
        <h2>{obj["name"]}</h2>
        <img src={image} alt=""></img>
      </div>
      <button onClick={back}>back</button>
    </div>
  );
};

function App() {
  const [file, setFile] = useState(null);
  const [add, setAdd] = useState(false);
  const [show, setShow] = useState(false);
  const [wrapper, setWrapper] = useState(true);
  const [obj, setObj] = useState(null);
  const [image, setImage] = useState("");
  const [imageSelected, setImageSelected] = useState(false);
  const closeAdd = () => {
    setAdd(false);
    setFile(null);
    setWrapper(true);
  };
  const closeShow = () => {
    setShow(false);
    setWrapper(true);
  };
  const handleSend = () => {
    if (imageSelected === false) {
      alert("no image selected , try again !");
      return;
    }
    document.querySelector(".spinner").style.display = "flex";
    const formData = new FormData();
    formData.append("image", file);
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result;
      setImage(base64String);
    };
    reader.readAsDataURL(file);
    fetch("http://127.0.0.1:8080/api", {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        const data = await res.json();
        document.querySelector(".spinner").style.display = "none";
        return data;
      })
      .then((data) => {
        if (data["name"] === "no match") {
          setObj(data);
          setAdd(true);
          setWrapper(false);
        } else if (data["name"] === "face error") {
          alert("more than one face detected or no faces ! try again");
          window.location.reload();
        } else {
          setObj(data);
          setShow(true);
          setWrapper(false);
        }
      })
      .catch(() => {
        alert("sorry an error occured !");
      });
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImageSelected(true);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        handleFileChange({ target: { files: [file] } });
      }
    }
  };
  const btnClick = () => {
    document.querySelector(".CelImg").click();
  };

  return (
    <div id="app">
      <Spinner />
      {add && <AddPerson closeAdd={closeAdd} obj={obj} />}
      {show && <ShowPerson closeShow={closeShow} obj={obj} image={image} />}
      {wrapper && (
        <div className="wrapper">
          <button id="selectImg" onClick={btnClick}>
            {imageSelected ? "Image selected" : "Select an Image"}{" "}
            <input
              type="file"
              accept="image/*"
              multiple={false}
              className="CelImg"
              onChange={handleFileChange}
              onDrop={handleDrop}
            />
          </button>
          <button onClick={handleSend}>send</button>
        </div>
      )}
    </div>
  );
}
export default App;
