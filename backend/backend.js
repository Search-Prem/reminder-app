const express = require('express');
const cors=require('cors');
const app = express();
const mysql = require('mysql2');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'sql.freedb.tech',
  user: 'freedb_reminderapp_user',
  password: 'j#??MXeVRNcTf46',
  database: 'freedb_remindersapp',
  port: 3306
});
db.connect((err)=>{
    if(err){
        console.log("Not Connected");
        return
    }
    console.log("Connected");
});
app.post('/add', (req, res) => {
  const { text, date, time } = req.body;
  const sql = 'INSERT INTO reminders (text, date, time) VALUES (?, ?, ?)';
  const values = [text, date, time];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Insert error:', err); // <- This will log exactly what went wrong
      return res.status(500).send('Server insert error');
    }
    console.log('Reminder added!');
    res.status(200).send('Added');
  });
});
app.get('/show',(req,res)=>{
    db.query(`select * from reminders`,(err,results)=>{
        if(err){
            console.log("Error fetching reminders:",err);
            res.status(500).send("Server error");
        }
        else{
            res.json(results);
        }
    });
});

app.put('/update/:id', (req, res) => {
  const id = req.params.id;
  const { text, date, time } = req.body;

  const sql = 'UPDATE reminders SET text = ?, date = ?, time = ? WHERE id = ?';
  const values = [text, date, time, id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Update error:', err);
      return res.status(500).send('Update failed');
    }
    res.status(200).send('Reminder updated');
  });
});

app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM reminders WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Delete error:', err);
      return res.status(500).send('Delete failed');
    }
    res.status(200).send('Reminder deleted');
  });
});
app.put('/toggle-status/:id', (req, res) => {
  const id = req.params.id;
  const sql = `
    UPDATE reminders 
    SET status = IF(status = 'Done', 'Pending', 'Done') 
    WHERE id = ?
  `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Status toggle error:', err);
      return res.status(500).send('Failed to toggle status');
    }
    res.status(200).send('Status updated');
  });
});

app.listen(3000,()=>{
    console.log("server running")
});
