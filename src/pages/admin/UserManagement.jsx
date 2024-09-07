import React, {useState, useEffect} from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import  Table  from '../../components/shared/Table'
import { Avatar, Skeleton } from '@mui/material'
import { dashboardData } from '../../components/constants/sampleData'
import { transformImage } from "../../lib/feature";
import { useFetchData } from '6pp'
import { server } from '../../components/constants/config'
import { useErrors } from '../../hooks/hook'

const columns=[{
  field:"id",
  headerName :"ID",
  headerClassName:"table-header",
  width:200
},{
  field:"name",
  headerName :"Name",
  headerClassName:"table-header",
  width:150,
},
{
  field:"avatar",
  headerName :"Avatar",
  headerClassName:"table-header",
  width:150,
  renderCell:(params)=><Avatar alt={params.row.name} src={params.row.avatar}/>
},{
  field:"username",
  headerName :"Username",
  headerClassName:"table-header",
  width:200,
},{
  field:"groups",
  headerName :"Groups",
  headerClassName:"table-header",
  width:200,
}]
// columns.map(i=>console.log(i))
const UserManagement = () => {
  const {loading, data, error}= useFetchData(`${server}/api/v1/admin/users`, "dashboard-users")
// console.log(data)

  useErrors([{
      isError:error,
      error:error,
  }])

  const [rows, setRows] = useState([]) //this state is for single user and it is mapped through key: value as id and transformation of avatar is needed as without it will show the url thats why we have used rendercell to get the image

  useEffect(() => {
    if(data){
      setRows(data.users.map((i)=>({
        ...i,
        id: i._id, 
        avatar:transformImage(i.avatar, 50)
      }))
    );
    }
  }, [data])
  
  return (
    <AdminLayout>
    {
      loading ? <Skeleton height={"100vh"}/> :(
        <Table heading={"All users"} columns={columns} rows={rows}/>
      )
    }
    </AdminLayout>
  )
}

export default UserManagement