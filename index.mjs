import express from 'express'
import { Prisma } from './prisma/prisma.mjs'
const app = express()
const port = 3000
app.use(express.json)

app.post('/post', async (req, res) => {
  console.log(res);

  const user = await prisma.user.create(
    {
      data:{
        
      }
    }
  )
  res.status(200).json({name:'Hello World!'})
})

app.listen(port, ()=>{
    console.log(`server start from ${port}`)
})


