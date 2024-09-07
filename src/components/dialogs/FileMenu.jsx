import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from '@mui/material'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setisFileMenu, setuploadingLoader } from '../../redux/reducers/misc'
import { AudioFile as AudioFileIcon, Image as ImageIcon, UploadFile as UploadFileIcon, VideoFile as VideoFileIcon } from '@mui/icons-material'
import toast from 'react-hot-toast'
import { useSendAttachmentsMutation } from '../../redux/api/api'

const FileMenu = ({ chatId, anchorEl }) => {
  const dispatch = useDispatch()

  const imageRef = useRef(null)
  const audioRef = useRef(null)
  const videoRef = useRef(null)
  const fileRef = useRef(null)

  const [sendAttachments] = useSendAttachmentsMutation()

  const closeFileMenu = () => {
    dispatch(setisFileMenu(false))
  }

  const fileChnageHandler = async (e, keys) => {
    const files = Array.from(e.target.files);

    if (files.length <= 0) {
      return;
    }

    if (files.length > 5) {
      return toast.error(`you can only send 5 ${keys} at a time`)
    }
    dispatch(setuploadingLoader(true))

    const toastId = toast.loading(`Sending ${keys}...`)
    closeFileMenu();



    try {
      const myForm = new FormData()
      myForm.append("chatId", chatId)
      files.forEach((file)=>myForm.append("files", file))
      const res = await sendAttachments(myForm)

      if (res.data) toast.success(`${keys} sent successfully`, {
        id: toastId
      })

      else {
        toast.error(`Failed to send ${keys}`, { id: toastId })
      }
    } catch (error) {
      console.log(error, { id: toastId })
    } finally {
      dispatch(setuploadingLoader(false))
    }
  }

  const selectRef = (ref) => {
    ref.current?.click()
  }


  const { isFileMenu } = useSelector(state => state.misc)
  return (
    <Menu open={isFileMenu} anchorEl={anchorEl} onClose={closeFileMenu}>
      <div style={{
        width: "10rem"
      }}>
        <MenuList>
          <MenuItem onClick={() => { selectRef(imageRef) }}>
            <Tooltip title="Image">
              <ImageIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Image</ListItemText>
            <input
              type='file'
              multiple accept="image/png , image/jpeg, image/jpg, image/gif"
              style={{ display: "none" }}
              onChange={(e) => fileChnageHandler(e, "Images")}
              ref={imageRef} />
          </MenuItem>


          <MenuItem onClick={() => { selectRef(audioRef) }}>
            <Tooltip title="Audio">
              <AudioFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
            <input
              type='file'
              multiple accept="audio/mpeg, audio/wav"
              style={{ display: "none" }}
              onChange={(e) => fileChnageHandler(e, "Audios")}
              ref={audioRef} />
          </MenuItem>


          <MenuItem onClick={() => { selectRef(videoRef) }}>
            <Tooltip title="Video">
              <VideoFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Video</ListItemText>
            <input
              type='file'
              multiple accept="video/mp4, video/webm, video/ogg"
              style={{ display: "none" }}
              onChange={(e) => fileChnageHandler(e, "Videos")}
              ref={videoRef} />
          </MenuItem>

          <MenuItem onClick={() => { selectRef(fileRef) }}>
            <Tooltip title="File">
              <UploadFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
            <input
              type='file'
              multiple accept="*"
              style={{ display: "none" }}
              onChange={(e) => fileChnageHandler(e, "Files")}
              ref={fileRef} />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  )
}

export default FileMenu