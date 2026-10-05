import express, { type Express, type Request, type Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';

const app: Express = express();
const PORT = 3000;

app.use(express.json());

const filePath = path.join(process.cwd(), 'output.txt');

interface User {
  id: string;
  username: string;
}

// 1 чтение всех пользователей из файла
function readUsers(): User[] {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '', 'utf-8');
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  if (!content.trim()) return [];

  return content
    .trim()
    .split('\n')
    .map((line) => {
      const [id, username] = line.split(':');
      return {
        id: id ? id.trim() : '',
        username: username ? username.trim() : '',
      };
    });
}

// 2 перезапись файла новым массивом пользователей
function writeUsers(users: User[]): void {
  const content = users.map((u) => `${u.id}:${u.username}`).join('\n');
  fs.writeFileSync(filePath, content, 'utf-8');
}

//получить всех пользователей
app.get('/user', (req: Request, res: Response) => {
  const users = readUsers();
  res.json(users);
});

//получить одного пользователя по id
app.get('/user/:id', (req: Request, res: Response) => {
  const users = readUsers();
  const { id } = req.params;

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).send(`User with id=${id} not found`);
  }

  return res.send(`User with id=${id} found. His username is ${user.username}`);
});

//создать нового пользователя
app.post('/user', (req: Request, res: Response) => {
  const { username, id } = req.body;

  if (!id || !username) {
    return res.status(400).send('id and username required');
  }

  const users = readUsers();

  const existingUser = users.find((u) => u.id === String(id));
  if (existingUser) {  // существует ли уже пользователь с таким id
    return res.status(400).send(`User with id=${id} already exists`);
  }

  const newUser: User = { id: String(id), username };
  users.push(newUser);
  writeUsers(users);

  return res.send(`User with ${username} and ${id} saved in DB`);
});

//обновить имя пользователя по id
app.patch('/user/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { username } = req.body;

  if (!username) {
    return res.status(400).send('username is required for update');
  }

  const users = readUsers();
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).send(`User with id=${id} not found`);
  }

  user.username = username;
  writeUsers(users);

  return res.json(user);
});

//удалить пользователя по id
app.delete('/user/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const users = readUsers();

  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).send(`User with id=${id} not found`);
  }

  const [deletedUser] = users.splice(index, 1);
  writeUsers(users);

  return res.json(deletedUser);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});