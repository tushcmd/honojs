import { Hono } from 'hono';
import { basicAuth } from 'hono/basic-auth';
import { upgradeWebSocket } from 'hono/cloudflare-workers';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

// Return a JSON response
app.get('/api/hello', (c) => {
  return c.json({
    ok: true,
    message: 'Hello Hono!',
  });
});

// Request and response
app.get('/posts/:id', (c) => {
  const page = c.req.query('page');
  const id = c.req.param('id');
  c.header('X-Message', 'Hi!');
  return c.text(`You want to see ${page} of ${id}`);
});

app.post('/posts', (c) => c.text('Created!', 201));
app.delete('/posts/:id', (c) => c.text(`${c.req.param('id')} is deleted!`));

const View = () => {
  return `
    <html>
      <body>
        <h1>Hello Hono!</h1>
      </body>
    </html>
  `;
};

app.get('/page', (c) => {
  return c.html(View());
});

// Return raw response
// app.get('/', () => {
//   return new Response('Good morning!');
// });

// Middleware for basic authentication
app.use(
  '/admin/*',
  basicAuth({
    username: 'admin',
    password: 'secret',
  })
);

app.get('/admin', (c) => {
  return c.text('You are authorized!');
});

// Upgrade to WebSocket
app.get(
  '/ws',
  upgradeWebSocket((c) => {
    return {
      onMessage(event, ws) {
        ws.send('Hello from WebSocket!');
      },
      onClose(event, ws) {
        // Optional: handle close event
      },
    };
  })
);

export default app;
