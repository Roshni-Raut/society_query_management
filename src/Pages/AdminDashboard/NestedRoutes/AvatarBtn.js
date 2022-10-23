import { Alert, Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle,  Grid, Snackbar } from '@mui/material'
import { updateProfile } from 'firebase/auth'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { auth, color, storage } from '../../../firebase'

const AvatarBtn = ({profile}) => {
    const [open,setOpen]=useState(false)    
    const acceptedFilesTypes=['image/png','image/jpeg','image/pjpeg']
    const isValidFile=(file)=>acceptedFilesTypes.includes(file.type);
    const [error,setError]= useState("")
    const [img,setImage]=useState(null)
    const avatarEditorRef=useRef();

    const getBlob=(canvas)=>{
        return new Promise((resolve,reject)=>{
            canvas.toBlob((blob)=>{
                if(blob){
                    resolve(blob);
                }else{
                    reject(new error('File Process error'))
                }
            })
        })
    }
    const onFileinputChange=(e)=>{
        console.log(e.target.files)
        if(e.target.files.length===1){
            const curr=e.target.files[0]
            if(isValidFile(curr)){
                setImage(curr)
                setOpen(true)
            }else{
                setError("Invalid File Type!!!");
                setTimeout(()=>{setError("")},6000)
            }
        }
    }
    const uploadImage=async()=>{
        /* avatar editor stores image on canvas */
       const canvas=avatarEditorRef.current.getImageScaledToCanvas();
        try{
            /*converting canvas to blob */
           const blobFile= await getBlob(canvas)
            const storageRef=ref(storage,"avatar"+auth.currentUser.uid)
            const metadata = {
                cacheControl: 'public,max-age=300',
                contentType: img.type,
              };
            uploadBytes(storageRef, blobFile,metadata).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    updateProfile(auth.currentUser, {
                        photoURL: downloadURL
                      })
                });
            });
            console.log(profile)
            setOpen(false)
        }catch(error){
            setError(error)
            setTimeout(()=>{setError("")},6000)
        }
    }
  return (
    <div>
        <Snackbar open={ error!=="" } anchorOrigin={{ vertical: 'top', horizontal: 'center', }} >
        <Alert   variant="filled" severity="error" sx={{ minWidth: '220px' }}>
          {error}
        </Alert>
      </Snackbar>
        <Grid item xs={12} sx={{mx:5,mt:1,display:"flex",justifyContent:"center"}}> 
              <Avatar
                src={profile.photoURL}
                sx={{ width: 150, height: 150 }}
              />
              {console.log(profile)}
            </Grid>
          <Grid item xs={12} sx={{mx:5,mt:1,display:"flex",justifyContent:"center"}}>
              <label htmlFor='avatar-upload' className='btn btn-secondary btn-sm'>
                select new avatar
              <input id="avatar-upload" 
              type="file" 
              style={{display:"none"}} 
              accept=".png, .jpeg, .jpg"
              onChange={onFileinputChange}
              />
              </label>
            </Grid>

        <Dialog open={open} onClose={()=>setOpen(false)} >
      <DialogTitle>Adjust and Upload Avatar</DialogTitle>
        <DialogContent sx={{display:"flex", justifyContent:"center",alignItems:"center"}}>
            {img &&
             <AvatarEditor
             ref={avatarEditorRef}
             image={img}
             width={300}
             height={300}
             borderRadius={150}
             border={10}             
             rotate={0}
           />
            }

        </DialogContent>
        
        <DialogActions sx={{mb:1}}>
          <Button size="small" type="button"  sx={{backgroundColor:color}} variant="contained" fullWidth 
          onClick={uploadImage}>Upload new Avatar</Button>
        </DialogActions>
  
    </Dialog>
    </div>
  )
}

export default AvatarBtn