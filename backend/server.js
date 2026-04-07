const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ems_db'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// API Routes
app.get('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM employees WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(results[0]);
  });
});

app.get('/api/employees', (req, res) => {
  const query = 'SELECT * FROM employees';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json(results);
  });
});

//Add new employee
app.post('/api/employees',(req,res) =>{
  const {name,email,phone,department,position,salary,hire_date,address}=req.body;
  const query='insert into employees (name,email,phone,department,position,salary,hire_date,address)  values (?,?,?,?,?,?,?,?)';
  db.query(query,[name,email,phone,department,position,salary,hire_date,address],(err,result) =>{
    if(err) {console.error('Database insert error:',err);
    return res.status(500).json({error:'data insertion failed',details: err.message});
    }
    res.status(201).json({
      success:true,
      message:'Employee added successfully',
     employeeId: result.insertId});
  })
})

// Attendance API endpoints
app.post('/api/attendance/mark', (req, res) => {
  const { employee_id, date, status, check_in_time, check_out_time, notes } = req.body;
  
  const query = 'INSERT INTO attendance (employee_id, date, status, check_in_time, check_out_time, notes) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status), check_in_time = VALUES(check_in_time), check_out_time = VALUES(check_out_time), notes = VALUES(notes)';
  
  db.query(query, [employee_id, date, status, check_in_time, check_out_time, notes], (err, results) => {
    if (err) {
      console.error('Attendance marking error:', err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    
    res.json({ 
      success: true, 
      message: 'Attendance marked successfully'
    });
  });
});

app.get('/api/attendance/today', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const query = `
    SELECT 
      e.id, e.name, e.department,
      a.status, a.check_in_time, a.check_out_time
    FROM employees e
    LEFT JOIN attendance a ON e.id = a.employee_id AND a.date = ?
    ORDER BY e.department, e.name
  `;
  
  db.query(query, [today], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json(results);
  });
});

app.get('/api/attendance/stats', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  
  const query = `
    SELECT 
      COUNT(*) as total_employees,
      COUNT(DISTINCT department) as total_departments,
      SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_today,
      SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent_today,
      SUM(CASE WHEN a.status IS NULL THEN 1 ELSE 0 END) as not_marked
    FROM employees e
    LEFT JOIN attendance a ON e.id = a.employee_id AND a.date = ?
  `;
  
  db.query(query, [today], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json(results[0]);
  });
});

app.get('/api/reports/attendance', (req, res) => {
  const { department, start_date, end_date } = req.query;
  
  let query = `
    SELECT 
      e.id, e.name, e.department,
      COUNT(a.id) as total_days,
      SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_days,
      SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent_days,
      SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as late_days,
      ROUND(
        (SUM(CASE WHEN a.status IN ('present', 'late', 'half_day') THEN 1 ELSE 0 END) * 100.0 / COUNT(a.id)), 2
      ) as attendance_percentage
    FROM employees e
    LEFT JOIN attendance a ON e.id = a.employee_id
  `;
  
  const params = [];
  
  if (start_date && end_date) {
    query += ' WHERE a.date BETWEEN ? AND ?';
    params.push(start_date, end_date);
  }
  
  if (department) {
    query += params.length > 0 ? ' AND e.department = ?' : ' WHERE e.department = ?';
    params.push(department);
  }
  
  query += ' GROUP BY e.id, e.name, e.department ORDER BY e.department, e.name';
  
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json(results);
  });
});

app.get('/api/reports/departments', (req, res) => {
  const query = `
    SELECT 
      department,
      COUNT(*) as employee_count,
      AVG(CASE WHEN a.status IN ('present', 'late', 'half_day') THEN 1 ELSE 0 END) * 100 as avg_attendance_rate
    FROM employees e
    LEFT JOIN attendance a ON e.id = a.employee_id AND a.date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    WHERE department IS NOT NULL
    GROUP BY department
    ORDER BY avg_attendance_rate DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json(results);
  });
});

// Admin Login Endpoint
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  // Check admin credentials from environment variables
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    res.json({ 
      success: true, 
      message: 'Admin login successful',
      admin: {
        username: process.env.ADMIN_USERNAME,
        email: process.env.ADMIN_EMAIL
      }
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid admin credentials' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});