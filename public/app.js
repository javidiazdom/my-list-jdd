document.addEventListener("DOMContentLoaded", event => {
   const app = firebase.app();

   const db = firebase.firestore();

   const post = db.collection('asignaturas').doc('ruuzn0XpBztWyVLTHixc');
   
   post.get()
   .then(doc => {
      const data = doc.data();

      document.writeln(`<h2> ${data.nombreasignatura} <h2>`);

   });
});

function googleLogin() {
   const provider = new firebase.auth.GoogleAuthProvider();
   
   firebase.auth().signInWithPopup(provider)

      .then(result => {
         const user = result.user;
         document.write(`Hello ${user.displayName}`);
         console.log(user);
      })
}