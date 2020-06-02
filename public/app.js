document.addEventListener("DOMContentLoaded", event => {
   const app = firebase.app();
   //let tareas_usuario = tareas.where('usuario','==',)
   firebase.auth().onAuthStateChanged(user => {
      if (user) {
         showTasks()
         changeLoginButton(user)
      } else {
         showLoginButton()
      }
   })
})

const weekdays = ['L','M','X','J','V']

function showTasks() {
   function getTasks (user) {
      let db  = firebase.firestore()
      let tasks = db.collection('tasks')
      let usertasks = tasks.where('email','==',user.email).get()
      return usertasks.then(doc => {
         let res = ""
         doc.forEach(element => {
            res+= "<div class = 'task'><div class = 'check'></div>"+element.data().name+"</div>"
         });
         return res
      })
   }
   function getDia(numDia) {
      switch (numDia) {
         case 0: return "lunes, ";
         case 1: return "martes, ";
         case 2: return "miércoles, ";
         case 3: return "jueves, ";
         case 4: return "viernes, ";
         case 5: return "sábado, ";
         case 6: return "domingo, ";
      }
   }
   function getMes(numMes) {
      switch (numMes) {
         case 0: return "enero"
         case 1: return "febrero";
         case 2: return "marzo";
         case 3: return "abril";
         case 4: return "mayo";
         case 5: return "junio";
         case 6: return "julio";
         case 7: return "agosto";
         case 8: return "septiembre";
         case 9: return "octubre";
         case 10: return "noviembre";
         case 11: return "diciembre";
      }
   }
   var date = new Date()
   var dia = getDia(date.getDay()) + date.getDate() + " de " + getMes(date.getMonth())
   document.getElementById("content").innerHTML = "<div id = 'container' class = 'container'><h3>"+dia+"</h3><div class = 'tasks' id = 'tasks'><div class = 'add-task'><img src= 'assets/Cross.png'><input type=\"text\" id = 'name-input' placeholder = 'Añadir Tarea'></div></div></div>"

   if (firebase.auth().currentUser) {
      tasks = getTasks(firebase.auth().currentUser).then((data) => {
         document.getElementById("tasks").innerHTML += data
         document.getElementById('name-input').addEventListener("keydown", (press) => {
            if (press.keyCode == 13) {
               addTask(document.getElementById('name-input').value, firebase.auth().currentUser.email)
               document.getElementById('name-input').value = ""
               showTasks()
            }
         })
         let checks = document.getElementsByClassName("check")
         Array.prototype.forEach.call(checks, (element) => {
            element.addEventListener("click", (click) => {
               removeTask(element.parentElement.textContent, firebase.auth().currentUser.email)
            })
         })
      })
   }
}

function showCalendar() {
   document.getElementById("content").innerHTML = "<div id = 'container' class = 'container'><div id = 'days' class = 'days'></div><div id = 'calendar' class = 'calendar'></div></div>"
   weekdays.forEach((day) => {
      document.getElementById('days').innerHTML += "<h4>" + day + "</h4>"
   })
   weekdays.forEach((day) => {
      document.getElementById('days').innerHTML += "<div id = " + day + " class = 'day'></div>"
   })
   getCalendarSchedule()
}

function addCalendarTask (day) {
   document.getElementById("add-calendar-task-"+day.id).innerHTML = "<input id = 'calendar-task-name' placeholder = 'Añadir Tarea'>"
   document.getElementById('calendar-task-name').addEventListener("keydown", (press) => {
      if (press.keyCode == 13) {
         let name = document.getElementById('calendar-task-name').value
         let db = firebase.firestore()
         let setDoc = db.collection('calendar').doc(firebase.auth().currentUser.email+'-'+day.id+'-'+name).set({
            name: name,
            email: firebase.auth().currentUser.email,
            day: day.id,
            created: firebase.firestore.Timestamp.now()
         })
         setDoc.then((result) => {
            showCalendar()
         })
      }
   })
}

function deleteCalendarTask (task,day) {
   let db = firebase.firestore()
   db.collection('calendar').doc(firebase.auth().currentUser.email + '-' + day + '-' + task).delete().then(() => {
      showCalendar()
   })
}

function getCalendarSchedule() {
   let db = firebase.firestore()
   let user = firebase.auth().currentUser
   weekdays.forEach((day) => {
      let tasks = db.collection('calendar').where('email','==', user.email).where('day','==',day).get()
      tasks.then(result => {
         docsres = result.docs
         docsres.sort((a,b) => {
            if (a.data().created.seconds < b.data().created.seconds) {
               return -1
            } else {
               if (a.data().created.seconds == b.data().created.seconds) {
                  return 0
               }
               return 1
            }
         })
         docsres.forEach(element => {
            document.getElementById(day).innerHTML += "<div class = 'calendar-task' id = "+element.data().name+">"+element.data().name+"<div class = 'delete-calendar-task' id = 'delete-calendar-task' onclick = \"deleteCalendarTask('"+element.data().name+"','"+element.data().day+"')\">x</div></div>"
         })
         document.getElementById(day).innerHTML += "<div class = 'calendar-task' id = 'add-calendar-task-"+day+"'><img src= 'assets/Cross.png' onclick = addCalendarTask(" + day + ")></div>"
      })
   })
}

function addTask (name, email) {
   let newTask = {
      name : name,
      email : email
   }
   let db = firebase.firestore()
   let setDoc = db.collection('tasks').doc(email + '-' + name).set(newTask)
}

function removeTask (name, email) {
   let db = firebase.firestore()
   db.collection('tasks').doc(email + '-' + name).delete().then(() => {
      showTasks()
   })
}



// Login stuff

function showLoginButton() {
   document.getElementById("right-container").innerHTML = "<div class = 'button-container' onClick = 'googleLogin()'><img src ='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1024px-Google_%22G%22_Logo.svg.png'>Entrar con Google</div>";
}


function googleLogin() {
   const provider = new firebase.auth.GoogleAuthProvider();
   
   firebase.auth().signInWithPopup(provider)
      .then(result => {
         changeLoginButton(result.user)
      })
}

function changeLoginButton(user) {
   document.getElementById("right-container").innerHTML = "<div class = 'info-container'>"+ user.displayName+"<img src = "+user.photoURL+"></div>"
}