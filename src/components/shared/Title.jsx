import React from 'react'
import {Helmet} from "react-helmet-async"
const Title = ({
    title="Chat",
    description="This is a chatting application"
}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name='description' content={description}/>
    </Helmet>
  )
}

export default Title

//helmet is used to set HTTP headers