const express = require("express");
const app = express();
const cors = require("cors");
mysql = require("mysql")
const bodyParser = require("body-parser");
const { json } = require("express/lib/response");
const { exec } = require("child_process");


app.use(cors());
app.use(bodyParser.json());

db = mysql.createConnection({
    host: 'torresapidb.mysql.database.azure.com',
    user: 'superadmin@torresapidb',
    password: 'ESTApsRIFA!2020',
    database: 'sql3479609'
  });

app.listen(80, () => {
    console.log("running on 80")
});

app.get('/api/test', function(req, res) {
        res.send({ status: 'ok'});
});

app.post('/api/users/login', function(req, res) {
    console.log(req.body)
    const email = req.body.email;
    const password =  req.body.password;

    try{
        sql = `select * from users where email = '${email}' and password = '${password}'`;
        db.query(sql, (err, data, fields) => {
            if (err) throw err;
            console.log(data)
            if(data.length > 0 ) {
                res.json({ data: data[0] });
            } else {
                res.send({ error: 'Invalid email or password'})
            }
        })
    }
    catch(err) {
        res.send(err).status(500);
    }
});

app.post('/api/users', function(req, res) {
    try{
        const body = req.body;
        const sql = `insert into users(firstName, lastName, email, password, height, dob, gender, weight, goalWeight)
        values('${body.firstName}', '${body.lastName}', '${body.email}', '${body.password}', ${body.height}, '${body.dob}', '${body.gender}', ${body.weight}, ${body.goalWeight})`
        db.query(sql, (err, data, fields) => {
            if (err) throw err;
            res.send({ ok: 'Inserted'})
        })
    }
    catch(err) {
        res.send(err).status(500);
    }

})

app.get('/api/users/:id', function(req, res) {
    try{
        const sql = `select * from users where id = ${req.params.id}`;
        db.query(sql, (err, data, fields) => {
            if (err) throw err;
            if(data.length > 0 ) {
                res.json({ status: 200, data: data[0] });
            } else {
                res.send({ error: 'User not found'})
            }
        })
    }
    catch(err) {
        res.send(err).status(500);
    }
});

app.patch('/api/users/:id/goalWeight', function(req, res) {
    const goalWeight = req.body.goalWeight;
    try{
        const sql = `update users set goalWeight = ${goalWeight} where id = ${req.params.id}`;
        db.query(sql, (err, data, fields) => {
            if(data.affectedRows > 0) {
                return res.send({ ok: 'Stats updated'});
            } else {
                res.send({ error: 'User not found'})
            }
        })
    } catch (err) {
        res.send({error: err}).status(500);
    }
});

app.patch('/api/users/:id/today', function(req, res) {
    try{
        const weight = req.body.weight;
        const height = req.body.height;
        const sql = `update users set weight = ${weight}, height = ${height} where id = ${req.params.id}`;
        db.query(sql, (err, data, fields) => {
            if (err) throw err;
            if(data.affectedRows > 0 ) {
                const date = new Date();
                const newsql = `insert into user_stats(userId, weight, height, creationDate) values(${req.params.id}, ${weight}, ${height}, '${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}')`
                db.query(newsql, (err, data, fields) => {
                    if (err) throw err;
                    if(data.affectedRows > 0 ) {
                        res.send({ ok: 'Stats updated'});
                    } else {
                        res.send({ error: 'ERROR TODAY'})
                    }
                })
                //
            } else {
                //
            }
        })
    }
    catch(err) {
        res.send(err).status(500);
    }
});

app.get('/api/restart', function(req, res) {
        exec('forever restart 0', (err, stdout, stderror) => {
                if(err) {
                        return;
                }
                res.send({ ok: 'restarted' });
        })
});

app.get('/api/users/:id/stats', function(req, res) {
    try{
        const sql = `select * from user_stats where userId = ${req.params.id}`;
        db.query(sql, (err, data, fields) => {
            if (err) throw err;
            if(data.length > 0 ) {
                res.json({ data });
            } else {
                res.send({ error: 'User not found'})
            }
        })
    }
    catch(err) {
        res.send(err).status(500);
    }
});

app.get('/api/recipes', function (req, res) {
    try{
        const sql = 'select * from recipes';
        db.query(sql, (err, data, fields) => {
            if (err) throw err;
            res.json({
                data
            })
        })
    }
    catch(err) {
        res.send(err).status(500);
    }
});

  app.get('/api/exercises', function (req, res) {
    try{
        const sql = 'select * from exercises';
        db.query(sql, (err, data, fields) => {
            if (err) throw err;
            res.json({
                data
            })
        })
    }
    catch(err) {
        res.send(err).status(500);
    }
});