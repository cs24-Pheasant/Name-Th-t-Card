const uuidv4 = require('uuid/v4');
const db = require('../util/postgres');

module.exports = {

  /* ============================================ User ============================================ */
  // Check if cookie for SSID is available in the req
  checkSSIDSession: (req, res, next) => {
    console.log('=============================================');
    console.log('You are in sessionController checkSSIDSession');
    console.log('*** req.cookies ***', req.cookies);
    console.log('*** res.locals***', res.locals);


    res.locals.user = {};

    if (req.cookies.ssid) {
      // start the response object
      console.log('cookie exists for user');

      // If a matching session exists, set loginStatus to 'success'
      db.one('SELECT user_id, ssid FROM sessions WHERE ssid = $1', [req.cookies.ssid])
        .then((session) => {
          console.log('*** session ***', session);
          if (req.cookies.ssid === session.ssid) {
            res.locals.user.id = session.user_id;
            console.log('session exists!');
            // res.status(200).json({ username: res.locals.user.user_id, loginSuccess: true, msg: 'login success' });
            res.locals.user.loginSuccess = true;
            console.log('res.locals ==>', res.locals);
            next();
          }
        })
        .catch((error) => {
          console.log('ERROR at check ssid session in sessioncontroller.js', error)
          res.status(500).send('SERVER ERROR');
        });
    } else {
      console.log('There is no cookie for user')
      //res.locals.data.id = null
      res.locals.data.loginSuccess = false;
      res.send(res.locals.data);
      return;
    }
  },

  // (req, res) => {
  //   res.status(200).json({ username: res.locals.user.username, loginSuccess: true, msg: 'login success' });
  // }

  createSession: (req, res, next) => {
    // console.log('==========================================');
    // console.log('You are in sessionController createSession');
    // console.log('*** req.body ***', req.body);

    // Send query to Postgres DB to add user to users
    // delete current session then create a new session
    db.none('DELETE FROM sessions WHERE user_id = $1', [res.locals.user.user_id])
      .then(() => {
        res.locals.ssid = uuidv4();
        return db.none('INSERT INTO sessions(user_id, ssid) VALUES ($1, $2)', [res.locals.user.user_id, res.locals.ssid])
      })
      .then(() => {
        console.log('*** res.locals ***', res.locals)
        next();
      })
      .catch(() => {
        res.status(500).send();
      })
  },

  deleteSession: (req, res, next) => {
    console.log('==========================================');
    console.log('You are in sessionController deleteSession');
    console.log('*** req.cookies ***', req.cookies);

    db.none('DELETE FROM sessions WHERE ssid = $1', [req.cookies.ssid]);
    return next();
  },

  /* ============================================ Admin ============================================ */

  checkAdminSession: (req, res, next) => {
    console.log('==============================================');
    console.log('You are in sessionController checkAdminSession');
    console.log('*** req.cookies line 84 ***', req.cookies);
    console.log('*** res.locals***', res.locals);

    res.locals.admin = {};

    if (req.cookies.admin) {
      console.log('cookie exists for admin');

      // If a matching session exists, set loginStatus to 'success'
      db.one('SELECT admin_id, ssid_sessions FROM admin_sessions WHERE ssid_sessions = $1', [req.cookies.admin])
        .then((session) => {
          console.log('*** session ***', session);
          if (req.cookies.admin === session.ssid_sessions) {
            res.locals.admin.id = session.admin_id;
            console.log('session exists!');

            res.locals.admin.loginSuccess = true;
            console.log('res.locals ==>', res.locals);
            next();
          }
        })
        .catch((error) => {
          console.log('ERROR at checkAdminSession in sessioncontroller.js', error)
          res.status(500).send('SERVER ERROR');
        });
    } else {
      console.log('There is no cookie for user')
      res.locals.admin.id = null
      res.locals.admin.loginSuccess = false
      next();
    }
  },

  createAdminSession: (req, res, next) => {
    console.log('===============================================');
    console.log('You are in sessionController createAdminSession');
    console.log('*** req.body ***', req.body);
    console.log('***res.locals in createAdminSession*****', res.locals);

    // Send query to Postgres DB to add user to users
    db.none('DELETE FROM admin_sessions WHERE admin_id = $1', [res.locals.admin.admin_id])
      .then(() => {
        console.log('***res.locals.admin.admin_id in createAdminSession*****', res.locals.admin.admin_id);

        res.locals.ssid_sessions = uuidv4();
        return db.none('INSERT INTO admin_sessions(admin_id, ssid_sessions) VALUES ($1, $2)', [res.locals.admin.admin_id, res.locals.ssid_sessions])
      })
      .then(() => {
        console.log('*** res.locals ***', res.locals)
        next();
      })
      .catch(() => {
        res.status(500).send();
      })
  },

  deleteAdminSession: (req, res, next) => {
    console.log('==========================================');
    console.log('You are in sessionController deleteAdminSession');
    console.log('*** req.cookies ***', req.cookies);

    db.none('DELETE FROM admin_sessions WHERE ssid_sessions = $1', [req.cookies.ssid_sessions]);
    next();
  },
};
