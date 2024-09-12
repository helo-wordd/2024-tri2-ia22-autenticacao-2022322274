const mainForm = document.querySelector('form')

void async function () {
  const response = await fetch('/users')
  const users = await response.json()
  users.forEach(user => {
    const newForm = mainForm.cloneNode(true)
    newForm.name.value = user.name
    newForm.email.value = user.email
    newForm.password.value = user.password
    newForm.dataset.id = user.id
    newForm.id.readOnly = true
    mainForm.before(newForm)
  })
  console.log(users)
}()

document.addEventListener('submit', async (event) => {
  event.preventDefault()
  const action = event.submitter.dataset.action ?? null
  const currentForm = event.target
  
  if (action === 'delete') {
    const id = currentForm.dataset.id
    const method = 'DELETE'
    const url = `/users/${id}`
    const response = await fetch(url, { method })
    if (!response.ok)
      return console.error('Error:', response.statusText)
    currentForm.remove()
    return
  }
  
  if (action === 'update') {
    
    const id = currentForm.dataset.id
    const method = 'PUT'
    const url = `/users/${id}`
    const credentials = "same-origin"
    const headers = { 'Content-Type': 'application/json' }
    const name = currentForm.name.value
    const email = currentForm.email.value
    const password = currentForm.password.value
    const body = JSON.stringify({ name, email, password })
    const response = await fetch(url, { method, headers, credentials, body, })
    if (!response.ok)
      return console.error('Error:', response.statusText)
    const responseData = await response.json()

    window.alert(credentials)

    const currentId = fetch(url,
      {
        method: 'GET',
        credentials: 'include'
      })
      .then((response) => response.json())
      .then((json) => {
        console.log('CookieRequested');
      }).catch((err) => {
        console.log(err);
    })

    if(currentId == id){
      currentForm.name.value = responseData.name
      currentForm.email.value = responseData.email
      currentForm.password.value = responseData.password
    }

    window.alert(currentId)
    window.alert(id)

    return
  }
  
  if (action === 'create') {
    const method = 'POST'
    const url = '/users'
    const headers = { 'Content-Type': 'application/json' }
    //const credentials = "same-origin"
    const name = currentForm.name.value
    const email = currentForm.email.value
    const password = currentForm.password.value
    const body = JSON.stringify({ name, email, password })
    const response = await fetch(url, { method, headers, body }) //'credentials, ' dps de headers
    if (!response.ok)
      return console.error('Error:', response.statusText)
    const responseData = await response.json()
    const newForm = mainForm.cloneNode(true)
    newForm.name.value = responseData.name
    newForm.email.value = responseData.email
    newForm.password.value = responseData.password
    newForm.dataset.id = responseData.id
    newForm.id.readOnly = true
    mainForm.reset()
    mainForm.before(newForm)
    return
  }

  if (action === 'login') {
    const method = 'GET'
    const url = '/users'
    const headers = { 'Content-Type': 'application/json' }
    const email = currentForm.email.value
    const password = currentForm.password.value
    const body = JSON.stringify({ email, password })
    const response = await fetch(url, { method, headers, body }) //nao funciona por algum motivo

    window.alert('teste0')

    if (!response.ok)
      return console.error('Error:', response.statusText)
    const responseData = await response.json()

    window.alert('teste1')

    const dbpassword = await db.get('SELECT password FROM users WHERE email = ?', [email])
    
    window.alert('teste2')
    if (!(dbpassword == password))
      return console.error('Error: Wrong Password' )
    const id = await db.get('SELECT id FROM users WHERE email = ?', [email])
    id = JSON.stringify({ id })
    res.setHeader("Cookie", id)

    window.alert(id)
    

    /*
    const newForm = mainForm.cloneNode(true)
    newForm.name.value = responseData.name
    newForm.email.value = responseData.email
    newForm.password.value = responseData.password
    newForm.dataset.id = responseData.id
    newForm.id.readOnly = true
    mainForm.reset()
    mainForm.before(newForm)
    */
    return
  }
})