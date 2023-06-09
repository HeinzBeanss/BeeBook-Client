import React, { useState } from "react";
import defaultpfp from "../../Assets/default_bee_profile.jpg";
import upload from "../../Assets/upload.svg";

const HomeCreatePost = ({isMobile, guestMode, setRefreshPostData, setRefreshData, userData }) => {

    const [imageFile, setImageFile] = useState(null);
    const [postData, setPostData] = useState({
        content: "",
    });
    const [fileError, setFileError] = useState(<div></div>)
    const [fileName, setFileName] = useState("");

    const handleFileUpload = () => {
        setFileError(<div></div>)
        const fileInput = document.querySelector('.createpost-file');
        fileInput.click();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPostData({...postData, [name]: value});
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) {
            setImageFile(null);
            setFileName("");
            return;
        }

        const allowedFileTypes = [  
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/tiff',
        'image/webp'
        ];

        // Validate File Size
        if (file.size > 1 * 1024 * 1024) {
            setFileError(<div className='createpost-file-error'>Sorry, your file was too big. (Over 1MB)</div>)
            setFileName("");
            e.target.value = "";
            return;
        } 
        if (!allowedFileTypes.includes(file.type)) {
            setFileError(<div className='createpost-file-error'>{file.type} isn't a supported file type.</div>);
            e.target.value = "";
            setFileName("");
            return;
        }
        setFileError(<div></div>)
        setImageFile(file);
        setFileName(file.name);
    }

    const createPost = async (e) => {
        e.preventDefault();
        if (userData) {
          const formData = new FormData();
          formData.append("content", postData.content);
          formData.append("author", userData.updatedUser._id);
          if (imageFile) {
            formData.append("image", imageFile);
            formData.append("mimeType", imageFile.type);
          }
          const response = await fetch(`https://beebuddies.up.railway.app/api/users/${userData.updatedUser._id}/posts`, {
            method: "POST",
            body: formData,
          });
      
          if (response.ok) {
            const message = await response.json();
            setRefreshData(true);
            setRefreshPostData(true);
            setFileName("");
            setFileError(<div></div>);
            setPostData({
              content: "",
            });
          } else {
            const errorData = await response.json();
            console.error("Post creation failed:", errorData);
            setFileName("");
            setFileError(<div className="createpost-file-error">Error: {errorData.errors[0].msg}</div>);
          }
        } else {
          return;
        }
      };
      

    const handleGuestError = (e) => {
        e.preventDefault();
        setFileError(<div className='createpost-file-error'>Login to post</div>)
    }

    return (
        <div className='home-createpost-section'>

            {userData == null ? (
                <div className="createpost-top-section">
                    <div className='temp-user'></div>
                    <h5 className='createpost-title'>What's on your mind, username?</h5>
                </div>
            ) : (
                <div className="createpost-top-section">
                <img className="user-profilepicture-medium" src={guestMode ? defaultpfp : `data:${userData.updatedUser.profile_picture.contentType};base64,${userData.updatedUser.profile_picture.data}`} alt={`${userData.updatedUser.first_name} profile`} />
                <h4 className='createpost-title'>What's on your mind, {userData.updatedUser.first_name}?</h4>
                </div>
            )}

        <form onSubmit={guestMode ? handleGuestError : createPost} encType="multipart/form-data">
            <textarea className='createpost-text' name="content" placeholder={guestMode ? "Login to post something!" : 'Write your thoughts here'} rows={isMobile ? 2 : 4} value={postData.content} onChange={handleInputChange}></textarea>
            <div className="createpost-button-section">
            {fileError}
            <p className='createpost-file-name'>{fileName}</p>
            <div className="createpost-upload-button">
                <input disabled={guestMode} className="createpost-file" type="file" accept="image/*" onChange={handleFileChange}/>
                {isMobile ? 
                <div className="mobile-upload-button" disabled={guestMode} onClick={handleFileUpload}><img  className="upload-svg" src={upload}></img></div> :
                <button disabled={guestMode}className="custom-file-upload" type="button" onClick={handleFileUpload}>Upload an image</button> }
            </div>
            <button
             className='createpost-input-button' type='submit'>Create Post</button>
        </div>
        </form>
    </div>
    )
}

export default HomeCreatePost;