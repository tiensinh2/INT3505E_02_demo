async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  localStorage.setItem('token', data.token);
  document.getElementById('output').innerText = 'Logged in!\n' + JSON.stringify(data, null, 2);
}

async function getProtected() {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/protected', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  document.getElementById('output').innerText = JSON.stringify(data, null, 2);
}
