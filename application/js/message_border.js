fetchData()

function fetchData(){
   fetch("/uploader/data")
  .then(response => response.json())
  .then(data => {
   const article = document.querySelector("article")
   for(let i = 0; i < data.length; i++){
      let content = data[i].content
      let fileUrl = data[i].fileName
      const htmlString =  `
         <div class="profile_pic_container">
            <img src= "${fileUrl}" class="profile_pic"></src>
         </div>
         <h4>${content}</h4>
         <hr>
      `  
      article.insertAdjacentHTML("afterbegin", htmlString)
   }
  });
}



const fileUploader = document.querySelector("#file-uploader");
fileUploader.addEventListener("change", (e) => {
   let file = e.target.files[0];
   if(file){
      const profilePic = document.querySelector(".profile_pic")
      profilePic.src = URL.createObjectURL(file)
   }
   let formData = new FormData();
   formData.append("file", file);
   upload(formData)
});


function upload(formData){
   const sendData = document.querySelector(".sendData");
   sendData.addEventListener("click", (e) => {
      let content = document.querySelector("#content").value;
      formData.append("content", content)
      fetch("/uploader", {
         method: "POST",
         body: formData,
      })
      .then(response => response.json())
      .then(data => {
            console.log(data)
            location.reload()
            // let profilePicURL = "data:image/jpg;base64," + data.image_url;
            // const profilePic = document.querySelector(".profile_pic")
            // profilePic.src = profilePicURL;
      })
      .catch(error => {
            console.log(error)
      })
   })
}
