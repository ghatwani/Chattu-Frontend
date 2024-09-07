import React, { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Table'
import { Avatar, Box, Skeleton, Stack } from '@mui/material'
import { dashboardData } from '../../components/constants/sampleData'
import { fileFormat, transformImage } from "../../lib/feature";
import RenderAttachment from "../../components/shared/RenderAttachment";
import moment from 'moment'
import { useFetchData } from '6pp'
import { server } from '../../components/constants/config'
import { useErrors } from '../../hooks/hook'
const columns = [{
  field: "id",
  headerName: "ID",
  headerClassName: "table-header",
  width: 200
}, {
  field: "attachments",
  headerName: "Attachemnts",
  headerClassName: "table-header",
  width: 200,
  renderCell: (params) => {
    const attachments=params.row.attachments
    // console.log(attachments.attachments)
    return attachments?.length > 0 ? attachments.map((i) => {
      const url=i.url;
      console.log(url)
      const file=fileFormat(url)
      return (
      <Box alignItems={"center"}>
        <a href={url}
          download
          target='_blank'
          style={{
            color:"black"
          }}
        >
          {RenderAttachment(file, url)}
        </a>
      </Box>
      );
    }) : "No Attachments"
    }
},
{
  field: "content",
  headerName: "Content",
  headerClassName: "table-header",
  width: 400,
}, {
  field: "sender",
  headerName: "Sent By",
  headerClassName: "table-header",
  width: 200,
  renderCell: (params) => (
    <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
      <Avatar alt={params.row.sender.name} src={params.row.avatar} />
      <span>{params.row.sender.name}</span>
    </Stack>)
}, {
  field: "chat",
  headerName: "Chat",
  headerClassName: "table-header",
  width: 220,
},
  , {
  field: "groupChat",
  headerName: "Group Chat",
  headerClassName: "table-header",
  width: 100,
},
{
  field: "createdAt",
  headerName: "Time",
  headerClassName: "table-header",
  width: 250,
}
]
// columns.map(i=>console.log(i))
const MessageManagement = () => {
  
  const { loading, data, error } = useFetchData(`${server}/api/v1/admin/messages`, "dashboard-messages")
  // console.log(data)

  useErrors([{
    isError: error,
    error: error,
  }])

  const [rows, setRows] = useState([]) //this state is for single user and it is mapped through key: value as id and transformation of avatar is needed as without it will show the url thats why we have used rendercell to get the image

  useEffect(() => {
   if(data){
    setRows(data.messages.map((i) => ({
      ...i, id: i._id, sender: {
        name: i.sender.name,
        avatar: transformImage(i.sender.avatar, 50),
        createdAt: moment(i.createdAt).format('MMMM Do YYYY, h:mm:ss a'),
      }
    })))
   }
  }, [data])

  return (
    <AdminLayout>
      {
        loading? <Skeleton height={"100vh"}/> :(
          <Table heading={"All Messages"} columns={columns} rows={rows} rowHeight={200}/>
        )
      }
    </AdminLayout>
  )
}

export default MessageManagement