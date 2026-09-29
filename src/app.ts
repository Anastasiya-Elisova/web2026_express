import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();

const PORT = 3000;

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/user', (req: Request, res: Response) => {
  res.send(`Hello. You are ${req.query.name}`);
});


app.get('/user/:id', (req: Request, res: Response) => {
  console.log(req.params)
  res.send(`Hello. You sent ${req.params.id}`);
});

app.post('/user', (req: Request, res: Response) => {
  console.log('>>>>>>>>>>>', req.body)
  res.send('Hello from POST /user');
});


app.delete('/user', (req: Request, res: Response) => {
  console.log('>>>>>>>>>>>', req.body)
  res.send('Hello from DELETE /user');
});

app.listen(PORT, ()=>{
  console.log(`App listening on ${PORT}`)
});