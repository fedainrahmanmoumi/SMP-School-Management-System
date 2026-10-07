const express=require('express');
const path=require('path');
const sqlite3=require('sqlite3').verbose();
const crypto=require('crypto');
const app=express();
const PORT=process.env.PORT||3000;
const db=new sqlite3.Database(path.join(__dirname,'school.db'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get('/api/health',(req,res)=>res.json({ok:true,service:'SMP International School Portal'}));

const run=(sql,p=[])=>new Promise((res,rej)=>db.run(sql,p,function(e){e?rej(e):res({id:this.lastID,changes:this.changes})}));
const all=(sql,p=[])=>new Promise((res,rej)=>db.all(sql,p,(e,r)=>e?rej(e):res(r)));
const get=(sql,p=[])=>new Promise((res,rej)=>db.get(sql,p,(e,r)=>e?rej(e):res(r)));
const clean=u=>{if(!u)return u;const x={...u};delete x.password;delete x.password_hash;return x};
const hashPassword=(password,salt=crypto.randomBytes(16).toString('hex'))=>({salt,hash:crypto.scryptSync(String(password),salt,64).toString('hex')});
const verifyPassword=(password,salt,hash)=>crypto.timingSafeEqual(Buffer.from(crypto.scryptSync(String(password),salt,64).toString('hex'),'hex'),Buffer.from(hash,'hex'));
const newToken=()=>crypto.randomBytes(32).toString('hex');

async function createUser(loginId,password,name,email,phone,role,grade='',section='',roll=0,subject='',address=''){
 const {salt,hash}=hashPassword(password);
 const r=await run(`INSERT INTO users(login_id,password,password_salt,password_hash,name,email,phone,role,grade,section,roll,subject,address,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,[loginId,hash,salt,hash,name,email,phone,role,grade,section,roll,subject,address,new Date().toISOString()]);
 return r.id;
}
async function init(){
 await run(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,login_id TEXT UNIQUE,password TEXT,password_salt TEXT,password_hash TEXT,name TEXT,email TEXT,phone TEXT,role TEXT,grade TEXT,section TEXT,roll INTEGER,subject TEXT,address TEXT,created_at TEXT)`);
 const cols=await all(`PRAGMA table_info(users)`); const names=cols.map(x=>x.name); if(!names.includes('password_salt')) await run('ALTER TABLE users ADD COLUMN password_salt TEXT'); if(!names.includes('password_hash')) await run('ALTER TABLE users ADD COLUMN password_hash TEXT');
 await run(`CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id INTEGER,expires_at TEXT,created_at TEXT)`);
 await run(`CREATE TABLE IF NOT EXISTS assignments(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,subject TEXT,grade TEXT,section TEXT,due_date TEXT,marks INTEGER,instructions TEXT,teacher_id INTEGER,created_at TEXT)`);
 await run(`CREATE TABLE IF NOT EXISTS submissions(id INTEGER PRIMARY KEY AUTOINCREMENT,assignment_id INTEGER,student_id INTEGER,status TEXT,submission_text TEXT,submitted_at TEXT,UNIQUE(assignment_id,student_id))`);
 await run(`CREATE TABLE IF NOT EXISTS attendance(id INTEGER PRIMARY KEY AUTOINCREMENT,student_id INTEGER,date TEXT,status TEXT,teacher_id INTEGER,UNIQUE(student_id,date))`);
 await run(`CREATE TABLE IF NOT EXISTS results(id INTEGER PRIMARY KEY AUTOINCREMENT,student_id INTEGER,subject TEXT,exam TEXT,cq INTEGER DEFAULT 0,mcq INTEGER DEFAULT 0,practical INTEGER DEFAULT 0,UNIQUE(student_id,subject,exam))`);
 await run(`CREATE TABLE IF NOT EXISTS notices(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,body TEXT,category TEXT,created_at TEXT)`);
 await run(`CREATE TABLE IF NOT EXISTS routine(id INTEGER PRIMARY KEY AUTOINCREMENT,grade TEXT,section TEXT,day TEXT,time TEXT,subject TEXT,teacher TEXT,room TEXT)`);
 await run(`CREATE TABLE IF NOT EXISTS fees(id INTEGER PRIMARY KEY AUTOINCREMENT,student_id INTEGER,invoice TEXT,month TEXT,amount INTEGER,due_date TEXT,status TEXT,paid_date TEXT)`);
 await run(`CREATE TABLE IF NOT EXISTS library(id INTEGER PRIMARY KEY AUTOINCREMENT,student_id INTEGER,book TEXT,accession TEXT,issue_date TEXT,due_date TEXT,status TEXT)`);
 await run(`CREATE TABLE IF NOT EXISTS exams(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,subject TEXT,grade TEXT,section TEXT,exam_date TEXT,start_time TEXT,end_time TEXT,room TEXT)`);
 await run(`CREATE TABLE IF NOT EXISTS calendar(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT,event_date TEXT,category TEXT,description TEXT)`);
 const count=await get('SELECT COUNT(*) c FROM users');
 if(!count.c){
  const sid=await createUser('SMP-0817','1234','Ayaan Siddique','ayaan@smp.edu.bd','01700000001','student','8','B',17,'','Dhanmondi, Dhaka');
  await createUser('SMP-0818','1234','Sara Ahmed','sara@smp.edu.bd','01700000002','student','8','B',18,'','Green Road, Dhaka');
  const tid=await createUser('T-104','1234','Ms. Nabila Akter','nabila@smp.edu.bd','01700000104','teacher','','',0,'English','Dhaka');
  await createUser('ADMIN','admin123','School Administrator','admin@smp.edu.bd','01700000999','admin','','',0,'','SMP Campus');
  const now=new Date().toISOString();
  await run(`INSERT INTO assignments(title,subject,grade,section,due_date,marks,instructions,teacher_id,created_at) VALUES(?,?,?,?,?,?,?,?,?)`,['Solar System Model','Science','8','B','2026-10-05',20,'Create a labelled 3D model and a one-page explanation.',tid,now]);
  for(const n of [['Mid-Term Examination Routine','The mid-term examination routine has been published.','Academic'],['Parent–Teacher Meeting','Parent–Teacher meeting will be held on campus.','General']])await run(`INSERT INTO notices(title,body,category,created_at) VALUES(?,?,?,?)`,[...n,now]);
  for(const [s,c,m,p] of [['Mathematics',55,18,19],['English',51,17,17],['Science',52,18,19],['ICT',56,19,20]])await run(`INSERT INTO results(student_id,subject,exam,cq,mcq,practical) VALUES(?,?,?,?,?,?)`,[sid,s,'Mid-Term 2026',c,m,p]);
  for(const [day,time,sub,teacher,room] of [['Sunday','08:00–08:45','Mathematics','Mr. Rahman','201'],['Sunday','08:50–09:35','English','Ms. Nabila','202'],['Monday','08:00–08:45','Science','Mr. Hasan','Lab 1'],['Monday','08:50–09:35','ICT','Ms. Farzana','ICT Lab'],['Tuesday','08:00–08:45','Bangla','Ms. Jahan','203'],['Tuesday','08:50–09:35','English','Ms. Nabila','202']])await run(`INSERT INTO routine(grade,section,day,time,subject,teacher,room) VALUES(?,?,?,?,?,?,?)`,['8','B',day,time,sub,teacher,room]);
  await run(`INSERT INTO fees(student_id,invoice,month,amount,due_date,status) VALUES(?,?,?,?,?,?)`,[sid,'#SMP09026','September',5500,'2026-09-10','Paid']);
  await run(`INSERT INTO fees(student_id,invoice,month,amount,due_date,status) VALUES(?,?,?,?,?,?)`,[sid,'#SMP10026','October',5500,'2026-10-10','Due']);
  await run(`INSERT INTO library(student_id,book,accession,issue_date,due_date,status) VALUES(?,?,?,?,?,?)`,[sid,'English Grammar in Use','ENG-1024','2026-09-20','2026-10-05','Issued']);
  await run(`INSERT INTO library(student_id,book,accession,issue_date,due_date,status) VALUES(?,?,?,?,?,?)`,[sid,'General Science 8','SCI-0818','2026-09-22','2026-10-08','Issued']);
  await run(`INSERT INTO exams(title,subject,grade,section,exam_date,start_time,end_time,room) VALUES(?,?,?,?,?,?,?,?)`,['Mid-Term Examination','Mathematics','8','B','2026-10-18','10:00','12:00','Hall A']);
  await run(`INSERT INTO exams(title,subject,grade,section,exam_date,start_time,end_time,room) VALUES(?,?,?,?,?,?,?,?)`,['Mid-Term Examination','English','8','B','2026-10-20','10:00','12:00','Hall A']);
  await run(`INSERT INTO calendar(title,event_date,category,description) VALUES(?,?,?,?)`,['Mid-Term Examination','2026-10-18','Examination','Mid-term examination week begins.']);
 }
}

function cookieToken(req){const m=(req.headers.cookie||'').match(/(?:^|; )smp_session=([^;]+)/);return m?decodeURIComponent(m[1]):null;}
async function auth(req,res,next){try{const token=cookieToken(req);if(!token)return res.status(401).json({error:'Authentication required'});const s=await get('SELECT * FROM sessions WHERE token=? AND expires_at>?',[token,new Date().toISOString()]);if(!s)return res.status(401).json({error:'Session expired. Please login again.'});const u=await get('SELECT * FROM users WHERE id=?',[s.user_id]);if(!u)return res.status(401).json({error:'User not found'});req.user=clean(u);next()}catch(e){res.status(500).json({error:e.message})}}
function roles(...roles){return (req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({error:'You do not have permission for this action.'})}
function sameUser(req,res,id){return Number(id)===Number(req.user.id)}

app.post('/api/login',async(req,res)=>{try{const {loginId,password,role}=req.body;const u=await get('SELECT * FROM users WHERE login_id=? AND role=?',[String(loginId||'').trim(),role]);if(!u)return res.status(401).json({error:'Invalid ID, password or role'});let ok=false;let legacyOk=false;if(u.password_hash&&u.password_salt)ok=verifyPassword(password,u.password_salt,u.password_hash);else if(u.password)legacyOk=crypto.createHash('sha256').update(String(password)).digest('hex')===u.password;ok=ok||legacyOk;if(!ok)return res.status(401).json({error:'Invalid ID, password or role'});if(legacyOk){const hp=hashPassword(password);await run('UPDATE users SET password_salt=?,password_hash=?,password=NULL WHERE id=?',[hp.salt,hp.hash,u.id]);u.password_hash=hp.hash;u.password_salt=hp.salt;}const token=newToken();const expires=new Date(Date.now()+8*60*60*1000).toISOString();await run('INSERT INTO sessions(token,user_id,expires_at,created_at) VALUES(?,?,?,?)',[token,u.id,expires,new Date().toISOString()]);res.setHeader('Set-Cookie',`smp_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=28800`);res.json(clean(u))}catch(e){res.status(500).json({error:e.message})}});
app.post('/api/logout',async(req,res)=>{const token=cookieToken(req);if(token)await run('DELETE FROM sessions WHERE token=?',[token]);res.setHeader('Set-Cookie','smp_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0');res.json({ok:true})});
app.get('/api/me',auth,async(req,res)=>res.json(req.user));
app.post('/api/register',async(req,res)=>{try{const r=req.body;const role=r.role==='teacher'?'teacher':'student';if(!r.name||!r.loginId||!r.password)return res.status(400).json({error:'Name, ID and password are required'});const exists=await get('SELECT id FROM users WHERE login_id=?',[r.loginId.trim()]);if(exists)return res.status(409).json({error:'This ID is already registered'});const grade=role==='student'?(r.grade||'8'):'';const section=role==='student'?(r.section||'B'):'';const subject=role==='teacher'?(r.subject||'General'):'';const id=await createUser(r.loginId.trim(),r.password,r.name.trim(),r.email||'',r.phone||'',role,grade,section,Number(r.roll)||0,subject,r.address||'');const u=await get('SELECT * FROM users WHERE id=?',[id]);const token=newToken();await run('INSERT INTO sessions(token,user_id,expires_at,created_at) VALUES(?,?,?,?)',[token,id,new Date(Date.now()+8*60*60*1000).toISOString(),new Date().toISOString()]);res.setHeader('Set-Cookie',`smp_session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=28800`);res.json({ok:true,user:clean(u)})}catch(e){res.status(400).json({error:e.message})}});

app.get('/api/student/:id/assignments',auth,roles('student'),async(req,res)=>{if(!sameUser(req,res,req.params.id))return res.status(403).json({error:'Forbidden'});const u=await get('SELECT * FROM users WHERE id=?',[req.params.id]);res.json(await all(`SELECT a.*,COALESCE(s.status,'Pending') status,s.submitted_at,s.submission_text FROM assignments a LEFT JOIN submissions s ON s.assignment_id=a.id AND s.student_id=? WHERE a.grade=? AND a.section=? ORDER BY a.id DESC`,[u.id,u.grade,u.section]))});
app.post('/api/assignments/:id/submit',auth,roles('student'),async(req,res)=>{try{const a=await get('SELECT * FROM assignments WHERE id=?',[req.params.id]);if(!a)return res.status(404).json({error:'Assignment not found'});await run(`INSERT INTO submissions(assignment_id,student_id,status,submission_text,submitted_at) VALUES(?,?,?,?,?) ON CONFLICT(assignment_id,student_id) DO UPDATE SET status=excluded.status,submission_text=excluded.submission_text,submitted_at=excluded.submitted_at`,[a.id,req.user.id,'Submitted',req.body.text||'',new Date().toISOString()]);res.json({ok:true})}catch(e){res.status(500).json({error:e.message})}});
app.post('/api/teacher/assignments',auth,roles('teacher','admin'),async(req,res)=>{try{const r=req.body;if(!r.title||!r.grade||!r.section)return res.status(400).json({error:'Assignment title, class and section are required'});const teacherId=req.user.role==='teacher'?req.user.id:(r.teacherId||req.user.id);const x=await run(`INSERT INTO assignments(title,subject,grade,section,due_date,marks,instructions,teacher_id,created_at) VALUES(?,?,?,?,?,?,?,?,?)`,[r.title,r.subject||'English',r.grade,r.section,r.dueDate,r.marks||20,r.instructions||'',teacherId,new Date().toISOString()]);res.json({ok:true,id:x.id})}catch(e){res.status(400).json({error:e.message})}});
app.get('/api/notices',auth,async(req,res)=>res.json(await all('SELECT * FROM notices ORDER BY id DESC')));
app.post('/api/notices',auth,roles('admin','teacher'),async(req,res)=>{try{const r=req.body;if(!r.title)return res.status(400).json({error:'Title is required'});const x=await run(`INSERT INTO notices(title,body,category,created_at) VALUES(?,?,?,?)`,[r.title,r.body||'',r.category||'General',new Date().toISOString()]);res.json({ok:true,id:x.id})}catch(e){res.status(400).json({error:e.message})}});
app.delete('/api/notices/:id',auth,roles('admin'),async(req,res)=>{await run('DELETE FROM notices WHERE id=?',[req.params.id]);res.json({ok:true})});
app.get('/api/student/:id/results',auth,roles('student'),async(req,res)=>{if(!sameUser(req,res,req.params.id))return res.status(403).json({error:'Forbidden'});res.json(await all('SELECT * FROM results WHERE student_id=? ORDER BY id DESC',[req.params.id]))});
app.post('/api/teacher/results',auth,roles('teacher','admin'),async(req,res)=>{try{const r=req.body;await run(`INSERT INTO results(student_id,subject,exam,cq,mcq,practical) VALUES(?,?,?,?,?,?) ON CONFLICT(student_id,subject,exam) DO UPDATE SET cq=excluded.cq,mcq=excluded.mcq,practical=excluded.practical`,[r.studentId,r.subject,r.exam,r.cq||0,r.mcq||0,r.practical||0]);res.json({ok:true})}catch(e){res.status(400).json({error:e.message})}});
app.post('/api/teacher/attendance',auth,roles('teacher','admin'),async(req,res)=>{try{for(const x of req.body.records||[])await run(`INSERT INTO attendance(student_id,date,status,teacher_id) VALUES(?,?,?,?) ON CONFLICT(student_id,date) DO UPDATE SET status=excluded.status,teacher_id=excluded.teacher_id`,[x.studentId,req.body.date,x.status,req.user.id]);res.json({ok:true})}catch(e){res.status(400).json({error:e.message})}});
app.get('/api/student/:id/attendance',auth,roles('student'),async(req,res)=>{if(!sameUser(req,res,req.params.id))return res.status(403).json({error:'Forbidden'});const rows=await all('SELECT status,COUNT(*) count FROM attendance WHERE student_id=? GROUP BY status',[req.params.id]);const total=rows.reduce((a,x)=>a+x.count,0);const present=(rows.find(x=>x.status==='Present')||{count:0}).count;res.json({summary:rows,percentage:total?Math.round(present/total*100):0,records:await all(`SELECT date,status FROM attendance WHERE student_id=? ORDER BY date DESC LIMIT 60`,[req.params.id])})});
app.get('/api/students',auth,roles('teacher','admin'),async(req,res)=>res.json(await all(`SELECT id,login_id,name,email,phone,grade,section,roll,subject,address FROM users WHERE role='student' ORDER BY grade,section,roll`)));
app.get('/api/teachers',auth,roles('admin'),async(req,res)=>res.json(await all(`SELECT id,login_id,name,email,phone,subject FROM users WHERE role='teacher' ORDER BY name`)));
app.get('/api/teacher/assignments',auth,roles('teacher','admin'),async(req,res)=>res.json(await all(`SELECT a.*,COUNT(s.id) submitted FROM assignments a LEFT JOIN submissions s ON s.assignment_id=a.id WHERE a.teacher_id=? OR ?='admin' GROUP BY a.id ORDER BY a.id DESC`,[req.user.id,req.user.role])));
app.get('/api/routine/:id',auth,roles('student'),async(req,res)=>{if(!sameUser(req,res,req.params.id))return res.status(403).json({error:'Forbidden'});const u=await get('SELECT grade,section FROM users WHERE id=?',[req.params.id]);res.json(await all('SELECT * FROM routine WHERE grade=? AND section=? ORDER BY CASE day WHEN "Sunday" THEN 1 WHEN "Monday" THEN 2 WHEN "Tuesday" THEN 3 WHEN "Wednesday" THEN 4 WHEN "Thursday" THEN 5 ELSE 6 END,time',[u.grade,u.section]))});
for(const [name,table] of [['fees','fees'],['library','library']])app.get(`/api/${name}/:id`,auth,roles('student'),async(req,res)=>{if(!sameUser(req,res,req.params.id))return res.status(403).json({error:'Forbidden'});res.json(await all(`SELECT * FROM ${table} WHERE student_id=? ORDER BY id DESC`,[req.params.id]))});
app.get('/api/exams/:id',auth,roles('student'),async(req,res)=>{if(!sameUser(req,res,req.params.id))return res.status(403).json({error:'Forbidden'});const u=await get('SELECT grade,section FROM users WHERE id=?',[req.params.id]);res.json(await all('SELECT * FROM exams WHERE grade=? AND section=? ORDER BY exam_date',[u.grade,u.section]))});
app.get('/api/calendar',auth,async(req,res)=>res.json(await all('SELECT * FROM calendar ORDER BY event_date')));
app.get('/api/stats',auth,roles('admin'),async(req,res)=>{const [s,t,a,n]=await Promise.all([get("SELECT COUNT(*) c FROM users WHERE role='student'"),get("SELECT COUNT(*) c FROM users WHERE role='teacher'"),get('SELECT COUNT(*) c FROM assignments'),get('SELECT COUNT(*) c FROM notices')]);res.json({students:s.c,teachers:t.c,assignments:a.c,notices:n.c})});

// Protect portal pages at the server level. Unauthenticated users are redirected to login.
async function pageAuth(req,res,next){try{const token=cookieToken(req);if(!token)return res.redirect('/login.html');const s=await get('SELECT * FROM sessions WHERE token=? AND expires_at>?',[token,new Date().toISOString()]);if(!s)return res.redirect('/login.html');const u=await get('SELECT role FROM users WHERE id=?',[s.user_id]);if(!u)return res.redirect('/login.html');const expected=req.path==='/student-dashboard.html'?'student':req.path==='/teacher-dashboard.html'?'teacher':'admin';if(u.role!==expected)return res.redirect(u.role==='student'?'/student-dashboard.html':u.role==='teacher'?'/teacher-dashboard.html':'/admin.html');req.userId=s.user_id;next()}catch(e){res.redirect('/login.html')}}
app.use((req,res,next)=>{const protectedPages=['/student-dashboard.html','/teacher-dashboard.html','/admin.html'];if(!protectedPages.includes(req.path))return next();pageAuth(req,res,next)});
app.use(express.static(__dirname));

init().then(()=>app.listen(PORT,()=>console.log(`SMP International School running at http://localhost:${PORT}`))).catch(e=>{console.error(e);process.exit(1)});
