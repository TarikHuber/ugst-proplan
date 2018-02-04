const functions = require('firebase-functions');
const admin = require('firebase-admin');
try {
  admin.initializeApp(functions.config().firebase);
} catch (e) {} // You do that because the admin SDK can only be initialized once.

exports = module.exports = functions.database
  .ref('/role_grants/{roleUid}/{grantUid}')
  .onWrite(event => {
    const roleUid = event.params.roleUid;
    const grantUid = event.params.grantUid;
    const eventSnapshot = event.data;

    const userRolesRef = admin.database().ref(`user_roles`);

    return userRolesRef.once('value').then(snapshot => {
      let promises = [];

      snapshot.forEach(userRoles => {
        const userUid = userRoles.key;
        const roles = userRoles.val();

        Object.keys(roles).forEach((key, index) => {
          if (key === roleUid) {
            let grantRef = false;

            console.log('User role changed:', eventSnapshot.val());

            if (eventSnapshot.val()) {
              grantRef = admin
                .database()
                .ref(`user_grants/${userUid}/${grantUid}`)
                .set(true)
                .then(() => {
                  console.log('Grant added:', grantUid);
                });
            } else {
              grantRef = admin
                .database()
                .ref(`user_grants/${userUid}/${grantUid}`)
                .remove()
                .then(() => {
                  console.log('Grant removed:', grantUid);
                });
            }

            promises.push(grantRef);

            console.log('Role changed', userUid, roleUid, grantUid);
          }
        });
      });

      return Promise.all(promises);
    });
  });
