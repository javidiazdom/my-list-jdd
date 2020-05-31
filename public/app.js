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

function showCalendar() {

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