import express, { type Express, type Request, type Response } from 'express';
import fs from 'fs';
const app: Express = express();

const PORT = 3000;
const db: {[key:string]: string}={}
app.use(express.json())

app.get('/', (req: Request, res:Response)=>
{
  res.send('Hello, World!!!');
});


app.post('/user', (req:Request, res: Response)=> {
 const {username, id} = req.body
 if (!id || !username ){
  res.status(400)
  res.send('id and username required')
 }

 fs.writeFile('output.txt', `${id}:${username},`, (err) => {
  if (err) {
    console.error('Ошибка:', err);
    return;
  }
  console.log('Файл записан успешно!');
});

  db[id]=username

  res.send(`User with ${username} and ${id} saved in DB`);
});

app.get('/user/:id', (req: Request, res:Response)=>
{
 const id = db[req.params.id as string]
 const username = db[id]
 if (!username){
  res.send(`User with id=${id} not found`)
 }

 res.send(`User with id=${id} found. His username is ${username}`)
});

app.listen(PORT, ()=>{
  console.log(`App listening on ${PORT}`)
});